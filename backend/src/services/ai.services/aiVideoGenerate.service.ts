import ai from "../../config/ai.js";
import { VIDEO_MODEL } from "../../constants/ai.constants.js";
import {
  uploadBufferToCloudinary,
  fetchImageAsBase64,
} from "../../utils/image.utils.js";
import mergeBuffers from "../../utils/mergeBuffers.utils.js";
import { getProductUsageInstruction } from "../../utils/productAiUsageInstruction.utils.js";

/**
 * Helper: Polls the AI operation until completion or timeout
 */
const pollOperation = async (operation: any) => {
  const MAX_WAIT = 180_000; // 3-minute timeout per step
  const startTime = Date.now();
  let currentOp = operation;

  while (!currentOp.done) {
    if (Date.now() - startTime > MAX_WAIT) {
      throw new Error("AI Operation timed out");
    }
    // Wait 5 seconds before next poll
    await new Promise((r) => setTimeout(r, 5000));
    currentOp = await ai.operations.getVideosOperation({
      operation: currentOp,
    });
  }

  if (currentOp.error) {
    throw new Error(currentOp.error.message || "AI Operation failed");
  }
  return currentOp;
};

/**
 * Helper: Fetches the video file from Google's temporary URI and returns a Buffer
 */
const fetchVideoBuffer = async (videoUri: string) => {
  const videoUrl = new URL(videoUri);
  videoUrl.searchParams.append("key", process.env.GOOGLE_CLOUD_API_KEY!);
  const response = await fetch(videoUrl.toString());
  if (!response.ok) throw new Error("Failed to fetch video buffer from Google");
  return Buffer.from(await response.arrayBuffer());
};

/**
 * Generate Product Video: Creates an 8s video then extends it by 7s (Total ~15s)
 */
export const generateProductVideo = async (
  productName: string,
  productDescription: string,
  generatedImageUrl: string,
  aspectRatio: string,
  //targetLength: number,
  userPrompt?: string,
  resolution?: string,
): Promise<string> => {
  // 1. Environment Safety Check
  if (!process.env.GOOGLE_CLOUD_API_KEY) {
    throw new Error("Missing GOOGLE_CLOUD_API_KEY");
  }

  // 2. Prepare AI Instructions
  const usageInstruction = getProductUsageInstruction(
    productName,
    productDescription,
  );
  const promptText = `
You are a professional e-commerce UGC video creator.
Product interaction rules: ${usageInstruction}
Your task: Generate a high-quality product video.
Requirements:
- Ensure consistent product appearance and realistic movement
- Aspect ratio: ${aspectRatio}
Product: ${productName}. Description: ${productDescription}
${userPrompt ? `User extra instructions: ${userPrompt}` : ""}
`;

  // 3. Convert input image to Base64
  let imageBase64 = await fetchImageAsBase64(generatedImageUrl);
  imageBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  // 4. STEP 1: Generate the initial 8-second video from the image
  console.log("Starting Step 1: Generating initial 8s video...");
  let operation = await ai.models.generateVideos({
    model: VIDEO_MODEL,
    prompt: promptText,
    image: { imageBytes: imageBase64, mimeType: "image/png" },
    config: {
      numberOfVideos: 1,
      resolution: resolution || "720p",
      aspectRatio: aspectRatio || "9:16",
    },
  });

  operation = await pollOperation(operation);
  const firstVideoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!firstVideoUri) throw new Error("Step 1 failed: No video URI returned");

  // Download the 8s video buffer to use as input for extension
  const firstVideoBuffer = await fetchVideoBuffer(firstVideoUri);

  // 5. STEP 2: Extend the video by another 7 seconds (Total ~15s)
  console.log("Starting Step 2: Extending video by 7s...");
  let extendOp = await ai.models.generateVideos({
    model: VIDEO_MODEL,
    prompt: promptText,
    // Note: Passing the video buffer instead of the image to trigger extension
    video: {
      videoBytes: firstVideoBuffer.toString("base64"),
      mimeType: "video/mp4",
    },
    config: {
      numberOfVideos: 1,
      resolution: resolution || "720p",
      aspectRatio: aspectRatio || "9:16",
    },
  });

  extendOp = await pollOperation(extendOp);
  const finalVideoUri = extendOp.response?.generatedVideos?.[0]?.video?.uri;
  if (!finalVideoUri)
    throw new Error("Step 2 failed: No extended video URI returned");
  const finalVideoBuffer = await fetchVideoBuffer(finalVideoUri);

  // 6. Merge 2 videos STEP
  const combinedBuffer = await mergeBuffers(firstVideoBuffer, finalVideoBuffer);

  console.log("Generation complete. Uploading 15s video to Cloudinary...");
  return await uploadBufferToCloudinary(combinedBuffer, "video");
};
