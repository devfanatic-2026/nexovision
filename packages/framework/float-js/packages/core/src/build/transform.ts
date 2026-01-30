/**
 * Float.js Transform
 * On-the-fly TypeScript/JSX transformation
 */

import * as esbuild from 'esbuild';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { Buffer } from 'node:buffer';
import { getCache } from './persistent-cache.js';

const moduleCache = new Map<string, { module: any; mtime: number }>();

// Strict Singleton Lock for SSR consistency
let lockedReactPath: string | null = null;
let lockedReactDOMPath: string | null = null;

/**
 * Lock React versions to a specific project root
 */
export function lockFrameworkDependencies(projectRoot: string) {
  try {
    const projectRequire = createRequire(path.join(projectRoot, 'noop.js'));
    lockedReactPath = fs.realpathSync(projectRequire.resolve('react'));
    lockedReactDOMPath = fs.realpathSync(projectRequire.resolve('react-dom'));
  } catch (e) {
    // Fallback if not found
  }
}

/**
 * Transform and import a file
 * Handles .ts, .tsx, .js, .jsx files
 */
export async function transformFile(
  filePath: string,
  options: { useCache?: boolean; vibeDebug?: boolean } = {}
): Promise<any> {
  const { useCache = true, vibeDebug = false } = options;
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);

  if (vibeDebug) {
    console.log(`\x1b[35m🔍 [VibeDebug] Transforming file: ${absolutePath}\x1b[0m`);
  }

  // Check if file exists
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const stats = fs.statSync(absolutePath);
  const mtime = stats.mtimeMs;

  // Check in-memory cache
  const cached = moduleCache.get(absolutePath);
  if (cached && cached.mtime === mtime) {
    return cached.module;
  }

  // Read source
  const source = fs.readFileSync(absolutePath, 'utf-8');
  const ext = path.extname(absolutePath);

  // Determine loader
  const loader = getLoader(ext);

  // Transform with esbuild
  const result = await esbuild.transform(source, {
    loader,
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    format: 'esm',
    target: 'node18',
    sourcemap: 'inline',
    sourcefile: absolutePath,
  });

  // Create temporary file for import
  const tempDir = path.join(process.cwd(), '.float', '.cache');
  fs.mkdirSync(tempDir, { recursive: true });

  const tempFile = path.join(tempDir, `${path.basename(absolutePath, ext)}_${Date.now()}.mjs`);

  // Prepend React import for Classic Transform
  let code = result.code;
  if (!code.includes('import React') && !code.includes('import * as React')) {
    code = `import React from 'react';\n${code}`;
  }

  // Rewrite imports to absolute paths or global register
  code = await rewriteImports(code, path.dirname(absolutePath), tempDir, vibeDebug);

  // Remove CSS imports
  code = code.replace(/import\s+['"][^'"]*\.css['"];?/g, '');

  fs.writeFileSync(tempFile, code);

  try {
    const module = await import(pathToFileURL(tempFile).href);
    moduleCache.set(absolutePath, { module, mtime });

    if (!vibeDebug) {
      setImmediate(() => { try { fs.unlinkSync(tempFile); } catch { } });
    }

    return module;
  } catch (error) {
    if (!vibeDebug) {
      try { fs.unlinkSync(tempFile); } catch { }
    }
    throw error;
  }
}

/**
 * Get esbuild loader for file extension
 */
function getLoader(ext: string): esbuild.Loader {
  switch (ext) {
    case '.ts': return 'ts';
    case '.tsx': return 'tsx';
    case '.jsx': return 'jsx';
    case '.js': return 'js';
    case '.mjs': return 'js';
    case '.json': return 'json';
    default: return 'ts';
  }
}

/**
 * Rewrite imports to absolute paths or global registry shims
 */
