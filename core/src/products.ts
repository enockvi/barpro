// ─── Types produits ───────────────────────────────────────────────────────────

import type { Promo } from './index';

export interface Product {
  id: string;
  name: string;
  category: string;
  format: string;
  size: 'Petit' | 'Grand' | 'Cannette' | '';
  bottlesPerCase: number;
  buyPricePerCase: number;
  sellPrice: number | null;
  promo: Promo | null;
  alertThreshold: number;
  active: boolean;
  photoPath?: string;
  driveFileId?: string;
}

export interface ManagerProduct extends Omit<Product, 'buyPricePerCase'> {}
export type OwnerProduct = Product;

// ─── Fonctions pures ──────────────────────────────────────────────────────────

export function effectiveSellPrice(product: Product, qty: number): number | null {
  if (!product.sellPrice) return null;
  if (!product.promo || product.promo.quantity <= 0) return product.sellPrice;
  const groups = Math.floor(qty / product.promo.quantity);
  const remainder = qty % product.promo.quantity;
  const total = groups * product.promo.price + remainder * product.sellPrice;
  return Math.round(total / qty);
}

export function isSellable(product: Product): boolean {
  return product.active && product.sellPrice !== null && product.sellPrice > 0;
}

export type StockStatus = 'ok' | 'low' | 'out';

export function productStockStatus(bottles: number, bottlesPerCase: number): StockStatus {
  if (bottles === 0) return 'out';
  if (bottles < bottlesPerCase) return 'low';
  return 'ok';
}

export function stockStatusLabel(status: StockStatus, bottles: number): { label: string; cls: string } {
  if (status === 'ok') return { label: 'En stock', cls: 'ok' };
  if (status === 'low') return { label: `Plus que ${bottles}`, cls: 'low' };
  return { label: 'Épuisé', cls: 'out' };
}

// ─── Catalogue complet (45 boissons depuis boissons/) ─────────────────────────

