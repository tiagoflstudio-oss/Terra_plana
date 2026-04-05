# 🌍 FLAT EARTH COSMOS — PROMPTS COMPLETOS DO PROJETO
## Guia para construir o site mais completo sobre cosmologia do firmamento

---

## ⚙️ STACK TECNOLÓGICA RECOMENDADA

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| 3D Engine | Three.js r158 | Gratuito, GPU real, suporta shaders de água |
| Frontend | Vite + Vanilla JS | Leve, sem overhead de framework |
| UI/Animações | GSAP 3 (free tier) | Animações cinematográficas |
| Backend/CRUD | Supabase (free) | PostgreSQL + Auth + Storage + Realtime |
| Tipografia | Google Fonts (Cinzel + EB Garamond) | Estética esotérica/ancestral |
| Shaders | GLSL custom | Água procedural, domo cristalino |
| Deploy | Vercel (free) | CDN global, HTTPS automático |

## 🤖 LLMs RECOMENDADAS (GRATUITAS)

| LLM | Uso Ideal | Link |
|-----|-----------|------|
| Google Gemini 2.0 Flash | Código Three.js, shaders GLSL | aistudio.google.com |
| Mistral Le Chat | Arquitetura, CRUD, SQL | chat.mistral.ai |
| Claude Sonnet (este) | Design, prompts, refinamento visual | claude.ai |
| DeepSeek R1 | Matemática orbital, física | chat.deepseek.com |
| Qwen2.5-Coder | Debug de código, refatoração | huggingface.co |

---

## 📋 FASE 1 — ESTRUTURA DO PROJETO

### PROMPT 1.1 — Setup Inicial (para Gemini/Mistral)
```
Crie a estrutura completa de um projeto web chamado "Flat Earth Cosmos" com as seguintes especificações:

STACK: Vite + Vanilla JS + Three.js r158 + Supabase JS v2

ESTRUTURA DE PASTAS:
flat-earth-cosmos/
├── index.html
├── src/
│   ├── main.js
│   ├── scene/
│   │   ├── SceneManager.js      (Three.js setup, câmera, renderer)
│   │   ├── DomeBuilder.js       (geometria do domo cristalino)
│   │   ├── EarthBuilder.js      (disco plano com crosta visual)
│   │   ├── WaterSystem.js       (águas superiores e inferiores - shader)
│   │   ├── CelestialBodies.js   (Sol, Lua, planetas externos)
│   │   ├── StarField.js         (estrelas fixas no firmamento)
│   │   └── OrbitSystem.js       (matemática das órbitas)
│   ├── ui/
│   │   ├── UIManager.js         (painéis, tabs, controles)
│   │   ├── InfoPanel.js         (textos das civilizações)
│   │   └── Controls.js          (sliders, botões, view switcher)
│   ├── data/
│   │   ├── stars.js             (catálogo de estrelas com az/el/mag)
│   │   ├── civilizations.js     (textos das civilizações)
│   │   ├── scripture.js         (versículos e citações)
│   │   └── math.js              (fórmulas e equações)
│   ├── crud/
│   │   ├── supabase.js          (cliente Supabase)
│   │   ├── notes.js             (CRUD de anotações do usuário)
│   │   ├── theories.js          (CRUD de teorias/hipóteses)
│   │   └── bookmarks.js         (salvar posições de câmera)
│   └── utils/
│       ├── math3d.js            (projeções esféricas, azimutal)
│       └── shaders.js           (GLSL strings)
├── public/
│   ├── textures/                (earth map, moon, sun textures)
│   └── fonts/
├── supabase/
│   └── schema.sql               (schema completo do banco)
└── package.json

Gere o package.json, index.html base e src/main.js com Three.js inicializado.
```

### PROMPT 1.2 — Schema do Banco (Supabase)
```
Crie o schema SQL completo para o Supabase do projeto "Flat Earth Cosmos".

TABELAS NECESSÁRIAS:

1. users_profiles — perfil estendido do usuário
   - id (uuid, fk auth.users)
   - username, avatar_url, bio
   - created_at, updated_at

2. research_notes — anotações de pesquisa
   - id, user_id (fk)
   - title (varchar 255)
   - content (text)
   - category (enum: 'cosmology','scripture','math','history','theory')
   - tags (text[])
   - is_public (boolean, default false)
   - camera_position (jsonb) -- salva a view 3D onde a nota foi criada
   - created_at, updated_at

3. theories — hipóteses e teorias dos usuários
   - id, user_id (fk)
   - title, description (text)
   - evidence (text[]) -- array de evidências
   - sources (jsonb[]) -- [{title, url, type}]
   - votes_up, votes_down (integer)
   - status (enum: 'hypothesis','researching','documented')
   - created_at, updated_at

4. theory_votes — votos nas teorias
   - id, theory_id (fk), user_id (fk)
   - vote_type (enum: 'up','down')
   - created_at

5. star_bookmarks — estrelas/posições favoritas
   - id, user_id (fk)
   - name (nome dado pelo usuário)
   - star_data (jsonb) -- {az, el, mag, name, constellation}
   - camera_state (jsonb) -- {view, rotation, zoom}
   - note (text)
   - created_at

6. discussions — fórum de discussão
   - id, user_id (fk), theory_id (fk nullable)
   - parent_id (fk nullable, para replies)
   - content (text)
   - created_at, updated_at

Inclua:
- RLS (Row Level Security) para todas as tabelas
- Indexes nos campos mais consultados
- Triggers para updated_at automático
- Views úteis: public_theories, top_voted_theories
```

