/**
 * Helper function to trigger database sync when Keystatic content changes
 */
export async function syncKeystaticToDatabase(articleSlug?: string) {
  try {
    const { container } = await import('./di/container.js');
    const syncService = await container.resolve('KeystaticDBSyncService');

    if (articleSlug) {
      // Sync a specific article
      const success = await syncService.syncSingleArticle(articleSlug);
      if (success) {
        console.log(`Successfully synced article: ${articleSlug}`);
      } else {
        console.error(`Failed to sync article: ${articleSlug}`);
      }
    } else {
      // Sync all articles
      const result = await syncService.syncArticlesFromKeystatic();
      console.log(`Sync completed: ${result.created} created, ${result.updated} updated`);
    }
  } catch (error) {
    console.error('Error syncing Keystatic to database:', error);
  }
}

/**
 * Function to be called when content is saved in Keystatic
 */
export async function onKeystaticSave(filePath: string) {
  try {
    // Extract slug from file path
    const pathParts = filePath.split('/');
    const slug = pathParts[pathParts.length - 2]; // Assuming structure is ../sitio/content/articles/{slug}/index.md

    if (slug && slug !== 'articles') {
      console.log(`Detected change in article: ${slug}`);
      await syncKeystaticToDatabase(slug);
    }
  } catch (error) {
    console.error('Error processing Keystatic save event:', error);
  }
}