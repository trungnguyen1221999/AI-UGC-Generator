// generateProductVideo.ts
// Flow: image → 8s clip → extract last frame → 8s clip → merge = ~15s video

import ai from "../../config/ai.js";
import { VIDEO_MODEL } from "../../constants/ai.constants.js";
import extractLastFrame from "../../utils/extractLastFrame.utils.js";
import {
  uploadBufferToCloudinary,
  fetchImageAsBase64,
} from "../../utils/image.utils.js";
import mergeBuffers from "../../utils/mergeBuffers.utils.js";
import { getProductUsageInstruction } from "../../utils/productAiUsageInstruction.utils.js";

// Poll cho đến khi operation hoàn thành (hoặc timeout)
const pollOperation = async (operation: any) => {
  const MAX_WAIT = 240_000; // 4 phút
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

// Tải video từ Google về dưới dạng Buffer
const fetchVideoBuffer = async (videoUri: string): Promise<Buffer> => {
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

  const videoConfig = {
    numberOfVideos: 1,
    resolution: resolution || "720p",
    aspectRatio: aspectRatio || "9:16",
  };

  // --- STEP 1: Generate clip đầu từ product image ---
  console.log("Step 1: Generating initial 8s clip from image...");
  let imageBase64 = await fetchImageAsBase64(generatedImageUrl);
  imageBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  let op1 = await ai.models.generateVideos({
    model: VIDEO_MODEL,
    prompt: promptText,
    image: { imageBytes: imageBase64, mimeType: "image/png" },
    config: videoConfig,
  });
  op1 = await pollOperation(op1);
  const firstVideoBuffer = await fetchVideoBuffer(
    op1.response.generatedVideos[0].video.uri,
  );
  console.log("Step 1 done. Clip 1 size:", firstVideoBuffer.length, "bytes");

  // --- STEP 2: Extract frame cuối của clip 1 ---
  // Veo không hỗ trợ video-to-video, cần dùng last frame làm seed image
  console.log("Step 2: Extracting last frame from clip 1...");
  const lastFrameBase64 = await extractLastFrame(firstVideoBuffer);
  console.log("Step 2 done. Last frame extracted.");

  // --- STEP 3: Generate clip 2 từ last frame ---
  // Prompt continuity: thêm "continue" để Veo hiểu đây là nối tiếp
  const continuePrompt = `${promptText} Continue the motion seamlessly.`;
  console.log("Step 3: Generating continuation clip from last frame...");

  let op2 = await ai.models.generateVideos({
    model: VIDEO_MODEL,
    prompt: continuePrompt,
    image: { imageBytes: lastFrameBase64, mimeType: "image/png" },
    config: videoConfig,
  });
  op2 = await pollOperation(op2);
  const secondVideoBuffer = await fetchVideoBuffer(
    op2.response.generatedVideos[0].video.uri,
  );
  console.log("Step 3 done. Clip 2 size:", secondVideoBuffer.length, "bytes");

  // --- STEP 4: Merge 2 clip lại ---
  console.log("Step 4: Merging clips to ~15s...");
  const combinedBuffer = await mergeBuffers(
    firstVideoBuffer,
    secondVideoBuffer,
  );
  console.log("Step 4 done. Combined size:", combinedBuffer.length, "bytes");

  // --- STEP 5: Upload lên Cloudinary ---
  console.log("Step 5: Uploading final video to Cloudinary...");
  return await uploadBufferToCloudinary(combinedBuffer, "video");
};
