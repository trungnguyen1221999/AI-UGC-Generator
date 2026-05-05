import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateProductVideo } from "./aiVideoGenerate.service.js";
import ai from "../../config/ai.js";
import extractLastFrame from "../../utils/extractLastFrame.utils.js";
import {
  fetchImageAsBase64,
  uploadBufferToCloudinary,
} from "../../utils/image.utils.js";
import mergeBuffers from "../../utils/mergeBuffers.utils.js";
import { getProductUsageInstruction } from "../../utils/productAiUsageInstruction.utils.js";

vi.mock("../../config/ai.js", () => ({
  default: {
    models: {
      generateVideos: vi.fn(),
    },
    operations: {
      getVideosOperation: vi.fn(),
    },
  },
}));

vi.mock("../../utils/extractLastFrame.utils.js", () => ({
  default: vi.fn(),
}));

vi.mock("../../utils/image.utils.js", () => ({
  fetchImageAsBase64: vi.fn(),
  uploadBufferToCloudinary: vi.fn(),
}));

vi.mock("../../utils/mergeBuffers.utils.js", () => ({
  default: vi.fn(),
}));

vi.mock("../../utils/productAiUsageInstruction.utils.js", () => ({
  getProductUsageInstruction: vi.fn(() => "Use naturally in-hand"),
}));

describe("aiVideoGenerate service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_CLOUD_API_KEY = "test-google-key";

    vi.stubGlobal("fetch", vi.fn());
  });

  it("generates and uploads merged video successfully", async () => {
    vi.mocked(fetchImageAsBase64).mockResolvedValue(
      "data:image/png;base64,first-image-base64",
    );

    vi.mocked(ai.models.generateVideos)
      .mockResolvedValueOnce({
        done: true,
        response: {
          generatedVideos: [{ video: { uri: "https://fake/video-1" } }],
        },
      } as any)
      .mockResolvedValueOnce({
        done: true,
        response: {
          generatedVideos: [{ video: { uri: "https://fake/video-2" } }],
        },
      } as any);

    vi.mocked(global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => Buffer.from("clip-1").buffer,
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => Buffer.from("clip-2").buffer,
      } as any);

    vi.mocked(extractLastFrame).mockResolvedValue("last-frame-base64");
    vi.mocked(mergeBuffers).mockResolvedValue(Buffer.from("merged-video"));
    vi.mocked(uploadBufferToCloudinary).mockResolvedValue(
      "https://cloudinary/final.mp4",
    );

    const result = await generateProductVideo(
      "Sneakers",
      "Running shoes",
      "https://cloudinary/generated-image.png",
      "9:16",
      "keep it casual",
      "1080p",
      "walk forward",
    );

    expect(result).toBe("https://cloudinary/final.mp4");
    expect(getProductUsageInstruction).toHaveBeenCalledWith(
      "Sneakers",
      "Running shoes",
    );

    expect(ai.models.generateVideos).toHaveBeenCalledTimes(2);
    expect(ai.models.generateVideos).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        image: { imageBytes: "first-image-base64", mimeType: "image/png" },
        config: expect.objectContaining({
          resolution: "1080p",
          aspectRatio: "9:16",
        }),
      }),
    );

    expect(ai.models.generateVideos).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        image: { imageBytes: "last-frame-base64", mimeType: "image/png" },
        prompt: expect.stringContaining("Continue the motion seamlessly."),
      }),
    );

    expect(mergeBuffers).toHaveBeenCalledTimes(1);
    expect(uploadBufferToCloudinary).toHaveBeenCalledWith(
      expect.any(Buffer),
      "video",
    );
  });

  it("throws when GOOGLE_CLOUD_API_KEY is missing", async () => {
    delete process.env.GOOGLE_CLOUD_API_KEY;

    await expect(
      generateProductVideo("Name", "Desc", "https://img", "9:16"),
    ).rejects.toThrow("Missing GOOGLE_CLOUD_API_KEY");
  });

  it("throws when Google video fetch fails", async () => {
    vi.mocked(fetchImageAsBase64).mockResolvedValue(
      "data:image/png;base64,abc",
    );

    vi.mocked(ai.models.generateVideos).mockResolvedValueOnce({
      done: true,
      response: {
        generatedVideos: [{ video: { uri: "https://fake/video-1" } }],
      },
    } as any);

    vi.mocked(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      arrayBuffer: async () => new ArrayBuffer(0),
    } as any);

    await expect(
      generateProductVideo("Name", "Desc", "https://img", "9:16"),
    ).rejects.toThrow("Failed to fetch video buffer from Google");
  });

  it("throws operation error message when AI returns operation error", async () => {
    vi.mocked(fetchImageAsBase64).mockResolvedValue(
      "data:image/png;base64,abc",
    );

    vi.mocked(ai.models.generateVideos).mockResolvedValueOnce({
      done: true,
      error: { message: "Generation blocked" },
    } as any);

    await expect(
      generateProductVideo("Name", "Desc", "https://img", "9:16"),
    ).rejects.toThrow("Generation blocked");
  });
});
