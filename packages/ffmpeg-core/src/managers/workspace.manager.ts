import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export class WorkspaceManager {
  /**
   * Safely creates an isolated temporary directory for Tasma.
   */
  public static createTempDirectory(prefix: string = 'tasma-'): string {
    const tmpDir = os.tmpdir();
    const tasmaTempRoot = path.join(tmpDir, 'tasma');
    
    if (!fs.existsSync(tasmaTempRoot)) {
      fs.mkdirSync(tasmaTempRoot, { recursive: true });
    }

    const uniqueDir = fs.mkdtempSync(path.join(tasmaTempRoot, prefix));
    return uniqueDir;
  }

  /**
   * Generates a safe, unique file name to avoid collisions.
   */
  public static generateSafeFileName(prefix: string, extension: string): string {
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const safePrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '');
    const cleanExtension = extension.startsWith('.') ? extension : `.${extension}`;
    return `${safePrefix}_${uniqueId}${cleanExtension}`;
  }

  /**
   * Deletes a directory and its contents recursively.
   */
  public static cleanup(directoryPath: string): void {
    if (!directoryPath) {
      return;
    }
    
    const absolutePath = path.resolve(directoryPath);
    
    // Prevent accidental deletion of system or critical root directories
    if (absolutePath === '/' || absolutePath === os.homedir() || absolutePath === os.tmpdir()) {
      throw new Error('Unsafe cleanup operation blocked: Target directory is restricted.');
    }

    if (fs.existsSync(absolutePath)) {
      fs.rmSync(absolutePath, { recursive: true, force: true });
    }
  }

  /**
   * Validates a path to ensure it does not contain directory traversal attacks.
   */
  public static validatePath(inputPath: string): boolean {
    if (!inputPath || typeof inputPath !== 'string') {
      return false;
    }

    // Reject null bytes
    if (inputPath.indexOf('\0') !== -1) {
      return false;
    }

    // Reject raw traversal patterns
    if (inputPath.includes('../') || inputPath.includes('..\\')) {
      return false;
    }

    // Validate using path resolution
    const normalized = path.normalize(inputPath);
    if (normalized.includes('..')) {
      return false;
    }

    return true;
  }
}
