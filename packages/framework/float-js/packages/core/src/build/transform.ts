/**
 * Float.js Transform
 * On-the-fly TypeScript/JSX transformation
 */

import * as esbuild from 'esbuild';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { getCache } from './persistent-cache.js';

const moduleCache = new Map<string, { module: any; mtime: number }>();

/**
 * Transform and import a file
 * Handles .ts, .tsx, .js, .jsx files
 */
export async function transformFile(filePath: string, useCache: boolean = true): Promise<any> {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);

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

  // Check persistent cache if enabled
  if (useCache) {
    const cache = getCache();
    const source = fs.readFileSync(absolutePath, 'utf-8');
    const sourceHash = crypto.createHash('sha256').update(source).digest('hex').slice(0, 16);
    const cacheKey = `transform_${absolutePath}_${sourceHash}`;

    if (cache.has(cacheKey)) {
      const cachedCode = cache.get<string>(cacheKey);
      if (cachedCode) {
        // Create temp file and import
        const tempDir = path.join(process.cwd(), '.float', '.cache');
        fs.mkdirSync(tempDir, { recursive: true });
        const tempFile = path.join(tempDir, `${path.basename(absolutePath, path.extname(absolutePath))}_${Date.now()}.mjs`);
        fs.writeFileSync(tempFile, cachedCode);

        try {
          const module = await import(pathToFileURL(tempFile).href);
          moduleCache.set(absolutePath, { module, mtime });
          setImmediate(() => { try { fs.unlinkSync(tempFile); } catch { } });
          return module;
        } catch (error) {
          // Cache invalid, continue with transformation
          setImmediate(() => { try { fs.unlinkSync(tempFile); } catch { } });
        }
      }
    }
  }

  // Read source
  const source = fs.readFileSync(absolutePath, 'utf-8');
  const ext = path.extname(absolutePath);

  // Determine loader
  const loader = getLoader(ext);

  // Transform with esbuild
  const result = await esbuild.transform(source, {
    loader,
    jsx: 'automatic',
    format: 'esm',
    target: 'node18',
    sourcemap: 'inline',
    sourcefile: absolutePath,
  });

  // Create temporary file for import
  const tempDir = path.join(process.cwd(), '.float', '.cache');
  fs.mkdirSync(tempDir, { recursive: true });

  const tempFile = path.join(tempDir, `${path.basename(absolutePath, ext)}_${Date.now()}.mjs`);

  // Rewrite imports to absolute paths
  let code = result.code;
  code = await rewriteImports(code, path.dirname(absolutePath), tempDir);

  // Remove CSS imports (CSS is handled separately by the server)
  code = code.replace(/import\s+['"][^'"]*\.css['"];?/g, '');

  fs.writeFileSync(tempFile, code);

  try {
    // Dynamic import
    const module = await import(pathToFileURL(tempFile).href);

    // Cache the result
    moduleCache.set(absolutePath, { module, mtime });

    // Save to persistent cache if enabled
    if (useCache) {
      const cache = getCache();
      const sourceHash = crypto.createHash('sha256').update(source).digest('hex').slice(0, 16);
      const cacheKey = `transform_${absolutePath}_${sourceHash}`;
      cache.set(cacheKey, code, source);
    }

    // Clean up temp file (async)
    setImmediate(() => {
      try {
        fs.unlinkSync(tempFile);
      } catch { }
    });

    return module;
  } catch (error) {
    // Clean up on error
    try {
      fs.unlinkSync(tempFile);
    } catch { }
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
    case '.css': return 'css';
    default: return 'ts';
  }
}

/**
 * Rewrite imports to absolute paths
 */
