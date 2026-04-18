CREATE OR REPLACE FUNCTION public.create_order(
  _first_name text,
  _last_name text,
  _email text,
  _phone text,
  _country text,
  _city text,
  _postal text,
  _address text,
  _pickup boolean,
  _shipping_cents integer,
  _subtotal_cents integer,
  _total_cents integer,
  _notes text,
  _items jsonb
)
RETURNS TABLE(id uuid, order_number text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_order_id uuid;
  new_order_number text;
BEGIN
  -- Validation
  IF length(coalesce(_first_name,'')) < 1 OR length(coalesce(_last_name,'')) < 1
     OR length(coalesce(_email,'')) < 3 OR length(coalesce(_phone,'')) < 3
     OR length(coalesce(_country,'')) < 1 OR coalesce(_total_cents,0) < 0 THEN
    RAISE EXCEPTION 'Invalid order payload';
  END IF;

  IF _items IS NULL OR jsonb_array_length(_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  INSERT INTO public.orders (
    customer_first_name, customer_last_name, customer_email, customer_phone,
    country, city, postal_code, address, pickup_brussels,
    shipping_cents, subtotal_cents, total_cents, notes, status
  ) VALUES (
    _first_name, _last_name, _email, _phone,
    _country, NULLIF(_city,''), NULLIF(_postal,''), NULLIF(_address,''), coalesce(_pickup,false),
    coalesce(_shipping_cents,0), coalesce(_subtotal_cents,0), coalesce(_total_cents,0),
    NULLIF(_notes,''), 'pending'
  )
  RETURNING orders.id, orders.order_number INTO new_order_id, new_order_number;

  INSERT INTO public.order_items (order_id, product_id, product_name, unit_price_cents, quantity)
  SELECT
    new_order_id,
    NULLIF(item->>'product_id','')::uuid,
    item->>'product_name',
    (item->>'unit_price_cents')::int,
    (item->>'quantity')::int
  FROM jsonb_array_elements(_items) AS item;

  RETURN QUERY SELECT new_order_id, new_order_number;
END;
$$;

REVOKE ALL ON FUNCTION public.create_order(text,text,text,text,text,text,text,text,boolean,integer,integer,integer,text,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(text,text,text,text,text,text,text,text,boolean,integer,integer,integer,text,jsonb) TO anon, authenticated;