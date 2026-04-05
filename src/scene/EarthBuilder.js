import * as THREE from 'three';
import { crustVertexShader, crustFragmentShader } from '../utils/shaders.js';

export class EarthBuilder {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'Earth';
    
    this.build();
    scene.add(this.group);
  }

  build() {
    // Main disc (surface)
    this.buildDisc();
    
    // Visual crust (rocky edges)
    this.buildCrust();
    
    // Ice wall (Antarctica border)
    this.buildIceWall();
    
    // Ocean on surface
    this.buildOcean();
  }

  buildDisc() {
    // Main disc geometry
    const discGeometry = new THREE.CylinderGeometry(1800, 1750, 120, 128);
    
    // Create a procedural texture for the flat earth map
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Draw the flat earth map
    this.drawFlatEarthMap(ctx, 1024);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    
    const discMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.8,
      metalness: 0.0,
      envMapIntensity: 0.3
    });
    
    this.disc = new THREE.Mesh(discGeometry, discMaterial);
    this.disc.position.y = 0;
    this.disc.receiveShadow = true;
    this.disc.castShadow = true;
    this.group.add(this.disc);
  }

  drawFlatEarthMap(ctx, size) {
    const center = size / 2;
    const maxRadius = size / 2 - 20;
    
    // Background (ocean) with more detail
    const oceanGradient = ctx.createRadialGradient(center, center, 0, center, center, maxRadius);
    oceanGradient.addColorStop(0, '#1a4a7a');
    oceanGradient.addColorStop(0.3, '#0a3060');
    oceanGradient.addColorStop(0.6, '#041828');
    oceanGradient.addColorStop(1, '#020d15');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add ocean texture detail
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 3;
      const dist = Math.sqrt((x - center) ** 2 + (y - center) ** 2);
      if (dist < maxRadius * 0.9) {
        ctx.fillStyle = `rgba(${30 + Math.random() * 30}, ${60 + Math.random() * 40}, ${100 + Math.random() * 50}, ${0.1 + Math.random() * 0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Draw continents with more detail
    const continentColors = ['#4a6a30', '#5a7a40', '#3a5a20'];
    ctx.strokeStyle = '#c4a030';
    ctx.lineWidth = 3;
    
    // North America (top left-ish)
    ctx.fillStyle = continentColors[0];
    this.drawContinent(ctx, center - maxRadius * 0.4, center - maxRadius * 0.5, maxRadius * 0.25, 0.7);
    
    // South America (bottom left)
    ctx.fillStyle = continentColors[1];
    this.drawContinent(ctx, center - maxRadius * 0.35, center + maxRadius * 0.4, maxRadius * 0.15, 0.8);
    
    // Europe/Africa (center)
    ctx.fillStyle = continentColors[2];
    this.drawContinent(ctx, center + maxRadius * 0.1, center - maxRadius * 0.2, maxRadius * 0.2, 0.75);
    
    // Asia (right)
    ctx.fillStyle = continentColors[0];
    this.drawContinent(ctx, center + maxRadius * 0.5, center - maxRadius * 0.4, maxRadius * 0.3, 0.65);
    
    // Australia (bottom right)
    ctx.fillStyle = continentColors[1];
    this.drawContinent(ctx, center + maxRadius * 0.45, center + maxRadius * 0.45, maxRadius * 0.1, 0.8);
    
    // Add mountains on continents
    this.drawMountains(ctx, center - maxRadius * 0.4, center - maxRadius * 0.5, maxRadius * 0.25);
    this.drawMountains(ctx, center + maxRadius * 0.1, center - maxRadius * 0.2, maxRadius * 0.2);
    this.drawMountains(ctx, center + maxRadius * 0.5, center - maxRadius * 0.4, maxRadius * 0.3);
    
    // Antarctica (outer ring with ice texture)
    const iceGradient = ctx.createRadialGradient(center, center, maxRadius * 0.85, center, center, maxRadius);
    iceGradient.addColorStop(0, 'rgba(200, 220, 255, 0)');
    iceGradient.addColorStop(0.5, 'rgba(200, 220, 255, 0.4)');
    iceGradient.addColorStop(1, 'rgba(220, 240, 255, 0.8)');
    ctx.fillStyle = iceGradient;
    ctx.beginPath();
    ctx.arc(center, center, maxRadius - 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Polar star marker with glow
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(center, center, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(center, center, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Grid lines (latitude/longitude representation)
    ctx.strokeStyle = 'rgba(100, 150, 200, 0.12)';
    ctx.lineWidth = 1;
    
    // Radial lines from center
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(center + Math.cos(angle) * maxRadius, center + Math.sin(angle) * maxRadius);
      ctx.stroke();
    }
    
    // Concentric circles
    for (let r = 0.2; r < 1; r += 0.2) {
      ctx.beginPath();
      ctx.arc(center, center, maxRadius * r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  
  drawMountains(ctx, x, y, size) {
    ctx.fillStyle = 'rgba(100, 80, 60, 0.5)';
    for (let i = 0; i < 5; i++) {
      const mx = x + (Math.random() - 0.5) * size;
      const my = y + (Math.random() - 0.5) * size;
      const mh = 10 + Math.random() * 20;
      const mw = 5 + Math.random() * 10;
      
      ctx.beginPath();
      ctx.moveTo(mx - mw, my);
      ctx.lineTo(mx, my - mh);
      ctx.lineTo(mx + mw, my);
      ctx.fill();
    }
  }

  drawContinent(ctx, x, y, size, irregularity) {
    ctx.beginPath();
    const points = [];
    const numPoints = 12;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const variance = size * irregularity * (0.5 + Math.random() * 0.5);
      const px = x + Math.cos(angle) * size * (0.8 + Math.random() * 0.4);
      const py = y + Math.sin(angle) * size * (0.8 + Math.random() * 0.4);
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  buildCrust() {
    // Crust visual - rocky bottom edge
    const crustGeometry = new THREE.CylinderGeometry(1750, 1600, 200, 64);
    
    // Modify vertices for low-poly rocky look
    const positions = crustGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      if (y < 0) { // Only modify bottom vertices
        const noise = (Math.random() - 0.5) * 50;
        positions.setX(i, positions.getX(i) + noise);
        positions.setZ(i, positions.getZ(i) + noise);
      }
    }
    crustGeometry.computeVertexNormals();
    
    const crustMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uTopColor: { value: new THREE.Color(0x8B6914) },
        uMidColor: { value: new THREE.Color(0x5a3a0a) },
        uBottomColor: { value: new THREE.Color(0x2a1a05) }
      },
      vertexShader: crustVertexShader,
      fragmentShader: crustFragmentShader
    });
    
    this.crust = new THREE.Mesh(crustGeometry, crustMaterial);
    this.crust.position.y = -160;
    this.crust.castShadow = true;
    this.group.add(this.crust);
    
    // Add stalactites/protrusions
    this.addStalactites();
  }

  addStalactites() {
    const stalactiteCount = 40;
    
    for (let i = 0; i < stalactiteCount; i++) {
      const angle = (i / stalactiteCount) * Math.PI * 2;
      const radius = 1650 + Math.random() * 100;
      const height = 50 + Math.random() * 100;
      
      const geometry = new THREE.ConeGeometry(15 + Math.random() * 20, height, 6);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.1, 0.3, 0.15 + Math.random() * 0.1),
        roughness: 0.9,
        metalness: 0.1
      });
      
      const stalactite = new THREE.Mesh(geometry, material);
      stalactite.position.set(
        Math.cos(angle) * radius,
        -160 - height / 2,
        Math.sin(angle) * radius
      );
      stalactite.rotation.x = Math.PI;
      stalactite.castShadow = true;
      
      this.group.add(stalactite);
    }
  }

  buildIceWall() {
    // Antarctica as ice wall
    const iceWallGeometry = new THREE.TorusGeometry(1800, 40, 16, 128);
    const iceWallMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe8f4ff,
      roughness: 0.1,
      metalness: 0.0,
      transmission: 0.3,
      thickness: 50,
      transparent: true,
      opacity: 0.9
    });
    
    this.iceWall = new THREE.Mesh(iceWallGeometry, iceWallMaterial);
    this.iceWall.rotation.x = Math.PI / 2;
    this.iceWall.position.y = 60;
    this.group.add(this.iceWall);
    
    // Glow ring
    const glowGeometry = new THREE.TorusGeometry(1800, 15, 8, 128);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x4080ff,
      transparent: true,
      opacity: 0.4
    });
    
    const glowRing = new THREE.Mesh(glowGeometry, glowMaterial);
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = 62;
    this.group.add(glowRing);
  }

  buildOcean() {
    // Ocean surface plane
    const oceanGeometry = new THREE.PlaneGeometry(3500, 3500, 128, 128);
    
    const oceanMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uWaveHeight: { value: 0.5 },
        uWaveSpeed: { value: 0.3 },
        uDeepColor: { value: new THREE.Color(0x041828) },
        uShallowColor: { value: new THREE.Color(0x0a4a70) }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uWaveHeight;
        uniform float uWaveSpeed;
        
        varying vec2 vUv;
        varying float vElevation;
        
        // Simple noise function
        float noise(vec2 p) {
          return sin(p.x * 2.0 + uTime * uWaveSpeed) * 
                 sin(p.y * 2.0 + uTime * uWaveSpeed * 0.7) * 0.5 + 0.5;
        }
        
        void main() {
          vUv = uv;
          
          vec3 pos = position;
          float wave = noise(uv * 4.0) * uWaveHeight;
          pos.z += wave;
          
          vElevation = wave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uDeepColor;
        uniform vec3 uShallowColor;
        uniform float uTime;
        
        varying vec2 vUv;
        varying float vElevation;
        
        void main() {
          // Distance from center for shallow water effect
          float dist = length(vUv - 0.5) * 2.0;
          
          vec3 color = mix(uShallowColor, uDeepColor, dist);
          
          // Add subtle highlights on wave peaks
          color += vElevation * 0.1;
          
          // Subtle shimmer
          float shimmer = sin(vUv.x * 20.0 + uTime) * sin(vUv.y * 20.0 + uTime * 0.8) * 0.03;
          color += shimmer;
          
          gl_FragColor = vec4(color, 0.85);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    this.ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
    this.ocean.rotation.x = -Math.PI / 2;
    this.ocean.position.y = 65;
    this.group.add(this.ocean);
  }

  update(deltaTime, elapsedTime) {
    // Update ocean shader
    if (this.ocean && this.ocean.material.uniforms) {
      this.ocean.material.uniforms.uTime.value = elapsedTime;
    }
    
    // Update crust shader
    if (this.crust && this.crust.material.uniforms) {
      this.crust.material.uniforms.uTime.value = elapsedTime;
    }
  }

  getGroup() {
    return this.group;
  }
}
