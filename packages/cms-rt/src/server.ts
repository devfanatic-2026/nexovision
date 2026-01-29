import { FloatRealtime } from '@float.js/core';
import { initializeDb } from './lib/database.js';
import { ArticleRepository } from './lib/repositories/article.repository.js';
import { CategoryRepository } from './lib/repositories/category.repository.js';
import { createServer, ServerResponse } from 'http';
import 'dotenv/config';

const PORT = parseInt(process.env.PORT || '3002');
const WS_PATH = '/ws';

async function startServer() {
    const db = await initializeDb();
    const articleRepo = new ArticleRepository(db);
    const categoryRepo = new CategoryRepository(db);

    const sendJson = (res: ServerResponse, data: any, status = 200) => {
        res.writeHead(status, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end(JSON.stringify(data));
    };

    const server = createServer(async (req, res) => {
        const url = new URL(req.url || '', `http://localhost:${PORT}`);

        // Handle CORS Preflight
        if (req.method === 'OPTIONS') {
            res.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            return res.end();
        }

        // 1. API ROUTES
        if (url.pathname === '/api/articles' && req.method === 'GET') {
            try {
                const articles = await articleRepo.findAllWithRelations();
                return sendJson(res, articles);
            } catch (err: any) {
                return sendJson(res, { error: err.message }, 500);
            }
        }

        if (url.pathname === '/api/categories' && req.method === 'GET') {
            try {
                const categories = await categoryRepo.findAll();
                return sendJson(res, categories);
            } catch (err: any) {
                return sendJson(res, { error: err.message }, 500);
            }
        }

        // No other routes - API only server
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    });

    const rt = new FloatRealtime({ server, path: WS_PATH });

    rt.onEvent('articles:list', async (message: any, client: any) => {
        const { page = 1, limit = 10 } = (message.payload as any) || {};
        try {
            const articles = await articleRepo.findAllWithRelations();
            const start = (page - 1) * limit;
            const end = start + limit;
            const pageItems = articles.slice(start, end);

            rt.sendToClient(client, {
                type: 'articles:list:response',
                payload: { articles: pageItems, total: articles.length, page, limit },
                timestamp: Date.now()
            });
        } catch (err: any) {
            rt.sendToClient(client, { type: 'error', payload: err.message, timestamp: Date.now() });
        }
    });

    rt.onEvent('categories:list', async (message: any, client: any) => {
        try {
            const categories = await categoryRepo.findAll();
            rt.sendToClient(client, { type: 'categories:list:response', payload: categories, timestamp: Date.now() });
        } catch (err: any) {
            rt.sendToClient(client, { type: 'error', payload: err.message, timestamp: Date.now() });
        }
    });

    server.listen(PORT, () => {
        console.log(`✅ API + WebSocket Bridge running on http://localhost:${PORT}`);
    });

    await rt.start();
}

startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
