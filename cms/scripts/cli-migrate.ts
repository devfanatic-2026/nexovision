#!/usr/bin/env node
import { config } from 'dotenv';
config(); // Load environment variables

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { MigrationRunner } from '../src/lib/migrations/MigrationRunner.js';

/**
 * CLI tool for database migrations
 * Usage:
 *   pnpm migrate              - Run migration (recreate schema)
 *   pnpm migrate --no-import  - Run migration without auto-import
 *   pnpm migrate --force      - Force migration even if schema is up to date
 */
async function main() {
    const args = process.argv.slice(2);
    const noImport = args.includes('--no-import');
    const force = args.includes('--force');
    const statusOnly = args.includes('--status');

    try {
        // Open database connection
        const dbPath = process.env.DB_FILE || './db/cms.sqlite';
        console.log(`📁 Database: ${dbPath}\n`);

        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        const runner = new MigrationRunner(db);

        if (statusOnly) {
            // Show current schema version
            const version = await runner.getSchemaVersion();

            if (version) {
                console.log('Current schema version:');
                console.log(`  Version: ${version.version}`);
                console.log(`  Applied at: ${version.appliedAt}`);
                console.log(`  Config hash: ${version.configHash.substring(0, 16)}...`);
            } else {
                console.log('No schema version found (database may be empty)');
            }

            await db.close();
            return;
        }

        // Run migration
        const result = force
            ? await runner.forceMigration(!noImport)
            : await runner.runMigration(!noImport);

        if (result.success) {
            console.log('\n✅ ' + result.message);

            if (result.appliedAt) {
                console.log(`   Applied at: ${result.appliedAt}`);
            }

            if (!noImport) {
                console.log('\n💡 Next step: Run import to populate data');
                console.log('   pnpm import:data');
            }

            await db.close();
            process.exit(0);
        } else {
            console.error('\n❌ ' + result.message);
            await db.close();
            process.exit(1);
        }

    } catch (error: any) {
        console.error('❌ Migration error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

main();
