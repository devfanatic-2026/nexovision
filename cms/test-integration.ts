import { KeystaticDBSyncService } from './src/lib/services/keystatic-db-sync.service.js';
import { container } from './src/lib/di/container.js';
import { ArticleRepository } from './src/lib/repositories/article.repository.js';

async function runIntegrationTest() {
  console.log('Starting Keystatic-Database Integration Test...');

  try {
    // Get the sync service
    const syncService = await container.resolve<KeystaticDBSyncService>('KeystaticDBSyncService');

    // Sync articles from Keystatic to database
    console.log('Syncing articles from Keystatic to database...');
    const syncResult = await syncService.syncArticlesFromKeystatic();

    console.log('Sync completed:');
    console.log(`- Created: ${syncResult.created} articles`);
    console.log(`- Updated: ${syncResult.updated} articles`);
    console.log(`- Errors: ${syncResult.errors.length}`);

    if (syncResult.errors.length > 0) {
      console.log('Errors:');
      syncResult.errors.forEach(error => console.error(`  - ${error}`));
    }

    // Get the article repository to verify data
    const articleRepo = await container.resolve<ArticleRepository>('ArticleRepository');
    const articles = await articleRepo.findAll();

    console.log(`\nTotal articles in database: ${articles.length}`);

    // Show first few articles as sample
    console.log('\nSample articles:');
    articles.slice(0, 5).forEach(article => {
      console.log(`- ${article.title} (${article.slug}) - Draft: ${!!article.is_draft}`);
    });

    console.log('\nIntegration test completed successfully!');
  } catch (error) {
    console.error('Integration test failed:', error);
    process.exit(1);
  }
}

// Run the test
runIntegrationTest();