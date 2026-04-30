import ai from "../../config/ai.js";
import { VIDEO_MODEL } from "../../constants/ai.constants.js";
import {
  uploadBufferToCloudinary,
  fetchImageAsBase64,
} from "../../utils/image.utils.js";
import { getProductUsageInstruction } from "../../utils/productAiUsageInstruction.utils.js";

// ─── Generate Product Video ────────────────────────────────────────────────
export const generateProductVideo = async (
  productName: string,
  productDescription: string,
  generatedImageUrl: string,
  aspectRatio: string,
  targetLength: number,
  userPrompt?: string,
  resolution?: string,
): Promise<string> => {
  // ── 1. Safety check env ─────────────────────────────────────────────────
  if (!process.env.GOOGLE_CLOUD_API_KEY) {
    throw new Error("Missing GOOGLE_CLOUD_API_KEY");
  }

  // ── 2. Get product behavior rules ───────────────────────────────────────
  const usageInstruction = getProductUsageInstruction(
    productName,
    productDescription,
  );

  // ── 3. Build prompt (clean + no duplicate instructions) ────────────────
  const promptText = `
You are a professional e-commerce UGC video creator.

Product interaction rules:
${usageInstruction}

Your task:
Generate a short UGC-style product video.

Requirements:
- Keep product position and interaction consistent with input image
- Natural human movement and interaction (non-robotic)
- Maintain lighting and realism from image
- Not cinematic, not ad-heavy
- Aspect ratio: ${aspectRatio}
- Duration: ~${targetLength} seconds

Product:
Name: ${productName}
Description: ${productDescription}

${userPrompt ? `User extra instructions: ${userPrompt}` : ""}
`;

  // ── 4. Convert image ────────────────────────────────────────────────────
  let imageBase64 = await fetchImageAsBase64(generatedImageUrl);

  // remove possible prefix (safe for all cases)
  imageBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  // ── 5. Call AI video generation ─────────────────────────────────────────
  let operation = await ai.models.generateVideos({
    model: VIDEO_MODEL,
    prompt: promptText,
    image: {
      imageBytes: imageBase64,
      mimeType: "image/png",
    },
    config: {
      numberOfVideos: 1,
      resolution: resolution || "720p",
      aspectRatio: aspectRatio || "9:16",
    },
  });

  // ── 6. Polling with timeout ─────────────────────────────────────────────
  const MAX_WAIT = 180_000;
  const startTime = Date.now();

  while (!operation.done) {
    if (Date.now() - startTime > MAX_WAIT) {
      throw new Error("Video generation timed out after 3 minutes");
    }

    await new Promise((r) => setTimeout(r, 5000));

    operation = await ai.operations.getVideosOperation({
      operation,
    });
  }

  // ── 7. Handle error safely ──────────────────────────────────────────────
  if (operation.error) {
    const err = operation.error as { message?: unknown };

    throw new Error(
      typeof err.message === "string" ? err.message : "Video generation failed",
    );
  }

  // ── 8. Extract video URL ────────────────────────────────────────────────
  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;

  if (!videoUri) {
    throw new Error(`${VIDEO_MODEL} did not return a video URI`);
  }

  // ── 9. Fetch video from Google ──────────────────────────────────────────
  const videoUrl = new URL(videoUri);
  videoUrl.searchParams.append("key", process.env.GOOGLE_CLOUD_API_KEY);

  const videoResponse = await fetch(videoUrl.toString());

  if (!videoResponse.ok) {
    throw new Error(`Failed to fetch generated video from ${VIDEO_MODEL}`);
  }

  // ── 10. Convert to buffer ───────────────────────────────────────────────
  const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

  // ── 11. Upload to Cloudinary ────────────────────────────────────────────
  return await uploadBufferToCloudinary(videoBuffer, "video");
};
