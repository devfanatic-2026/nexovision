import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { z } from 'zod';
import { f } from '@float.js/core';
import matter from 'gray-matter';
import { container } from '../di/container.js';
import { ArticleRepository, Article } from '../repositories/article.repository.js';
import { AuthorRepository, Author } from '../repositories/author.repository.js';
import { CategoryRepository, Category } from '../repositories/category.repository.js';
import { randomUUID } from 'crypto';

/**
 * Schema definition for content validation
 */
const ContentSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type Content = z.infer<typeof ContentSchema>;

/**
 * Service class for handling content synchronization
 * Implements atomic "all-or-nothing" sync with strict validation
 */
export class SyncService {
  private readonly contentSourceDir: string;
  private readonly dbFile: string;
  private readonly schemaPrompt: string;

  constructor(
    contentSourceDir?: string,
    dbFile?: string,
    schemaPrompt?: string
  ) {
    this.contentSourceDir = contentSourceDir || process.env.CONTENT_SOURCE_DIR || '../sitio/content/articles';
    this.dbFile = dbFile || process.env.DB_FILE || './cms.sqlite';
    this.schemaPrompt = schemaPrompt || process.env.PROMPT_MARKDOWN_SCHEMA || '';
  }

  /**
   * Validates content against the defined schema
   */
  private validateContent(content: any): Content {
    return ContentSchema.parse(content);
  }

  /**
   * Reads and parses markdown files from the content directory
   * @deprecated Use KeystaticDBSyncService instead
   */
  async syncFromKeystatic(): Promise<boolean> {
    return this.sync();
  }

  /**
   * Performs atomic synchronization of content to database
   * Either all content is saved successfully or none is saved
   */
  async sync(): Promise<boolean> {
    try {
      const keystaticSync = await container.resolve<any>('KeystaticDBSyncService');

      console.log('--- Syncing Categories ---');
      await keystaticSync.syncCategoriesFromKeystatic();

      console.log('--- Syncing Authors ---');
      await keystaticSync.syncAuthorsFromKeystatic();

      console.log('--- Syncing Articles ---');
      const result = await keystaticSync.syncArticlesFromKeystatic();

      console.log(`Sync complete: ${result.created} created, ${result.updated} updated, ${result.errors.length} errors`);
      return result.errors.length === 0;
    } catch (error) {
      console.error('Sync failed:', error);
      return false;
    }
  }

  /**
   * Gets all content from the database
   */
  async getAllContent(): Promise<Content[]> {
    const articleRepo = await container.resolve<ArticleRepository>('ArticleRepository');
    const articles = await articleRepo.findAll();

    return articles.map(article => ({
      id: article.id,
      title: article.title,
      content: article.content,
      slug: article.slug,
      createdAt: article.published_time,
      updatedAt: article.published_time,
      author: article.author_names || '',
      category: article.category_title || '',
      tags: []
    }));
  }

  /**
   * Gets content by ID
   */
  async getContentById(id: string): Promise<Content | null> {
    const articleRepo = await container.resolve<ArticleRepository>('ArticleRepository');
    const article = await articleRepo.findById(id);

    if (!article) return null;

    return {
      id: article.id,
      title: article.title,
      content: article.content,
      slug: article.slug,
      createdAt: article.published_time,
      updatedAt: article.published_time,
      author: '',
      category: article.category_id || '',
      tags: []
    };
  }

  /**
   * Runs the sync process and returns a result object
   */
  async runSync(): Promise<{ success: boolean; message: string }> {
    try {
      const success = await this.sync();
      if (success) {
        return {
          success: true,
          message: 'Content synchronized successfully from Keystatic to database'
        };
      } else {
        return {
          success: false,
          message: 'Content synchronization failed or had errors'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Content synchronization error: ${error.message}`
      };
    }
  }
}