import { BaseRepository } from './base.repository.js';

export interface Author {
    id: string;
    slug: string;
    name: string;
    job: string;
    avatar: string;
    bio: string;
}

export interface AuthorSocial {
    id: string;
    author_id: string;
    name: string;
    url: string;
    icon: string;
}

export class AuthorRepository extends BaseRepository<Author> {
    async findAll(): Promise<Author[]> {
        return this.all('SELECT * FROM authors');
    }

    async findBySlug(slug: string): Promise<Author | undefined> {
        return this.get('SELECT * FROM authors WHERE slug = ?', [slug]);
    }

    async findSocials(authorId: string): Promise<AuthorSocial[]> {
        return this.all('SELECT * FROM author_socials WHERE author_id = ?', [authorId]);
    }

    async create(author: Author): Promise<void> {
        const sql = 'INSERT INTO authors (id, slug, name, job, avatar, bio) VALUES (?, ?, ?, ?, ?, ?)';
        await this.run(sql, [author.id, author.slug, author.name, author.job, author.avatar, author.bio]);
    }

    async update(slug: string, author: Partial<Author>): Promise<void> {
        const keys = Object.keys(author).filter(k => k !== 'id' && k !== 'slug');
        if (keys.length === 0) return;
        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const params = [...keys.map(k => (author as any)[k]), slug];
        await this.run(`UPDATE authors SET ${setClause} WHERE slug = ?`, params);
    }

    async delete(slug: string): Promise<void> {
        await this.run('DELETE FROM authors WHERE slug = ?', [slug]);
    }
}
