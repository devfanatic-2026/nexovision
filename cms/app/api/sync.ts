import { json, error } from '@float.js/core';
import { container } from '../../src/lib/di/container.js';
import { SyncService } from '../../src/lib/services/sync.service.js';

export const POST = async () => {
    try {
        const syncService = container.resolve<SyncService>('SyncService');
        const result = await syncService.runSync();

        if (result.success) {
            return json(result);
        } else {
            return error(result.message, 500);
        }
    } catch (err: any) {
        return error(err.message, 500);
    }
};
