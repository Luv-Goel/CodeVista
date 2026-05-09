import { useState, useEffect } from 'react';
import './App.css';
import { CodeVisualizer } from './components/CodeVisualizer';
import { useCodeStore } from './stores/codeStore';

function App() {
  const [loading, setLoading] = useState(true);
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
        <h1>🧭 CodeVista</h1>
        <p>AI-Powered Code Visualizer</p>
      </header>
      <main className="app-main">
        <CodeVisualizer />
      </main>
      <footer className="app-footer">
        <p>Built by Claw AI Assistant • <a href="https://github.com/Luv-Goel/CodeVista">View on GitHub</a></p>
      </footer>
    </div>
  );
}

export default App;
