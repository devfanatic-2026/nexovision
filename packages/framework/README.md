# Float.js Framework - Complete Technical Documentation

**Version 1.0.0** | Created by [Alejandro Iglesias](https://maravilla.digital)

> A modern, React Native-first framework with built-in SSR, state management, real-time capabilities, and AI integration. Write once, run everywhere - truly.

## 📑 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [State Management](#state-management)
4. [Real-Time Communication](#real-time-communication)
5. [Offline-First Capabilities](#offline-first-capabilities)
6. [AI Integration](#ai-integration)
7. [File-Based Routing](#file-based-routing)
8. [API Routes](#api-routes)
9. [News Scraper](#news-scraper)
10. [Comparison with Other Frameworks](#comparison-with-other-frameworks)
11. [Complete Usage Examples](#complete-usage-examples)

---

## Overview

Float.js is a **complete, batteries-included framework** for building modern web and mobile applications with React Native as the single source of truth. It combines the best ideas from Next.js, Remix, and Expo while adding unique capabilities like built-in state management, WebSocket support, and AI integration.

### Key Design Principles

1. **React Native First**: Write UI components once using React Native primitives
2. **Zero Configuration**: TypeScript, routing, and SSR work out of the box
3. **Offline-First**: Local storage persistence and offline data capabilities by default
4. **Full-Stack**: Backend API routes, frontend components, and real-time communication in one package
5. **Developer Experience**: Hot reload, type safety, and intuitive APIs

### Package Structure

```
@float.js/core     - Server-side rendering, API routes, CLI tools
@float.js/lite     - Client-side runtime, hooks, state management
@float.js/scraper  - Intelligent web scraping with AI analysis
```

---

## Architecture

### React Native as Source of Truth

Unlike traditional web frameworks that start with HTML/CSS and add mobile support later, Float.js inverts this model:

```typescript
// ✅ Write React Native components
import { View, Text, StyleSheet } from '@float.js/lite';

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Works on Web, iOS, and Android</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' }
});
```

**Under the Hood:**
- **On Web**: Converts to `react-native-web` → optimized HTML/CSS
- **On Mobile**: Uses native React Native primitives directly
- **SSR**: Renders to HTML string on the server, hydrates on client

### Framework Layers

```
┌─────────────────────────────────────────────────┐
│ Application Layer (Your Code)                  │
│ - Pages (app/*)                                 │
│ - API Routes (app/api/*)                        │
│ - Components                                    │
└─────────────────────────────────────────────────┘
                      │
┌─────────────────────────────────────────────────┐
│ @float.js/lite (Client Runtime)                │
│ - State Management (useFloatStore)             │
│ - Real-time (WebSocket client)                 │
│ - Router (useFloatRouter)                      │
│ - Hooks (useFloatAsync, useFloatData)          │
└─────────────────────────────────────────────────┘
                      │
┌─────────────────────────────────────────────────┐
│ @float.js/core (Server Runtime)                │
│ - SSR Engine                                    │
│ - File-based Router                             │
│ - API Handler                                   │
│ - WebSocket Server                              │
│ - Build System (esbuild)                        │
└─────────────────────────────────────────────────┘
                      │
┌─────────────────────────────────────────────────┐
│ React Native Primitives                        │
│ - Web: react-native-web                        │
│ - Mobile: react-native                          │
└─────────────────────────────────────────────────┘
```

---

## State Management

Float.js includes a **powerful, lightweight state management system** inspired by Zustand but simpler and more integrated with React 18's concurrent features.

### Core Features

- ✅ **Minimal Boilerplate**: Create stores with one function
- ✅ **TypeScript First**: Full type inference
- ✅ **localStorage Persistence**: Offline-first by default
- ✅ **Selective Re-renders**: Only rerender components that need updates
- ✅ **Middleware Support**: Logger, undo/redo, debounce built-in
- ✅ **Server-Safe**: Works with SSR without hydration mismatches
- ✅ **React 18 Compatible**: Uses `useSyncExternalStore` under the hood

### Basic Usage

```typescript
import { createFloatStore } from '@float.js/lite';

// Create a store
const useCounterStore = createFloatStore({ count: 0 });

// Use in component - full state
function Counter() {
  const state = useCounterStore();
  return <Text>{state.count}</Text>;
}

// Use in component - with selector (optimized)
function OptimizedCounter() {
  const count = useCounterStore(state => state.count);
  
  const increment = () => {
    useCounterStore.setState({ count: count + 1 });
  };
  
  return (
    <View>
      <Text>{count}</Text>
      <TouchableOpacity onPress={increment}>
        <Text>Increment</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Persistent State (Offline-First)

```typescript
const useUserStore = createFloatStore(
  {
    user: null,
    preferences: { theme: 'dark' }
  },
  {
    // Automatically sync to localStorage
    persist: 'user-data'
  }
);

// Data persists across page reloads and works offline!
```

### Advanced: Middleware

#### Logger Middleware

```typescript
import { createFloatStore, floatMiddleware } from '@float.js/lite';

const useStore = createFloatStore(
  { items: [] },
  {
    middleware: floatMiddleware.logger('ItemStore')
  }
);

// Console output:
// ItemStore Update
// Prev: { items: [] }
// Next: { items: ['apple'] }
```

#### Undo/Redo Middleware

```typescript
const useEditorStore = createFloatStore(
  { content: '' },
  {
    middleware: floatMiddleware.undoable(50) // 50 history states
  }
);

// In component
function Editor() {
  const content = useEditorStore(s => s.content);
  
  return (
    <View>
      <TextInput
        value={content}
        onChangeText={text => useEditorStore.setState({ content: text })}
      />
      <TouchableOpacity onPress={() => useEditorStore.undo()}>
        <Text>Undo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => useEditorStore.redo()}>
        <Text>Redo</Text>
      </TouchableOpacity>
    </View>
  );
}
```

#### Debounce Middleware

```typescript
const useSearchStore = createFloatStore(
  { query: '' },
  {
    middleware: floatMiddleware.debounce(300) // 300ms debounce
  }
);

// Updates are automatically debounced
useSearchStore.setState({ query: 'new search' });
```

### Combining Stores

```typescript
const useAuthStore = createFloatStore({ user: null, token: null });
const useCartStore = createFloatStore({ items: [], total: 0 });

// Combine multiple stores
const useAppStore = combineFloatStores({
  auth: useAuthStore,
  cart: useCartStore
});

// Access combined state
const appState = useAppStore.getState();
// { auth: { user: null, token: null }, cart: { items: [], total: 0 } }
```

### Comparison with Redux

| Feature | Float.js Store | Redux | Winner |
|---------|---------------|-------|--------|
| **Setup Complexity** | 1 function call | Actions, reducers, middleware setup | **Float.js** |
| **Bundle Size** | ~2KB | ~8KB (with toolkit) | **Float.js** |
| **TypeScript Support** | Full inference | Manual types needed | **Float.js** |
| **Persistence** | Built-in (`persist` option) | Requires redux-persist | **Float.js** |
| **Middleware** | Built-in (logger, undo, debounce) | Manual setup | **Float.js** |
| **Learning Curve** | 5 minutes | Several hours | **Float.js** |
| **DevTools** | Browser localStorage inspector | Redux DevTools | Redux |
| **Time Travel** | Built-in with `undoable` | Requires DevTools | **Tie** |
| **Server Rendering** | Native `useSyncExternalStore` | Requires special setup | **Float.js** |

**Code Comparison:**

```typescript
// ========== FLOAT.JS ==========
import { createFloatStore } from '@float.js/lite';

const useTodoStore = createFloatStore({ todos: [] });

function TodoList() {
  const todos = useTodoStore(s => s.todos);
  const addTodo = (text) => {
    useTodoStore.setState({ 
      todos: [...todos, { id: Date.now(), text }] 
    });
  };
  return <View>{/* ... */}</View>;
}

// ========== REDUX ==========
import { createSlice, configureStore } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [] },
  reducers: {
    addTodo: (state, action) => {
      state.items.push(action.payload);
    }
  }
});

const store = configureStore({ reducer: { todos: todoSlice.reducer } });

function App() {
  return (
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
}

function TodoList() {
  const todos = useSelector(state => state.todos.items);
  const dispatch = useDispatch();
  const addTodo = (text) => {
    dispatch(todoSlice.actions.addTodo({ id: Date.now(), text }));
  };
  return <View>{/* ... */}</View>;
}
```

**Result**: Float.js requires **70% less code** and **zero configuration**.

---

## Real-Time Communication

Float.js includes **native WebSocket support** for real-time features without external dependencies.

### Architecture

```
┌──────────────┐          WebSocket          ┌──────────────┐
│   Client     │ ◄─────────────────────────► │   Server     │
│ (Browser/RN) │                              │ (Float.js)   │
└──────────────┘                              └──────────────┘
       │                                              │
       │ Auto-reconnect                               │ Broadcast
       │ Type-safe messages                           │ Rooms
       │ Presence tracking                            │ Presence
```

### Server-Side WebSocket

```typescript
// app/api/chat/route.ts
import { realtime } from '@float.js/core';

export const GET = realtime({
  rooms: ['general', 'announcements'],
  
  onConnect: (client) => {
    console.log(`Client ${client.id} connected`);
    client.send({ type: 'welcome', message: 'Connected to chat!' });
  },
  
  onMessage: (client, message) => {
    // Broadcast to all clients in the same room
    if (message.room) {
      client.room?.broadcast({
        type: 'chat-message',
        from: client.id,
        content: message.payload
      });
    }
  },
  
  onDisconnect: (client) => {
    console.log(`Client ${client.id} disconnected`);
  }
});
```

### Client-Side WebSocket

```typescript
import { createRealtimeClient } from '@float.js/lite';
import { useEffect, useState } from 'react';

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);

  useEffect(() => {
    // Create WebSocket client
    const ws = createRealtimeClient({
      url: 'ws://localhost:3006/api/chat',
      autoReconnect: true,          // Reconnect on disconnect
      reconnectInterval: 3000,       // 3 seconds
      maxReconnectAttempts: 10       // Try 10 times
    });

    // Connect
    ws.connect().then(() => {
      console.log('Connected!');
      ws.join('general'); // Join a room
    });

    // Listen for messages
    ws.on('chat-message', (payload) => {
      setMessages(prev => [...prev, payload]);
    });

    // Listen for all messages
    ws.on('*', (message) => {
      console.log('Received:', message);
    });

    setClient(ws);

    return () => ws.disconnect();
  }, []);

  const sendMessage = (text) => {
    client?.broadcast('general', 'chat-message', { text });
  };

  return (
    <View>
      <ScrollView>
        {messages.map(msg => (
          <Text key={msg.timestamp}>{msg.content}</Text>
        ))}
      </ScrollView>
      <TextInput onSubmitEditing={(e) => sendMessage(e.nativeEvent.text)} />
    </View>
  );
}
```

### Presence Tracking

```typescript
// Server
export const GET = realtime({
  presence: true, // Enable presence tracking
  
  onConnect: (client) => {
    client.updatePresence({
      username: 'User123',
      status: 'online'
    });
  }
});

// Client
const ws = createRealtimeClient({ url: '...' });

ws.updatePresence({
  username: 'Alice',
  status: 'typing...'
});
```

### Room Management

```typescript
// Join multiple rooms
ws.join('lobby');
ws.join('room-123');
ws.join('private-chat-456');

// Leave a room
ws.leave('lobby');

// Broadcast to specific room
ws.broadcast('room-123', 'game-update', {
  score: 100,
  player: 'Alice'
});
```

---

## Offline-First Capabilities

Float.js is designed to work **offline by default** through multiple mechanisms:

### 1. localStorage Persistence

All state can be automatically persisted to `localStorage`:

```typescript
const useAppStore = createFloatStore(
  {
    user: null,
    settings: {},
    cachedData: []
  },
  {
    persist: 'app-state' // Automatically saves to localStorage
  }
);

// Data persists even when:
// - User closes browser
// - Network is disconnected
// - App crashes and restarts
```

### 2. Service Worker Support

Float.js apps can be enhanced with service workers for full PWA capabilities:

```typescript
// public/sw.js (example)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

### 3. Optimistic Updates

```typescript
const useDataStore = createFloatStore({ items: [] });

async function addItem(item) {
  // 1. Update UI immediately (optimistic)
  const previousItems = useDataStore.getState().items;
  useDataStore.setState({ 
    items: [...previousItems, item] 
  });

  try {
    // 2. Sync with server
    await fetch('/api/items', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  } catch (error) {
    // 3. Rollback on failure
    useDataStore.setState({ items: previousItems });
    alert('Failed to save. Working offline.');
  }
}
```

### 4. Sync Queue

```typescript
import { createFloatStore } from '@float.js/lite';

// Create an offline sync queue
const useSyncQueue = createFloatStore(
  { pendingActions: [] },
  { persist: 'sync-queue' }
);

function queueAction(action) {
  useSyncQueue.setState({
    pendingActions: [...useSyncQueue.getState().pendingActions, action]
  });
}

// Process queue when online
window.addEventListener('online', async () => {
  const { pendingActions } = useSyncQueue.getState();
  
  for (const action of pendingActions) {
    try {
      await fetch(action.url, action.options);
      // Remove from queue on success
      useSyncQueue.setState({
        pendingActions: pendingActions.filter(a => a !== action)
      });
    } catch (e) {
      console.error('Sync failed:', e);
    }
  }
});
```

### 5. Network Status Detection

```typescript
import { useState, useEffect } from 'react';

function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Use in components
function App() {
  const isOnline = useNetworkStatus();

  return (
    <View>
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text>You're offline. Changes will sync when reconnected.</Text>
        </View>
      )}
      {/* App content */}
    </View>
  );
}
```

---

## AI Integration

Float.js includes **native AI integration** for building AI-powered features without complex setup.

### Supported Providers

- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Custom providers (extensible)

### Basic Usage

```typescript
// app/api/ai/chat/route.ts
import { ai, streamResponse } from '@float.js/core';

export async function POST(req) {
  const { message } = await req.json();

  // Stream AI response
  const stream = await ai.chat({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: message }
    ],
    stream: true
  });

  return streamResponse(stream);
}
```

### Client-Side Streaming

```typescript
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from '@float.js/lite';

function AIChat() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    setIsLoading(true);
    setResponse('');

    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    // Stream the response
    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      setResponse(prev => prev + chunk);
    }

    setIsLoading(false);
  };

  return (
    <View>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Ask me anything..."
      />
      <TouchableOpacity onPress={sendMessage} disabled={isLoading}>
        <Text>{isLoading ? 'Thinking...' : 'Send'}</Text>
      </TouchableOpacity>
      <Text>{response}</Text>
    </View>
  );
}
```

---

## File-Based Routing

Float.js uses **Next.js-style file-based routing** with full TypeScript support.

### Route Structure

```
app/
├── page.tsx                → /
├── about/page.tsx          → /about
├── blog/
│   ├── page.tsx           → /blog
│   └── [slug]/page.tsx    → /blog/:slug
├── api/
│   ├── articles/route.ts  → /api/articles
│   └── users/[id]/route.ts → /api/users/:id
└── layout.tsx             → Root layout
```

### Dynamic Routes

```typescript
// app/blog/[slug]/page.tsx
interface PageProps {
  params: { slug: string };
}

export default async function BlogPost({ params }: PageProps) {
  const post = await fetch(`/api/posts/${params.slug}`).then(r => r.json());

  return (
    <View>
      <Text style={styles.title}>{post.title}</Text>
      <Text>{post.content}</Text>
    </View>
  );
}
```

### Layouts

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <View>
      <Header />
      {children}
      <Footer />
    </View>
  );
}
```

---

## API Routes

Create type-safe API endpoints with automatic validation.

### Basic API Route

```typescript
// app/api/articles/route.ts
import { json, error } from '@float.js/core';

export async function GET() {
  const articles = await db.articles.findAll();
  return json(articles);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const article = await db.articles.create(body);
    return json(article, { status: 201 });
  } catch (e) {
    return error('Failed to create article', { status: 500 });
  }
}
```

### Type-Safe Routes

```typescript
import { f, typedRoute, json } from '@float.js/core';

// Define schema
const createArticleSchema = f.object({
  title: f.string().min(5).max(200),
  content: f.string().min(10),
  publishedAt: f.date().optional()
});

// Type-safe route
export const POST = typedRoute({
  body: createArticleSchema,
  handler: async (req, { body }) => {
    // body is fully typed!
    const article = await db.articles.create({
      title: body.title,          // ✅ TypeScript knows these exist
      content: body.content,
      publishedAt: body.publishedAt || new Date()
    });
    return json(article);
  }
});
```

---

## News Scraper

`@float.js/scraper` is an **intelligent web scraping engine** with multi-strategy extraction and AI analysis capabilities.

### Features

- ✅ **Multi-Strategy Extraction**: Fast fetch-first, browser fallback
- ✅ **Smart Content Detection**: Mozilla Readability integration
- ✅ **Image Extraction**: Multiple algorithm strategies
- ✅ **Hub Scanning**: Extract headlines from category pages
- ✅ **AI Analysis**: DeepSeek integration for content analysis
- ✅ **Anti-Bot Handling**: Playwright for JavaScript-heavy sites

### Installation

```bash
pnpm add @float.js/scraper
```

### Basic Usage

```typescript
import { NewsScraper } from '@float.js/scraper';

const scraper = new NewsScraper(process.env.DEEPSEEK_API_KEY);

// Scrape a single article
const result = await scraper.scrape('https://example.com/article', {
  strategy: 'smart' // 'fetch-only' | 'browser-only' | 'smart'
});

console.log(result.article.title);
console.log(result.article.content);
console.log(result.article.image);
```

### Hub Scanning

Extract headlines from hub pages (e.g., `/sports`, `/tech`):

```typescript
const scanResult = await scraper.scan('https://news.site.com/technology');

console.log(scanResult.headlines);
// [
//   { title: '...', url: '...', image: '...', source: 'news.site.com' },
//   { title: '...', url: '...', image: '...', source: 'news.site.com' },
//   ...
// ]
```

### AI Analysis

```typescript
const result = await scraper.scrape('https://example.com/article');

// Analyze with AI
const analysis = await scraper.analyze(
  result.article,
  'Summarize this article in 3 bullet points',
  process.env.DEEPSEEK_API_KEY
);

console.log(analysis.summary);
```

### Complete Example: News Aggregator

```typescript
import { NewsScraper } from '@float.js/scraper';

class NewsAggregator {
  private scraper: NewsScraper;

  constructor() {
    this.scraper = new NewsScraper(process.env.DEEPSEEK_API_KEY);
  }

  async aggregateNews(sources: string[]) {
    const allHeadlines = [];

    for (const source of sources) {
      try {
        console.log(`Scanning ${source}...`);
        const result = await this.scraper.scan(source);

        if (result) {
          allHeadlines.push(...result.headlines);
        }
      } catch (error) {
        console.error(`Failed to scan ${source}:`, error);
      }
    }

    // Deduplicate by URL
    const unique = Array.from(
      new Map(allHeadlines.map(h => [h.url, h])).values()
    );

    return unique.slice(0, 50); // Top 50 headlines
  }

  async scrapeAndAnalyze(url: string) {
    // 1. Scrape article
    const result = await this.scraper.scrape(url, {
      strategy: 'smart'
    });

    if (!result) {
      throw new Error('Failed to scrape article');
    }

    // 2. Extract key information with AI
    const analysis = await this.scraper.analyze(
      result.article,
      `Extract:
      1. Main topic
      2. Key points (3-5 bullets)
      3. Sentiment (positive/negative/neutral)
      4. Target audience`,
      process.env.DEEPSEEK_API_KEY
    );

    return {
      article: result.article,
      analysis
    };
  }

  cleanup() {
    this.scraper.cleanup();
  }
}

// Usage
const aggregator = new NewsAggregator();

const headlines = await aggregator.aggregateNews([
  'https://www.bbc.com/news/technology',
  'https://techcrunch.com',
  'https://www.theverge.com/tech'
]);

console.log(`Found ${headlines.length} unique headlines`);
```

### Scraping Strategies

**1. Fetch-Only (Fastest)**
```typescript
await scraper.scrape(url, { strategy: 'fetch-only' });
// ✅ Fast (~200ms)
// ❌ Doesn't work with JavaScript-heavy sites
```

**2. Browser-Only (Most Reliable)**
```typescript
await scraper.scrape(url, { strategy: 'browser-only' });
// ✅ Works with any site
// ❌ Slower (~3-5s)
```

**3. Smart (Recommended)**
```typescript
await scraper.scrape(url, { strategy: 'smart' });
// ✅ Tries fetch first, falls back to browser
// ✅ Best balance of speed and reliability
```

---

## Comparison with Other Frameworks

### vs Next.js

| Feature | Float.js | Next.js | Winner |
|---------|----------|---------|--------|
| **Rendering** | SSR | SSR + ISR + SSG | Next.js |
| **Routing** | File-based | File-based | Tie |
| **Mobile Support** | ✅ Native (React Native) | ❌ Web only | **Float.js** |
| **State Management** | ✅ Built-in | ❌ Bring your own | **Float.js** |
| ** Real-time** | ✅ Built-in WebSocket | ❌ Requires setup | **Float.js** |
| **AI Integration** | ✅ Built-in | ❌ Manual | **Float.js** |
| **Learning Curve** | Low | Medium | **Float.js** |
| **Ecosystem** | Small | Large | Next.js |
| **Bundle Size** | Smaller | Larger | **Float.js** |

### vs Remix

| Feature | Float.js | Remix | Winner |
|---------|----------|-------|--------|
| **Data Loading** | Async components | Loaders/Actions | Remix |
| **Forms** | Manual | Built-in | Remix |
| **Mobile** | ✅ React Native | ❌ Web only | **Float.js** |
| **Real-time** | ✅ Built-in | ❌ Manual | **Float.js** |
| **Offline** | ✅ Built-in persistence | ❌ Manual | **Float.js** |

### vs Expo

| Feature | Float.js | Expo | Winner |
|---------|----------|------|--------|
| **Web Support** | ✅ SSR+CSR | ✅ CSR only | **Float.js** |
| **Mobile** | ✅ React Native | ✅ React Native | Tie |
| **Backend** | ✅ Built-in API routes | ❌ Separate | **Float.js** |
| **OTA Updates** | ❌ | ✅ Built-in | Expo |
| **Native Modules** | Manual setup | Easy | Expo |

**Conclusion**: Float.js combines the best of all three:
- Next.js's SSR and file-based routing
- Remix's simplicity
- Expo's React Native-first approach

Plus unique features like built-in state management, WebSocket support, and AI integration.

---

## Complete Usage Examples

### Example 1: Real-Time Chat Application

```typescript
// app/api/chat/route.ts
import { realtime } from '@float.js/core';

export const GET = realtime({
  rooms: ['general'],
  onConnect: (client) => {
    client.send({ type: 'connected', id: client.id });
  },
  onMessage: (client, message) => {
    client.room?.broadcast({
      type: 'message',
      from: client.id,
      text: message.payload
    });
  }
});

// app/chat/page.tsx
import { View, Text, TextInput, FlatList } from '@float.js/lite';
import { createRealtimeClient } from '@float.js/lite';
import { createFloatStore } from '@float.js/lite';
import { useEffect } from 'react';

const useChatStore = createFloatStore({
  messages: [],
  connected: false
});

export default function ChatPage() {
  useEffect(() => {
    const ws = createRealtimeClient({
      url: 'ws://localhost:3006/api/chat'
    });

    ws.connect().then(() => {
      useChatStore.setState({ connected: true });
      ws.join('general');
    });

    ws.on('message', (msg) => {
      useChatStore.setState({
        messages: [...useChatStore.getState().messages, msg]
      });
    });

    return () => ws.disconnect();
  }, []);

  const messages = useChatStore(s => s.messages);
  const connected = useChatStore(s => s.connected);

  const sendMessage = (text) => {
    ws.broadcast('general', 'message', text);
  };

  return (
    <View>
      <Text>{connected ? '🟢 Connected' : '🔴 Disconnected'}</Text>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text>{item.text}</Text>}
      />
      <TextInput
        placeholder="Type a message..."
        onSubmitEditing={(e) => sendMessage(e.nativeEvent.text)}
      />
    </View>
  );
}
```

### Example 2: Offline-First Todo App

```typescript
import { createFloatStore } from '@float.js/lite';
import { View, Text, TouchableOpacity, FlatList } from '@float.js/lite';
import { useState } from 'react';

