import { execSync } from 'child_process';
import { HardwareAcceleration } from '../types';

export class HardwareManager {
  private static cachedHardware: HardwareAcceleration[] | null = null;

  /**
   * Detects available hardware acceleration using ffmpeg -hwaccels
   * Returns a prioritized list of available hardware acceleration methods.
   */
  public static detectHardwareAcceleration(): HardwareAcceleration[] {
    if (this.cachedHardware !== null) {
      return this.cachedHardware;
    }

    const available: HardwareAcceleration[] = [];
    try {
      const output = execSync('ffmpeg -hwaccels', { encoding: 'utf-8', stdio: 'pipe' });
      const hwaccels = output.toLowerCase();

      // Check for available hardware encoders based on ffmpeg output
      if (hwaccels.includes('cuda') || hwaccels.includes('cuvid') || hwaccels.includes('nvdec')) {
        available.push('nvenc');
      }
      if (hwaccels.includes('qsv')) {
        available.push('qsv');
      }
      if (hwaccels.includes('amf') || hwaccels.includes('d3d11va') || hwaccels.includes('dxva2')) {
        available.push('amf');
      }
      if (hwaccels.includes('videotoolbox')) {
        available.push('videotoolbox');
      }
    } catch (error) {
      console.warn('Failed to detect hardware acceleration, falling back to software encoding.');
    }

    // Always append software as the ultimate fallback
    available.push('software');
    
    this.cachedHardware = available;
    return available;
  }
}
