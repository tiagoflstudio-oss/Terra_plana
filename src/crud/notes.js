import { supabase, isConfigured } from './database.js';

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

export const auth = {
  register: async (username, email, password) => {
    if (!isConfigured()) {
      return { error: 'Banco de dados não configurado. Configure Supabase.' };
    }
    
    try {
      const passwordHash = await hashPassword(password);
      const { data, error } = await supabase
        .from('users')
        .insert({ username, email, password_hash: passwordHash })
        .select('id, username, email')
        .single();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  login: async (email, password) => {
    if (!isConfigured()) {
      return { error: 'Banco de dados não configurado. Configure Supabase.' };
    }
    
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, username, email, password_hash, avatar_url, bio')
        .eq('email', email)
        .single();
      
      if (error || !users) {
        return { error: 'Usuário não encontrado' };
      }
      
      const valid = await verifyPassword(password, users.password_hash);
      if (!valid) {
        return { error: 'Senha incorreta' };
      }
      
      return { data: { id: users.id, username: users.username, email: users.email } };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  getProfile: async (userId) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, avatar_url, bio, created_at')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  }
};

export const notes = {
  create: async (userId, note) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const { data, error } = await supabase
        .from('research_notes')
        .insert({
          user_id: userId,
          title: note.title,
          content: note.content,
          category: note.category || 'cosmology',
          tags: note.tags || [],
          is_public: note.isPublic || false,
          camera_position: note.cameraPosition || null
        })
        .select()
        .single();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  getAll: async (userId) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const { data, error } = await supabase
        .from('research_notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data: data || [] };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  getPublic: async (limit = 20) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const { data, error } = await supabase
        .from('research_notes')
        .select('*, users(username, avatar_url)')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return { data: data || [] };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  update: async (noteId, userId, updates) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const { data, error } = await supabase
        .from('research_notes')
        .update({
          title: updates.title,
          content: updates.content,
          category: updates.category,
          tags: updates.tags
        })
        .eq('id', noteId)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  delete: async (noteId, userId) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const { error } = await supabase
        .from('research_notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', userId);
      
      if (error) throw error;
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
      const { data, error } = await supabase
        .from('theories')
        .insert({
          user_id: userId,
          title: theory.title,
          description: theory.description,
          evidence: theory.evidence || [],
          category: theory.category || 'cosmology',
          is_public: theory.isPublic || false,
          camera_position: theory.cameraPosition || null
        })
        .select()
        .single();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  getAll: async (userId) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const { data, error } = await supabase
        .from('theories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data: data || [] };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  getPublic: async (limit = 20) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const { data, error } = await supabase
        .from('theories')
        .select('*, users(username, avatar_url)')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return { data: data || [] };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  vote: async (theoryId, userId, voteType) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const { error: upsertError } = await supabase
        .from('theory_votes')
        .upsert({
          theory_id: theoryId,
          user_id: userId,
          vote_type: voteType
        }, {
          onConflict: 'theory_id,user_id'
        });
      
      if (upsertError) throw upsertError;
      
      const { data: upvotes } = await supabase
        .from('theory_votes')
        .select('id', { count: 'exact' })
        .eq('theory_id', theoryId)
        .eq('vote_type', 'upvote');
      
      const { data: downvotes } = await supabase
        .from('theory_votes')
        .select('id', { count: 'exact' })
        .eq('theory_id', theoryId)
        .eq('vote_type', 'downvote');
      
      await supabase
        .from('theories')
        .update({ 
          upvotes: upvotes?.length || 0,
          downvotes: downvotes?.length || 0
        })
        .eq('id', theoryId);
      
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
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          name: bookmark.name,
          camera_position: bookmark.position,
          camera_target: bookmark.target || null,
          scene_state: bookmark.sceneState || {}
        })
        .select()
        .single();
      
      if (error) throw error;
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  getAll: async (userId) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data: data || [] };
    } catch (error) {
      return { error: error.message };
    }
  },
  
  delete: async (bookmarkId, userId) => {
    if (!isConfigured()) return { error: 'Banco não configurado' };
    
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId)
        .eq('user_id', userId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }
};

export default { auth, notes, theories, bookmarks };