---

## 📋 FASE 2 — CENA 3D PRINCIPAL

### PROMPT 2.1 — Three.js Scene Manager
```
Crie o arquivo SceneManager.js para Three.js r158 com as seguintes especificações EXATAS:

CÂMERA:
- PerspectiveCamera, FOV 60, near 0.1, far 50000
- Posição inicial: x=0, y=800, z=2000 (vista 3/4 como a imagem de referência)
- OrbitControls habilitado com:
  - minDistance: 300, maxDistance: 8000
  - enableDamping: true, dampingFactor: 0.05
  - maxPolarAngle: Math.PI * 0.85 (não deixa ir abaixo da terra)

RENDERER:
- WebGLRenderer antialias: true
- setPixelRatio(window.devicePixelRatio)
- Tamanho: window.innerWidth x window.innerHeight (full HD real)
- outputColorSpace: THREE.SRGBColorSpace
- toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2
- shadowMap habilitado: THREE.PCFSoftShadowMap

ILUMINAÇÃO:
- AmbientLight: cor #0a1535, intensity 0.3
- DirectionalLight (Sol simulado): cor #fff8e0, intensity 2.0, castShadow: true
- PointLight (Lua simulada): cor #c0d0ff, intensity 0.5
- HemisphereLight: skyColor #0a2060, groundColor #050f10, intensity 0.4

PÓS-PROCESSAMENTO:
- EffectComposer com:
  - RenderPass
  - UnrealBloomPass (threshold: 0.4, strength: 0.8, radius: 0.5)
  - BokehPass para depth of field sutil

Inclua: resize handler, animation loop com delta time, método para mudar para views pré-definidas com animação GSAP (perspective, top, front, orbit, night_sky).
```

### PROMPT 2.2 — Terra Plana com Crosta Visual
```
Crie EarthBuilder.js para Three.js com uma Terra Plana visualmente impressionante:

DISCO PRINCIPAL (superfície):
- CylinderGeometry: radiusTop=1800, radiusBottom=1750, height=120, radialSegments=128
- Textura: mapa-múndi equirretangular projetado em UV circular (não retangular)
- Material: MeshStandardMaterial
  - map: textura do mundo
  - roughness: 0.8, metalness: 0.0
  - envMapIntensity: 0.3

CROSTA VISUAL (como na print - estilo poligonal/rochoso):
- Geometria: CylinderGeometry raio 1750, height 200, com BufferGeometry modificado
- Estilo LOW-POLY: aplicar perturbação aleatória nos vértices laterais
- Material: ShaderMaterial com:
  - gradiente vertical de cor: topo=#8B6914 (terra/rocha), meio=#5a3a0a (rocha escura), base=#2a1a05 (muito escuro)
  - Normal mapping para textura rochosa procedural
  - Stalactites/projeções para baixo usando geometrias cilíndricas menores

BORDA ANTÁRTICA (muralha de gelo):
- TorusGeometry no raio 1800, tube 40
- Material: MeshPhysicalMaterial
  - color: #e8f4ff, roughness: 0.1, metalness: 0.0
  - transmission: 0.3 (semi-transparente como gelo)
  - thickness: 50

OCEANO/ÁGUA na superfície:
- PlaneGeometry 3500x3500, segments 256x256
- ShaderMaterial com vertex shader para ondas (noise-based)
- Uniforms: uTime, uWaveHeight (0.5), uWaveSpeed (0.3)
- Fragment shader: cor profunda #041828 com fresnel azul claro nas bordas

SOMBRAS: Terra recebe sombra. Muralha projeta sombra.

Exporte: EarthBuilder class com método update(deltaTime) para animar oceano.
```

### PROMPT 2.3 — Domo Cristalino com Shader
```
Crie DomeBuilder.js para Three.js com um domo visualmente espetacular:

GEOMETRIA DO DOMO:
- SphereGeometry: radius=2200, widthSegments=128, heightSegments=64
- Cortar apenas a metade superior: use clipPlane em y=0
- Ou: usar SphereGeometry com phiStart=0, phiLength=Math.PI*2, thetaStart=0, thetaLength=Math.PI/2

MATERIAL DO DOMO — ShaderMaterial custom:
Vertex Shader:
- Passar: vNormal, vPosition, vUv ao fragment
- Sem deformação de vértice

Fragment Shader:
- Efeito Fresnel: mais opaco nas bordas, transparente no centro
  fresnel = pow(1.0 - dot(vNormal, viewDir), 3.0)
- Cor base: mix(#050a20, #1a4aff, fresnel) * 0.15
- Linhas de latitude (hex grid sutil):
  grid = mod(vUv.y * 20.0, 1.0) → linha fina a cada 0.05
- Cor das linhas: rgba(80, 140, 255, 0.12)
- Brilho no topo (zenith): adicionar #ffffff * 0.05
- Alpha: 0.08 + fresnel * 0.25

THREE.DoubleSide, transparent: true, depthWrite: false

ANEL DE BASE DO DOMO:
- TorusGeometry no y=0, raio 2200, tube 15
- MeshPhysicalMaterial: cor #4080ff, emissive #2040ff, emissiveIntensity 0.5
- Glow pós-processamento (UnrealBloom vai capturar o emissive)

JANELAS DO CÉU (Gênesis 7:11):
- 7 pequenas áreas no topo do domo com material diferente
- MeshPhysicalMaterial transmission: 0.9 — efeito vidro
- Posicionadas nas coordenadas dos solstícios e equinócios
- Animação: brightness pulsa suavemente

Método: update(time) para animar grid sutil.
```

