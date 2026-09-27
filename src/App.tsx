import { useState, useEffect } from 'react';
import './App.css';
import { CodeVisualizer } from './components/CodeVisualizer';
import { useCodeStore } from './stores/codeStore';
import { DocsModal } from './components/DocsModal';

function App() {
  const [loading, setLoading] = useState(true);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const { initialize } = useCodeStore();

  useEffect(() => {
    // Initialize the code store
    initialize().then(() => {
      setLoading(false);
    });
  }, [initialize]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader">Loading CodeVista...</div>
      </div>
    );
  }

  return (
    <div className="app">
            <header className="app-header">
        <div className="header-title">
          <h1>✨ CodeVista</h1>
          <p>AI-Powered Code Visualizer</p>
        </div>
        <nav className="header-nav">
          <button onClick={() => setIsDocsOpen(true)} className="nav-btn">Documentation</button>
          <a href="https://github.com/Luv-Goel/CodeVista" target="_blank" rel="noopener noreferrer" className="nav-link">GitHub</a>
          <a href="https://github.com/Luv-Goel" target="_blank" rel="noopener noreferrer" className="nav-link">Author</a>
        </nav>
      </header>
      <main className="app-main">
        <CodeVisualizer />
      </main>
      <footer className="app-footer">
        <p>Built by the CodeVista Team &bull; <a href="https://github.com/Luv-Goel/CodeVista">View on GitHub</a></p>
      </footer>
      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </div>
  );
}

export default App;

