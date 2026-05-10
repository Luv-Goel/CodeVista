import { CodeNode, GraphEdge, VisualGraph, ProjectInfo } from '../types';
import * as path from 'path';
import { FileWalker } from './fileWalker';
import * as fs from 'fs';
import { parseCode } from './astParser';
import Database from 'better-sqlite3';

interface AnalyzerCache {
  fileHash: string;
  filePath: string;
  mtimeMs: number;
  graphJSON: string;
  createdAt: string;
}

class CacheService {
  private db: Database.Database;

  constructor(dbPath: string = 'codevista-cache.db') {
    this.db = new Database(dbPath);
    this.initialize();
  }

  private initialize(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS file_cache (
        file_hash TEXT PRIMARY KEY,
        file_path TEXT NOT NULL,
        mtime_ms INTEGER NOT NULL,
        graph_json TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_file_path ON file_cache(file_path);
    `);
  }

  get(fileHash: string): AnalyzerCache | null {
    const row = this.db.prepare(
      'SELECT * FROM file_cache WHERE file_hash = ?'
    ).get(fileHash) as any;
    return row ? { ...row, mtimeMs: row.mtime_ms } : null;
  }

  put(cache: AnalyzerCache): void {
    this.db.prepare(
      `INSERT OR REPLACE INTO file_cache (file_hash, file_path, mtime_ms, graph_json, created_at)
       VALUES (?, ?, ?, ?, ?)`
    ).run(cache.fileHash, cache.filePath, cache.mtimeMs, cache.graphJSON, cache.createdAt);
  }

  invalidate(filePath: string): void {
    this.db.prepare('DELETE FROM file_cache WHERE file_path = ?').run(filePath);
  }

  close(): void {
    this.db.close();
  }
}

// Common code file patterns
const DEFAULT_INCLUDE_PATTERNS = [
  '**/*.ts',
  '**/*.tsx',
  '**/*.js',
  '**/*.jsx',
  '**/*.mjs',
  '**/*.cjs',
  '**/*.py',
  '**/*.java',
  '**/*.go',
  '**/*.rs',
  '**/*.cs',
  '**/*.cpp',
  '**/*.c',
  '**/*.h',
  '**/*.hpp',
];

const DEFAULT_EXCLUDE_PATTERNS = [
  'node_modules/',
  '.git/',
  'dist/',
  'build/',
  'coverage/',
  '*.test.*',
  '*.spec.*',
  '*.d.ts',
  '**/node_modules/**',
  '**/.git/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/vendor/**',
];

export class CodeAnalyzer {
  private projectPath: string;
  private cacheService: CacheService;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
    // cacheService initialized for future caching
    this.cacheService = new CacheService();
    // suppress unused warning
    void this.cacheService;
  }

  async analyzeProject(): Promise<VisualGraph> {
    const nodes: CodeNode[] = [];
    const edges: GraphEdge[] = [];

    console.log(`Analyzing project at ${this.projectPath}...`);

    // Step 1: Walk the file tree using glob patterns
    const files = await FileWalker.walk({
      root: this.projectPath,
      includePatterns: DEFAULT_INCLUDE_PATTERNS,
      excludePatterns: DEFAULT_EXCLUDE_PATTERNS,
      maxDepth: 20,
      followSymlinks: false,
    });

    console.log(`Found ${files.length} files to analyze`);

    // Step 2: Build file nodes and store in map
    const fileNodeMap = new Map<string, CodeNode>();
    for (const file of files) {
      const language = this.detectLanguage(file.extension);
      const fileNode: CodeNode = {
        id: this.generateNodeId(file.path),
        name: path.basename(file.path),
        type: 'file',
        path: file.path,
        language,
        lines: { start: 1, end: 1 },
        imports: [],
        exports: [],
      };
      nodes.push(fileNode);
      fileNodeMap.set(file.path, fileNode);
    }

    // Step 3: Parse AST for supported files and create symbol nodes + import/export edges
    const moduleNodeMap = new Map<string, string>();

    for (const file of files) {
      const language = this.detectLanguage(file.extension);
      if (!['typescript', 'javascript'].includes(language)) {
        continue;
      }

      try {
        const fileNode = fileNodeMap.get(file.path);
        if (!fileNode) continue;

        const content = await fs.promises.readFile(file.path, 'utf-8');
        const lineCount = content.split('\n').length;
        fileNode.metrics = { loc: lineCount, complexity: 0 };
        const { ast } = parseCode(content, file.path);

        for (const node of ast.body) {
          // Function declarations
          if (node.type === 'FunctionDeclaration' && node.id) {
            const symbolId = `${fileNode.id}:func:${node.id.name}:${node.loc!.start.line}`;
            const symbolNode: CodeNode = {
              id: symbolId,
              name: node.id.name,
              type: 'function',
              path: file.path,
              language,
              lines: { start: node.loc!.start.line, end: node.loc!.end.line },
              metrics: {
                loc: node.loc!.end.line - node.loc!.start.line + 1,
                complexity: 1,
              },
            };
            nodes.push(symbolNode);
            edges.push({ source: fileNode.id, target: symbolId, type: 'contains' });
          }
          // Class declarations
          else if (node.type === 'ClassDeclaration' && node.id) {
            const symbolId = `${fileNode.id}:class:${node.id.name}:${node.loc!.start.line}`;
            const symbolNode: CodeNode = {
              id: symbolId,
              name: node.id.name,
              type: 'class',
              path: file.path,
              language,
              lines: { start: node.loc!.start.line, end: node.loc!.end.line },
              metrics: {
                loc: node.loc!.end.line - node.loc!.start.line + 1,
                complexity: 1,
              },
            };
            nodes.push(symbolNode);
            edges.push({ source: fileNode.id, target: symbolId, type: 'contains' });
          }
          // Import declarations
          else if (node.type === 'ImportDeclaration') {
            const specifier = node.source.value;
            fileNode.imports!.push(specifier);

            let moduleId = moduleNodeMap.get(specifier);
            if (!moduleId) {
              moduleId = `module:${specifier}`;
              const moduleNode: CodeNode = {
                id: moduleId,
                name: specifier,
                type: 'module',
                path: specifier,
                language: 'javascript',
                lines: { start: 0, end: 0 },
                imports: [],
                exports: [],
              };
              nodes.push(moduleNode);
              moduleNodeMap.set(specifier, moduleId);
            }

            edges.push({ source: fileNode.id, target: moduleId, type: 'imports' });
          }
          // Export named declarations
          else if (node.type === 'ExportNamedDeclaration') {
            if (node.specifiers && node.specifiers.length > 0) {
              for (const spec of node.specifiers) {
                const name =
                  spec.exported.type === 'Identifier'
                    ? spec.exported.name
                    : String(spec.exported);
                fileNode.exports!.push(name);
              }
            }
          }
          // Export all declarations
          else if (node.type === 'ExportAllDeclaration') {
            fileNode.exports!.push('*');
          }
        }
      } catch (err) {
        console.warn(`Failed to parse ${file.path}:`, err);
      }
    }

    return {
      nodes,
      edges,
      metadata: {
        projectName: 'CodeVista',
        totalFiles: nodes.length,
        analyzedAt: new Date().toISOString(),
        analyzerVersion: '0.0.3',
      },
    };
  }

  private detectLanguage(extension?: string): string {
    const langMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      mjs: 'javascript',
      cjs: 'javascript',
      py: 'python',
      java: 'java',
      go: 'go',
      rs: 'rust',
      cs: 'csharp',
      cpp: 'cpp',
      c: 'c',
      h: 'c',
      hpp: 'cpp',
    };
    return extension ? langMap[extension] || 'unknown' : 'unknown';
  }

  private generateNodeId(filePath: string): string {
    return Buffer.from(filePath).toString('base64').replace(/[^a-zA-Z0-9_]/g, '_');
  }

  async getProjectInfo(): Promise<ProjectInfo> {
    const files = await FileWalker.walk({
      root: this.projectPath,
      includePatterns: DEFAULT_INCLUDE_PATTERNS,
      excludePatterns: DEFAULT_EXCLUDE_PATTERNS,
      maxDepth: 20,
      followSymlinks: false,
    });

    const languages: Record<string, number> = {};
    for (const file of files) {
      const lang = this.detectLanguage(file.extension);
      languages[lang] = (languages[lang] || 0) + 1;
    }

    const format = await this.detectProjectFormat();

    return {
      name: path.basename(this.projectPath),
      format,
      path: this.projectPath,
      languages,
      totalFiles: files.length,
      lastAnalyzed: new Date().toISOString(),
    };
  }

  private async detectProjectFormat(): Promise<ProjectInfo['format']> {
    try {
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      await fs.promises.access(packageJsonPath);
      const content = await fs.promises.readFile(packageJsonPath, 'utf-8');
      const pkg = JSON.parse(content);

      if (pkg.dependencies?.react || pkg.devDependencies?.react) return 'react';
      if (pkg.dependencies?.vue || pkg.devDependencies?.vue) return 'vue';
      if (pkg.dependencies?.['@angular/core'] || pkg.devDependencies?.['@angular/core']) return 'angular';
      if (pkg.dependencies?.svelte || pkg.devDependencies?.svelte) return 'svelte';
      return 'node';
    } catch {
      return 'generic';
    }
  }
}

export const createAnalyzer = (projectPath: string) => new CodeAnalyzer(projectPath);