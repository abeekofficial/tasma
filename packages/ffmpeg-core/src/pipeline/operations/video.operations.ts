import { TrimOptions, CropOptions } from '../../types';

export class VideoOperations {
  /**
   * Generates an FFmpeg filter string for trimming video and audio.
   * Note: The `trim` filter works on video, `atrim` on audio.
   * This returns the video portion, but can be adapted for a complex filter graph.
   *
   * @param options - Trim options containing start, end, or duration.
   * @returns FFmpeg filter string for video trimming.
   */
  public static trim(options: TrimOptions): string {
    const filters: string[] = [];
    if (options.startTime !== undefined) {
      filters.push(`start=${options.startTime}`);
    }
    if (options.endTime !== undefined) {
      filters.push(`end=${options.endTime}`);
    } else if (options.duration !== undefined) {
      filters.push(`duration=${options.duration}`);
    }
    
    if (filters.length === 0) {
      return '';
    }
    
    const filterConfig = filters.join(':');
    return `trim=${filterConfig},setpts=PTS-STARTPTS`;
  }

  /**
   * Generates an FFmpeg filter string for cropping a video.
   *
   * @param options - Crop options containing x, y, width, and height.
   * @returns FFmpeg filter string for cropping.
   */
  public static crop(options: CropOptions): string {
    return `crop=${options.w}:${options.h}:${options.x}:${options.y}`;
  }

  /**
   * Generates an FFmpeg filter string for splitting a video stream into multiple outputs.
   *
   * @param times - Array of timestamps (in seconds) to split the video at.
   * @returns FFmpeg complex filter string for splitting.
   */
  public static split(times: number[]): string {
    if (!times || times.length === 0) {
      return 'split=1';
    }
    const count = times.length + 1;
    return `split=${count}`;
  }

  /**
   * Generates an FFmpeg complex filter string for concatenating multiple inputs.
   *
   * @param inputs - Array of input file paths or stream identifiers.
   * @returns FFmpeg complex filter string for concatenation.
   */
  public static concat(inputs: string[]): string {
    if (!inputs || inputs.length === 0) {
      return '';
    }
    const n = inputs.length;
    // Maps [0:v][0:a][1:v][1:a]... for N inputs
    const streamMap = inputs.map((_, i) => `[${i}:v][${i}:a]`).join('');
    return `${streamMap}concat=n=${n}:v=1:a=1[v][a]`;
  }

  /**
   * Generates an FFmpeg filter string for adjusting playback speed.
   * Handles both video (setpts) and audio (atempo).
   *
   * @param multiplier - Speed multiplier (e.g., 2.0 for 2x speed, 0.5 for half speed).
   * @returns FFmpeg filter strings for video and audio speed adjustment.
   */
  public static speed(multiplier: number): string {
    if (multiplier <= 0) {
      throw new Error('Speed multiplier must be greater than 0');
    }
    
    const ptsMultiplier = (1 / multiplier).toFixed(4);
    
    // FFmpeg's atempo filter only supports values between 0.5 and 100.
    // For multipliers outside this range, multiple atempo filters would be chained.
    // This handles a single simple atempo pass for typical use cases.
    let atempoStr = `atempo=${multiplier}`;
    if (multiplier < 0.5) {
      // Chain atempo for extreme slowdowns, e.g., 0.25 -> atempo=0.5,atempo=0.5
      const chains = Math.ceil(Math.log(multiplier) / Math.log(0.5));
      const root = Math.pow(multiplier, 1 / chains);
      atempoStr = Array(chains).fill(`atempo=${root.toFixed(4)}`).join(',');
    }
    
    return `setpts=${ptsMultiplier}*PTS,${atempoStr}`;
  }

  /**
   * Generates an FFmpeg filter string for reversing the video and audio streams.
   *
   * @returns FFmpeg filter string for reversing playback.
   */
  public static reverse(): string {
    return 'reverse,areverse';
  }

  /**
   * Generates an FFmpeg filter string for looping a video.
   *
   * @param count - Number of times to loop the video (-1 for infinite).
   * @returns FFmpeg filter string for looping.
   */
  public static loop(count: number): string {
    return `loop=${count}:32767:0`;
  }
}
