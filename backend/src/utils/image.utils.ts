import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { UploadedFile } from "../types/project.types.js";

// Convert a local file to Gemini-compatible base64 inline data
// Đọc file từ disk và chuyển sang format base64 mà Gemini API yêu cầu
export const toInlineImage = (file: UploadedFile) => ({
  inlineData: {
    data: fs.readFileSync(file.path).toString("base64"),
    mimeType: file.mimetype,
  },
});

// Upload multiple files to Cloudinary in parallel
// Upload nhiều file lên Cloudinary cùng lúc — nhanh hơn tuần tự
export const uploadFilesToCloudinary = async (
  files: UploadedFile[],
): Promise<string[]> => {
  return Promise.all(
    files.map((file) =>
      cloudinary.uploader
        .upload(file.path, { resource_type: "image" })
        .then((result) => result.secure_url),
    ),
  );
};

// Upload a raw buffer to Cloudinary — supports both image and video
// Upload buffer lên Cloudinary — hỗ trợ cả ảnh và video
export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  type: "image" | "video" = "image",
): Promise<string> => {
  const base64 = `data:${type}/${type === "video" ? "mp4" : "png"};base64,${buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(base64, {
    resource_type: type,
  });
  return result.secure_url;
};

// Fetch a remote image URL and return it as a base64 string
// Lấy ảnh từ URL và trả về dạng base64
export const fetchImageAsBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image from URL: ${url}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
};
