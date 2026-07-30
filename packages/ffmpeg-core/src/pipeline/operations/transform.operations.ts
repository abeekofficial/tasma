import { ScaleOptions } from '../../types';

export class TransformOperations {
  /**
   * Generates an FFmpeg filter string for scaling the video.
   *
   * @param options - Scale options containing width, height, and whether to preserve aspect ratio.
   * @returns FFmpeg filter string for scaling.
   */
  public static scale(options: ScaleOptions): string {
    if (options.keepAspectRatio) {
      // force_original_aspect_ratio=decrease prevents upscaling beyond aspect ratio bounds
      return `scale=w=${options.width}:h=${options.height}:force_original_aspect_ratio=decrease`;
    }
    return `scale=w=${options.width}:h=${options.height}`;
  }

  /**
   * Generates an FFmpeg filter string for translating (moving) the video frame.
   * This is typically accomplished using the geq, pad, or affine filters in FFmpeg.
   * Here we use the affine filter for 2D transformations.
   *
   * @param x - Translation along the X-axis (pixels).
   * @param y - Translation along the Y-axis (pixels).
   * @returns FFmpeg filter string for translation.
   */
  public static translate(x: number, y: number): string {
    return `affine=tx=${x}:ty=${y}`;
  }

  /**
   * Generates an FFmpeg filter string for rotating the video.
   *
   * @param angle - Angle of rotation in radians.
   * @returns FFmpeg filter string for rotation.
   */
  public static rotate(angle: number): string {
    return `rotate=${angle}`;
  }

  /**
   * Generates an FFmpeg filter string to flip the video horizontally.
   *
   * @returns FFmpeg filter string for horizontal flip.
   */
  public static flipHorizontal(): string {
    return 'hflip';
  }

  /**
   * Generates an FFmpeg filter string to flip the video vertically.
   *
   * @returns FFmpeg filter string for vertical flip.
   */
  public static flipVertical(): string {
    return 'vflip';
  }
}
