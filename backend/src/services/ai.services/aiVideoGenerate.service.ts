import ai from "../../config/ai.js";
import { VIDEO_MODEL } from "../../constants/ai.constants.js";
import {
  uploadBufferToCloudinary,
  fetchImageAsBase64,
} from "../../utils/image.utils.js";
import { getProductUsageInstruction } from "../../utils/productAiUsageInstruction.utils.js";

// ─── Generate Product Video ───────────────────────────────────────────────────
export const generateProductVideo = async (
  productName: string,
  productDescription: string,
  generatedImageUrl: string,
  aspectRatio: string,
  targetLength: number,
  userPrompt?: string,
  resolution?: string,
): Promise<string> => {
  // Infer product usage instruction from product name and description
  // Xác định cách sử dụng sản phẩm từ tên và mô tả
  const usageInstruction = getProductUsageInstruction(
    productName,
    productDescription,
  );
  const promptText = `
  You are a professional e-commerce UGC video creator.

  The product image provided was generated following these rules:
  - The product is clearly visible and realistically integrated with the model
  - The interaction style follows proper usage behavior for this product category

  Now your task is to extend this into a short video.

  Requirements:
  - Maintain the same product positioning and interaction style
  - Make the person naturally move or interact with the product
  - Keep lighting, environment, and realism consistent with the image
  - UGC-style (not cinematic, not advertisement-heavy)
  - Aspect ratio: ${aspectRatio}
  - Duration: ~${targetLength} seconds

  Product:
  Name: ${productName}
  Description: ${productDescription}
  
  With this Instruction: ${usageInstruction}

  ${userPrompt ? `Additional instructions: ${userPrompt}` : ""}
  `;
  const imageBase64 = await fetchImageAsBase64(generatedImageUrl);

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

  const MAX_WAIT = 180_000;
  const startTime = Date.now();

  while (!operation.done) {
    if (Date.now() - startTime > MAX_WAIT) {
      throw new Error("Video generation timed out after 3 minutes");
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  if (
    operation.error &&
    typeof operation.error === "object" &&
    "message" in operation.error
  ) {
    const message = (operation.error as any).message;
    throw new Error(
      typeof message === "string" ? message : "Video generation failed",
    );
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("Veo did not return a video URI");

  const videoUrl = new URL(videoUri);
  videoUrl.searchParams.append("key", process.env.GOOGLE_CLOUD_API_KEY!);

  const videoResponse = await fetch(videoUrl.toString());
  if (!videoResponse.ok)
    throw new Error("Failed to fetch generated video from Google");

  const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
  return await uploadBufferToCloudinary(videoBuffer, "video");
};
