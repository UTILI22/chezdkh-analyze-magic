
-- 1) Sécuriser order_items : retirer la policy publique d'insertion
-- Les commandes sont créées via la fonction create_order (SECURITY DEFINER),
-- donc le client n'a jamais besoin d'insérer directement.
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

-- 2) Corriger search_path mutable sur les RPC pgmq
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
