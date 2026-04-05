import { 
  biblicalYearsSinceCreation, 
  daysSinceFlood, 
  sarosCycle,
  moonPhase,
  sunOrbitPosition 
} from '../utils/math3d.js';

export class CosmicClock {
  constructor(container) {
    this.container = container;
    this.time = new Date();
    this.isHistoricalMode = false;
    this.historicalYear = new Date().getFullYear();
    
    this.init();
  }
  
  init() {
    this.clockDiv = document.createElement('div');
    this.clockDiv.className = 'cosmic-clock';
    this.clockDiv.innerHTML = `
      <div class="clock-header">
        <span class="clock-title">⏱ Relógio Cósmico</span>
        <button class="clock-close">×</button>
      </div>
      <div class="clock-display">
        <div class="clock-section" id="current-time">
          <span class="clock-label">Tempo Atual</span>
          <span class="clock-value" id="clock-time">--:--:--</span>
          <span class="clock-date" id="clock-date">--</span>
        </div>
        <div class="clock-section" id="biblical-time">
          <span class="clock-label">Desde a Criação</span>
          <span class="clock-value" id="years-creation">---</span>
          <span class="clock-unit">anos</span>
        </div>
        <div class="clock-section" id="flood-time">
          <span class="clock-label">Desde o Dilúvio</span>
          <span class="clock-value" id="days-flood">---</span>
          <span class="clock-unit">dias</span>
        </div>
        <div class="clock-section" id="saros-info">
          <span class="clock-label">Ciclo Saros</span>
          <span class="clock-value" id="saros-cycles">---</span>
          <span class="clock-unit">ciclos</span>
        </div>
      </div>
      <div class="moon-phase-display">
        <span class="clock-label">Fase da Lua</span>
        <div class="moon-icon" id="moon-icon">🌙</div>
        <span class="moon-name" id="moon-name">--</span>
      </div>
      <div class="orbit-position">
        <span class="clock-label">Posição do Sol</span>
        <div class="orbit-indicator">
          <div class="orbit-sun" id="orbit-sun"></div>
        </div>
        <span class="orbit-season" id="orbit-season">--</span>
      </div>
      <div class="time-travel">
        <span class="clock-label">Viagem no Tempo</span>
        <input type="range" class="time-slider" id="time-slider" min="-4004" max="3000" value="2024">
        <span class="time-year" id="time-year">2024</span>
      </div>
    `;
    this.container.appendChild(this.clockDiv);
    
    this.setupEventListeners();
    this.startClock();
  }
  
  setupEventListeners() {
    this.clockDiv.querySelector('.clock-close').addEventListener('click', () => {
      this.clockDiv.classList.remove('visible');
    });
    
    this.clockDiv.querySelector('#time-slider').addEventListener('input', (e) => {
      this.historicalYear = parseInt(e.target.value);
      this.clockDiv.querySelector('#time-year').textContent = this.historicalYear;
      this.updateHistoricalData();
    });
  }
  
  startClock() {
    const update = () => {
      this.time = new Date();
      this.updateDisplay();
      requestAnimationFrame(update);
    };
    update();
  }
  
  updateDisplay() {
    const hours = this.time.getHours().toString().padStart(2, '0');
    const minutes = this.time.getMinutes().toString().padStart(2, '0');
    const seconds = this.time.getSeconds().toString().padStart(2, '0');
    
    this.clockDiv.querySelector('#clock-time').textContent = `${hours}:${minutes}:${seconds}`;
    this.clockDiv.querySelector('#clock-date').textContent = this.time.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const years = biblicalYearsSinceCreation();
    this.clockDiv.querySelector('#years-creation').textContent = years;
    
    const days = daysSinceFlood();
    this.clockDiv.querySelector('#days-flood').textContent = days.toLocaleString('pt-BR');
    
    const saros = sarosCycle();
    this.clockDiv.querySelector('#saros-cycles').textContent = saros.cyclesSince2009;
    
    const phase = moonPhase(this.time);
    this.clockDiv.querySelector('#moon-icon').textContent = this.getMoonEmoji(phase.phase);
    this.clockDiv.querySelector('#moon-name').textContent = phase.name;
    
    const dayOfYear = Math.floor((this.time - new Date(this.time.getFullYear(), 0, 0)) / 86400000);
    const sunPos = sunOrbitPosition(dayOfYear, this.time.getHours());
    const orbitSun = this.clockDiv.querySelector('#orbit-sun');
    const angle = Math.atan2(sunPos.z, sunPos.x) * (180 / Math.PI) + 90;
    orbitSun.style.transform = `rotate(${angle}deg)`;
    
    this.clockDiv.querySelector('#orbit-season').textContent = this.getSeason(dayOfYear);
  }
  
  updateHistoricalData() {
    this.clockDiv.querySelector('#clock-date').textContent = `Ano ${this.historicalYear}`;
  }
  
  getMoonEmoji(phase) {
    const emojis = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
    return emojis[phase];
  }
  
  getSeason(dayOfYear) {
    if (dayOfYear < 80 || dayOfYear >= 355) return 'Inverno';
    if (dayOfYear < 172) return 'Primavera';
    if (dayOfYear < 266) return 'Verão';
    return 'Outono';
  }
  
  show() {
    this.clockDiv.classList.add('visible');
  }
  
  hide() {
    this.clockDiv.classList.remove('visible');
  }
  
  destroy() {
    if (this.clockDiv && this.clockDiv.parentNode) {
      this.clockDiv.parentNode.removeChild(this.clockDiv);
    }
  }
}

export default CosmicClock;
