import { GenerationContentConfig } from '@google/genai';
import ai from '../config/ai';
import { GENERATION_MODEL, VIDEO_MODEL, SAFETY_SETTINGS } from '../constants/ai.constants';
import { UploadedFile } from '../types/project.types';
import { toInlineImage, uploadBufferToCloudinary  } from '../utils/image.utils';

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
  resolution?: string,
): Promise<string> => {

  const promptText = `You are a professional UGC video creator for e-commerce.
Create a short, engaging product showcase video.
Product name: ${productName}
Product description: ${productDescription}
Requirements:
- Style: authentic, natural UGC feel
- Show the person naturally interacting with the product
- Aspect ratio: ${aspectRatio}
${userPrompt ? `Additional instructions: ${userPrompt}` : ''}`;

  // Fetch generated image and convert to base64 bytes
  // Lấy ảnh đã generate và chuyển sang base64 bytes
  const imageBase64 = await fetchImageAsBase64(generatedImageUrl);

  // Start video generation operation
  // Bắt đầu operation generate video
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: promptText,
    image: {
      imageBytes: imageBase64,  // dùng imageBytes, không phải imageUri
      mimeType: 'image/png',
    },
    config: {
      numberOfVideos: 1,
      resolution: resolution || '720p',
      aspectRatio: aspectRatio || '9:16',
    },
  });

  // Poll every 5 seconds until generation is complete (max 3 minutes)
  // Poll mỗi 5 giây cho đến khi xong — tối đa 3 phút
  const MAX_WAIT = 180_000;
  const startTime = Date.now();

  while (!operation.done) {
    if (Date.now() - startTime > MAX_WAIT) {
      throw new Error('Video generation timed out after 3 minutes');
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  if (operation.error) {
    throw new Error(operation.error.message || 'Video generation failed');
  }

  // Extract video URI from completed operation
  // Lấy URI video từ operation đã hoàn thành
  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error('Veo did not return a video URI');

  // Fetch video content and upload to Cloudinary
  // Lấy nội dung video và upload lên Cloudinary
  const videoUrl = new URL(videoUri);
  videoUrl.searchParams.append('key', process.env.GOOGLE_CLOUD_API_KEY!);

  const videoResponse = await fetch(videoUrl.toString());
  if (!videoResponse.ok) throw new Error('Failed to fetch generated video from Google');

  const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
  return await uploadBufferToCloudinary(videoBuffer, 'video');
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