import { FileWalker } from '../fileWalker';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

describe('FileWalker', () => {
  let tempDir: string;

  beforeAll(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'filewalker-test-'));
  });

  afterAll(async () => {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  });

  test('includes files matching include patterns', async () => {
    const structure = [
      'a.ts',
      'b.js',
      'c.jsx',
      'sub/d.ts',
      'node_modules/e.ts',
    ];
    for (const file of structure) {
      const fullPath = path.join(tempDir, file);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, '// dummy');
    }

    const walker = new FileWalker({
      root: tempDir,
      includePatterns: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      excludePatterns: ['node_modules/', '.git/'],
    });
    const results = await walker.walk();
    const resultPaths = results.map(r => r.relativePath).sort();

    expect(resultPaths).toEqual(['a.ts', 'b.js', 'c.jsx', 'sub/d.ts']);
  });

  test('excludes files and directories matching exclude patterns', async () => {
    const structure = [
      'file.ts',
      'test/file.js',
      'dist/bundle.js',
      'build/output.js',
      'coverage/report.html',
      '.git/config',
      'node_modules/pkg/index.d.ts',
    ];
    for (const file of structure) {
      const fullPath = path.join(tempDir, file);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, '// dummy');
    }

    const walker = new FileWalker({
      root: tempDir,
      includePatterns: ['**/*.ts', '**/*.js'],
      excludePatterns: ['node_modules/', '.git/', 'dist/', 'build/', 'coverage/'],
    });
    const results = await walker.walk();
    const resultPaths = results.map(r => r.relativePath);

    expect(resultPaths).toEqual(['file.ts', 'test/file.js']);
  });

  test('respects maxDepth option', async () => {
    const structure = [
      'a.ts',
      'sub/b.ts',
      'sub/sub/c.ts',
      'sub/sub/sub/d.ts',
    ];
    for (const file of structure) {
      const fullPath = path.join(tempDir, file);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, '// dummy');
    }

    const walker = new FileWalker({
      root: tempDir,
      includePatterns: ['**/*.ts'],
      maxDepth: 2,
    });
    const results = await walker.walk();
    const resultPaths = results.map(r => r.relativePath).sort();

    // Depth: a.ts (0), sub/b.ts (1), sub/sub/c.ts (2). sub/sub/sub/d.ts is depth 3, should be excluded.
    expect(resultPaths).toEqual(['a.ts', 'sub/b.ts', 'sub/sub/c.ts']);
  });

  test('handles directories with no matching files', async () => {
    const structure = [
      'empty_dir/',
      'src/main.ts',
      'src/utils/helper.ts',
    ];
    for (const file of structure) {
      const fullPath = path.join(tempDir, file);
      if (file.endsWith('/')) {
        await fs.mkdir(fullPath, { recursive: true });
      } else {
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, '// dummy');
      }
    }

    const walker = new FileWalker({
      root: tempDir,
      includePatterns: ['**/*.ts'],
    });
    const results = await walker.walk();
    const resultPaths = results.map(r => r.relativePath).sort();

    expect(resultPaths).toEqual(['src/main.ts', 'src/utils/helper.ts']);
  });

  test('handles permission errors gracefully', async () => {
    // Create a directory and then make it unreadable (if on POSIX)
    // On Windows, chmod doesn't work the same way, so skip this test on Windows
    if (process.platform === 'win32') {
      return; // skip
    }

    const restrictedDir = path.join(tempDir, 'restricted');
    await fs.mkdir(restrictedDir);
    await fs.chmod(restrictedDir, 0o000);

    try {
      const walker = new FileWalker({
        root: tempDir,
        includePatterns: ['**/*.ts'],
      });
      const results = await walker.walk();
      // Should not throw, and may or may not include files depending on permissions
      expect(Array.isArray(results)).toBe(true);
    } finally {
      // Restore permissions to allow cleanup
      await fs.chmod(restrictedDir, 0o755);
    }
  });
});
