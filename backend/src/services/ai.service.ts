import { GenerationContentConfig } from '@google/genai';
import ai from '../config/ai';
import { GENERATION_MODEL, VIDEO_MODEL, SAFETY_SETTINGS } from '../constants/ai.constants';
import { UploadedFile } from '../types/project.types';
import { toInlineImage } from '../utils/image.utils';

// ─── Generate Product Image ───────────────────────────────────────────────────

// Combine a person photo and product photo into one photorealistic image
// Kết hợp ảnh người và ảnh sản phẩm thành một ảnh photorealistic
export const generateProductImage = async (
  personImage: UploadedFile,
  productImage: UploadedFile,
  userPrompt: string,
  aspectRatio: string
): Promise<Buffer> => {

  const generationConfig: GenerationContentConfig = {
    maxOutputTokens: 32768,
    temperature: 1,
    topP: 0.95,
    responseModalities: ['IMAGE'],
    // @ts-ignore — imageConfig not yet in official type definitions
    imageConfig: {
      aspectRatio: aspectRatio || '9:16',
      imageSize: '1K',
    },
    safetySettings: SAFETY_SETTINGS,
  };

  // Fixed system instructions — define quality and style requirements
  // Phần cố định — định nghĩa yêu cầu chất lượng và phong cách
  const systemPrompt = `You are a professional e-commerce photo editor.
Combine the provided person and product images into a single photorealistic image.
Requirements:
- The person should naturally hold or use the product
- Match lighting, shadows, scale, and perspective between the two images
- Place the person in a clean, professional setting suitable for e-commerce
- Output must be photorealistic and production-ready`;

  // Optional user customization appended to the system prompt
  // Phần tuỳ chỉnh từ user, thêm vào sau system prompt nếu có
  const userCustomization = userPrompt
    ? `\nAdditional instructions from user: ${userPrompt}`
    : '';

  const prompt = { text: systemPrompt + userCustomization };

  const response: any = await ai.models.generateContent({
    model: GENERATION_MODEL,
    contents: [toInlineImage(personImage), toInlineImage(productImage), prompt],
    config: generationConfig,
  });

  // Validate response structure before processing
  // Kiểm tra cấu trúc response trước khi xử lý
  const parts = response?.candidates?.[0]?.content?.parts;
  if (!parts) throw new Error('AI returned an invalid response structure');

  // Find the image part — AI may return multiple parts (text + image)
  // Tìm part chứa ảnh — AI có thể trả về nhiều parts khác nhau
  const imagePart = parts.find((part: any) => part.inlineData);
  if (!imagePart) throw new Error('AI did not return an image in the response');

  return Buffer.from(imagePart.inlineData.data, 'base64');
};

// ─── Generate Product Video ───────────────────────────────────────────────────

// Generate a short UGC-style product video from a generated image
// Generate video UGC ngắn từ ảnh sản phẩm đã được tạo ra
export const generateProductVideo = async (
  productName: string,
  productDescription: string,
  generatedImageUrl: string,
  aspectRatio: string,
  targetLength: number,
  userPrompt?: string,
  resolution: string,
): Promise<Buffer> => {

  const generationConfig: GenerationContentConfig = {
    maxOutputTokens: 32768,
    temperature: 1,
    topP: 0.95,
    responseModalities: ['VIDEO'],
    // @ts-ignore — videoConfig not yet in official type definitions
    videoConfig: {
      aspectRatio: aspectRatio || '9:16',
      durationSeconds: targetLength || 5,
      resolution,
    },
    safetySettings: SAFETY_SETTINGS,
  };

  // System prompt defines UGC video style and structure
  // System prompt định nghĩa phong cách và cấu trúc video UGC
  const systemPrompt = `You are a professional UGC (User Generated Content) video creator for e-commerce.
Create a short, engaging product showcase video.
Requirements:
- Duration: approximately ${targetLength} seconds
- Style: authentic, natural UGC feel — not overly polished or corporate
- Show the person naturally interacting with and demonstrating the product
- Include smooth camera movement and natural lighting
- Aspect ratio: ${aspectRatio} (optimised for social media)
- The video should feel like an authentic recommendation, not an advertisement`;

  // Product context injected into the prompt so AI understands what to showcase
  // Thông tin sản phẩm được inject vào prompt để AI biết cần showcase cái gì
  const productContext = `
Product name: ${productName}
Product description: ${productDescription}`;

  // Optional user customization appended last
  // Tuỳ chỉnh từ user được thêm vào cuối
  const userCustomization = userPrompt
    ? `\nAdditional instructions from user: ${userPrompt}`
    : '';

  const prompt = { text: systemPrompt + productContext + userCustomization };

  // Pass the generated image as visual reference for the video
  // Truyền ảnh đã generate làm tham chiếu hình ảnh cho video
  const imageReference = {
    inlineData: {
      // Fetch image from Cloudinary URL and convert to base64
      // Lấy ảnh từ Cloudinary URL và chuyển sang base64
      data: await fetchImageAsBase64(generatedImageUrl),
      mimeType: 'image/png',
    },
  };

  const response: any = await ai.models.generateContent({
    model: VIDEO_MODEL,
    contents: [imageReference, prompt],
    config: generationConfig,
  });

  // Validate response structure before processing
  // Kiểm tra cấu trúc response trước khi xử lý
  const parts = response?.candidates?.[0]?.content?.parts;
  if (!parts) throw new Error('AI returned an invalid response structure');

  // Find the video part in the response
  // Tìm part chứa video trong response
  const videoPart = parts.find((part: any) => part.inlineData);
  if (!videoPart) throw new Error('AI did not return a video in the response');

  return Buffer.from(videoPart.inlineData.data, 'base64');
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Fetch a remote image URL and return it as a base64 string
// Lấy ảnh từ URL và trả về dạng base64
const fetchImageAsBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image from URL: ${url}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('base64');
};