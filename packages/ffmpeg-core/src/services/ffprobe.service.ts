import ffmpeg, { FfprobeData } from 'fluent-ffmpeg';

export class FFprobeService {
  private readonly DEFAULT_TIMEOUT_MS = 30000;

  /**
   * Probe a media file and return its metadata.
   * @param filePath Absolute path to the media file.
   * @param timeoutMs Timeout in milliseconds to prevent hanging processes.
   * @returns A promise that resolves with the ffprobe data.
   */
  public async probeFile(filePath: string, timeoutMs: number = this.DEFAULT_TIMEOUT_MS): Promise<FfprobeData> {
    return new Promise((resolve, reject) => {
      let timeoutId: NodeJS.Timeout;
      let isSettled = false;

      const finish = (err?: Error, data?: FfprobeData) => {
        if (isSettled) return;
        isSettled = true;
        clearTimeout(timeoutId);

        if (err) {
          reject(new Error(`FFprobe Error: ${err.message}`));
        } else {
          resolve(data as FfprobeData);
        }
      };

      timeoutId = setTimeout(() => {
        finish(new Error(`Timeout of ${timeoutMs}ms exceeded while probing file: ${filePath}`));
      }, timeoutMs);

      ffmpeg.ffprobe(filePath, (err, data) => {
        finish(err, data);
      });
    });
  }
}
