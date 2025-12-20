-- Phase 8 Week 4: Video History & Collections
-- Creates tables for storing user's video library with cloud sync

-- ============================================================================
-- VIDEO HISTORY TABLE
-- ============================================================================
-- Stores every video a user loads with full metadata and transcript
-- Enables instant reload without re-fetching from YouTube

CREATE TABLE IF NOT EXISTS video_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    video_id TEXT NOT NULL,
    
    -- Video Metadata
    title TEXT NOT NULL,
    channel_name TEXT,
    channel_id TEXT,
    thumbnail_url TEXT,
    duration INTEGER, -- seconds
    description TEXT,
    view_count BIGINT,
    published_at TIMESTAMP,
    
    -- Transcript Data (stored as JSONB array)
    transcript JSONB, -- [{ text: "...", start: 0, duration: 5 }, ...]
    transcript_language TEXT DEFAULT 'en',
    
    -- User Interaction Tracking
    date_added TIMESTAMP DEFAULT NOW(),
    last_accessed TIMESTAMP DEFAULT NOW(),
    times_viewed INTEGER DEFAULT 1,
    is_starred BOOLEAN DEFAULT FALSE,
    
    -- Collections (array of collection names)
    collections TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Tool Usage Tracking (which content creation tools were used)
    tools_used JSONB DEFAULT '{
        "quiz": false,
        "lessonPlan": false,
        "discussionQuestions": false,
        "dokProject": false,
        "vocabulary": false,
        "guidedNotes": false,
        "graphicOrganizer": false,
        "summary": false,
        "analysis": false
    }'::JSONB,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Ensure each user can only have one entry per video
    UNIQUE(user_id, video_id)
);

-- Indexes for fast queries
CREATE INDEX idx_video_history_user ON video_history(user_id);
CREATE INDEX idx_video_history_user_date ON video_history(user_id, date_added DESC);
CREATE INDEX idx_video_history_user_accessed ON video_history(user_id, last_accessed DESC);
CREATE INDEX idx_video_history_starred ON video_history(user_id, is_starred) WHERE is_starred = true;
CREATE INDEX idx_video_history_collections ON video_history USING GIN(collections);

-- ============================================================================
-- VIDEO COLLECTIONS TABLE
-- ============================================================================
-- User-created playlists/units for organizing videos

CREATE TABLE IF NOT EXISTS video_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Collection Details
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3b82f6', -- Hex color for visual organization
    
    -- Video IDs in this collection (ordered array)
    video_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Each user's collection names must be unique
    UNIQUE(user_id, name)
);

-- Indexes
CREATE INDEX idx_video_collections_user ON video_collections(user_id);
CREATE INDEX idx_video_collections_user_name ON video_collections(user_id, name);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Ensure users can only access their own video history and collections

-- Enable RLS
ALTER TABLE video_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_collections ENABLE ROW LEVEL SECURITY;

-- VIDEO HISTORY POLICIES
-- Users can view only their own video history
CREATE POLICY "Users can view own video history"
    ON video_history
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own video history
CREATE POLICY "Users can insert own video history"
    ON video_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own video history
CREATE POLICY "Users can update own video history"
    ON video_history
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own video history
CREATE POLICY "Users can delete own video history"
    ON video_history
    FOR DELETE
    USING (auth.uid() = user_id);

-- VIDEO COLLECTIONS POLICIES
-- Users can view only their own collections
CREATE POLICY "Users can view own collections"
    ON video_collections
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own collections
CREATE POLICY "Users can insert own collections"
    ON video_collections
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own collections
CREATE POLICY "Users can update own collections"
    ON video_collections
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own collections
CREATE POLICY "Users can delete own collections"
    ON video_collections
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_video_history_updated_at
    BEFORE UPDATE ON video_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_collections_updated_at
    BEFORE UPDATE ON video_collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment view count and update last_accessed
CREATE OR REPLACE FUNCTION increment_video_view(p_user_id UUID, p_video_id TEXT)
RETURNS void AS $$
BEGIN
    UPDATE video_history
    SET 
        times_viewed = times_viewed + 1,
        last_accessed = NOW()
    WHERE user_id = p_user_id AND video_id = p_video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE video_history IS 'Stores user video library with metadata and transcripts for instant reload';
COMMENT ON TABLE video_collections IS 'User-created playlists/units for organizing videos';

COMMENT ON COLUMN video_history.transcript IS 'Full transcript as JSONB array: [{ text, start, duration }, ...]';
COMMENT ON COLUMN video_history.tools_used IS 'Tracks which content creation tools have been used on this video';
COMMENT ON COLUMN video_history.collections IS 'Array of collection names this video belongs to';
COMMENT ON COLUMN video_collections.video_ids IS 'Ordered array of video IDs in this collection';
COMMENT ON COLUMN video_collections.color IS 'Hex color code for visual distinction (#3b82f6 = blue)';
