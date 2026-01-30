/**
 * Mock Database - In-Memory Data Store
 * Shared by both web and mobile showcase projects
 */

// ============================================================================
// TYPES
// ============================================================================

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

// ============================================================================
// MOCK DATA
// ============================================================================

export const mockUsers: User[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', avatar: 'https://i.pravatar.cc/150?img=1', role: 'admin', status: 'online', createdAt: '2024-01-01' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', avatar: 'https://i.pravatar.cc/150?img=2', role: 'user', status: 'online', createdAt: '2024-01-02' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', avatar: 'https://i.pravatar.cc/150?img=3', role: 'moderator', status: 'away', createdAt: '2024-01-03' },
    { id: 4, name: 'David Brown', email: 'david@example.com', avatar: 'https://i.pravatar.cc/150?img=4', role: 'user', status: 'offline', createdAt: '2024-01-04' },
    { id: 5, name: 'Emma Davis', email: 'emma@example.com', avatar: 'https://i.pravatar.cc/150?img=5', role: 'user', status: 'online', createdAt: '2024-01-05' },
    { id: 6, name: 'Frank Wilson', email: 'frank@example.com', avatar: 'https://i.pravatar.cc/150?img=6', role: 'user', status: 'online', createdAt: '2024-01-06' },
    { id: 7, name: 'Grace Lee', email: 'grace@example.com', avatar: 'https://i.pravatar.cc/150?img=7', role: 'moderator', status: 'away', createdAt: '2024-01-07' },
    { id: 8, name: 'Henry Martinez', email: 'henry@example.com', avatar: 'https://i.pravatar.cc/150?img=8', role: 'user', status: 'offline', createdAt: '2024-01-08' },
];

