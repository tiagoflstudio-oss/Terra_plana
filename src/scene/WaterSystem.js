import * as THREE from 'three';
import { waterVertexShader, waterFragmentShader } from '../utils/shaders.js';

export class WaterSystem {
  constructor(scene, domeRadius = 2200) {
    this.scene = scene;
    this.domeRadius = domeRadius;
    this.group = new THREE.Group();
    this.group.name = 'WaterSystem';
    
    this.intensity = 0.5;
    
    this.build();
    scene.add(this.group);
  }

  build() {
    // Upper waters (above the firmament - outside dome)
    this.buildUpperWaters();
    
    // Lower waters (Tehom - below the earth)
    this.buildLowerWaters();
    
    // Firmament interface line
    this.buildFirmamentInterface();
  }

  buildUpperWaters() {
    // Upper waters sphere - larger than dome
    const upperGeometry = new THREE.SphereGeometry(
      this.domeRadius + 200, // slightly larger than dome
      64,
      32,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2 // only upper hemisphere
    );

    const upperMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uWaveHeight: { value: 15.0 },
        uDeepColor: { value: new THREE.Color(0x000814) },
        uShallowColor: { value: new THREE.Color(0x0a2060) },
        uFoamColor: { value: new THREE.Color(0x4488ff) }
      },
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.upperWaters = new THREE.Mesh(upperGeometry, upperMaterial);
    this.upperWaters.position.y = 0;
    this.group.add(this.upperWaters);
  }

  buildLowerWaters() {
    // Lower waters cylinder (Tehom - abyss below earth)
    const lowerGeometry = new THREE.CylinderGeometry(1700, 1500, 800, 64);

    const lowerMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: this.intensity },
        uDeepColor: { value: new THREE.Color(0x000408) },
        uMidColor: { value: new THREE.Color(0x040d20) }
      },
      vertexShader: `
        uniform float uTime;
        
        varying vec2 vUv;
        varying float vDepth;
        
        void main() {
          vUv = uv;
          
          // Calculate depth for gradient
          vDepth = (position.y + 400.0) / 800.0;
          
          vec3 pos = position;
          
          // Very subtle wave motion
          float wave = sin(pos.x * 0.01 + uTime * 0.1) * 
                       cos(pos.z * 0.01 + uTime * 0.08) * 5.0;
          pos.y += wave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uIntensity;
        uniform vec3 uDeepColor;
        uniform vec3 uMidColor;
        
        varying vec2 vUv;
        varying float vDepth;
        
        void main() {
          // Depth gradient - darker at bottom
          vec3 color = mix(uDeepColor, uMidColor, vDepth);
          
          // Very subtle movement
          float movement = sin(vUv.x * 20.0 + uTime * 0.2) * 0.02;
          color += movement;
          
          // Fade to black at bottom
          float alpha = vDepth * 0.6 * uIntensity;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    this.lowerWaters = new THREE.Mesh(lowerGeometry, lowerMaterial);
    this.lowerWaters.position.y = -560; // below the earth
    this.group.add(this.lowerWaters);
  }

  buildFirmamentInterface() {
    // The meeting line between upper and lower waters (firmament equator)
    const interfaceGeometry = new THREE.TorusGeometry(this.domeRadius, 8, 8, 128);
    const interfaceMaterial = new THREE.MeshBasicMaterial({
      color: 0x4080ff,
      transparent: true,
      opacity: 0.7
    });

    this.interface = new THREE.Mesh(interfaceGeometry, interfaceMaterial);
    this.interface.rotation.x = Math.PI / 2;
    this.interface.position.y = 0;
    this.group.add(this.interface);
    
    // Outer glow ring
    const glowGeometry = new THREE.TorusGeometry(this.domeRadius, 20, 8, 128);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x2040ff,
      transparent: true,
      opacity: 0.3
    });

    const glowRing = new THREE.Mesh(glowGeometry, glowMaterial);
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = 0;
    this.group.add(glowRing);
  }

  update(deltaTime, elapsedTime) {
    // Update upper waters shader
    if (this.upperWaters && this.upperWaters.material.uniforms) {
      this.upperWaters.material.uniforms.uTime.value = elapsedTime;
    }
    
    // Update lower waters shader
    if (this.lowerWaters && this.lowerWaters.material.uniforms) {
      this.lowerWaters.material.uniforms.uTime.value = elapsedTime;
    }
    
    // Animate interface glow - crystalline pulsing
    if (this.interface) {
      const pulse = Math.sin(elapsedTime * 0.5) * 0.2 + 0.7;
      this.interface.material.opacity = pulse * 0.7;
      this.interface.material.color.setHSL(0.6, 0.8, pulse * 0.5);
    }
  }

  setIntensity(value) {
    this.intensity = value;
  }

  getGroup() {
    return this.group;
  }
}
