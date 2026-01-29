
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import 'dotenv/config';

async function main() {
    const dbPath = process.env.DB_FILE || './db/cms.sqlite';

    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    const categories = await db.all('SELECT * FROM categories');
    const authors = await db.all('SELECT * FROM authors');

    // Get authors socials
    const authorSocials = await db.all('SELECT * FROM author_socials');
    // Map socials to authors
    for (const author of authors) {
        author.socials = authorSocials.filter((s: any) => s.author_id === author.id);
    }

    const articles = await db.all('SELECT * FROM articles');

    // Get article tags
    const tags = await db.all('SELECT * FROM tags');
    const articleTags = await db.all('SELECT * FROM article_tags');

    // Map tags to articles
    for (const article of articles) {
        const aTags = articleTags
            .filter((at: any) => at.article_id === article.id)
            .map((at: any) => tags.find((t: any) => t.id === at.tag_id)?.name)
            .filter(Boolean);
        article.tags = aTags;
    }

    const data = {
        categories,
        authors,
        articles
    };

    const outDir = './initialData';
    await mkdir(outDir, { recursive: true });

    await writeFile(path.join(outDir, 'data.json'), JSON.stringify(data, null, 2));
    console.log(`Exported data to ${path.join(outDir, 'data.json')}`);
}

main().catch(console.error);
