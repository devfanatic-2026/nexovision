import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: false, // Disable automatic DTS generation to avoid typing issues
    clean: true,
    external: ['react', 'react-native', 'react-native-web'],
    splitting: false,
    sourcemap: true,
    target: 'es2020',
});
