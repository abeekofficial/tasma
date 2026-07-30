import * as ffmpeg from 'fluent-ffmpeg';
import { FFprobeService } from './ffprobe.service';
import { Injectable } from '@nestjs/common';

export interface AudioAnalysisResult {
  channels: number;
  channelLayout: string;
  sampleRate: number;
  peakLevel: number;
  lufs: number;
  silenceIntervals: { start: number; duration: number }[];
}

@Injectable()
export class AudioAnalyzerService {
  constructor(private readonly ffprobeService: FFprobeService) {}

  public async analyzeAudio(filePath: string): Promise<AudioAnalysisResult> {
    const metadata = await this.ffprobeService.getMetadata(filePath);
    const audioStream = metadata.streams.find((s: any) => s.codec_type === 'audio');

    if (!audioStream) {
      throw new Error('No audio stream found');
    }

    const channels = audioStream.channels || 0;
    const channelLayout = audioStream.channel_layout || 'unknown';
    const sampleRate = parseInt(audioStream.sample_rate || '0', 10);

    return new Promise((resolve, reject) => {
      let peakLevel = 0;
      let lufs = 0;
      const silenceIntervals: { start: number; duration: number }[] = [];

      let silenceStart = 0;

      ffmpeg(filePath)
        .audioFilters('volumedetect', 'silencedetect=noise=-50dB:d=1', 'ebur128')
        .format('null')
        .output('-')
        .on('stderr', (stderrLine: string) => {
          const maxVolumeMatch = stderrLine.match(/max_volume:\s*([-0-9.]+)\s*dB/);
          if (maxVolumeMatch) peakLevel = parseFloat(maxVolumeMatch[1]);

          const lufsMatch = stderrLine.match(/I:\s*([-0-9.]+)\s*LUFS/);
          if (lufsMatch) lufs = parseFloat(lufsMatch[1]);

          const silenceStartMatch = stderrLine.match(/silence_start:\s*([-0-9.]+)/);
          if (silenceStartMatch) silenceStart = parseFloat(silenceStartMatch[1]);

          const silenceDurationMatch = stderrLine.match(/silence_duration:\s*([-0-9.]+)/);
          if (silenceDurationMatch) {
            silenceIntervals.push({
              start: silenceStart,
              duration: parseFloat(silenceDurationMatch[1]),
            });
          }
        })
        .on('error', (err: any) => reject(err))
        .on('end', () => {
          resolve({
            channels,
            channelLayout,
            sampleRate,
            peakLevel,
            lufs,
            silenceIntervals,
          });
        })
        .run();
    });
  }
}
