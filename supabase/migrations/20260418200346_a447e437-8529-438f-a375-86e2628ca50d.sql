-- Enum for app roles
create type public.app_role as enum ('admin', 'user');

-- Products table
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_cents integer not null default 4000,
  image_url text,
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- User roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function to check role
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Function to count admins (used to know if signup is allowed)
create or replace function public.admin_exists()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.user_roles where role = 'admin')
$$;

-- Orders table
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('QOS-' || to_char(now(), 'YYYYMMDD') || '-' || lpad((floor(random()*10000))::text, 4, '0')),
  customer_first_name text not null,
  customer_last_name text not null,
  customer_email text not null,
  customer_phone text not null,
  country text not null,
  city text,
  postal_code text,
  address text,
  pickup_brussels boolean not null default false,
  shipping_cents integer not null default 0,
  subtotal_cents integer not null default 0,
  total_cents integer not null default 0,
  notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Order items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price_cents integer not null,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.order_items enable row level security;

-- RLS policies

-- Products
create policy "Anyone can view active products"
  on public.products for select
  using (active = true or public.has_role(auth.uid(), 'admin'));

create policy "Admins can insert products"
  on public.products for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update products"
  on public.products for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete products"
  on public.products for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Orders
create policy "Anyone can create orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);

create policy "Admins can view orders"
  on public.orders for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update orders"
  on public.orders for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Order items
create policy "Anyone can create order items"
  on public.order_items for insert
  to anon, authenticated
  with check (true);

create policy "Admins can view order items"
  on public.order_items for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- User roles
create policy "Users can view their own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

-- Trigger: first user becomes admin, others are 'user'
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  has_admin boolean;
begin
  select exists(select 1 from public.user_roles where role = 'admin') into has_admin;
  if not has_admin then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at triggers
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- Seed 8 products
insert into public.products (name, description, price_cents, position) values
  ('Burkini Modèle 1', 'Élégance discrète, pensée pour la pudeur.', 4000, 1),
  ('Burkini Modèle 2', 'Élégance discrète, pensée pour la pudeur.', 4000, 2),
  ('Burkini Modèle 3', 'Élégance discrète, pensée pour la pudeur.', 4000, 3),
  ('Burkini Modèle 4', 'Élégance discrète, pensée pour la pudeur.', 4000, 4),
  ('Burkini Modèle 5', 'Élégance discrète, pensée pour la pudeur.', 4000, 5),
  ('Burkini Modèle 6', 'Élégance discrète, pensée pour la pudeur.', 4000, 6),
  ('Burkini Modèle 7', 'Élégance discrète, pensée pour la pudeur.', 4000, 7),
  ('Burkini Modèle 8', 'Élégance discrète, pensée pour la pudeur.', 4000, 8);