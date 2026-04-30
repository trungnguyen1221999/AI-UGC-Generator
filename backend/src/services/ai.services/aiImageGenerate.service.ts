import { getProductUsageInstruction } from "./../../utils/productAiUsageInstruction.utils.js";
import { GenerateContentConfig } from "@google/genai";
import ai from "../../config/ai.js";
import {
  GENERATION_MODEL,
  SAFETY_SETTINGS,
} from "../../constants/ai.constants.js";
import { UploadedFile } from "../../types/project.types.js";
import { toInlineImage } from "../../utils/image.utils.js";

// ─── Generate Product Image ───────────────────────────────────────────────────

// Combine a product photo and model photo into one photorealistic e-commerce image
// Kết hợp ảnh sản phẩm và ảnh người mẫu thành một ảnh e-commerce photorealistic
export const generateProductImage = async (
  productImage: UploadedFile,
  modelImage: UploadedFile,
  productName: string,
  productDescription: string,
  userPrompt: string,
  aspectRatio: string,
): Promise<Buffer> => {
  const generationConfig: GenerateContentConfig = {
    maxOutputTokens: 32768,
    temperature: 1,
    topP: 0.95,
    responseModalities: ["IMAGE"],
    // @ts-ignore — imageConfig not yet in official type definitions
    imageConfig: {
      aspectRatio: aspectRatio || "9:16",
      imageSize: "1K",
    },
    safetySettings: SAFETY_SETTINGS,
  };

  // Infer product usage instruction from product name and description
  // Xác định cách sử dụng sản phẩm từ tên và mô tả
  const usageInstruction = getProductUsageInstruction(
    productName,
    productDescription,
  );

  // Fixed system instructions — define quality, style, and interaction requirements
  // Phần cố định — định nghĩa yêu cầu chất lượng, phong cách và cách tương tác
  const systemPrompt = `You are a professional e-commerce UGC photo editor.

You will receive two images:
- Image 1: the PRODUCT (item being advertised)
- Image 2: the MODEL/PERSON (who will showcase the product)

Product interaction (CRITICAL — follow exactly):
${usageInstruction}

Composition rules:
- The product must be clearly visible and recognizable — do not obscure it
- Match lighting direction, color temperature, and shadows between both images
- Scale the product realistically relative to the person's body

Output requirements:
- Clean, minimal background suitable for e-commerce
- Photorealistic — no AI artifacts, no distortion on hands or product
- Production-ready quality, sharp focus on both person and product
- Aspect ratio: ${aspectRatio}`;

  // Optional user customization appended last — lowest priority
  // Tuỳ chỉnh từ user thêm vào cuối — ưu tiên thấp nhất
  const userCustomization = userPrompt
    ? `\nAdditional instructions from user: ${userPrompt}`
    : "";

  const prompt = { text: systemPrompt + userCustomization };

  const response: any = await ai.models.generateContent({
    model: GENERATION_MODEL,
    // Image 1 = product, Image 2 = model — order matters for the prompt
    // Ảnh 1 = sản phẩm, Ảnh 2 = người mẫu — thứ tự quan trọng với prompt
    contents: [toInlineImage(productImage), toInlineImage(modelImage), prompt],
    config: generationConfig,
  });

  // Validate response structure before processing
  // Kiểm tra cấu trúc response trước khi xử lý
  const parts = response?.candidates?.[0]?.content?.parts;
  if (!parts) throw new Error("AI returned an invalid response structure");

  // Find the image part — AI may return multiple parts (text + image)
  // Tìm part chứa ảnh — AI có thể trả về nhiều parts khác nhau
  const imagePart = parts.find((part: any) => part.inlineData);
  if (!imagePart) throw new Error("AI did not return an image in the response");

  return Buffer.from(imagePart.inlineData.data, "base64");
};
