import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import os from "os";

/**
 * Merges two video buffers using FFmpeg via temporary files
 */
const mergeBuffers = async (buf1: Buffer, buf2: Buffer): Promise<Buffer> => {
  const tempDir = os.tmpdir();
  const file1 = path.join(tempDir, `v1_${Date.now()}.mp4`);
  const file2 = path.join(tempDir, `v2_${Date.now()}.mp4`);
  const outFile = path.join(tempDir, `out_${Date.now()}.mp4`);

  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(file1, buf1);
      fs.writeFileSync(file2, buf2);

      ffmpeg()
        .input(file1)
        .input(file2)
        .on("error", (err) => {
          cleanup();
          reject(err);
        })
        .on("end", () => {
          const result = fs.readFileSync(outFile);
          cleanup();
          resolve(result);
        })
        .mergeToFile(outFile, tempDir);
    } catch (err) {
      cleanup();
      reject(err);
    }

    function cleanup() {
      [file1, file2, outFile].forEach((f) => {
        if (fs.existsSync(f)) fs.unlinkSync(f);
      });
    }
  });
};

export default mergeBuffers;
