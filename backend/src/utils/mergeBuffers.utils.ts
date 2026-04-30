import ffmpeg from "fluent-ffmpeg";
import { Readable, PassThrough } from "stream";

/**
 * Helper: Merges two Buffers using FFmpeg
 */
const mergeBuffers = async (buf1: Buffer, buf2: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const outStream = new PassThrough();
    const chunks: Buffer[] = [];

    outStream.on("data", (chunk) => chunks.push(chunk));
    outStream.on("end", () => resolve(Buffer.concat(chunks)));
    outStream.on("error", reject);

    // We turn buffers into streams for FFmpeg
    const stream1 = Readable.from(buf1);
    const stream2 = Readable.from(buf2);

    ffmpeg()
      .input(stream1)
      .input(stream2)
      .on("error", (err) => {
        console.error("FFmpeg Merge Error:", err);
        reject(err);
      })
      .mergeToFile(outStream);
  });
};

export default mergeBuffers;
