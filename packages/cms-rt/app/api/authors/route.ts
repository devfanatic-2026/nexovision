
import { initializeDb } from '../../../src/lib/database';
import { AuthorRepository } from '../../../src/lib/repositories/author.repository';

export async function GET(req: Request) {
    try {
        const db = await initializeDb();
        const authorRepo = new AuthorRepository(db);
        const authors = await authorRepo.findAll();

        return new Response(JSON.stringify(authors), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
