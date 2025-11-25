-- ============================================
-- OVIYA Database Schema
-- Initial Migration
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  language_profile JSONB DEFAULT '{
    "primary": "en",
    "secondary": [],
    "codeSwitchingStyle": "sentence_level",
    "formalityLevel": "casual",
    "culturalParticles": []
  }'::jsonb,
  preferences JSONB DEFAULT '{
    "sarcasmEnabled": true,
    "dailyRitualsEnabled": true,
    "morningCheckInTime": "09:00",
    "eveningGratitudeTime": "21:00",
    "notificationsEnabled": true
  }'::jsonb,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'lifetime')),
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT false
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON conversations(user_id, last_message_at DESC);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'oviya', 'system')),
  content TEXT NOT NULL,
  emotion TEXT,
  oviya_mood TEXT,
  tokens_used INTEGER,
  model_used TEXT,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX ON messages(conversation_id, created_at DESC);

-- Memories table with vector search
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('personal_fact', 'preference', 'event', 'pattern')),
  importance INTEGER CHECK (importance BETWEEN 1 AND 10),
  embedding VECTOR(1536), -- OpenAI text-embedding-3-small
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX ON memories USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON memories(user_id, importance DESC, last_accessed_at DESC);

-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_memories(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  filter_user_id UUID
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  category TEXT,
  importance INT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    memories.id,
    memories.content,
    memories.category,
    memories.importance,
    1 - (memories.embedding <=> query_embedding) AS similarity
  FROM memories
  WHERE memories.user_id = filter_user_id
    AND 1 - (memories.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- Rituals table
CREATE TABLE rituals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('morning', 'afternoon', 'evening')),
  scheduled_time TIME NOT NULL,
  enabled BOOLEAN DEFAULT true,
  last_completed TIMESTAMPTZ,
  streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, type)
);

-- Ritual responses table
CREATE TABLE ritual_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ritual_id UUID REFERENCES rituals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  response_text TEXT,
  gratitude_items TEXT[],
  mood TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON ritual_responses(user_id, completed_at DESC);

-- Crisis incidents table
CREATE TABLE crisis_incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id),
  message_id UUID REFERENCES messages(id),
  crisis_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  keywords TEXT[],
  user_message TEXT NOT NULL,
  oviya_response TEXT NOT NULL,
  helplines_shown TEXT[],
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  follow_up_sent BOOLEAN DEFAULT false,
  reviewer_notes TEXT
);

CREATE INDEX ON crisis_incidents(user_id, detected_at DESC);
CREATE INDEX ON crisis_incidents(detected_at DESC) WHERE follow_up_sent = false;

-- Shared moments (bookmarked messages)
CREATE TABLE shared_moments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  emotion_category TEXT,
  user_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON shared_moments(user_id, created_at DESC);

-- Detected strengths
CREATE TABLE detected_strengths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  strength_type TEXT NOT NULL,
  context TEXT NOT NULL,
  evidence_message_ids UUID[],
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged_by_user BOOLEAN DEFAULT false
);

CREATE INDEX ON detected_strengths(user_id, detected_at DESC);

-- Care packages
CREATE TABLE care_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  trigger_reason TEXT,
  contents JSONB NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  user_feedback TEXT
);

CREATE INDEX ON care_packages(user_id, sent_at DESC);

-- Anniversaries
CREATE TABLE anniversaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL,
  milestone_value INTEGER,
  celebrated_at TIMESTAMPTZ DEFAULT NOW(),
  user_response TEXT
);

-- User analytics (for dashboard)
CREATE TABLE user_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  messages_sent INTEGER DEFAULT 0,
  rituals_completed INTEGER DEFAULT 0,
  shared_moments_created INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  UNIQUE(user_id, date)
);

CREATE INDEX ON user_analytics(user_id, date DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rituals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ritual_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE detected_strengths ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own memories" ON memories
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own rituals" ON rituals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own ritual_responses" ON ritual_responses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own crisis_incidents" ON crisis_incidents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own shared_moments" ON shared_moments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own detected_strengths" ON detected_strengths
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own care_packages" ON care_packages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own user_analytics" ON user_analytics
  FOR ALL USING (auth.uid() = user_id);

-- Messages need special handling (check conversation ownership)
CREATE POLICY "Users can view messages in own conversations" ON messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );
