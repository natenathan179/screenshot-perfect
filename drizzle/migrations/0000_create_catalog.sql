CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'peptides',
  subtitle text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  size text,
  purity text,
  form text,
  storage text,
  cas_number text,
  short_description text,
  description text,
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_featured boolean NOT NULL DEFAULT false,
  is_bestseller boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  in_stock boolean NOT NULL DEFAULT true,
  rating numeric(2,1) NOT NULL DEFAULT 5,
  review_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Auth insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update products" ON public.products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete products" ON public.products FOR DELETE TO authenticated USING (true);

CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url text NOT NULL,
  storage_path text,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT ALL ON public.product_images TO service_role;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read images" ON public.product_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Auth write images" ON public.product_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  cover_url text,
  author text NOT NULL DEFAULT 'PeptideLabs Research Team',
  tags text[] NOT NULL DEFAULT '{}',
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read posts" ON public.posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Auth write posts" ON public.posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  avatar_url text,
  rating int NOT NULL DEFAULT 5,
  title text,
  body text NOT NULL,
  product_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Auth write reviews" ON public.reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);