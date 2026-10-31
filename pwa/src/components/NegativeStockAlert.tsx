import type { Product } from '@barpro/core';

interface NegativeStockAlertProps {
  products: Product[];
  onDismiss: () => void;
}

export function NegativeStockAlert({ products, onDismiss }: NegativeStockAlertProps) {
  const negativeProducts = products.filter((p) => (p.stock ?? 0) < 0);

  if (negativeProducts.length === 0) return null;

  return (
    <div className="mx-4 mt-3 bg-error/10 border border-error/30 rounded-xl p-3 flex items-start gap-3">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-error">
          Stock négatif : {negativeProducts.length} produit{negativeProducts.length > 1 ? 's' : ''}
        </p>
        <p className="text-xs text-neutral mt-0.5 truncate">
          {negativeProducts.map((p) => p.name).slice(0, 3).join(' · ')}
          {negativeProducts.length > 3 ? ' …' : ''}
        </p>
      </div>
      <button onClick={onDismiss} className="text-neutral hover:text-forest shrink-0" aria-label="Fermer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
