-- Phase 8 Week 4: Video History Table
-- Run this SQL in Supabase SQL Editor

-- Create video_history table
CREATE TABLE IF NOT EXISTS video_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    video_id TEXT NOT NULL,
    title TEXT NOT NULL,
    channel_name TEXT,
    channel_id TEXT,
    thumbnail_url TEXT,
    duration INTEGER,
    description TEXT,
    transcript JSONB,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    times_viewed INTEGER DEFAULT 1,
    is_starred BOOLEAN DEFAULT FALSE,
    collections TEXT[],
    tools_used JSONB DEFAULT '{}'::jsonb,
    
    -- Unique constraint: one entry per user per video
    UNIQUE(user_id, video_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_history_user 
    ON video_history(user_id);

CREATE INDEX IF NOT EXISTS idx_video_history_user_accessed 
    ON video_history(user_id, last_accessed DESC);

CREATE INDEX IF NOT EXISTS idx_video_history_starred 
    ON video_history(user_id, is_starred) 
    WHERE is_starred = TRUE;

-- Enable Row Level Security
ALTER TABLE video_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (allows re-running migration)
DROP POLICY IF EXISTS "Users can view their own video history" ON video_history;
DROP POLICY IF EXISTS "Users can insert their own video history" ON video_history;
DROP POLICY IF EXISTS "Users can update their own video history" ON video_history;
DROP POLICY IF EXISTS "Users can delete their own video history" ON video_history;

-- RLS Policies
CREATE POLICY "Users can view their own video history"
    ON video_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video history"
    ON video_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video history"
    ON video_history FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video history"
    ON video_history FOR DELETE
    USING (auth.uid() = user_id);

-- Create video_collections table
CREATE TABLE IF NOT EXISTS video_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    video_ids TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    color TEXT DEFAULT '#3b82f6',
    
    -- Unique constraint: one collection name per user
    UNIQUE(user_id, name)
);

-- Create index for collections
CREATE INDEX IF NOT EXISTS idx_video_collections_user 
    ON video_collections(user_id);

-- Enable Row Level Security for collections
ALTER TABLE video_collections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (allows re-running migration)
DROP POLICY IF EXISTS "Users can view their own collections" ON video_collections;
DROP POLICY IF EXISTS "Users can insert their own collections" ON video_collections;
DROP POLICY IF EXISTS "Users can update their own collections" ON video_collections;
DROP POLICY IF EXISTS "Users can delete their own collections" ON video_collections;

-- RLS Policies for collections
CREATE POLICY "Users can view their own collections"
    ON video_collections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own collections"
    ON video_collections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
    ON video_collections FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
    ON video_collections FOR DELETE
    USING (auth.uid() = user_id);

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON video_history TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON video_collections TO authenticated;
