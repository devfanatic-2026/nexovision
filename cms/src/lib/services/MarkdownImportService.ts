import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { randomUUID } from 'crypto';
import { Database } from 'sqlite';
import { MappingConfig, EntityMapping, FieldMapping } from '../config/MappingConfig.js';

export interface ImportResult {
    entity: string;
    created: number;
    updated: number;
    errors: Array<{ file: string; error: string }>;
}

export interface ImportSummary {
    success: boolean;
    results: ImportResult[];
    totalCreated: number;
    totalUpdated: number;
    totalErrors: number;
}

/**
 * Markdown Import Service
 * Imports markdown files from external directory into database
 * Uses field mapping configuration to parse frontmatter
 */
export class MarkdownImportService {
    constructor(
        private db: Database,
        private contentSourceDir: string
    ) { }

    /**
     * Import all entities from markdown directory
     */
    async importAll(): Promise<ImportSummary> {
        const results: ImportResult[] = [];
        let totalCreated = 0;
        let totalUpdated = 0;
        let totalErrors = 0;

        try {
            // Import in order to respect foreign key constraints
            const importOrder = ['categories', 'authors', 'articles'];

            for (const entityName of importOrder) {
                try {
                    const mapping = await MappingConfig.getEntityMapping(entityName);

                    // Skip junction tables (they're populated when importing main entities)
                    if (entityName.includes('_')) {
                        continue;
                    }

                    console.log(`\n📦 Importing ${entityName}...`);
                    const result = await this.importEntity(entityName, mapping);
                    results.push(result);

                    totalCreated += result.created;
                    totalUpdated += result.updated;
                    totalErrors += result.errors.length;

                    console.log(`   ✓ Created: ${result.created}, Updated: ${result.updated}, Errors: ${result.errors.length}`);

                } catch (error: any) {
                    console.error(`   ✗ Failed to import ${entityName}:`, error.message);
                    results.push({
                        entity: entityName,
                        created: 0,
                        updated: 0,
                        errors: [{ file: 'all', error: error.message }]
                    });
                    totalErrors++;
                }
            }

            return {
                success: totalErrors === 0,
                results,
                totalCreated,
                totalUpdated,
                totalErrors
            };

        } catch (error: any) {
            throw new Error(`Import failed: ${error.message}`);
        }
    }

    /**
     * Import a single entity type
     */
    private async importEntity(entityName: string, mapping: EntityMapping): Promise<ImportResult> {
        const result: ImportResult = {
            entity: entityName,
            created: 0,
            updated: 0,
            errors: []
        };

        try {
            // Find markdown files for this entity
            const entityDir = path.join(this.contentSourceDir, entityName);

            // Check if directory exists
            try {
                await fs.access(entityDir);
            } catch {
                console.log(`   ℹ️  No directory found at ${entityDir}, skipping`);
                return result;
            }

            const entries = await fs.readdir(entityDir);

            // Filter for subdirectories (Keystatic structure)
            const subdirs: string[] = [];
            for (const entry of entries) {
                const entryPath = path.join(entityDir, entry);
                const stats = await fs.stat(entryPath);
                if (stats.isDirectory()) {
                    subdirs.push(entry);
                }
            }

            if (subdirs.length === 0) {
                console.log(`   ℹ️  No subdirectories found in ${entityDir}`);
                return result;
            }

            // Process each subdirectory
            for (const subdir of subdirs) {
                const subdirPath = path.join(entityDir, subdir);
                const slug = subdir;

                try {
                    // Check for index.json (for data-only entities like categories)
                    const jsonPath = path.join(subdirPath, 'index.json');
                    const mdxPath = path.join(subdirPath, 'index.mdx');
                    const mdPath = path.join(subdirPath, 'index.md');

                    let frontmatter: any = {};
                    let mdContent = '';

                    // Try JSON first
                    try {
                        await fs.access(jsonPath);
                        const jsonContent = await fs.readFile(jsonPath, 'utf-8');
                        frontmatter = JSON.parse(jsonContent);
                    } catch {
                        // Try MDX/MD
                        let filePath: string | null = null;

                        try {
                            await fs.access(mdxPath);
                            filePath = mdxPath;
                        } catch {
                            try {
                                await fs.access(mdPath);
                                filePath = mdPath;
                            } catch {
                                // No valid file found
                                result.errors.push({
                                    file: subdir,
                                    error: 'No index.json, index.mdx, or index.md found'
                                });
                                continue;
                            }
                        }

                        if (filePath) {
                            const content = await fs.readFile(filePath, 'utf-8');
                            const parsed = matter(content);
                            frontmatter = parsed.data;
                            mdContent = parsed.content;
                        }
                    }

                    // Parse markdown according to mapping
                    const record = this.parseMarkdown(slug, frontmatter, mdContent, mapping);

                    // Insert or update record
                    const exists = await this.recordExists(mapping.table, record.slug);

                    if (exists) {
                        await this.updateRecord(mapping.table, record);
                        result.updated++;
                    } else {
                        await this.insertRecord(mapping.table, record, mapping);
                        result.created++;
                    }

                } catch (error: any) {
                    result.errors.push({ file: subdir, error: error.message });
                }
            }

        } catch (error: any) {
            result.errors.push({ file: 'directory', error: error.message });
        }

        return result;
    }

