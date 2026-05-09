import { parse } from '@babel/parser';

/**
 * Parses TypeScript/JavaScript code and returns the ESTree-like Program node.
 */
export function parseCode(code: string, filePath: string) {
  const isJSX = filePath.endsWith('.jsx') || filePath.endsWith('.tsx');

  // Always include TypeScript plugin, optionally include JSX
  const plugins: string[] = ['typescript'];
  if (isJSX) plugins.push('jsx');

  const ast = parse(code, {
    sourceType: 'module',
    plugins: plugins as any, // cast to any to satisfy parser's complex Plugin types
  });

  // Return the Program node (consistent with ESTree)
  return { ast: ast.program };
}

/**
 * Convenience: parse a file from disk and return the AST.
 */
export async function parseFile(filePath: string): Promise<any> {
  const { readFile } = await import('fs/promises');
  const code = await readFile(filePath, 'utf-8');
  return parseCode(code, filePath);
}
