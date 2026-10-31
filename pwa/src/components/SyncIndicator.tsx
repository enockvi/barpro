import { useSyncStatus } from '../hooks/useSyncStatus';

export function SyncIndicator() {
  const { connected, pendingCount, lastSyncAt } = useSyncStatus();

  if (pendingCount > 0 && !connected) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-error">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>{pendingCount} en attente</span>
      </div>
    );
  }

  if (pendingCount > 0) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-alert">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
        <span>{pendingCount} en attente</span>
      </div>
    );
  }

  const lastSyncText = lastSyncAt
    ? new Date(lastSyncAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : 'Jamais';

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-sous-bois">
      <span className="w-2 h-2 rounded-full bg-citron inline-block" />
      <span>Synchronisé · {lastSyncText}</span>
    </div>
  );
}
