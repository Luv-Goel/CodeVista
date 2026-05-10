import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Mock the code store
jest.mock('../stores/codeStore', () => ({
  useCodeStore: jest.fn(() => ({
    initialize: jest.fn().mockResolvedValue(undefined),
  })),
}));

// Mock child components to simplify testing
jest.mock('../components/CodeVisualizer', () => ({
  CodeVisualizer: () => <div data-testid="code-visualizer">CodeVisualizer Mock</div>,
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<App />);
    expect(screen.getByText(/Loading CodeVista/i)).toBeInTheDocument();
  });

  test('renders app header after loading', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('🧭 CodeVista')).toBeInTheDocument();
    });
  });

  test('renders the CodeVisualizer component after initialization', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('code-visualizer')).toBeInTheDocument();
    });
  });

  test('renders the footer with GitHub link', async () => {
    render(<App />);
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /View on GitHub/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', 'https://github.com/Luv-Goel/CodeVista');
    });
  });

  test('renders AI-Powered tagline', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('AI-Powered Code Visualizer')).toBeInTheDocument();
    });
  });

  test('displays loading screen while initializing', () => {
    // Don't resolve the initialize promise so loading persists
    const mockInitialize = jest.fn(() => new Promise(() => {}));
    (require('../stores/codeStore').useCodeStore as jest.Mock).mockReturnValue({
      initialize: mockInitialize,
    });

    render(<App />);
    expect(screen.getByText(/Loading CodeVista/i)).toBeInTheDocument();
  });
});
