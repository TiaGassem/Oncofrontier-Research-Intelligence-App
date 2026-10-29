/*
# Create user features tables: search history, favorites, projects, notes

## Purpose
Enables persistent user workspaces: saved searches, favorite papers, projects, and notes.
Each user sees only their own data via RLS policies scoped to auth.uid().

## New Tables
1. `search_history` — stores user search queries and result counts
   - id (uuid PK), user_id (uuid FK auth.users), query (text), filters (jsonb),
     result_count (int), sources (text[]), created_at (timestamptz)

2. `favorites` — saved research records (publications, trials)
   - id (uuid PK), user_id (uuid FK auth.users), record_id (text), record_kind (text),
     title (text), source_url (text), pmid (text), doi (text), nct_id (text),
     provider (text), metadata (jsonb), created_at (timestamptz)

3. `projects` — user research projects/collections
   - id (uuid PK), user_id (uuid FK auth.users), name (text), description (text),
     created_at (timestamptz), updated_at (timestamptz)

4. `project_items` — items within projects (links to favorites)
   - id (uuid PK), project_id (uuid FK projects), favorite_id (uuid FK favorites),
     note (text), created_at (timestamptz)

5. `notes` — user notes on saved records
   - id (uuid PK), user_id (uuid FK auth.users), favorite_id (uuid FK favorites),
     content (text), created_at (timestamptz)

## Security
- RLS enabled on all tables
- All policies scoped TO authenticated with auth.uid() = user_id ownership checks
- user_id columns default to auth.uid() so inserts work without client passing user_id
- Child tables (project_items, notes) scoped through parent ownership
*/

CREATE TABLE IF NOT EXISTS search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  query text NOT NULL,
  filters jsonb DEFAULT '{}',
  result_count int DEFAULT 0,
  sources text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_search_history" ON search_history;
CREATE POLICY "select_own_search_history" ON search_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_search_history" ON search_history;
CREATE POLICY "insert_own_search_history" ON search_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_search_history" ON search_history;
CREATE POLICY "delete_own_search_history" ON search_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  record_id text NOT NULL,
  record_kind text DEFAULT 'publication',
  title text NOT NULL,
  source_url text,
  pmid text,
  doi text,
  nct_id text,
  provider text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_favorites" ON favorites;
CREATE POLICY "select_own_favorites" ON favorites FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_favorites" ON favorites;
CREATE POLICY "insert_own_favorites" ON favorites FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_favorites" ON favorites;
CREATE POLICY "delete_own_favorites" ON favorites FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_projects" ON projects;
CREATE POLICY "select_own_projects" ON projects FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_projects" ON projects;
CREATE POLICY "insert_own_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_projects" ON projects;
CREATE POLICY "update_own_projects" ON projects FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_projects" ON projects;
CREATE POLICY "delete_own_projects" ON projects FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS project_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  favorite_id uuid NOT NULL REFERENCES favorites(id) ON DELETE CASCADE,
  note text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_project_items" ON project_items;
CREATE POLICY "select_own_project_items" ON project_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_items.project_id AND projects.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_project_items" ON project_items;
CREATE POLICY "insert_own_project_items" ON project_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_items.project_id AND projects.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_project_items" ON project_items;
CREATE POLICY "delete_own_project_items" ON project_items FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_items.project_id AND projects.user_id = auth.uid())
  );

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  favorite_id uuid REFERENCES favorites(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notes" ON notes;
CREATE POLICY "select_own_notes" ON notes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notes" ON notes;
CREATE POLICY "insert_own_notes" ON notes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_notes" ON notes;
CREATE POLICY "delete_own_notes" ON notes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_project_items_project ON project_items(project_id);
