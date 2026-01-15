import fg from 'fast-glob';
import path from 'node:path';

const appDir = path.resolve('app');
const extensions = 'tsx,ts,jsx,js';
const pattern = `**/{page,layout,route,error,loading}.{${extensions}}`;

console.log('AppDir:', appDir);
console.log('Pattern:', pattern);

async function run() {
    const files = await fg(pattern, {
        cwd: appDir,
        onlyFiles: true,
    });
    console.log('Found files:', files);
}

run();
