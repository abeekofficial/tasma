import { FFprobeService } from './ffprobe.service';
import { MediaMetadata } from '../types';

export class MediaAnalyzer {
  constructor(private readonly ffprobeService: FFprobeService) {}

  /**
   * Analyzes a media file and extracts structured metadata.
   * @param filePath Path to the media file.
   */
  public async analyze(filePath: string): Promise<MediaMetadata> {
    const data = await this.ffprobeService.probeFile(filePath);

    const videoStream = data.streams.find(s => s.codec_type === 'video');
    const audioStream = data.streams.find(s => s.codec_type === 'audio');
    const format = data.format;

    // Helper to parse frame rate (e.g. "30000/1001" or "30")
    let fps = 0;
    if (videoStream?.r_frame_rate) {
      const parts = videoStream.r_frame_rate.split('/');
      if (parts.length === 2) {
        fps = parseInt(parts[0], 10) / parseInt(parts[1], 10);
      } else if (parts.length === 1) {
        fps = parseFloat(videoStream.r_frame_rate);
      }
    }

    // Attempt to extract rotation from tags
    let rotation = 0;
    const tags = videoStream?.tags as Record<string, string> | undefined;
    if (tags?.rotate) {
      rotation = parseInt(tags.rotate, 10);
    }

    return {
      duration: format.duration || 0,
      width: videoStream?.width || 0,
      height: videoStream?.height || 0,
      aspectRatio: videoStream?.display_aspect_ratio || null,
      frameRate: fps || null,
      bitrate: format.bit_rate ? parseInt(String(format.bit_rate), 10) : null,
      hasAudio: !!audioStream,
      sampleRate: audioStream?.sample_rate ? parseInt(String(audioStream.sample_rate), 10) : null,
      channelCount: audioStream?.channels || null,
      rotation,
      colorSpace: videoStream?.color_space || null,
      hdrInfo: videoStream?.color_transfer || null,
    } as MediaMetadata;
  }
}