// Persistent store
const useTodoStore = createFloatStore(
  {
    todos: [],
    syncQueue: []
  },
  {
    persist: 'todos' // Offline persistence
  }
);

export default function TodoApp() {
  const todos = useTodoStore(s => s.todos);
  const [input, setInput] = useState('');

  const addTodo = async (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      synced: false
    };

    // Optimistic update
    useTodoStore.setState({
      todos: [...todos, newTodo]
    });

    try {
      // Sync with server
      await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo)
      });

      // Mark as synced
      useTodoStore.setState({
        todos: todos.map(t =>
          t.id === newTodo.id ? { ...t, synced: true } : t
        )
      });
    } catch (error) {
      // Add to sync queue for later
      useTodoStore.setState({
        syncQueue: [...useTodoStore.getState().syncQueue, newTodo]
      });
    }
  };

  return (
    <View>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Add todo..."
      />
      <TouchableOpacity onPress={() => addTodo(input)}>
        <Text>Add</Text>
      </TouchableOpacity>
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <View>
            <Text>{item.text}</Text>
            <Text>{item.synced ? '✅' : '⏳'}</Text>
          </View>
        )}
      />
    </View>
  );
}
```

### Example 3: News Aggregator with AI

```typescript
// app/api/news/scan/route.ts
import { json } from '@float.js/core';
import { NewsScraper } from '@float.js/scraper';

