create extension if not exists pgcrypto;

create table if not exists public.roles (
  id text primary key,
  name text not null
);

insert into public.roles (id,name)
values ('user','Cliente'),('admin','Administrador')
on conflict (id) do nothing;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  phone_secondary text,
  avatar text,
  birth_date text,
  gender text,
  preferred_neighborhood text,
  bio text,
  points integer not null default 0,
  points_to_next_level integer not null default 1000,
  next_level_points integer not null default 1000,
  level text not null default 'FAMINTO NOVATO',
  role_id text not null default 'user' references public.roles(id),
  created_at bigint not null default (extract(epoch from now()) * 1000)::bigint
);

create table if not exists public.user_addresses (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  label text not null,
  address text not null,
  reference text,
  is_default boolean not null default false
);

create table if not exists public.user_dietary_preferences (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  preference text not null
);

create table if not exists public.categories (
  id text primary key,
  name text not null
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  description text not null,
  price numeric not null,
  promotional_price numeric,
  category_id text not null references public.categories(id),
  image text not null,
  rating numeric not null default 5.0,
  sales_count integer not null default 0,
  tags text[] not null default '{}',
  ingredients text[] not null default '{}',
  is_available boolean not null default true,
  is_featured boolean not null default false
);

create table if not exists public.product_tags (
  id text primary key,
  name text not null
);

create table if not exists public.product_product_tags (
  product_id text not null references public.products(id) on delete cascade,
  tag_id text not null references public.product_tags(id) on delete cascade,
  primary key (product_id,tag_id)
);

create table if not exists public.product_ingredients (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  ingredient text not null
);

create table if not exists public.product_extra_options (
  id text primary key,
  name text not null,
  price numeric not null,
  category text not null
);

create table if not exists public.stores (
  id text primary key,
  name text not null,
  neighborhood text not null,
  city text not null,
  address text not null,
  reference text,
  phone text not null,
  whatsapp text,
  hours text not null,
  is_open boolean not null default true,
  latitude numeric not null,
  longitude numeric not null,
  image text not null
);

create table if not exists public.coupons (
  id text primary key,
  code text not null unique,
  discount_type text not null,
  discount_value numeric not null,
  min_order_value numeric not null default 0,
  description text not null,
  expires_at text not null
);

create table if not exists public.badges (
  id text primary key,
  name text not null,
  icon text not null,
  description text not null
);

create table if not exists public.user_badges (
  id text primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  badge_id text not null references public.badges(id) on delete cascade,
  is_unlocked boolean not null default false,
  unlocked_at text,
  unique (user_id,badge_id)
);

create table if not exists public.orders (
  id text primary key,
  order_number text not null unique,
  user_id uuid not null references public.users(id) on delete cascade,
  subtotal numeric not null,
  delivery_fee numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null,
  status text not null default 'Pendente',
  payment_method text not null,
  created_at bigint not null default (extract(epoch from now()) * 1000)::bigint
);

create table if not exists public.order_items (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  quantity integer not null default 1,
  total_price numeric not null
);

create table if not exists public.order_item_extras (
  id text primary key,
  order_item_id text not null references public.order_items(id) on delete cascade,
  name text not null,
  price numeric not null
);

create table if not exists public.order_item_customizations (
  id text primary key,
  order_item_id text not null references public.order_items(id) on delete cascade,
  bread text,
  meat text,
  cheese text
);

create table if not exists public.order_delivery_addresses (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  name text not null,
  phone text not null,
  address text not null,
  reference text
);

create table if not exists public.order_payments (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  payment_method text not null,
  entity text,
  reference text,
  expiry_date text,
  phone text,
  paid_at text
);

create table if not exists public.payments (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  provider text not null default 'AppyPay',
  payment_method text not null,
  transaction_id text,
  merchant_transaction_id text,
  amount numeric not null,
  currency text not null default 'AOA',
  status text not null default 'pending',
  raw_response jsonb,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null references public.users(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id,product_id)
);

create table if not exists public.notifications (
  id text primary key,
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  message text not null,
  read boolean not null default false,
  type text,
  order_id text references public.orders(id) on delete set null,
  link text,
  action_label text,
  created_at bigint not null default (extract(epoch from now()) * 1000)::bigint
);