async function rewriteImports(code: string, baseDir: string, cacheDir: string, vibeDebug = false): Promise<string> {
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  const matches = [...code.matchAll(importRegex)];
  let offset = 0;
  let newCode = code;

  const localRequire = createRequire(path.join(baseDir, 'noop.js'));

  for (const match of matches) {
    const importPath = match[1];
    let finalImportPath: string = '';
    let found = false;
    let resolvedPath: string = '';

    const isReact = importPath === 'react' || importPath.startsWith('react/');
    const isReactDOM = importPath === 'react-dom' || importPath.startsWith('react-dom/');
    const isFramework = importPath === '@float.js/core' || importPath === '@float-v/core';
    const isReactNative = importPath === 'react-native';

    // Legacy Migration Detection (Vibe Debugging)
    const isLegacyFramework = importPath.startsWith('@float.js/');
    if (isLegacyFramework && vibeDebug) {
      console.warn(`\x1b[33m⚠️ [VibeMigrator] Legacy import detected: "${importPath}". Please update to "@float-v/${importPath.split('/')[1]}"\x1b[0m`);
    }

    if (isReact) {
      const glueCode = `
      const getReact = () => {
        const r = globalThis.__FLOAT_REACT__;
        if (!r) console.error('[Shim] __FLOAT_REACT__ is missing!');
        return r;
      };
      export default globalThis.__FLOAT_REACT__; 
      export const useState = (...args) => getReact()?.useState(...args); 
      export const useMemo = (...args) => getReact()?.useMemo(...args); 
      export const useCallback = (...args) => getReact()?.useCallback(...args); 
      export const useEffect = (...args) => getReact()?.useEffect(...args); 
      export const useContext = (...args) => getReact()?.useContext(...args); 
      export const useReducer = (...args) => getReact()?.useReducer(...args); 
      export const useRef = (...args) => getReact()?.useRef(...args); 
      export const useId = (...args) => getReact()?.useId(...args); 
      export const useLayoutEffect = (...args) => getReact()?.useLayoutEffect(...args); 
      export const createContext = (...args) => getReact()?.createContext(...args); 
      export const createElement = (...args) => getReact()?.createElement(...args); 
      export const Fragment = globalThis.__FLOAT_REACT__?.Fragment;
      `;
      finalImportPath = `data:text/javascript;base64,${Buffer.from(glueCode).toString('base64')}`;
      found = true;
    } else if (isReactDOM) {
      const glueCode = `
      export default globalThis.__FLOAT_REACT_DOM__ || globalThis.__FLOAT_REACT__; 
      export const render = (...args) => globalThis.__FLOAT_REACT_DOM__?.render(...args); 
      export const hydrate = (...args) => globalThis.__FLOAT_REACT_DOM__?.hydrate(...args);
      `;
      finalImportPath = `data:text/javascript;base64,${Buffer.from(glueCode).toString('base64')}`;
      found = true;
    } else if (isReactNative) {
      resolvedPath = 'react-native-web';
      found = true;
    } else if (isFramework) {
      const currentModulePath = fileURLToPath(import.meta.url);
      resolvedPath = path.resolve(path.dirname(currentModulePath), '..', 'index.js');
      if (!fs.existsSync(resolvedPath)) {
        resolvedPath = path.resolve(path.dirname(currentModulePath), '..', 'index.ts');
      }
      found = true;
    }

    if (!found) {
      if (importPath.startsWith('./') || importPath.startsWith('../') || importPath.startsWith('@/')) {
        resolvedPath = importPath.startsWith('@/')
          ? path.resolve(process.cwd(), importPath.slice(2))
          : path.resolve(baseDir, importPath);

        const strippedPath = resolvedPath.replace(/\.(js|mjs)$/, '');
        const extensions = ['.tsx', '.ts', '.jsx', '.js', '.mjs', ''];
        for (const ext of extensions) {
          const tryPath = strippedPath + ext;
          if (fs.existsSync(tryPath)) { resolvedPath = tryPath; found = true; break; }
          const indexPath = path.join(resolvedPath, `index${ext}`);
          if (fs.existsSync(indexPath)) { resolvedPath = indexPath; found = true; break; }
        }
      }
    }

    if (!found && !finalImportPath) continue;

    if (finalImportPath === '') {
      const fileExt = path.extname(resolvedPath);
      const shouldTransform = ['.ts', '.tsx', '.jsx'].includes(fileExt);

      if (shouldTransform) {
        const hash = crypto.createHash('sha256').update(resolvedPath).digest('hex').slice(0, 16);
        const cachedFile = path.join(cacheDir, `dep_${hash}.mjs`);
        if (!fs.existsSync(cachedFile) || fs.statSync(resolvedPath).mtimeMs > fs.statSync(cachedFile).mtimeMs) {
          try {
            const depSource = fs.readFileSync(resolvedPath, 'utf-8');
            const depResult = await esbuild.transform(depSource, {
              loader: getLoader(fileExt),
              jsx: 'transform',
              jsxFactory: 'React.createElement',
              jsxFragment: 'React.Fragment',
              format: 'esm',
              target: 'node18',
              sourcemap: 'inline',
              sourcefile: resolvedPath,
            });
            const depCode = await rewriteImports(depResult.code, path.dirname(resolvedPath), cacheDir, vibeDebug);
            fs.writeFileSync(cachedFile, depCode);
          } catch (e) {
            if (vibeDebug) {
              const { VibeDebugger } = await import('../server/vibe-debug.js');
              VibeDebugger.dumpEvidence('transform_error', { file: resolvedPath, error: e.message });
            }
            throw e;
          }
        }
        resolvedPath = cachedFile;
      }
      finalImportPath = pathToFileURL(resolvedPath).href;
    }

    const replacement = `from '${finalImportPath}'`;
    const start = match.index! + offset;
    const end = start + match[0].length;
    newCode = newCode.slice(0, start) + replacement + newCode.slice(end);
    offset += replacement.length - match[0].length;
  }

  return newCode;
}

export function clearModuleCache(filePath?: string) {
  if (filePath) moduleCache.delete(path.resolve(filePath));
  else moduleCache.clear();
}

export async function transformSource(source: string, options: { filename?: string; loader?: esbuild.Loader } = {}): Promise<string> {
  const { filename = 'module.tsx', loader = 'tsx' } = options;
  const result = await esbuild.transform(source, {
    loader,
    jsx: 'automatic',
    format: 'esm',
    target: 'node18',
    sourcemap: 'inline',
    sourcefile: filename,
  });
  return result.code;
}
