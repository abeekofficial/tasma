export interface SyncOffsetResult {
  inputOptions: string[];
}

export class SyncOperations {
  /**
   * Resamples audio to ensure audio/video sync.
   * @returns FFmpeg filter syntax for async audio resampling
   */
  public static syncAudioVideo(): string {
    return 'aresample=async=1';
  }

  /**
   * Offsets audio by a specified number of milliseconds using input options.
   * @param ms Offset time in milliseconds
   * @returns Configuration for input options to apply the offset
   */
  public static offsetAudio(ms: number): SyncOffsetResult {
    const seconds = (ms / 1000).toFixed(3);
    return {
      inputOptions: ['-itsoffset', seconds]
    };
  }
}
