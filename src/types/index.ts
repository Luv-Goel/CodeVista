// Core types for CodeVista

export interface CodeNode {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'function' | 'class' | 'method' | 'variable' | 'interface' | 'type' | 'module';
  path: string;
  children?: CodeNode[];
  imports?: string[]; // IDs of imported nodes
  exports?: string[]; // IDs of exported nodes
  dependencies?: string[]; // IDs of dependent nodes
  lines?: {
    start: number;
    end: number;
  };
  language?: string;
  metrics?: {
    complexity?: number;
    loc?: number;
    testCoverage?: number;
  };
  astData?: Record<string, any>;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: 'imports' | 'calls' | 'inherits' | 'contains' | 'references';
  weight?: number;
}

export interface VisualGraph {
  nodes: CodeNode[];
  edges: GraphEdge[];
  metadata: {
    projectName: string;
    totalFiles: number;
    analyzedAt: string;
    analyzerVersion: string;
  };
}

export interface AnalysisConfig {
  includePatterns: string[];
  excludePatterns: string[];
  maxDepth: number;
  includeMetrics: boolean;
  enableAI: boolean;
  openRouterKey?: string;
}

export interface ViewState {
  selectedNode?: string;
  hoveredNode?: string;
  zoom: number;
  pan: { x: number; y: number };
  layout: 'force' | 'tree' | 'radial' | 'hierarchical';
  filters: {
    nodeTypes: CodeNode['type'][];
    minComplexity?: number;
    searchQuery?: string;
  };
}

export interface AIAnalysis {
  suggestions: CodeSuggestion[];
  patterns: DetectedPattern[];
  insights: Insight[];
}

export interface CodeSuggestion {
  nodeId: string;
  type: 'refactor' | 'optimize' | 'security' | 'test' | 'document';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  codeChanges?: string;
}

export interface DetectedPattern {
  name: string;
  nodes: string[];
  description: string;
  recommendation: string;
}

export interface Insight {
  category: 'architecture' | 'quality' | 'performance' | 'maintainability';
  summary: string;
  details: string;
  confidence: number;
}

export type ProjectFormat = 'react' | 'vue' | 'angular' | 'svelte' | 'node' | 'python' | 'java' | 'go' | 'rust' | 'generic';

export interface ProjectInfo {
  name: string;
  format: ProjectFormat;
  path: string;
  languages: Record<string, number>; // language -> file count
  totalFiles: number;
  lastAnalyzed: string;
}
