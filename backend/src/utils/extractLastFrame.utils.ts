// extractLastFrame.utils.ts
// Trích xuất frame cuối cùng của video buffer thành base64 PNG
// Dùng để làm "seed image" cho lần generate video tiếp theo

import { execFile } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const execFileAsync = promisify(execFile);

const extractLastFrame = async (videoBuffer: Buffer): Promise<string> => {
  // Ghi video buffer ra file tạm
  const tmpDir = os.tmpdir();
  const inputPath = path.join(tmpDir, `veo_input_${Date.now()}.mp4`);
  const outputPath = path.join(tmpDir, `veo_frame_${Date.now()}.png`);

  try {
    fs.writeFileSync(inputPath, videoBuffer);

    // ffmpeg: lấy frame cuối cùng
    // -sseof -0.1 = seek 0.1s từ cuối file
    // -vframes 1  = chỉ lấy 1 frame
    // -q:v 2      = chất lượng cao
    await execFileAsync("ffmpeg", [
      "-sseof",
      "-0.1",
      "-i",
      inputPath,
      "-vframes",
      "1",
      "-q:v",
      "2",
      "-y", // overwrite nếu tồn tại
      outputPath,
    ]);

    const frameBuffer = fs.readFileSync(outputPath);
    // Trả về base64 thuần (không có prefix data:image/...)
    return frameBuffer.toString("base64");
  } finally {
    // Cleanup file tạm dù có lỗi hay không
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  }
};

export default extractLastFrame;
