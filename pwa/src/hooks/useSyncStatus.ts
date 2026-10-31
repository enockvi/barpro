import { useState, useEffect, useCallback } from 'react';
import { dataService } from '../db';
import type { SyncStatus } from '@barpro/core';

export function useSyncStatus(): SyncStatus {
  const [status, setStatus] = useState<SyncStatus>({ connected: true, pendingCount: 0, lastSyncAt: null });

  const refresh = useCallback(async () => {
    const s = await dataService.getSyncStatus();
    setStatus(s);
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  return status;
}
