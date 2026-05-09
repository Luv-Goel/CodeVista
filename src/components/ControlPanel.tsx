import React from 'react';
import { useCodeStore } from '../stores/codeStore';
import { ViewState } from '../types';
import './ControlPanel.css';

export const ControlPanel: React.FC = () => {
  const { viewState, setViewState, graph, analyzeProject, isLoading } = useCodeStore();

  const handleZoomIn = () => setViewState({ zoom: viewState.zoom * 1.2 });
  const handleZoomOut = () => setViewState({ zoom: viewState.zoom / 1.2 });
  const handleReset = () => setViewState({ zoom: 1, pan: { x: 0, y: 0 } });

  const handleLayoutChange = (layout: ViewState['layout']) => {
    setViewState({ layout });
  };

  return (
    <div className="control-panel">
      <div className="panel-section">
        <h3>View Controls</h3>
        <div className="button-group">
          <button onClick={handleZoomIn} title="Zoom In">＋</button>
          <button onClick={handleZoomOut} title="Zoom Out">－</button>
          <button onClick={handleReset} title="Reset View">⟲</button>
        </div>
        <div className="zoom-level">{Math.round(viewState.zoom * 100)}%</div>
      </div>

      <div className="panel-section">
        <h3>Layout</h3>
        <div className="button-group vertical">
          {(['force', 'tree', 'radial', 'hierarchical'] as const).map((layout) => (
            <button
              key={layout}
              className={viewState.layout === layout ? 'active' : ''}
              onClick={() => handleLayoutChange(layout)}
            >
              {layout.charAt(0).toUpperCase() + layout.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3>Project</h3>
        <div className="project-stats">
          {graph && (
            <>
              <div className="stat">
                <span className="label">Nodes</span>
                <span className="value">{graph.nodes.length}</span>
              </div>
              <div className="stat">
                <span className="label">Edges</span>
                <span className="value">{graph.edges.length}</span>
              </div>
            </>
          )}
        </div>
        <button
          className="primary"
          onClick={analyzeProject}
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Project'}
        </button>
      </div>

      <div className="panel-section">
        <h3>AI Analysis</h3>
        <button className="secondary" disabled>
          Generate Suggestions
        </button>
        <p className="hint">Coming in v0.2.0</p>
      </div>
    </div>
  );
};