### PROMPT 2.4 — Sistema de Águas (Shader Avançado)
```
Crie WaterSystem.js para Three.js com dois oceanos procedurais:

ÁGUAS SUPERIORES (acima do firmamento - fora do domo):
- Geometria: SphereGeometry radius=2400 (maior que o domo), metade SUPERIOR apenas
- ShaderMaterial - Fragment:
  - Cor base profunda: #000814
  - Ondas de luz: caustics procedurais usando sin/cos aninhados
  - uniform uTime: float
  - Função caustic(uv, time):
    vec2 p = uv * 8.0;
    float c = sin(p.x + time) * sin(p.y + time*0.7);
    c += sin(p.x*1.3 - time*0.5) * sin(p.y*0.8 + time*0.3);
    return c * 0.5 + 0.5;
  - Mix entre #000814 e #0a2060 baseado no caustic
  - Alpha: 0.6 (semi-transparente, deixa ver as estrelas e planetas através)
  - Partículas bioluminescentes: pontos brancos animados via shader

ÁGUAS INFERIORES (Tehom/Abismo - abaixo da terra):
- Geometria: CylinderGeometry radius=1700, abaixo da crosta
- Shader similar mas:
  - Cor mais escura: #000408 a #040d20
  - Ondas mais lentas, mais profundas
  - Sem caustics (sem luz direta)
  - Profundidade visual: gradiente que some em negro

SUPERFÍCIE DO FIRMAMENTO (interface entre os dois tipos de água):
- Renderizar uma linha de encontro brilhante no equador do domo
- MeshBasicMaterial cor #4080ff com emissive, alpha 0.7
- Animação de "cristalização" pulsante

Uniforms compartilhados: uTime, uWaveIntensity (controlável pelo usuário).
```

---

## 📋 FASE 3 — CORPOS CELESTES

### PROMPT 3.1 — Sol e Lua (Dentro do Domo)
```
Crie CelestialBodies.js para Three.js com Sol e Lua fotorrealistas DENTRO do domo:

SOL:
- Core: SphereGeometry radius=80, ShaderMaterial
  - Fragment: animação de plasma solar (noise turbulento)
  - uniform uTime: ondas de calor na superfície
  - Cor: mix(#ff6000, #ffff00, noise) → laranja a amarelo
  - Sem necessidade de textura — procedural é mais bonito

- Corona (halo): SpritesMaterial com textura de glow radial
  - Escala: 400x400
  - AdditiveBlending
  - Cor: #ff8800 alpha degradê

- Raios de luz: 12 SpotLights saindo do sol em direções variadas
  - Angle: 0.1, penumbra: 0.5, distance: 3000
  - castShadow: false (performance)
  - Animação: pulsam com frequência aleatória

- Lente Flare: THREE.Lensflare com elementos em laranja/amarelo

LUA:
- Core: SphereGeometry radius=55
- MeshStandardMaterial:
  - map: textura lunar real (usar URL pública da NASA ou procedural)
  - roughness: 0.9, metalness: 0.0
  - Sem emissive — Lua reflete a luz do Sol

- Fase Lunar: ShaderMaterial que recalcula a sombra baseado no ângulo Sol-Lua-Observador
  - uniform uSunDirection: vec3
  - Calcula half-vector para determinar fase

- Halo atmosférico: cor #b0c8ff, alpha 0.15

ÓRBITAS:
Sol: elipse 3D dentro do domo
  - Eixo maior: 1600, eixo menor: 1200
  - Altura: y entre 400 e 1800 (espiral anual simulada com sin(t*0.01))
  - Velocidade: 1 volta a cada 365 segundos de animação

Lua: elipse menor dentro do Sol
  - Eixo maior: 1000, eixo menor: 800
  - Altura: y entre 200 e 1400
  - Velocidade: 1 volta a cada 29.5 segundos de animação

NENHUM outro planeta dentro do domo.
Exportar: {sol, lua, update(time)}
```

