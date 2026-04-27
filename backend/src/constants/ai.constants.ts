import { HarmCategory, HarmBlockThreshold } from '@google/genai';

// Credits deducted per generation | Số credit bị trừ mỗi lần generate
export const PROJECT_CREDIT_COST = 3;
export const PROJECT_CREDIT_VIDEO_COST = 5;

// Minimum number of images required | Số ảnh tối thiểu cần upload
export const MIN_IMAGES_REQUIRED = 2;

// Video resolution based on user plan | Độ phân giải video theo plan
export const VIDEO_RESOLUTION_FREE = '720p';
export const VIDEO_RESOLUTION_PRO = '1080p';

// Gemini model used for image generation | Model Gemini dùng để generate ảnh
export const GENERATION_MODEL = 'gemini-3-pro-image-preview';
export const VIDEO_MODEL = 'veo-3.1-fast-generate-preview';
// Safety settings — all disabled to allow product/commercial content
// Tắt hết safety filter để cho phép nội dung thương mại
export const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.OFF,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.OFF,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.OFF,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.OFF,
  },
];