import { sql, isConfigured } from './database.js';

export const auth = {
  register: async (username, email, password) => {
    if (!isConfigured()) {
      return { error: 'Banco de dados não configurado' };
    }
    
    try {
      const passwordHash = await hashPassword(password);
      const result = await sql`
        INSERT INTO users (username, email, password_hash)
        VALUES (${username}, ${email}, ${passwordHash})
        RETURNING id, username, email
      `;
      return { data: result[0] };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  login: async (email, password) => {
    if (!isConfigured()) {
      return { error: 'Banco de dados não configurado' };
    }
    
    try {
      const result = await sql`
        SELECT id, username, email, avatar_url, bio
        FROM users
        WHERE email = ${email}
      `;
      
      if (result.length === 0) {
        return { error: 'Usuário não encontrado' };
      }
      
      const user = result[0];
      const valid = await verifyPassword(password, user.password_hash);
      
      if (!valid) {
        return { error: 'Senha incorreta' };
      }
      
      return { data: { id: user.id, username: user.username, email: user.email } };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  getProfile: async (userId) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const result = await sql`
        SELECT id, username, email, avatar_url, bio, created_at
        FROM users WHERE id = ${userId}
      `;
      return { data: result[0] || null };
    } catch (error) {
      return { error: error.message };
    }
  }
};

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password, hash) {
  const inputHash = await hashPassword(password);
  return inputHash === hash;
}

export const notes = {
  create: async (userId, note) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const result = await sql`
        INSERT INTO research_notes (user_id, title, content, category, tags, is_public, camera_position)
        VALUES (${userId}, ${note.title}, ${note.content}, ${note.category || 'cosmology'}, 
                ${note.tags || []}, ${note.isPublic || false}, ${JSON.stringify(note.cameraPosition || null)})
        RETURNING *
      `;
      return { data: result[0] };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  getAll: async (userId) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const result = await sql`
        SELECT * FROM research_notes 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;
      return { data: result };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  getPublic: async (limit = 20) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const result = await sql`
        SELECT rn.*, u.username, u.avatar_url
        FROM research_notes rn
        JOIN users u ON rn.user_id = u.id
        WHERE rn.is_public = true
        ORDER BY rn.created_at DESC
        LIMIT ${limit}
      `;
      return { data: result };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  update: async (noteId, userId, updates) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const fields = [];
      const values = [];
      
      if (updates.title) { fields.push('title = $1'); values.push(updates.title); }
      if (updates.content) { fields.push('content = $2'); values.push(updates.content); }
      if (updates.category) { fields.push('category = $3'); values.push(updates.category); }
      if (updates.tags) { fields.push('tags = $4'); values.push(updates.tags); }
      
      values.push(noteId, userId);
      
      const result = await sql`
        UPDATE research_notes SET ${sql(fields.join(', '))}
        WHERE id = ${noteId} AND user_id = ${userId}
        RETURNING *
      `;
      return { data: result[0] };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  delete: async (noteId, userId) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      await sql`
        DELETE FROM research_notes WHERE id = ${noteId} AND user_id = ${userId}
      `;
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }
};

export const theories = {
  create: async (userId, theory) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const result = await sql`
        INSERT INTO theories (user_id, title, description, evidence, category, is_public, camera_position)
        VALUES (${userId}, ${theory.title}, ${theory.description}, ${JSON.stringify(theory.evidence || [])},
                ${theory.category || 'cosmology'}, ${theory.isPublic || false}, ${JSON.stringify(theory.cameraPosition || null)})
        RETURNING *
      `;
      return { data: result[0] };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  getAll: async (userId) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const result = await sql`
        SELECT * FROM theories WHERE user_id = ${userId} ORDER BY created_at DESC
      `;
      return { data: result };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  getPublic: async (limit = 20) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const result = await sql`
        SELECT t.*, u.username, u.avatar_url
        FROM theories t
        JOIN users u ON t.user_id = u.id
        WHERE t.is_public = true
        ORDER BY t.created_at DESC
        LIMIT ${limit}
      `;
      return { data: result };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  vote: async (theoryId, userId, voteType) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      await sql`
        INSERT INTO theory_votes (theory_id, user_id, vote_type)
        VALUES (${theoryId}, ${userId}, ${voteType})
        ON CONFLICT (theory_id, user_id) DO UPDATE SET vote_type = ${voteType}
      `;
      
      await sql`
        UPDATE theories t SET 
          upvotes = (SELECT COUNT(*) FROM theory_votes WHERE theory_id = ${theoryId} AND vote_type = 'upvote'),
          downvotes = (SELECT COUNT(*) FROM theory_votes WHERE theory_id = ${theoryId} AND vote_type = 'downvote')
        WHERE t.id = ${theoryId}
      `;
      
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }
};

export const bookmarks = {
  save: async (userId, bookmark) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const result = await sql`
        INSERT INTO bookmarks (user_id, name, camera_position, camera_target, scene_state)
        VALUES (${userId}, ${bookmark.name}, ${JSON.stringify(bookmark.position)},
                ${JSON.stringify(bookmark.target || null)}, ${JSON.stringify(bookmark.sceneState || {})})
        RETURNING *
      `;
      return { data: result[0] };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  getAll: async (userId) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const result = await sql`
        SELECT * FROM bookmarks WHERE user_id = ${userId} ORDER BY created_at DESC
      `;
      return { data: result };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  delete: async (bookmarkId, userId) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      await sql`DELETE FROM bookmarks WHERE id = ${bookmarkId} AND user_id = ${userId}`;
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }
};

export default { auth, notes, theories, bookmarks };
