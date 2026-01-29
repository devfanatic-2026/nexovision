import { initializeDb } from '../src/lib/database.js';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
    console.log('🌱 Seeding CMS-RT Database...');
    const db = await initializeDb();

    // Clear existing
    await db.exec('DELETE FROM article_authors');
    await db.exec('DELETE FROM articles');
    await db.exec('DELETE FROM authors');
    await db.exec('DELETE FROM categories');

    // Categories
    const catId = uuidv4();
    await db.run(
        'INSERT INTO categories (id, slug, title) VALUES (?, ?, ?)',
        [catId, 'tecnologia', 'Tecnología']
    );

    // Authors
    const authorId = uuidv4();
    await db.run(
        'INSERT INTO authors (id, slug, name, job) VALUES (?, ?, ?, ?)',
        [authorId, 'alejandro', 'Alejandro Iglesias', 'Lead Developer']
    );

    // Articles
    const articles = [
        {
            id: uuidv4(),
            slug: 'bienvenidos-a-nexovision-rt',
            title: 'Bienvenidos a NexoVisión Realtime',
            description: 'Explora nuestra nueva plataforma de noticias en tiempo real basada en widgets.',
            cover: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800',
            published_time: new Date().toISOString(),
        },
        {
            id: uuidv4(),
            slug: 'widgets-reutilizables-con-nativo',
            title: 'Widgets Reutilizables: El Futuro del Desarrollo',
            description: 'Cómo compartir lógica y UI entre web y móvil usando React Native y Float.js.',
            cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            published_time: new Date().toISOString(),
        }
    ];

    for (const article of articles) {
        await db.run(
            'INSERT INTO articles (id, slug, title, description, cover, category_id, published_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [article.id, article.slug, article.title, article.description, article.cover, catId, article.published_time]
        );

        await db.run(
            'INSERT INTO article_authors (article_id, author_id) VALUES (?, ?)',
            [article.id, authorId]
        );
    }

    console.log('✅ Seeding completed! Added 2 articles.');
}

seed().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
