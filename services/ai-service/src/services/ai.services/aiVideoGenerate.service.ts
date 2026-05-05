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

// Poll until the operation completes (or times out)
const pollOperation = async (operation: any) => {
  const MAX_WAIT = 240_000; // 4 minutes
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

// Download video from Google as a Buffer
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
  videoAdditionalPrompt?: string,
): Promise<string> => {
  if (!process.env.GOOGLE_CLOUD_API_KEY)
    throw new Error("Missing GOOGLE_CLOUD_API_KEY");

  const usageInstruction = getProductUsageInstruction(
    productName,
    productDescription,
  );
  const promptText = `
  You are a professional e-commerce UGC video creator.
You are a professional e-commerce UGC video creator.

Product interaction rules:
${usageInstruction}

  The product image provided was generated following these rules:
  - The product is clearly visible and realistically integrated with the model
  - The interaction style follows proper usage behavior for this product category
Your task:
Generate a short UGC-style product video.

  Now your task is to extend this into a short video.
Requirements:
- Keep product position and interaction consistent with input image
- Natural human movement and interaction (non-robotic)
- Maintain lighting and realism from image
- Not cinematic, not ad-heavy
- Aspect ratio: ${aspectRatio}


  Requirements:
  - Maintain the same product positioning and interaction style
  - Make the person naturally move or interact with the product
  - Keep lighting, environment, and realism consistent with the image
  - UGC-style (not cinematic, not advertisement-heavy)
  - Aspect ratio: ${aspectRatio}
Product:
Name: ${productName}
Description: ${productDescription}

  Product:
  Name: ${productName}
  Description: ${productDescription}
  
  With this Instruction: ${usageInstruction}
${userPrompt ? `User extra instructions: ${userPrompt}` : ""}
${videoAdditionalPrompt ? `Video additional instructions: ${videoAdditionalPrompt}` : ""}
`;

  const videoConfig = {
    numberOfVideos: 1,
    resolution: resolution || "720p",
    aspectRatio: aspectRatio || "9:16",
  };

  // --- STEP 1: Generate the first clip from the product image ---
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

  // --- STEP 2: Extract the last frame of clip 1 ---
  // Veo does not support video-to-video, so use the last frame as the seed image
  console.log("Step 2: Extracting last frame from clip 1...");
  const lastFrameBase64 = await extractLastFrame(firstVideoBuffer);
  console.log("Step 2 done. Last frame extracted.");

  // --- STEP 3: Generate clip 2 from the last frame ---
  // Prompt continuity: add "continue" so Veo understands this is a continuation
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

  // --- STEP 4: Merge the two clips ---
  console.log("Step 4: Merging clips to ~15s...");
  const combinedBuffer = await mergeBuffers(
    firstVideoBuffer,
    secondVideoBuffer,
  );
  console.log("Step 4 done. Combined size:", combinedBuffer.length, "bytes");

  // --- STEP 5: Upload to Cloudinary ---
  console.log("Step 5: Uploading final video to Cloudinary...");
  return await uploadBufferToCloudinary(combinedBuffer, "video");
};
