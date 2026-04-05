import * as THREE from 'three';
console.log('STEP 1: THREE imported');

import { SceneManager } from './scene/SceneManager.js';
console.log('STEP 2: SceneManager imported');

import { EarthBuilder } from './scene/EarthBuilder.js';
console.log('STEP 3: EarthBuilder imported');
import { DomeBuilder } from './scene/DomeBuilder.js';
import { WaterSystem } from './scene/WaterSystem.js';
import { CelestialBodies } from './scene/CelestialBodies.js';
import { StarField } from './scene/StarField.js';
import { CosmicParticles } from './scene/CosmicParticles.js';
import { FloodSimulation } from './scene/FloodSimulation.js';
import { MathVisualizer } from './ui/MathVisualizer.js';
import { CosmicClock } from './ui/CosmicClock.js';
import { AITourGuide } from './ui/AITourGuide.js';
import { sql, isConfigured, testConnection } from './crud/database.js';
import { auth, notes, theories, bookmarks } from './crud/notes.js';
import './ui/UIIntegration.js';

class FlatEarthCosmos {
  constructor() {
    this.sceneManager = null;
    this.earth = null;
    this.dome = null;
    this.waterSystem = null;
    this.celestialBodies = null;
    this.starField = null;
    this.cosmicParticles = null;
    this.floodSimulation = null;
    this.mathVisualizer = null;
    this.cosmicClock = null;
    this.tourGuide = null;
    this.isRaining = false;
    
    this.init();
  }

  init() {
    // Get canvas container
    const container = document.getElementById('canvas-container');
    if (!container) {
      console.error('Canvas container not found');
      return;
    }

    // Initialize scene manager
    this.sceneManager = new SceneManager(container);

    // Build scene objects
    this.earth = new EarthBuilder(this.sceneManager.getScene());
    this.dome = new DomeBuilder(this.sceneManager.getScene());
    this.waterSystem = new WaterSystem(this.sceneManager.getScene(), 2200);
    this.celestialBodies = new CelestialBodies(this.sceneManager.getScene(), 2200);
    this.starField = new StarField(this.sceneManager.getScene(), 2200);
    this.cosmicParticles = new CosmicParticles(this.sceneManager.getScene(), 2200);

    // Register objects for updates
    this.sceneManager.registerObject('earth', this.earth);
    this.sceneManager.registerObject('dome', this.dome);
    this.sceneManager.registerObject('water', this.waterSystem);
    this.sceneManager.registerObject('celestial', this.celestialBodies);
    this.sceneManager.registerObject('stars', this.starField);
    this.sceneManager.registerObject('particles', this.cosmicParticles);

    // Initialize Flood Simulation
    this.floodSimulation = new FloodSimulation(
      this.sceneManager.getScene(),
      this.sceneManager.getCamera(),
      this.sceneManager.getRenderer(),
      this.waterSystem
    );
    this.floodSimulation.init();

    // Setup UI interactions
    this.setupUI();

    // Register Service Worker for PWA (disabled for now)
    // this.registerServiceWorker();

    // Hide loading screen
    this.hideLoading();
  }

