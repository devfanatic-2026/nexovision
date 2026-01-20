import { f, typedRoute, json } from '@float.js/core';
import { container } from '../../../src/lib/di/container.js';
import { SyncService } from '../../../src/lib/services/sync.service.js';

export const POST = typedRoute({
  body: f.object({})
}, async (req) => {
  const syncService = container.resolve<SyncService>('SyncService');
  const result = await syncService.runSync();

  if (result.success) {
    return json(result);
  } else {
    return json({ error: result.message }, { status: 500 });
  }
});