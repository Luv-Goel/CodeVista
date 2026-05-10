# CodeVista 🗺️

<div align="center">

[![CI](https://github.com/Luv-Goel/CodeVista/actions/workflows/ci.yml/badge.svg)](https://github.com/Luv-Goel/CodeVista/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)]()
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)]()
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)]()
[![D3.js](https://img.shields.io/badge/D3.js-7-FF6B35?logo=d3dotjs)]()
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**AI-powered code visualizer — transform any codebase into an interactive visual mind map.**

</div>

---

## Quick Demo

```
  ┌───────────────────────────────────────┐
  │                                       │
  │   🗂️ App.tsx                          │
  │    │                                  │
  │    ├── 🧩 Header                      │
  │    ├── 🧩 Sidebar ─── 🛠️ useAuth     │
  │    ├── 🧩 MainContent ── 📦 api       │
  │    │    │              └── 📦 utils   │
  │    │    └── 🧩 Footer                 │
  │    └── 🧩 Modal                       │
  │                                       │
  │   [Zoom] [Pan] [Inspect]             │
  └───────────────────────────────────────┘
```

*CodeVista turns your project files into an interactive, explorable graph.*

## Overview

CodeVista transforms complex codebases into beautiful, interactive force-directed graphs. Explore your project's structure, understand dependencies, and discover patterns — all in your browser.

Built with React, TypeScript, D3.js, and powered by OpenRouter AI for intelligent code analysis.

## Features

- 🎯 **Force-directed graph** — Interactive visualization of codebase structure
- 🖱️ **Zoom & pan** — Smooth navigation through large code graphs
- 🔍 **Node selection** — Click to inspect any file or module
- 🏷️ **Smart icons** — Visual indicators for file types (components, utils, hooks, etc.)
- 📁 **File system walker** — Glob pattern support for any project structure
- 🤖 **AI analysis** — OpenRouter integration for intelligent code insights
- 📊 **Real-time updates** — State management with Zustand
- 🎨 **Beautiful UI** — Modern React with TypeScript type safety

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
├── src/
│   ├── components/     # React components
│   ├── store/          # Zustand state management
│   ├── utils/          # Utility functions
│   ├── hooks/          # Custom React hooks
│   ├── App.tsx         # Main application
│   └── main.tsx        # Entry point
├── public/
├── index.html
├── package.json
└── vite.config.ts
```

## Usage

1. **Start the app** — `npm run dev` opens the visualizer
2. **Point to a codebase** — Enter a local path or GitHub URL
3. **Explore the graph** — Pan, zoom, click nodes to inspect
4. **AI insights** — Let AI analyze code patterns and dependencies

## Documentation

- [Architecture](docs/architecture.md) — Detailed architecture overview
- [Screenshots](docs/screenshots.md) — UI screenshots (coming soon)
- [Contributing](CONTRIBUTING.md) — How to contribute
- [Changelog](CHANGELOG.md) — Release history

## License

MIT — see [LICENSE](LICENSE).
