export interface EqualizerBand {
  frequency: number;
  width: number;
  gain: number;
}

export interface EqualizerOptions {
  bands: EqualizerBand[];
}

export interface CompressorOptions {
  threshold?: number; // dB
  ratio?: number;
  attack?: number; // ms
  release?: number; // ms
  makeup?: number; // dB
}

export interface NoiseGateOptions {
  threshold?: number;
  attack?: number;
  release?: number;
}

export class AudioFilterOperations {
  public static equalizer(options: EqualizerOptions): string {
    if (!options.bands || options.bands.length === 0) {
      return 'anull';
    }
    const bandsFilter = options.bands.map(band => 
      `c0 f=${band.frequency} w=${band.width} g=${band.gain}`
    ).join('|');
    return `anequalizer=${bandsFilter}`;
  }

  public static compressor(options: CompressorOptions): string {
    const params = new URLSearchParams();
    if (options.threshold !== undefined) params.append('threshold', options.threshold.toString());
    if (options.ratio !== undefined) params.append('ratio', options.ratio.toString());
    if (options.attack !== undefined) params.append('attack', options.attack.toString());
    if (options.release !== undefined) params.append('release', options.release.toString());
    if (options.makeup !== undefined) params.append('makeup', options.makeup.toString());
    
    const filterArgs = Array.from(params.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join(':');
      
    return filterArgs ? `acompressor=${filterArgs}` : 'acompressor';
  }

  public static limiter(limitDb: number): string {
    return `alimiter=limit=${limitDb}`;
  }

  public static noiseGate(options: NoiseGateOptions): string {
    const params = new URLSearchParams();
    if (options.threshold !== undefined) params.append('threshold', options.threshold.toString());
    if (options.attack !== undefined) params.append('attack', options.attack.toString());
    if (options.release !== undefined) params.append('release', options.release.toString());
    
    const filterArgs = Array.from(params.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join(':');
      
    return filterArgs ? `agate=${filterArgs}` : 'agate';
  }

  public static highPass(freq: number): string {
    return `highpass=f=${freq}`;
  }

  public static lowPass(freq: number): string {
    return `lowpass=f=${freq}`;
  }

  public static bassBoost(gain: number, freq: number = 100): string {
    return `bass=g=${gain}:f=${freq}`;
  }

  public static trebleBoost(gain: number, freq: number = 10000): string {
    return `treble=g=${gain}:f=${freq}`;
  }

  public static monoConversion(): string {
    return 'pan=1c|c0=0.5*c0+0.5*c1';
  }
}
