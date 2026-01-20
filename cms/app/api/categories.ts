import { json, error, typedRoute, f } from '@float.js/core';
import { randomUUID } from 'crypto';
import { initializeDb } from '../../src/lib/database.js';

export interface Category {
    id: string;
    slug: string;
    title: string;
    inspire: string;
}

export const GET = async () => {
    try {
        // Direct database connection for API routes to avoid container issues
        const db = await initializeDb();
        const categories = await db.all<Category>('SELECT * FROM categories');
        return json(categories);
    } catch (err: any) {
        return error(err.message, 500);
    }
};

export const POST = typedRoute({
    body: f.object({
        slug: f.string().min(2),
        title: f.string().min(1),
        inspire: f.string().optional(),
    })
}, async (req) => {
    try {
        const db = await initializeDb();
        const data = req.validated.body;
        const category = {
            id: randomUUID(),
            slug: data.slug,
            title: data.title,
            inspire: data.inspire || '',
        };

        const sql = 'INSERT INTO categories (id, slug, title, inspire) VALUES (?, ?, ?, ?)';
        await db.run(sql, [category.id, category.slug, category.title, category.inspire]);
        return json({ message: 'Category created successfully', id: category.id }, { status: 201 });
    } catch (err: any) {
        return error(err.message, 500);
    }
});
