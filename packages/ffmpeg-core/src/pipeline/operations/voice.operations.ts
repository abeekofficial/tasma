export class VoiceOperations {
  public static noiseReduction(): string {
    return 'afftdn';
  }

  public static removeSilence(thresholdDb: number, duration: number): string {
    return `silenceremove=stop_periods=-1:stop_duration=${duration}:stop_threshold=${thresholdDb}dB`;
  }

  public static speechEnhancement(): string {
    // Combines bandpass filters targeted at vocal frequencies ~300Hz to ~3400Hz
    return 'highpass=f=300,lowpass=f=3400';
  }
}
