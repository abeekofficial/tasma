export interface OverlayOptions {
  x?: number | string;
  y?: number | string;
  enable?: string;
  eofAction?: 'repeat' | 'endall' | 'pass';
  shortest?: boolean;
}

export interface TextOverlayOptions {
  fontfile?: string;
  fontsize?: number;
  fontcolor?: string;
  x?: number | string;
  y?: number | string;
  box?: boolean;
  boxcolor?: string;
  boxborderw?: number;
  enable?: string;
}

export class OverlayOperations {
  public static imageOverlay(options: OverlayOptions = {}): string {
    const params: string[] = [];
    if (options.x !== undefined) params.push(`x=${options.x}`);
    if (options.y !== undefined) params.push(`y=${options.y}`);
    if (options.enable) params.push(`enable='${options.enable}'`);
    if (options.eofAction) params.push(`eof_action=${options.eofAction}`);
    if (options.shortest) params.push(`shortest=1`);
    
    return params.length > 0 ? `overlay=${params.join(':')}` : 'overlay';
  }

  public static videoOverlay(options: OverlayOptions = {}): string {
    const params: string[] = [];
    if (options.x !== undefined) params.push(`x=${options.x}`);
    if (options.y !== undefined) params.push(`y=${options.y}`);
    if (options.enable) params.push(`enable='${options.enable}'`);
    if (options.eofAction) params.push(`eof_action=${options.eofAction}`);
    if (options.shortest) params.push(`shortest=1`);
    
    return params.length > 0 ? `overlay=${params.join(':')}` : 'overlay';
  }

  public static textOverlay(text: string, options: TextOverlayOptions = {}): string {
    const params: string[] = [`text='${text}'`];
    if (options.fontfile) params.push(`fontfile='${options.fontfile}'`);
    if (options.fontsize !== undefined) params.push(`fontsize=${options.fontsize}`);
    if (options.fontcolor) params.push(`fontcolor=${options.fontcolor}`);
    if (options.x !== undefined) params.push(`x=${options.x}`);
    if (options.y !== undefined) params.push(`y=${options.y}`);
    if (options.box) params.push(`box=1`);
    if (options.boxcolor) params.push(`boxcolor=${options.boxcolor}`);
    if (options.boxborderw !== undefined) params.push(`boxborderw=${options.boxborderw}`);
    if (options.enable) params.push(`enable='${options.enable}'`);

    return `drawtext=${params.join(':')}`;
  }

  public static blend(mode: string): string {
    return `blend=all_mode=${mode}`;
  }

  public static opacity(level: number): string {
    return `colorchannelmixer=aa=${level}`;
  }
}
