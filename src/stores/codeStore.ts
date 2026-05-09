import { create } from 'zustand';
import { VisualGraph, ViewState, ProjectInfo, AIAnalysis } from '../types';

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
      // For now, initialize with placeholder state
      // In the real app, this would load project configuration, scan for files, etc.
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulated delay

      const placeholderGraph: VisualGraph = {
        nodes: [],
        edges: [],
        metadata: {
          projectName: 'CodeVista',
          totalFiles: 0,
          analyzedAt: new Date().toISOString(),
          analyzerVersion: '0.0.1',
        },
      };

      set({
        graph: placeholderGraph,
        projectInfo: {
          name: 'CodeVista',
          format: 'react',
          path: '',
          languages: {},
          totalFiles: 0,
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
