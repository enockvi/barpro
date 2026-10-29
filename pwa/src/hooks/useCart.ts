import { useState, useCallback } from 'react';
import type { Product } from '@barpro/core';

export interface CartLine {
  productId: string;
  productName: string;
  qty: number;
  unitPrice: number;
  promoApplied: boolean;
  lineTotal: number;
}

export function useCart(products: Product[]) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const calcLineTotal = useCallback((product: Product, qty: number): { total: number; promoApplied: boolean } => {
    const price = product.sellPrice!;
    const promo = product.promo;
    if (promo && promo.quantity > 0) {
      const groups = Math.floor(qty / promo.quantity);
      const remainder = qty % promo.quantity;
      const total = groups * promo.price + remainder * price;
      return { total, promoApplied: groups > 0 };
    }
    return { total: qty * price, promoApplied: false };
  }, []);

  const addToCart = useCallback((product: Product) => {
    if (!product.sellPrice || (product.stock ?? 0) === 0) return;
    setLines(prev => {
      const existing = prev.find(l => l.productId === product.id);
      if (existing) {
        const newQty = existing.qty + 1;
        const { total } = calcLineTotal(product, newQty);
        return prev.map(l => l.productId === product.id ? { ...l, qty: newQty, lineTotal: total } : l);
      }
      const { total, promoApplied } = calcLineTotal(product, 1);
      return [...prev, {
        productId: product.id,
        productName: product.name,
        qty: 1,
        unitPrice: product.sellPrice!,
        promoApplied,
        lineTotal: total,
      }];
    });
  }, [calcLineTotal]);

  const changeQty = useCallback((productId: string, delta: number) => {
    setLines(prev => {
      return prev.map(l => {
        if (l.productId !== productId) return l;
        const newQty = Math.max(0, l.qty + delta);
        if (newQty === 0) return l;
        const product = products.find(p => p.id === productId);
        if (!product?.sellPrice) return l;
        const { total } = calcLineTotal(product, newQty);
        return { ...l, qty: newQty, lineTotal: total };
      }).filter(l => l.qty > 0);
    });
  }, [products, calcLineTotal]);

  const clearCart = useCallback(() => setLines([]), []);
  const total = lines.reduce((s, l) => s + l.lineTotal, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  return { lines, total, count, toast, showToast, addToCart, changeQty, clearCart };
}