  setupUI() {
    // View buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.target.dataset.view;
        this.sceneManager.changeView(view);
      });
    });

    // Speed controls
    const sunSpeedSlider = document.getElementById('sun-speed');
    const moonSpeedSlider = document.getElementById('moon-speed');
    const waterIntensitySlider = document.getElementById('water-intensity');

    if (sunSpeedSlider) {
      sunSpeedSlider.addEventListener('input', (e) => {
        const speed = parseFloat(e.target.value);
        this.sceneManager.setSunSpeed(speed);
        document.getElementById('sun-speed-val').textContent = speed.toFixed(1) + 'x';
      });
    }

    if (moonSpeedSlider) {
      moonSpeedSlider.addEventListener('input', (e) => {
        const speed = parseFloat(e.target.value);
        this.sceneManager.setMoonSpeed(speed);
        document.getElementById('moon-speed-val').textContent = speed.toFixed(1) + 'x';
      });
    }

    if (waterIntensitySlider) {
      waterIntensitySlider.addEventListener('input', (e) => {
        const intensity = parseInt(e.target.value);
        this.sceneManager.setWaterIntensity(intensity);
        document.getElementById('water-val').textContent = intensity + '%';
      });
    }

    // Toggle switches
    const toggleOrbits = document.getElementById('toggle-orbits');
    const toggleLabels = document.getElementById('toggle-labels');
    const toggleDay = document.getElementById('toggle-day');

    if (toggleOrbits) {
      toggleOrbits.addEventListener('click', () => {
        toggleOrbits.classList.toggle('active');
        this.sceneManager.toggleOrbits(toggleOrbits.classList.contains('active'));
      });
    }

    if (toggleLabels) {
      toggleLabels.addEventListener('click', () => {
        toggleLabels.classList.toggle('active');
        // TODO: Toggle labels visibility
      });
    }

    if (toggleDay) {
      toggleDay.addEventListener('click', () => {
        toggleDay.classList.toggle('active');
        this.sceneManager.setDayMode(toggleDay.classList.contains('active'));
      });
    }

    // Panel tabs
    document.querySelectorAll('.panel-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        
        // Update tab buttons
        document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.panel-section').forEach(s => s.classList.remove('active'));
        const section = document.getElementById('tab-' + tabName);
        if (section) section.classList.add('active');
      });
    });

    // Auth buttons (placeholder)
    document.getElementById('login-btn')?.addEventListener('click', () => {
      console.log('Login clicked - Supabase Auth integration needed');
    });

    document.getElementById('register-btn')?.addEventListener('click', () => {
      console.log('Register clicked - Supabase Auth integration needed');
    });

    // Flood simulation button
    document.getElementById('flood-btn')?.addEventListener('click', () => {
      this.isRaining = !this.isRaining;
      const btn = document.getElementById('flood-btn');
      
      if (this.isRaining) {
        btn.classList.add('active');
        btn.textContent = 'Parar Dilúvio';
        this.cosmicParticles?.startRain();
      } else {
        btn.classList.remove('active');
        btn.textContent = 'Simular Dilúvio';
        this.cosmicParticles?.stopRain();
      }
    });
    
    // Math Visualizer button
    const mathVizBtn = document.getElementById('math-viz-btn');
    if (mathVizBtn) {
      mathVizBtn.addEventListener('click', () => {
        if (!this.mathVisualizer) {
          const container = document.getElementById('math-visualizer-container');
          if (container) {
            this.mathVisualizer = new MathVisualizer(container);
          }
        }
      });
    }
    
    // Cosmic Clock button
    const cosmicClockBtn = document.getElementById('cosmic-clock-btn');
    if (cosmicClockBtn) {
      cosmicClockBtn.addEventListener('click', () => {
        if (!this.cosmicClock) {
          this.cosmicClock = new CosmicClock(document.body);
        }
        this.cosmicClock.show();
      });
    }
    
    // Tour Guide button
    const tourGuideBtn = document.getElementById('tour-guide-btn');
    if (tourGuideBtn) {
      tourGuideBtn.addEventListener('click', () => {
        if (!this.tourGuide) {
          this.tourGuide = new AITourGuide();
          this.tourGuide.init();
        }
        this.tourGuide.open();
      });
    }

    // Flood Simulation button (new)
    const floodSimBtn = document.getElementById('flood-sim-btn');
    if (floodSimBtn) {
      floodSimBtn.addEventListener('click', () => {
        if (this.floodSimulation) {
          if (this.floodSimulation.isPlaying) {
            this.floodSimulation.stop();
            floodSimBtn.textContent = '⚡ Simulação do Dilúvio';
            floodSimBtn.classList.remove('active');
          } else {
            this.floodSimulation.play();
            floodSimBtn.textContent = '⏹ Parar Simulação';
            floodSimBtn.classList.add('active');
          }
        }
      });
    }
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('SW registered:', reg.scope))
          .catch(err => console.log('SW registration failed:', err));
      });
    }
  }

  hideLoading() {
    setTimeout(() => {
      const loading = document.getElementById('loading');
      if (loading) {
        loading.classList.add('hidden');
      }
    }, 1500);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Starting FlatEarthCosmos...');
    
    // Test Three.js availability
    if (typeof THREE === 'undefined') {
      throw new Error('THREE.js not loaded');
    }
    console.log('THREE.js version:', THREE.REVISION);
    
    window.app = new FlatEarthCosmos();
    
    // Wait a bit and check if initialized
    setTimeout(() => {
      if (!window.app.sceneManager) {
        console.error('SceneManager not initialized');
      } else {
        console.log('App initialized successfully');
      }
    }, 2000);
  } catch (error) {
    console.error('Error initializing app:', error);
    const loading = document.getElementById('loading');
    if (loading) {
      loading.innerHTML = `
        <div style="color: #f0c060; text-align: center; padding: 20px; max-width: 400px;">
          <h2>Erro ao carregar a aplicação</h2>
          <p style="color: #607080; margin-top: 10px; font-family: monospace; font-size: 12px;">${error.message}</p>
          <pre style="text-align: left; color: #607080; margin-top: 10px; font-size: 10px; overflow-x: auto;">${error.stack?.substring(0, 500) || ''}</pre>
          <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #1a4a90; border: none; color: white; cursor: pointer; border-radius: 4px;">Recarregar</button>
        </div>
      `;
    }
  }
});
