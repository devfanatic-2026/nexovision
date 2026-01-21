#!/usr/bin/env node
import { config } from 'dotenv';
config(); // Load environment variables

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { MarkdownImportService } from '../src/lib/services/MarkdownImportService.js';

/**
 * CLI tool for importing markdown files into database
 * Usage:
 *   pnpm import                    - Import from CONTENT_SOURCE_DIR
 *   pnpm import --dir=/path/to/md  - Import from specific directory
 */
async function main() {
    const args = process.argv.slice(2);

    // Parse arguments
    let contentDir = process.env.CONTENT_SOURCE_DIR || '../sitio/content';

    for (const arg of args) {
        if (arg.startsWith('--dir=')) {
            contentDir = arg.replace('--dir=', '');
        }
    }

    try {
        // Open database connection
        const dbPath = process.env.DB_FILE || './db/cms.sqlite';
        console.log(`📁 Database: ${dbPath}`);
        console.log(`📂 Content source: ${contentDir}\n`);

        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        // Enable foreign keys
        await db.exec('PRAGMA foreign_keys = ON;');

        // Create import service
        const importer = new MarkdownImportService(db, contentDir);

        // Run import
        console.log('🚀 Starting import...');
        const summary = await importer.importAll();

        // Display results
        console.log('\n' + '='.repeat(50));
        console.log('📊 Import Summary');
        console.log('='.repeat(50));

        for (const result of summary.results) {
            console.log(`\n${result.entity}:`);
            console.log(`  ✓ Created: ${result.created}`);
            console.log(`  ↻ Updated: ${result.updated}`);

            if (result.errors.length > 0) {
                console.log(`  ✗ Errors: ${result.errors.length}`);
                for (const error of result.errors.slice(0, 5)) {
                    console.log(`    - ${error.file}: ${error.error}`);
                }
                if (result.errors.length > 5) {
                    console.log(`    ... and ${result.errors.length - 5} more errors`);
                }
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log(`Total created: ${summary.totalCreated}`);
        console.log(`Total updated: ${summary.totalUpdated}`);
        console.log(`Total errors: ${summary.totalErrors}`);
        console.log('='.repeat(50) + '\n');

        await db.close();

        if (summary.success) {
            console.log('✅ Import completed successfully');
            process.exit(0);
        } else {
            console.log('⚠️  Import completed with errors');
            process.exit(1);
        }

    } catch (error: any) {
        console.error('❌ Import error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

main();
