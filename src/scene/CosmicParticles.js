import * as THREE from 'three';

export class CosmicParticles {
  constructor(scene, domeRadius = 2200) {
    this.scene = scene;
    this.domeRadius = domeRadius;
    this.group = new THREE.Group();
    this.group.name = 'CosmicParticles';
    
    this.particleCount = 2000;
    this.build();
    scene.add(this.group);
  }

  build() {
    // Floating dust/cosmic particles in upper waters
    this.buildUpperParticles();
    
    // Particles around the earth (atmosphere)
    this.buildAtmosphericParticles();
    
    // Rain particles (for flood simulation)
    this.buildRainParticles();
  }

  buildUpperParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];
    const velocities = [];

    for (let i = 0; i < this.particleCount; i++) {
      // Position in upper waters region
      const theta = Math.random() * Math.PI * 2;
      const r = this.domeRadius + 100 + Math.random() * 150;
      const phi = Math.random() * Math.PI * 0.3; // Upper hemisphere
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      
      positions.push(x, y, z);
      
      // Cyan/blue colors for water particles
      const brightness = 0.5 + Math.random() * 0.5;
      colors.push(0.3 * brightness, 0.7 * brightness, 1.0 * brightness);
      
      // Small sizes
      sizes.push(2 + Math.random() * 4);
      
      // Random velocity
      velocities.push(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.5
      );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float uPixelRatio;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vColor;
        
        void main() {
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          float glow = 1.0 - dist * 2.0;
          glow = pow(glow, 2.0);
          
          // Gentle twinkle
          float twinkle = sin(uTime + vColor.r * 10.0) * 0.2 + 0.8;
          
          vec3 finalColor = vColor * glow * twinkle;
          
          gl_FragColor = vec4(finalColor, glow * 0.6);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.upperParticles = new THREE.Points(geometry, material);
    this.upperParticles.userData.velocities = velocities;
    this.group.add(this.upperParticles);
  }

  buildAtmosphericParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    for (let i = 0; i < 500; i++) {
      // Position around earth surface
      const theta = Math.random() * Math.PI * 2;
      const r = 1700 + Math.random() * 300;
      
      const x = r * Math.cos(theta);
      const y = (Math.random() - 0.5) * 200;
      const z = r * Math.sin(theta);
      
      positions.push(x, y, z);
      
      // Golden/warm colors (dust/light)
      const brightness = 0.3 + Math.random() * 0.4;
      colors.push(brightness, brightness * 0.9, brightness * 0.7);
      
      sizes.push(1 + Math.random() * 2);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    this.atmosphericParticles = new THREE.Points(geometry, material);
    this.group.add(this.atmosphericParticles);
  }

  buildRainParticles() {
    // Rain particles for flood simulation
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const velocities = [];

    for (let i = 0; i < 3000; i++) {
      // Start position (falling from above)
      const x = (Math.random() - 0.5) * 4000;
      const y = 1500 + Math.random() * 1500;
      const z = (Math.random() - 0.5) * 4000;
      
      positions.push(x, y, z);
      
      // Downward velocity
      velocities.push(
        (Math.random() - 0.5) * 2,
        -50 - Math.random() * 50,
        (Math.random() - 0.5) * 2
      );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x4488ff,
      size: 3,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true
    });

    this.rainParticles = new THREE.Points(geometry, material);
    this.rainParticles.userData.velocities = velocities;
    this.rainParticles.visible = false; // Hidden by default
    this.group.add(this.rainParticles);
  }

  update(deltaTime, elapsedTime) {
    // Update upper particles
    if (this.upperParticles && this.upperParticles.material.uniforms) {
      this.upperParticles.material.uniforms.uTime.value = elapsedTime;
      
      // Gentle floating motion
      const positions = this.upperParticles.geometry.attributes.position.array;
      const velocities = this.upperParticles.userData.velocities;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i] * deltaTime;
        positions[i + 1] += velocities[i + 1] * deltaTime;
        positions[i + 2] += velocities[i + 2] * deltaTime;
        
        // Wrap around
        const r = Math.sqrt(positions[i] ** 2 + positions[i + 2] ** 2);
        if (r > this.domeRadius + 250) {
          const angle = Math.random() * Math.PI * 2;
          const newR = this.domeRadius + 100 + Math.random() * 50;
          positions[i] = newR * Math.cos(angle);
          positions[i + 2] = newR * Math.sin(angle);
        }
        if (positions[i + 1] > 1000) {
          positions[i + 1] = 100;
        }
        if (positions[i + 1] < 100) {
          positions[i + 1] = 1000;
        }
      }
      
      this.upperParticles.geometry.attributes.position.needsUpdate = true;
    }
    
    // Update atmospheric particles (slow drift)
    if (this.atmosphericParticles) {
      this.atmosphericParticles.rotation.y += deltaTime * 0.01;
    }
  }

  // Flood simulation
  startRain() {
    if (this.rainParticles) {
      this.rainParticles.visible = true;
      this.rainParticles.material.opacity = 0;
    }
  }

  stopRain() {
    if (this.rainParticles) {
      this.rainParticles.visible = false;
    }
  }

  updateRain(deltaTime) {
    if (!this.rainParticles || !this.rainParticles.visible) return;

    // Fade in
    if (this.rainParticles.material.opacity < 0.5) {
      this.rainParticles.material.opacity += deltaTime * 0.3;
    }

    // Move rain down
    const positions = this.rainParticles.geometry.attributes.position.array;
    const velocities = this.rainParticles.userData.velocities;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i] * deltaTime;
      positions[i + 1] += velocities[i + 1] * deltaTime;
      positions[i + 2] += velocities[i + 2] * deltaTime;

      // Reset when hitting ground
      if (positions[i + 1] < 0) {
        positions[i] = (Math.random() - 0.5) * 4000;
        positions[i + 1] = 1500 + Math.random() * 1000;
        positions[i + 2] = (Math.random() - 0.5) * 4000;
      }
    }

    this.rainParticles.geometry.attributes.position.needsUpdate = true;
  }

  getGroup() {
    return this.group;
  }
}
