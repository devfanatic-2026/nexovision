import { readFile } from 'fs/promises';
import path from 'path';
import 'dotenv/config';

const API_URL = process.env.API_URL || 'http://localhost:3001';
const API_BASE = `${API_URL}/api`;

async function main() {
    console.log('🌱 Starting seed process...');

    // Read data
    const dataPath = path.join(process.cwd(), 'initialData', 'data.json');
    const rawData = await readFile(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    // 1. Seed Categories
    console.log(`\n📚 Seeding ${data.categories.length} categories...`);
    for (const cat of data.categories) {
        try {
            const res = await fetch(`${API_BASE}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cat)
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(`${res.status} ${res.statusText}: ${err}`);
            }
            console.log(`  ✓ Category: ${cat.title}`);
        } catch (e: any) {
            console.error(`  ✗ Error seeding category ${cat.title}:`, e.message);
        }
    }

    // 2. Seed Authors
    console.log(`\n✍️  Seeding ${data.authors.length} authors...`);
    for (const author of data.authors) {
        try {
            // Prepared payload
            const payload = { ...author };

            // If we have a base64 avatar, use it as 'avatar' so the API processes it
            if (author.avatar_is_local === 1 && author.avatar_base64) {
                payload.avatar = author.avatar_base64;
            }
            // If we don't have base64 but have a URL, 'avatar' already has it.

            // Clean up internal DB fields not needed for Post (though API might ignore them)
            delete payload.avatar_is_local;
            delete payload.avatar_base64;

            const res = await fetch(`${API_BASE}/authors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(`${res.status} ${res.statusText}: ${err}`);
            }
            console.log(`  ✓ Author: ${author.name}`);
        } catch (e: any) {
            console.error(`  ✗ Error seeding author ${author.name}:`, e.message);
        }
    }

    // 3. Seed Articles
    console.log(`\n📰 Seeding ${data.articles.length} articles...`);

    // Fetch categories to create slug -> id map
    let categoryMap = new Map<string, string>();
    try {
        const catRes = await fetch(`${API_BASE}/categories`);
        if (catRes.ok) {
            const categories = await catRes.json();
            for (const cat of categories) {
                categoryMap.set(cat.slug, cat.id);
            }
        } else {
            console.warn('  ⚠️ Could not fetch categories to map IDs. Articles might fail if category_id is a slug.');
        }
    } catch (e) {
        console.warn('  ⚠️ Error fetching categories:', e);
    }

    for (const article of data.articles) {
        try {
            const payload: any = { ...article };

            // Map category_id (slug) to UUID
            if (payload.category_id && categoryMap.has(payload.category_id)) {
                payload.category_id = categoryMap.get(payload.category_id);
            }

            // Convert integer booleans to actual booleans for API validation
            const booleanFields = [
                'is_draft',
                'is_main_headline',
                'is_sub_headline',
                'is_category_main_headline',
                'is_category_sub_headline'
            ];

            for (const field of booleanFields) {
                if (payload[field] === 0) payload[field] = false;
                if (payload[field] === 1) payload[field] = true;
            }

            // Handle cover
            if (article.cover_is_local === 1 && article.cover_base64) {
                payload.cover = article.cover_base64;
            }

            delete payload.cover_is_local;
            delete payload.cover_base64;

            const res = await fetch(`${API_BASE}/articles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(`${res.status} ${res.statusText}: ${err}`);
            }
            console.log(`  ✓ Article: ${article.title}`);
        } catch (e: any) {
            console.error(`  ✗ Error seeding article ${article.title}:`, e.message);
        }
    }

    console.log('\n✨ Seed completed!');
}

main().catch(console.error);
