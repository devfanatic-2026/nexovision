import { setupKeystaticWatcher } from './src/lib/keystatic-watcher.js';

console.log('Starting Keystatic-Database synchronization service...');

// Setup file watcher
setupKeystaticWatcher();

console.log('Keystatic-Database synchronization service running.');