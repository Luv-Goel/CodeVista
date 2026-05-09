import { parseCode } from '../astParser';

describe('AST Parser', () => {
  test('parses TypeScript function declaration', () => {
    const code = 'function greet(name: string): void { console.log(name); }';
    const result = parseCode(code, 'test.ts');
    expect(result.ast).toBeDefined();
    expect(result.ast.type).toBe('Program');
    const funcDecl = result.ast.body[0];
    expect(funcDecl.type).toBe('FunctionDeclaration');
    expect((funcDecl as any).id?.name).toBe('greet');
  });

  test('parses JavaScript arrow function', () => {
    const code = 'const add = (a, b) => a + b;';
    const result = parseCode(code, 'test.js');
    const varDecl = result.ast.body[0];
    expect(varDecl.type).toBe('VariableDeclaration');
    const arrowFn = (varDecl as any).declarations[0].init;
    expect(arrowFn.type).toBe('ArrowFunctionExpression');
  });

  test('parses JSX in .jsx file', () => {
    const code = 'const element = <div>Hello</div>;';
    const result = parseCode(code, 'test.jsx');
    expect(result.ast).toBeDefined();
    const varDecl = result.ast.body[0];
    expect(varDecl.type).toBe('VariableDeclaration');
    const jsx = (varDecl as any).declarations[0].init;
    expect(jsx.type).toBe('JSXElement');
  });
});
