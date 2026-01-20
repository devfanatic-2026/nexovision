import { watch } from 'chokidar';
import { onKeystaticSave } from './keystatic-hooks.js';
import { KeystaticDBSyncService } from './services/keystatic-db-sync.service.js';

/**
 * Sets up a file watcher to monitor Keystatic content changes
 * and trigger database synchronization
 */
export function setupKeystaticWatcher() {
  console.log('Setting up Keystatic file watcher...');

  // Watch for changes in the articles directory
  const watcher = watch('../sitio/content/articles/**/*', {
    persistent: true,
    ignoreInitial: true, // Don't trigger events for initial scan
    followSymlinks: false,
    cwd: process.cwd()
  });

  watcher
    .on('add', (path) => {
      console.log(`File added: ${path}`);
      onKeystaticSave(path);
    })
    .on('change', (path) => {
      console.log(`File changed: ${path}`);
      onKeystaticSave(path);
    })
    .on('unlink', (path) => {
      console.log(`File removed: ${path}`);
      // Handle file deletion - remove from DB too
      handleFileDeletion(path);
    })
    .on('error', (error) => {
      console.error('Watcher error:', error);
    })
    .on('ready', () => {
      console.log('Keystatic file watcher is ready');
    });

  return watcher;
}

/**
 * Handles file deletion events
 */
async function handleFileDeletion(filePath: string) {
  try {
    // Extract slug from file path
    const pathParts = filePath.split('/');
    const slug = pathParts[pathParts.length - 2]; // Assuming structure is ../sitio/content/articles/{slug}/index.md

    if (slug && slug !== 'articles') {
      console.log(`Detected deletion of article: ${slug}`);

      // Remove from database
      const { container } = await import('./di/container.js');
      const syncService = await container.resolve('KeystaticDBSyncService');
      const success = await syncService.removeArticleFromDatabase(slug);

      if (success) {
        console.log(`Successfully removed article from database: ${slug}`);
      } else {
        console.error(`Failed to remove article from database: ${slug}`);
      }
    }
  } catch (error) {
    console.error('Error processing file deletion:', error);
  }
}

// Start watching when module is loaded (if run directly)
if (typeof require !== 'undefined' && require.main === module) {
  setupKeystaticWatcher();
}