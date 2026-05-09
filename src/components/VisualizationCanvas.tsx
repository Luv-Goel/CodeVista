import React, { useRef, useEffect } from 'react';
import { VisualGraph, ViewState, CodeNode } from '../types';
import './VisualizationCanvas.css';

interface Props {
  graph: VisualGraph;
  viewState: ViewState;
  onNodeSelect: (nodeId: string | undefined) => void;
  onNodeHover: (nodeId: string | undefined) => void;
}

export const VisualizationCanvas: React.FC<Props> = ({
  graph,
  viewState,
  onNodeSelect,
  onNodeHover,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Placeholder: will be replaced with D3 force simulation
  const renderPlaceholder = () => {
    return (
      <g transform={`translate(${viewState.pan.x}, ${viewState.pan.y}) scale(${viewState.zoom})`}>
        <text x="400" y="300" textAnchor="middle" fill="#94a3b8" fontSize="24">
          Visualization Canvas
        </text>
        <text x="400" y="340" textAnchor="middle" fill="#64748b" fontSize="16">
          D3.js Force Simulation Coming Soon
        </text>
        <text x="400" y="370" textAnchor="middle" fill="#64748b" fontSize="14">
          {graph.nodes.length} nodes, {graph.edges.length} edges
        </text>
      </g>
    );
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target === svgRef.current) {
      onNodeSelect(undefined);
    }
  };

  return (
    <svg
      ref={svgRef}
      className="visualization-canvas"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid meet"
      onClick={handleSvgClick}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
        </marker>
      </defs>

      {renderPlaceholder()}

      {/* Grid background */}
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
};
