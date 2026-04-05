import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth;
    this.height = container.clientHeight;
    this.views = {
      perspective: { pos: [0, 800, 2000], target: [0, 0, 0] },
      top: { pos: [0, 3000, 100], target: [0, 0, 0] },
      front: { pos: [0, 500, 3000], target: [0, 0, 0] },
      orbit: { pos: [2000, 1500, 2000], target: [0, 0, 0] },
      night: { pos: [0, 2000, 0], target: [0, 0, 0] },
      waters: { pos: [0, 2600, 0], target: [0, 0, 0] }
    };
    this.currentView = 'perspective';
    this.clock = new THREE.Clock();
    this.sceneObjects = {};
    
    this.init();
  }

  init() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x010408);
    this.scene.fog = new THREE.FogExp2(0x010408, 0.00015);

    // Camera
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 50000);
    this.camera.position.set(0, 800, 2000);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 300;
    this.controls.maxDistance = 8000;
    this.controls.maxPolarAngle = Math.PI * 0.85;
    this.controls.target.set(0, 0, 0);

    // Lighting
    this.setupLighting();

    // Post-processing
    this.setupPostProcessing();

    // Resize handler
    window.addEventListener('resize', () => this.onResize());

    // Animation loop
    this.animate();
  }

  setupLighting() {
    // Ambient light - night sky
    this.ambientLight = new THREE.AmbientLight(0x0a1535, 0.3);
    this.scene.add(this.ambientLight);

    // Directional light (Sun)
    this.sunLight = new THREE.DirectionalLight(0xfff8e0, 2.0);
    this.sunLight.position.set(500, 1000, 500);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 100;
    this.sunLight.shadow.camera.far = 5000;
    this.sunLight.shadow.camera.left = -2000;
    this.sunLight.shadow.camera.right = 2000;
    this.sunLight.shadow.camera.top = 2000;
    this.sunLight.shadow.camera.bottom = -2000;
    this.scene.add(this.sunLight);

    // Moon light
    this.moonLight = new THREE.PointLight(0xc0d0ff, 0.5, 3000);
    this.moonLight.position.set(-300, 600, -500);
    this.scene.add(this.moonLight);

    // Hemisphere light
    this.hemiLight = new THREE.HemisphereLight(0x0a2060, 0x050f10, 0.4);
    this.scene.add(this.hemiLight);
  }

  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.width, this.height),
      0.8,  // strength
      0.5,  // radius
      0.4   // threshold
    );
    this.composer.addPass(this.bloomPass);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    const deltaTime = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    this.controls.update();

    // Update scene objects
    if (this.sceneObjects.earth) {
      this.sceneObjects.earth.update(deltaTime, elapsedTime);
    }
    if (this.sceneObjects.dome) {
      this.sceneObjects.dome.update(elapsedTime);
    }
    if (this.sceneObjects.water) {
      this.sceneObjects.water.update(deltaTime, elapsedTime);
    }
    if (this.sceneObjects.celestial) {
      this.sceneObjects.celestial.update(deltaTime, elapsedTime);
    }
    if (this.sceneObjects.stars) {
      this.sceneObjects.stars.update(elapsedTime);
    }
    if (this.sceneObjects.particles) {
      this.sceneObjects.particles.update(deltaTime, elapsedTime);
      this.sceneObjects.particles.updateRain(deltaTime);
    }

    // Render with post-processing
    this.composer.render();

    // Update stats
    this.updateStats(elapsedTime);
  }

  updateStats(elapsedTime) {
    const azimuth = Math.atan2(this.camera.position.x, this.camera.position.z) * (180 / Math.PI);
    const elevation = Math.atan2(this.camera.position.y, Math.sqrt(this.camera.position.x ** 2 + this.camera.position.z ** 2)) * (180 / Math.PI);
    
    const dayOfYear = Math.floor((elapsedTime / 86400) % 365) + 1;
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);

    document.getElementById('stat-azimuth').textContent = azimuth.toFixed(2) + '°';
    document.getElementById('stat-elevation').textContent = elevation.toFixed(2) + '°';
    document.getElementById('stat-day').textContent = dayOfYear;
    document.getElementById('stat-time').textContent = timeStr;
    document.getElementById('stat-fps').textContent = Math.round(1 / this.clock.getDelta() || 60);
  }

  changeView(viewName, animated = true) {
    if (!this.views[viewName]) return;
    
    this.currentView = viewName;
    const view = this.views[viewName];

    if (animated) {
      gsap.to(this.camera.position, {
        x: view.pos[0],
        y: view.pos[1],
        z: view.pos[2],
        duration: 1.5,
        ease: 'power2.inOut'
      });
      
      gsap.to(this.controls.target, {
        x: view.target[0],
        y: view.target[1],
        z: view.target[2],
        duration: 1.5,
        ease: 'power2.inOut'
      });
    } else {
      this.camera.position.set(...view.pos);
      this.controls.target.set(...view.target);
    }

    // Update UI
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });
  }

  setSunPosition(x, y, z) {
    this.sunLight.position.set(x, y, z);
    if (this.sceneObjects.celestial) {
      this.sceneObjects.celestial.setSunPosition(x, y, z);
    }
  }

  setSunSpeed(speed) {
    if (this.sceneObjects.celestial) {
      this.sceneObjects.celestial.setSunSpeed(speed);
    }
  }

  setMoonSpeed(speed) {
    if (this.sceneObjects.celestial) {
      this.sceneObjects.celestial.setMoonSpeed(speed);
    }
  }

  setWaterIntensity(intensity) {
    if (this.sceneObjects.water) {
      this.sceneObjects.water.setIntensity(intensity / 100);
    }
  }

  setDayMode(isDay) {
    if (isDay) {
      this.sunLight.intensity = 2.0;
      this.ambientLight.intensity = 0.3;
      this.moonLight.intensity = 0.5;
      this.bloomPass.strength = 0.8;
    } else {
      this.sunLight.intensity = 0.1;
      this.ambientLight.intensity = 0.15;
      this.moonLight.intensity = 1.0;
      this.bloomPass.strength = 1.2;
    }
  }

  toggleOrbits(show) {
    if (this.sceneObjects.celestial) {
      this.sceneObjects.celestial.toggleOrbits(show);
    }
  }

  onResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(this.width, this.height);
    this.composer.setSize(this.width, this.height);
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }

  getControls() {
    return this.controls;
  }

  // Register scene objects for updates
  registerObject(name, object) {
    this.sceneObjects[name] = object;
  }

  // Get current camera position for notes
  getCameraState() {
    return {
      position: this.camera.position.toArray(),
      target: this.controls.target.toArray(),
      view: this.currentView
    };
  }

  dispose() {
    window.removeEventListener('resize', () => this.onResize());
    this.renderer.dispose();
    this.controls.dispose();
  }
}
