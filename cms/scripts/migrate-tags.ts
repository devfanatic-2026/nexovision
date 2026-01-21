
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

async function migrate_schema() {
    console.log('Starting schema migration (tags)...');

    const dbPath = path.resolve(process.cwd(), 'db/cms.sqlite');
    if (!fs.existsSync(dbPath)) {
        console.error('Database not found at:', dbPath);
        process.exit(1);
    }

    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    console.log('Connected to database.');

    await db.exec(`
        CREATE TABLE IF NOT EXISTS tags (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL
        );
    `);
    console.log('Ensured table tags exists.');

    await db.exec(`
        CREATE TABLE IF NOT EXISTS article_tags (
          article_id TEXT NOT NULL,
          tag_id TEXT NOT NULL,
          PRIMARY KEY (article_id, tag_id),
          FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        );
    `);
    console.log('Ensured table article_tags exists.');

    console.log('Schema migration complete.');
}

migrate_schema().catch(console.error);
