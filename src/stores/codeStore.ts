import { create } from 'zustand';
import { VisualGraph, ViewState, ProjectInfo, AIAnalysis, CodeNode, GraphEdge } from '../types';

interface CodeStore {
  // State
  graph: VisualGraph | null;
  projectInfo: ProjectInfo | null;
  viewState: ViewState;
  analysis: AIAnalysis | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setGraph: (graph: VisualGraph) => void;
  setProjectInfo: (info: ProjectInfo) => void;
  setViewState: (state: Partial<ViewState>) => void;
  setAnalysis: (analysis: AIAnalysis) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  selectNode: (nodeId: string | undefined) => void;
  hoverNode: (nodeId: string | undefined) => void;
  updateZoom: (zoom: number) => void;
  pan: (x: number, y: number) => void;
  resetView: () => void;
  initialize: () => Promise<void>;
  analyzeProject: () => Promise<void>;
}

const defaultViewState: ViewState = {
  zoom: 1,
  pan: { x: 0, y: 0 },
  layout: 'force',
  filters: {
    nodeTypes: ['file', 'folder', 'function', 'class', 'method'],
    searchQuery: '',
  },
};

export const useCodeStore = create<CodeStore>((set) => ({
  graph: null,
  projectInfo: null,
  viewState: defaultViewState,
  analysis: null,
  isLoading: false,
  error: null,

  setGraph: (graph) => set({ graph }),
  setProjectInfo: (info) => set({ projectInfo: info }),
  setViewState: (state) => set((prev) => ({ viewState: { ...prev.viewState, ...state } })),
  setAnalysis: (analysis) => set({ analysis }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  selectNode: (nodeId) => set((prev) => ({
    viewState: { ...prev.viewState, selectedNode: nodeId }
  })),

  hoverNode: (nodeId) => set((prev) => ({
    viewState: { ...prev.viewState, hoveredNode: nodeId }
  })),

  updateZoom: (zoom) => set((prev) => ({
    viewState: { ...prev.viewState, zoom: Math.max(0.1, Math.min(5, zoom)) }
  })),

  pan: (x, y) => set((prev) => ({
    viewState: { ...prev.viewState, pan: { x: prev.viewState.pan.x + x, y: prev.viewState.pan.y + y } }
  })),

  resetView: () => set({ viewState: defaultViewState }),

  initialize: async () => {
    set({ isLoading: true, error: null });

    try {
      // Initialize with sample demo data for showcasing the visualizer
      const sampleNodes: CodeNode[] = [
        { id: 'file:main', name: 'main.ts', type: 'file', path: '/src/main.ts', language: 'typescript', lines: { start: 1, end: 50 } },
        { id: 'file:app', name: 'App.tsx', type: 'file', path: '/src/App.tsx', language: 'typescript', lines: { start: 1, end: 80 } },
        { id: 'file:store', name: 'codeStore.ts', type: 'file', path: '/src/stores/codeStore.ts', language: 'typescript', lines: { start: 1, end: 120 } },
        { id: 'func:main', name: 'main()', type: 'function', path: '/src/main.ts', language: 'typescript', lines: { start: 5, end: 15 }, metrics: { complexity: 1, loc: 11 } },
        { id: 'func:render', name: 'render()', type: 'function', path: '/src/App.tsx', language: 'typescript', lines: { start: 20, end: 35 }, metrics: { complexity: 1, loc: 16 } },
        { id: 'class:store', name: 'CodeStore', type: 'class', path: '/src/stores/codeStore.ts', language: 'typescript', lines: { start: 10, end: 100 }, metrics: { complexity: 3, loc: 91 } },
        { id: 'method:select', name: 'selectNode()', type: 'method', path: '/src/stores/codeStore.ts', language: 'typescript', lines: { start: 30, end: 40 }, metrics: { complexity: 1, loc: 11 } },
        { id: 'method:zoom', name: 'updateZoom()', type: 'method', path: '/src/stores/codeStore.ts', language: 'typescript', lines: { start: 45, end: 52 }, metrics: { complexity: 1, loc: 8 } },
        { id: 'interface:props', name: 'Props', type: 'interface', path: '/src/types/index.ts', language: 'typescript', lines: { start: 1, end: 20 }, metrics: { complexity: 1, loc: 20 } },
        { id: 'type:node', name: 'CodeNode', type: 'type', path: '/src/types/index.ts', language: 'typescript', lines: { start: 22, end: 45 }, metrics: { complexity: 1, loc: 24 } },
        { id: 'folder:src', name: 'src/', type: 'folder', path: '/src', language: undefined, lines: { start: 1, end: 500 } },
        { id: 'module:react', name: 'react', type: 'module', path: 'react', language: 'javascript', lines: { start: 0, end: 0 } },
      ];

      const sampleEdges: GraphEdge[] = [
        { source: 'file:main', target: 'func:main', type: 'contains' },
        { source: 'file:app', target: 'func:render', type: 'contains' },
        { source: 'file:app', target: 'interface:props', type: 'references' },
        { source: 'file:store', target: 'class:store', type: 'contains' },
        { source: 'class:store', target: 'method:select', type: 'contains' },
        { source: 'class:store', target: 'method:zoom', type: 'contains' },
        { source: 'file:store', target: 'type:node', type: 'contains' },
        { source: 'file:app', target: 'file:store', type: 'imports' },
        { source: 'file:store', target: 'file:main', type: 'imports' },
        { source: 'file:app', target: 'module:react', type: 'imports' },
        { source: 'file:store', target: 'module:react', type: 'imports' },
        { source: 'folder:src', target: 'file:main', type: 'contains' },
        { source: 'folder:src', target: 'file:app', type: 'contains' },
        { source: 'folder:src', target: 'file:store', type: 'contains' },
      ];

      const placeholderGraph: VisualGraph = {
        nodes: sampleNodes,
        edges: sampleEdges,
        metadata: {
          projectName: 'CodeVista Demo',
          totalFiles: sampleNodes.filter(n => n.type === 'file').length,
          analyzedAt: new Date().toISOString(),
          analyzerVersion: '0.0.1',
        },
      };

      set({
        graph: placeholderGraph,
        projectInfo: {
          name: 'CodeVista Demo',
          format: 'react',
          path: '',
          languages: { typescript: 3 },
          totalFiles: 3,
          lastAnalyzed: new Date().toISOString(),
        },
        isLoading: false,
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', isLoading: false });
    }
  },

  analyzeProject: async () => {
    set({ isLoading: true, error: null });

    try {
      // Placeholder for actual analysis logic
      // This would:
      // 1. Scan files in the configured project path
      // 2. Parse code into AST
      // 3. Build dependency graph
      // 4. Optionally run AI analysis

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay

      set({ isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', isLoading: false });
    }
  },
}));
