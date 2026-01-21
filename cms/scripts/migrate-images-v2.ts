
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

async function migrate() {
    console.log('Starting image migration to base64...');

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

    // Ensure columns exist
    const ensureColumns = async (table: string, columns: string[]) => {
        for (const col of columns) {
            try {
                await db.run(`ALTER TABLE ${table} ADD COLUMN ${col}`);
                console.log(`Added column ${col} to ${table}`);
            } catch (e: any) {
                if (!e.message.includes('duplicate column')) {
                    // console.log(`Column ${col} already exists in ${table} or error: ${e.message}`);
                }
            }
        }
    };

    await ensureColumns('authors', ['avatar_is_local INTEGER DEFAULT 0', 'avatar_base64 TEXT']);
    await ensureColumns('articles', ['cover_is_local INTEGER DEFAULT 0', 'cover_base64 TEXT']);

    // --- Migrate Authors ---
    const authors = await db.all('SELECT * FROM authors');
    console.log(`Found ${authors.length} authors to check.`);

    for (const author of authors) {
        if (!author.avatar || author.avatar.startsWith('data:image') || author.avatar_is_local === 1) {
            continue;
        }

        const originalPath = author.avatar;
        let relativePath = originalPath;

        // Clean @[...] or just @ or just []
        if (relativePath.startsWith('@[')) {
            relativePath = relativePath.replace(/^@\[/, '').replace(/\]$/, '');
        } else if (relativePath.startsWith('@')) {
            relativePath = relativePath.substring(1);
        } else if (relativePath.startsWith('[')) {
            relativePath = relativePath.replace(/^\[/, '').replace(/\]$/, '');
        }

        console.log(`Processing author ${author.slug}: '${originalPath}' -> '${relativePath}'`);

        let fileToRead = '';

        if (relativePath.startsWith('sitio/')) {
            fileToRead = path.resolve(process.cwd(), '../', relativePath);
        } else if (relativePath.startsWith('assets/')) {
            fileToRead = path.resolve(process.cwd(), '../sitio', relativePath);
        } else if (relativePath.startsWith('/assets/')) {
            fileToRead = path.resolve(process.cwd(), '../sitio', relativePath.substring(1));
        } else {
            // Fallback: try to find it in sitio/assets if it looks like a filename?
            // Or maybe it is just "images/..."
            // Let's try resolving against sitio/assets/images/authors/${slug}/... if simple filename?
            // But for now just log.
        }

        if (fileToRead && fs.existsSync(fileToRead)) {
            try {
                const buffer = fs.readFileSync(fileToRead);
                const ext = path.extname(fileToRead).substring(1);
                let mime = 'image/jpeg';
                if (ext === 'png') mime = 'image/png';
                if (ext === 'webp') mime = 'image/webp';
                if (ext === 'gif') mime = 'image/gif';
                if (ext === 'svg') mime = 'image/svg+xml';

                const base64 = `data:${mime};base64,${buffer.toString('base64')}`;

                await db.run(
                    'UPDATE authors SET avatar = ?, avatar_is_local = 1, avatar_base64 = ? WHERE id = ?',
                    'local-avatar',
                    base64,
                    author.id
                );
                console.log(`Migrated author ${author.slug} (Size: ${base64.length})`);
            } catch (e) {
                console.error(`Failed to migrate author ${author.slug}:`, e);
            }
        } else {
            console.warn(`File not found for author ${author.slug}: ${originalPath} (Target: ${fileToRead})`);
        }
    }

    // --- Migrate Articles ---
    const articles = await db.all('SELECT * FROM articles');
    console.log(`Found ${articles.length} articles to check.`);

    for (const article of articles) {
        if (!article.cover || article.cover.startsWith('data:image') || article.cover_is_local === 1) {
            continue;
        }

        const originalPath = article.cover;

        if (originalPath.startsWith('http')) {
            console.log(`Skipping remote image for article ${article.slug}`);
            continue;
        }

        let relativePath = originalPath;
        if (relativePath.startsWith('@[')) {
            relativePath = relativePath.replace(/^@\[/, '').replace(/\]$/, '');
        } else if (relativePath.startsWith('@')) {
            relativePath = relativePath.substring(1);
        } else if (relativePath.startsWith('[')) {
            relativePath = relativePath.replace(/^\[/, '').replace(/\]$/, '');
        }

        let fileToRead = '';

        if (relativePath.startsWith('sitio/')) {
            fileToRead = path.resolve(process.cwd(), '../', relativePath);
        } else if (relativePath.startsWith('assets/')) {
            fileToRead = path.resolve(process.cwd(), '../sitio', relativePath);
        } else if (relativePath.startsWith('/assets/')) {
            fileToRead = path.resolve(process.cwd(), '../sitio', relativePath.substring(1));
        }

        if (fileToRead && fs.existsSync(fileToRead)) {
            try {
                const buffer = fs.readFileSync(fileToRead);
                const ext = path.extname(fileToRead).substring(1);
                let mime = 'image/jpeg';
                if (ext === 'png') mime = 'image/png';
                if (ext === 'webp') mime = 'image/webp';
                if (ext === 'gif') mime = 'image/gif';
                if (ext === 'svg') mime = 'image/svg+xml';

                const base64 = `data:${mime};base64,${buffer.toString('base64')}`;

                await db.run(
                    'UPDATE articles SET cover = ?, cover_is_local = 1, cover_base64 = ? WHERE id = ?',
                    'local-cover',
                    base64,
                    article.id
                );
                console.log(`Migrated article ${article.slug}`);
            } catch (e) {
                console.error(`Failed to migrate article ${article.slug}:`, e);
            }
        } else {
            console.warn(`File not found for article ${article.slug}: ${originalPath} (Target: ${fileToRead})`);
        }
    }

    console.log('Migration complete.');
}

migrate().catch(console.error);
