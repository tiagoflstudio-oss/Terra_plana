export const waterVertexShader = `
  uniform float uTime;
  uniform float uWaveHeight;
  
  varying vec2 vUv;
  varying float vElevation;
  
  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                   + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy)),
                  dot(x12.zw,x12.zw));
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // Multiple wave layers for realistic water
    float wave1 = snoise(vec2(pos.x * 0.01 + uTime * 0.3, pos.z * 0.01)) * uWaveHeight;
    float wave2 = snoise(vec2(pos.x * 0.02 - uTime * 0.2, pos.z * 0.02 + uTime * 0.1)) * uWaveHeight * 0.5;
    float wave3 = snoise(vec2(pos.x * 0.05 + uTime * 0.5, pos.z * 0.05)) * uWaveHeight * 0.25;
    
    float totalWave = wave1 + wave2 + wave3;
    pos.y += totalWave;
    vElevation = totalWave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const waterFragmentShader = `
  uniform float uTime;
  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform vec3 uFoamColor;
  
  varying vec2 vUv;
  varying float vElevation;
  
  // Caustics function
  float caustics(vec2 uv, float time) {
    vec2 p = uv * 8.0;
    float c = sin(p.x + time) * sin(p.y + time * 0.7);
    c += sin(p.x * 1.3 - time * 0.5) * sin(p.y * 0.8 + time * 0.3);
    c += sin(p.x * 0.7 + time * 0.4) * sin(p.y * 1.2 - time * 0.6);
    return c * 0.5 + 0.5;
  }
  
  void main() {
    // Caustics pattern
    float c = caustics(vUv, uTime);
    
    // Mix colors based on elevation and caustics
    vec3 color = mix(uDeepColor, uShallowColor, c * 0.5 + vElevation * 0.1);
    
    // Add foam on wave peaks
    float foam = smoothstep(0.3, 0.8, vElevation);
    color = mix(color, uFoamColor, foam * 0.3);
    
    // Specular highlights
    float specular = pow(c, 4.0) * 0.3;
    color += vec3(specular);
    
    // Alpha varies with depth
    float alpha = 0.7 + c * 0.2;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export const sunVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const sunFragmentShader = `
  uniform float uTime;
  uniform vec3 uCoreColor;
  uniform vec3 uCoronaColor;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Noise for plasma effect
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0);
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy)), dot(x12.zw,x12.zw));
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);
    
    // Plasma effect
    float plasma = snoise(vUv * 3.0 + uTime * 0.5);
    plasma += snoise(vUv * 6.0 - uTime * 0.3) * 0.5;
    plasma = plasma * 0.5 + 0.5;
    
    // Core to corona gradient
    vec3 color = mix(uCoreColor, uCoronaColor, dist * 1.5);
    
    // Add plasma variation
    color = mix(color, uCoreColor * 1.5, plasma * 0.3);
    
    // Bright edge
    float edge = smoothstep(0.5, 0.3, dist);
    color += vec3(0.3, 0.2, 0.0) * edge;
    
    // Alpha
    float alpha = smoothstep(0.5, 0.2, dist);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export const moonFragmentShader = `
  uniform sampler2D uTexture;
  uniform float uSunAngle;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  
  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    
    // Calculate phase based on sun angle
    float phase = uSunAngle / 6.28318;
    float shadow = cos(phase * 6.28318) * 0.5 + 0.5;
    
    // Apply shadow for phase
    vec3 color = texColor.rgb * (0.3 + shadow * 0.7);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const crustVertexShader = `
  uniform float uTime;
  
  varying vec2 vUv;
  varying float vElevation;
  
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0);
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy)), dot(x12.zw,x12.zw));
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // Add rocky displacement
    float noise = snoise(vec2(pos.x * 0.005, pos.z * 0.005));
    float displacement = noise * 30.0;
    
    pos.x += displacement * normal.x;
    pos.z += displacement * normal.z;
    pos.y += abs(displacement) * 0.5;
    
    vElevation = displacement;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const crustFragmentShader = `
  uniform vec3 uTopColor;
  uniform vec3 uMidColor;
  uniform vec3 uBottomColor;
  
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    // Gradient based on vertical position
    float t = (vElevation + 30.0) / 60.0;
    t = clamp(t, 0.0, 1.0);
    
    vec3 color;
    if (t < 0.5) {
      color = mix(uBottomColor, uMidColor, t * 2.0);
    } else {
      color = mix(uMidColor, uTopColor, (t - 0.5) * 2.0);
    }
    
    // Add some variation
    color *= 0.9 + vElevation * 0.005;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default {
  waterVertexShader,
  waterFragmentShader,
  sunVertexShader,
  sunFragmentShader,
  moonFragmentShader,
  crustVertexShader,
  crustFragmentShader
};
