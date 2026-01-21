import { Database } from 'sqlite';
import { SchemaGenerator } from './SchemaGenerator.js';
import { MappingConfig } from '../config/MappingConfig.js';

export interface MigrationResult {
    success: boolean;
    message: string;
    appliedAt?: string;
    configHash?: string;
}

/**
 * Migration Runner
 * Executes clean schema recreation based on field mapping configuration
 */
export class MigrationRunner {
    constructor(private db: Database) { }

    /**
     * Run migration: Drop existing schema and recreate from configuration
     * @param autoImport Whether to automatically import data after migration (default: true)
     */
    async runMigration(autoImport: boolean = true): Promise<MigrationResult> {
        try {
            console.log('🔄 Starting migration...');

            // Generate configuration hash
            const configHash = await SchemaGenerator.getConfigHash();
            console.log(`📋 Config hash: ${configHash.substring(0, 8)}...`);

            // Check if schema needs update
            const needsUpdate = await this.needsSchemaUpdate(configHash);
            if (!needsUpdate) {
                return {
                    success: true,
                    message: 'Schema is already up to date',
                    configHash
                };
            }

            // Begin transaction
            await this.db.exec('BEGIN TRANSACTION;');

            try {
                // Step 1: Disable foreign key constraints temporarily
                await this.db.exec('PRAGMA foreign_keys = OFF;');

                // Step 2: Drop existing tables
                console.log('🗑️  Dropping existing tables...');
                const dropSchema = await SchemaGenerator.generateDropSchema();
                await this.db.exec(dropSchema);

                // Step 3: Create version tracking table
                const versionTable = SchemaGenerator.generateVersionTable();
                await this.db.exec(versionTable);

                // Step 4: Create new schema
                console.log('🏗️  Creating new schema...');
                const createSchema = await SchemaGenerator.generateSchema();
                await this.db.exec(createSchema);

                // Step 5: Re-enable foreign key constraints
                await this.db.exec('PRAGMA foreign_keys = ON;');

                // Step 6: Record schema version
                const appliedAt = new Date().toISOString();
                await this.db.run(
                    'INSERT OR REPLACE INTO _schema_version (version, applied_at, config_hash) VALUES (?, ?, ?)',
                    ['1.0', appliedAt, configHash]
                );

                // Commit transaction
                await this.db.exec('COMMIT;');

                console.log('✅ Schema migration completed successfully');

                // Step 7: Auto-import data if requested
                if (autoImport) {
                    console.log('📥 Auto-importing data...');
                    return {
                        success: true,
                        message: 'Schema recreated successfully. Ready for data import.',
                        appliedAt,
                        configHash
                    };
                }

                return {
                    success: true,
                    message: 'Schema recreated successfully',
                    appliedAt,
                    configHash
                };

            } catch (error) {
                // Rollback on error
                await this.db.exec('ROLLBACK;');
                throw error;
            }

        } catch (error: any) {
            console.error('❌ Migration failed:', error.message);
            return {
                success: false,
                message: `Migration failed: ${error.message}`
            };
        }
    }

    /**
     * Check if schema needs update by comparing config hash
     */
    private async needsSchemaUpdate(currentHash: string): Promise<boolean> {
        try {
            // Check if version table exists
            const tableExists = await this.db.get(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='_schema_version'"
            );

            if (!tableExists) {
                console.log('ℹ️  No version table found, migration needed');
                return true;
            }

            // Get last applied config hash
            const lastVersion = await this.db.get<{ config_hash: string }>(
                'SELECT config_hash FROM _schema_version ORDER BY applied_at DESC LIMIT 1'
            );

            if (!lastVersion) {
                console.log('ℹ️  No version recorded, migration needed');
                return true;
            }

            if (lastVersion.config_hash !== currentHash) {
                console.log('ℹ️  Config changed, migration needed');
                return true;
            }

            console.log('ℹ️  Schema is up to date');
            return false;

        } catch (error) {
            // If error checking version, assume we need to migrate
            console.log('ℹ️  Error checking version, assuming migration needed');
            return true;
        }
    }

    /**
     * Get current schema version info
     */
    async getSchemaVersion(): Promise<{ version: string; appliedAt: string; configHash: string } | null> {
        try {
            const version = await this.db.get<{ version: string; applied_at: string; config_hash: string }>(
                'SELECT version, applied_at, config_hash FROM _schema_version ORDER BY applied_at DESC LIMIT 1'
            );

            if (!version) {
                return null;
            }

            return {
                version: version.version,
                appliedAt: version.applied_at,
                configHash: version.config_hash
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Force migration regardless of version check
     */
    async forceMigration(autoImport: boolean = true): Promise<MigrationResult> {
        console.log('⚠️  Forcing migration (bypassing version check)...');

        // Temporarily override needsSchemaUpdate
        const originalNeedsUpdate = this.needsSchemaUpdate.bind(this);
        this.needsSchemaUpdate = async () => true;

        const result = await this.runMigration(autoImport);

        // Restore original method
        this.needsSchemaUpdate = originalNeedsUpdate;

        return result;
    }
}
