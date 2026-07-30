import { CodecSupport, HardwareAcceleration } from '../types';

export class CodecManager {
  /**
   * Determines the optimal video encoder string for ffmpeg based on the target codec and available hardware.
   */
  public static getOptimalVideoEncoder(targetCodec: CodecSupport | string, hardware: HardwareAcceleration[]): string {
    const isNvenc = hardware.includes('nvenc');
    const isQsv = hardware.includes('qsv');
    const isAmf = hardware.includes('amf');
    const isVideotoolbox = hardware.includes('videotoolbox');

    switch (targetCodec) {
      case 'h264':
        if (isNvenc) return 'h264_nvenc';
        if (isQsv) return 'h264_qsv';
        if (isAmf) return 'h264_amf';
        if (isVideotoolbox) return 'h264_videotoolbox';
        return 'libx264';
      case 'h265':
      case 'hevc':
        if (isNvenc) return 'hevc_nvenc';
        if (isQsv) return 'hevc_qsv';
        if (isAmf) return 'hevc_amf';
        if (isVideotoolbox) return 'hevc_videotoolbox';
        return 'libx265';
      case 'av1':
        if (isNvenc) return 'av1_nvenc';
        if (isQsv) return 'av1_qsv';
        if (isAmf) return 'av1_amf';
        return 'libaom-av1';
      case 'vp9':
        if (isQsv) return 'vp9_qsv';
        return 'libvpx-vp9';
      case 'prores':
        if (isVideotoolbox) return 'prores_videotoolbox';
        return 'prores_ks';
      default:
        // Fallback to the target codec name if unknown
        return targetCodec;
    }
  }

  /**
   * Determines the optimal audio encoder string for ffmpeg based on the target codec.
   */
  public static getOptimalAudioEncoder(targetCodec: CodecSupport | string): string {
    switch (targetCodec) {
      case 'aac':
        return 'aac';
      case 'mp3':
        return 'libmp3lame';
      case 'opus':
        return 'libopus';
      case 'flac':
        return 'flac';
      default:
        return targetCodec;
    }
  }
}
