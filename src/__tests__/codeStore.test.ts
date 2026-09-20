import { renderHook, act } from '@testing-library/react';
import { useCodeStore } from '../stores/codeStore';

describe('codeStore', () => {
  beforeEach(() => {
    // Reset state before each test
    const { result } = renderHook(() => useCodeStore());
    act(() => {
      result.current.resetView();
      result.current.setGraph({ nodes: [], edges: [], metadata: { projectName: '', totalFiles: 0, analyzedAt: '', analyzerVersion: '' } });
    });
  });

  test('should initialize with default state', () => {
    const { result } = renderHook(() => useCodeStore());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.viewState.zoom).toBe(1);
    expect(result.current.viewState.pan).toEqual({ x: 0, y: 0 });
  });

  test('updateZoom should update zoom correctly', () => {
    const { result } = renderHook(() => useCodeStore());
    act(() => {
      result.current.updateZoom(2.5);
    });
    expect(result.current.viewState.zoom).toBe(2.5);
  });

  test('pan should update pan correctly', () => {
    const { result } = renderHook(() => useCodeStore());
    act(() => {
      result.current.pan(100, 50);
    });
    expect(result.current.viewState.pan).toEqual({ x: 100, y: 50 });
  });
});
