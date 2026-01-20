import { container } from './src/lib/di/container.js';
import { ArticleRepository } from './src/lib/repositories/article.repository.js';

async function testDbQuery() {
  console.log('Testing database connection and query...');
  
  try {
    const repo = await container.resolve<ArticleRepository>('ArticleRepository');
    console.log('Repository resolved successfully');
    
    console.log('Attempting to fetch articles...');
    const startTime = Date.now();
    const articles = await repo.findAll();
    const endTime = Date.now();
    
    console.log(`Query completed in ${endTime - startTime}ms`);
    console.log(`Found ${articles.length} articles`);
    
    if (articles.length > 0) {
      console.log('First article:', articles[0].title);
    }
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error during test:', error);
  }
}

testDbQuery();