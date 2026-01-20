import { config } from 'dotenv';
config(); // Load environment variables from .env file

import { container } from '../src/lib/di/container.js';
import { SyncService } from '../src/lib/services/sync.service.js';

async function main() {
    const syncService = await container.resolve<SyncService>('SyncService');
    const result = await syncService.runSync();

    if (result.success) {
        console.log('✅ ' + result.message);
        process.exit(0);
    } else {
        console.error('❌ ' + result.message);
        process.exit(1);
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
