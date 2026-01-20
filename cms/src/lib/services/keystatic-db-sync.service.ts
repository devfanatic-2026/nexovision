import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import matter from 'gray-matter';
import { container } from '../di/container.js';
import { ArticleRepository, Article } from '../repositories/article.repository.js';
import { AuthorRepository } from '../repositories/author.repository.js';
import { CategoryRepository } from '../repositories/category.repository.js';

export interface KeystaticArticleData {
  title: string;
  description?: string;
  cover?: string;
  category?: string; // Category slug
  publishedTime?: string;
  isDraft?: boolean;
  isMainHeadline?: boolean;
  isSubHeadline?: boolean;
  isCategoryMainHeadline?: boolean;
  isCategorySubHeadline?: boolean;
  authors?: string[]; // Array of author slugs
  content: string;
}

export class KeystaticDBSyncService {
  private articleRepo: ArticleRepository;
  private authorRepo: AuthorRepository;
  private categoryRepo: CategoryRepository;

  constructor(
    articleRepo: ArticleRepository,
    authorRepo: AuthorRepository,
    categoryRepo: CategoryRepository
  ) {
    this.articleRepo = articleRepo;
    this.authorRepo = authorRepo;
    this.categoryRepo = categoryRepo;
  }

  /**
   * Sync categories from Keystatic content directory to database
   */
  async syncCategoriesFromKeystatic(): Promise<{ created: number; updated: number; errors: string[] }> {
    const categoriesDir = path.join(process.cwd(), '../sitio/content/categories');
    const result = { created: 0, updated: 0, errors: [] as string[] };

    try {
      if (!await this.pathExists(categoriesDir)) {
        console.log(`Categories directory does not exist: ${categoriesDir}`);
        return result;
      }

      const categoryDirs = await fs.readdir(categoriesDir, { withFileTypes: true });

      for (const dirent of categoryDirs) {
        if (dirent.isDirectory()) {
          try {
            const categoryPath = path.join(categoriesDir, dirent.name);
            const jsonPath = path.join(categoryPath, 'index.json');

            if (await this.pathExists(jsonPath)) {
              const fileContent = await fs.readFile(jsonPath, 'utf-8');
              const data = JSON.parse(fileContent);

              const existingCategory = await this.categoryRepo.findBySlug(dirent.name);

              if (existingCategory) {
                await this.categoryRepo.update(dirent.name, {
                  title: data.title || dirent.name,
                  inspire: data.inspire || ''
                });
                result.updated++;
              } else {
                await this.categoryRepo.create({
                  id: randomUUID(),
                  slug: dirent.name,
                  title: data.title || dirent.name,
                  inspire: data.inspire || ''
                });
                result.created++;
              }
            }
          } catch (error) {
            const errorMessage = `Error processing category ${dirent.name}: ${error instanceof Error ? error.message : String(error)}`;
            console.error(errorMessage);
            result.errors.push(errorMessage);
          }
        }
      }
    } catch (error) {
      const errorMessage = `Error syncing categories from Keystatic: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);
      result.errors.push(errorMessage);
    }

    return result;
  }

  /**
   * Sync authors from Keystatic content directory to database
   */
  async syncAuthorsFromKeystatic(): Promise<{ created: number; updated: number; errors: string[] }> {
    const authorsDir = path.join(process.cwd(), '../sitio/content/authors');
    const result = { created: 0, updated: 0, errors: [] as string[] };

    try {
      if (!await this.pathExists(authorsDir)) {
        console.log(`Authors directory does not exist: ${authorsDir}`);
        return result;
      }

      const authorDirs = await fs.readdir(authorsDir, { withFileTypes: true });

      for (const dirent of authorDirs) {
        if (dirent.isDirectory()) {
          try {
            const authorPath = path.join(authorsDir, dirent.name);
            const markdownFiles = await fs.readdir(authorPath);
            const markdownFile = markdownFiles.find(f => f.endsWith('.md') || f.endsWith('.mdx'));

            if (markdownFile) {
              const filePath = path.join(authorPath, markdownFile);
              const fileContent = await fs.readFile(filePath, 'utf-8');
              const { data } = matter(fileContent);

              const existingAuthor = await this.authorRepo.findBySlug(dirent.name);

              if (existingAuthor) {
                await this.authorRepo.update(dirent.name, {
                  name: data.name || dirent.name,
                  job: data.job || '',
                  avatar: data.avatar || '',
                  bio: data.bio || ''
                });
                result.updated++;
              } else {
                await this.authorRepo.create({
                  id: randomUUID(),
                  slug: dirent.name,
                  name: data.name || dirent.name,
                  job: data.job || '',
                  avatar: data.avatar || '',
                  bio: data.bio || ''
                });
                result.created++;
              }

              // Note: Socials could also be synced here if needed
            }
          } catch (error) {
            const errorMessage = `Error processing author ${dirent.name}: ${error instanceof Error ? error.message : String(error)}`;
            console.error(errorMessage);
            result.errors.push(errorMessage);
          }
        }
      }
    } catch (error) {
      const errorMessage = `Error syncing authors from Keystatic: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);
      result.errors.push(errorMessage);
    }

