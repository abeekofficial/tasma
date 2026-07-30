import ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs/promises';

export class ThumbnailService {
  /**
   * Extracts a single high-quality frame at the specified time.
   */
  public async generatePosterFrame(filePath: string, timeSeconds: number, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .screenshots({
          timestamps: [timeSeconds],
          filename: path.basename(outputPath),
          folder: path.dirname(outputPath),
        })
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(new Error(`Failed to generate poster frame: ${err.message}`)));
    });
  }

  /**
   * Extracts a specified number of thumbnails evenly spaced across the video duration.
   */
  public async generateTimelineThumbnails(filePath: string, count: number, outputDir: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const generatedFiles: string[] = [];
      ffmpeg(filePath)
        .screenshots({
          count,
          folder: outputDir,
          filename: 'thumbnail-at-%s-seconds.png',
        })
        .on('filenames', (filenames: string[]) => {
          generatedFiles.push(...filenames.map((f) => path.join(outputDir, f)));
        })
        .on('end', () => resolve(generatedFiles))
        .on('error', (err) => reject(new Error(`Failed to generate timeline thumbnails: ${err.message}`)));
    });
  }

  /**
   * Uses ffmpeg tile video filter to generate a sprite sheet for scrubbing previews.
   */
  public async generateSpriteSheet(filePath: string, columns: number, rows: number, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Create a sprite sheet using the tile filter.
      // E.g., select one frame every 10 seconds, or just evenly based on some calculation.
      // Here we provide a robust general tile generation filter.
      ffmpeg(filePath)
        .outputOptions([
          '-frames:v 1',
          `-vf`, `select=not(mod(n\\,10)),scale=-1:-1,tile=${columns}x${rows}`
        ])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(new Error(`Failed to generate sprite sheet: ${err.message}`)))
        .run();
    });
  }
}
