# Architecture

CodeVista follows a modular React architecture with clear separation of concerns.

## Overview

```
┌─────────────────┐     ┌──────────────┐     ┌──────────────┐
│   React UI      │────▶│  Services    │────▶│  AI / Parser │
│  (Components)   │     │  (Logic)     │     │  (Analysis)  │
└────────┬────────┘     └──────┬───────┘     └──────────────┘
         │                     │
         ▼                     ▼
┌─────────────────┐     ┌──────────────┐
│  D3.js          │     │  Zustand     │
│  Visualization  │     │  State Store │
└─────────────────┘     └──────────────┘
```

## Directory Structure

```
src/
├── components/          # React UI components
│   ├── CodeVisualizer       # Main graph container
│   ├── ControlPanel         # Settings and controls sidebar
│   ├── NodeInspector        # Details panel for selected node
│   └── VisualizationCanvas  # D3.js SVG container
├── services/            # Business logic layer
│   ├── aiService            # OpenRouter AI integration
│   ├── astParser            # TypeScript AST parsing
│   ├── codeAnalyzer         # Code structure analysis
│   └── fileWalker           # File system traversal
├── stores/              # Zustand state management
│   └── codeStore            # Global application state
├── types/               # TypeScript type definitions
│   └── index.ts             # Shared types
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

## Data Flow

1. **File Walker** scans the target directory using glob patterns
2. **AST Parser** parses TypeScript/JavaScript files to extract structure
3. **Code Analyzer** computes metrics and relationships
4. **Zustand Store** holds all parsed data and UI state
5. **D3.js Visualization** renders the force-directed graph from store data
6. **React Components** provide controls, overlays, and inspector panels

## State Management

The Zustand store (`codeStore.ts`) manages:
- `nodes` / `edges` — Graph data for D3 rendering
- `selectedNode` — Currently inspected node
- `filters` — Active node type filters
- `loading` / `error` — Async operation states
- `settings` — Visualization parameters (zoom, gravity, etc.)

## Key Technologies

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React 18 | Component model, hooks, wide ecosystem |
| Language | TypeScript 5 | Type safety for complex graph data |
| Visualization | D3.js 7 | Mature force simulation, SVG rendering |
| State | Zustand | Lightweight, TypeScript-first |
| AI | OpenRouter | Multi-model access via single API |
| Build | Vite 6 | Fast HMR, TypeScript-native |
| Cache | SQLite (better-sqlite3) | Zero-config, embedded persistence |
