# Contributing to CodeVista

Thanks for your interest in CodeVista! We're building an interactive code visualizer and would love your help.

## How to Contribute

### Report Bugs
Open an issue with:
- A clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and OS info

### Suggest Features
Open an issue tagged `enhancement` describing:
- What you'd like to see
- Why it'd be useful
- Any implementation ideas you have

### Submit Code

1. **Fork** the repo
2. **Create a branch**: `git checkout -b feat/your-feature`
3. **Make your changes**
4. **Run tests**: `npm test`
5. **Run lint**: `npm run lint`
6. **Commit** with a descriptive message:
   ```
   feat: add new visualization mode
   fix: resolve node inspector crash on edge case
   docs: update README with API examples
   ```
7. **Push** and open a Pull Request

### Development Setup

```bash
git clone https://github.com/Luv-Goel/CodeVista.git
cd CodeVista
npm install
npm run dev
```

### Code Style
- TypeScript with strict types
- Use functional components with hooks
- Format with Prettier (default config)
- Follow existing patterns in the codebase

### Testing
- Write tests for any new features
- Tests live in `__tests__` directories next to source files
- Run `npm test` before pushing

### Project Structure

```
src/
  components/   — React UI components
  services/     — Business logic (parsing, AI, file walking)
  stores/       — Zustand state management
  types/        — TypeScript type definitions
```

Thanks again! 🚀
