import { mockUsers, mockProducts, mockArticles } from './mock-data';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    role: 'admin' | 'user' | 'moderator';
    status: 'online' | 'offline' | 'away';
    createdAt: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    rating: number;
}

export interface Article {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    author: number; // User ID
    category: string;
    tags: string[];
    publishedAt: string;
    views: number;
}

export interface ChatMessage {
    id: number;
    roomId: string;
    userId: number;
    message: string;
    timestamp: string;
}

class LocalDB {
    private users: User[] = [...mockUsers];
    private products: Product[] = [...mockProducts];
    private articles: Article[] = [...mockArticles];
    private messages: ChatMessage[] = [];
    private pendingSync: any[] = []; // Store operations for sync

    // Users
    userOps = {
        findAll: (): User[] => this.users,
        findById: (id: number): User | undefined => this.users.find(u => u.id === id),
        create: (user: Omit<User, 'id'>): User => {
            const newUser = { ...user, id: -(this.users.length + 1) }; // Negative ID for local only
            this.users.push(newUser);
            this.pendingSync.push({ type: 'CREATE_USER', data: newUser });
            return newUser;
        },
        update: (id: number, data: Partial<User>): User | undefined => {
            const index = this.users.findIndex(u => u.id === id);
            if (index === -1) return undefined;
            this.users[index] = { ...this.users[index], ...data };
            this.pendingSync.push({ type: 'UPDATE_USER', id, data });
            return this.users[index];
        },
    };

    // Products
    productOps = {
        findAll: (category?: string): Product[] => {
            if (category) return this.products.filter(p => p.category === category);
            return this.products;
        },
        findById: (id: number): Product | undefined => this.products.find(p => p.id === id),
        create: (product: Omit<Product, 'id'>): Product => {
            const newProduct = { ...product, id: -(this.products.length + 1) };
            this.products.push(newProduct);
            this.pendingSync.push({ type: 'CREATE_PRODUCT', data: newProduct });
            return newProduct;
        },
    };

    // Articles
    articleOps = {
        findAll: (): Article[] => this.articles,
        findBySlug: (slug: string): Article | undefined => this.articles.find(a => a.slug === slug),
    };

    // Chat
    messageOps = {
        findByRoom: (roomId: string): ChatMessage[] => this.messages.filter(m => m.roomId === roomId),
        create: (message: Omit<ChatMessage, 'id'>): ChatMessage => {
            const newMessage = { ...message, id: Date.now() }; // Temp ID
            this.messages.push(newMessage);
            // Chat might behave differently (fire and forget for now, or queue)
            return newMessage;
        }
    };

    // Sync
    getPendingOps() {
        return this.pendingSync;
    }

    clearPendingOps() {
        this.pendingSync = [];
    }

    // Initialize with server data
    hydrate(data: { users: User[], products: Product[], articles: Article[] }) {
        this.users = data.users;
        this.products = data.products;
        this.articles = data.articles;
    }
}

export const localDB = new LocalDB();
