export interface ColorCorrectionOptions {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  gamma?: number;
}

export interface ColorBalanceOptions {
  rs?: number;
  gs?: number;
  bs?: number;
  rm?: number;
  gm?: number;
  bm?: number;
  rh?: number;
  gh?: number;
  bh?: number;
}

export class ColorOperations {
  public static adjustColor(options: ColorCorrectionOptions = {}): string {
    const params: string[] = [];
    if (options.brightness !== undefined) params.push(`brightness=${options.brightness}`);
    if (options.contrast !== undefined) params.push(`contrast=${options.contrast}`);
    if (options.saturation !== undefined) params.push(`saturation=${options.saturation}`);
    if (options.gamma !== undefined) params.push(`gamma=${options.gamma}`);
    
    return params.length > 0 ? `eq=${params.join(':')}` : 'eq';
  }

  public static blur(radius: number): string {
    return `boxblur=${radius}`;
  }

  public static sharpen(amount: number): string {
    return `unsharp=5:5:${amount}`;
  }

  public static noiseReduction(): string {
    return `hqdn3d`;
  }

  public static colorBalance(options: ColorBalanceOptions = {}): string {
    const params: string[] = [];
    if (options.rs !== undefined) params.push(`rs=${options.rs}`);
    if (options.gs !== undefined) params.push(`gs=${options.gs}`);
    if (options.bs !== undefined) params.push(`bs=${options.bs}`);
    if (options.rm !== undefined) params.push(`rm=${options.rm}`);
    if (options.gm !== undefined) params.push(`gm=${options.gm}`);
    if (options.bm !== undefined) params.push(`bm=${options.bm}`);
    if (options.rh !== undefined) params.push(`rh=${options.rh}`);
    if (options.gh !== undefined) params.push(`gh=${options.gh}`);
    if (options.bh !== undefined) params.push(`bh=${options.bh}`);
    
    return params.length > 0 ? `colorbalance=${params.join(':')}` : 'colorbalance';
  }
}
