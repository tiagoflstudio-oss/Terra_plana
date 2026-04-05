import * as THREE from 'three';

export class StarField {
  constructor(scene, domeRadius = 2200) {
    this.scene = scene;
    this.domeRadius = domeRadius;
    this.group = new THREE.Group();
    this.group.name = 'StarField';
    
    // Star catalog with real star data
    this.starCatalog = this.generateStarCatalog();
    
    this.build();
    scene.add(this.group);
  }

  generateStarCatalog() {
    // Real star positions (azimuth in degrees, elevation in degrees, magnitude, name, constellation)
    // Using azimuthal projection - azimuth 0 = North, clockwise
    return [
      // Polaris (North Star) - near zenith
      { az: 0, el: 89.5, mag: 1.97, name: 'Polaris', constellation: 'Ursa Minor', type: 'F' },
      
      // Big Dipper (Ursa Major)
      { az: 45, el: 65, mag: 1.79, name: 'Dubhe', constellation: 'Ursa Major', type: 'K' },
      { az: 55, el: 60, mag: 2.04, name: 'Merak', constellation: 'Ursa Major', type: 'A' },
      { az: 48, el: 55, mag: 3.31, name: 'Phecda', constellation: 'Ursa Major', type: 'A' },
      { az: 42, el: 52, mag: 1.86, name: 'Megrez', constellation: 'Ursa Major', type: 'A' },
      { az: 35, el: 50, mag: 1.91, name: 'Alioth', constellation: 'Ursa Major', type: 'A' },
      { az: 28, el: 48, mag: 2.27, name: 'Mizar', constellation: 'Ursa Major', type: 'A' },
      { az: 20, el: 45, mag: 1.77, name: 'Alkaid', constellation: 'Ursa Major', type: 'B' },
      
      // Cassiopeia (W shape)
      { az: 120, el: 55, mag: 2.24, name: 'Schedar', constellation: 'Cassiopeia', type: 'K' },
      { az: 130, el: 52, mag: 2.68, name: 'Caph', constellation: 'Cassiopeia', type: 'F' },
      { az: 140, el: 58, mag: 2.47, name: 'Gamma Cas', constellation: 'Cassiopeia', type: 'B' },
      { az: 150, el: 50, mag: 3.37, name: 'Ruchbah', constellation: 'Cassiopeia', type: 'A' },
      { az: 160, el: 45, mag: 3.37, name: 'Segin', constellation: 'Cassiopeia', type: 'B' },
      
      // Orion
      { az: 220, el: 35, mag: 0.12, name: 'Betelgeuse', constellation: 'Orion', type: 'M' },
      { az: 235, el: 25, mag: 0.42, name: 'Rigel', constellation: 'Orion', type: 'B' },
      { az: 225, el: 30, mag: 1.69, name: 'Bellatrix', constellation: 'Orion', type: 'B' },
      { az: 215, el: 28, mag: 2.06, name: 'Mintaka', constellation: 'Orion', type: 'O' },
      { az: 218, el: 26, mag: 1.70, name: 'Alnilam', constellation: 'Orion', type: 'B' },
      { az: 221, el: 24, mag: 1.77, name: 'Alnitak', constellation: 'Orion', type: 'O' },
      { az: 230, el: 20, mag: 2.23, name: 'Saiph', constellation: 'Orion', type: 'B' },
      
      // Bright stars
      { az: 180, el: 15, mag: -1.46, name: 'Sirius', constellation: 'Canis Major', type: 'A' },
      { az: 90, el: 45, mag: -0.04, name: 'Canopus', constellation: 'Carina', type: 'F' },
      { az: 60, el: 38, mag: 0.58, name: 'Capella', constellation: 'Auriga', type: 'G' },
      { az: 140, el: 20, mag: 0.15, name: 'Arcturus', constellation: 'Boötes', type: 'K' },
      { az: 270, el: 40, mag: 0.03, name: 'Vega', constellation: 'Lyra', type: 'A' },
      { az: 45, el: 80, mag: 0.03, name: 'Altair', constellation: 'Aquila', type: 'A' },
      { az: 315, el: 30, mag: 1.25, name: 'Procyon', constellation: 'Canis Minor', type: 'F' },
      
      // More constellations
      // Leo
      { az: 170, el: 40, mag: 1.40, name: 'Regulus', constellation: 'Leo', type: 'B' },
      { az: 165, el: 35, mag: 2.61, name: 'Denebola', constellation: 'Leo', type: 'A' },
      
      // Scorpius
      { az: 260, el: 15, mag: 0.96, name: 'Antares', constellation: 'Scorpius', type: 'M' },
      
      // Cygnus
      { az: 50, el: 70, mag: 1.25, name: 'Deneb', constellation: 'Cygnus', type: 'A' },
      
      // Taurus
      { az: 195, el: 25, mag: 0.87, name: 'Aldebaran', constellation: 'Taurus', type: 'K' },
      
      // Gemini
      { az: 195, el: 45, mag: 1.14, name: 'Pollux', constellation: 'Gemini', type: 'K' },
      { az: 190, el: 42, mag: 1.58, name: 'Castor', constellation: 'Gemini', type: 'A' },
      
      // Virgo
      { az: 150, el: 25, mag: 0.97, name: 'Spica', constellation: 'Virgo', type: 'B' },
      
      // Southern Cross
      { az: 270, el: -10, mag: 0.76, name: 'Acrux', constellation: 'Crux', type: 'B' },
      { az: 268, el: -12, mag: 1.63, name: 'Mimosa', constellation: 'Crux', type: 'B' },
      
      // Additional bright stars
      { az: 110, el: 5, mag: 1.14, name: 'Achernar', constellation: 'Eridanus', type: 'B' },
      { az: 330, el: 15, mag: 1.68, name: 'Fomalhaut', constellation: 'Piscis Austrinus', type: 'A' },
      { az: 85, el: 10, mag: 2.00, name: 'Hadar', constellation: 'Centaurus', type: 'B' },
    ];
  }

