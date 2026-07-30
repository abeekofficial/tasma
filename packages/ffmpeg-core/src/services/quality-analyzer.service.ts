import * as ffmpeg from 'fluent-ffmpeg';
import { Injectable } from '@nestjs/common';

export interface QualityAnalysisResult {
  blurDetectCommand: string;
  blurDetectScore: number;
}

@Injectable()
export class QualityAnalyzerService {
  public async analyzeQuality(filePath: string): Promise<QualityAnalysisResult> {
    const blurDetectCommand = `ffmpeg -i "${filePath}" -vf blurdetect=high=50:low=20 -f null -`;
    
    return new Promise((resolve, reject) => {
      let blurScore = 0;
      ffmpeg(filePath)
        .videoFilters('blurdetect=high=50:low=20')
        .format('null')
        .output('-')
        .on('stderr', (stderrLine: string) => {
          // Parse blurdetect output, e.g., Parsed_blurdetect_0: blur_ratio: 0.123
          const blurMatch = stderrLine.match(/blur_ratio:\s*([0-9.]+)/);
          if (blurMatch) {
            blurScore = parseFloat(blurMatch[1]);
          }
        })
        .on('error', (err: any) => reject(err))
        .on('end', () => {
          resolve({
            blurDetectCommand,
            blurDetectScore: blurScore,
          });
        })
        .run();
    });
  }
}
