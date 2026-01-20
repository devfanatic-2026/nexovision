import { container } from './src/lib/di/container.js';
import { ArticleRepository } from './src/lib/repositories/article.repository.js';

async function checkArticles() {
  try {
    const articleRepo = await container.resolve<ArticleRepository>('ArticleRepository');
    const articles = await articleRepo.findAll();
    
    console.log(`Found ${articles.length} articles in the database:`);
    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (slug: ${article.slug}) - Draft: ${!!article.is_draft}`);
    });
  } catch (error) {
    console.error('Error checking articles:', error);
  }
}

checkArticles();