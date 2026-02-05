-- Enable uuid extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the account_operations table
CREATE TABLE public.account_operations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_number TEXT NOT NULL,
  operation_type TEXT NOT NULL CHECK (operation_type IN ('deposit', 'withdrawal', 'loan')),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  interest NUMERIC,
  payments NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.account_operations ENABLE ROW LEVEL SECURITY;

-- Create public read policy
CREATE POLICY "Allow public read access"
  ON public.account_operations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create public insert policy
CREATE POLICY "Allow public insert access"
  ON public.account_operations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create public update policy
CREATE POLICY "Allow public update access"
  ON public.account_operations
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create public delete policy
CREATE POLICY "Allow public delete access"
  ON public.account_operations
  FOR DELETE
  TO anon, authenticated
  USING (true);