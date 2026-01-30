import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import bodyParser from 'body-parser';
import { db } from './database';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

// ============================================================================
// REST API
// ============================================================================

// Users
app.get('/api/users', (req, res) => {
    res.json(db.users.findAll());
});
app.get('/api/users/:id', (req, res) => {
    const user = db.users.findById(Number(req.params.id));
    if (user) res.json(user);
    else res.status(404).json({ error: 'User not found' });
});

// Products
app.get('/api/products', (req, res) => {
    res.json(db.products.findAll(req.query.category as string));
});
app.get('/api/products/:id', (req, res) => {
    const product = db.products.findById(Number(req.params.id));
    if (product) res.json(product);
    else res.status(404).json({ error: 'Product not found' });
});

// Articles
app.get('/api/articles', (req, res) => {
    res.json(db.articles.findAll(req.query.category as string));
});
app.get('/api/articles/:slug', (req, res) => {
    const article = db.articles.findBySlug(req.params.slug);
    if (article) res.json(article);
    else res.status(404).json({ error: 'Article not found' });
});

// AI Chat (RAG Simulation)
app.post('/api/ai/chat', async (req, res) => {
    const { message } = req.body;

    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 800));

    // Hardcoded Agent Logic (RAG Simulation)
    let reply = "I'm sorry, I don't have information about that.";
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('float.js') || lowerMsg.includes('framework')) {
        reply = "Float.js is a modern full-stack framework designed for building high-performance web and mobile applications from a single codebase. It features a lightweight core, built-in state management, and seamless routing.";
    } else if (lowerMsg.includes('state') || lowerMsg.includes('store')) {
        reply = "State management in Float.js is handled by `createFloatStore`. It allows you to create global, reactive stores that can be used across your application with minimal boilerplate.";
    } else if (lowerMsg.includes('mobile') || lowerMsg.includes('native')) {
        reply = "Float.js Lite is optimized for mobile development using React Native. It provides a subset of core features while maintaining API compatibility, allowing you to share code between web and mobile platforms.";
    } else if (lowerMsg.includes('websocket') || lowerMsg.includes('realtime')) {
        reply = "Real-time capabilities are first-class in Float.js. You can easily integrate WebSockets for features like live chat, presence tracking, and synchronized state.";
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        reply = "Hello! I am the Float.js AI Assistant. How can I help you build your app today?";
    }

    res.json({ reply });
});

// ============================================================================
// WEBSOCKET SERVER
// ============================================================================

interface ExtWebSocket extends WebSocket {
    roomId?: string;
    userId?: number;
}

wss.on('connection', (ws: ExtWebSocket) => {
    console.log('Client connected');

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());

            if (message.type === 'join') {
                ws.roomId = message.roomId;
                ws.userId = message.userId;
                console.log(`User ${message.userId} joined room ${message.roomId}`);

                // Send history
                const history = db.messages.findByRoom(message.roomId);
                ws.send(JSON.stringify({ type: 'history', messages: history }));
            } else if (message.type === 'message') {
                if (ws.roomId) {
                    // Save to DB
                    const newMsg = db.messages.create({
                        roomId: ws.roomId,
                        userId: message.userId,
                        message: message.text,
                        timestamp: new Date().toISOString()
                    });

                    // Broadcast to room
                    wss.clients.forEach((client: ExtWebSocket) => {
                        if (client.readyState === WebSocket.OPEN && client.roomId === ws.roomId) {
                            client.send(JSON.stringify({ type: 'new_message', message: newMsg }));
                        }
                    });
                }
            }
        } catch (e) {
            console.error('Error processing message:', e);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
