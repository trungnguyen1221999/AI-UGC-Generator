import ffmpegStatic from "ffmpeg-static";
import { execFile } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const execFileAsync = promisify(execFile);

const extractLastFrame = async (videoBuffer: Buffer): Promise<string> => {
  const ffmpegPath =
    typeof ffmpegStatic === "string"
      ? ffmpegStatic
      : ((ffmpegStatic as any).default ?? null);

  if (!ffmpegPath) throw new Error("ffmpeg-static binary not found");

  const tmpDir = os.tmpdir();
  const inputPath = path.join(tmpDir, `veo_input_${Date.now()}.mp4`);
  const outputPath = path.join(tmpDir, `veo_frame_${Date.now()}.png`);

  try {
    fs.writeFileSync(inputPath, videoBuffer);

    await execFileAsync(ffmpegPath, [
      "-sseof",
      "-0.1",
      "-i",
      inputPath,
      "-vframes",
      "1",
      "-q:v",
      "2",
      "-y",
      outputPath,
    ]);

    const frameBuffer = fs.readFileSync(outputPath);
    return frameBuffer.toString("base64");
  } finally {
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  }
};

export default extractLastFrame;
