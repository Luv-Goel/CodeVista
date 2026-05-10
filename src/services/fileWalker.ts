import { promises as fs } from 'fs';
import path from 'path';
import { minimatch } from 'minimatch';

export interface FileInfo {
  path: string;
  relativePath: string;
  size: number;
  mtimeMs: number;
  isDirectory: boolean;
  extension?: string;
  depth: number;
}

export interface WalkerOptions {
  root: string;
  includePatterns: string[];
  excludePatterns?: string[];
  maxDepth?: number;
  followSymlinks?: boolean;
}

export class FileWalker {
  private options: WalkerOptions;

  constructor(options: WalkerOptions) {
    this.options = {
      followSymlinks: false,
      ...options,
    };
  }

  async walk(): Promise<FileInfo[]> {
    const results: FileInfo[] = [];
    await this.walkDirectory(this.options.root, 0, results);
    return results;
  }

  private async walkDirectory(
    dirPath: string,
    currentDepth: number,
    results: FileInfo[]
  ): Promise<void> {
    // Check max depth
    if (
      this.options.maxDepth !== undefined &&
      currentDepth > this.options.maxDepth
    ) {
      return;
    }

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.resolve(dirPath, entry.name);
        const relativePath = path.relative(this.options.root, fullPath);

        // Check exclude patterns first
        if (this.isExcluded(relativePath, entry.isDirectory())) {
          continue;
        }

        // For directories, recurse
        if (entry.isDirectory()) {
          // Skip symlinked directories if configured
          if (entry.isSymbolicLink() && !this.options.followSymlinks) {
            continue;
          }
          await this.walkDirectory(fullPath, currentDepth + 1, results);
        } else if (entry.isFile()) {
          // Check include patterns
          if (this.isIncluded(relativePath)) {
            try {
              const stats = await fs.stat(fullPath);
              results.push({
                path: fullPath,
                relativePath,
                size: stats.size,
                mtimeMs: stats.mtimeMs,
                isDirectory: false,
                extension: path.extname(entry.name).toLowerCase().slice(1) || undefined,
                depth: currentDepth,
              });
            } catch (err) {
              // Skip files we can't stat
              console.warn(`Cannot stat file: ${fullPath}`, err);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.code === 'EACCES') {
        console.warn(`Permission denied: ${dirPath}`);
      } else if (err.code === 'ENOENT') {
        // Directory disappeared, skip
      } else {
        console.warn(`Error reading directory ${dirPath}:`, err);
      }
    }
  }

  private isIncluded(filePath: string): boolean {
    // Normalize path separators for consistent glob matching
    const normalizedPath = filePath.replace(/\\/g, '/');

    // If no include patterns specified, include all files
    if (this.options.includePatterns.length === 0) {
      return true;
    }

    // Check against any include pattern
    return this.options.includePatterns.some((pattern) =>
      minimatch(normalizedPath, pattern, { dot: true })
    );
  }

  private isExcluded(dirPath: string, isDirectory: boolean): boolean {
    if (!this.options.excludePatterns || this.options.excludePatterns.length === 0) {
      return false;
    }

    // For directories, always exclude if pattern matches
    const normalizedPath = dirPath.replace(/\\/g, '/');

    // Check directory-specific patterns (ensuring pattern ends with / for dir matching)
    const dirPatterns = this.options.excludePatterns.map((p) =>
      p.endsWith('/') ? p.slice(0, -1) : p
    );

    const isDirExcluded = dirPatterns.some((pattern) =>
      minimatch(normalizedPath, pattern, { dot: true }) ||
      (isDirectory && normalizedPath.split('/').some((_, index, arr) => {
        // Also check if any parent directory matches an exclude pattern
        const parentPath = arr.slice(0, index + 1).join('/');
        return minimatch(parentPath, pattern, { dot: true });
      }))
    );

    if (isDirExcluded) {
      return true;
    }

    // For files, check all exclude patterns as well
    return this.options.excludePatterns.some((pattern) =>
      minimatch(normalizedPath, pattern, { dot: true })
    );
  }

  // Convenience static method
  static async walk(options: WalkerOptions): Promise<FileInfo[]> {
    const walker = new FileWalker(options);
    return walker.walk();
  }
}

export default FileWalker;
