import { KeystaticDBSyncService } from './src/lib/services/keystatic-db-sync.service.js';
import { container } from './src/lib/di/container.js';
import { ArticleRepository } from './src/lib/repositories/article.repository.js';
import { AuthorRepository } from './src/lib/repositories/author.repository.js';
import { CategoryRepository } from './src/lib/repositories/category.repository.js';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

async function runExtendedIntegrationTest() {
  console.log('Starting Extended Keystatic-Database Integration Test...');
  
  try {
    // Get repositories
    const articleRepo = await container.resolve<ArticleRepository>('ArticleRepository');
    const authorRepo = await container.resolve<AuthorRepository>('AuthorRepository');
    const categoryRepo = await container.resolve<CategoryRepository>('CategoryRepository');
    const syncService = await container.resolve<KeystaticDBSyncService>('KeystaticDBSyncService');
    
    // Create test author
    console.log('- Creating test author...');
    const testAuthor = {
      id: randomUUID(),
      slug: 'test-author-integration',
      name: 'Test Integration Author',
      job: 'Integration Tester',
      avatar: '',
      bio: 'A test author for integration testing'
    };
    await authorRepo.create(testAuthor);
    console.log(`  Created author: ${testAuthor.name}`);
    
    // Create test category
    console.log('- Creating test category...');
    const testCategory = {
      id: randomUUID(),
      slug: 'test-category-integration',
      title: 'Test Integration Category',
      inspire: 'Testing is important'
    };
    await categoryRepo.create(testCategory);
    console.log(`  Created category: ${testCategory.title}`);
    
    // Create a test article directory and file
    console.log('- Creating test article in Keystatic format...');
    const testArticleDir = path.join(process.cwd(), '../sitio/content/articles/test-integration-article');
    
    // Create directory if it doesn't exist
    await fs.mkdir(testArticleDir, { recursive: true });
    
    // Create markdown file with frontmatter
    const markdownContent = `---
title: 'Test Integration Article'
description: 'This is a test article for integration purposes'
cover: '/images/test-cover.jpg'
category: 'test-category-integration'
publishedTime: '${new Date().toISOString()}'
isDraft: false
isMainHeadline: true
isSubHeadline: false
authors:
  - 'test-author-integration'
---

# Test Integration Article

This is the content of the test integration article.

## Section 1
Some content here.

## Section 2
More content here.
`;
    
    const markdownFilePath = path.join(testArticleDir, 'index.md');
    await fs.writeFile(markdownFilePath, markdownContent);
    console.log(`  Created test article file: ${markdownFilePath}`);
    
    // Now sync this specific article to the database
    console.log('- Syncing test article to database...');
    const success = await syncService.syncSingleArticle('test-integration-article');
    
    if (success) {
      console.log('  Successfully synced test article to database');
    } else {
      console.error('  Failed to sync test article to database');
    }
    
    // Verify the article was created in the database
    console.log('- Verifying article in database...');
    const dbArticle = await articleRepo.findBySlug('test-integration-article');
    
    if (dbArticle) {
      console.log(`  ✓ Article found in database: ${dbArticle.title}`);
      console.log(`  ✓ Draft status: ${!!dbArticle.is_draft}`);
      console.log(`  ✓ Main headline: ${!!dbArticle.is_main_headline}`);
      console.log(`  ✓ Category ID: ${dbArticle.category_id}`);
      
      // Check if author relationship was created
      const authorLinks = await articleRepo.all(
        'SELECT * FROM article_authors WHERE article_id = ?', 
        [dbArticle.id]
      );
      console.log(`  ✓ Author links in database: ${authorLinks.length}`);
    } else {
      console.error('  ✗ Article NOT found in database');
    }
    
    // Clean up: remove the test file
    console.log('- Cleaning up test files...');
    await fs.rm(testArticleDir, { recursive: true, force: true });
    console.log('  Removed test article directory');
    
    // Also remove from database
    if (dbArticle) {
      await articleRepo.delete('test-integration-article');
      console.log('  Removed test article from database');
    }
    
    await authorRepo.delete('test-author-integration');
    console.log('  Removed test author from database');
    
    await categoryRepo.delete('test-category-integration');
    console.log('  Removed test category from database');
    
    console.log('\nExtended integration test completed successfully!');
  } catch (error) {
    console.error('Extended integration test failed:', error);
    process.exit(1);
  }
}

// Run the test
runExtendedIntegrationTest();