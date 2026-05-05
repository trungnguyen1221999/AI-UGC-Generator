import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import os from "os";

/**
 * Merges two video buffers using FFmpeg via temporary files
 *
 * Flow:
 * buf1, buf2 (RAM)
 *   ↓ writeFileSync — write to disk because FFmpeg cannot read Buffer directly
 * file1, file2 (disk)
 *   ↓ ffmpeg merge — external tool, reads files from disk
 * outFile (disk)
 *   ↓ readFileSync — read result from disk back into RAM
 * result (Buffer in RAM)
 *   ↓ cleanup — delete all 3 temp files from disk
 *   ↓ resolve — return Buffer to caller
 */
const mergeBuffers = async (buf1: Buffer, buf2: Buffer): Promise<Buffer> => {
  // Get the OS temporary directory path — runs on server, not client
  // e.g. Windows: C:\Temp | Linux: /tmp
  const tempDir = os.tmpdir();

  // Build file paths — only strings at this point, no real files created yet
  // Date.now() ensures unique filenames if multiple requests run at the same time
  const file1 = path.join(tempDir, `v1_${Date.now()}.mp4`);
  // e.g. "C:\Temp\v1_1234567890.mp4"
  const file2 = path.join(tempDir, `v2_${Date.now()}.mp4`);
  // e.g. "C:\Temp\v2_1234567890.mp4"
  const outFile = path.join(tempDir, `out_${Date.now()}.mp4`);
  // e.g. "C:\Temp\out_1234567890.mp4" — FFmpeg writes merged result here

  // Wrap in Promise because FFmpeg is async and uses events, not async/await
  return new Promise((resolve, reject) => {
    try {
      // Write buffers to disk — FFmpeg is an external tool, cannot read from RAM
      fs.writeFileSync(file1, buf1);
      // → real file created at "C:\Temp\v1_1234567890.mp4"
      fs.writeFileSync(file2, buf2);
      // → real file created at "C:\Temp\v2_1234567890.mp4"

      // Configure FFmpeg — methods before mergeToFile() are setup only, nothing runs yet
      ffmpeg()
        // Tell FFmpeg which files to read as input
        .input(file1)
        .input(file2)

        // Register error handler — runs if FFmpeg crashes or fails mid-process
        .on("error", (err) => {
          cleanup(); // delete temp files even on error
          reject(err); // propagate error to caller
        })

        // Register success handler — runs when FFmpeg finishes merging
        .on("end", () => {
          // Read merged video from disk back into RAM as Buffer
          const result = fs.readFileSync(outFile);

          cleanup(); // delete temp files 
          resolve(result); // return merged Buffer to caller
        })

        // START FFmpeg — this triggers the actual merge process
        // Merges file1 + file2 → writes result to outFile
        .mergeToFile(outFile, tempDir);
    } catch (err) {
      // Catch synchronous errors — e.g. writeFileSync fails due to full disk or no permission
      cleanup();
      reject(err);
    }

    // Delete all 3 temp files from disk
    function cleanup() {
      [file1, file2, outFile].forEach((f) => {
        // Check existence before deleting — outFile may not exist if FFmpeg failed early
        if (fs.existsSync(f)) fs.unlinkSync(f);
        //  ↑ does file exist?     ↑ delete file
      });
    }
  });
};

export default mergeBuffers;
