-- Fix search_path on existing functions
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tighten insert policies (require non-empty essential fields)
drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
  on public.orders for insert
  to anon, authenticated
  with check (
    length(customer_first_name) > 0
    and length(customer_last_name) > 0
    and length(customer_email) > 3
    and length(customer_phone) > 3
    and length(country) > 0
    and total_cents >= 0
  );

drop policy if exists "Anyone can create order items" on public.order_items;
create policy "Anyone can create order items"
  on public.order_items for insert
  to anon, authenticated
  with check (
    length(product_name) > 0
    and unit_price_cents >= 0
    and quantity > 0
  );