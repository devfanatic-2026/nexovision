import { BaseRepository } from './base.repository.js';

export interface Article {
    id: string;
    slug: string;
    title: string;
    description: string;
    cover: string;
    category_id: string | null;
    published_time: string;
    is_draft: number;
    is_main_headline: number;
    is_sub_headline: number;
    is_category_main_headline: number;
    is_category_sub_headline: number;
    content: string;
    // Joined fields
    category_title?: string;
    author_names?: string;
}

export class ArticleRepository extends BaseRepository<Article> {
    async findAll(): Promise<Article[]> {
        return this.all('SELECT * FROM articles ORDER BY published_time DESC');
    }

    async findAllWithRelations(): Promise<Article[]> {
        const sql = `
            SELECT 
                a.*, 
                c.title as category_title,
                GROUP_CONCAT(au.name, ', ') as author_names
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            LEFT JOIN article_authors aa ON a.id = aa.article_id
            LEFT JOIN authors au ON aa.author_id = au.id
            GROUP BY a.id
            ORDER BY a.published_time DESC
        `;
        return this.all(sql);
    }

    async findById(id: string): Promise<Article | undefined> {
        return this.get('SELECT * FROM articles WHERE id = ?', [id]);
    }

    async findBySlug(slug: string): Promise<Article | undefined> {
        return this.get('SELECT * FROM articles WHERE slug = ?', [slug]);
    }

    async create(article: Article): Promise<void> {
        const sql = `
      INSERT INTO articles (
        id, slug, title, description, cover, category_id, 
        published_time, is_draft, is_main_headline, is_sub_headline, 
        is_category_main_headline, is_category_sub_headline, content
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const params = [
            article.id, article.slug, article.title, article.description, article.cover,
            article.category_id, article.published_time, article.is_draft,
            article.is_main_headline, article.is_sub_headline,
            article.is_category_main_headline, article.is_category_sub_headline,
            article.content
        ];
        await this.run(sql, params);
    }

    async update(slug: string, article: Partial<Article>): Promise<void> {
        const keys = Object.keys(article).filter(k => k !== 'id' && k !== 'slug');
        if (keys.length === 0) return;
        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const params = [...keys.map(k => (article as any)[k]), slug];

        await this.run(`UPDATE articles SET ${setClause} WHERE slug = ?`, params);
    }

    async rawRun(sql: string, params: any[]): Promise<void> {
        await this.run(sql, params);
    }

    async delete(slug: string): Promise<void> {
        await this.run('DELETE FROM articles WHERE slug = ?', [slug]);
    }
}
