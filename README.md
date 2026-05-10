# CodeVista ðŸ—ºï¸

<div align="center">

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)]()
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)]()
[![D3.js](https://img.shields.io/badge/D3.js-7-FF6B35?logo=d3dotjs)]()
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)]()

**AI-powered code visualizer â€” transform any codebase into an interactive visual mind map.**

</div>

---

## Overview

CodeVista turns complex codebases into beautiful, interactive force-directed graphs. Explore your project's structure, understand dependencies, and discover patterns â€” all in your browser.

Built with React, TypeScript, D3.js, and powered by OpenRouter AI for intelligent code analysis.

## Features

- ðŸŽ¯ **Force-directed graph** â€” Interactive visualization of codebase structure
- ðŸ–±ï¸ **Zoom & pan** â€” Smooth navigation through large code graphs
- ðŸ” **Node selection** â€” Click to inspect any file or module
- ðŸ·ï¸ **Smart icons** â€” Visual indicators for file types (components, utils, hooks, etc.)
- ðŸ“ **File system walker** â€” Glob pattern support for any project structure
- ðŸ¤– **AI analysis** â€” OpenRouter integration for intelligent code insights
- ðŸ“Š **Real-time updates** â€” State management with Zustand
- ðŸŽ¨ **Beautiful UI** â€” Modern React with TypeScript type safety

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript 5 |
| Visualization | D3.js (force simulation) |
| Build | Vite 6 |
| State | Zustand |
| AI | OpenRouter API |
| Styling | CSS Modules |

## Quick Start

```bash
# Clone and install
git clone https://github.com/Luv-Goel/CodeVista.git
cd CodeVista
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
CodeVista/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/     # React components
â”‚   â”œâ”€â”€ store/          # Zustand state management
â”‚   â”œâ”€â”€ utils/          # Utility functions
â”‚   â”œâ”€â”€ hooks/          # Custom React hooks
â”‚   â”œâ”€â”€ App.tsx         # Main application
â”‚   â””â”€â”€ main.tsx        # Entry point
â”œâ”€â”€ public/
â”œâ”€â”€ index.html
â”œâ”€â”€ package.json
â””â”€â”€ vite.config.ts
```

## Usage

1. **Start the app** â€” `npm run dev` opens the visualizer
2. **Point to a codebase** â€” Enter a local path or GitHub URL
3. **Explore the graph** â€” Pan, zoom, click nodes to inspect
4. **AI insights** â€” Let AI analyze code patterns and dependencies

## License

MIT
