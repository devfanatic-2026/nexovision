/**
 * Float.js Route Scanner (Node.js only)
 */

import fg from 'fast-glob';
import path from 'node:path';
import { Route, RouterOptions } from './index.js';

const DEFAULT_OPTIONS: Required<RouterOptions> = {
    appDir: 'app',
    basePath: '',
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
};

/**
 * Convert file path to URL path
 */
function filePathToUrlPath(filePath: string, appDir: string): {
    urlPath: string;
    params: string[];
    isCatchAll: boolean;
    isOptionalCatchAll: boolean;
} {
    // Remove app dir prefix
    let urlPath = filePath.replace(new RegExp(`^${appDir}/`), '');

    // Special handling for API routes
    if (urlPath.includes('api/')) {
        urlPath = urlPath
            .replace(/\.(tsx?|jsx?)$/, '')
            .replace(/\/index$/, '')
            .replace(/\/route$/, '');
    } else {
        urlPath = urlPath.replace(/\/?(page|layout|route|error|loading|not-found)\.(tsx?|jsx?)$/, '');
    }

    const params: string[] = [];
    let isCatchAll = false;
    let isOptionalCatchAll = false;

    urlPath = urlPath.replace(/\[([^\]]+)\]/g, (_, param) => {
        if (param.startsWith('...') && filePath.includes('[[')) {
            isOptionalCatchAll = true;
            const paramName = param.replace('...', '');
            params.push(paramName);
            return `*${paramName}?`;
        }
        if (param.startsWith('...')) {
            isCatchAll = true;
            const paramName = param.replace('...', '');
            params.push(paramName);
            return `*${paramName}`;
        }
        params.push(param);
        return `:${param}`;
    });

    urlPath = '/' + urlPath;
    urlPath = urlPath.replace(/\/+/g, '/').replace(/\/$/, '') || '/';

    return { urlPath, params, isCatchAll, isOptionalCatchAll };
}

function getRouteType(filePath: string): Route['type'] {
    const fileName = filePath.split('/').pop() || filePath;
    if (fileName.match(/^route\.(tsx?|jsx?)$/)) return 'api';
    if (filePath.split('/').includes('api')) return 'api';
    if (fileName.match(/^layout\.(tsx?|jsx?)$/)) return 'layout';
    if (fileName.match(/^error\.(tsx?|jsx?)$/)) return 'error';
    if (fileName.match(/^loading\.(tsx?|jsx?)$/)) return 'loading';
    return 'page';
}

function findLayouts(routePath: string, allLayouts: Map<string, string>): string[] {
    const layouts: string[] = [];
    const segments = routePath.split('/').filter(Boolean);
    if (allLayouts.has('/')) layouts.push(allLayouts.get('/')!);
    let currentPath = '';
    for (const segment of segments) {
        currentPath += '/' + segment;
        if (allLayouts.has(currentPath)) layouts.push(allLayouts.get(currentPath)!);
    }
    return layouts;
}

function findLoading(routePath: string, allLoading: Map<string, string>): string | undefined {
    const segments = routePath.split('/').filter(Boolean);
    for (let i = segments.length; i >= 0; i--) {
        const currentPath = i === 0 ? '/' : '/' + segments.slice(0, i).join('/');
        if (allLoading.has(currentPath)) return allLoading.get(currentPath);
    }
    return undefined;
}

function findError(routePath: string, allErrors: Map<string, string>): string | undefined {
    const segments = routePath.split('/').filter(Boolean);
    for (let i = segments.length; i >= 0; i--) {
        const currentPath = i === 0 ? '/' : '/' + segments.slice(0, i).join('/');
        if (allErrors.has(currentPath)) return allErrors.get(currentPath);
    }
    return undefined;
}

export async function scanRoutes(
    rootDir: string,
    options: RouterOptions = {}
): Promise<Route[]> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const appDir = path.join(rootDir, opts.appDir);
    const extensions = opts.extensions.map(ext => ext.replace('.', '')).join(',');
    const pattern = `**/*.{${extensions}}`;
    const files = await fg(pattern, { cwd: appDir, onlyFiles: true, ignore: ['**/node_modules/**', '**/_*/**'] });

    const layoutMap = new Map<string, string>();
    const loadingMap = new Map<string, string>();
    const errorMap = new Map<string, string>();

    for (const file of files) {
        const type = getRouteType(file);
        const { urlPath } = filePathToUrlPath(file, '');
        if (type === 'layout') layoutMap.set(urlPath === '/' ? '/' : urlPath.replace(/\/layout$/, '') || '/', path.join(appDir, file));
        else if (type === 'loading') loadingMap.set(urlPath === '/' ? '/' : urlPath.replace(/\/loading$/, '') || '/', path.join(appDir, file));
        else if (type === 'error') errorMap.set(urlPath === '/' ? '/' : urlPath.replace(/\/error$/, '') || '/', path.join(appDir, file));
    }

    const routes: Route[] = [];
    for (const file of files) {
        const type = getRouteType(file);
        if (type === 'layout' || type === 'error' || type === 'loading') continue;
        const { urlPath, params, isCatchAll, isOptionalCatchAll } = filePathToUrlPath(file, '');
        routes.push({
            path: opts.basePath + urlPath,
            filePath: file,
            absolutePath: path.join(appDir, file),
            type,
            params,
            isCatchAll,
            isOptionalCatchAll,
            layouts: type === 'page' ? findLayouts(urlPath, layoutMap) : [],
            loading: type === 'page' ? findLoading(urlPath, loadingMap) : undefined,
            error: type === 'page' ? findError(urlPath, errorMap) : undefined,
        });
    }
    return routes.sort((a, b) => {
        if (a.isCatchAll !== b.isCatchAll) return a.isCatchAll ? 1 : -1;
        if (a.params.length !== b.params.length) return a.params.length - b.params.length;
        return a.path.localeCompare(b.path);
    });
}
