import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { transformFile } from '../transform';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

describe('TypeScript Dependency Transformation', () => {
    let testDir: string;

    beforeEach(() => {
        // Create temp test directory
        testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'float-test-'));
    });

    afterEach(() => {
        // Cleanup test directory
        try {
            fs.rmSync(testDir, { recursive: true, force: true });
        } catch (err) {
            console.error('Cleanup error:', err);
        }
    });

    it('should transform TypeScript file that imports another TypeScript file', async () => {
        const utilPath = path.join(testDir, 'util.ts');
        const mainPath = path.join(testDir, 'main.ts');

        // Create util.ts
        fs.writeFileSync(
            utilPath,
            `export function hello() { return 'world'; }`
        );

        // Create main.ts that imports util.ts
        fs.writeFileSync(
            mainPath,
            `import { hello } from './util';
export const result = hello();`
        );

        // Transform main.ts
        const module = await transformFile(mainPath);

        // Should successfully import and execute
        expect(module.result).toBe('world');
    });

    it('should cache transformed dependencies', async () => {
        const depPath = path.join(testDir, 'dep.ts');
        const mainPath = path.join(testDir, 'main.ts');

        // Setup files
        fs.writeFileSync(
            depPath,
            `export const value = 42;`
        );
        fs.writeFileSync(
            mainPath,
            `import { value } from './dep';
export { value };`
        );

        // First transformation
        await transformFile(mainPath);

        // Check cache directory exists  
        const cacheDir = path.join(process.cwd(), '.float', '.cache');
        // Wait, transform.ts uses process.cwd() for cache. 
        // In the test, we might want to ensure it's predictable.

        // Count .mjs files in cache
        const cachedFiles = fs.readdirSync(cacheDir).filter(f => f.endsWith('.mjs'));
        expect(cachedFiles.length).toBeGreaterThan(0);

        // Get mtime of a cached file related to dep.ts
        // Since we don't know the hash exactly without re-implementing it, 
        // let's just check if ANY file exists and mtime behavior
        const latestFile = cachedFiles.sort((a, b) =>
            fs.statSync(path.join(cacheDir, b)).mtimeMs - fs.statSync(path.join(cacheDir, a)).mtimeMs
        )[0];
        const cachedFilePath = path.join(cacheDir, latestFile);
        const initialMtime = fs.statSync(cachedFilePath).mtimeMs;

        // Wait a bit
        await new Promise(resolve => setTimeout(resolve, 10));

        // Second transformation (should use cache)
        await transformFile(mainPath);

        // Cached file should not be rewritten (same mtime)
        const newMtime = fs.statSync(cachedFilePath).mtimeMs;
        expect(newMtime).toBe(initialMtime);
    });

    it('should handle nested TypeScript imports (3 levels deep)', async () => {
        const l3Path = path.join(testDir, 'level3.ts');
        const l2Path = path.join(testDir, 'level2.ts');
        const l1Path = path.join(testDir, 'level1.ts');

        // Level 3 (deepest)
        fs.writeFileSync(l3Path, `export const three = 3;`);

        // Level 2
        fs.writeFileSync(
            l2Path,
            `import { three } from './level3';
export const two = 2 + three;`
        );

        // Level 1 (top)
        fs.writeFileSync(
            l1Path,
            `import { two } from './level2';
export const one = 1 + two;`
        );

        // Transform top level
        const module = await transformFile(l1Path);

        // Should resolve entire chain
        expect(module.one).toBe(6); // 1 + (2 + 3)
    });

    it('should not transform existing .js files (backward compatibility)', async () => {
        const jsPath = path.join(testDir, 'existing.js');
        const tsPath = path.join(testDir, 'main.ts');

        // Create a regular .js file
        fs.writeFileSync(jsPath, `export const value = 123;`);

        // Create .ts file that imports the .js file
        fs.writeFileSync(
            tsPath,
            `import { value } from './existing.js';
export { value };`
        );

        const module = await transformFile(tsPath);
        expect(module.value).toBe(123);
    });

    it('should handle index.ts imports', async () => {
        const utilsDir = path.join(testDir, 'utils');
        const indexPath = path.join(utilsDir, 'index.ts');
        const mainPath = path.join(testDir, 'main.ts');

        // Create subdirectory with index.ts
        fs.mkdirSync(utilsDir);
        fs.writeFileSync(indexPath, `export const util = 'utility';`);

        // Import from directory (should resolve to index.ts)
        fs.writeFileSync(
            mainPath,
            `import { util } from './utils';
export { util };`
        );

        const module = await transformFile(mainPath);
        expect(module.util).toBe('utility');
    });

    it('should re-transform when source file changes', async () => {
        const depPath = path.join(testDir, 'dep.ts');
        const mainPath = path.join(testDir, 'main.ts');

        // Create initial version
        fs.writeFileSync(depPath, `export const value = 1;`);
        fs.writeFileSync(
            mainPath,
            `import { value } from './dep';
export { value };`
        );

        // First transform
        const module1 = await transformFile(mainPath);
        expect(module1.value).toBe(1);

        // Wait to ensure different mtime
        await new Promise(resolve => setTimeout(resolve, 100));

        // Update source file
        fs.writeFileSync(depPath, `export const value = 2;`);

        // Clear module cache to force re-import
        const { clearModuleCache } = await import('../transform');
        clearModuleCache();

        // Second transform (should pick up new value)
        const module2 = await transformFile(mainPath);
        expect(module2.value).toBe(2);
    });

    it('should handle @/ alias imports', async () => {
        const componentsDir = path.join(process.cwd(), 'components');
        const buttonPath = path.join(componentsDir, 'Button.tsx');
        const mainPath = path.join(testDir, 'main.ts');

        // Create a component in [PROJECT_ROOT]/components
        if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
        fs.writeFileSync(
            buttonPath,
            `export const Button = 'button';`
        );

        try {
            // Create main.ts in temp dir that uses @/ alias
            fs.writeFileSync(
                mainPath,
                `import { Button } from '@/components/Button';
export { Button };`
            );

            const module = await transformFile(mainPath);
            expect(module.Button).toBe('button');
        } finally {
            // Cleanup: remove the created component from project root
            try { fs.unlinkSync(buttonPath); } catch { }
        }
    });
});
