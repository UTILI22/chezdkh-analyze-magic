GRANT INSERT ON public.orders TO anon, authenticated;
GRANT INSERT ON public.order_items TO anon, authenticated;
-- Needed for INSERT ... RETURNING (.select() after .insert() in supabase-js)
GRANT SELECT ON public.orders TO anon, authenticated;