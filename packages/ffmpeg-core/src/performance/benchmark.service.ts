import { spawn } from 'child_process';
import { platform } from 'os';

export interface BenchmarkResult {
  durationMs: number;
  score: number;
  success: boolean;
  error?: string;
}

export class BenchmarkService {
  private readonly BENCHMARK_TIMEOUT_MS = 10000;

  public async runSyntheticBenchmark(): Promise<BenchmarkResult> {
    const startTime = Date.now();

    try {
      await this.executeFfmpegBenchmark();
      const endTime = Date.now();
      const durationMs = endTime - startTime;

      // Inverse scoring based on duration: lower duration = higher score
      const score = Math.max(0, 10000 - durationMs);

      return {
        durationMs,
        score,
        success: true,
      };
    } catch (error: any) {
      return {
        durationMs: Date.now() - startTime,
        score: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown benchmark error',
      };
    }
  }

  private executeFfmpegBenchmark(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Generate 1 second of test video (testsrc pattern) and encode to null output
      const outputDevice = platform() === 'win32' ? 'NUL' : '/dev/null';
      const args = [
        '-f', 'lavfi',
        '-i', 'testsrc=duration=1:size=1280x720:rate=30',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-f', 'null',
        outputDevice
      ];

      const ffmpegProcess = spawn('ffmpeg', args);

      const timeoutId = setTimeout(() => {
        ffmpegProcess.kill('SIGKILL');
        reject(new Error('Benchmark timed out'));
      }, this.BENCHMARK_TIMEOUT_MS);

      let errorOutput = '';

      ffmpegProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      ffmpegProcess.on('close', (code) => {
        clearTimeout(timeoutId);
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg exited with code ${code}. Stderr: ${errorOutput}`));
        }
      });

      ffmpegProcess.on('error', (err) => {
        clearTimeout(timeoutId);
        reject(new Error(`Failed to start FFmpeg: ${err.message}`));
      });
    });
  }
}
