-- Allow public (unauthenticated) order creation
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

CREATE POLICY "Public can create orders"
ON public.orders
FOR INSERT
TO public, anon, authenticated
WITH CHECK (
  (length(customer_first_name) > 0)
  AND (length(customer_last_name) > 0)
  AND (length(customer_email) > 3)
  AND (length(customer_phone) > 3)
  AND (length(country) > 0)
  AND (total_cents >= 0)
);

CREATE POLICY "Public can create order items"
ON public.order_items
FOR INSERT
TO public, anon, authenticated
WITH CHECK (
  (length(product_name) > 0)
  AND (unit_price_cents >= 0)
  AND (quantity > 0)
);

-- Allow public to read their freshly created order by id (so we can navigate to /thank-you/$id)
CREATE POLICY "Public can read order by id"
ON public.orders
FOR SELECT
TO public, anon, authenticated
USING (true);