import { describe, it, expect, vi, beforeEach } from "vitest";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import {
  toInlineImage,
  uploadFilesToCloudinary,
  uploadBufferToCloudinary,
  fetchImageAsBase64,
} from "./image.utils.js";

// --- Mocks ---
vi.mock("fs");
vi.mock("cloudinary", () => ({
  v2: {
    uploader: {
      upload: vi.fn(),
    },
  },
}));

// Mock global fetch
global.fetch = vi.fn();

describe("Image & Cloudinary Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. toInlineImage
  describe("toInlineImage", () => {
    it("should convert a local file to base64 inline data for Gemini", () => {
      const mockFile = { path: "test.jpg", mimetype: "image/jpeg" } as any;
      const mockBuffer = Buffer.from("fake-image-content");

      vi.mocked(fs.readFileSync).mockReturnValue(mockBuffer);

      const result = toInlineImage(mockFile);

      expect(fs.readFileSync).toHaveBeenCalledWith("test.jpg");
      expect(result.inlineData.data).toBe(mockBuffer.toString("base64"));
      expect(result.inlineData.mimeType).toBe("image/jpeg");
    });
  });

  // 2. uploadFilesToCloudinary
  describe("uploadFilesToCloudinary", () => {
    it("should upload multiple files and return an array of secure URLs", async () => {
      const mockFiles = [{ path: "img1.jpg" }, { path: "img2.jpg" }] as any[];

      vi.mocked(cloudinary.uploader.upload)
        .mockResolvedValueOnce({ secure_url: "https://res.com/1.jpg" } as any)
        .mockResolvedValueOnce({ secure_url: "https://res.com/2.jpg" } as any);

      const urls = await uploadFilesToCloudinary(mockFiles);

      expect(urls).toEqual(["https://res.com/1.jpg", "https://res.com/2.jpg"]);
      expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(2);
    });
  });

  // 3. uploadBufferToCloudinary
  describe("uploadBufferToCloudinary", () => {
    it("should upload a buffer as an image by default", async () => {
      const mockBuffer = Buffer.from("data");
      vi.mocked(cloudinary.uploader.upload).mockResolvedValue({
        secure_url: "https://res.com/img.png",
      } as any);

      const url = await uploadBufferToCloudinary(mockBuffer);

      expect(url).toBe("https://res.com/img.png");
      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
        expect.stringContaining("data:image/png;base64,"),
        { resource_type: "image" },
      );
    });

    it("should support video uploads when specified", async () => {
      const mockBuffer = Buffer.from("video-data");
      vi.mocked(cloudinary.uploader.upload).mockResolvedValue({
        secure_url: "https://res.com/vid.mp4",
      } as any);

      const url = await uploadBufferToCloudinary(mockBuffer, "video");

      expect(url).toBe("https://res.com/vid.mp4");
      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
        expect.stringContaining("data:video/mp4;base64,"),
        { resource_type: "video" },
      );
    });
  });

  // 4. fetchImageAsBase64 (Your existing logic refined)
  describe("fetchImageAsBase64", () => {
    it("should fetch a remote image and return it as base64 string", async () => {
      const fakeArrayBuffer = new TextEncoder().encode("image-content").buffer;

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => fakeArrayBuffer,
      } as any);

      const result = await fetchImageAsBase64("https://example.com/test.png");

      expect(result).toBe(Buffer.from(fakeArrayBuffer).toString("base64"));
      expect(fetch).toHaveBeenCalledWith("https://example.com/test.png");
    });

    it("should throw an error if the fetch response is not OK", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as any);

      await expect(fetchImageAsBase64("https://bad-url.com")).rejects.toThrow(
        "Failed to fetch image from URL",
      );
    });
  });
});
