import { typedRoute, f, json, error } from '@float.js/core';
import { Article, ArticleRepository } from '../../src/lib/repositories/article.repository.js';
import { randomUUID } from 'crypto';
import { initializeDb } from '../../src/lib/database.js';

const isLocalImagesEnabled = process.env.IMAGES_LOCAL === 'true';

export const GET = async () => {
    try {
        const db = await initializeDb();
        const repo = new ArticleRepository(db);
        const articles = await repo.findAllWithRelations();

        // Map local base64 images to cover property for frontend display
        const mappedArticles = articles.map(a => ({
            ...a,
            cover: a.cover_is_local && a.cover_base64 ? a.cover_base64 : a.cover
        }));

        return json(mappedArticles);
    } catch (err: any) {
        return error(err.message, 500);
    }
};

export const POST = typedRoute({
    body: f.object({
        id: f.string().optional(), // Allow ID for updates
        slug: f.string().min(2),
        title: f.string().min(1),
        description: f.string().optional(),
        cover: f.string().optional(),
        category_id: f.string().optional(),
        published_time: f.string().optional(),
        is_draft: f.boolean().optional(),
        is_main_headline: f.boolean().optional(),
        is_sub_headline: f.boolean().optional(),
        is_category_main_headline: f.boolean().optional(),
        is_category_sub_headline: f.boolean().optional(),
        content: f.string().min(1),
        tags: f.array(f.string()).optional(),
    })
}, async (req) => {
    try {
        const db = await initializeDb();
        const repo = new ArticleRepository(db);
        const data = req.validated.body;

        // Handle Image Logic
        let cover = data.cover || '';
        let cover_is_local = 0;
        let cover_base64: string | null = null;

        if (cover.startsWith('data:image')) {
            if (!isLocalImagesEnabled) {
                return error('El almacenamiento de imágenes es remoto (IMAGES_LOCAL=false), subir base64 no es soportado.', 400);
            }
            // It's a local base64 upload
            cover_is_local = 1;
            cover_base64 = cover;
            cover = 'local-image'; // Placeholder for the path
        } else if (cover.startsWith('http')) {
            // Remote URL - allowed even if IMAGES_LOCAL=true, but marked as not local
            cover_is_local = 0;
        }

        const article: Article = {
            id: data.id || randomUUID(),
            slug: data.slug,
            title: data.title,
            description: data.description || '',
            cover,
            cover_is_local,
            cover_base64: cover_base64 || undefined,
            category_id: data.category_id || null,
            published_time: data.published_time || new Date().toISOString(),
            is_draft: data.is_draft ? 1 : 0,
            is_main_headline: data.is_main_headline ? 1 : 0,
            is_sub_headline: data.is_sub_headline ? 1 : 0,
            is_category_main_headline: data.is_category_main_headline ? 1 : 0,
            is_category_sub_headline: data.is_category_sub_headline ? 1 : 0,
            content: data.content,
        };

        // Check if updating or creating
        if (data.id) {
            const existing = await repo.findById(data.id);
            if (existing) {
                await repo.update(data.slug, article);
                if (data.tags) {
                    await repo.setTags(article.id, data.tags);
                }
                return json({ message: 'Article updated successfully', id: article.id });
            }
        }

        await repo.create(article);
        if (data.tags) {
            await repo.setTags(article.id, data.tags);
        }
        return json({ message: 'Article created successfully', id: article.id }, { status: 201 });
    } catch (err: any) {
        // Safe date handling in case of errors
        console.error(err);
        return error(err.message, 500);
    }
});
