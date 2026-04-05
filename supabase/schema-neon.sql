-- Flat Earth Cosmos - Database Schema for Neon Postgres

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research Notes table
CREATE TABLE IF NOT EXISTS research_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    category VARCHAR(50) DEFAULT 'cosmology',
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    camera_position JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Theories table
CREATE TABLE IF NOT EXISTS theories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    evidence TEXT[] DEFAULT '{}',
    category VARCHAR(50) DEFAULT 'cosmology',
    is_public BOOLEAN DEFAULT false,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    camera_position JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Theory Votes table
CREATE TABLE IF NOT EXISTS theory_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theory_id UUID REFERENCES theories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(theory_id, user_id)
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    camera_position JSONB,
    camera_target JSONB,
    scene_state JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussions table
CREATE TABLE IF NOT EXISTS discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    theory_id UUID REFERENCES theories(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_research_notes_user ON research_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_research_notes_category ON research_notes(category);
CREATE INDEX IF NOT EXISTS idx_research_notes_public ON research_notes(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_theories_user ON theories(user_id);
CREATE INDEX IF NOT EXISTS idx_theories_public ON theories(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_theory_votes_theory ON theory_votes(theory_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_discussions_theory ON discussions(theory_id);
CREATE INDEX IF NOT EXISTS idx_discussions_parent ON discussions(parent_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_notes_updated_at BEFORE UPDATE ON research_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theories_updated_at BEFORE UPDATE ON theories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON discussions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE theories ENABLE ROW LEVEL SECURITY;
ALTER TABLE theory_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view public research notes" ON research_notes
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own research notes" ON research_notes
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public theories" ON theories
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own theories" ON theories
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view and insert theory votes" ON theory_votes
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bookmarks" ON bookmarks
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public discussions" ON discussions
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own discussions" ON discussions
    FOR ALL USING (auth.uid() = user_id);
