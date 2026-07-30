import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export class FileValidatorService {
  private static readonly ACCEPTED_EXTENSIONS = new Set([
    '.mp4', '.mov', '.avi', '.mkv', '.webm', 
    '.mp3', '.wav', '.aac', '.flac',
    '.jpg', '.jpeg', '.png', '.webp', '.gif'
  ]);

  public async validateFormat(filePath: string): Promise<boolean> {
    try {
      const ext = path.extname(filePath).toLowerCase();
      if (!FileValidatorService.ACCEPTED_EXTENSIONS.has(ext)) {
        return false;
      }
      
      // Also ensure file actually exists and is accessible
      await fs.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async checkCorruption(filePath: string): Promise<boolean> {
    try {
      // Run ffprobe to quickly check for stream errors or missing headers
      // -v error: only show errors
      // -show_entries format=duration: ensure format can be parsed
      // -of default=noprint_wrappers=1:nokey=1: minimal output
      const { stderr } = await execAsync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`);
      
      // If there's any stderr output, ffprobe encountered an issue
      if (stderr && stderr.trim().length > 0) {
        return false; // Potentially corrupted or invalid format
      }
      
      return true; // No errors detected by ffprobe
    } catch (error) {
      // exec throws if the command returns a non-zero exit code
      return false;
    }
  }

  public async enforceMaxSize(filePath: string, maxBytes: number): Promise<boolean> {
    try {
      const stats = await fs.stat(filePath);
      return stats.size <= maxBytes;
    } catch (error) {
      return false;
    }
  }
}
