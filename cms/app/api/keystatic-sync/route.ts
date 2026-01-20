import { f, typedRoute, json, error } from '@float.js/core';
import { container } from '../src/lib/di/container.js';
import { KeystaticDBSyncService } from '../src/lib/services/keystatic-db-sync.service.js';
import { ArticleRepository } from '../src/lib/repositories/article.repository.js';

// API endpoint to handle Keystatic updates and sync to database
export const POST = typedRoute({
  body: f.object({
    action: f.union([
      f.literal('sync_article'),
      f.literal('sync_all_articles'),
      f.literal('delete_article')
    ]),
    articleSlug: f.string().optional(),
  })
}, async (req) => {
  try {
    const { action, articleSlug } = req.validated.body;
    const syncService = await container.resolve<KeystaticDBSyncService>('KeystaticDBSyncService');
    
    switch (action) {
      case 'sync_article':
        if (!articleSlug) {
          return error('Article slug is required for sync_article action', 400);
        }
        
        const success = await syncService.syncSingleArticle(articleSlug);
        if (success) {
          return json({ message: `Article ${articleSlug} synced successfully` });
        } else {
          return error(`Failed to sync article ${articleSlug}`, 500);
        }
        
      case 'sync_all_articles':
        const syncResult = await syncService.syncArticlesFromKeystatic();
        return json({ 
          message: 'All articles synced successfully', 
          details: syncResult 
        });
        
      case 'delete_article':
        if (!articleSlug) {
          return error('Article slug is required for delete_article action', 400);
        }
        
        const articleRepo = await container.resolve<ArticleRepository>('ArticleRepository');
        await articleRepo.delete(articleSlug);
        return json({ message: `Article ${articleSlug} deleted from database` });
        
      default:
        return error('Invalid action', 400);
    }
  } catch (err: any) {
    console.error('Keystatic sync API error:', err);
    return error(err.message, 500);
  }
});

// GET endpoint to check sync status
export const GET = async () => {
  try {
    const articleRepo = await container.resolve<ArticleRepository>('ArticleRepository');
    const articles = await articleRepo.findAll();
    
    return json({
      totalArticlesInDatabase: articles.length,
      lastSync: new Date().toISOString()
    });
  } catch (err: any) {
    return error(err.message, 500);
  }
};