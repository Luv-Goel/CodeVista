import React from 'react';
import './DocsModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="docs-modal-overlay" onClick={onClose}>
      <div className="docs-modal-content" onClick={e => e.stopPropagation()}>
        <div className="docs-modal-header">
          <h2>CodeVista Documentation</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="docs-modal-body">
          <h3>What is CodeVista?</h3>
          <p>
            CodeVista is an AI-powered code visualizer designed to help developers comprehend large codebases rapidly. 
            It renders your codebase&apos;s Abstract Syntax Tree (AST) and dependencies into an interactive, force-directed graph.
          </p>
          
          <h3>How it Works</h3>
          <ol>
            <li><strong>AST Parsing:</strong> Code files are parsed using babel to extract relationships.</li>
            <li><strong>Graph Construction:</strong> Files and modules are mapped to nodes. Imports and exports are mapped to edges.</li>
            <li><strong>Visualization:</strong> A D3.js physics simulation organizes the nodes dynamically on your screen.</li>
          </ol>

          <h3>Controls</h3>
          <ul>
            <li><strong>Pan:</strong> Click and drag on the empty background grid.</li>
            <li><strong>Zoom:</strong> Use your mouse wheel or the +/- buttons on the right control panel.</li>
            <li><strong>Layouts:</strong> Switch between Force, Radial, Tree, and Hierarchical views from the panel.</li>
            <li><strong>Export:</strong> Click &quot;Export as SVG&quot; to save your architecture diagram to disk.</li>
          </ul>

          <h3>About the Author</h3>
          <p>
            Built by Luv Goel. Check out my GitHub page for more projects:
            <br />
            <a href="https://github.com/Luv-Goel" target="_blank" rel="noopener noreferrer" className="github-link">
              ?? github.com/Luv-Goel
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