    /**
     * Parse markdown file according to field mapping
     */
    private parseMarkdown(
        slug: string,
        frontmatter: any,
        content: string,
        mapping: EntityMapping
    ): Record<string, any> {
        const record: Record<string, any> = {
            id: randomUUID(),
            slug: slug
        };

        // Map each field according to configuration
        for (const [fieldName, fieldMapping] of Object.entries(mapping.fields)) {
            // Skip id and slug as we've already set them
            if (fieldName === 'id' || fieldName === 'slug') {
                continue;
            }

            const value = this.extractValue(frontmatter, content, fieldMapping);

            // Convert boolean values for SQLite
            if (fieldMapping.type === 'BOOLEAN') {
                record[fieldName] = value ? 1 : 0;
            } else if (value !== undefined && value !== null) {
                record[fieldName] = value;
            } else if (fieldMapping.default !== undefined) {
                record[fieldName] = fieldMapping.default;
            }
        }

        // Store relations for later processing
        record._relations = {};
        if (mapping.relations) {
            for (const [relationName, relationMapping] of Object.entries(mapping.relations)) {
                if (relationMapping.source) {
                    const value = this.extractValue(frontmatter, content, { source: relationMapping.source } as FieldMapping);
                    if (value !== undefined) {
                        record._relations[relationName] = value;
                    }
                }
            }
        }

        return record;
    }

    /**
     * Extract value from markdown based on source path
     */
    private extractValue(frontmatter: any, content: string, fieldMapping: FieldMapping): any {
        const source = fieldMapping.source;

        if (source === 'content') {
            return content;
        } else if (source.startsWith('frontmatter.')) {
            const key = source.replace('frontmatter.', '');
            return this.getNestedValue(frontmatter, key);
        } else if (source === 'slug' || source === 'id') {
            // These are handled separately
            return undefined;
        }

        return undefined;
    }

    /**
     * Get nested value from object using dot notation
     */
    private getNestedValue(obj: any, path: string): any {
        const keys = path.split('.');
        let value = obj;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }

        return value;
    }

    /**
     * Check if record exists
     */
    private async recordExists(table: string, slug: string): Promise<boolean> {
        const result = await this.db.get(
            `SELECT COUNT(*) as count FROM ${table} WHERE slug = ?`,
            [slug]
        );
        return result && result.count > 0;
    }

    /**
     * Insert new record
     */
    private async insertRecord(
        table: string,
        record: Record<string, any>,
        mapping: EntityMapping
    ): Promise<void> {
        // Extract relations for separate handling
        const relations = record._relations || {};
        delete record._relations;

        // Build INSERT statement
        const columns = Object.keys(record);
        const placeholders = columns.map(() => '?').join(', ');
        const values = columns.map(col => record[col]);

        const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
        await this.db.run(sql, values);

        // Handle relations
        await this.handleRelations(record.id, relations, mapping);
    }

    /**
     * Update existing record
     */
    private async updateRecord(table: string, record: Record<string, any>): Promise<void> {
        // Extract relations for separate handling
        const relations = record._relations || {};
        delete record._relations;

        // Build UPDATE statement
        const columns = Object.keys(record).filter(col => col !== 'slug');
        const setClause = columns.map(col => `${col} = ?`).join(', ');
        const values = [...columns.map(col => record[col]), record.slug];

        const sql = `UPDATE ${table} SET ${setClause} WHERE slug = ?`;
        await this.db.run(sql, values);

        // Note: For now, we don't update relations on existing records
        // This could be enhanced later if needed
    }

    /**
     * Handle many-to-many and one-to-many relations
     */
    private async handleRelations(
        recordId: string,
        relations: Record<string, any>,
        mapping: EntityMapping
    ): Promise<void> {
        if (!mapping.relations) {
            return;
        }

        for (const [relationName, relationMapping] of Object.entries(mapping.relations)) {
            const relationData = relations[relationName];

            if (!relationData) {
                continue;
            }

            if (relationMapping.type === 'MANY_TO_MANY' && Array.isArray(relationData)) {
                // Handle many-to-many (e.g., article authors)
                await this.handleManyToMany(recordId, relationData, relationMapping);
            } else if (relationMapping.type === 'ONE_TO_MANY' && Array.isArray(relationData)) {
                // Handle one-to-many (e.g., author socials)
                await this.handleOneToMany(recordId, relationData, relationMapping);
            }
        }
    }

    /**
     * Handle many-to-many relation
     */
    private async handleManyToMany(
        recordId: string,
        relatedSlugs: string[],
        relationMapping: any
    ): Promise<void> {
        if (!relationMapping.through || !relationMapping.foreignKey || !relationMapping.otherKey) {
            return;
        }

        // Get IDs of related records by their slugs
        for (const slug of relatedSlugs) {
            const related = await this.db.get(
                `SELECT id FROM ${relationMapping.entity} WHERE slug = ?`,
                [slug]
            );

            if (related) {
                // Insert into junction table
                try {
                    await this.db.run(
                        `INSERT OR IGNORE INTO ${relationMapping.through} (${relationMapping.foreignKey}, ${relationMapping.otherKey}) VALUES (?, ?)`,
                        [recordId, related.id]
                    );
                } catch (error) {
                    // Ignore duplicate key errors
                }
            }
        }
    }

    /**
     * Handle one-to-many relation
     */
    private async handleOneToMany(
        recordId: string,
        relatedData: any[],
        relationMapping: any
    ): Promise<void> {
        // This would be used for things like author socials
        // Implementation depends on specific entity structure
        // For now, we'll skip this as it's entity-specific
    }
}
