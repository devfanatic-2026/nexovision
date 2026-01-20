import { typedRoute, f, json, error } from '@float.js/core';
import { Article, ArticleRepository } from '../../src/lib/repositories/article.repository.js';
import { randomUUID } from 'crypto';
import { initializeDb } from '../../src/lib/database.js';

export const GET = async () => {
    try {
        const db = await initializeDb();
        const repo = new ArticleRepository(db);
        const articles = await repo.findAllWithRelations();
        return json(articles);
    } catch (err: any) {
        return error(err.message, 500);
    }
};

export const POST = typedRoute({
    body: f.object({
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
    })
}, async (req) => {
    try {
        const db = await initializeDb();
        const repo = new ArticleRepository(db);
        const data = req.validated.body;
        const article: Article = {
            id: randomUUID(),
            slug: data.slug,
            title: data.title,
            description: data.description || '',
            cover: data.cover || '',
            category_id: data.category_id || null,
            published_time: data.published_time || new Date().toISOString(),
            is_draft: data.is_draft ? 1 : 0,
            is_main_headline: data.is_main_headline ? 1 : 0,
            is_sub_headline: data.is_sub_headline ? 1 : 0,
            is_category_main_headline: data.is_category_main_headline ? 1 : 0,
            is_category_sub_headline: data.is_category_sub_headline ? 1 : 0,
            content: data.content,
        };

        await repo.create(article);
        return json({ message: 'Article created successfully', id: article.id }, { status: 201 });
    } catch (err: any) {
        return error(err.message, 500);
    }
});
