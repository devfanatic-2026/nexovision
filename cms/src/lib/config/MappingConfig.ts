/**
 * Field Mapping Configuration Types
 * Defines the structure for mapping markdown frontmatter to database schema
 */

export type FieldType = 'TEXT' | 'INTEGER' | 'BOOLEAN' | 'REAL';

export type RelationType = 'BELONGS_TO' | 'ONE_TO_MANY' | 'MANY_TO_MANY';

export type OnDeleteAction = 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';

export interface FieldMapping {
    type: FieldType;
    required?: boolean;
    unique?: boolean;
    primary?: boolean;
    default?: any;
    source: string; // Path in markdown (e.g., "frontmatter.title", "content", "slug")
}

export interface RelationMapping {
    type: RelationType;
    entity: string; // Target entity name
    foreignKey?: string;
    otherKey?: string; // For MANY_TO_MANY
    through?: string; // For MANY_TO_MANY (junction table)
    onDelete?: OnDeleteAction;
    source?: string; // Path in markdown for the relation data
}

export interface EntityMapping {
    table: string;
    fields: Record<string, FieldMapping>;
    primaryKey?: string[]; // For composite primary keys
    relations?: Record<string, RelationMapping>;
}

export interface FieldMappingConfig {
    version: string;
    entities: Record<string, EntityMapping>;
}

/**
 * Mapping Configuration Manager
 * Loads and validates the field mapping configuration
 */
export class MappingConfig {
    private static config: FieldMappingConfig | null = null;

    /**
     * Load the mapping configuration from file
     */
    static async load(): Promise<FieldMappingConfig> {
        if (this.config) {
            return this.config;
        }

        const fs = await import('fs/promises');
        const path = await import('path');

        const configPath = path.join(process.cwd(), 'config', 'field-mapping.json');
        const content = await fs.readFile(configPath, 'utf-8');
        const config = JSON.parse(content) as FieldMappingConfig;

        this.validate(config);
        this.config = config;

        return config;
    }

    /**
     * Validate the configuration structure
     */
    static validate(config: any): void {
        if (!config.version) {
            throw new Error('Configuration must have a version field');
        }

        if (!config.entities || typeof config.entities !== 'object') {
            throw new Error('Configuration must have an entities object');
        }

        for (const [entityName, entity] of Object.entries(config.entities)) {
            const e = entity as any;

            if (!e.table) {
                throw new Error(`Entity "${entityName}" must have a table name`);
            }

            if (!e.fields || typeof e.fields !== 'object') {
                throw new Error(`Entity "${entityName}" must have fields`);
            }

            // Validate each field
            for (const [fieldName, field] of Object.entries(e.fields)) {
                const f = field as any;

                if (!f.type) {
                    throw new Error(`Field "${entityName}.${fieldName}" must have a type`);
                }

                if (!f.source) {
                    throw new Error(`Field "${entityName}.${fieldName}" must have a source`);
                }
            }
        }
    }

    /**
     * Get mapping for a specific entity
     */
    static async getEntityMapping(entityName: string): Promise<EntityMapping> {
        const config = await this.load();
        const mapping = config.entities[entityName];

        if (!mapping) {
            throw new Error(`No mapping found for entity: ${entityName}`);
        }

        return mapping;
    }

    /**
     * Get all entity names
     */
    static async getEntityNames(): Promise<string[]> {
        const config = await this.load();
        return Object.keys(config.entities);
    }

    /**
     * Clear cached configuration (useful for testing)
     */
    static clearCache(): void {
        this.config = null;
    }
}
