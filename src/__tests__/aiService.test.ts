import { AIService, createAIService } from '../services/aiService';

describe('AIService', () => {
  test('analyzeNode returns empty array when no api key', async () => {
    const service = new AIService();
    const suggestions = await service.analyzeNode({
      id: 'file:main',
      name: 'main.ts',
      type: 'file',
      path: '/src/main.ts',
    });
    expect(suggestions).toEqual([]);
  });

  test('detectPatterns returns empty array as placeholder', async () => {
    const service = new AIService('test-key');
    const patterns = await service.detectPatterns([
      { id: 'n1', name: 'a', type: 'file', path: '/a.ts' },
    ]);
    expect(patterns).toEqual([]);
  });

  test('generateInsights returns empty array as placeholder', async () => {
    const service = new AIService('test-key');
    const insights = await service.generateInsights([]);
    expect(insights).toEqual([]);
  });

  test('batchAnalyze resolves without error', async () => {
    const service = new AIService('test-key');
    const result = await service.batchAnalyze([
      { id: 'file:main', name: 'main.ts', type: 'file', path: '/src/main.ts' },
    ]);
    expect(result).toEqual({
      suggestions: [],
      patterns: [],
      insights: [],
    });
  });

  test('createAIService returns AIService instance', () => {
    const service = createAIService('test-key');
    expect(service).toBeInstanceOf(AIService);
  });

  test('setApiKey enables analyzeNode after construction without key', async () => {
    const service = new AIService();
    expect(service.analyzeNode).toBeDefined();
    service.setApiKey('test-key');
    const suggestions = await service.analyzeNode({
      id: 'file:main',
      name: 'main.ts',
      type: 'file',
      path: '/src/main.ts',
    });
    expect(suggestions).toEqual([]);
  });
});
