import { LocalDataService } from './localService';
import { SupabaseDataService } from './supabaseService';
import { isSupabaseConfigured } from '../config';
export type { ManagerProductView, OwnerProductView } from './views';
export { toManagerProduct, toOwnerProduct } from './views';

// Choix de l'implémentation : Supabase si configuré, sinon locale
export const dataService = isSupabaseConfigured()
  ? new SupabaseDataService()
  : new LocalDataService();
export { LocalDataService };
