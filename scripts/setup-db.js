import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_DEs3hXAFpyQ2@ep-fancy-star-acabmfi6-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function runSchema() {
  console.log('🔌 Conectando ao banco de dados Neon...');
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Conectado!');
    
    // SQL completo do schema
    const schemaSQL = `
-- Tabela users
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

-- Tabela research_notes
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

-- Tabela theories
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

-- Tabela theory_votes
CREATE TABLE IF NOT EXISTS theory_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theory_id UUID REFERENCES theories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(theory_id, user_id)
);

-- Tabela bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    camera_position JSONB,
    camera_target JSONB,
    scene_state JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela discussions
CREATE TABLE IF NOT EXISTS discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    theory_id UUID REFERENCES theories(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- indexes
CREATE INDEX IF NOT EXISTS idx_research_notes_user ON research_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_research_notes_category ON research_notes(category);
CREATE INDEX IF NOT EXISTS idx_research_notes_public ON research_notes(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_theories_user ON theories(user_id);
CREATE INDEX IF NOT EXISTS idx_theories_public ON theories(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_theory_votes_theory ON theory_votes(theory_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_discussions_theory ON discussions(theory_id);
CREATE INDEX IF NOT EXISTS idx_discussions_parent ON discussions(parent_id);

-- Função para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_notes_updated_at BEFORE UPDATE ON research_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theories_updated_at BEFORE UPDATE ON theories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON discussions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;
    
    console.log('📦 Criando tabelas...');
    await client.query(schemaSQL);
    console.log('✅ Tabelas criadas!');
    
    // Verificar tabelas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Tabelas no banco:');
    tables.rows.forEach(t => console.log(`  ✓ ${t.table_name}`));
    console.log('\n🎉 Banco de dados configurado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

runSchema();