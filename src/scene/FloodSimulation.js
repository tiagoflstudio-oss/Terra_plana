import * as THREE from 'three';
import { gsap } from 'gsap';

export class FloodSimulation {
  constructor(scene, camera, renderer, waterSystem) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.waterSystem = waterSystem;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 30;
    this.rainParticles = null;
    this.fountainParticles = null;
    this.risingWater = null;
    this.skyWindows = [];
    this.originalCameraPosition = new THREE.Vector3();
    this.originalCameraTarget = new THREE.Vector3();
    this.audioContext = null;
    this.masterGain = null;
  }

  init() {
    this.createRainParticles();
    this.createRisingWater();
    this.createSkyWindows();
    this.createAudio();
    this.rainParticles.visible = false;
    this.risingWater.visible = false;
    this.skyWindows.forEach(w => w.visible = false);
  }

  createRainParticles() {
    const particleCount = 50000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2000;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.random() * 3000 - 500;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
      velocities[i] = 50 + Math.random() * 50;
      sizes[i] = 2 + Math.random() * 3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x4080ff) },
        uOpacity: { value: 0.7 }
      },
      vertexShader: `
        attribute float velocity;
        attribute float size;
        varying float vAlpha;
        uniform float uTime;
        
        void main() {
          vAlpha = 0.6;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying float vAlpha;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = (1.0 - dist * 2.0) * uOpacity * vAlpha;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.rainParticles = new THREE.Points(geometry, material);
    this.scene.add(this.rainParticles);
  }

  createRisingWater() {
    const geometry = new THREE.PlaneGeometry(4000, 4000, 64, 64);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uWaterLevel: { value: 0 },
        uDeepColor: { value: new THREE.Color(0x001030) },
        uSurfaceColor: { value: new THREE.Color(0x204080) }
      },
      vertexShader: `
        uniform float uWaterLevel;
        uniform float uTime;
        varying vec2 vUv;
        varying float vWave;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          float wave = sin(pos.x * 0.01 + uTime) * cos(pos.y * 0.01 + uTime * 0.7) * 30.0;
          pos.z += wave;
          pos.y += uWaterLevel;
          vWave = wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uDeepColor;
        uniform vec3 uSurfaceColor;
        uniform float uWaterLevel;
        uniform float uTime;
        varying vec2 vUv;
        varying float vWave;
        
        void main() {
          float depth = 1.0 - smoothstep(0.0, 2000.0, uWaterLevel);
          vec3 color = mix(uSurfaceColor, uDeepColor, depth);
          float shimmer = sin(vUv.x * 50.0 + uTime * 2.0) * sin(vUv.y * 50.0 + uTime * 1.5) * 0.1 + 0.9;
          float alpha = 0.6 * (1.0 - depth * 0.5);
          gl_FragColor = vec4(color * shimmer, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    this.risingWater = new THREE.Mesh(geometry, material);
    this.risingWater.rotation.x = -Math.PI / 2;
    this.risingWater.position.y = -500;
    this.scene.add(this.risingWater);
  }

  createSkyWindows() {
    const windowPositions = [
      { lat: 66.5, lon: 0 },
      { lat: 23.5, lon: 90 },
      { lat: 0, lon: 180 },
      { lat: -23.5, lon: 270 },
      { lat: 66.5, lon: 180 },
      { lat: -66.5, lon: 90 },
      { lat: 0, lon: 0 }
    ];

    const domeRadius = 2200;

    windowPositions.forEach((pos, index) => {
      const latRad = pos.lat * Math.PI / 180;
      const lonRad = pos.lon * Math.PI / 180;
      const y = domeRadius * Math.sin(latRad);
      const radius = domeRadius * Math.cos(latRad);
      const x = radius * Math.sin(lonRad);
      const z = radius * Math.cos(lonRad);

      const geometry = new THREE.CircleGeometry(40, 32);
      const material = new THREE.MeshBasicMaterial({
        color: 0x4080ff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
      });

      const window = new THREE.Mesh(geometry, material);
      window.position.set(x, y, z);
      window.lookAt(0, y, 0);

      window.userData = {
        baseY: y,
        targetOpacity: 0.8,
        pulseSpeed: 0.5 + Math.random() * 0.5,
        pulseOffset: Math.random() * Math.PI * 2
      };

      this.skyWindows.push(window);
      this.scene.add(window);
    });
  }

  createAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0;
    } catch (e) {
      console.log('Audio não disponível');
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentTime = 0;

    this.originalCameraPosition.copy(this.camera.position);
    if (this.renderer.domElement.parentElement) {
      const controls = this.renderer.domElement.parentElement.__controls;
      if (controls) {
        this.originalCameraTarget.copy(controls.target);
      }
    }

    this.rainParticles.visible = true;
    this.risingWater.visible = true;
    this.skyWindows.forEach(w => w.visible = true);

    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.animate();
  }

  stop() {
    this.isPlaying = false;
    
    gsap.to(this.camera.position, {
      x: this.originalCameraPosition.x,
      y: this.originalCameraPosition.y,
      z: this.originalCameraPosition.z,
      duration: 2,
      ease: 'power2.out'
    });

    this.rainParticles.visible = false;
    this.risingWater.visible = false;
    this.skyWindows.forEach(w => w.visible = false);

    if (this.masterGain) {
      gsap.to(this.masterGain.gain, { value: 0, duration: 1 });
    }
  }

  animate() {
    if (!this.isPlaying) return;

    this.currentTime += 0.016;
    const progress = this.currentTime / this.duration;

    if (progress < 0.1) {
      this.phaseZoomIn(progress);
    } else if (progress < 0.27) {
      this.phaseWindowsOpen(progress);
    } else if (progress < 0.5) {
      this.phaseRainHeavy(progress);
    } else if (progress < 0.73) {
      this.phaseWaterRising(progress);
    } else if (progress < 0.93) {
      this.phaseUnderwater(progress);
    } else {
      this.phaseFadeOut(progress);
    }

    if (this.currentTime < this.duration) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.stop();
    }
  }

  phaseZoomIn(progress) {
    const t = progress / 0.1;
    const targetY = 2000;
    const targetZ = 500;

    gsap.to(this.camera.position, {
      y: targetY * t,
      z: targetZ + (1 - t) * 1500,
      duration: 0.1,
      overwrite: true
    });
    this.camera.lookAt(0, 1500, 0);
  }

  phaseWindowsOpen(progress) {
    const t = (progress - 0.1) / 0.17;
    const audioVolume = Math.min(t * 2, 1);

    if (this.masterGain) {
      this.masterGain.gain.value = audioVolume * 0.3;
      this.playRainSound(audioVolume);
    }

    this.skyWindows.forEach((window, i) => {
      const pulse = Math.sin(this.currentTime * window.userData.pulseSpeed + window.userData.pulseOffset);
      window.material.opacity = t * window.userData.targetOpacity * (0.8 + pulse * 0.2);
      window.scale.setScalar(1 + t * 0.5);
    });
  }

  phaseRainHeavy(progress) {
    const t = (progress - 0.27) / 0.23;
    const positions = this.rainParticles.geometry.attributes.position.array;
    const velocities = this.rainParticles.geometry.attributes.velocity.array;

    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3 + 1] -= velocities[i] * 0.5 * (1 + t);

      if (positions[i * 3 + 1] < -200) {
        positions[i * 3 + 1] = 2500 + Math.random() * 500;
      }
    }

    this.rainParticles.geometry.attributes.position.needsUpdate = true;
    this.rainParticles.material.uniforms.uTime.value = this.currentTime;

    if (this.masterGain) {
      this.masterGain.gain.value = 0.3 + t * 0.2;
    }
  }

  phaseWaterRising(progress) {
    const t = (progress - 0.5) / 0.23;
    const waterLevel = -500 + t * 2800;

    this.risingWater.position.y = waterLevel;
    this.risingWater.material.uniforms.uWaterLevel.value = waterLevel;
    this.risingWater.material.uniforms.uTime.value = this.currentTime;

    if (waterLevel > 500) {
      this.fadeSceneElements(waterLevel / 2000);
    }
  }

  phaseUnderwater(progress) {
    const t = (progress - 0.73) / 0.2;
    
    this.rainParticles.material.uniforms.uOpacity.value = 0.7 * (1 - t);
    
    const positions = this.rainParticles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length / 3; i++) {
      positions[i * 3 + 1] -= 30;
    }
    this.rainParticles.geometry.attributes.position.needsUpdate = true;

    this.risingWater.material.uniforms.uOpacity.value = 0.6 + t * 0.3;

    if (this.masterGain) {
      this.masterGain.gain.value = 0.5 * (1 - t);
    }
  }

  phaseFadeOut(progress) {
    const t = (progress - 0.93) / 0.07;
    
    if (t > 0.8) {
      this.scene.background = new THREE.Color(0x000000);
    }

    this.skyWindows.forEach(w => {
      w.material.opacity *= 0.95;
    });
  }

  fadeSceneElements(level) {
    this.scene.traverse((obj) => {
      if (obj.material && obj !== this.risingWater && obj !== this.rainParticles) {
        if (obj.material.opacity !== undefined) {
          obj.material.opacity = Math.max(0, 1 - level);
        }
      }
    });
  }

  playRainSound(volume) {
    if (!this.audioContext) return;

    const bufferSize = 2 * this.audioContext.sampleRate;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const bandpass = this.audioContext.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1000;
    bandpass.Q.value = 0.5;

    const gain = this.audioContext.createGain();
    gain.gain.value = volume * 0.1;

    whiteNoise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    this.currentRainSound = { source: whiteNoise, gain };
  }

  update(deltaTime) {
    if (this.isPlaying) {
      this.skyWindows.forEach(window => {
        if (window.material.opacity > 0) {
          const pulse = Math.sin(this.currentTime * window.userData.pulseSpeed + window.userData.pulseOffset);
          window.material.opacity = window.userData.targetOpacity * (0.8 + pulse * 0.2);
        }
      });
    }
  }
}

export default FloodSimulation;
