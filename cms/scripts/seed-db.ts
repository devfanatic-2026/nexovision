import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { readFile } from 'fs/promises';
import path from 'path';

async function seed() {
    console.log('🌱 Seeding CMS Database from JSON...');

    const dbPath = path.resolve('./cms.sqlite');
    const dataPath = path.resolve('./initialData/data.json');

    const rawData = await readFile(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    const db = await open({ filename: dbPath, driver: sqlite3.Database });

    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON;');

    console.log('🧹 Clearing tables...');
    await db.exec('DELETE FROM article_authors');
    await db.exec('DELETE FROM articles');
    await db.exec('DELETE FROM authors');
    await db.exec('DELETE FROM categories');

    const categoryMap = new Map<string, string>();

    console.log('📦 Seeding categories...');
    for (const cat of data.categories) {
        await db.run(
            'INSERT INTO categories (id, slug, title, inspire) VALUES (?, ?, ?, ?)',
            [cat.id, cat.slug, cat.title, cat.inspire]
        );
        categoryMap.set(cat.slug, cat.id);
    }

    console.log('📦 Seeding authors...');
    for (const author of data.authors) {
        await db.run(
            'INSERT INTO authors (id, slug, name, job, avatar, bio) VALUES (?, ?, ?, ?, ?, ?)',
            [author.id, author.slug, author.name, author.job, author.avatar, author.bio]
        );
    }

    console.log('📦 Seeding articles...');
    for (const article of data.articles) {
        // Map category slug to ID
        let catId = article.category_id;
        if (categoryMap.has(article.category_id)) {
            catId = categoryMap.get(article.category_id);
        }

        await db.run(
            `INSERT INTO articles (
                id, slug, title, description, cover, category_id, published_time, 
                is_draft, is_main_headline, is_sub_headline, 
                is_category_main_headline, is_category_sub_headline, content
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                article.id, article.slug, article.title, article.description, article.cover,
                catId, article.published_time,
                article.is_draft || 0, article.is_main_headline || 0,
                article.is_sub_headline || 0, article.is_category_main_headline || 0,
                article.is_category_sub_headline || 0, article.content
            ]
        );

        // Since the JSON doesn't specify article_author links, 
        // we'll link them to the first author for now if one exists, 
        // OR skip if we want to be strict.
        // Actually, let's link to the first author so they show up.
        if (data.authors.length > 0) {
            await db.run(
                'INSERT INTO article_authors (article_id, author_id) VALUES (?, ?)',
                [article.id, data.authors[0].id]
            );
        }
    }

    console.log('✅ CMS Seeding completed!');
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
