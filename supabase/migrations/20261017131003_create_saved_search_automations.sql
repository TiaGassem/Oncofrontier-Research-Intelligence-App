/*
# Create saved_search_automations table

1. New Tables
- `saved_search_automations`: user-created saved research queries that can be
  checked on demand for newly published papers.
  - `id` (uuid, primary key, default gen_random_uuid())
  - `user_id` (uuid, NOT NULL, default auth.uid(), FK to auth.users ON DELETE CASCADE)
  - `name` (text, NOT NULL) — user-chosen label for the saved search
  - `query` (text, NOT NULL) — the retrieval query sent to PubMed / Europe PMC
  - `paused` (boolean, default false) — when true, manual and app-start checks skip it
  - `last_checked_at` (timestamptz, nullable) — last time new publications were fetched
  - `last_new_results` (integer, default 0) — number of publications newer than the previous check found
  - `last_status` (text, default 'never') — 'ok' | 'error' | 'never'
  - `last_error` (text, nullable) — the most recent error message, if any
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- RLS enabled on `saved_search_automations`.
- Four owner-scoped policies (SELECT / INSERT / UPDATE / DELETE), all
  `TO authenticated`, all using `auth.uid() = user_id`. The `user_id`
  DEFAULT auth.uid() lets the frontend insert without passing an owner.

3. Important notes
- This table stores configuration and check status only. It does NOT schedule
  anything by itself: checks run when the signed-in user opens the app and the
  frontend calls the check routine (explicit user action). No background
  scheduler is claimed. The `paused` flag and timestamps give honest state.
- Existing tables and data are untouched.
*/

CREATE TABLE IF NOT EXISTS saved_search_automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  query text NOT NULL,
  paused boolean NOT NULL DEFAULT false,
  last_checked_at timestamptz,
  last_new_results integer NOT NULL DEFAULT 0,
  last_status text NOT NULL DEFAULT 'never',
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS saved_search_automations_user_idx
  ON saved_search_automations (user_id);

ALTER TABLE saved_search_automations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_saved_search_automations" ON saved_search_automations;
CREATE POLICY "select_own_saved_search_automations" ON saved_search_automations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_saved_search_automations" ON saved_search_automations;
CREATE POLICY "insert_own_saved_search_automations" ON saved_search_automations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_saved_search_automations" ON saved_search_automations;
CREATE POLICY "update_own_saved_search_automations" ON saved_search_automations
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_saved_search_automations" ON saved_search_automations;
CREATE POLICY "delete_own_saved_search_automations" ON saved_search_automations
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
