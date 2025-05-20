/*
  # Initial Database Schema

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - first_name (text)
      - last_name (text)
      - location (text)
      - contact (text)
      - gender (text)
      - age (integer)
      - profile_photo (text)
      - created_at (timestamptz)

    - shops
      - id (uuid, primary key)
      - owner_id (uuid, references users)
      - name (text)
      - location (text)
      - contact (text)
      - is_verified (boolean)
      - created_at (timestamptz)

    - verification_requests
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - shop_id (uuid, references shops)
      - id_photo (text)
      - face_photo (text)
      - status (text)
      - restricted (boolean)
      - restriction_reason (text)
      - created_at (timestamptz)

    - products
      - id (uuid, primary key)
      - seller_id (uuid, references users)
      - name (text)
      - category (text)
      - price (numeric)
      - description (text)
      - image (text)
      - created_at (timestamptz)

    - orders
      - id (uuid, primary key)
      - product_id (uuid, references products)
      - buyer_id (uuid, references users)
      - seller_id (uuid, references users)
      - quantity (integer)
      - total_amount (numeric)
      - status (text)
      - created_at (timestamptz)

    - notifications
      - id (uuid, primary key)
      - user_id (uuid, references users)
      - title (text)
      - message (text)
      - type (text)
      - order_id (uuid, references orders)
      - read (boolean)
      - created_at (timestamptz)

    - conversations
      - id (uuid, primary key)
      - product_id (uuid, references products)
      - created_at (timestamptz)

    - conversation_participants
      - conversation_id (uuid, references conversations)
      - user_id (uuid, references users)
      - PRIMARY KEY (conversation_id, user_id)

    - messages
      - id (uuid, primary key)
      - conversation_id (uuid, references conversations)
      - sender_id (uuid, references users)
      - receiver_id (uuid, references users)
      - content (text)
      - read (boolean)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  location text,
  contact text,
  gender text,
  age integer,
  profile_photo text,
  created_at timestamptz DEFAULT now()
);

-- Create shops table
CREATE TABLE shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES users NOT NULL,
  name text NOT NULL,
  location text NOT NULL,
  contact text NOT NULL,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create verification_requests table
CREATE TABLE verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  shop_id uuid REFERENCES shops NOT NULL,
  id_photo text NOT NULL,
  face_photo text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  restricted boolean DEFAULT false,
  restriction_reason text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES users NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products NOT NULL,
  buyer_id uuid REFERENCES users NOT NULL,
  seller_id uuid REFERENCES users NOT NULL,
  quantity integer NOT NULL,
  total_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  order_id uuid REFERENCES orders,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create conversations table
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create conversation_participants table
CREATE TABLE conversation_participants (
  conversation_id uuid REFERENCES conversations NOT NULL,
  user_id uuid REFERENCES users NOT NULL,
  PRIMARY KEY (conversation_id, user_id)
);

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations NOT NULL,
  sender_id uuid REFERENCES users NOT NULL,
  receiver_id uuid REFERENCES users NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Shops policies
CREATE POLICY "Anyone can read shops"
  ON shops
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Shop owners can update their shops"
  ON shops
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Verification requests policies
CREATE POLICY "Users can read their own verification requests"
  ON verification_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create verification requests"
  ON verification_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Products policies
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sellers can manage their products"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.uid() = seller_id);

-- Orders policies
CREATE POLICY "Users can read their orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Notifications policies
CREATE POLICY "Users can read their notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can read their conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conversations.id
    AND user_id = auth.uid()
  ));

-- Conversation participants policies
CREATE POLICY "Users can read conversation participants"
  ON conversation_participants
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Users can read their messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their message status"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (receiver_id = auth.uid());