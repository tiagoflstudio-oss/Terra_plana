import * as THREE from 'three';

export class DomeBuilder {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'Dome';
    
    this.domeRadius = 2200;
    
    this.build();
    scene.add(this.group);
  }

  build() {
    // Main dome
    this.buildDome();
    
    // Base ring
    this.buildBaseRing();
    
    // Windows of heaven (special effect at top)
    this.buildHeavenWindows();
  }

  buildDome() {
    // Create hemisphere (half sphere)
    const domeGeometry = new THREE.SphereGeometry(
      this.domeRadius, 
      128,    // width segments
      64,     // height segments
      0,      // phiStart
      Math.PI * 2, // phiLength
      0,      // thetaStart
      Math.PI / 2  // thetaLength - only upper half
    );

    const domeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uBaseColor: { value: new THREE.Color(0x050a20) },
        uEdgeColor: { value: new THREE.Color(0x1a4aff) },
        uLineColor: { value: new THREE.Color(0x5080ff) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          vUv = uv;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uBaseColor;
        uniform vec3 uEdgeColor;
        uniform vec3 uLineColor;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          // View direction for fresnel
          vec3 viewDir = normalize(cameraPosition - vPosition);
          
          // Fresnel effect - more opaque at edges, transparent at center
          float fresnel = pow(1.0 - dot(vNormal, viewDir), 3.0);
          
          // Base color with fresnel
          vec3 color = mix(uBaseColor, uEdgeColor, fresnel);
          
          // Hex grid lines (latitude lines)
          float gridY = vUv.y * 20.0;
          float gridLineY = abs(fract(gridY) - 0.5) * 2.0;
          float lineIntensityY = smoothstep(0.02, 0.0, gridLineY - 0.95);
          
          // Vertical grid lines (longitude)
          float gridX = vUv.x * 40.0;
          float gridLineX = abs(fract(gridX) - 0.5) * 2.0;
          float lineIntensityX = smoothstep(0.02, 0.0, gridLineX - 0.95);
          
          float gridIntensity = max(lineIntensityY, lineIntensityX) * 0.12;
          
          // Add grid lines
          color = mix(color, uLineColor, gridIntensity);
          
          // Brightness at zenith (top)
          float zenith = vUv.y;
          color += vec3(0.05) * zenith;
          
          // Alpha: base transparency + fresnel boost
          float alpha = 0.08 + fresnel * 0.25;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.dome = new THREE.Mesh(domeGeometry, domeMaterial);
    this.dome.position.y = 0;
    this.group.add(this.dome);
  }

  buildBaseRing() {
    // Glowing base ring of the dome
    const ringGeometry = new THREE.TorusGeometry(this.domeRadius, 15, 16, 128);
    const ringMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4080ff,
      emissive: 0x2040ff,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.5,
      transparent: true,
      opacity: 0.9
    });

    this.baseRing = new THREE.Mesh(ringGeometry, ringMaterial);
    this.baseRing.rotation.x = Math.PI / 2;
    this.baseRing.position.y = 0;
    this.group.add(this.baseRing);

    // Secondary glow ring
    const glowGeometry = new THREE.TorusGeometry(this.domeRadius, 30, 8, 128);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x2040ff,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });

    const glowRing = new THREE.Mesh(glowGeometry, glowMaterial);
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = 0;
    this.group.add(glowRing);
  }

  buildHeavenWindows() {
    // Windows of heaven - 7 special areas at the dome top
    // Based on Genesis 7:11 - "windows of heaven"
    const windowPositions = [
      { angle: 0, angleY: 0.95 },      // Top center (Solstice summer norte)
      { angle: Math.PI / 3, angleY: 0.9 },   // Equinócio primavera
      { angle: Math.PI * 2 / 3, angleY: 0.92 }, // Solstício inverno
      { angle: Math.PI, angleY: 0.95 },     // Top center (Solstício inverno)
      { angle: Math.PI * 4 / 3, angleY: 0.9 },  // Equinócio outono
      { angle: Math.PI * 5 / 3, angleY: 0.92 }, // Solstício verão
      { angle: Math.PI / 2, angleY: 0.93 }    // Equador celestial
    ];

    const windowGroup = new THREE.Group();
    windowGroup.name = 'HeavenWindows';

    windowPositions.forEach((pos, index) => {
      // Calculate position on dome surface
      const phi = Math.acos(1 - pos.angleY); // polar angle
      const theta = pos.angle; // azimuthal angle
      
      const x = this.domeRadius * Math.sin(phi) * Math.cos(theta);
      const y = this.domeRadius * Math.cos(phi);
      const z = this.domeRadius * Math.sin(phi) * Math.sin(theta);

      // Window geometry - small sphere section
      const windowGeometry = new THREE.SphereGeometry(40, 16, 16);
      const windowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x4080ff,
        emissiveIntensity: 0.8,
        transmission: 0.9,
        thickness: 20,
        roughness: 0.1,
        metalness: 0.0,
        transparent: true,
        opacity: 0.7
      });

      const window = new THREE.Mesh(windowGeometry, windowMaterial);
      window.position.set(x, y, z);
      window.lookAt(0, 0, 0);
      
      windowGroup.add(window);
    });

    this.heavenWindows = windowGroup;
    this.group.add(windowGroup);
  }

  update(elapsedTime) {
    // Animate dome shader
    if (this.dome && this.dome.material.uniforms) {
      this.dome.material.uniforms.uTime.value = elapsedTime;
    }

    // Animate heaven windows - subtle pulsing
    if (this.heavenWindows) {
      this.heavenWindows.children.forEach((window, i) => {
        const pulse = Math.sin(elapsedTime * 0.5 + i * 0.5) * 0.3 + 0.7;
        window.material.emissiveIntensity = pulse;
        window.material.opacity = pulse * 0.7;
      });
    }

    // Animate base ring glow
    if (this.baseRing) {
      this.baseRing.material.emissiveIntensity = 0.4 + Math.sin(elapsedTime * 0.3) * 0.2;
    }
  }

  getGroup() {
    return this.group;
  }

  getDomeRadius() {
    return this.domeRadius;
  }
}
