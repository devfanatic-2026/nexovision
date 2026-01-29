
import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3002/ws');

ws.on('open', () => {
    console.log('✅ Connected to WebSocket');

    // Simulate the client requesting articles
    const request = {
        type: 'articles:list',
        payload: { page: 1, limit: 5 },
        timestamp: Date.now()
    };

    console.log('📤 Sending request:', request);
    ws.send(JSON.stringify(request));
});

ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('abc');
    if (message.type === 'articles:list:response') {
        console.log('✅ Received articles data!');
        console.log(`📦 Got ${message.payload.articles.length} articles`);
        console.log('Sample article:', message.payload.articles[0].title);
        process.exit(0);
    } else {
        console.log('📩 Received other message:', message.type);
    }
});

ws.on('error', (err) => {
    console.error('❌ WebSocket error:', err);
    process.exit(1);
});

// Timeout after 5 seconds
setTimeout(() => {
    console.error('❌ Timeout waiting for data');
    process.exit(1);
}, 5000);