alter table public.roles enable row level security;
alter table public.users enable row level security;
alter table public.user_addresses enable row level security;
alter table public.user_dietary_preferences enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_tags enable row level security;
alter table public.product_product_tags enable row level security;
alter table public.product_ingredients enable row level security;
alter table public.product_extra_options enable row level security;
alter table public.stores enable row level security;
alter table public.coupons enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_item_extras enable row level security;
alter table public.order_item_customizations enable row level security;
alter table public.order_delivery_addresses enable row level security;
alter table public.order_payments enable row level security;
alter table public.payments enable row level security;
alter table public.favorites enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Roles are viewable by everyone" on public.roles;
create policy "Roles are viewable by everyone"
on public.roles
for select
using (true);

drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone"
on public.categories
for select
using (true);

drop policy if exists "Products are viewable by everyone" on public.products;
create policy "Products are viewable by everyone"
on public.products
for select
using (true);

drop policy if exists "Product tags are viewable by everyone" on public.product_tags;
create policy "Product tags are viewable by everyone"
on public.product_tags
for select
using (true);

drop policy if exists "Product product tags are viewable by everyone" on public.product_product_tags;
create policy "Product product tags are viewable by everyone"
on public.product_product_tags
for select
using (true);

drop policy if exists "Product ingredients are viewable by everyone" on public.product_ingredients;
create policy "Product ingredients are viewable by everyone"
on public.product_ingredients
for select
using (true);

drop policy if exists "Product extra options are viewable by everyone" on public.product_extra_options;
create policy "Product extra options are viewable by everyone"
on public.product_extra_options
for select
using (true);

drop policy if exists "Stores are viewable by everyone" on public.stores;
create policy "Stores are viewable by everyone"
on public.stores
for select
using (true);

drop policy if exists "Coupons are viewable by everyone" on public.coupons;
create policy "Coupons are viewable by everyone"
on public.coupons
for select
using (true);

drop policy if exists "Badges are viewable by everyone" on public.badges;
create policy "Badges are viewable by everyone"
on public.badges
for select
using (true);

drop policy if exists "Users can view own profile" on public.users;
create policy "Users can view own profile"
on public.users
for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
on public.users
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.users;
create policy "Users can insert own profile"
on public.users
for insert
with check (auth.uid() = id);

drop policy if exists "Users can view own addresses" on public.user_addresses;
create policy "Users can view own addresses"
on public.user_addresses
for select
using (auth.uid() = user_id);

drop policy if exists "Users can manage own addresses" on public.user_addresses;
create policy "Users can manage own addresses"
on public.user_addresses
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can view own dietary preferences" on public.user_dietary_preferences;
create policy "Users can view own dietary preferences"
on public.user_dietary_preferences
for select
using (auth.uid() = user_id);

drop policy if exists "Users can manage own dietary preferences" on public.user_dietary_preferences;
create policy "Users can manage own dietary preferences"
on public.user_dietary_preferences
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can view own badges" on public.user_badges;
create policy "Users can view own badges"
on public.user_badges
for select
using (auth.uid() = user_id);

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
on public.orders
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own orders" on public.orders;
create policy "Users can insert own orders"
on public.orders
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can view own order items" on public.order_items;
create policy "Users can view own order items"
on public.order_items
for select
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
    and orders.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert own order items" on public.order_items;
create policy "Users can insert own order items"
on public.order_items
for insert
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
    and orders.user_id = auth.uid()
  )
);

drop policy if exists "Users can view own order item extras" on public.order_item_extras;
create policy "Users can view own order item extras"
on public.order_item_extras
for select
using (
  exists (
    select 1
    from public.order_items
    join public.orders on orders.id = order_items.order_id
    where order_items.id = order_item_extras.order_item_id
    and orders.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert own order item extras" on public.order_item_extras;
create policy "Users can insert own order item extras"
on public.order_item_extras
for insert
with check (
  exists (
    select 1
    from public.order_items
    join public.orders on orders.id = order_items.order_id
    where order_items.id = order_item_extras.order_item_id
    and orders.user_id = auth.uid()
  )
);

drop policy if exists "Users can view own order item customizations" on public.order_item_customizations;
create policy "Users can view own order item customizations"
on public.order_item_customizations
for select
using (
  exists (
    select 1
    from public.order_items
    join public.orders on orders.id = order_items.order_id
    where order_items.id = order_item_customizations.order_item_id
    and orders.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert own order item customizations" on public.order_item_customizations;
create policy "Users can insert own order item customizations"
on public.order_item_customizations
for insert
with check (
  exists (
    select 1
    from public.order_items
    join public.orders on orders.id = order_items.order_id
    where order_items.id = order_item_customizations.order_item_id
    and orders.user_id = auth.uid()
  )
);

drop policy if exists "Users can view own order delivery address" on public.order_delivery_addresses;
create policy "Users can view own order delivery address"
on public.order_delivery_addresses
for select
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_delivery_addresses.order_id
    and orders.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert own order delivery address" on public.order_delivery_addresses;
create policy "Users can insert own order delivery address"
on public.order_delivery_addresses
for insert
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_delivery_addresses.order_id
    and orders.user_id = auth.uid()
  )
);

drop policy if exists "Users can view own order payments" on public.order_payments;
create policy "Users can view own order payments"
on public.order_payments
for select
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_payments.order_id
    and orders.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert own order payments" on public.order_payments;
create policy "Users can insert own order payments"
on public.order_payments
for insert
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_payments.order_id
    and orders.user_id = auth.uid()
  )
);