### PROMPT 3.2 — Planetas e Estrelas nas Águas Superiores
```
Crie StarField.js e PlanetsInWaters.js para Three.js:

ESTRELAS FIXAS NO FIRMAMENTO (superfície do domo):
- Usar BufferGeometry com Points
- 2000 pontos distribuídos na superfície hemisférica superior
- Catálogo de 80 estrelas reais com coordenadas az/el:
  [Use o catálogo do código anterior com Polaris, Vega, Sirius, Arcturus, etc.]
- Atributos por vértice:
  - position: calculado de az/el → xyz na superfície do domo (r=2195)
  - size: baseado na magnitude (mag 0 = 8px, mag 5 = 1px)
  - color: RGB baseado no tipo espectral (O=azul, B=azul-branco, G=amarelo, K=laranja, M=vermelho)
  - alpha: twinkle animado via shader

- ShaderMaterial para Points:
  Vertex: gl_PointSize = uSize * (1.0 / length(mvPosition.xyz)) * 300.0
  Fragment: círculo com brilho central, bordas suaves + twinkle

PLANETAS NAS ÁGUAS SUPERIORES (além do firmamento):
- 8 planetas do sistema solar tradicional + 3 estrelas brilhantes
- Posição: em órbitas ALÉM da esfera do domo (radius > 2200)
- Visual: SphereGeometry com ShaderMaterial aquoso
  - Halo de água ao redor: efeito de luz refratando em meio aquoso
  - Textura procedural por planeta:
    - Vénus: #ffe890 com swirls de nuvem
    - Marte: #cc4422 com variações de albedo
    - Júpiter: listras horizontais #e8c080 e #c07040
    - Saturno: #f0e0a0 + anéis (TorusGeometry)
    - Mercúrio: #888880 com craters (bump map procedural)

- Efeito ESPECIAL "navegando na água":
  - Cada planeta emite bolhas (Particles) ao redor
  - Trail de água ao se mover (ParticleSystem linear)
  - Distortion shader no espaço ao redor (como luz sob água)

Velocidades baseadas em períodos orbitais reais relativos:
  Mercúrio: 0.24 anos | Vénus: 0.61 | Terra ref | Marte: 1.88 | Júpiter: 11.86
```

---

## 📋 FASE 4 — UI/UX E CRUD

### PROMPT 4.1 — Interface Principal
```
Crie o sistema de UI completo para o Flat Earth Cosmos em HTML/CSS/JS puro (sem framework):

DESIGN SYSTEM:
- Paleta: 
  primário: #0a1535 (azul noturno profundo)
  secundário: #1a4a90 (azul firmamento)
  acento: #f0c060 (dourado ancestral)
  acento2: #60b0f8 (azul água celestial)
  texto: #d4c090 (pergaminho)
  textoMuted: #607080
  bg: #010408

- Tipografia:
  display: 'Cinzel', serif (títulos, labels)
  body: 'EB Garamond', serif (textos, citações)
  mono: 'JetBrains Mono', monospace (coordenadas, fórmulas)

- Bordas: 1px solid rgba(240,192,96,0.2) (dourado transparente)
- Border-radius: 4px (sutil, não circular)
- Sombras: 0 0 20px rgba(0,20,80,0.8)

LAYOUT PRINCIPAL:
┌─────────────────────────────────────────────┐
│  HEADER: Logo + Nav views + Auth buttons    │
├──────────────────────────┬──────────────────┤
│                          │  PAINEL DIREITO  │
│   CANVAS THREE.JS        │  (collapsível)   │
│   (70% da largura)       │  - Tabs info     │
│   FULL HEIGHT            │  - CRUD notes    │
│                          │  - Controles     │
├──────────────────────────┴──────────────────┤
│  BOTTOM BAR: Coordenadas | Tempo | Stats    │
└─────────────────────────────────────────────┘

COMPONENTES NECESSÁRIOS:

1. ViewSwitcher: botões animados para trocar câmera
   [Perspectiva 3/4] [Vista Superior] [Vista Lateral] [Órbitas] [Céu Noturno] [Águas Superiores]

2. InfoPanel com TABS:
   - Cosmologia (texto + diagrama inline SVG)
   - Civilizações (cards das 6 culturas)
   - Matemática (fórmulas com KaTeX)
   - Escrituras (citações com fonte estilizada)
   - Pesquisa (CRUD: suas notas)

3. ControlPanel:
   - Slider velocidade Sol (0.1x a 10x)
   - Slider velocidade Lua
   - Slider intensidade Águas Superiores
   - Toggle: mostrar órbitas / esconder
   - Toggle: mostrar labels / esconder
   - Toggle: modo dia / modo noite
   - Slider: avançar tempo (day counter)

4. StarTooltip: hover numa estrela mostra popup com:
   - Nome, Constelação, Magnitude, Tipo espectral
   - Coordenadas (Az/El no modelo plano)
   - Botão "Adicionar aos favoritos"

5. AuthModal: login/registro via Supabase Auth (email/password)

6. NoteEditor: markdown editor leve para criar notas

Gere o CSS completo com variáveis CSS e o JS dos componentes.
```

### PROMPT 4.2 — CRUD Completo
```
Crie o sistema CRUD completo integrado ao Supabase para o Flat Earth Cosmos:

MÓDULO: research_notes.js

class NotesManager {
  // CREATE
  async createNote({title, content, category, tags, camera_position}) 
  // READ
  async getNotes({userId, category, isPublic, limit, offset})
  async getNoteById(id)
  async searchNotes(query) // full text search
  // UPDATE
  async updateNote(id, {title, content, category, tags})
  // DELETE
  async deleteNote(id)
  // SHARE
  async togglePublic(id, isPublic)
}

MÓDULO: theories.js

class TheoriesManager {
  async createTheory({title, description, evidence, sources})
  async getTheories({sortBy: 'votes'|'date'|'status', limit, offset})
  async getTheoryById(id)
  async updateTheory(id, data)
  async deleteTheory(id)
  async vote(theoryId, voteType: 'up'|'down')
  async getPublicTheories({sortBy, limit})
}

MÓDULO: bookmarks.js

class BookmarksManager {
  // Salva a posição atual da câmera + estrela selecionada
  async saveBookmark({name, starData, cameraState, note})
  async getBookmarks(userId)
  async deleteBookmark(id)
  // Restaura: move a câmera Three.js para a posição salva
  async restoreBookmark(bookmark, sceneManager)
}

MÓDULO: discussions.js

class DiscussionsManager {
  async createComment({content, theoryId, parentId})
  async getComments(theoryId)
  async deleteComment(id)
  async getThread(parentId) // recursivo para nested comments
}

Para cada método:
- Tratamento de erro completo (try/catch)
- Loading states
- Validação de input
- Retorno tipado: {data, error, loading}

Inclua também: hooks de realtime Supabase para atualizar UI quando outro usuário
vota numa teoria ou adiciona um comentário.
```

