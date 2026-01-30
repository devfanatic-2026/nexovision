import { localDB, User, Product, Article } from './local-db';
import { useConnectionStore } from '../store/connection';

const API_BASE = process.env.FLOAT_API_URL || 'http://localhost:4000';

// Helper for fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

export const api = {
    // Check connection (ping)
    ping: async (): Promise<boolean> => {
        try {
            // Using a simple endpoint like /api/users (limit 1) or just assume if socket connects?
            // User requested WS operation. We can rely on WS status for online/offline.
            // But for REST calls, we double check or just try/catch.
            const res = await fetchWithTimeout(`${API_BASE}/api/users`, { method: 'HEAD' });
            return res.ok;
        } catch {
            return false;
        }
    },

    // Users
    users: {
        getAll: async (): Promise<User[]> => {
            const isOnline = useConnectionStore.getState().isOnline;
            if (isOnline) {
                try {
                    const res = await fetch(`${API_BASE}/api/users`);
                    if (res.ok) {
                        const data = await res.json();
                        // Hydrate local cache?
                        // localDB.hydrateUsers(data); (Need to implement hydrate properly)
                        return data;
                    }
                } catch (e) {
                    console.warn('API fetch failed, falling back to local DB', e);
                }
            }
            return localDB.userOps.findAll();
        },
        getById: async (id: number): Promise<User | undefined> => {
            const isOnline = useConnectionStore.getState().isOnline;
            if (isOnline) {
                try {
                    const res = await fetch(`${API_BASE}/api/users/${id}`);
                    if (res.ok) return await res.json();
                } catch (e) { console.warn('API fetch failed', e); }
            }
            return localDB.userOps.findById(id);
        }
    },

    // Products
    products: {
        getAll: async (category?: string): Promise<Product[]> => {
            const isOnline = useConnectionStore.getState().isOnline;
            if (isOnline) {
                try {
                    const url = category
                        ? `${API_BASE}/api/products?category=${encodeURIComponent(category)}`
                        : `${API_BASE}/api/products`;
                    const res = await fetch(url);
                    if (res.ok) return await res.json();
                } catch (e) { console.warn('API fetch failed', e); }
            }
            return localDB.productOps.findAll(category);
        }
    },

    // Articles
    articles: {
        getAll: async (): Promise<Article[]> => {
            const isOnline = useConnectionStore.getState().isOnline;
            if (isOnline) {
                try {
                    const res = await fetch(`${API_BASE}/api/articles`);
                    if (res.ok) return await res.json();
                } catch (e) { console.warn('API fetch failed', e); }
            }
            return localDB.articleOps.findAll();
        }
    },

    // AI Chat (Online Only usually, but could mock "Offline Agent")
    ai: {
        chat: async (message: string): Promise<{ reply: string }> => {
            const isOnline = useConnectionStore.getState().isOnline;
            if (isOnline) {
                try {
                    const res = await fetch(`${API_BASE}/api/ai/chat`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message }),
                    });
                    if (res.ok) return await res.json();
                } catch (e) { console.warn('API chat failed', e); }
            }
            return { reply: "[OFFLINE] I cannot reach the server right now using RAG. But local data is available!" };
        }
    }
};
