// Request body shape for project creation | Shape của request body khi tạo project
export interface CreateProjectBody {
  name?: string;
  productName: string;
  productDescription: string;
  userPrompt?: string;
  aspectRatio?: string;
  targetLength?: number;
}

// Multer file shape after upload middleware | Shape của file sau khi multer xử lý
export interface UploadedFile {
  path: string;
  mimetype: string;
  filename: string;
}