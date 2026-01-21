import { MappingConfig, EntityMapping, FieldMapping, RelationMapping } from '../config/MappingConfig.js';

/**
 * Schema Generator
 * Generates complete SQL DDL from field mapping configuration
 */
export class SchemaGenerator {
    /**
     * Generate complete CREATE TABLE statements for all entities
     */
    static async generateSchema(): Promise<string> {
        const config = await MappingConfig.load();
        const statements: string[] = [];

        // First pass: Create tables without foreign keys
        for (const [entityName, entity] of Object.entries(config.entities)) {
            const createTable = this.generateCreateTable(entityName, entity, false);
            statements.push(createTable);
        }

        // Second pass: Add foreign key constraints (if needed separately)
        // For SQLite, we include them in the CREATE TABLE statement above

        return statements.join('\n\n');
    }

    /**
     * Generate CREATE TABLE statement for a single entity
     */
    static generateCreateTable(
        entityName: string,
        entity: EntityMapping,
        includeForeignKeys: boolean = true
    ): string {
        const columns: string[] = [];
        const constraints: string[] = [];

        // Generate column definitions
        for (const [fieldName, field] of Object.entries(entity.fields)) {
            const columnDef = this.generateColumnDefinition(fieldName, field);
            columns.push(columnDef);
        }

        // Generate primary key constraint (for composite keys)
        if (entity.primaryKey && entity.primaryKey.length > 0) {
            constraints.push(`PRIMARY KEY (${entity.primaryKey.join(', ')})`);
        }

        // Generate foreign key constraints
        if (includeForeignKeys && entity.relations) {
            for (const [relationName, relation] of Object.entries(entity.relations)) {
                if (relation.type === 'BELONGS_TO' || relation.type === 'MANY_TO_MANY') {
                    const fkConstraint = this.generateForeignKeyConstraint(relation);
                    if (fkConstraint) {
                        constraints.push(fkConstraint);
                    }
                }
            }
        }

        // Combine columns and constraints
        const allDefinitions = [...columns, ...constraints];
        const tableDef = allDefinitions.map(def => `  ${def}`).join(',\n');

        return `CREATE TABLE IF NOT EXISTS ${entity.table} (\n${tableDef}\n);`;
    }

    /**
     * Generate column definition
     */
    static generateColumnDefinition(fieldName: string, field: FieldMapping): string {
        const parts: string[] = [fieldName];

        // Convert BOOLEAN to INTEGER for SQLite
        const sqlType = field.type === 'BOOLEAN' ? 'INTEGER' : field.type;
        parts.push(sqlType);

        // Primary key
        if (field.primary) {
            parts.push('PRIMARY KEY');
        }

        // Not null
        if (field.required && !field.primary) {
            parts.push('NOT NULL');
        }

        // Unique
        if (field.unique) {
            parts.push('UNIQUE');
        }

        // Default value
        if (field.default !== undefined) {
            const defaultValue = typeof field.default === 'string'
                ? `'${field.default}'`
                : field.default;
            parts.push(`DEFAULT ${defaultValue}`);
        }

        return parts.join(' ');
    }

    /**
     * Generate foreign key constraint
     */
    static generateForeignKeyConstraint(relation: RelationMapping): string | null {
        if (!relation.foreignKey) {
            return null;
        }

        const parts: string[] = [
            `FOREIGN KEY (${relation.foreignKey})`,
            `REFERENCES ${relation.entity}(id)`
        ];

        if (relation.onDelete) {
            parts.push(`ON DELETE ${relation.onDelete}`);
        }

        return parts.join(' ');
    }

    /**
     * Generate DROP TABLE statements for all entities (in reverse order for FK constraints)
     */
    static async generateDropSchema(): Promise<string> {
        const config = await MappingConfig.load();
        const statements: string[] = [];

        // Drop in reverse order to handle foreign key dependencies
        const entityNames = Object.keys(config.entities).reverse();

        for (const entityName of entityNames) {
            const entity = config.entities[entityName];
            statements.push(`DROP TABLE IF EXISTS ${entity.table};`);
        }

        return statements.join('\n');
    }

    /**
     * Generate schema version tracking table
     */
    static generateVersionTable(): string {
        return `CREATE TABLE IF NOT EXISTS _schema_version (
  version TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL,
  config_hash TEXT NOT NULL
);`;
    }

    /**
     * Generate hash of current configuration for change detection
     */
    static async getConfigHash(): Promise<string> {
        const config = await MappingConfig.load();
        const crypto = await import('crypto');
        const configString = JSON.stringify(config);
        return crypto.createHash('sha256').update(configString).digest('hex');
    }
}
