import React from 'react';
import type { Product } from '@barpro/core';
import { productStockStatus, stockStatusLabel } from '@barpro/core';

interface Props {
  product: Product;
  qtyInCart?: number;
  onAdd: () => void;
  onMinus?: () => void;
  onPlus?: () => void;
}

const SIZE_COLORS: Record<string, string> = {
  Petit: '#2F6FEB',
  Grand: '#F28C28',
  Cannette: '#D92D20',
};

const SIZE_LABELS: Record<string, string> = {
  Petit: 'PETIT',
  Grand: 'GRAND',
  Cannette: 'CANNETTE',
};

export const ProductCard = React.memo(function ProductCard({ product, qtyInCart = 0, onAdd, onMinus, onPlus }: Props) {
  const stock = product.stock ?? 0;
  const stk = productStockStatus(stock, product.bottlesPerCase);
  const sl = stockStatusLabel(stk, stock);
  const sellable = product.sellPrice !== null && stock > 0;
  const hasPromo = product.promo !== null;

  return (
    <button
      onClick={onAdd}
      disabled={!sellable}
      className={[
        'relative flex flex-col bg-white rounded-[24px] border border-limeSoft shadow-soft overflow-hidden text-left transition-transform duration-150 active:scale-[0.97]',
        !sellable && 'opacity-50 cursor-not-allowed pointer-events-none',
      ].filter(Boolean).join(' ')}
    >
      {/* Zone photo */}
      <div className="relative h-24 bg-paper rounded-t-[24px] overflow-hidden flex items-center justify-center">
        {product.photoPath ? (
          <img
            src={`/${product.photoPath}`}
            alt={product.name}
            className="w-16 h-20 object-contain rounded-lg"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="w-16 h-20 rounded-xl flex items-center justify-center text-3xl" style={{ backgroundColor: product.tile || '#E9EEE9' }}>
            🍾
          </div>
        )}

        {/* Ruban diagonal */}
        {product.size && (
          <div
            className="absolute top-0 left-0 z-10 font-bold text-[11px] tracking-[.12em] uppercase px-3 py-1"
            style={{
              background: SIZE_COLORS[product.size] || '#888',
              color: product.size === 'Grand' ? '#0B3322' : '#fff',
              transform: 'rotate(-45deg) translate(-14px, 14px)',
              transformOrigin: 'top left',
              clipPath: 'inset(0 0 100% 0)',
            }}
          >
            {SIZE_LABELS[product.size]}
          </div>
        )}

        {/* Pastille d'état */}
        <div className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center ${
          stk === 'ok' ? 'bg-limeSoft' : stk === 'low' ? 'bg-amber-100 animate-pulse' : 'bg-red-100'
        }`}>
          {stk === 'ok' && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B3322" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7" />
            </svg>
          )}
          {stk === 'low' && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A5300" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v5M12 17h.01" />
              <path d="M10.3 3.9L2.5 17.5A2 2 0 0 0 4.2 20.5h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
            </svg>
          )}
          {stk === 'out' && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A2A1E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M9 9l6 6M15 9l-6 6" />
            </svg>
          )}
        </div>

        {/* Badge quantité panier */}
        {qtyInCart > 0 && (
          <div className="absolute bottom-2 right-2 bg-forest text-citron font-mono font-bold text-xs rounded-full flex items-center gap-1 px-2 py-1 min-w-[30px] h-7">
            {qtyInCart}
            {onMinus && <span onClick={(e) => { e.stopPropagation(); onMinus(); }} className="w-5 h-5 grid place-items-center rounded-full bg-white/14 text-white text-sm cursor-pointer">−</span>}
            {onPlus && <span onClick={(e) => { e.stopPropagation(); onPlus(); }} className="w-5 h-5 grid place-items-center rounded-full bg-white/14 text-white text-sm cursor-pointer">+</span>}
          </div>
        )}
      </div>

      {/* Corps */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <div className="font-bold text-sm leading-snug text-forest-deep text-center line-clamp-2 min-h-[34px]">
          {product.name}
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral">
            {product.size || product.format}
          </span>
          <div className="text-right">
            <span className="font-mono text-sm font-semibold text-forest-deep">
              {product.sellPrice ? `${product.sellPrice.toLocaleString('fr-FR')} F` : <span className="text-alert text-xs">Prix à renseigner</span>}
            </span>
            {hasPromo && (
              <div className="text-[10px] text-sous-bois font-semibold">
                {product.promo!.quantity} pour {product.promo!.price.toLocaleString('fr-FR')} F
              </div>
            )}
          </div>
        </div>

        <div className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full self-center mt-1 ${
          stk === 'ok' ? 'bg-limeSoft text-forest-deep' :
          stk === 'low' ? 'bg-amber-100 text-amber-700' :
          'bg-red-100 text-red-700'
        }`}>
          {stk === 'ok' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12l5 5L20 7" /></svg>}
          {stk === 'low' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 8v5M12 17h.01" /><path d="M10.3 3.9L2.5 17.5A2 2 0 0 0 4.2 20.5h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg>}
          {stk === 'out' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>}
          {sl.label}
        </div>

        <div className="h-px bg-line my-1" />

        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-forest-deep flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M9 4h6v4l2 4v8H7v-8l2-4z" /></svg>
            {stock} b.
          </span>
          <span className="text-neutral">
            {Math.floor(stock / product.bottlesPerCase)} casier{Math.floor(stock / product.bottlesPerCase) > 1 ? 's' : ''}
            {stock % product.bottlesPerCase > 0 && ` + ${stock % product.bottlesPerCase} b.`}
          </span>
        </div>
      </div>
    </button>
  );
});
