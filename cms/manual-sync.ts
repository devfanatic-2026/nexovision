import { container } from './src/lib/di/container.js';
import { KeystaticDBSyncService } from './src/lib/services/keystatic-db-sync.service.js';

async function manualSync() {
  try {
    const syncService = await container.resolve('KeystaticDBSyncService');
    console.log('Starting manual sync of all articles...');
    
    const result = await syncService.syncArticlesFromKeystatic();
    console.log('Sync completed:', result);
    
    // Check the articles in the database after sync
    const articleRepo = await container.resolve('ArticleRepository');
    const articles = await articleRepo.findAll();
    
    console.log(`\nTotal articles in database after sync: ${articles.length}`);
    console.log('Sample articles:');
    articles.slice(0, 10).forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (slug: ${article.slug}) - Draft: ${!!article.is_draft}`);
    });
  } catch (error) {
    console.error('Error during manual sync:', error);
  }
}

manualSync();