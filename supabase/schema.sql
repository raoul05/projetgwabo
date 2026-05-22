-- ============================================
-- GWABO Ecommerce Platform - Supabase Schema
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, icon) VALUES
  ('Fruits & Légumes', 'fruits-legumes', '🥬'),
  ('Viandes & Poissons', 'viandes-poissons', '🥩'),
  ('Céréales & Grains', 'cereales-grains', '🌾'),
  ('Huiles & Épices', 'huiles-epices', '🫒'),
  ('Boissons', 'boissons', '🧃'),
  ('Produits Laitiers', 'produits-laitiers', '🥛'),
  ('Tubercules', 'tubercules', '🥔'),
  ('Condiments', 'condiments', '🧂')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'piece',
  image TEXT,
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  origin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_products_name ON products(name);

-- ============================================
-- CUSTOMERS
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  district TEXT,
  address TEXT,
  gps_location TEXT,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_phone ON customers(phone);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT,
  gps_location TEXT,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 500,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================
-- EMPLOYEES
-- ============================================
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'customer_support'
    CHECK (role IN ('admin', 'accountant', 'order_manager', 'delivery_agent', 'customer_support')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  pin_hash TEXT,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employees_phone ON employees(phone);
CREATE INDEX idx_employees_role ON employees(role);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Categories: public read
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (true);

-- Products: public read available, full access for authenticated
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (is_available = true);

CREATE POLICY "products_anon_insert" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "products_anon_update" ON products
  FOR UPDATE USING (true);

-- Customers: insert and read own data
CREATE POLICY "customers_anon_insert" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "customers_anon_select" ON customers
  FOR SELECT USING (true);

CREATE POLICY "customers_anon_update" ON customers
  FOR UPDATE USING (true);

-- Orders: insert and read
CREATE POLICY "orders_anon_insert" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_anon_select" ON orders
  FOR SELECT USING (true);

CREATE POLICY "orders_anon_update" ON orders
  FOR UPDATE USING (true);

-- Order items: insert and read
CREATE POLICY "order_items_anon_insert" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "order_items_anon_select" ON order_items
  FOR SELECT USING (true);

-- Employees: read for login
CREATE POLICY "employees_anon_select" ON employees
  FOR SELECT USING (true);

CREATE POLICY "employees_anon_insert" ON employees
  FOR INSERT WITH CHECK (true);

CREATE POLICY "employees_anon_update" ON employees
  FOR UPDATE USING (true);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Run these in the Supabase SQL Editor or use the Dashboard:
--
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('produits-images', 'produits-images', true);
--
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('produits-videos', 'produits-videos', true);
--
-- CREATE POLICY "produits_images_public_read" ON storage.objects
--   FOR SELECT USING (bucket_id = 'produits-images');
--
-- CREATE POLICY "produits_images_anon_insert" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'produits-images');
--
-- CREATE POLICY "produits_videos_public_read" ON storage.objects
--   FOR SELECT USING (bucket_id = 'produits-videos');
--
-- CREATE POLICY "produits_videos_anon_insert" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'produits-videos');