export const mockProducts: Product[] = [
    { id: 1, name: 'Laptop Pro 15"', description: 'High-performance laptop for professionals', price: 1299, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', category: 'Electronics', stock: 15, rating: 4.8 },
    { id: 2, name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with precision tracking', price: 29, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400', category: 'Accessories', stock: 50, rating: 4.5 },
    { id: 3, name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard with cherry switches', price: 89, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', category: 'Accessories', stock: 30, rating: 4.7 },
    { id: 4, name: 'USB-C Hub', description: '7-in-1 USB-C hub with HDMI and ethernet', price: 45, image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400', category: 'Accessories', stock: 40, rating: 4.3 },
    { id: 5, name: '27" Monitor 4K', description: '4K UHD monitor with HDR support', price: 399, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', category: 'Electronics', stock: 12, rating: 4.9 },
    { id: 6, name: 'Webcam HD', description: '1080p webcam with auto-focus', price: 79, image: 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=400', category: 'Electronics', stock: 25, rating: 4.4 },
    { id: 7, name: 'Desk Lamp LED', description: 'Adjustable LED desk lamp with USB charging', price: 35, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', category: 'Office', stock: 60, rating: 4.6 },
    { id: 8, name: 'Noise-Canceling Headphones', description: 'Premium over-ear headphones with ANC', price: 249, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', category: 'Audio', stock: 18, rating: 4.8 },
];

export const mockArticles: Article[] = [
    {
        id: 1,
        slug: 'getting-started-float-js',
        title: 'Getting Started with Float.js',
        excerpt: 'Learn how to build modern React applications with Float.js framework',
        content: '# Getting Started\n\nFloat.js is a modern framework that combines the best of server-side rendering and client-side interactivity...',
        coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
        author: 1,
        category: 'Tutorial',
        tags: ['react', 'floatjs', 'tutorial'],
        publishedAt: '2024-01-15',
        views: 1245
    },
    {
        id: 2,
        slug: 'state-management-guide',
        title: 'Complete Guide to State Management',
        excerpt: 'Master state management in Float.js with createFloatStore',
        content: '# State Management\n\nFloat.js provides a powerful state management system...',
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        author: 2,
        category: 'Guide',
        tags: ['state', 'store', 'guide'],
        publishedAt: '2024-01-14',
        views: 987
    },
    {
        id: 3,
        slug: 'realtime-websocket-apps',
        title: 'Building Real-Time Apps with WebSockets',
        excerpt: 'Create real-time applications using Float.js built-in WebSocket support',
        content: '# Real-Time with WebSockets\n\nWebSocket support is built right into Float.js...',
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        author: 3,
        category: 'Tutorial',
        tags: ['websocket', 'realtime', 'chat'],
        publishedAt: '2024-01-13',
        views: 756
    },
];

// ============================================================================
// IN-MEMORY DATABASE
// ============================================================================

class InMemoryDB {
    private users: User[] = [...mockUsers];
    private products: Product[] = [...mockProducts];
    private articles: Article[] = [...mockArticles];
    private messages: ChatMessage[] = [];

    // Users
    users = {
        findAll: (): User[] => this.users,
        findById: (id: number): User | undefined => this.users.find(u => u.id === id),
        findByEmail: (email: string): User | undefined => this.users.find(u => u.email === email),
        create: (user: Omit<User, 'id'>): User => {
            const newUser = { ...user, id: this.users.length + 1 };
            this.users.push(newUser);
            return newUser;
        },
        update: (id: number, data: Partial<User>): User | undefined => {
            const index = this.users.findIndex(u => u.id === id);
            if (index === -1) return undefined;
            this.users[index] = { ...this.users[index], ...data };
            return this.users[index];
        },
        delete: (id: number): boolean => {
            const index = this.users.findIndex(u => u.id === id);
            if (index === -1) return false;
            this.users.splice(index, 1);
            return true;
        },
    };

    // Products
    products = {
        findAll: (category?: string): Product[] => {
            if (category) {
                return this.products.filter(p => p.category === category);
            }
            return this.products;
        },
        findById: (id: number): Product | undefined => this.products.find(p => p.id === id),
        search: (query: string): Product[] => {
            const q = query.toLowerCase();
            return this.products.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q)
            );
        },
        create: (product: Omit<Product, 'id'>): Product => {
            const newProduct = { ...product, id: this.products.length + 1 };
            this.products.push(newProduct);
            return newProduct;
        },
        update: (id: number, data: Partial<Product>): Product | undefined => {
            const index = this.products.findIndex(p => p.id === id);
            if (index === -1) return undefined;
            this.products[index] = { ...this.products[index], ...data };
            return this.products[index];
        },
        delete: (id: number): boolean => {
            const index = this.products.findIndex(p => p.id === id);
            if (index === -1) return false;
            this.products.splice(index, 1);
            return true;
        },
    };

    // Articles
    articles = {
        findAll: (category?: string): Article[] => {
            if (category) {
                return this.articles.filter(a => a.category === category);
            }
            return this.articles;
        },
        findById: (id: number): Article | undefined => this.articles.find(a => a.id === id),
        findBySlug: (slug: string): Article | undefined => this.articles.find(a => a.slug === slug),
        search: (query: string): Article[] => {
            const q = query.toLowerCase();
            return this.articles.filter(a =>
                a.title.toLowerCase().includes(q) ||
                a.excerpt.toLowerCase().includes(q)
            );
        },
        create: (article: Omit<Article, 'id'>): Article => {
            const newArticle = { ...article, id: this.articles.length + 1, views: 0 };
            this.articles.push(newArticle);
            return newArticle;
        },
        incrementViews: (id: number): void => {
            const article = this.articles.find(a => a.id === id);
            if (article) article.views++;
        },
    };

    // Chat Messages
    messages = {
        findByRoom: (roomId: string): ChatMessage[] => {
            return this.messages.filter(m => m.roomId === roomId);
        },
        create: (message: Omit<ChatMessage, 'id'>): ChatMessage => {
            const newMessage = { ...message, id: this.messages.length + 1 };
            this.messages.push(newMessage);
            return newMessage;
        },
        clear: (roomId: string): void => {
            this.messages = this.messages.filter(m => m.roomId !== roomId);
        },
    };

    // Reset database
    reset = (): void => {
        this.users = [...mockUsers];
        this.products = [...mockProducts];
        this.articles = [...mockArticles];
        this.messages = [];
    };
}

// Export singleton instance
export const db = new InMemoryDB();
