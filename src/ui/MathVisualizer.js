import { sunOrbitPosition, moonPhase, sarosCycle, geoToDisc, flatEarthSunHeight } from '../utils/math3d.js';

export class MathVisualizer {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    
    this.width = 400;
    this.height = 300;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = '100%';
    this.canvas.style.height = 'auto';
    
    this.currentView = 'solarOrbit';
    this.animationFrame = null;
    this.time = 0;
    this.isPlaying = true;
    
    this.dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    
    this.initControls();
    this.startAnimation();
  }
  
  initControls() {
    this.controlsDiv = document.createElement('div');
    this.controlsDiv.className = 'math-controls';
    this.controlsDiv.innerHTML = `
      <div class="math-tabs">
        <button class="math-tab active" data-view="solarOrbit">Órbita Solar</button>
        <button class="math-tab" data-view="saros">Ciclo Saros</button>
        <button class="math-tab" data-view="eratosthenes">Eratóstenes</button>
        <button class="math-tab" data-view="moonPhase">Fases da Lua</button>
      </div>
      <div class="math-buttons">
        <button class="math-btn" id="mathPlayPause">⏸</button>
        <button class="math-btn" id="mathExport">📷</button>
      </div>
    `;
    this.container.appendChild(this.controlsDiv);
    
    this.controlsDiv.querySelectorAll('.math-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.controlsDiv.querySelectorAll('.math-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.currentView = e.target.dataset.view;
      });
    });
    
    document.getElementById('mathPlayPause').addEventListener('click', () => {
      this.isPlaying = !this.isPlaying;
      document.getElementById('mathPlayPause').textContent = this.isPlaying ? '⏸' : '▶';
    });
    
    document.getElementById('mathExport').addEventListener('click', () => {
      this.exportImage();
    });
  }
  
  startAnimation() {
    const animate = () => {
      if (this.isPlaying) {
        this.time += 0.016;
      }
      this.render();
      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }
  
  render() {
    const ctx = this.ctx;
    ctx.fillStyle = '#010408';
    ctx.fillRect(0, 0, this.width, this.height);
    
    switch(this.currentView) {
      case 'solarOrbit': this.renderSolarOrbit(ctx); break;
      case 'saros': this.renderSaros(ctx); break;
      case 'eratosthenes': this.renderEratosthenes(ctx); break;
      case 'moonPhase': this.renderMoonPhase(ctx); break;
    }
  }
  
  renderSolarOrbit(ctx) {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const maxRadius = 120;
    
    ctx.strokeStyle = 'rgba(64, 128, 255, 0.2)';
    ctx.lineWidth = 1;
    
    for (let month = 0; month < 12; month++) {
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius * (0.5 + 0.4 * Math.sin(month * Math.PI / 6)), 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.strokeStyle = '#f0c060';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let day = 0; day <= 365; day++) {
      const pos = sunOrbitPosition(day);
      const x = cx + (pos.x / 1600) * maxRadius;
      const y = cy - (pos.y / 2000) * maxRadius;
      if (day === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    const currentPos = sunOrbitPosition(this.dayOfYear);
    ctx.fillStyle = '#ff8800';
    ctx.beginPath();
    ctx.arc(cx + (currentPos.x / 1600) * maxRadius, cy - (currentPos.y / 2000) * maxRadius, 8, 0, Math.PI * 2);
    ctx.fill();
    
    const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    ctx.fillStyle = '#607080';
    ctx.font = '10px "JetBrains Mono"';
    monthLabels.forEach((label, i) => {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * (maxRadius + 15);
      const y = cy + Math.sin(angle) * (maxRadius + 15);
      ctx.fillText(label, x - 10, y + 3);
    });
    
    ctx.fillStyle = '#d4c090';
    ctx.font = '12px "Cinzel"';
    ctx.fillText(`Dia ${this.dayOfYear}`, 10, 20);
    ctx.fillText('Órbita Solar Anual', 10, 38);
  }
  
  renderSaros(ctx) {
    const saros = sarosCycle();
    const cy = this.height / 2;
    
    ctx.strokeStyle = 'rgba(240, 192, 96, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, cy);
    ctx.lineTo(this.width - 30, cy);
    ctx.stroke();
    
    const years = 18;
    const eclipsePoints = [];
    for (let i = 0; i < years; i++) {
      for (let j = 0; j < 4; j++) {
        const type = (i + j) % 2 === 0 ? 'solar' : 'lunar';
        const x = 30 + (i / years) * (this.width - 60);
        const y = cy + (type === 'solar' ? -20 : 20) + Math.random() * 10;
        eclipsePoints.push({ x, y, type, year: 2024 + i });
      }
    }
    
    eclipsePoints.forEach(point => {
      ctx.fillStyle = point.type === 'solar' ? '#ffcc00' : '#aaddff';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.fillStyle = '#d4c090';
    ctx.font = '11px "Cinzel"';
    ctx.fillText(`Ciclo de Saros: ${saros.periodYears} anos`, 10, 20);
    ctx.fillText(`Próximo eclipse: ${saros.nextEclipse}`, 10, 38);
    
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(this.width - 120, 10, 10, 10);
    ctx.fillStyle = '#607080';
    ctx.fillText('Solar', this.width - 105, 20);
    
    ctx.fillStyle = '#aaddff';
    ctx.fillRect(this.width - 120, 28, 10, 10);
    ctx.fillStyle = '#607080';
    ctx.fillText('Lunar', this.width - 105, 38);
  }
  
  renderEratosthenes(ctx) {
    const cx = this.width / 2;
    const cy = this.height - 40;
    
    ctx.fillStyle = '#1a4a90';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 150, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    
    const sienaLat = 24;
    const alexLat = 31.2;
    const distance = 800;
    
    ctx.strokeStyle = '#f0c060';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(cx - 80, cy);
    ctx.lineTo(cx - 80, cy - 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 80, cy);
    ctx.lineTo(cx + 80, cy - 100);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.strokeStyle = '#ff8800';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 60, 50);
    ctx.lineTo(cx - 80, cy);
    ctx.lineTo(cx + 80, cy);
    ctx.lineTo(cx + 60, 50);
    ctx.stroke();
    
    ctx.fillStyle = '#f0c060';
    ctx.font = '11px "Cinzel"';
    ctx.fillText('Siena (7°)', cx - 100, cy + 15);
    ctx.fillText('Alexandria (7.2°)', cx + 40, cy + 15);
    ctx.fillText('Sol', cx - 15, 40);
    
    const sunHeight = flatEarthSunHeight(7.2, 800);
    ctx.fillStyle = '#d4c090';
    ctx.fillText(`Altura do Sol: ~${Math.round(sunHeight)} km`, 10, 20);
    ctx.fillText('Prova de Eratóstenes (Modelo Plano)', 10, 38);
  }
  
  renderMoonPhase(ctx) {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const radius = 80;
    
    const phase = moonPhase(new Date());
    
    ctx.fillStyle = '#0a1535';
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(240, 192, 96, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = '#cad7ff';
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#0a1535';
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    
    const phaseAngle = phase.cyclePosition * Math.PI * 2;
    ctx.beginPath();
    if (phase.cyclePosition < 0.5) {
      ctx.arc(cx, cy, radius, Math.PI / 2 - phaseAngle, Math.PI / 2 + phaseAngle);
      ctx.closePath();
    } else {
      ctx.arc(cx, cy, radius, Math.PI / 2 + phaseAngle, Math.PI / 2 - phaseAngle);
      ctx.closePath();
    }
    ctx.fill();
    ctx.restore();
    
    ctx.strokeStyle = '#f0c060';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = '#d4c090';
    ctx.font = '14px "Cinzel"';
    ctx.textAlign = 'center';
    ctx.fillText(phase.name, cx, cy + radius + 25);
    ctx.fillText(`Iluminação: ${phase.illumination}%`, cx, cy + radius + 42);
    ctx.textAlign = 'left';
  }
  
  exportImage() {
    const link = document.createElement('a');
    link.download = `flat-earth-cosmos-${this.currentView}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
  
  setDay(day) {
    this.dayOfYear = day;
  }
  
  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.container.removeChild(this.canvas);
    this.container.removeChild(this.controlsDiv);
  }
}

export default MathVisualizer;