export const FULL_CATALOG: Product[] = [
  // BIÈRES Grand
  { id:'beaufort-g',  name:'Beaufort',        format:'65 cl', size:'Grand',  category:'Bières',      bottlesPerCase:12, buyPricePerCase:8100, sellPrice:800,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Grand/BEAUFORT.jpg' },
  { id:'benin-g',     name:'La Béninoise',    format:'65 cl', size:'Grand',  category:'Bières',      bottlesPerCase:12, buyPricePerCase:7800, sellPrice:700,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Grand/BENINOISE.jpg' },
  { id:'castel-g',    name:'Castel',          format:'65 cl', size:'Grand',  category:'Bières',      bottlesPerCase:12, buyPricePerCase:8400, sellPrice:800,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Grand/CASTEL BIERE.jpg' },
  { id:'doppel-g',    name:'Doppel Munich',   format:'65 cl', size:'Grand',  category:'Bières',      bottlesPerCase:12, buyPricePerCase:9000, sellPrice:900,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Grand/DOPPEL MUNICH.jpg' },
  { id:'flag-g',      name:'Flag',            format:'65 cl', size:'Grand',  category:'Bières',      bottlesPerCase:12, buyPricePerCase:7500, sellPrice:750,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Grand/FLAG.jpg' },
  { id:'hagbe-g',     name:'Hagbé',           format:'65 cl', size:'Grand',  category:'Bières',      bottlesPerCase:12, buyPricePerCase:8400, sellPrice:800,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Grand/HAGBE.jpg' },
  { id:'kankpe-g',    name:'Kankpé',          format:'65 cl', size:'Grand',  category:'Bières',      bottlesPerCase:12, buyPricePerCase:7800, sellPrice:650,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Grand/Kankpe.jpg' },
  { id:'pils-g',      name:'Pils',            format:'65 cl', size:'Grand',  category:'Bières',      bottlesPerCase:12, buyPricePerCase:8400, sellPrice:800,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Grand/PILS.jpg' },
  { id:'racines-g',   name:'Racines',         format:'65 cl', size:'Grand',  category:'Bières',      bottlesPerCase:12, buyPricePerCase:8100, sellPrice:750,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Grand/RACINES-.jpg' },
  // BIÈRES Petit
  { id:'beaufort-p',  name:'Beaufort',        format:'33 cl', size:'Petit',  category:'Bières',      bottlesPerCase:24, buyPricePerCase:9600, sellPrice:500,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Petit/BEAUFORT.jpg' },
  { id:'benin-p',     name:'La Béninoise',    format:'33 cl', size:'Petit',  category:'Bières',      bottlesPerCase:24, buyPricePerCase:9600, sellPrice:450,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Petit/BENINOISE.jpg' },
  { id:'desperado-p', name:'Desperados',      format:'33 cl', size:'Petit',  category:'Bières',      bottlesPerCase:24, buyPricePerCase:10800,sellPrice:600,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Petit/DESPERADO.jpg' },
  { id:'eku-p',       name:'Eku',             format:'33 cl', size:'Petit',  category:'Bières',      bottlesPerCase:24, buyPricePerCase:10800,sellPrice:550,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Petit/EKU.jpg' },
  { id:'guiness-p',   name:'Guinness',        format:'33 cl', size:'Petit',  category:'Bières',      bottlesPerCase:24, buyPricePerCase:14400,sellPrice:700,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Petit/GUINESS.jpg' },
  { id:'hagbe-p',     name:'Hagbé',           format:'33 cl', size:'Petit',  category:'Bières',      bottlesPerCase:24, buyPricePerCase:9600, sellPrice:500,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Petit/HAGBE.jpg' },
  { id:'heineken-p',  name:'Heineken',        format:'33 cl', size:'Petit',  category:'Bières',      bottlesPerCase:24, buyPricePerCase:14400,sellPrice:800,  promo:{quantity:3,price:2000},alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Petit/HEINEKEN.jpg' },
  { id:'kankpe-p',    name:'Kankpé',          format:'33 cl', size:'Petit',  category:'Bières',      bottlesPerCase:24, buyPricePerCase:9600, sellPrice:450,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Petit/Kankpe.jpg' },
  { id:'pils-p',      name:'Pils',            format:'33 cl', size:'Petit',  category:'Bières',      bottlesPerCase:24, buyPricePerCase:9600, sellPrice:500,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Petit/PILS.jpg' },
  { id:'racines-p',   name:'Racines',         format:'33 cl', size:'Petit',  category:'Bières',      bottlesPerCase:24, buyPricePerCase:9600, sellPrice:480,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Petit/RACINES-.jpg' },
  { id:'savana-p',    name:'Savana',          format:'33 cl', size:'Petit',  category:'Bières',      bottlesPerCase:24, buyPricePerCase:7200, sellPrice:400,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Petit/SAVANA.jpg' },
  { id:'sombreros-p', name:'Sombreros',       format:'33 cl', size:'Petit',  category:'Bières',      bottlesPerCase:24, buyPricePerCase:10800,sellPrice:550,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Petit/SOMBREROS.jpg' },
  { id:'valmont-p',   name:'Valmont',         format:'33 cl', size:'Petit',  category:'Bières',      bottlesPerCase:24, buyPricePerCase:9600, sellPrice:480,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Petit/VALMONT.jpg' },
  // BIÈRES Cannettes
  { id:'beaufort-c',  name:'Beaufort',        format:'33 cl', size:'Cannette',category:'Bières',     bottlesPerCase:24, buyPricePerCase:9600, sellPrice:550,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Cannettes/BEAUFORT CANNETTE.jpg' },
  { id:'benin-c',     name:'La Béninoise',    format:'33 cl', size:'Cannette',category:'Bières',     bottlesPerCase:24, buyPricePerCase:9600, sellPrice:500,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Cannettes/BENINOISE CANNETTES.jpg' },
  { id:'legend-c',    name:'Legend',          format:'33 cl', size:'Cannette',category:'Bières',     bottlesPerCase:24, buyPricePerCase:10800,sellPrice:650,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Cannettes/CANNETTE LEGEND.jpg' },
  { id:'star-c',      name:'Star',            format:'33 cl', size:'Cannette',category:'Bières',     bottlesPerCase:24, buyPricePerCase:10800,sellPrice:600,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Cannettes/CANNETTE STAR.jpg' },
  { id:'chill-c',     name:'Chill Citron',    format:'33 cl', size:'Cannette',category:'Bières',     bottlesPerCase:24, buyPricePerCase:9600, sellPrice:500,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Cannettes/Chill citron.jpg' },
  { id:'desperado-c', name:'Desperados',      format:'33 cl', size:'Cannette',category:'Bières',     bottlesPerCase:24, buyPricePerCase:10800,sellPrice:650,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Cannettes/DESPERADO CANNETTES.jpg' },
  { id:'vody-c',      name:'Vody Vodka',      format:'50 cl', size:'Cannette',category:'Bières',     bottlesPerCase:12, buyPricePerCase:9600, sellPrice:900,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Cannettes/VODY VADKA.jpg' },
  { id:'pils-c',      name:'Pils',            format:'33 cl', size:'Cannette',category:'Bières',     bottlesPerCase:24, buyPricePerCase:9600, sellPrice:500,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/BIERES/Cannettes/cannettes pils.jpg' },
  // EAUX MINÉRALES
  { id:'comtesse',    name:'Comtesse',        format:'50 cl', size:'',       category:'Eaux minérales',bottlesPerCase:12, buyPricePerCase:2400, sellPrice:300,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/EAUX MINÉRALES/COMTESSE.jpg' },
  { id:'fifa',        name:'Fifa',            format:'50 cl', size:'',       category:'Eaux minérales',bottlesPerCase:12, buyPricePerCase:2400, sellPrice:250,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/EAUX MINÉRALES/FIFA.jpg' },
  { id:'kwabo',       name:'Kwabo',           format:'50 cl', size:'',       category:'Eaux minérales',bottlesPerCase:12, buyPricePerCase:2400, sellPrice:280,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/EAUX MINÉRALES/KWABO.jpg' },
  { id:'possotome',   name:'Possotomè',       format:'50 cl', size:'',       category:'Eaux minérales',bottlesPerCase:12, buyPricePerCase:2400, sellPrice:300,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/EAUX MINÉRALES/POSSOTOME.jpg' },
  // SUCRERIES Grand
  { id:'moka-g',      name:'Moka',            format:'33 cl', size:'Grand',  category:'Sucreries',    bottlesPerCase:24, buyPricePerCase:5760, sellPrice:400,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/SUCRERIES/Grand/MOKA.jpg' },
  { id:'wordcola-g',  name:'Word Cola',       format:'33 cl', size:'Grand',  category:'Sucreries',    bottlesPerCase:24, buyPricePerCase:5760, sellPrice:400,  promo:{quantity:3,price:1000},alertThreshold:1, active:true,  photoPath:'boissons/SUCRERIES/Grand/WORD COLA.jpg' },
  { id:'youki-g',     name:'Youki Plamplemousse',format:'33 cl',size:'Grand',category:'Sucreries',   bottlesPerCase:24, buyPricePerCase:5760, sellPrice:400,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/SUCRERIES/Grand/YOUKI PLAMPLEMOUSSE.jpg' },
  { id:'youzou-g',    name:'Youzou',          format:'33 cl', size:'Grand',  category:'Sucreries',    bottlesPerCase:24, buyPricePerCase:5520, sellPrice:350,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/SUCRERIES/Grand/YOUZOU.jpg' },
  // SUCRERIES Petit
  { id:'chill-p',     name:'Chill Citron',    format:'33 cl', size:'Petit',  category:'Sucreries',    bottlesPerCase:24, buyPricePerCase:5760, sellPrice:350,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/SUCRERIES/Petit/CHILL-CITRON.jpg' },
  { id:'doppel-p',    name:'Doppel Energy Malt',format:'33 cl',size:'Petit', category:'Sucreries',   bottlesPerCase:24, buyPricePerCase:7200, sellPrice:500,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/SUCRERIES/Petit/DOPPEL-ENERGY-MALT.jpg' },
  { id:'moka-p',      name:'Moka',            format:'33 cl', size:'Petit',  category:'Sucreries',    bottlesPerCase:24, buyPricePerCase:5760, sellPrice:350,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/SUCRERIES/Petit/MOKA.jpg' },
  { id:'wordcola-p',  name:'Word Cola',       format:'33 cl', size:'Petit',  category:'Sucreries',    bottlesPerCase:24, buyPricePerCase:5760, sellPrice:350,  promo:{quantity:3,price:900}, alertThreshold:1, active:true,  photoPath:'boissons/SUCRERIES/Petit/WORD COLA.jpg' },
  { id:'xxl-p',       name:'XXL',             format:'33 cl', size:'Petit',  category:'Sucreries',    bottlesPerCase:24, buyPricePerCase:6000, sellPrice:400,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/SUCRERIES/Petit/XXL.jpg' },
  { id:'youki-p',     name:'Youki Plamplemousse',format:'33 cl',size:'Petit',category:'Sucreries',   bottlesPerCase:24, buyPricePerCase:5760, sellPrice:350,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/SUCRERIES/Petit/YOUKI PLAMPLEMOUSSE.jpg' },
  { id:'youzou-p',    name:'Youzou',          format:'33 cl', size:'Petit',  category:'Sucreries',    bottlesPerCase:24, buyPricePerCase:5520, sellPrice:300,  promo:null,   alertThreshold:1, active:true,  photoPath:'boissons/SUCRERIES/Petit/YOUZOU.jpg' },
];

export function getInitialProducts(): Product[] {
  return FULL_CATALOG.map(p => ({ ...p }));
}