drop policy if exists "Users can view own payments" on public.payments;
create policy "Users can view own payments"
on public.payments
for select
using (
  exists (
    select 1
    from public.orders
    where orders.id = payments.order_id
    and orders.user_id = auth.uid()
  )
);

drop policy if exists "Users can view own favorites" on public.favorites;
create policy "Users can view own favorites"
on public.favorites
for select
using (auth.uid() = user_id);

drop policy if exists "Users can manage own favorites" on public.favorites;
create policy "Users can manage own favorites"
on public.favorites
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can view own notifications" on public.notifications;
create policy "Users can view own notifications"
on public.notifications
for select
using (auth.uid() = user_id);

drop policy if exists "Users can update own notifications" on public.notifications;
create policy "Users can update own notifications"
on public.notifications
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own notifications" on public.notifications;
create policy "Users can delete own notifications"
on public.notifications
for delete
using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (
    id,
    name,
    email,
    phone,
    avatar,
    birth_date,
    gender,
    role_id,
    created_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name',split_part(coalesce(new.email,''),'@',1),'Cliente'),
    coalesce(new.email,''),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'avatar','/avatars/young.jpg'),
    new.raw_user_meta_data->>'birth_date',
    new.raw_user_meta_data->>'gender',
    'user',
    (extract(epoch from now()) * 1000)::bigint
  )
  on conflict (id) do update
  set
    name = excluded.name,
    email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into storage.buckets (id,name,public)
values ('avatars','avatars',true)
on conflict (id) do nothing;

drop policy if exists "Public avatar access" on storage.objects;
create policy "Public avatar access"
on storage.objects
for select
using (bucket_id = 'avatars');

