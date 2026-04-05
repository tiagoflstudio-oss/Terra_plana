// Flat Earth Cosmos - UI Integration
import { sql, isConfigured } from '../crud/database.js';
import { auth, notes, theories, bookmarks } from '../crud/notes.js';

class UIIntegration {
  constructor() {
    this.currentUser = null;
    this.init();
  }

  async init() {
    console.log('🔗 Inicializando integração UI...');
    console.log('📊 Banco configurado:', isConfigured());
    
    await this.checkSession();
    this.setupAuthModals();
    this.setupResearchPanel();
    this.updateAuthUI();
  }

  async checkSession() {
    // Por enquanto, usuário não logado
    // Futuramente: verificar sessão no banco
    this.currentUser = null;
  }

  setupAuthModals() {
    // Login button
    document.getElementById('login-btn')?.addEventListener('click', () => {
      this.showModal('login');
    });

    // Register button
    document.getElementById('register-btn')?.addEventListener('click', () => {
      this.showModal('register');
    });
  }

  showModal(type) {
    const modal = document.getElementById('auth-modal');
    if (!modal) {
      this.createAuthModal();
      return this.showModal(type);
    }

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (type === 'login') {
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
    } else {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
    }

    modal.style.display = 'flex';
  }

  hideModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.style.display = 'none';
  }

  createAuthModal() {
    const modalHTML = `
      <div id="auth-modal" class="auth-modal">
        <div class="auth-modal-content">
          <button class="auth-close" onclick="window.uiIntegration?.hideModal()">&times;</button>
          
          <!-- Login Form -->
          <form id="login-form" class="auth-form">
            <h2>Entrar</h2>
            <div class="form-group">
              <input type="email" id="login-email" placeholder="Email" required>
            </div>
            <div class="form-group">
              <input type="password" id="login-password" placeholder="Senha" required>
            </div>
            <button type="submit" class="auth-submit">Entrar</button>
            <p class="auth-switch">Não tem conta? <a href="#" onclick="document.getElementById('register-form').style.display='block';document.getElementById('login-form').style.display='none';return false;">Cadastrar</a></p>
          </form>

          <!-- Register Form -->
          <form id="register-form" class="auth-form" style="display:none;">
            <h2>Cadastrar</h2>
            <div class="form-group">
              <input type="text" id="register-username" placeholder="Nome de usuário" required>
            </div>
            <div class="form-group">
              <input type="email" id="register-email" placeholder="Email" required>
            </div>
            <div class="form-group">
              <input type="password" id="register-password" placeholder="Senha" required>
            </div>
            <button type="submit" class="auth-submit">Cadastrar</button>
            <p class="auth-switch">Já tem conta? <a href="#" onclick="document.getElementById('login-form').style.display='block';document.getElementById('register-form').style.display='none';return false;">Entrar</a></p>
          </form>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .auth-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 2000;
      }
      .auth-modal-content {
        background: linear-gradient(180deg, rgba(10, 21, 53, 0.98) 0%, rgba(5, 10, 20, 0.99) 100%);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 30px;
        width: 350px;
        position: relative;
      }
      .auth-close {
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 1.5rem;
        cursor: pointer;
      }
      .auth-form h2 {
        font-family: 'Cinzel', serif;
        color: var(--accent);
        margin-bottom: 20px;
        text-align: center;
      }
      .form-group {
        margin-bottom: 15px;
      }
      .form-group input {
        width: 100%;
        padding: 12px;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid var(--border);
        border-radius: 6px;
        color: var(--text);
        font-family: 'EB Garamond', serif;
      }
      .auth-submit {
        width: 100%;
        padding: 12px;
        background: var(--accent);
        border: none;
        border-radius: 6px;
        color: var(--bg);
        font-family: 'Cinzel', serif;
        font-weight: 600;
        cursor: pointer;
        margin-top: 10px;
      }
      .auth-submit:hover {
        box-shadow: 0 0 15px rgba(240, 192, 96, 0.5);
      }
      .auth-switch {
        text-align: center;
        margin-top: 15px;
        font-size: 0.85rem;
        color: var(--text-muted);
      }
      .auth-switch a {
        color: var(--accent);
        cursor: pointer;
      }
      .auth-message {
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 15px;
        text-align: center;
        font-size: 0.85rem;
      }
      .auth-message.success {
        background: rgba(76, 175, 80, 0.2);
        border: 1px solid #4caf50;
        color: #4caf50;
      }
      .auth-message.error {
        background: rgba(244, 67, 54, 0.2);
        border: 1px solid #f44336;
        color: #f44336;
      }
    `;
    document.head.appendChild(style);
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Setup form handlers
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleLogin();
    });

    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleRegister();
    });
  }

  async handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const result = await auth.login(email, password);
      
      if (result.error) {
        this.showAuthMessage(result.error, 'error');
      } else {
        this.currentUser = result.data;
        this.hideModal();
        this.updateAuthUI();
        this.loadUserNotes();
        this.showAuthMessage('Login realizado com sucesso!', 'success');
      }
    } catch (e) {
      this.showAuthMessage('Erro ao fazer login', 'error');
    }
  }

  async handleRegister() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
      const result = await auth.register(username, email, password);
      
      if (result.error) {
        this.showAuthMessage(result.error, 'error');
      } else {
        this.currentUser = result.data;
        this.hideModal();
        this.updateAuthUI();
        this.showAuthMessage('Cadastro realizado com sucesso!', 'success');
      }
    } catch (e) {
      this.showAuthMessage('Erro ao cadastrar', 'error');
    }
  }

  showAuthMessage(message, type) {
    const form = document.querySelector('.auth-form:not([style*="display: none"])');
    if (!form) return;

    const existing = form.querySelector('.auth-message');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.className = `auth-message ${type}`;
    msg.textContent = message;
    form.insertBefore(msg, form.firstChild);
  }

  logout() {
    this.currentUser = null;
    this.updateAuthUI();
    this.showAuthMessage('Logout realizado', 'success');
  }

  updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    if (this.currentUser) {
      if (loginBtn) loginBtn.textContent = this.currentUser.username;
      if (loginBtn) loginBtn.onclick = () => this.logout();
      if (registerBtn) registerBtn.style.display = 'none';
    } else {
      if (loginBtn) {
        loginBtn.textContent = 'Entrar';
        loginBtn.onclick = () => this.showModal('login');
      }
      if (registerBtn) registerBtn.style.display = 'block';
    }
  }

  // ====== RESEARCH PANEL ======
  setupResearchPanel() {
    // Setup botão de adicionar nota
    const addNoteBtn = document.getElementById('add-note-btn');
    if (addNoteBtn) {
      addNoteBtn.addEventListener('click', () => this.showNoteForm());
    }
  }

  showNoteForm(note = null) {
    const panel = document.getElementById('tab-pesquisa');
    if (!panel) return;

    const isEdit = note ? true : false;
    const formHTML = `
      <div class="note-form">
        <h3>${isEdit ? 'Editar Nota' : 'Nova Nota'}</h3>
        <div class="form-group">
          <input type="text" id="note-title" placeholder="Título" value="${note?.title || ''}">
        </div>
        <div class="form-group">
          <textarea id="note-content" placeholder="Conteúdo da nota..." rows="4">${note?.content || ''}</textarea>
        </div>
        <div class="form-group">
          <select id="note-category">
            <option value="cosmology" ${note?.category === 'cosmology' ? 'selected' : ''}>Cosmologia</option>
            <option value="scripture" ${note?.category === 'scripture' ? 'selected' : ''}>Escrituras</option>
            <option value="math" ${note?.category === 'math' ? 'selected' : ''}>Matemática</option>
            <option value="history" ${note?.category === 'history' ? 'selected' : ''}>História</option>
            <option value="theory" ${note?.category === 'theory' ? 'selected' : ''}>Teoria</option>
          </select>
        </div>
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" id="note-public" ${note?.is_public ? 'checked' : ''}>
            Tornar pública
          </label>
        </div>
        <div class="form-buttons">
          <button class="btn-save" onclick="window.uiIntegration?.saveNote('${note?.id || ''}')">Salvar</button>
          <button class="btn-cancel" onclick="window.uiIntegration?.cancelNoteForm()">Cancelar</button>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .note-form {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 15px;
      }
      .note-form h3 {
        font-family: 'Cinzel', serif;
        color: var(--accent);
        margin-bottom: 15px;
      }
      .note-form input, .note-form textarea, .note-form select {
        width: 100%;
        padding: 10px;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid var(--border);
        border-radius: 4px;
        color: var(--text);
        font-family: 'EB Garamond', serif;
        margin-bottom: 10px;
      }
      .note-form textarea {
        resize: vertical;
      }
      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.85rem;
        color: var(--text-muted);
        cursor: pointer;
      }
      .form-buttons {
        display: flex;
        gap: 10px;
      }
      .btn-save, .btn-cancel {
        flex: 1;
        padding: 10px;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'Cinzel', serif;
      }
      .btn-save {
        background: var(--accent);
        border: none;
        color: var(--bg);
      }
      .btn-cancel {
        background: transparent;
        border: 1px solid var(--border);
        color: var(--text);
      }
    `;
    document.head.appendChild(style);

    // Show form
    const existingForm = panel.querySelector('.note-form');
    if (existingForm) existingForm.remove();

    panel.insertAdjacentHTML('afterbegin', formHTML);
  }

  cancelNoteForm() {
    const form = document.querySelector('.note-form');
    if (form) form.remove();
  }

  async saveNote(noteId = '') {
    if (!this.currentUser) {
      this.showAuthMessage('Faça login para salvar notas', 'error');
      return;
    }

    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const category = document.getElementById('note-category').value;
    const isPublic = document.getElementById('note-public').checked;

    if (!title || !content) {
      this.showAuthMessage('Preencha título e conteúdo', 'error');
      return;
    }

    const noteData = {
      title,
      content,
      category,
      isPublic,
      cameraPosition: this.getCameraPosition()
    };

    try {
      let result;
      if (noteId) {
        result = await notes.update(noteId, this.currentUser.id, noteData);
      } else {
        result = await notes.create(this.currentUser.id, noteData);
      }

      if (result.error) {
        this.showAuthMessage(result.error, 'error');
      } else {
        this.showAuthMessage('Nota salva com sucesso!', 'success');
        this.cancelNoteForm();
        this.loadUserNotes();
      }
    } catch (e) {
      this.showAuthMessage('Erro ao salvar nota', 'error');
    }
  }

  getCameraPosition() {
    const app = window.app;
    if (!app?.sceneManager) return null;
    
    const camera = app.sceneManager.getCamera();
    return {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    };
  }

  async loadUserNotes() {
    if (!this.currentUser) return;

    const result = await notes.getAll(this.currentUser.id);
    this.renderNotes(result.data || []);
  }

  async loadPublicNotes() {
    const result = await notes.getPublic(20);
    this.renderNotes(result.data || [], true);
  }

  renderNotes(notesList, isPublic = false) {
    const panel = document.getElementById('tab-pesquisa');
    if (!panel) return;

    const notesHTML = notesList.map(note => `
      <div class="note-card">
        <h4>${note.title}</h4>
        <p>${note.content.substring(0, 100)}...</p>
        <div class="note-meta">
          <span class="note-category">${note.category}</span>
          <span class="note-date">${new Date(note.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    `).join('');

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .note-card {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid var(--border);
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.3s;
      }
      .note-card:hover {
        border-color: var(--accent);
        box-shadow: 0 0 10px rgba(240, 192, 96, 0.2);
      }
      .note-card h4 {
        font-family: 'Cinzel', serif;
        color: var(--accent);
        font-size: 0.9rem;
        margin-bottom: 8px;
      }
      .note-card p {
        font-size: 0.8rem;
        color: var(--text);
        line-height: 1.4;
      }
      .note-meta {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 0.7rem;
      }
      .note-category {
        background: rgba(26, 74, 144, 0.5);
        padding: 2px 8px;
        border-radius: 10px;
        color: var(--accent2);
      }
      .note-date {
        color: var(--text-muted);
      }
    `;
    document.head.appendChild(style);

    // Add "Add Note" button if logged in
    let html = '';
    if (this.currentUser) {
      html = `<button class="add-note-btn" onclick="window.uiIntegration?.showNoteForm()">+ Nova Nota</button>`;
    }
    html += notesHTML;

    panel.innerHTML = html;
  }

  // ====== BOOKMARKS ======
  async saveBookmark(name) {
    if (!this.currentUser) return;

    const app = window.app;
    const camera = app?.sceneManager?.getCamera();

    const bookmarkData = {
      name: name || `Bookmark ${new Date().toLocaleString()}`,
      position: {
        x: camera?.position.x,
        y: camera?.position.y,
        z: camera?.position.z
      },
      target: camera ? {
        x: camera.target.x,
        y: camera.target.y,
        z: camera.target.z
      } : null,
      sceneState: {}
    };

    const result = await bookmarks.save(this.currentUser.id, bookmarkData);
    if (result.error) {
      console.error('Erro ao salvar bookmark:', result.error);
    } else {
      console.log('Bookmark salvo!');
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.uiIntegration = new UIIntegration();
});

export default UIIntegration;