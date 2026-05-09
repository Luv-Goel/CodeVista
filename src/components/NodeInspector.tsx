import React from 'react';
import { useCodeStore } from '../stores/codeStore';
import './NodeInspector.css';

export const NodeInspector: React.FC = () => {
  const { graph, viewState, selectNode } = useCodeStore();
  const selectedNode = graph?.nodes.find(n => n.id === viewState.selectedNode);

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="node-inspector">
      <div className="inspector-header">
        <h3>Node Details</h3>
        <button
          className="close-btn"
          onClick={() => selectNode(undefined)}
        >
          ✕
        </button>
      </div>

      <div className="inspector-content">
        <div className="field">
          <span className="label">Name</span>
          <span className="value">{selectedNode.name}</span>
        </div>

        <div className="field">
          <span className="label">Type</span>
          <span className="value badge">{selectedNode.type}</span>
        </div>

        <div className="field">
          <span className="label">Path</span>
          <span className="value mono">{selectedNode.path}</span>
        </div>

        {selectedNode.language && (
          <div className="field">
            <span className="label">Language</span>
            <span className="value">{selectedNode.language}</span>
          </div>
        )}

        {selectedNode.lines && (
          <div className="field">
            <span className="label">Lines</span>
            <span className="value">
              {selectedNode.lines.start} - {selectedNode.lines.end}
              <span className="count">({selectedNode.lines.end - selectedNode.lines.start + 1})</span>
            </span>
          </div>
        )}

        {selectedNode.metrics && (
          <>
            <div className="field">
              <span className="label">Complexity</span>
              <span className="value">{selectedNode.metrics.complexity ?? 'N/A'}</span>
            </div>
            <div className="field">
              <span className="label">LOC</span>
              <span className="value">{selectedNode.metrics.loc ?? 'N/A'}</span>
            </div>
          </>
        )}

        {selectedNode.imports && selectedNode.imports.length > 0 && (
          <div className="field">
            <span className="label">Imports</span>
            <div className="list">
              {selectedNode.imports.slice(0, 5).map(imp => (
                <span key={imp} className="chip">{imp}</span>
              ))}
              {selectedNode.imports.length > 5 && (
                <span className="chip more">+{selectedNode.imports.length - 5}</span>
              )}
            </div>
          </div>
        )}

        {selectedNode.children && selectedNode.children.length > 0 && (
          <div className="field">
            <span className="label">Children</span>
            <div className="list">
              {selectedNode.children.slice(0, 5).map(child => (
                <span key={child.id} className="chip">{child.name}</span>
              ))}
              {selectedNode.children.length > 5 && (
                <span className="chip more">+{selectedNode.children.length - 5}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
