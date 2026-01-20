import { container } from './src/lib/di/container.js';
import { ArticleRepository } from './src/lib/repositories/article.repository.js';
import { AuthorRepository } from './src/lib/repositories/author.repository.js';
import { CategoryRepository } from './src/lib/repositories/category.repository.js';
import { randomUUID } from 'crypto';

async function runIntegrityTest() {
  console.log('Starting Database Integrity Test...');
  
  try {
    // Get repositories
    const articleRepo = await container.resolve<ArticleRepository>('ArticleRepository');
    const authorRepo = await container.resolve<AuthorRepository>('AuthorRepository');
    const categoryRepo = await container.resolve<CategoryRepository>('CategoryRepository');
    
    console.log('Testing individual repository functionality...');
    
    // Test 1: Create a category
    console.log('- Testing category creation...');
    const testCategory = {
      id: randomUUID(),
      slug: 'test-category-' + Date.now(),
      title: 'Test Category',
      inspire: 'Test inspirational phrase'
    };
    
    await categoryRepo.create(testCategory);
    console.log(`  Created category: ${testCategory.title}`);
    
    // Test 2: Create an author
    console.log('- Testing author creation...');
    const testAuthor = {
      id: randomUUID(),
      slug: 'test-author-' + Date.now(),
      name: 'Test Author',
      job: 'Tester',
      avatar: '',
      bio: 'A test author'
    };
    
    await authorRepo.create(testAuthor);
    console.log(`  Created author: ${testAuthor.name}`);
    
    // Test 3: Create an article with the category
    console.log('- Testing article creation with category reference...');
    const testArticle = {
      id: randomUUID(),
      slug: 'test-article-' + Date.now(),
      title: 'Test Article',
      description: 'A test article',
      cover: '',
      category_id: testCategory.id, // Reference to the created category
      published_time: new Date().toISOString(),
      is_draft: 0,
      is_main_headline: 0,
      is_sub_headline: 0,
      is_category_main_headline: 0,
      is_category_sub_headline: 0,
      content: '# Test Article\n\nThis is a test article content.'
    };
    
    await articleRepo.create(testArticle);
    console.log(`  Created article: ${testArticle.title}`);
    
    // Test 4: Verify foreign key constraint by trying to create an article with invalid category
    console.log('- Testing foreign key constraint...');
    try {
      const invalidArticle = {
        id: randomUUID(),
        slug: 'invalid-article-' + Date.now(),
        title: 'Invalid Article',
        description: 'An article with invalid category',
        cover: '',
        category_id: 'non-existent-id', // Invalid category ID
        published_time: new Date().toISOString(),
        is_draft: 0,
        is_main_headline: 0,
        is_sub_headline: 0,
        is_category_main_headline: 0,
        is_category_sub_headline: 0,
        content: '# Invalid Article\n\nThis should fail.'
      };
      
      await articleRepo.create(invalidArticle);
      console.log('  ERROR: Foreign key constraint was not enforced!');
    } catch (error) {
      console.log('  SUCCESS: Foreign key constraint properly enforced');
    }
    
    // Test 5: Retrieve all articles to verify they exist
    console.log('- Testing article retrieval...');
    const articles = await articleRepo.findAll();
    console.log(`  Retrieved ${articles.length} articles`);
    
    // Test 6: Retrieve the specific article we created
    console.log('- Testing specific article retrieval...');
    const retrievedArticle = await articleRepo.findBySlug(testArticle.slug);
    if (retrievedArticle) {
      console.log(`  Found article: ${retrievedArticle.title}`);
    } else {
      console.log('  ERROR: Could not find created article');
    }
    
    // Test 7: Update an article
    console.log('- Testing article update...');
    await articleRepo.update(testArticle.slug, {
      title: 'Updated Test Article',
      is_main_headline: 1
    });
    
    const updatedArticle = await articleRepo.findBySlug(testArticle.slug);
    if (updatedArticle && updatedArticle.title === 'Updated Test Article') {
      console.log('  SUCCESS: Article updated correctly');
    } else {
      console.log('  ERROR: Article update failed');
    }
    
    // Test 8: Test referential integrity by deleting category
    console.log('- Testing referential integrity (category deletion)...');
    try {
      // First, we need to remove the article's reference to the category or delete the article first
      await articleRepo.update(testArticle.slug, { category_id: null });
      await categoryRepo.delete(testCategory.slug);
      console.log('  SUCCESS: Category deleted after clearing references');
    } catch (error) {
      console.log('  ERROR during category deletion:', error);
    }
    
    console.log('\nDatabase integrity test completed successfully!');
  } catch (error) {
    console.error('Database integrity test failed:', error);
    process.exit(1);
  }
}

// Run the test
runIntegrityTest();