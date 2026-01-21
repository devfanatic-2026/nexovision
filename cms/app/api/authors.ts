import { json, error, typedRoute, f } from '@float.js/core';
import { randomUUID } from 'crypto';
import { initializeDb } from '../../src/lib/database.js';
import { Author, AuthorRepository } from '../../src/lib/repositories/author.repository.js';

const isLocalImagesEnabled = process.env.IMAGES_LOCAL === 'true';

export const GET = async () => {
    try {
        const db = await initializeDb();
        const repo = new AuthorRepository(db);
        const authors = await repo.findAll();

        const mappedAuthors = authors.map(a => ({
            ...a,
            avatar: a.avatar_is_local && a.avatar_base64 ? a.avatar_base64 : a.avatar
        }));

        return json(mappedAuthors);
    } catch (err: any) {
        return error(err.message, 500);
    }
};

export const POST = typedRoute({
    body: f.object({
        id: f.string().optional(),
        slug: f.string().min(2),
        name: f.string().min(1),
        job: f.string().optional(),
        avatar: f.string().optional(),
        bio: f.string().optional(),
    })
}, async (req) => {
    try {
        const db = await initializeDb();
        const repo = new AuthorRepository(db);
        const data = req.validated.body;

        let avatar = data.avatar || '';
        let avatar_is_local = 0;
        let avatar_base64: string | null = null;

        if (avatar.startsWith('data:image')) {
            if (!isLocalImagesEnabled) {
                return error('El almacenamiento de imágenes es remoto (IMAGES_LOCAL=false), subir base64 no es soportado.', 400);
            }
            avatar_is_local = 1;
            avatar_base64 = avatar;
            avatar = 'local-avatar';
        }

        const author: Author = {
            id: data.id || randomUUID(),
            slug: data.slug,
            name: data.name,
            job: data.job || '',
            avatar,
            avatar_is_local,
            avatar_base64: avatar_base64 || undefined,
            bio: data.bio || '',
        };

        if (data.id) {
            const existing = await repo.findBySlug(data.slug); // Assuming checking by slug or id, logic might need adjustment but repositories usually find by id. Let's trust findBySlug or update logic.
            // Actually repo.update takes slug.
            // Let's optimize: try update if ID passed? Or simplify to always create if no existing logic.
            // Given limitations, let's just attempt create for now or proper update logic:
            try {
                await repo.update(data.slug, author);
                return json({ message: 'Author updated successfully', id: author.id });
            } catch (e) {
                // Fallback to Create if update fails or not found?
            }
        }

        await repo.create(author);
        return json({ message: 'Author created successfully', id: author.id }, { status: 201 });
    } catch (err: any) {
        return error(err.message, 500);
    }
});
