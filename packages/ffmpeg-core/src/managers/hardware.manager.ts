import { execSync } from 'child_process';
import { HardwareAcceleration } from '../types';

export class HardwareManager {
  private static cachedHardware: HardwareAcceleration[] | null = null;
  private static disabledHardware: Set<HardwareAcceleration> = new Set();

  /**
   * Detects available hardware acceleration using ffmpeg -hwaccels
   * Returns a prioritized list of available hardware acceleration methods.
   */
  public static detectHardwareAcceleration(): HardwareAcceleration[] {
    if (this.cachedHardware !== null) {
      return this.cachedHardware.filter(hw => !this.disabledHardware.has(hw));
    }

    const available: HardwareAcceleration[] = [];
    try {
      const output = execSync('ffmpeg -hwaccels', { encoding: 'utf-8', stdio: 'pipe' });
      const hwaccels = output.toLowerCase();

      // Check for available hardware encoders based on ffmpeg output
      if (hwaccels.includes('cuda')) {
        available.push('cuda' as HardwareAcceleration);
      }
      if (hwaccels.includes('cuvid') || hwaccels.includes('nvdec')) {
        available.push('nvenc' as HardwareAcceleration);
      }
      if (hwaccels.includes('qsv')) {
        available.push('qsv' as HardwareAcceleration);
      }
      if (hwaccels.includes('amf') || hwaccels.includes('d3d11va') || hwaccels.includes('dxva2')) {
        available.push('amf' as HardwareAcceleration);
      }
      if (hwaccels.includes('videotoolbox')) {
        available.push('videotoolbox' as HardwareAcceleration);
      }
    } catch (error) {
      console.warn('Failed to detect hardware acceleration, falling back to software encoding.');
    }

    // Always append software as the ultimate fallback
    available.push('software' as HardwareAcceleration);
    
    this.cachedHardware = available;
    return available.filter(hw => !this.disabledHardware.has(hw));
  }

  /**
   * Handles GPU acceleration failure by disabling the specified hardware
   * and forcing software fallback on the next query.
   */
  public static handleGpuFailure(hardware: HardwareAcceleration, error: Error): void {
    console.error(`[HardwareManager] GPU failure detected for ${hardware}:`, error.message);
    this.disabledHardware.add(hardware);
  }
}
