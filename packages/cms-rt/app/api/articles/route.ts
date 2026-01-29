
import { initializeDb } from '../../../src/lib/database';
import { ArticleRepository } from '../../../src/lib/repositories/article.repository';


// Mock NextResponse if @float.js/core doesn't export it, or use standard Response
// dev-server.ts expects a standard Response object.

export async function GET(req: Request) {
    try {
        const db = await initializeDb();
        const articleRepo = new ArticleRepository(db);
        const articles = await articleRepo.findAllWithRelations();

        return new Response(JSON.stringify(articles), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        console.error('API Error:', err);
        return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