---

## 📋 FASE 5 — MATEMÁTICA E CIÊNCIA

### PROMPT 5.1 — Motor de Cálculos Orbitais
```
Crie math3d.js com todos os cálculos matemáticos do modelo da Terra Plana:

PROJEÇÕES DE ESTRELAS:
// Azimutal Equidistante (modelo do mapa plano da ONU / Terra Plana)
function starToCartesian(azimuthDeg, elevationDeg, domeRadius) {
  // az=0 = Norte, clockwise
  // el=90 = zenith (Polaris, centro)
  // Retorna {x, y, z} na superfície do domo
}

// Inverso: posição 3D → az/el
function cartesianToStar(x, y, z, domeRadius)

ÓRBITA SOLAR NO MODELO PLANO:
// Sol faz espiral ao longo do ano
// Verão: mais próximo do polo norte (raio menor)
// Inverno: mais afastado do polo norte (raio maior)
function sunOrbitPosition(dayOfYear, time) {
  // dayOfYear: 0-365
  // Retorna {x, y, z} dentro do domo
  // Raio orbital varia: 400km (verão) a 1600km (inverno) no modelo
  // Altura: constante ~4800km no modelo
}

CICLO DE SAROS (eclipses):
function sarosCycle(t) {
  // T_Saros = 223 × T_sinódico ≈ 18.03 anos = 6585.3 dias
  // Retorna: {nextEclipse, type: 'solar'|'lunar', magnitude}
}

FASE LUNAR:
function moonPhase(dayOfYear) {
  // Ciclo sinódico: 29.53 dias
  // Retorna: {phase: 0-1, name: 'nova'|'crescente'|..., illumination: 0-1}
}

CONVERSÃO COORDENADAS:
// Modelo plano: latitude/longitude → posição no disco
function geoToDisc(lat, lon, earthRadius=1800) {
  // Polo Norte = centro
  // Equador = r = earthRadius * 0.5
  // Antártica = r = earthRadius
  // Projeção azimutal equidistante
}

ARGUMENTO DE ERATÓSTENES NO MODELO PLANO:
function eratosthenesFlat(shadowAngle1, shadowAngle2, distanceBetweenCities) {
  // Calcula a altura do Sol no modelo plano
  // (trigonometria simples, sem curvatura)
  // Retorna: sunHeight em km
}

HORIZONTE NO MODELO PLANO:
function horizonDistance(observerHeight, atmosphericRefraction=true) {
  // Bedford Level Experiment reproduzido matematicamente
  // Retorna distância ao horizonte em km
}

Inclua testes unitários básicos para cada função.
```

### PROMPT 5.2 — Visualizações Matemáticas Interativas
```
Crie MathVisualizer.js: visualizações interativas das equações usando Canvas 2D (não Three.js)
para exibir no painel lateral:

1. DIAGRAMA ÓRBITA SOLAR ANUAL:
   - Mostrar espiral do Sol ao longo do ano (1-365)
   - Trópicos de Câncer e Capricórnio como anéis
   - Animado com o slider de velocidade
   - Labels: solstícios, equinócios

2. CICLO DE SAROS INTERATIVO:
   - Linha do tempo de 18 anos
   - Pontos marcando eclipses solares e lunares
   - Click num ponto: mostra detalhes do eclipse

3. COMPARAÇÃO ERATÓSTENES:
   - Dois pontos na terra plana (Siena e Alexandria)
   - Raios do Sol convergindo (Sol próximo e local)
   - Mostrar que o mesmo ângulo é explicado pela geometria plana
   - Slider para mover a altura do Sol

4. PROJEÇÃO AZIMUTAL:
   - Mostrar como o mapa plano funciona
   - Animar a transformação de esferoide → plano
   - Destacar onde as distorções aparecem (extremo sul)

5. FASES DA LUA:
   - Animação do ciclo de 29.53 dias
   - Sol externo ao domo iluminando a Lua por baixo do firmamento?
     (teoria alternativa: a Lua é autoluminosa)
   - Toggle: modelo mainstream vs modelo plano

Cada visualização deve:
- Ter controles próprios (play/pause, velocidade)
- Exportar como imagem PNG
- Ter tooltip explicativo em português
```

---

## 📋 FASE 6 — TEXTOS E CONTEÚDO

