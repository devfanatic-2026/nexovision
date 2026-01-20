import { json, error, typedRoute, f } from '@float.js/core';
import { randomUUID } from 'crypto';
import { initializeDb } from '../../src/lib/database.js';

export interface Author {
    id: string;
    slug: string;
    name: string;
    job: string;
    avatar: string;
    bio: string;
}

export const GET = async () => {
    try {
        // Direct database connection for API routes to avoid container issues
        const db = await initializeDb();
        const authors = await db.all<Author>('SELECT * FROM authors');
        return json(authors);
    } catch (err: any) {
        return error(err.message, 500);
    }
};

export const POST = typedRoute({
    body: f.object({
        slug: f.string().min(2),
        name: f.string().min(1),
        job: f.string().optional(),
        avatar: f.string().optional(),
        bio: f.string().optional(),
    })
}, async (req) => {
    try {
        const db = await initializeDb();
        const data = req.validated.body;
        const author = {
            id: randomUUID(),
            slug: data.slug,
            name: data.name,
            job: data.job || '',
            avatar: data.avatar || '',
            bio: data.bio || '',
        };

        const sql = 'INSERT INTO authors (id, slug, name, job, avatar, bio) VALUES (?, ?, ?, ?, ?, ?)';
        await db.run(sql, [author.id, author.slug, author.name, author.job, author.avatar, author.bio]);
        return json({ message: 'Author created successfully', id: author.id }, { status: 201 });
    } catch (err: any) {
        return error(err.message, 500);
    }
});
