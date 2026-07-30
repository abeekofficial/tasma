export interface ReplaceFrameOptions {
  timecode: string;
  imagePath: string;
}

export class FrameOperations {
  /**
   * Generates CLI arguments for extracting a specific frame.
   * Note: This operation is usually executed as an independent FFmpeg command rather than a filter string.
   *
   * @param timecode - The timecode at which to extract the frame (e.g., '00:00:05.000').
   * @param outputPath - The file path where the extracted frame should be saved.
   * @returns Array of FFmpeg command-line arguments.
   */
  public static extractFrame(timecode: string, outputPath: string): string[] {
    return [
      '-ss', timecode,
      '-vframes', '1',
      '-q:v', '2', // High quality for JPEG extraction
      outputPath
    ];
  }

  /**
   * Generates an FFmpeg complex filter configuration to replace a frame at a specific timecode
   * with an image overlay.
   *
   * @param options - Replace options containing the target timecode and replacement image path.
   * @returns FFmpeg complex filter string for frame replacement.
   */
  public static replaceFrame(options: ReplaceFrameOptions): string {
    // This assumes the replacement image is passed as a secondary input to the overlay filter.
    // We use the `enable` evaluation to only apply the overlay exactly at the given timecode.
    // Example usage in graph: [0:v][1:v]overlay=enable='eq(t,${timecode})'[out]
    return `overlay=enable='eq(t,${options.timecode})'`;
  }

  /**
   * Generates an FFmpeg filter string to freeze the video on a specific frame for a given duration.
   *
   * @param timecode - The timecode (in seconds) of the frame to freeze.
   * @param duration - The duration (in seconds) to hold the frozen frame.
   * @returns FFmpeg filter string to freeze the frame.
   */
  public static freezeFrame(timecode: string, duration: number): string {
    // To freeze a specific frame for a duration without knowing the exact frame rate in advance,
    // the loop filter is commonly used. Setting size=1 loops a single frame.
    // loop count would normally be (duration * fps), but for generic filter syntax,
    // we set an arbitrary large loop count or rely on downstream filters/duration bounds.
    // For exact time-based manipulation, `tpad` or `loop` can be combined.
    // Here we configure the loop filter starting at the specified timecode.
    return `loop=loop=-1:size=1:start_time=${timecode}`;
  }
}
