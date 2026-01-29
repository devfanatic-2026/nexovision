import { BaseRepository } from './base.repository.js';

export interface Category {
    id: string;
    slug: string;
    title: string;
    inspire: string;
}

export class CategoryRepository extends BaseRepository<Category> {
    async findAll(): Promise<Category[]> {
        return this.all('SELECT * FROM categories');
    }

    async findBySlug(slug: string): Promise<Category | undefined> {
        return this.get('SELECT * FROM categories WHERE slug = ?', [slug]);
    }

    async create(category: Category): Promise<void> {
        const sql = 'INSERT INTO categories (id, slug, title, inspire) VALUES (?, ?, ?, ?)';
        await this.run(sql, [category.id, category.slug, category.title, category.inspire]);
    }

    async update(slug: string, category: Partial<Category>): Promise<void> {
        const keys = Object.keys(category).filter(k => k !== 'id' && k !== 'slug');
        if (keys.length === 0) return;
        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const params = [...keys.map(k => (category as any)[k]), slug];
        await this.run(`UPDATE categories SET ${setClause} WHERE slug = ?`, params);
    }

    async delete(slug: string): Promise<void> {
        await this.run('DELETE FROM categories WHERE slug = ?', [slug]);
    }
}
