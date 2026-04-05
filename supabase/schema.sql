-- =====================================================
-- FLAT EARTH COSMOS - SCHEMA DO BANCO DE DADOS
-- Supabase / Vercel Postgres
-- =====================================================

-- =====================================================
-- TABELA: users (autenticação básica)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: research_notes (anotações de pesquisa)
-- =====================================================
CREATE TABLE IF NOT EXISTS research_notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('cosmology', 'scripture', 'math', 'history', 'theory')) DEFAULT 'cosmology',
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    camera_position JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON research_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_category ON research_notes(category);
CREATE INDEX IF NOT EXISTS idx_notes_is_public ON research_notes(is_public) WHERE is_public = true;

-- =====================================================
-- TABELA: theories (teorias e hipóteses)
-- =====================================================
CREATE TABLE IF NOT EXISTS theories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    evidence JSONB DEFAULT '[]',
    category VARCHAR(50) DEFAULT 'cosmology',
    is_public BOOLEAN DEFAULT false,
    camera_position JSONB,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_theories_user_id ON theories(user_id);
CREATE INDEX IF NOT EXISTS idx_theories_public ON theories(is_public) WHERE is_public = true;

-- =====================================================
-- TABELA: theory_votes (votos nas teorias)
-- =====================================================
CREATE TABLE IF NOT EXISTS theory_votes (
    id SERIAL PRIMARY KEY,
    theory_id INTEGER REFERENCES theories(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(theory_id, user_id)
);

-- =====================================================
-- TABELA: bookmarks (salvar posições da câmera)
-- =====================================================
CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    camera_position JSONB NOT NULL,
    camera_target JSONB,
    scene_state JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);

-- =====================================================
-- TABELA: flood_simulations (simulações do dilúvio)
-- =====================================================
CREATE TABLE IF NOT EXISTS flood_simulations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100),
    parameters JSONB DEFAULT '{}',
    result JSONB,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: cosmic_clock_events (eventos do relógio cósmico)
-- =====================================================
CREATE TABLE IF NOT EXISTS cosmic_clock_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    date_value DATE,
    description TEXT,
    biblical_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FUNÇÕES ÚTEIS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at nas notas
CREATE TRIGGER update_notes_updated_at 
    BEFORE UPDATE ON research_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar updated_at nas teorias
CREATE TRIGGER update_theories_updated_at 
    BEFORE UPDATE ON theories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INSERTS DE EXEMPLO (dados iniciais)
-- =====================================================

-- Usuário admin exemplo (password: flatcosmos2024)
-- INSERT INTO users (username, email, password_hash) 
-- VALUES ('admin', 'admin@flatearthcosmos.com', '$2a$10$...');

-- Nota exemplo pública
-- INSERT INTO research_notes (user_id, title, content, category, is_public)
-- VALUES (1, 'Sobre o Firmamento', 'O firmamento (raQia) é descrito como uma abóbada sólida...', 'cosmology', true);
