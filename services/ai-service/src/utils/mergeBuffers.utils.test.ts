import { describe, it, expect, vi, beforeEach } from "vitest";
import mergeBuffers from "./mergeBuffers.utils.js";

// Mock fs — avoid real disk operations during tests
vi.mock("fs", () => ({
  default: {
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
    unlinkSync: vi.fn(),
  },
}));

// Mock os — return a fixed temp directory
vi.mock("os", () => ({
  default: {
    tmpdir: vi.fn(() => "/tmp"),
  },
}));

// Mock ffmpeg — must support method chaining
vi.mock("fluent-ffmpeg", () => {
  // Create object with all methods, each returning itself to allow chaining
  const mockFfmpeg: any = {
    input: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    mergeToFile: vi.fn().mockReturnThis(),
  };

  return {
    default: vi.fn(() => mockFfmpeg),
  };
});

describe("mergeBuffers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns merged Buffer when FFmpeg succeeds", async () => {
    const buf1 = Buffer.from("video1");
    const buf2 = Buffer.from("video2");
    const mergedBuffer = Buffer.from("merged-video");

    // fs.readFileSync returns the merged video after FFmpeg finishes
    const fs = await import("fs");
    vi.mocked(fs.default.readFileSync).mockReturnValueOnce(mergedBuffer as any);

    // Get mock ffmpeg to manually trigger the "end" event
    const ffmpeg = await import("fluent-ffmpeg");
    const mockInstance = (ffmpeg.default as any)();

    // When mergeToFile is called → immediately trigger the "end" event
    vi.mocked(mockInstance.on).mockImplementation(
      (event: string, cb: Function) => {
        if (event === "end") {
          setTimeout(() => cb(), 0); // trigger "end" callback
        }
        return mockInstance;
      },
    );

    const result = await mergeBuffers(buf1, buf2);

    expect(result).toEqual(mergedBuffer);
  });
});
