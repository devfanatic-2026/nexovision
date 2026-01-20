import { SyncService } from '../services/sync.service.js';
import { KeystaticDBSyncService } from '../services/keystatic-db-sync.service.js';
import { initializeDb } from '../database.js';
import { ArticleRepository } from '../repositories/article.repository.js';
import { AuthorRepository } from '../repositories/author.repository.js';
import { CategoryRepository } from '../repositories/category.repository.js';

class DIContainer {
  private services = new Map<string, any>();
  private asyncServices = new Map<string, () => Promise<any>>();

  register<T>(name: string, factory: () => T, singleton: boolean = true): void {
    if (singleton) {
      Object.defineProperty(this, name, {
        get: () => {
          if (!this.services.has(name)) {
            this.services.set(name, factory());
          }
          return this.services.get(name);
        },
        enumerable: true,
        configurable: true,
      });
    } else {
      (this as any)[name] = factory();
    }
  }

  registerAsync<T>(name: string, factory: () => Promise<T>, singleton: boolean = true): void {
    this.asyncServices.set(name, factory);
  }

  async resolve<T>(name: string): Promise<T> {
    if (this.asyncServices.has(name)) {
      const factory = this.asyncServices.get(name)!;
      if (this.services.has(name)) {
        return this.services.get(name) as T;
      }
      const instance = await factory();
      this.services.set(name, instance);
      return instance;
    }

    if (!(this as any)[name]) {
      throw new Error(`Service ${name} not registered`);
    }
    return (this as any)[name] as T;
  }
}

export const container = new DIContainer();

// Database instance
let dbInstance: any = null;

// Function to initialize database
async function getDatabase() {
  if (!dbInstance) {
    dbInstance = await initializeDb();
  }
  return dbInstance;
}

// Register repositories with async database initialization
container.registerAsync('ArticleRepository', async () => {
  const db = await getDatabase();
  return new ArticleRepository(db);
});

container.registerAsync('AuthorRepository', async () => {
  const db = await getDatabase();
  return new AuthorRepository(db);
});

container.registerAsync('CategoryRepository', async () => {
  const db = await getDatabase();
  return new CategoryRepository(db);
});

// Register services
container.register('SyncService', () => new SyncService(
  process.env.CONTENT_SOURCE_DIR,
  process.env.DB_FILE,
  process.env.PROMPT_MARKDOWN_SCHEMA
));

container.registerAsync('KeystaticDBSyncService', async () => {
  const articleRepo = await container.resolve<ArticleRepository>('ArticleRepository');
  const authorRepo = await container.resolve<AuthorRepository>('AuthorRepository');
  const categoryRepo = await container.resolve<CategoryRepository>('CategoryRepository');
  return new KeystaticDBSyncService(articleRepo, authorRepo, categoryRepo);
});