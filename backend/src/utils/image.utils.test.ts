import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchImageAsBase64 } from "./image.utils.js";

// Mock global fetch — avoid real network calls during tests
global.fetch = vi.fn();

describe("fetchImageAsBase64", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns base64 string when fetch succeeds", async () => {
    const fakeData = "fake-image-data";
    const fakeArrayBuffer = new TextEncoder().encode(fakeData).buffer;

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      arrayBuffer: async () => fakeArrayBuffer,
    } as any);

    const result = await fetchImageAsBase64("https://example.com/image.jpg");

    expect(result).toBe(Buffer.from(fakeArrayBuffer).toString("base64"));
  });

  it("throws when fetch response is not ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
    } as any);

    await expect(
      fetchImageAsBase64("https://example.com/image.jpg"),
    ).rejects.toThrow("Failed to fetch image from URL");
  });

  it("throws when fetch itself fails", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    await expect(
      fetchImageAsBase64("https://example.com/image.jpg"),
    ).rejects.toThrow("Network error");
  });
});
