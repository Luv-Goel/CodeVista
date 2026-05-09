import { CodeNode, GraphEdge, VisualGraph, ProjectInfo } from '../types';
import path from 'path';
import { FileWalker } from './fileWalker';
import { promises as fs } from 'fs';

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

  constructor(projectPath: string) {
    this.projectPath = projectPath;
  }

  async analyze(): Promise<VisualGraph> {
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

    // Step 2: Build basic file nodes (placeholder for AST parsing)
    for (const file of files) {
      const language = this.detectLanguage(file.extension);

      const node: CodeNode = {
        id: this.generateNodeId(file.path),
        name: path.basename(file.path),
        type: 'file',
        path: file.path,
        language,
        lines: {
          start: 1,
          end: 1, // Will be filled by parser later
        },
      };

      nodes.push(node);
    }

    // Step 3: Build basic folder hierarchy (optional, can be expanded)
    // For now, we just return file nodes. AST parsing and edge building will come later.

    return {
      nodes,
      edges,
      metadata: {
        projectName: 'CodeVista',
        totalFiles: nodes.length,
        analyzedAt: new Date().toISOString(),
        analyzerVersion: '0.0.2',
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
    // Create a stable ID based on the file path
    return Buffer.from(filePath).toString('base64').replace(/[^a-zA-Z0-9_]/g, '_');
  }

  async getProjectInfo(): Promise<ProjectInfo> {
    // Use the file walker to count files by language
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

    // Detect project format based on presence of config files
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
      await fs.access(packageJsonPath);
      const content = await fs.readFile(packageJsonPath, 'utf-8');
      const pkg = JSON.parse(content);

      if (pkg.dependencies?.react || pkg.devDependencies?.react) {
        return 'react';
      }
      if (pkg.dependencies?.vue || pkg.devDependencies?.vue) {
        return 'vue';
      }
      if (pkg.dependencies?.['@angular/core'] || pkg.devDependencies?.['@angular/core']) {
        return 'angular';
      }
      if (pkg.dependencies?.svelte || pkg.devDependencies?.svelte) {
        return 'svelte';
      }
      return 'node';
    } catch {
      // Check for other project types
      // For now, just return generic
      return 'generic';
    }
  }
}

export const createAnalyzer = (projectPath: string) => new CodeAnalyzer(projectPath);
