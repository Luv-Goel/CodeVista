import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { VisualGraph, ViewState, CodeNode, GraphEdge } from '../types';
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
  const simulationRef = useRef<d3.Simulation<CodeNode, GraphEdge> | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    if (viewState.layout !== 'force') return;

    const svg = d3.select(svgRef.current);
    const graphGroup = svg.select<SVGGElement>('#graph-layer');

    // Stop existing simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
      simulationRef.current = null;
    }

    // Clear previous elements
    graphGroup.selectAll('*').remove();

    const nodes = graph.nodes;
    const edges = graph.edges;

    if (nodes.length === 0) return;

    // Ensure nodes have initial positions
    nodes.forEach(node => {
      if (node.x === undefined) node.x = Math.random() * 800;
      if (node.y === undefined) node.y = Math.random() * 600;
    });

    // Resolve edges to actual node objects (D3 forceLink expects source/target as node refs)
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const resolvedEdges: Array<GraphEdge & { source: CodeNode; target: CodeNode }> = edges
      .map(edge => {
        const src = nodeMap.get(edge.source);
        const tgt = nodeMap.get(edge.target);
        if (!src || !tgt) return null;
        return { ...edge, source: src, target: tgt };
      })
      .filter((e): e is GraphEdge & { source: CodeNode; target: CodeNode } => e !== null);

    // Create simulation
    const simulation = d3.forceSimulation<CodeNode>(nodes)
      .force('link', d3.forceLink<CodeNode, GraphEdge>(resolvedEdges).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(400, 300))
      .force('collide', d3.forceCollide().radius(25));

    simulationRef.current = simulation;

    // Render edges
    const linkSelection = graphGroup.selectAll<SVGLineElement, typeof resolvedEdges[0]>('.link')
      .data(resolvedEdges, d => `${d.source.id}-${d.target.id}`);

    const linkEnter = linkSelection.enter().append('line')
      .attr('class', 'link')
      .attr('marker-end', 'url(#arrowhead)')
      .attr('stroke', '#475569')
      .attr('stroke-width', 1.5);

    const allLinks = linkEnter.merge(linkSelection);

    // Render nodes
    const nodeSelection = graphGroup.selectAll<SVGCircleElement, CodeNode>('.node')
      .data(nodes, d => d.id);

    const nodeEnter = nodeSelection.enter().append('circle')
      .attr('class', 'node')
      .attr('r', 8)
      .attr('fill', d => {
        const colors: Record<string, string> = {
          file: '#3b82f6',
          folder: '#f59e0b',
          function: '#10b981',
          class: '#8b5cf6',
          method: '#ec4899',
          variable: '#64748b',
          interface: '#06b6d4',
          type: '#f97316',
          module: '#84cc16',
        };
        return colors[d.type] || '#94a3b8';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    // Event handlers (without unused params)
    nodeEnter
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeSelect(d.id);
      })
      .on('mouseover', (event, d) => {
        onNodeHover(d.id);
        d3.select(event.currentTarget as SVGCircleElement)
          .attr('stroke', '#fbbf24')
          .attr('stroke-width', 3);
      })
      .on('mouseout', (event) => {
        onNodeHover(undefined);
        d3.select(event.currentTarget as SVGCircleElement)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);
      });

    // Drag behavior
    const drag = d3.drag<SVGCircleElement, CodeNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeEnter.call(drag);

    const allNodes = nodeSelection.merge(nodeEnter);

    // Update positions on tick
    simulation.on('tick', () => {
      allLinks
        .attr('x1', d => d.source.x!)
        .attr('y1', d => d.source.y!)
        .attr('x2', d => d.target.x!)
        .attr('y2', d => d.target.y!);

      allNodes
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);
    });

    // Cleanup
    return () => {
      simulation.stop();
      simulationRef.current = null;
    };
  }, [graph, viewState.layout, onNodeSelect, onNodeHover]);

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

      <g
        id="graph-layer"
        transform={`translate(${viewState.pan.x}, ${viewState.pan.y}) scale(${viewState.zoom})`}
      />

      {/* Grid background */}
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
};