drop policy if exists "Authenticated avatar upload" on storage.objects;
create policy "Authenticated avatar upload"
on storage.objects
for insert
with check (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can update own avatar" on storage.objects;
create policy "Users can update own avatar"
on storage.objects
for update
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can delete own avatar" on storage.objects;
create policy "Users can delete own avatar"
on storage.objects
for delete
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

insert into public.categories (id,name)
values
  ('Burgers','Burgers'),
  ('Combos','Combos'),
  ('Pizzas','Pizzas'),
  ('Bebidas','Bebidas'),
  ('Salgados','Salgados'),
  ('Snacks','Snacks'),
  ('Sobremesas','Sobremesas'),
  ('Acompanhamentos','Acompanhamentos'),
  ('Promoções','Promoções')
on conflict (id) do nothing;

insert into public.stores (
  id,name,neighborhood,city,address,reference,phone,whatsapp,hours,is_open,latitude,longitude,image
)
values
  ('store_maianga','Burguer Faminto Maianga','Maianga','Luanda','Rua Amílcar Cabral, 124','Próximo ao Largo da Maianga','+244 923 111 222','+244 923 111 222','10:00 - 23:00',true,-8.8252,13.2344,'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=60'),
  ('store_talatona','Burguer Faminto Talatona','Talatona','Luanda','Avenida Samora Machel, Edifício Palmeiras','Junto ao Belas Shopping','+244 924 333 444','+244 924 333 444','11:00 - 00:00',true,-8.9189,13.1812,'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60'),
  ('store_kilamba','Burguer Faminto Kilamba','Kilamba','Luanda','Quarteirão E, Bloco E-12','Frente à Praça Central do Kilamba','+244 925 555 666','+244 925 555 666','11:00 - 23:30',true,-8.9984,13.2641,'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=60'),
  ('store_alvalade','Burguer Faminto Alvalade','Alvalade','Luanda','Rua Comandante Gika, 88','Ao lado da Praça de Alvalade','+244 926 777 888','+244 926 777 888','10:00 - 23:00',true,-8.8315,13.2421,'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&auto=format&fit=crop&q=60'),
  ('store_ilha','Burguer Faminto Ilha do Cabo','Ilha do Cabo','Luanda','Avenida Murtala Mohamed, 45','Beira-mar, Ilha de Luanda','+244 927 999 000','+244 927 999 000','12:00 - 02:00',true,-8.7833,13.2333,'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&auto=format&fit=crop&q=60')
on conflict (id) do nothing;

insert into public.product_extra_options (id,name,price,category)
values
  ('pao-brioche','Pão Brioche Amanteigado',0,'pao'),
  ('pao-australiano','Pão Australiano com Mel',400,'pao'),
  ('pao-gergelim','Pão Tradicional com Sésamo',0,'pao'),
  ('carne-simples','1x Carne Artesanal 150g',0,'carne'),
  ('carne-dupla','2x Carne Artesanal 150g (+150g)',1500,'carne'),
  ('carne-tripla','3x Carne Artesanal 150g (+300g)',2800,'carne'),
  ('queijo-cheddar','Cheddar Inglês Cremoso',0,'queijo'),
  ('queijo-mussarela','Mussarela Derretida',200,'queijo'),
  ('queijo-gorgonzola','Gorgonzola Nobre',500,'queijo'),
  ('extra-bacon','Bacon Duplo Crocante',600,'extra'),
  ('extra-ovo','Ovo Estalado com Gema Mole',400,'extra'),
  ('extra-cebola','Cebola Caramelizada no Açúcar Mascavo',350,'extra'),
  ('extra-molho','Dose Extra Molho Secreto Faminto',300,'extra'),
  ('extra-picles','Picles Artesanais Agridoces',250,'extra')
on conflict (id) do nothing;

insert into public.coupons (
  id,code,discount_type,discount_value,min_order_value,description,expires_at
)
values
  ('c-1','FAMINTO10','percent',10,4000,'10% de desconto em todo o menu para acalmar a fome.','31 Dezembro 2026'),
  ('c-2','MONSTER500','fixed',500,5000,'500 Kz de desconto direto em qualquer Combo Faminto.','31 Dezembro 2026'),
  ('c-3','FRETEGRATIS','fixed',1500,8000,'Entrega grátis em Luanda para compras acima de 8.000 Kz.','31 Dezembro 2026')
on conflict (id) do nothing;

insert into public.badges (id,name,icon,description)
values
  ('b1','Primeiro Ataque','🍔','Completaste o teu primeiro pedido com sucesso.'),
  ('b2','Devorador Noturno','🌙','Fizeste um pedido de socorro após a meia-noite.'),
  ('b3','Mestre dos Burgers','👑','Pediste mais de 10 hambúrgueres artesanais diferentes.'),
  ('b4','Crítico Faminto','⭐','Avaliastes 5 pedidos com classificação máxima.'),
  ('b5','Cliente VIP','💎','Atingiste o nível máximo do Clube de Fidelidade Faminto.')
on conflict (id) do nothing;

insert into public.products (
  id,name,description,price,promotional_price,category_id,image,rating,sales_count,tags,ingredients,is_available,is_featured
)
values
  ('p10','Hambúrguer Faminto','Pão brioche tostado, 200g de carne bovina angolana grelhada no ponto, queijo cheddar derretido, cebola caramelizada, bacon estaladiço e o nosso molho secreto.',4500,null,'Burgers','/produtos/hamburguer.png',4.9,1420,'{}','{}',true,true),
  ('p11','Hambúrguer Normal','Pão brioche clássico, 150g de carne suculenta, queijo flamengo, alface fresca da horta, tomate maduro e maionese de ervas caseira.',3200,null,'Burgers','/produtos/hamburguernormal.png',4.7,890,'{}','{}',true,false),
  ('p5','Combo Monstro Faminto','2x Hambúrgueres Faminto + Batata Frita Grande + 2x Refrigerantes 330ml à escolha. O banquete definitivo para matar qualquer fome.',11500,9900,'Combos','/produtos/begga.png',5.0,2340,'{}','{}',true,true),
  ('p2','Batatas Fritas Rústicas','Batatas estaladiças cortadas à mão, temperadas com sal marinho, alecrim e servidas com maionese de alho confitado.',1800,null,'Acompanhamentos','/produtos/batatas.png',4.8,1120,'{}','{}',true,false),
  ('p3','Batatinhas Famintas com Cheddar e Bacon','Dose generosa de batatas fritas crocantes cobertas com cascata de queijo cheddar fundido e cubos crocantes de bacon.',2600,2200,'Acompanhamentos','/produtos/batatinhas.png',4.9,1680,'{}','{}',true,true),
  ('p4','Hot Dog Especial Faminto','Pão de cachorro super macio, salsicha bock premium grelhada, molho de tomate caseiro, milho doce, batata palha fininha e mostarda mel.',2800,null,'Snacks','/produtos/hotdog.png',4.6,670,'{}','{}',true,false),
  ('p6','Cachorro Quente Duplo','Dois cachorros quentes prensados com queijo duplo derretido, orégãos e molho especial da casa.',4200,null,'Snacks','/produtos/cachorros.png',4.7,540,'{}','{}',true,false),
  ('p7','Pizza Faminto Suprema','Massa artesanal fina e estaladiça, molho de tomate fresco, mozzarella abundante, pepperoni fumado, cogumelos salteados e azeitonas pretas.',7500,6800,'Pizzas','/produtos/pizza.png',4.9,980,'{}','{}',true,true),
  ('p8','Fahita de Carne e Frango','Tortilha de trigo recheada com tiras de novilho e frango marinadas, pimentos salteados, cebola roxa e guacamole fresco.',3900,null,'Snacks','/produtos/fahita.png',4.7,430,'{}','{}',true,false),
  ('p9','Samussas Crocantes (Dose 4 un)','Massa folhada estaladiça recheada com carne picada picante e especiarias tradicionais.',1600,null,'Salgados','/produtos/samussa.png',4.8,1250,'{}','{}',true,false),
  ('p12','Pastéis de Carne (Dose 4 un)','Pastéis estaladiços fritos na hora com recheio tradicional de carne picada suculenta bem temperada.',1500,null,'Salgados','/produtos/pastel.png',4.6,890,'{}','{}',true,false),
  ('p13','Brownie de Chocolate com Nozes','Bolo húmido de chocolate negro belga com pedaços de nozes crocantes e calda quente de chocolate.',2200,null,'Sobremesas','/produtos/brownie.png',4.9,760,'{}','{}',true,false),
  ('p14','Brownie Choco Supremo','Dose dupla de brownie com cobertura de ganache de chocolate e raspas crocantes.',2500,null,'Sobremesas','/produtos/browniechoco.png',5.0,620,'{}','{}',true,false),
  ('p15','Milkshake de Morango e Baunilha','Batido cremoso feito com gelado artesanal de morango, leite gordo e chantilly fresco no topo.',2400,null,'Sobremesas','/produtos/milkshake.png',4.8,890,'{}','{}',true,false),
  ('p16','Coca-Cola 330ml Lata','Bebida gaseificada fresca original servida bem gelada.',800,null,'Bebidas','/produtos/cocacola.png',4.8,3200,'{}','{}',true,false),
  ('p17','Fanta Laranja 330ml Lata','Refrigerante de laranja frutado e efervescente.',800,null,'Bebidas','/produtos/fanta.png',4.7,1900,'{}','{}',true,false),
  ('p18','Sprite 330ml Lata','Refrigerante refrescante de lima-limão.',800,null,'Bebidas','/produtos/sprite.png',4.7,1400,'{}','{}',true,false),
  ('p19','Cerveja Cuca Gelada 330ml','A clássica cerveja angolana servida estaladiça e bem fria.',900,null,'Bebidas','/produtos/cuca.png',4.9,2100,'{}','{}',true,false),
  ('p20','Sumo Natural do Dia 500ml','Sumo 100% natural espremido na hora com frutas tropicais de Angola (Laranja, Manga ou Maracujá).',1500,null,'Bebidas','/produtos/sumonatural.png',4.8,1100,'{}','{}',true,false),
  ('p21','Sumo de Laranja 330ml','Sumo concentrado de laranja natural refrescante.',1000,null,'Bebidas','/produtos/sumo.png',4.6,850,'{}','{}',true,false),
  ('p22','Café Espresso','Café 100% Arábica de Angola tirado à pressão, aroma encorpado e creme aveludado.',600,null,'Bebidas','/produtos/cafe.png',4.7,650,'{}','{}',true,false),
  ('p23','Latte Macchiato Cremoso','Leite vaporizado aveludado com dose de café expresso encorpado e espuma densa.',1200,null,'Bebidas','/produtos/latte.png',4.8,420,'{}','{}',true,false)
on conflict (id) do nothing;
