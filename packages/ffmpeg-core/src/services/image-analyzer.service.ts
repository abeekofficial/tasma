import { FFprobeService } from './ffprobe.service';
import { Injectable } from '@nestjs/common';

export interface ImageAnalysisResult {
  width: number;
  height: number;
  aspectRatio: string;
  colorProfile: string;
  hasAlpha: boolean;
  exif: Record<string, string>;
}

@Injectable()
export class ImageAnalyzerService {
  constructor(private readonly ffprobeService: FFprobeService) {}

  public async analyzeImage(filePath: string): Promise<ImageAnalysisResult> {
    const metadata = await this.ffprobeService.getMetadata(filePath);
    const videoStream = metadata.streams.find((s: any) => s.codec_type === 'video');

    if (!videoStream) {
      throw new Error('No image stream found');
    }

    const width = videoStream.width || 0;
    const height = videoStream.height || 0;
    const aspectRatio = videoStream.display_aspect_ratio || `${width}:${height}`;
    const colorProfile = videoStream.color_space || 'unknown';
    const hasAlpha = videoStream.pix_fmt ? videoStream.pix_fmt.includes('alpha') || videoStream.pix_fmt.includes('rgba') || videoStream.pix_fmt.includes('yuva') : false;
    
    const exif: Record<string, string> = {};
    if (metadata.format && metadata.format.tags) {
      for (const [key, value] of Object.entries(metadata.format.tags)) {
          exif[key] = String(value);
      }
    }

    return {
      width,
      height,
      aspectRatio,
      colorProfile,
      hasAlpha,
      exif,
    };
  }
}
