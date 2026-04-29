import ai from '../../config/ai';
import { VIDEO_MODEL } from '../../constants/ai.constants';
import { uploadBufferToCloudinary, fetchImageAsBase64  } from '../../utils/image.utils';

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
  const promptText = `You are a professional UGC video creator for e-commerce.\nCreate a short, engaging product showcase video.\nProduct name: ${productName}\nProduct description: ${productDescription}\nRequirements:\n- Style: authentic, natural UGC feel\n- Show the person naturally interacting with the product\n- Aspect ratio: ${aspectRatio}\n${userPrompt ? `Additional instructions: ${userPrompt}` : ''}`;

  const imageBase64 = await fetchImageAsBase64(generatedImageUrl);

  let operation = await ai.models.generateVideos({
    model: VIDEO_MODEL,
    prompt: promptText,
    image: {
      imageBytes: imageBase64,
      mimeType: 'image/png',
    },
    config: {
      numberOfVideos: 1,
      resolution: resolution || '720p',
      aspectRatio: aspectRatio || '9:16',
    },
  });

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

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error('Veo did not return a video URI');

  const videoUrl = new URL(videoUri);
  videoUrl.searchParams.append('key', process.env.GOOGLE_CLOUD_API_KEY!);

  const videoResponse = await fetch(videoUrl.toString());
  if (!videoResponse.ok) throw new Error('Failed to fetch generated video from Google');

  const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
  return await uploadBufferToCloudinary(videoBuffer, 'video');
};

