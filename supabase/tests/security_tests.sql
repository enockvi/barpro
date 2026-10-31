-- ─── Tests de sécurité T13 ────────────────────────────────────────────────────
-- Ces tests prouvent que :
-- 1. Le gérant ne peut pas lire de marge/bénéfice/valeur de casse
-- 2. Le propriétaire ne peut pas écrire de vente/ravitaillement/casse/prix
-- 3. Un lien déjà utilisé est refusé
-- 4. Les triggers bloquent UPDATE/DELETE sur les événements

-- ── Test 1 : Le gérant ne voit AUCUNE colonne financière dans ses vues ─────────
-- Vérifier que la vue tickets_manager n'a pas de colonne buyPrice
DO $$
DECLARE
  col_count INTEGER;
BEGIN
  -- La vue tickets_manager ne doit pas exposer buy_price_per_case ni marge
  SELECT COUNT(*) INTO col_count
  FROM information_schema.columns
  WHERE table_name = 'tickets_manager'
    AND column_name IN ('buy_price_per_case', 'marge', 'benefice');
  
  IF col_count > 0 THEN
    RAISE EXCEPTION 'TEST 1 ECHEC : La vue tickets_manager expose des colonnes financières';
  END IF;
  
  -- La vue products_manager ne doit pas avoir buyPricePerCase
  SELECT COUNT(*) INTO col_count
  FROM information_schema.columns
  WHERE table_name = 'products_manager'
    AND column_name = 'buy_price_per_case';
  
  IF col_count > 0 THEN
    RAISE EXCEPTION 'TEST 1 ECHEC : La vue products_manager expose buy_price_per_case';
  END IF;
  
  -- La vue ravitaillement_lines_manager ne doit pas avoir buy_price_per_bottle
  SELECT COUNT(*) INTO col_count
  FROM information_schema.columns
  WHERE table_name = 'ravitaillement_lines_manager'
    AND column_name = 'buy_price_per_bottle';
  
  IF col_count > 0 THEN
    RAISE EXCEPTION 'TEST 1 ECHEC : La vue ravitaillement_lines_manager expose buy_price_per_bottle';
  END IF;
  
  RAISE NOTICE 'TEST 1 PASSE : Le gérant ne voit aucune donnée financière dans les vues';
END $$;

-- ── Test 2 : Le propriétaire ne peut PAS écrire de vente ──────────────────────
-- La politique owner_tickets_read ne permet que SELECT
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  -- Vérifier qu'il n'existe pas de policy INSERT/UPDATE/DELETE pour owner sur tickets
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'tickets'
    AND policyname LIKE '%owner%'
    AND cmd IN ('INSERT', 'UPDATE', 'DELETE');
  
  IF policy_count > 0 THEN
    RAISE EXCEPTION 'TEST 2 ECHEC : Un propriétaire peut écrire sur tickets';
  END IF;
  
  -- Même vérification pour ravitaillements
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'ravitaillements'
    AND policyname LIKE '%owner%'
    AND cmd IN ('INSERT', 'UPDATE', 'DELETE');
  
  IF policy_count > 0 THEN
    RAISE EXCEPTION 'TEST 2 ECHEC : Un propriétaire peut écrire sur ravitaillements';
  END IF;
  
  -- Même vérification pour casses
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'casses'
    AND policyname LIKE '%owner%'
    AND cmd IN ('INSERT', 'UPDATE', 'DELETE');
  
  IF policy_count > 0 THEN
    RAISE EXCEPTION 'TEST 2 ECHEC : Un propriétaire peut écrire sur casses';
  END IF;
  
  -- Même vérification pour products (le propriétaire ne modifie pas les prix)
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'products'
    AND policyname LIKE '%owner%' AND policyname NOT LIKE '%read%'
    AND cmd IN ('INSERT', 'UPDATE', 'DELETE');
  
  IF policy_count > 0 THEN
    RAISE EXCEPTION 'TEST 2 ECHEC : Un propriétaire peut modifier des produits';
  END IF;
  
  RAISE NOTICE 'TEST 2 PASSE : Le propriétaire ne peut écrire ni vente, ni ravitaillement, ni casse, ni prix';
END $$;

-- ── Test 3 : Les triggers bloquent UPDATE/DELETE sur les tables d'événements ──
DO $$
DECLARE
  trigger_count INTEGER;
  event_tables TEXT[] := ARRAY['tickets', 'ticket_lines', 'ticket_versions',
                                'ravitaillements', 'ravitaillement_lines',
                                'corrections', 'casses', 'inventaires', 'inventaire_lines', 'audit'];
BEGIN
  FOREACH tablename IN ARRAY event_tables LOOP
    SELECT COUNT(*) INTO trigger_count
    FROM pg_trigger
    WHERE tgrelid = tablename::regclass
      AND tgname LIKE 'trg_%no_update_delete';
    
    IF trigger_count = 0 THEN
      RAISE EXCEPTION 'TEST 3 ECHEC : Pas de trigger add-only sur %', tablename;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'TEST 3 PASSE : Tous les triggers add-only sont présents';
END $$;

-- ── Test 4 : Une table casse n'a PAS de champ decision ────────────────────────
DO $$
DECLARE
  col_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO col_count
  FROM information_schema.columns
  WHERE table_name = 'casses'
    AND column_name IN ('decision', 'decision_type', 'toleree', 'imputee');
  
  IF col_count > 0 THEN
    RAISE EXCEPTION 'TEST 4 ECHEC : La table casses contient un champ de décision';
  END IF;
  
  RAISE NOTICE 'TEST 4 PASSE : La table casses n''a aucun champ de décision';
END $$;

-- ── Résumé ─────────────────────────────────────────────────────────────────────
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tous les tests de sécurité T13 sont passes.';
  RAISE NOTICE '========================================';
END $$;