    return result;
  }

  /**
   * Sync articles from Keystatic content directory to database
   */
  async syncArticlesFromKeystatic(): Promise<{ created: number; updated: number; errors: string[] }> {
    const articlesDir = path.join(process.cwd(), '../sitio/content/articles');
    const result = { created: 0, updated: 0, errors: [] as string[] };

    try {
      if (!await this.pathExists(articlesDir)) {
        console.log(`Articles directory does not exist: ${articlesDir}`);
        return result;
      }

      const articleDirs = await fs.readdir(articlesDir, { withFileTypes: true });

      for (const dirent of articleDirs) {
        if (dirent.isDirectory()) {
          const articlePath = path.join(articlesDir, dirent.name);
          const markdownFiles = await fs.readdir(articlePath);

          for (const file of markdownFiles) {
            if (file.endsWith('.md') || file.endsWith('.mdx')) {
              try {
                const filePath = path.join(articlePath, file);
                const processed = await this.processArticleFile(filePath, dirent.name);

                if (processed.isNew) {
                  result.created++;
                } else {
                  result.updated++;
                }
              } catch (error) {
                const errorMessage = `Error processing article ${dirent.name}: ${error instanceof Error ? error.message : String(error)}`;
                console.error(errorMessage);
                result.errors.push(errorMessage);
              }
            }
          }
        }
      }
    } catch (error) {
      const errorMessage = `Error syncing articles from Keystatic: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMessage);
      result.errors.push(errorMessage);
    }

    return result;
  }

  /**
   * Process a single article markdown file and sync to database
   */
  private async processArticleFile(filePath: string, slug: string): Promise<{ isNew: boolean }> {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    // Ensure publishedTime is a string (ISO format)
    let publishedTimeStr = '';
    if (data.publishedTime) {
      if (data.publishedTime instanceof Date) {
        publishedTimeStr = data.publishedTime.toISOString();
      } else {
        publishedTimeStr = String(data.publishedTime);
      }
    } else {
      publishedTimeStr = new Date().toISOString();
    }

    // Prepare article data
    const articleData: KeystaticArticleData = {
      title: data.title || slug,
      description: data.description || '',
      cover: data.cover || '',
      category: data.category || undefined,
      publishedTime: publishedTimeStr,
      isDraft: data.isDraft ?? false,
      isMainHeadline: data.isMainHeadline ?? false,
      isSubHeadline: data.isSubHeadline ?? false,
      isCategoryMainHeadline: data.isCategoryMainHeadline ?? false,
      isCategorySubHeadline: data.isCategorySubHeadline ?? false,
      authors: data.authors || [],
      content: content
    };

    // Check if article already exists in database
    const existingArticle = await this.articleRepo.findBySlug(slug);

    if (existingArticle) {
      // Update existing article
      await this.articleRepo.update(slug, {
        title: articleData.title,
        description: articleData.description,
        cover: articleData.cover,
        published_time: articleData.publishedTime,
        is_draft: articleData.isDraft ? 1 : 0,
        is_main_headline: articleData.isMainHeadline ? 1 : 0,
        is_sub_headline: articleData.isSubHeadline ? 1 : 0,
        is_category_main_headline: articleData.isCategoryMainHeadline ? 1 : 0,
        is_category_sub_headline: articleData.isCategorySubHeadline ? 1 : 0,
        content: articleData.content
      });

      // Handle category relationship if specified
      if (articleData.category) {
        const category = await this.categoryRepo.findBySlug(articleData.category);
        if (category) {
          await this.articleRepo.update(slug, {
            category_id: category.id
          });
        }
      }

      // Handle authors relationship
      if (articleData.authors && articleData.authors.length > 0) {
        await this.linkAuthorsToArticle(slug, articleData.authors);
      }

      return { isNew: false };
    } else {
      // Find category ID if category is specified
      let categoryId: string | null = null;
      if (articleData.category) {
        const category = await this.categoryRepo.findBySlug(articleData.category);
        if (category) {
          categoryId = category.id;
        }
      }

      // Create new article
      const newArticle: Article = {
        id: randomUUID(),
        slug: slug,
        title: articleData.title,
        description: articleData.description || '',
        cover: articleData.cover || '',
        category_id: categoryId,
        published_time: articleData.publishedTime!,
        is_draft: articleData.isDraft ? 1 : 0,
        is_main_headline: articleData.isMainHeadline ? 1 : 0,
        is_sub_headline: articleData.isSubHeadline ? 1 : 0,
        is_category_main_headline: articleData.isCategoryMainHeadline ? 1 : 0,
        is_category_sub_headline: articleData.isCategorySubHeadline ? 1 : 0,
        content: articleData.content
      };

      await this.articleRepo.create(newArticle);

      // Handle authors relationship
      if (articleData.authors && articleData.authors.length > 0) {
        await this.linkAuthorsToArticle(slug, articleData.authors);
      }

      return { isNew: true };
    }
  }

  /**
   * Link authors to an article in the database
   */
  private async linkAuthorsToArticle(articleSlug: string, authorSlugs: string[]): Promise<void> {
    try {
      const article = await this.articleRepo.findBySlug(articleSlug);
      if (!article) return;

      // First, remove existing author links for this article
      await this.unlinkAuthorsFromArticle(articleSlug);

      // Then add new links
      for (const authorSlug of authorSlugs) {
        const author = await this.authorRepo.findBySlug(authorSlug);
        if (author) {
          await this.articleRepo.rawRun(
            'INSERT OR IGNORE INTO article_authors (article_id, author_id) VALUES (?, ?)',
            [article.id, author.id]
          );
        }
      }
    } catch (error) {
      console.error(`Error linking authors to article ${articleSlug}:`, error);
    }
  }

  /**
   * Remove all author links from an article
   */
  private async unlinkAuthorsFromArticle(articleSlug: string): Promise<void> {
    try {
      const article = await this.articleRepo.findBySlug(articleSlug);
      if (!article) return;

      await this.articleRepo.rawRun(
        'DELETE FROM article_authors WHERE article_id = ?',
        [article.id]
      );
    } catch (error) {
      console.error(`Error unlinking authors from article ${articleSlug}:`, error);
    }
  }

  /**
   * Checks if a path exists
   */
  private async pathExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }
}