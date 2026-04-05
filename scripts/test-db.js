import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://neondb_owner:npg_DEs3hXAFpyQ2@ep-fancy-star-acabmfi6-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require';

async function testDatabase() {
  console.log('🧪 Testando conexão com banco de dados Neon...\n');
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Conexão estabelecida!');
    
    // Teste simples
    const test = await client.query('SELECT 1 as result');
    console.log('✅ Query executada:', test.rows[0].result);
    
    // Verificar tabelas
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' ORDER BY table_name
    `);
    console.log('✅ Tabelas:', tables.rows.map(t => t.table_name).join(', '));
    
    // Testar CRUD básico
    console.log('\n📝 Testando operações CRUD...');
    
    // Inserir usuário teste
    const userResult = await client.query(`
      INSERT INTO users (username, email, password_hash)
      VALUES ('test_user', 'test@example.com', 'test123')
      ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
      RETURNING id, username
    `);
    console.log('✅ Usuário:', userResult.rows[0].username);
    
    // Inserir nota teste
    const noteResult = await client.query(`
      INSERT INTO research_notes (user_id, title, content, category, is_public)
      VALUES ($1, 'Nota de Teste', 'Esta é uma nota de teste do Flat Earth Cosmos', 'cosmology', true)
      RETURNING id, title
    `, [userResult.rows[0].id]);
    console.log('✅ Nota criada:', noteResult.rows[0].title);
    
    // Buscar notas públicas
    const notes = await client.query(`
      SELECT * FROM research_notes WHERE is_public = true
    `);
    console.log('✅ Notas públicas:', notes.rows.length);
    
    console.log('\n🎉 Todos os testes passaram!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

testDatabase();