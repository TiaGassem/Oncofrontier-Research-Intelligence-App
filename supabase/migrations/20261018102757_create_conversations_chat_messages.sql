/*
# Create conversations and chat_messages tables

1. New Tables
- `conversations`: one row per saved Companion chat.
  - `id` (uuid, primary key, default gen_random_uuid())
  - `user_id` (uuid, NOT NULL, default auth.uid(), FK to auth.users ON DELETE CASCADE)
  - `title` (text, NOT NULL, default 'New chat')
  - `archived` (boolean, NOT NULL, default false)
  - `created_at` (timestamptz, NOT NULL, default now())
  - `updated_at` (timestamptz, NOT NULL, default now())
- `chat_messages`: the messages inside a conversation, in order.
  - `id` (uuid, primary key, default gen_random_uuid())
  - `conversation_id` (uuid, NOT NULL, FK to conversations ON DELETE CASCADE)
  - `user_id` (uuid, NOT NULL, default auth.uid(), FK to auth.users ON DELETE CASCADE)
  - `role` (text, NOT NULL) — 'user' | 'assistant'
  - `content` (text, NOT NULL)
  - `is_urgent` (boolean, NOT NULL, default false)
  - `sources` (jsonb, nullable) — snapshot of source records cited by the message
  - `created_at` (timestamptz, NOT NULL, default now())

2. Security
- RLS enabled on both tables.
- Four owner-scoped policies per table (SELECT / INSERT / UPDATE / DELETE),
  all `TO authenticated`, all checking `auth.uid() = user_id`.
- `user_id` DEFAULT auth.uid() lets the frontend insert without passing an owner.
- Ownership is enforced by the database: a user cannot read, edit, or delete
  another user's conversations even by calling the API directly.

3. Important notes
- Deleting a conversation cascades to its messages (real deletion, not a flag).
- An index on (conversation_id, created_at) makes loading a chat's messages fast.
- An index on (user_id, updated_at) makes the conversation sidebar fast.
- Existing tables and data are untouched.
*/

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New chat',
  archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  is_urgent boolean NOT NULL DEFAULT false,
  sources jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_messages_conversation_idx
  ON chat_messages (conversation_id, created_at);

CREATE INDEX IF NOT EXISTS conversations_user_updated_idx
  ON conversations (user_id, updated_at DESC);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_conversations" ON conversations;
CREATE POLICY "select_own_conversations" ON conversations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_conversations" ON conversations;
CREATE POLICY "insert_own_conversations" ON conversations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_conversations" ON conversations;
CREATE POLICY "update_own_conversations" ON conversations
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_conversations" ON conversations;
CREATE POLICY "delete_own_conversations" ON conversations
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "select_own_chat_messages" ON chat_messages;
CREATE POLICY "select_own_chat_messages" ON chat_messages
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_chat_messages" ON chat_messages
;
CREATE POLICY "insert_own_chat_messages" ON chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_chat_messages" ON chat_messages;
CREATE POLICY "update_own_chat_messages" ON chat_messages
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_chat_messages" ON chat_messages;
CREATE POLICY "delete_own_chat_messages" ON chat_messages
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);