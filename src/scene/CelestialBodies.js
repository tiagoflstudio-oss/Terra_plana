import * as THREE from 'three';
import { sunVertexShader, sunFragmentShader, moonFragmentShader } from '../utils/shaders.js';

export class CelestialBodies {
  constructor(scene, domeRadius = 2200) {
    this.scene = scene;
    this.domeRadius = domeRadius;
    this.group = new THREE.Group();
    this.group.name = 'CelestialBodies';
    
    // Speeds (relative to real time)
    this.sunSpeed = 1.0;
    this.moonSpeed = 1.0;
    
    // Orbit parameters
    this.sunOrbit = {
      majorAxis: 1600,  // semi-major axis
      minorAxis: 1200,  // semi-minor axis
      minHeight: 400,
      maxHeight: 1800,
      period: 365, // one full orbit in "days"
      currentAngle: 0
    };
    
    this.moonOrbit = {
      majorAxis: 1000,
      minorAxis: 800,
      minHeight: 200,
      maxHeight: 1400,
      period: 29.5,
      currentAngle: 0
    };
    
    this.showOrbits = true;
    this.sunPosition = new THREE.Vector3(500, 1000, 500);
    
    this.build();
    scene.add(this.group);
  }

  build() {
    // Build Sun
    this.buildSun();
    
    // Build Moon
    this.buildMoon();
    
    // Build orbit lines
    this.buildOrbits();
  }

