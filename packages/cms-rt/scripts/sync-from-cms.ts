import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

async function sync() {
    console.log('🔄 Syncing CMS-RT from CMS...');

    const cmsDbPath = path.resolve('../../cms/cms.sqlite');
    const rtDbPath = path.resolve('./db/cms.sqlite');

    if (!fs.existsSync(cmsDbPath)) {
        console.error('❌ Source CMS database not found at:', cmsDbPath);
        process.exit(1);
    }

    // Ensure target directory exists
    const rtDbDir = path.dirname(rtDbPath);
    if (!fs.existsSync(rtDbDir)) {
        fs.mkdirSync(rtDbDir, { recursive: true });
    }

    // Open databases
    const cmsDb = await open({ filename: cmsDbPath, driver: sqlite3.Database });
    const rtDb = await open({ filename: rtDbPath, driver: sqlite3.Database });

    console.log('🧹 Clearing CMS-RT tables...');
    // Clear tables in reverse order of foreign keys
    await rtDb.exec('DELETE FROM article_authors');
    await rtDb.exec('DELETE FROM author_socials');
    await rtDb.exec('DELETE FROM articles');
    await rtDb.exec('DELETE FROM authors');
    await rtDb.exec('DELETE FROM categories');

    // Sync categories
    console.log('📦 Syncing categories...');
    const categories = await cmsDb.all('SELECT * FROM categories');
    for (const cat of categories) {
        await rtDb.run(
            'INSERT INTO categories (id, slug, title, inspire) VALUES (?, ?, ?, ?)',
            [cat.id, cat.slug, cat.title, cat.inspire]
        );
    }

    // Sync authors
    console.log('📦 Syncing authors...');
    const authors = await cmsDb.all('SELECT * FROM authors');
    for (const author of authors) {
        await rtDb.run(
            'INSERT INTO authors (id, slug, name, job, avatar, bio) VALUES (?, ?, ?, ?, ?, ?)',
            [author.id, author.slug, author.name, author.job, author.avatar, author.bio]
        );
    }

    // Sync socials
    console.log('📦 Syncing socials...');
    const socials = await cmsDb.all('SELECT * FROM author_socials');
    for (const social of socials) {
        await rtDb.run(
            'INSERT INTO author_socials (id, author_id, name, url, icon) VALUES (?, ?, ?, ?, ?)',
            [social.id, social.author_id, social.name, social.url, social.icon]
        );
    }

    // Sync articles
    console.log('📦 Syncing articles...');
    const articles = await cmsDb.all('SELECT * FROM articles');
    for (const article of articles) {
        await rtDb.run(
            `INSERT INTO articles (
                id, slug, title, description, cover, category_id, published_time, 
                is_draft, is_main_headline, is_sub_headline, 
                is_category_main_headline, is_category_sub_headline, content
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                article.id, article.slug, article.title, article.description, article.cover,
                article.category_id, article.published_time, article.is_draft,
                article.is_main_headline, article.is_sub_headline,
                article.is_category_main_headline, article.is_category_sub_headline,
                article.content
            ]
        );
    }

    // Sync article_authors
    console.log('📦 Syncing article_authors connections...');
    const connections = await cmsDb.all('SELECT * FROM article_authors');
    for (const conn of connections) {
        await rtDb.run(
            'INSERT INTO article_authors (article_id, author_id) VALUES (?, ?)',
            [conn.article_id, conn.author_id]
        );
    }

    console.log('✅ Sync completed successfully!');
    process.exit(0);
}

sync().catch(err => {
    console.error('❌ Sync failed:', err);
    process.exit(1);
});