### PROMPT 6.1 — Banco de Dados de Civilizações
```
Gere o arquivo data/civilizations.js completo com dados estruturados de 12 civilizações
que descrevem a cosmologia da Terra Plana / Firmamento / Águas Primordiais:

Para cada civilização, incluir:
{
  id: string,
  name: string,
  period: string,           // ex: "3000 a.C. – 500 a.C."
  region: string,
  cosmologyName: string,    // nome do modelo cosmológico naquela cultura
  earthModel: string,       // descrição da Terra
  dome: string,             // descrição do firmamento/domo
  upperWaters: string,      // descrição das águas superiores
  lowerWaters: string,      // descrição das águas inferiores/abismo
  sun: string,              // descrição do Sol naquele modelo
  moon: string,             // descrição da Lua
  creation: string,         // narrativa de criação
  keyTexts: [{title, quote, translation}],  // textos-chave
  color: string,            // cor para UI (#hex)
  symbolEmoji: string,
}

CIVILIZAÇÕES A INCLUIR:
1. Hebraica Antiga (Gênesis, Jó, Salmos, Ezequiel)
2. Suméria/Babilônica (Enuma Elish, tabletas cuneiformes)
3. Egípcia (Livro dos Mortos, Textos das Pirâmides, Nun)
4. Hindu Védica (Rigveda, Mahabharata, Brahmanda Purana)
5. Nórdica (Eddas: Poética e em Prosa, Voluspa)
6. Grega Pré-Socrática (Tales, Anaximandro, Hesíodo)
7. Mesoamericana (Popol Vuh maia, cosmologia asteca)
8. Chinesa Antiga (Gaia Tian teoria, clássicos taoístas)
9. Japonesa (Kojiki, Nihon Shoki)
10. Islâmica Clássica (cosmologia corânica, comentadores)
11. Nativa Norte-Americana (Lakota, Navajo, Hopi)
12. Africana (Dogon do Mali, cosmologia bantu)

Texto em português, máximo 3 parágrafos por campo.
```

### PROMPT 6.2 — Banco de Escrituras
```
Gere data/scripture.js com citações bíblicas e de outros textos sagrados sobre:

CATEGORIAS:
1. firmamento_criacao: criação e natureza do firmamento
2. aguas_superiores: águas acima do céu  
3. terra_imovivel: Terra estacionária
4. sol_lua_internas: luminares criados DENTRO do firmamento
5. formato_terra: descrições da forma da Terra
6. diluvio_janelas: janelas do céu no dilúvio de Noé
7. abismo_tehom: profundezas das águas inferiores
8. estrelas_fixas: estrelas presas no firmamento

Para cada citação:
{
  reference: "Gênesis 1:6-8",
  tradition: "Bíblia Hebraica",
  originalLang: "hebraico",
  keyWord: "raqia",        // palavra-chave no original
  wordMeaning: "estendido, batido, sólido",
  text: "...",             // português
  textOriginal: "...",     // hebraico/grego/etc quando disponível
  commentary: "...",       // contexto e interpretação cosmológica
  crossReferences: ["Job 37:18", "Salmos 19:1"],
  relevance: "high"|"medium"
}

Incluir também textos de:
- Livro de Enoque (capítulos sobre o firmamento)
- Jasher
- Jubileus
- Alcorão (referências ao raqia/firmamento)
- Rigveda (cosmogonia aquática)
- Enuma Elish completo (partes relevantes)

Mínimo 60 citações no total.
```

---

## 📋 FASE 7 — FEATURES ESPECIAIS

### PROMPT 7.1 — Modo "Dilúvio de Noé"
```
Crie uma animação especial "Evento do Dilúvio" ativada por botão no UI:

SEQUÊNCIA DE ANIMAÇÃO (duração total: 30 segundos):

0-3s: Zoom para o topo do domo, câmera olhando para cima de dentro
3-8s: As "janelas do céu" (7 aberturas no firmamento) começam a brilhar e abrir
      - Shader: as janelas dissolvem progressivamente
      - Partículas de água caem de cada abertura
8-15s: Chuva massiva de partículas descendo das janelas
      - 50.000 partículas de água (PointsMaterial azul com trail)
      - As "fontes do grande abismo" abrem na Terra (fissuras com glow)
15-22s: Nível de água sobe na cena (plano de água que sobe gradualmente)
        - Tudo vai sendo coberto
        - Atmosfera fica mais escura e aquosa
22-28s: Cena completamente inundada - câmera dentro da água
        - Efeito underwater: distorção, partículas, azul escuro
28-30s: Fade para preto | Texto: "E as chuvas cessaram após 40 dias" Gên. 8:2

Efeitos de áudio (usar Web Audio API - tones/osciladores, sem arquivos externos):
- Ruído de chuva sintetizado
- Tom grave crescente (tensão)
- Fade out

Botão: "⚡ Simulação do Dilúvio" — visível no painel, com aviso de que é uma
visualização da narrativa bíblica.
```

