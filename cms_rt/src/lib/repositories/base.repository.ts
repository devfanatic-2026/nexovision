import { Database } from 'sqlite';

export abstract class BaseRepository<T> {
    constructor(protected db: Database) { }

    protected async run(sql: string, params: any[] = []): Promise<void> {
        await this.db.run(sql, params);
    }

    protected async get<R = T>(sql: string, params: any[] = []): Promise<R | undefined> {
        return await this.db.get(sql, params);
    }

    protected async all<R = T>(sql: string, params: any[] = []): Promise<R[]> {
        return await this.db.all(sql, params);
    }
}