async function rewriteImports(code: string, baseDir: string, cacheDir: string): Promise<string> {
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  const matches = [...code.matchAll(importRegex)];

  // Track offset for replacements to handle multiple identical imports correctly
  let offset = 0;
  let newCode = code;

  const localRequire = createRequire(path.join(baseDir, 'noop.js'));

  for (const match of matches) {
    const importPath = match[1];
    let resolvedPath: string = '';
    let found = false;

    const isReact = importPath === 'react' || importPath.startsWith('react/');
    const isReactDOM = importPath === 'react-dom' || importPath.startsWith('react-dom/');
    const isFramework = importPath === '@float.js/core';
    const isFloatLite = importPath === '@float.js/lite' || importPath.startsWith('@float.js/lite/');
    const isReactNative = importPath === 'react-native';
    const isWorkspacePkg = importPath.startsWith('@nexovision');

    if (isFloatLite || isWorkspacePkg) {
      // workspace packages need special handling: resolve to physical path and transform
      // This allows us to rewrite react-native imports within them to react-native-web
      found = false;

      const pkgName = isFloatLite ? '@float.js/lite' : importPath.split('/').slice(0, 2).join('/');
      try {
        // Use Node's resolution to find the package's package.json
        const pkgPaths = localRequire.resolve.paths(pkgName) || [];
        const pkgSubpath = importPath.startsWith(pkgName + '/') ? importPath.replace(pkgName + '/', '') : '';
        let resolvedPkg: string | undefined;
        for (const p of pkgPaths) {
          const tryPath = path.resolve(p, pkgName, 'package.json');
          if (fs.existsSync(tryPath)) {
            resolvedPkg = tryPath;
            break;
          }
        }

        if (!resolvedPkg) {
          throw new Error(`Cannot resolve ${pkgName} from any node_modules paths`);
        }

        const realPkgDir = path.dirname(fs.realpathSync(resolvedPkg));

        // Try various entry points in the resolved package directory
        const entryBase = pkgSubpath || 'index';
        const extensions = ['.tsx', '.ts', '.jsx', '.js', ''];
        const subDirs = ['', 'src', 'dist'];

        for (const subDir of subDirs) {
          if (found) break;
          for (const ext of extensions) {
            const tryPath = path.resolve(realPkgDir, subDir, entryBase + ext);
            if (fs.existsSync(tryPath) && fs.statSync(tryPath).isFile()) {
              resolvedPath = tryPath;
              found = true;
              break;
            }
            // Try subpath/index.ext
            const tryIndexPath = path.resolve(realPkgDir, subDir, entryBase, 'index' + ext);
            if (fs.existsSync(tryIndexPath) && fs.statSync(tryIndexPath).isFile()) {
              resolvedPath = tryIndexPath;
              found = true;
              break;
            }
          }
        }
      } catch (e: any) {
        // Silent catch, found check handles error
      }

      // If we still haven't found it, this is an error case
      if (!found) {
        throw new Error(`Cannot resolve ${importPath} from ${baseDir}. Make sure dependencies are installed.`);
      }
    } else if (isReactNative) {
      // Alias react-native to react-native-web for SSR
      resolvedPath = 'react-native-web';
      found = true;
    } else if (isReact || isReactDOM) {
      // Force natural resolution through the project's root node_modules.
      resolvedPath = importPath;
      found = true;
    } else if (isFramework) {
      // Force absolute local resolution to the framework we are actually building
      // Check both local and parent directory (to support 'sitio' subfolder structure)
      const frameworkPathLocal = path.resolve(process.cwd(), 'framework/float-js/packages/core/dist/index.js');
      const frameworkPathParent = path.resolve(process.cwd(), '../framework/float-js/packages/core/dist/index.js');
      resolvedPath = fs.existsSync(frameworkPathLocal) ? frameworkPathLocal : frameworkPathParent;
      found = true;
    }

    if (!found) {
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        resolvedPath = path.resolve(baseDir, importPath);
      } else if (importPath.startsWith('@/')) {
        resolvedPath = path.resolve(process.cwd(), importPath.slice(2));
      } else {
        continue;
      }

      // Try to find the file with various extensions.
      // We strip existing .js/.mjs extensions to support TS-style imports in ESM
      const strippedPath = resolvedPath.replace(/\.(js|mjs)$/, '');
      const extensions = ['.tsx', '.ts', '.jsx', '.js', '.mjs', ''];

      for (const ext of extensions) {
        const tryPath = strippedPath + ext;
        if (fs.existsSync(tryPath)) {
          resolvedPath = tryPath;
          found = true;
          break;
        }
        // Try index file
        const indexPath = path.join(resolvedPath, `index${ext}`);
        if (fs.existsSync(indexPath)) {
          resolvedPath = indexPath;
          found = true;
          break;
        }
      }
    }

    if (!found) continue;

    // Resolve to file:/// URL for local files, but keep package names as is for natural resolution
    let finalImportPath: string;
    if (found && (isReact || isReactDOM || isFramework || isReactNative)) {
      // Preserve package names for natural Node resolution
      finalImportPath = resolvedPath;
    } else {
      const fileExt = path.extname(resolvedPath);

      // Handle JSON files
      if (fileExt === '.json') {
        const jsonUrl = pathToFileURL(resolvedPath).href;
        const replacement = match[0].includes('assert')
          ? `from '${jsonUrl}'`
          : `from '${jsonUrl}' assert { type: "json" }`;

        const start = match.index! + offset;
        const end = start + match[0].length;
        newCode = newCode.slice(0, start) + replacement + newCode.slice(end);
        offset += replacement.length - match[0].length;
        continue;
      }

      // Transform TypeScript/JSX files recursively
      // Also transform JS/MJS files if they reference react-native to apply aliasing
      // ALWAYS transform workspace packages to convert react-native to react-native-web
      let shouldTransform = ['.ts', '.tsx', '.jsx'].includes(fileExt) || isFloatLite || isWorkspacePkg;

      if (!shouldTransform && ['.js', '.mjs'].includes(fileExt)) {
        // optimistically check for react-native usage to avoid transforming potential thousands of node_modules
        try {
          const content = fs.readFileSync(resolvedPath, 'utf-8');
          // Check for react-native, @float.js/lite, or common libraries that might use them
          if (content.includes('react-native') || content.includes('nativewind') || content.includes('@float.js/lite')) {
            shouldTransform = true;
          }
        } catch (e) {
          // ignore read errors, let next steps handle it or skip
        }
      }

      if (shouldTransform) {
        const hash = crypto.createHash('sha256').update(resolvedPath).digest('hex').slice(0, 16);
        const cachedFile = path.join(cacheDir, `dep_${hash}.mjs`);

        if (!fs.existsSync(cachedFile) ||
          fs.statSync(resolvedPath).mtimeMs > fs.statSync(cachedFile).mtimeMs) {
          const depSource = fs.readFileSync(resolvedPath, 'utf-8');
          const depResult = await esbuild.transform(depSource, {
            loader: getLoader(fileExt),
            jsx: 'automatic',
            format: 'esm',
            target: 'node18',
            sourcemap: 'inline',
            sourcefile: resolvedPath,
          });
          const depCode = await rewriteImports(depResult.code, path.dirname(resolvedPath), cacheDir);
          fs.writeFileSync(cachedFile, depCode);
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

/**
 * Clear module cache (for HMR)
 */
export function clearModuleCache(filePath?: string) {
  if (filePath) {
    moduleCache.delete(path.resolve(filePath));
  } else {
    moduleCache.clear();
  }
}

/**
 * Transform source code without file operations
 */
export async function transformSource(
  source: string,
  options: { filename?: string; loader?: esbuild.Loader } = {}
): Promise<string> {
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
