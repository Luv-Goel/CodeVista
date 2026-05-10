import React from 'react';
import { useCodeStore } from '../stores/codeStore';
import { VisualizationCanvas } from './VisualizationCanvas';
import { ControlPanel } from './ControlPanel';
import { NodeInspector } from './NodeInspector';
import './CodeVisualizer.css';

export const CodeVisualizer: React.FC = () => {
  const { graph, viewState, selectNode, hoverNode } = useCodeStore();

  return (
    <div className="code-visualizer">
      <div className="visualization-area">
        {graph && graph.nodes.length > 0 ? (
          <VisualizationCanvas
            graph={graph}
            viewState={viewState}
            onNodeSelect={selectNode}
            onNodeHover={hoverNode}
          />
        ) : (
          <div className="placeholder">
            <h2>🚧 Under Construction</h2>
            <p>The visualization engine is under active development.</p>
            <p>Check back soon!</p>
            <div className="progress-indicator">
              <div className="spinner"></div>
            </div>
          </div>
        )}
      </div>

      <ControlPanel />

      <NodeInspector />
    </div>
  );
};
