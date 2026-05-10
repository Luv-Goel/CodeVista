import { FileWalker } from '../fileWalker';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('FileWalker', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'fw-test-'));
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  });

  function norm(p: string): string {
    return p.split(path.sep).join('/');
  }

  async function createFiles(files: string[]) {
    for (const file of files) {
      const fullPath = path.join(tempDir, ...file.split('/'));
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      if (!file.endsWith('/')) {
        await fs.writeFile(fullPath, '// dummy');
      }
    }
  }

  test('includes files matching include patterns', async () => {
    await createFiles([
      'a.ts', 'b.js', 'c.jsx', 'sub/d.ts', 'node_modules/e.ts',
    ]);

    const walker = new FileWalker({
      root: tempDir,
      includePatterns: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      excludePatterns: ['node_modules/', '.git/'],
    });
    const results = await walker.walk();
    const paths = results.map(r => norm(r.relativePath)).sort();
    expect(paths).toEqual(['a.ts', 'b.js', 'c.jsx', 'sub/d.ts']);
  });

  test('excludes files and directories matching exclude patterns', async () => {
    await createFiles([
      'file.ts', 'test/file.js', 'dist/bundle.js',
      'build/output.js', 'coverage/report.html',
      '.git/config', 'node_modules/pkg/index.d.ts',
    ]);

    const walker = new FileWalker({
      root: tempDir,
      includePatterns: ['**/*.ts', '**/*.js'],
      excludePatterns: ['node_modules/', '.git/', 'dist/', 'build/', 'coverage/'],
    });
    const results = await walker.walk();
    const paths = results.map(r => norm(r.relativePath));
    expect(paths).toEqual(['file.ts', 'test/file.js']);
  });

  test('respects maxDepth option', async () => {
    await createFiles([
      'a.ts', 'sub/b.ts', 'sub/sub/c.ts', 'sub/sub/sub/d.ts',
    ]);

    const walker = new FileWalker({
      root: tempDir,
      includePatterns: ['**/*.ts'],
      maxDepth: 2,
    });
    const results = await walker.walk();
    const paths = results.map(r => norm(r.relativePath)).sort();

    expect(paths).toEqual(['a.ts', 'sub/b.ts', 'sub/sub/c.ts']);
  });

  test('handles directories with no matching files', async () => {
    await createFiles([
      'empty_dir/', 'src/main.ts', 'src/utils/helper.ts',
    ]);

    const walker = new FileWalker({
      root: tempDir,
      includePatterns: ['**/*.ts'],
    });
    const results = await walker.walk();
    const paths = results.map(r => norm(r.relativePath)).sort();
    expect(paths).toEqual(['src/main.ts', 'src/utils/helper.ts']);
  });

  test('handles permission errors gracefully', async () => {
    if (process.platform === 'win32') return; // skip on Windows

    await createFiles(['normal.ts']);
    const restrictedDir = path.join(tempDir, 'restricted');
    await fs.mkdir(restrictedDir);
    await fs.chmod(restrictedDir, 0o000);

    try {
      const walker = new FileWalker({
        root: tempDir,
        includePatterns: ['**/*.ts'],
      });
      const results = await walker.walk();
      expect(Array.isArray(results)).toBe(true);
    } finally {
      await fs.chmod(restrictedDir, 0o755).catch(() => {});
    }
  });
});
