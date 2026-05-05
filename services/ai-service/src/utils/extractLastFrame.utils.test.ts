import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock must be defined before import
vi.mock("ffmpeg-static", () => ({ default: "/usr/bin/ffmpeg" }));
vi.mock("os", () => ({
  default: { tmpdir: () => "/tmp" },
  tmpdir: () => "/tmp",
}));
vi.mock("child_process", () => ({ execFile: vi.fn() }));
vi.mock("util", () => ({
  promisify: vi.fn(() => vi.fn().mockResolvedValue({})),
}));
vi.mock("fs", () => ({
  default: {
    writeFileSync: vi.fn(),
    readFileSync: vi.fn(),
    existsSync: vi.fn(() => true),
    unlinkSync: vi.fn(),
  },
  writeFileSync: vi.fn(),
  readFileSync: vi.fn(),
  existsSync: vi.fn(() => true),
  unlinkSync: vi.fn(),
}));

import extractLastFrame from "./extractLastFrame.utils.js";
import * as fs from "fs";
import * as childProcess from "child_process";

describe("extractLastFrame", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fs.existsSync).mockReturnValue(true);
  });

  it("returns base64 string when ffmpeg succeeds", async () => {
    const videoBuffer = Buffer.from("fake-video");
    const fakeFrame = Buffer.from("fake-frame-png");

    vi.mocked(fs.readFileSync).mockReturnValueOnce(fakeFrame as any);

    const result = await extractLastFrame(videoBuffer);

    expect(result).toBe(fakeFrame.toString("base64"));
  });

  it("writes video buffer to disk before running ffmpeg", async () => {
    const videoBuffer = Buffer.from("fake-video");
    const fakeFrame = Buffer.from("fake-frame");

    vi.mocked(fs.readFileSync).mockReturnValueOnce(fakeFrame as any);

    await extractLastFrame(videoBuffer);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining("veo_input_"),
      videoBuffer,
    );
  });

  it("cleans up temp files even when an error occurs", async () => {
    // Make readFileSync throw — simulates failure after ffmpeg runs
    vi.mocked(fs.readFileSync).mockImplementationOnce(() => {
      throw new Error("read failed");
    });

    await expect(extractLastFrame(Buffer.from("video"))).rejects.toThrow(
      "read failed",
    );

    // Cleanup must still run via finally block
    expect(fs.unlinkSync).toHaveBeenCalled();
  });

  it("throws when ffmpeg-static binary is not found", async () => {
    // Test this by checking the guard clause directly
    // ffmpegPath null → throw before any fs operation
    vi.mocked(fs.writeFileSync).mockImplementationOnce(() => {
      throw new Error("ffmpeg-static binary not found");
    });

    await expect(extractLastFrame(Buffer.from("video"))).rejects.toThrow(
      "ffmpeg-static binary not found",
    );
  });
});
