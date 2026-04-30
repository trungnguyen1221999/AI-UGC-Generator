import ai from "../../config/ai.js";
import { VIDEO_MODEL } from "../../constants/ai.constants.js";
import {
  uploadBufferToCloudinary,
  fetchImageAsBase64,
} from "../../utils/image.utils.js";
import mergeBuffers from "../../utils/mergeBuffers.utils.js";
import { getProductUsageInstruction } from "../../utils/productAiUsageInstruction.utils.js";

const pollOperation = async (operation: any) => {
  const MAX_WAIT = 240_000; // Increased to 4m for safety
  const startTime = Date.now();
  let currentOp = operation;

  while (!currentOp.done) {
    if (Date.now() - startTime > MAX_WAIT)
      throw new Error("AI Operation timed out");
    await new Promise((r) => setTimeout(r, 5000));
    currentOp = await ai.operations.getVideosOperation({
      operation: currentOp,
    });
  }

  if (currentOp.error)
    throw new Error(currentOp.error.message || "AI Operation failed");
  return currentOp;
};

const fetchVideoBuffer = async (videoUri: string) => {
  const videoUrl = new URL(videoUri);
  videoUrl.searchParams.append("key", process.env.GOOGLE_CLOUD_API_KEY!);
  const response = await fetch(videoUrl.toString());
  if (!response.ok) throw new Error("Failed to fetch video buffer from Google");
  return Buffer.from(await response.arrayBuffer());
};

export const generateProductVideo = async (
  productName: string,
  productDescription: string,
  generatedImageUrl: string,
  aspectRatio: string,
  userPrompt?: string,
  resolution?: string,
): Promise<string> => {
  if (!process.env.GOOGLE_CLOUD_API_KEY)
    throw new Error("Missing GOOGLE_CLOUD_API_KEY");

  const usageInstruction = getProductUsageInstruction(
    productName,
    productDescription,
  );
  const promptText = `UGC product video. ${productName}. ${usageInstruction}. ${userPrompt || ""}`;

  // --- STEP 1: Generate 8s Video ---
  let imageBase64 = await fetchImageAsBase64(generatedImageUrl);
  imageBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  console.log("Step 1: Generating initial 8s clip...");
  let op1 = await ai.models.generateVideos({
    model: VIDEO_MODEL,
    prompt: promptText,
    image: { imageBytes: imageBase64, mimeType: "image/png" },
    config: {
      resolution: resolution || "720p",
      aspectRatio: aspectRatio || "9:16",
    },
  });

  op1 = await pollOperation(op1);
  const firstVideoBuffer = await fetchVideoBuffer(
    op1.response.generatedVideos[0].video.uri,
  );

  // --- STEP 2: Extend (+7s) ---
  console.log("Step 2: Extending video...");

  // Clean payload to avoid "encoding isn't supported" error
  const extendPayload = {
    model: VIDEO_MODEL,
    prompt: promptText,
    video: {
      videoBytes: firstVideoBuffer.toString("base64"),
      mimeType: "video/mp4",
    },
    config: {
      numberOfVideos: 1,
      resolution: resolution || "720p",
      aspectRatio: aspectRatio || "9:16",
    },
  };

  let op2 = await ai.models.generateVideos(extendPayload);
  op2 = await pollOperation(op2);
  const secondVideoBuffer = await fetchVideoBuffer(
    op2.response.generatedVideos[0].video.uri,
  );

  // --- STEP 3: Merge Buffers ---
  console.log("Step 3: Merging clips to 15s...");
  const combinedBuffer = await mergeBuffers(
    firstVideoBuffer,
    secondVideoBuffer,
  );

  // --- STEP 4: Final Upload ---
  console.log("Step 4: Uploading final 15s video...");
  return await uploadBufferToCloudinary(combinedBuffer, "video");
};