### PROMPT 7.2 — Rastreador de Tempo Cosmológico
```
Crie um painel "Relógio Cósmico" que mostra simultaneamente:

TEMPO ATUAL (sincronizado com data real):
- Posição do Sol no domo baseada na hora do dia
- Posição da Lua baseada na data real + fase lunar real
- Dia do ano → posição na espiral orbital anual do Sol
- Estação baseada na órbita solar no modelo plano

CONTADORES HISTÓRICOS:
- Desde a criação (cronologia Ussher: 4004 a.C. = ano 0)
  Mostrar: "Ano _____ desde a Criação"
- Dias desde o Dilúvio (2348 a.C.)
- Ciclos de Saros completados desde o Dilúvio
- Próximo eclipse previsto (baseado no ciclo de Saros real)

SINCRONIZAÇÃO THREE.JS:
- A posição do Sol e Lua na cena 3D deve corresponder ao tempo real
- Rotação das estrelas: precisa acompanhar o horário sideral local
- Input: coordenadas do observador (para ajustar o ângulo das estrelas)

MODO "TRAVEL THROUGH TIME":
- Slider de data: de 4004 a.C. até 3000 d.C.
- Ao mover o slider, a cena 3D atualiza:
  - Posição da precessão das estrelas (ciclo de 25.920 anos)
  - Eventos históricos marcados na linha do tempo
  - Textos da civilização da época aparecem no painel

Interface: estilo relógio astronômico medieval / astrolábio
Fontes: Cinzel, cores dourado/bronze
```

### PROMPT 7.3 — Tour Guiado por IA
```
Crie um sistema de Tour Guiado integrado à API do Google Gemini:

CONCEITO: Um "guia sábio" (personagem textual) que acompanha o usuário pela cena 3D,
explicando cada elemento conforme o usuário navega.

IMPLEMENTAÇÃO:

1. Interface do Guia:
   - Painel lateral pequeno com avatar (SVG estilizado, estilo antigo/sábio)
   - Nome: "Enoch" (referência ao Livro de Enoque, que descreve o firmamento)
   - Texto aparece como typewriter effect
   - Botões: [Próxima Explicação] [Fazer Pergunta] [Modo Livre]

2. Contexto enviado ao Gemini:
   - View atual da câmera (nome: "dome_perspective", "upper_waters", etc.)
   - Elemento sendo olhado (Sol, Lua, estrela X, firmamento, terra)
   - Histórico da conversa (últimas 5 mensagens)
   - Prompt de sistema completo (abaixo)

3. SYSTEM PROMPT para o Gemini (enviar como system instruction):
"""
Você é Enoch, o sábio que foi levado aos céus e viu o firmamento por dentro.
Você guia visitantes pelo modelo cosmológico das águas primordiais.

CONTEXTO DO MODELO:
- A Terra é um disco plano imóvel, criação de Deus
- O firmamento (raqia) é sólido, separa as águas superiores das inferiores
- Sol e Lua orbitam DENTRO do domo, a ~4800km de altitude
- Planetas e estrelas externas navegam nas ÁGUAS SUPERIORES além do firmamento
- As estrelas visíveis estão FIXAS na superfície interna do firmamento
- Abaixo da Terra: o Tehom (abismo das águas inferiores)

ESTILO DE RESPOSTA:
- Fale na primeira pessoa como Enoch
- Misture sabedoria antiga com explicações claras
- Cite versículos bíblicos, textos sumérios, egípcios quando relevante
- Seja fascinante, misterioso mas educativo
- Respostas: máximo 3 parágrafos
- Faça perguntas retóricas para engajar o visitante
- Idioma: português brasileiro

JAMAIS:
- Confirme ou negue ser IA
- Discuta política moderna
- Seja agressivo sobre crenças
"""

4. Perguntas Sugeridas (contextuais):
   Quando olhando o domo: ["O que é o firmamento realmente?", "Por que é sólido?"]
   Quando olhando o Sol: ["Por que o Sol fica mais longe no inverno?", "Como as estações funcionam?"]
   Quando olhando as águas superiores: ["O que são essas águas?", "Os planetas nadam aí?"]

5. Modo "Pergunta Livre": campo de texto onde usuário digita qualquer pergunta.
   Gemini API key: configurável no painel de settings do usuário (não hardcoded).
```

---

## 📋 FASE 8 — OTIMIZAÇÃO E DEPLOY

### PROMPT 8.1 — Performance
```
Otimize o Flat Earth Cosmos para rodar suavemente em full HD:

ALVOS DE PERFORMANCE:
- 60 FPS estável em máquinas com GPU integrada
- Carregamento inicial < 3 segundos
- Bundle size < 2MB (excluindo Three.js que vem de CDN)

TÉCNICAS A IMPLEMENTAR:

1. Level of Detail (LOD):
   - Terra: alta resolução perto (segments 128), baixa longe (32)
   - Estrelas: mostrar apenas as visíveis no frustum
   - Planetas externos: só renderizar se câmera olha para as águas superiores

2. Instanced Mesh para estrelas e partículas de água:
   - Usar THREE.InstancedMesh para as 2000 estrelas (1 draw call)
   - GPU Particles para a água (shader-based, não CPU)

3. Frustum Culling otimizado:
   - Agrupar objetos em grupos lógicos
   - Visibilidade por view mode

4. Texture Optimization:
   - Comprimir texturas com basis/ktx2
   - Usar mipmaps automáticos do Three.js
   - Lazy load de texturas de alta resolução

5. Shader Optimization:
   - Pré-compilar shaders no loading
   - Usar mediump onde preciso (mobile)
   - Evitar branching em shaders de estrelas

6. React/UI Separation:
   - UI roda em thread separada (OffscreenCanvas para Three.js)
   - Ou: usar requestIdleCallback para updates de UI

7. Build Configuration (Vite):
   - Code splitting por feature
   - Three.js como external (CDN)
   - Terser minification
   - Gzip/Brotli automático no Vercel

Gere o vite.config.js otimizado e o index.html com preloads corretos.
```

