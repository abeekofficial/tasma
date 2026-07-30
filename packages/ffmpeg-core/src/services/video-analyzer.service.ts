import * as ffmpeg from 'fluent-ffmpeg';
import { FFprobeService } from './ffprobe.service';
import { Injectable } from '@nestjs/common';

export interface VideoAnalysisResult {
  vfrDetected: boolean;
  keyframeIntervals: number[];
  pixelFormat: string;
  colorRange: string;
  hdrMetadata: any;
}

@Injectable()
export class VideoAnalyzerService {
  constructor(private readonly ffprobeService: FFprobeService) {}

  public async analyzeVideo(filePath: string): Promise<VideoAnalysisResult> {
    const metadata = await this.ffprobeService.getMetadata(filePath);
    const videoStream = metadata.streams.find((s: any) => s.codec_type === 'video');

    if (!videoStream) {
      throw new Error('No video stream found');
    }

    const vfrDetected = videoStream.r_frame_rate !== videoStream.avg_frame_rate;
    const pixelFormat = videoStream.pix_fmt || 'unknown';
    const colorRange = videoStream.color_range || 'unknown';
    
    // Simplification for Keyframe and HDR metadata as they require deeper probing
    const keyframeIntervals: number[] = [];
    const hdrMetadata = {
      colorSpace: videoStream.color_space,
      colorTransfer: videoStream.color_transfer,
      colorPrimaries: videoStream.color_primaries,
    };

    return {
      vfrDetected,
      keyframeIntervals,
      pixelFormat,
      colorRange,
      hdrMetadata,
    };
  }
}
