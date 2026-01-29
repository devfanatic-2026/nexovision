import { FloatRealtime, startProductionServer, json, error } from '@float.js/core';
import { initializeDb } from './lib/database.js';
import { ArticleRepository } from './lib/repositories/article.repository.js';
import { CategoryRepository } from './lib/repositories/category.repository.js';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';

const PORT = parseInt(process.env.PORT || '3002');
const WS_PATH = '/ws';

async function startServer() {
    console.log('🚀 Starting Lean cms-rt Backend (API + WS)...');

    console.log('📅 Initializing Database...');
    const db = await initializeDb();
    console.log('✅ Database Initialized.');
    const articleRepo = new ArticleRepository(db);
    const categoryRepo = new CategoryRepository(db);

    // Helper to send JSON responses
    const sendJson = (res: ServerResponse, data: any, status = 200) => {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    };

    // 1. Create HTTP Server for API
    const server = createServer(async (req, res) => {
        const url = new URL(req.url || '', `http://localhost:${PORT}`);

        console.log(`[HTTP] ${req.method} ${url.pathname}`);

        // Welcome / Status Page
        if (url.pathname === '/' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            return res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>CMS-RT Console</title>
                    <style>
                        body { font-family: sans-serif; padding: 2rem; background: #0f172a; color: #f8fafc; line-height: 1.5; }
                        .container { max-width: 900px; margin: 0 auto; }
                        h1 { color: #22c55e; border-bottom: 1px solid #334155; padding-bottom: 0.5rem; }
                        .status-chip { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 1rem; background: #166534; color: #4ade80; font-size: 0.875rem; font-weight: bold; }
                        .log-container { background: #1e293b; border-radius: 0.5rem; padding: 1rem; margin-top: 1.5rem; height: 400px; overflow-y: auto; font-family: monospace; border: 1px solid #334155; }
                        .log-entry { margin-bottom: 0.5rem; border-left: 2px solid #3b82f6; padding-left: 0.5rem; }
                        .log-time { color: #94a3b8; font-size: 0.75rem; }
                        .log-type { font-weight: bold; color: #60a5fa; }
                        .log-payload { color: #cbd5e1; white-space: pre-wrap; word-break: break-all; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🟢 Lean CMS-RT Backend <span class="status-chip">ALIVE</span></h1>
                        <p>Specialized instance for Real-Time data bridge. Port: <strong>${PORT}</strong></p>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <h3>Endpoints</h3>
                                <ul>
                                    <li>API: <a href="/api/articles" style="color: #60a5fa;">/api/articles</a></li>
                                    <li>WebSocket: <code style="background: #334155; padding: 0.2rem 0.4rem; border-radius: 0.25rem;">ws://localhost:${PORT}${WS_PATH}</code></li>
                                </ul>
                            </div>
                            <div>
                                <h3>Active Connections</h3>
                                <p id="conn-count">Connecting...</p>
                            </div>
                        </div>

                        <h3>Live Interaction Monitor</h3>
                        <div class="log-container" id="logs">
                            <div class="log-entry">Waiting for events...</div>
                        </div>
                    </div>

                    <script>
                        const logContainer = document.getElementById('logs');
                        const connCount = document.getElementById('conn-count');
                        
                        function addLog(type, payload) {
                            const entry = document.createElement('div');
                            entry.className = 'log-entry';
                            const time = new Date().toLocaleTimeString();
                            entry.innerHTML = \`
                                <div class="log-time">\${time}</div>
                                <div class="log-type">\${type}</div>
                                <div class="log-payload">\${JSON.stringify(payload, null, 2)}</div>
                            \`;
                            logContainer.prepend(entry);
                        }

                        const ws = new WebSocket(\`ws://\${location.host}${WS_PATH}\`);
                        ws.onopen = () => {
                            addLog('SYSTEM', 'Connected to WebSocket Bridge');
                            ws.send(JSON.stringify({ type: 'articles:list', payload: { limit: 1 } }));
                        };
                        ws.onmessage = (e) => {
                            const data = JSON.parse(e.data);
                            addLog('EVENT: ' + data.type, data.payload);
                        };
                        ws.onerror = (e) => addLog('ERROR', 'WebSocket error occurred');
                        ws.onclose = () => addLog('SYSTEM', 'Disconnected from server');
                    </script>
                </body>
                </html>
            `);
        }

        // Lean API Routes
        if (url.pathname === '/api/articles' && req.method === 'GET') {
            try {
                const articles = await articleRepo.findAllWithRelations();
                const mapped = articles.map(a => ({
                    ...a,
                    cover: a.cover_is_local && a.cover_base64 ? a.cover_base64 : a.cover
                }));
                return sendJson(res, mapped);
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

        // Default response
        res.writeHead(404);
        res.end('Not Found');
    });

    // 2. Initialize Realtime Server attached to the same HTTP server
    const rt = new FloatRealtime({
        server,
        path: WS_PATH
    });

    // 3. Define WS Event Handlers (The Bridge)
    rt.onEvent('articles:list', async (message, client) => {
        const { page = 1, limit = 10 } = (message.payload as any) || {};
        console.log(`[WS] articles:list requested by ${client.id} (page: ${page}, limit: ${limit})`);

        try {
            const articles = await articleRepo.findAllWithRelations();
            // Simple pagination for now
            const start = (page - 1) * limit;
            const end = start + limit;
            const pageItems = articles.slice(start, end).map(a => ({
                ...a,
                cover: a.cover_is_local && a.cover_base64 ? a.cover_base64 : a.cover
            }));

            rt.sendToClient(client, {
                type: 'articles:list:response',
                payload: {
                    articles: pageItems,
                    total: articles.length,
                    page,
                    limit
                },
                timestamp: Date.now()
            });
        } catch (err: any) {
            rt.sendToClient(client, {
                type: 'error',
                payload: err.message,
                timestamp: Date.now()
            });
        }
    });

    rt.onEvent('categories:list', async (message, client) => {
        console.log(`[WS] categories:list requested by ${client.id}`);
        try {
            const categories = await categoryRepo.findAll();
            rt.sendToClient(client, {
                type: 'categories:list:response',
                payload: categories,
                timestamp: Date.now()
            });
        } catch (err: any) {
            rt.sendToClient(client, {
                type: 'error',
                payload: err.message,
                timestamp: Date.now()
            });
        }
    });

    // Start everything on one port
    server.listen(PORT, () => {
        console.log(`✅ Lean CMS-RT running on http://localhost:${PORT}`);
        console.log(`🔌 WebSocket Bridge available at ws://localhost:${PORT}${WS_PATH}`);
    });

    await rt.start();
}

startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
