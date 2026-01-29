
import { initializeDb } from '../../../src/lib/database';
import { CategoryRepository } from '../../../src/lib/repositories/category.repository';

export async function GET(req: Request) {
    try {
        const db = await initializeDb();
        const categoryRepo = new CategoryRepository(db);
        const categories = await categoryRepo.findAll();

        return new Response(JSON.stringify(categories), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
