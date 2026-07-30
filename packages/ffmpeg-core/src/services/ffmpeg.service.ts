import ffmpeg from 'fluent-ffmpeg';

export class FFmpegService {
  /**
   * Creates a new FFmpeg command instance.
   */
  public createCommand(): ffmpeg.FfmpegCommand {
    return ffmpeg();
  }

  /**
   * Executes an FFmpeg command and returns a Promise.
   * @param command The fluent-ffmpeg command to execute.
   */
  public async executeCommand(command: ffmpeg.FfmpegCommand): Promise<void> {
    return new Promise((resolve, reject) => {
      command
        .on('start', (commandLine: string) => {
          console.log(`[FFmpegService] Started command: ${commandLine}`);
        })
        .on('progress', (progress: any) => {
          console.log(`[FFmpegService] Processing: ${progress.percent ? progress.percent.toFixed(2) + '%' : '...'}`);
        })
        .on('error', (err: Error, stdout: string, stderr: string) => {
          console.error(`[FFmpegService] Error: ${err.message}`);
          console.error(`[FFmpegService] stderr: ${stderr}`);
          reject(new Error(`FFmpeg execution failed: ${err.message}`));
        })
        .on('end', (stdout: string, stderr: string) => {
          console.log('[FFmpegService] Finished execution successfully.');
          resolve();
        });

      // Run the command explicitly in case it hasn't been triggered.
      command.run();
    });
  }
}