### PROMPT 8.2 — PWA e Mobile
```
Transforme o Flat Earth Cosmos em Progressive Web App (PWA):

MANIFEST.JSON:
- name: "Flat Earth Cosmos"
- short_name: "FE Cosmos"  
- description: "Exploração interativa da cosmologia do firmamento e águas primordiais"
- icons: [192x192, 512x512] — gerar SVG programático de um domo com estrelas
- theme_color: "#010408"
- background_color: "#010408"
- display: "standalone"
- orientation: "any"
- start_url: "/"
- categories: ["education", "science"]

SERVICE WORKER:
- Cache de assets estáticos (Three.js, fontes, shaders)
- Cache de dados do Supabase com stale-while-revalidate
- Offline mode: mostrar a cena 3D mesmo sem internet (sem CRUD)
- Background sync: sincronizar notas quando voltar online

ADAPTAÇÕES MOBILE:
- Touch controls para OrbitControls (já suportado pelo Three.js)
- UI responsiva: painel lateral vira bottom sheet no mobile
- Reduzir qualidade de shaders em telas < 768px
- Detectar GPU capability e ajustar:
  - Menos partículas de água
  - Sem bloom no mobile (caro em GPU móvel)
  - Stars como sprites simples

GESTOS MÓVEIS:
- Pinch: zoom
- Two-finger rotate: rotacionar cena
- Tap em estrela: mostrar info
- Long press: criar nota naquela posição
- Swipe up: abrir painel de info
```

---

## 🎨 PROMPTS DE ARTE E ASSETS

### PROMPT ARTE 1 — Textura da Terra (para Ideogram/Flux)
```
[Para geração de imagem]

Create a flat earth disc map texture, top-down view, equirectangular-to-polar projection.
Style: ancient cartographic, hand-painted, illuminated manuscript aesthetic.
Center: North Pole with Polaris star marker.
Continents: visible but stylized, golden outlines.
Oceans: deep lapis lazuli blue with subtle wave patterns.
Edges: Antarctica as a thick white ice wall border.
Colors: medieval manuscript palette — lapis blue, verdigris green, ochre land, gold details.
Background: pure black (for transparency masking).
Resolution: 4096x4096, tileable.
```

### PROMPT ARTE 2 — Textura do Firmamento
```
[Para geração de imagem]

Create a dome/firmament texture for a flat earth model.
Concept: solid crystalline hemisphere, like hammered metal or thick glass.
Pattern: subtle hexagonal grid, iridescent blue-to-purple shift.
Stars: 200 white dots distributed realistically (more near center/Polaris).
Constellations: very faint connecting lines in gold.
Inner glow: luminous blue-white at zenith, fading to deep indigo at edges.
Style: scientific illustration meets sacred geometry.
Resolution: 4096x2048 (half sphere UV).
No text, no labels.
```

---

## 🗺️ ROADMAP DO PROJETO

```
SEMANA 1: Setup + Cena Base
  □ Prompts 1.1, 1.2 → projeto + banco criado
  □ Prompts 2.1, 2.2 → terra + câmera funcionando
  □ Resultado: Terra plana girando na tela

SEMANA 2: Domo + Corpos Celestes
  □ Prompts 2.3, 2.4 → domo cristalino + águas
  □ Prompts 3.1, 3.2 → Sol, Lua, planetas
  □ Resultado: cena completa animada

SEMANA 3: UI + CRUD
  □ Prompts 4.1, 4.2 → interface + banco funcionando
  □ Prompt 1.2 executado no Supabase
  □ Resultado: usuário pode fazer login e salvar notas

SEMANA 4: Conteúdo + Features Especiais
  □ Prompts 5.1, 6.1, 6.2 → matemática + textos
  □ Prompts 7.1, 7.2 → Dilúvio + Relógio Cósmico
  □ Resultado: conteúdo educacional completo

SEMANA 5: IA + Otimização + Deploy
  □ Prompt 7.3 → Tour com Gemini
  □ Prompts 8.1, 8.2 → performance + PWA
  □ Deploy no Vercel
  □ Resultado: site live e funcional
```

---

## 💡 DICAS PARA USAR OS PROMPTS

1. **Sempre adicione no início de cada prompt:**
   "Você está construindo o projeto Flat Earth Cosmos. Contexto: [colar o Prompt 1.1 resumido]"

2. **Para o Gemini (código Three.js):**
   Adicione: "Use Three.js r158, JavaScript ES6 modules, sem TypeScript"

3. **Para o Mistral (arquitetura/CRUD):**
   Adicione: "Use Supabase JS v2, código limpo, comentários em português"

4. **Para DeepSeek R1 (matemática):**
   Adicione: "Mostre o raciocínio matemático passo a passo antes do código"

5. **Ao receber código, sempre peça:**
   "Agora adicione tratamento de erros, loading states e comentários explicativos"

---

*Flat Earth Cosmos — Explorando a cosmologia ancestral através da tecnologia moderna*
*"E o Espírito de Deus pairava sobre as águas" — Gênesis 1:2*
