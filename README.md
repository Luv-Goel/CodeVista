# CodeVista 🗺️

<div align="center">

[![CI](https://github.com/Luv-Goel/CodeVista/actions/workflows/ci.yml/badge.svg)](https://github.com/Luv-Goel/CodeVista/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)]()
[![npm](https://img.shields.io/badge/npm-v0.1.0-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)]()
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)]()
[![D3.js](https://img.shields.io/badge/D3.js-7-FF6B35?logo=d3dotjs)]()
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)]()
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)]()
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)]()
[![GitHub Stars](https://img.shields.io/github/stars/Luv-Goel/CodeVista?style=social)]()

**AI-powered code visualizer — transform any codebase into an interactive visual mind map.**

CodeVista parses your project's AST (Abstract Syntax Tree), extracts import/dependency relationships, and renders them as a real-time force-directed graph using D3.js. An integrated AI layer (via OpenRouter) provides intelligent code pattern analysis on top of the graph.

</div>

---

## How It Works

```
  Your Codebase
       │
       ▼
  ┌───────────────┐
  │  AST Parser      │  ←─ @babel/parser (JS/TS/JSX/TSX)
  │  + File Walker   │  ←─ glob pattern traversal
  └───────┬───────┘
           │
           ▼
  ┌───────────────┐
  │  Graph Builder   │  ←─ nodes = files/modules, edges = imports
  └───────┬───────┘
           │
     ┌────┴────┐
     ▼          ▼
  ┌────────┐  ┌───────────┐
  │ D3.js    │  │ AI Service │  ←─ OpenRouter API
  │ Force    │  │ (insights) │
  │ Graph    │  └───────────┘
  └────────┘
       │
       ▼
  Interactive Visual
  (zoom, pan, click-to-inspect)
```

---

## Quick Demo

```
┌─────────────────────────────────────────────────────────┐
│                    CodeVista Viewer                      │
├─────────────────────────────────────────────────────────┤
│  🗂️ Project Explorer                                    │
│   │                                                      │
│   ├── 📁 src/                              ┌────────┐  │
│   │   ├── 📄 App.tsx ────── imports ──────▶│  🧩    │  │
│   │   ├── 📄 main.tsx                      │ React  │  │
│   │   ├── 📁 components/       ┌────────┐  │ Router │  │
│   │   │   ├── 🧩 CodeVisualizer│  🧩    │  └────────┘  │
│   │   │   ├── 🧩 ControlPanel  │ Store  │               │
│   │   │   └── 🧩 NodeInspector └────────┘               │
│   │   ├── 📁 stores/                                    │
│   │   │   └── codeStore.ts ── zustand                   │
│   │   ├── 📁 services/                                  │
│   │   │   ├── astParser.ts                              │
│   │   │   ├── fileWalker.ts                             │
│   │   │   └── aiService.ts                              │
│   │   └── 📁 types/                                     │
│   │       └── index.ts                                  │
│   └── 📄 package.json                                   │
│                                                         │
│   [🔍 Zoom] [✋ Pan] [🎯 Inspect] [🔄 Reset]          │
└─────────────────────────────────────────────────────────┘
```

*CodeVista turns your project files into an interactive, explorable force-directed graph.*

---

## Features

- 🎯 **Force-directed graph** — Interactive D3.js visualization of codebase structure
- 🖥️ **Zoom & pan** — Smooth navigation through large code graphs
- 🔍 **Node selection** — Click to inspect any file or module
- 🏷️ **Smart icons** — Visual indicators for file types (components, utils, hooks, etc.)
- 📁 **File system walker** — Glob pattern support for any project structure
- 🧠 **AI analysis** — OpenRouter integration for intelligent code insights
- 📊 **Real-time updates** — State management with Zustand
- 🎨 **Beautiful UI** — Modern React with TypeScript type safety
- 🐳 **Docker support** — Ready-to-deploy container image

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript 5 |
| Visualization | D3.js (force simulation) |
| Build | Vite 5 |
| State | Zustand |
| AI | OpenRouter API |
| Styling | CSS Modules |
| Container | Docker + Nginx |

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

## Deployment

### Docker (recommended)

```bash
# Build the image
docker build -t codevista .

# Run the container
docker run -d -p 8080:80 --name codevista-app codevista
```

The Docker image serves the production build via Nginx with:
- Gzip compression
- Security headers (CSP, XSS protection)
- SPA routing support
- Static asset caching

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?project-name=codevista&repository-url=https%3A%2F%2Fgithub.com%2FLuv-Goel%2FCodeVista)

1. Push the repo to GitHub
2. Import to Vercel
3. Set build command: `npm run build`
4. Set output directory: `dist`

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Luv-Goel/CodeVista)

1. Connect your GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add redirect rule: `/* /index.html 200` (for SPA routing)

### Static Hosting

Any static file host works with the `dist/` folder:

```bash
npm run build
# Deploy the dist/ folder to your host of choice
```

## Project Structure

```
CodeVista/
├── src/
│   ├── components/       # React components
│   │   ├── CodeVisualizer/
│   │   ├── ControlPanel/
│   │   ├── NodeInspector/
│   │   └── VisualizationCanvas/
│   ├── services/         # Business logic
│   │   ├── astParser.ts   # @babel/parser wrapper
│   │   ├── fileWalker.ts  # File system traversal
│   │   └── aiService.ts   # OpenRouter API client
│   ├── stores/           # Zustand state stores
│   ├── types/            # TypeScript type definitions
│   ├── __tests__/        # Component tests
│   ├── App.tsx           # Main application
│   ├── App.css           # Application styles
│   ├── index.css         # Global styles
│   └── main.tsx          # Entry point
├── public/
├── dist/                 # Production build output
├── Dockerfile            # Multi-stage Docker build
├── nginx.conf            # Nginx configuration for Docker
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── jest.config.js
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
- [Security](SECURITY.md) — Security policy

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">
  <sub>Built by the CodeVista Team</sub>
</div>
