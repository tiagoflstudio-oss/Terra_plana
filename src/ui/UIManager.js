import gsap from 'gsap';
import { civilizations, scriptures, topics } from '../data/civilizations.js';
import { flatEarthMath, celestialPositions } from '../data/math.js';

export class UIManager {
  constructor(app) {
    this.app = app;
    this.currentTab = 'info';
    this.init();
  }

  init() {
    this.bindEvents();
    this.populateInfoTab();
    this.populateMathTab();
    this.populateScriptureTab();
  }

  bindEvents() {
    document.querySelectorAll('.panel-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.handleTabChange(e));
    });

    document.querySelectorAll('.info-card').forEach(card => {
      card.addEventListener('click', (e) => this.handleCivilizationClick(e));
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e));
    }
  }

  handleTabChange(e) {
    const tabName = e.target.dataset.tab;
    
    document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    
    document.querySelectorAll('.panel-section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById('tab-' + tabName);
    if (section) section.classList.add('active');
    
    this.currentTab = tabName;
  }

  populateInfoTab() {
    const container = document.getElementById('civilizations-list');
    if (!container) return;

    container.innerHTML = civilizations.map(civ => `
      <div class="info-card" data-civ-id="${civ.id}">
        <div class="info-card-color" style="background-color: #${civ.color.toString(16).padStart(6, '0')}"></div>
        <div class="info-card-content">
          <h3>${civ.name}</h3>
          <p class="info-card-period">${civ.period}</p>
          <p class="info-card-preview">${civ.description.substring(0, 100)}...</p>
        </div>
      </div>
    `).join('');
  }

  populateMathTab() {
    const container = document.getElementById('math-results');
    if (!container) return;

    const results = {
      'Distância ao horizonte (1.8m)': `${flatEarthMath.distanceToHorizonMiles(6).toFixed(1)} milhas`,
      'Fase lunar atual': celestialPositions.moonPhase().name,
      'Iluminação da Lua': `${celestialPositions.moonPhase().illumination}%`,
      'Circunferência da Terra': '25.000 milhas',
      'Raio da Terra': '3.982 milhas'
    };

    container.innerHTML = Object.entries(results).map(([label, value]) => `
      <div class="math-result-item">
        <span class="math-label">${label}</span>
        <span class="math-value">${value}</span>
      </div>
    `).join('');
  }

  populateScriptureTab() {
    const container = document.getElementById('scripture-list');
    if (!container) return;

    const verses = scriptures.hebrewBible.slice(0, 10);
    container.innerHTML = verses.map(verse => `
      <div class="scripture-item">
        <span class="scripture-ref">${verse.reference}</span>
        <p class="scripture-text">${verse.text}</p>
      </div>
    `).join('');
  }

  handleCivilizationClick(e) {
    const card = e.target.closest('.info-card');
    if (!card) return;

    const civId = card.dataset.civId;
    const civ = civilizations.find(c => c.id === civId);
    if (!civ) return;

    this.showCivilizationDetails(civ);
  }

  showCivilizationDetails(civ) {
    const modal = document.getElementById('civilization-modal');
    if (!modal) return;

    const modalContent = modal.querySelector('.modal-content');
    if (!modalContent) return;

    modalContent.innerHTML = `
      <button class="modal-close" onclick="closeModal()">×</button>
      <h2>${civ.name}</h2>
      <p class="period">${civ.period}</p>
      <p class="description">${civ.description}</p>
      
      <div class="verses-section">
        <h3>Referências e Textos</h3>
        ${civ.verses.map(v => `
          <div class="verse-item">
            ${v.book ? `<strong>${v.book} ${v.chapter}:${v.verse}</strong>` : ''}
            <p>${v.text}</p>
            ${v.source ? `<cite>${v.source}</cite>` : ''}
          </div>
        `).join('')}
      </div>
    `;

    modal.style.display = 'flex';
    gsap.from(modalContent, { scale: 0.8, opacity: 0, duration: 0.3 });
  }

  handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.info-card');
    
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? 'flex' : 'none';
    });
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    gsap.fromTo(toast, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.3 }
    );
    
    setTimeout(() => {
      gsap.to(toast, { y: 50, opacity: 0, duration: 0.3, onComplete: () => toast.remove() });
    }, 3000);
  }
}

export function closeModal() {
  const modal = document.getElementById('civilization-modal');
  if (modal) modal.style.display = 'none';
}

if (typeof window !== 'undefined') {
  window.closeModal = closeModal;
}

export default UIManager;