  buildSun() {
    const sunGroup = new THREE.Group();
    sunGroup.name = 'Sun';

    // Core - glowing sphere with procedural plasma shader
    const sunGeometry = new THREE.SphereGeometry(80, 64, 64);
    const sunMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCoreColor: { value: new THREE.Color(0xffcc00) },
        uCoronaColor: { value: new THREE.Color(0xff4400) }
      },
      vertexShader: sunVertexShader,
      fragmentShader: sunFragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    });

    const sunCore = new THREE.Mesh(sunGeometry, sunMaterial);
    sunGroup.add(sunCore);
    this.sunCore = sunCore;

    // Corona (halo glow)
    const coronaGeometry = new THREE.SpriteMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const coronaSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        color: 0xff8800,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
      })
    );
    coronaSprite.scale.set(400, 400, 1);
    sunGroup.add(coronaSprite);
    this.corona = coronaSprite;

    // Outer glow
    const outerGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      })
    );
    outerGlow.scale.set(600, 600, 1);
    sunGroup.add(outerGlow);

    // Point light from sun
    this.sunLight = new THREE.PointLight(0xfff8e0, 2.0, 3000);
    sunGroup.add(this.sunLight);

    this.sun = sunGroup;
    this.group.add(sunGroup);
  }

  buildMoon() {
    const moonGroup = new THREE.Group();
    moonGroup.name = 'Moon';

    // Moon core with texture
    const moonGeometry = new THREE.SphereGeometry(55, 64, 64);
    const moonMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uSunDirection: { value: new THREE.Vector3(1, 1, 1) },
        uTexture: { value: null },
        uSunAngle: { value: 0 }
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
      fragmentShader: moonFragmentShader
    });

    const moonCore = new THREE.Mesh(moonGeometry, moonMaterial);
    moonGroup.add(moonCore);
    this.moonCore = moonCore;

    // Atmospheric halo
    const haloSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        color: 0xb0c8ff,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
      })
    );
    haloSprite.scale.set(200, 200, 1);
    moonGroup.add(haloSprite);

    this.moon = moonGroup;
    this.group.add(moonGroup);
  }

  buildOrbits() {
    // Sun orbit path (ellipse)
    const sunOrbitGeometry = new THREE.BufferGeometry();
    const sunOrbitPoints = [];
    
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      const x = Math.cos(angle) * this.sunOrbit.majorAxis;
      const z = Math.sin(angle) * this.sunOrbit.minorAxis;
      const y = this.sunOrbit.minHeight + (this.sunOrbit.maxHeight - this.sunOrbit.minHeight) * 0.5;
      sunOrbitPoints.push(x, y, z);
    }
    
    sunOrbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(sunOrbitPoints, 3));
    
    const sunOrbitMaterial = new THREE.LineBasicMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0.3
    });
    
    this.sunOrbitLine = new THREE.Line(sunOrbitGeometry, sunOrbitMaterial);
    this.group.add(this.sunOrbitLine);

    // Moon orbit path
    const moonOrbitGeometry = new THREE.BufferGeometry();
    const moonOrbitPoints = [];
    
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      const x = Math.cos(angle) * this.moonOrbit.majorAxis;
      const z = Math.sin(angle) * this.moonOrbit.minorAxis;
      const y = this.moonOrbit.minHeight + (this.moonOrbit.maxHeight - this.moonOrbit.minHeight) * 0.5;
      moonOrbitPoints.push(x, y, z);
    }
    
    moonOrbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(moonOrbitPoints, 3));
    
    const moonOrbitMaterial = new THREE.LineBasicMaterial({
      color: 0xc0d0ff,
      transparent: true,
      opacity: 0.3
    });
    
    this.moonOrbitLine = new THREE.Line(moonOrbitGeometry, moonOrbitMaterial);
    this.group.add(this.moonOrbitLine);
  }

  update(deltaTime, elapsedTime) {
    // Update sun orbit position
    // One full orbit = period "days" in simulation time
    const timeScale = 0.001 * this.sunSpeed; // scale down for smooth animation
    this.sunOrbit.currentAngle += deltaTime * timeScale * Math.PI * 2 / this.sunOrbit.period;
    
    const sunX = Math.cos(this.sunOrbit.currentAngle) * this.sunOrbit.majorAxis;
    const sunZ = Math.sin(this.sunOrbit.currentAngle) * this.sunOrbit.minorAxis;
    // Spiral height variation (simplified)
    const sunY = this.sunOrbit.minHeight + (this.sunOrbit.maxHeight - this.sunOrbit.minHeight) * 
                (Math.sin(this.sunOrbit.currentAngle) * 0.5 + 0.5);
    
    this.sun.position.set(sunX, sunY, sunZ);
    this.sunPosition.set(sunX, sunY, sunZ);
    
    // Update sun shader
    if (this.sunCore.material.uniforms) {
      this.sunCore.material.uniforms.uTime.value = elapsedTime;
    }
    
    // Corona animation
    if (this.corona) {
      const pulse = Math.sin(elapsedTime * 2) * 0.1 + 1;
      this.corona.scale.set(400 * pulse, 400 * pulse, 1);
    }
    
    // Update moon orbit position
    const moonTimeScale = 0.001 * this.moonSpeed;
    this.moonOrbit.currentAngle += deltaTime * moonTimeScale * Math.PI * 2 / this.moonOrbit.period;
    
    const moonX = Math.cos(this.moonOrbit.currentAngle) * this.moonOrbit.majorAxis;
    const moonZ = Math.sin(this.moonOrbit.currentAngle) * this.moonOrbit.minorAxis;
    const moonY = this.moonOrbit.minHeight + (this.moonOrbit.maxHeight - this.moonOrbit.minHeight) * 
                 (Math.sin(this.moonOrbit.currentAngle) * 0.5 + 0.5);
    
    // Moon orbits around sun (smaller orbit)
    this.moon.position.set(sunX + moonX, sunY + moonY - 300, sunZ + moonZ);
    
    // Update moon shader
    if (this.moonCore?.material?.uniforms) {
      const uniforms = this.moonCore.material.uniforms;
      if (uniforms.uSunDirection?.value) {
        uniforms.uSunDirection.value.set(
          this.sun.position.x - this.moon.position.x,
          this.sun.position.y - this.moon.position.y,
          this.sun.position.z - this.moon.position.z
        ).normalize();
      }
      if (uniforms.uTime?.value !== undefined) uniforms.uTime.value = elapsedTime;
      if (uniforms.uSunAngle?.value !== undefined) uniforms.uSunAngle.value = elapsedTime * 0.1;
    }
  }

  setSunSpeed(speed) {
    this.sunSpeed = speed;
  }

  setMoonSpeed(speed) {
    this.moonSpeed = speed;
  }

  setSunPosition(x, y, z) {
    this.sun.position.set(x, y, z);
    this.sunPosition.set(x, y, z);
  }

  toggleOrbits(show) {
    this.showOrbits = show;
    if (this.sunOrbitLine) this.sunOrbitLine.visible = show;
    if (this.moonOrbitLine) this.moonOrbitLine.visible = show;
  }

  getGroup() {
    return this.group;
  }

  getSunPosition() {
    return this.sunPosition;
  }

  getMoonPosition() {
    return this.moon.position;
  }
}