export async function POST(req) {
  const { urls } = await req.json();
  const scraper = new NewsScraper();

  const headlines = [];
  for (const url of urls) {
    const result = await scraper.scan(url);
    if (result) headlines.push(...result.headlines);
  }

  await scraper.cleanup();
  return json({ headlines });
}

// app/news/page.tsx
import { View, Text, FlatList, Image } from '@float.js/lite';
import { createFloatStore } from '@float.js/lite';
import { useEffect } from 'react';

const useNewsStore = createFloatStore(
  { headlines: [], loading: false },
  { persist: 'news-cache' }
);

export default function NewsPage() {
  const headlines = useNewsStore(s => s.headlines);
  const loading = useNewsStore(s => s.loading);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    useNewsStore.setState({ loading: true });

    const res = await fetch('/api/news/scan', {
      method: 'POST',
      body: JSON.stringify({
        urls: [
          'https://www.bbc.com/news/technology',
          'https://techcrunch.com'
        ]
      })
    });

    const { headlines } = await res.json();
    useNewsStore.setState({ headlines, loading: false });
  };

  return (
    <View>
      <Text style={styles.title}>Latest News</Text>
      {loading && <ActivityIndicator />}
      <FlatList
        data={headlines}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}
            <Text style={styles.headline}>{item.title}</Text>
            <Text style={styles.source}>{item.source}</Text>
          </View>
        )}
      />
    </View>
  );
}
```

---

## Conclusion

Float.js is a **complete, modern framework** that combines:

1. ✅ **React Native-First**: True cross-platform development
2. ✅ **Built-in State Management**: Simpler than Redux, more powerful than Context
3. ✅ **Real-Time Support**: Native WebSocket integration
4. ✅ **Offline-First**: localStorage persistence by default
5. ✅ **AI Integration**: Native support for OpenAI/Anthropic
6. ✅ **Smart Scraping**: Multi-strategy content extraction
7. ✅ **SSR**: Server-side rendering out of the box
8. ✅ **Type-Safe**: Full TypeScript support
9. ✅ **Zero Config**: Works immediately

**Perfect For:**
- Multi-platform apps (web + mobile)
- Real-time applications (chat, collaborative tools)
- Offline-first PWAs
- AI-powered features
- News/content aggregation
- Rapid prototyping

**Get Started:**
```bash
npx create-float-app my-app
cd my-app
pnpm dev
```

---

**Created by Alejandro Iglesias** | [maravilla.digital](https://maravilla.digital)

**Version 1.0.0** | MIT License
