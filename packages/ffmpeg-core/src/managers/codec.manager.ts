import { CodecSupport, HardwareAcceleration } from '../types';

export interface DecoderConfig {
  hwaccel?: string;
  codec?: string;
}

export class CodecManager {
  /**
   * Determines the optimal video decoder config based on the input codec and available hardware.
   */
  public static getOptimalVideoDecoder(inputCodec: string, hardware: HardwareAcceleration[]): DecoderConfig {
    const isCuda = hardware.includes('cuda' as HardwareAcceleration) || hardware.includes('nvenc' as HardwareAcceleration);
    const isQsv = hardware.includes('qsv' as HardwareAcceleration);
    const isAmf = hardware.includes('amf' as HardwareAcceleration);
    const isVideotoolbox = hardware.includes('videotoolbox' as HardwareAcceleration);

    const codec = inputCodec.toLowerCase();

    if (codec === 'h264') {
      if (isCuda) return { hwaccel: 'cuda', codec: 'h264_cuvid' };
      if (isQsv) return { hwaccel: 'qsv', codec: 'h264_qsv' };
    } else if (codec === 'h265' || codec === 'hevc') {
      if (isCuda) return { hwaccel: 'cuda', codec: 'hevc_cuvid' };
      if (isQsv) return { hwaccel: 'qsv', codec: 'hevc_qsv' };
    } else if (codec === 'vp9') {
      if (isCuda) return { hwaccel: 'cuda', codec: 'vp9_cuvid' };
      if (isQsv) return { hwaccel: 'qsv', codec: 'vp9_qsv' };
    } else if (codec === 'av1') {
      if (isCuda) return { hwaccel: 'cuda', codec: 'av1_cuvid' };
      if (isQsv) return { hwaccel: 'qsv', codec: 'av1_qsv' };
    }

    if (hardware.length > 0 && !hardware.includes('software' as HardwareAcceleration)) {
      return { hwaccel: 'auto' };
    }

    return {};
  }

  /**
   * Determines the optimal video encoder string for ffmpeg based on the target codec and available hardware.
   */
  public static getOptimalVideoEncoder(targetCodec: CodecSupport | string, hardware: HardwareAcceleration[]): string {
    const isNvenc = hardware.includes('nvenc' as HardwareAcceleration);
    const isQsv = hardware.includes('qsv' as HardwareAcceleration);
    const isAmf = hardware.includes('amf' as HardwareAcceleration);
    const isVideotoolbox = hardware.includes('videotoolbox' as HardwareAcceleration);

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
