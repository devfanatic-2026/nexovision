import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'content/articles');
const authorsDirectory = path.join(process.cwd(), 'content/authors');
const outputDir = path.join(process.cwd(), 'lib/data');

console.log('Articles Dir:', articlesDirectory);
console.log('Authors Dir:', authorsDirectory);

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function generateArticlesJson() {
    if (!fs.existsSync(articlesDirectory)) {
        console.error('Articles directory not found!');
        return;
    }
    const folders = fs.readdirSync(articlesDirectory);
    console.log(`Found ${folders.length} article folders`);

    const allArticles = folders.map((slug) => {
        const fullPath = path.join(articlesDirectory, slug, 'index.mdx');
        if (!fs.existsSync(fullPath)) {
            // Try index.md
            const altPath = path.join(articlesDirectory, slug, 'index.md');
            if (!fs.existsSync(altPath)) {
                // Try slug.mdx
                const slugPath = path.join(articlesDirectory, slug + '.mdx');
                if (!fs.existsSync(slugPath)) return null;
                return processFile(slugPath, slug);
            }
            return processFile(altPath, slug);
        }
        return processFile(fullPath, slug);
    }).filter(Boolean);

    fs.writeFileSync(
        path.join(outputDir, 'articles.json'),
        JSON.stringify(allArticles, null, 2).replace(/@assets/g, '/assets')
    );
    console.log(`✓ Generated articles.json with ${allArticles.length} items`);
}

function processFile(fullPath, slug) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const words = content.split(/\s+/).length;
    const minutesRead = `${Math.ceil(words / 200)} min read`;

    const stats = fs.statSync(fullPath);
    const lastModified = stats.mtime.toISOString();

    return {
        id: slug,
        data: {
            ...data,
            category: typeof data.category === 'string' ? { id: data.category } : data.category
        },
        content,
        minutesRead,
        lastModified,
    };
}

function generateAuthorsJson() {
    if (!fs.existsSync(authorsDirectory)) {
        console.error('Authors directory not found!');
        return;
    }
    const files = fs.readdirSync(authorsDirectory);
    console.log(`Found ${files.length} author files/folders`);

    const allAuthors = files.map((filename) => {
        const fullPath = path.join(authorsDirectory, filename);
        if (fs.statSync(fullPath).isDirectory()) {
            const indexPath = path.join(fullPath, 'index.mdx');
            if (fs.existsSync(indexPath)) {
                return processAuthor(indexPath, filename);
            }
            return null;
        }
        if (filename.endsWith('.mdx') || filename.endsWith('.md')) {
            const id = filename.replace(/\.(mdx|md)$/, '');
            return processAuthor(fullPath, id);
        }
        return null;
    }).filter(Boolean);

    fs.writeFileSync(
        path.join(outputDir, 'authors.json'),
        JSON.stringify(allAuthors, null, 2).replace(/@assets/g, '/assets')
    );
    console.log(`✓ Generated authors.json with ${allAuthors.length} items`);
}

function generateCategoriesJson() {
    const categoriesDirectory = path.join(process.cwd(), 'content/categories');
    const categoriesJsonPath = path.join(outputDir, 'categories.json');

    // Load existing categories to preserve their data
    let existingCategoriesMap = new Map();
    if (fs.existsSync(categoriesJsonPath)) {
        try {
            const existingContent = fs.readFileSync(categoriesJsonPath, 'utf8');
            const existingData = JSON.parse(existingContent);
            existingData.forEach(cat => {
                if (cat.id && cat.data) {
                    existingCategoriesMap.set(cat.id, cat.data);
                }
            });
        } catch (e) {
            console.warn('Could not parse existing categories.json, starting fresh.');
        }
    }

    if (!fs.existsSync(categoriesDirectory)) {
        console.error('Categories directory not found!');
        return;
    }
    const files = fs.readdirSync(categoriesDirectory);
    console.log(`Found ${files.length} category files/folders`);

    const allCategories = files.map((filename) => {
        const fullPath = path.join(categoriesDirectory, filename);
        let id = '';
        let fileData = {};

        if (fs.statSync(fullPath).isDirectory()) {
            id = filename;
            const indexPathJson = path.join(fullPath, 'index.json');
            const indexPathMdx = path.join(fullPath, 'index.mdx');
            const indexPathMd = path.join(fullPath, 'index.md');

            if (fs.existsSync(indexPathJson)) {
                fileData = JSON.parse(fs.readFileSync(indexPathJson, 'utf8'));
            } else if (fs.existsSync(indexPathMdx)) {
                fileData = matter(fs.readFileSync(indexPathMdx, 'utf8')).data;
            } else if (fs.existsSync(indexPathMd)) {
                fileData = matter(fs.readFileSync(indexPathMd, 'utf8')).data;
            } else {
                return null;
            }
        } else if (filename.endsWith('.md') || filename.endsWith('.mdx')) {
            id = filename.replace(/\.(mdx|md)$/, '');
            fileData = matter(fs.readFileSync(fullPath, 'utf8')).data;
        } else {
            return null;
        }

        // Priority: Use existing data from JSON if available, otherwise use data from file
        const data = existingCategoriesMap.has(id) ? existingCategoriesMap.get(id) : fileData;

        return {
            id,
            data
        };
    }).filter(Boolean);

    fs.writeFileSync(
        categoriesJsonPath,
        JSON.stringify(allCategories, null, 2)
    );
    console.log(`✓ Generated categories.json with ${allCategories.length} items (Data prioritized from existing JSON)`);
}

function processAuthor(fullPath, id) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    return {
        id,
        data: {
            ...data,
            role: data.job || data.role,
        },
    };
}

generateArticlesJson();
generateAuthorsJson();
generateCategoriesJson();