  build() {
    this.buildStarField();
    this.buildBackgroundStars();
  }

  buildStarField() {
    const positions = [];
    const colors = [];
    const sizes = [];
    const starData = [];

    // Spectral type to color mapping
    const spectralColors = {
      'O': new THREE.Color(0x9bb0ff), // Blue
      'B': new THREE.Color(0xaabfff), // Blue-white
      'A': new THREE.Color(0xcad7ff), // White
      'F': new THREE.Color(0xf8f7ff), // Yellow-white
      'G': new THREE.Color(0xfff4ea), // Yellow
      'K': new THREE.Color(0xffd2a1), // Orange
      'M': new THREE.Color(0xffcc6f)  // Red-orange
    };

    this.starCatalog.forEach(star => {
      // Convert az/el to 3D position on dome
      const azRad = star.az * Math.PI / 180;
      const elRad = star.el * Math.PI / 180;
      
      // Position on dome surface (slightly inside to be visible)
      const r = this.domeRadius * 0.995;
      const x = r * Math.cos(elRad) * Math.sin(azRad);
      const y = r * Math.sin(elRad);
      const z = r * Math.cos(elRad) * Math.cos(azRad);
      
      positions.push(x, y, z);
      
      // Color based on spectral type
      const color = spectralColors[star.type] || new THREE.Color(0xffffff);
      colors.push(color.r, color.g, color.b);
      
      // Size based on magnitude (brighter = larger)
      // Magnitude scale: lower = brighter
      const size = Math.max(1, 8 - star.mag * 2);
      sizes.push(size);
      
      starData.push(star);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        varying float vSize;
        
        void main() {
          vColor = color;
          vSize = size;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vColor;
        varying float vSize;
        
        void main() {
          // Distance from center of point
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          
          // Discard outside circle
          if (dist > 0.5) discard;
          
          // Star glow effect
          float glow = 1.0 - dist * 2.0;
          glow = pow(glow, 1.5);
          
          // Twinkle effect
          float twinkle = sin(uTime * 2.0 + vSize * 10.0) * 0.15 + 0.85;
          
          vec3 finalColor = vColor * glow * twinkle;
          
          gl_FragColor = vec4(finalColor, glow);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.stars = new THREE.Points(geometry, material);
    this.group.add(this.stars);
  }

  buildBackgroundStars() {
    // Additional faint background stars (procedural)
    const count = 1500;
    const positions = [];
    const colors = [];
    const sizes = [];

    for (let i = 0; i < count; i++) {
      // Random position on dome hemisphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5; // Upper hemisphere only
      
      const r = this.domeRadius * 0.99;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      
      positions.push(x, y, z);
      
      // Random white/blue-ish color
      const brightness = 0.7 + Math.random() * 0.3;
      colors.push(brightness * 0.9, brightness * 0.95, brightness);
      
      // Small random size
      sizes.push(0.5 + Math.random() * 1.5);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    this.backgroundStars = new THREE.Points(geometry, material);
    this.group.add(this.backgroundStars);
  }

  update(elapsedTime) {
    if (this.stars && this.stars.material.uniforms) {
      this.stars.material.uniforms.uTime.value = elapsedTime;
    }
  }

  getGroup() {
    return this.group;
  }

  // Get star at screen position (for hover tooltips)
  getStarAtPosition(screenX, screenY, camera) {
    // Simple proximity check - find nearest star to ray
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
      (screenX / window.innerWidth) * 2 - 1,
      -(screenY / window.innerHeight) * 2 + 1
    );
    
    raycaster.setFromCamera(mouse, camera);
    
    // Get all star positions
    const positions = this.stars.geometry.attributes.position.array;
    const stars = this.starCatalog;
    
    let closestStar = null;
    let closestDistance = Infinity;
    
    for (let i = 0; i < stars.length; i++) {
      const pos = new THREE.Vector3(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );
      
      const distance = raycaster.ray.distanceToPoint(pos);
      
      if (distance < 50 && distance < closestDistance) {
        closestDistance = distance;
        closestStar = stars[i];
      }
    }
    
    return closestStar;
  }
}
