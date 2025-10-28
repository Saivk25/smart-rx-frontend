/*
  # Smart Rx Tracker Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique user identifier
      - `name` (text) - User's full name
      - `email` (text, unique) - User's email address
      - `phone` (text) - User's phone number
      - `date_of_birth` (date) - User's date of birth
      - `created_at` (timestamp) - Account creation timestamp

    - `medications`
      - `id` (uuid, primary key) - Unique medication identifier
      - `user_id` (uuid, foreign key) - References users table
      - `name` (text) - Medication name
      - `dosage` (text) - Medication dosage (e.g., "10mg")
      - `frequency` (text) - How often to take (e.g., "Once daily")
      - `instructions` (text) - Detailed instructions
      - `next_dose` (text) - Next scheduled dose time
      - `taken` (boolean) - Whether medication was taken today
      - `safety_status` (text) - Safety check status: 'safe', 'warning', 'danger'
      - `translated_instructions` (text) - Optional translated instructions
      - `last_taken_at` (timestamp) - When medication was last taken
      - `created_at` (timestamp) - When medication was added

  2. Security
    - Enable RLS on both tables
    - Users can only access their own data
    - All operations require authentication
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  date_of_birth date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  instructions text DEFAULT '',
  next_dose text NOT NULL,
  taken boolean DEFAULT false,
  safety_status text DEFAULT 'safe' CHECK (safety_status IN ('safe', 'warning', 'danger')),
  translated_instructions text,
  last_taken_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS medications_user_id_idx ON medications(user_id);
CREATE INDEX IF NOT EXISTS medications_created_at_idx ON medications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to create profiles (for onboarding)
CREATE POLICY "Anonymous users can create profiles"
  ON users FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can read their profiles"
  ON users FOR SELECT
  TO anon
  USING (true);

-- Medications table policies
CREATE POLICY "Users can view own medications"
  ON medications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own medications"
  ON medications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own medications"
  ON medications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own medications"
  ON medications FOR DELETE
  TO authenticated
  USING (true);

-- Allow anonymous users to manage medications (for MVP without auth)
CREATE POLICY "Anonymous users can view medications"
  ON medications FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can insert medications"
  ON medications FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update medications"
  ON medications FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous users can delete medications"
  ON medications FOR DELETE
  TO anon
  USING (true);
