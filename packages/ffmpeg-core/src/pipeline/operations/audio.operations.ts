export interface AudioTrimOptions {
  start: number;
  end: number;
}

export interface FadeOptions {
  type: 'in' | 'out';
  start: number;
  duration: number;
}

export class AudioOperations {
  /**
   * Trims audio to a specific start and end time.
   * @param options Start and end time in seconds
   * @returns FFmpeg filter syntax for trimming audio
   */
  public static trim(options: AudioTrimOptions): string {
    return `atrim=start=${options.start}:end=${options.end},asetpts=PTS-STARTPTS`;
  }

  /**
   * Splits audio into multiple identical outputs.
   * @param outputs Number of output streams
   * @returns FFmpeg filter syntax for splitting audio
   */
  public static split(outputs: number = 2): string {
    return `asplit=${outputs}`;
  }

  /**
   * Concatenates multiple audio streams.
   * @param segments Number of segments to concatenate
   * @param hasVideo Whether the segments contain video
   * @param hasAudio Whether the segments contain audio
   * @returns FFmpeg filter syntax for concatenation
   */
  public static concat(segments: number, hasVideo: boolean = false, hasAudio: boolean = true): string {
    const v = hasVideo ? 1 : 0;
    const a = hasAudio ? 1 : 0;
    return `concat=n=${segments}:v=${v}:a=${a}`;
  }

  /**
   * Adjusts the volume of the audio.
   * @param level Volume level multiplier (e.g. 0.5 for half volume, 2.0 for double volume)
   * @returns FFmpeg filter syntax for volume adjustment
   */
  public static volume(level: number): string {
    return `volume=${level}`;
  }

  /**
   * Normalizes loudness to EBU R128 standard.
   * @returns FFmpeg filter syntax for loudness normalization
   */
  public static normalizeLoudness(): string {
    return 'loudnorm=I=-16:TP=-1.5:LRA=11';
  }

  /**
   * Applies a fade in or fade out effect.
   * @param options Fade type, start time, and duration
   * @returns FFmpeg filter syntax for fade effect
   */
  public static fade(options: FadeOptions): string {
    return `afade=t=${options.type}:ss=${options.start}:d=${options.duration}`;
  }

  /**
   * Adjusts the speed of the audio.
   * @param multiplier Speed multiplier (e.g. 0.5 for half speed, 2.0 for double speed)
   * @returns FFmpeg filter syntax for speed adjustment
   */
  public static speed(multiplier: number): string {
    return `atempo=${multiplier}`;
  }

  /**
   * Delays the audio by a specified amount of time.
   * @param ms Delay time in milliseconds
   * @returns FFmpeg filter syntax for delaying audio
   */
  public static delay(ms: number): string {
    return `adelay=${ms}|${ms}`;
  }

  /**
   * Mutes the audio.
   * @returns FFmpeg filter syntax for muting audio
   */
  public static mute(): string {
    return 'volume=0';
  }
}
