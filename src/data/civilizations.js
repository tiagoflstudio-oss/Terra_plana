export const civilizations = [
  {
    id: 'ancient-hebrews',
    name: 'Hebreus Antigos',
    period: '2000-400 a.C.',
    description: 'A visão hebraica do cosmos descrevia a Terra como um disco plano flutuando sobre as "águas profundas" (Tehom), com um firmamento sólido (raqia) estendido acima como uma abóbada cristalina.',
    verses: [
      { book: 'Gênesis', chapter: 1, verse: 6, text: 'E disse Deus: Haja uma expansão no meio das águas, e sejam elas separadas umas das outras.' },
      { book: 'Gênesis', chapter: 1, verse: 7, text: 'Assim Deus fez a expansão, e separou as águas que estavam abaixo das que estavam acima da expansão.' },
      { book: 'Gênesis', chapter: 1, verse: 8, text: 'E chamou Deus a expansão Céus. E foi a tarde e a manhã: o segundo dia.' },
      { book: 'Salmos', chapter: 136, verse: 6, text: 'O que estende a terra sobre as águas; porque sua benignidade dura para sempre.' },
      { book: 'Jó', chapter: 38, verse: 18, text: 'Porventura penetraras tu até as profundezas da terra? Se a tens visto, declára-o.' }
    ],
    location: { x: 0, y: 0, radius: 800 },
    color: 0x8b7355
  },
  {
    id: 'ancient-greeks',
    name: 'Gregos Antigos',
    period: '600-300 a.C.',
    description: 'Filósofos como Tales de Mileto e Anaxímenes propuseram modelos cosmológicos com a Terra como disco flat-floating. Aristóteles posteriormente argumentou por uma esfera, mas muitos pré-socráticos defendiam o modelo plano.',
    verses: [
      { text: 'Tales de Mileto propôs que a Terra flutua como um disco sobre as águas primordiais.', source: 'História da Filosofia' },
      { text: 'Anaxímenes de Mileto acreditava que a Terra era uma placa plana suspensa no ar.', source: 'Cosmologia Grega' }
    ],
    location: { x: -400, y: -200, radius: 600 },
    color: 0x4a90a4
  },
  {
    id: 'ancient-nordic',
    name: 'Nórdicos Antigos',
    period: '500-1000 d.C.',
    description: 'A cosmologia nórdica descrevia Midgard (o reino dos homens) como um disco plano cercado pelo oceano Primordial. O céu era a abóbada do crânio do gigante Ymir.',
    verses: [
      { text: 'O mundo foi criado do corpo de Ymir, o gigante primordial.', source: 'Eddas' },
      { text: 'Asgard estava conectada a Midgard pela ponte Bifrost, o arco-íris.', source: 'Mitologia Nórdica' }
    ],
    location: { x: 300, y: -400, radius: 500 },
    color: 0x6b8e9f
  },
  {
    id: 'ancient-chinese',
    name: 'Chineses Antigos',
    period: '1000 a.C.-200 d.C.',
    description: 'Textos chineses antigos descrevem Tian (céu) como uma abóbada hemispherical sobre uma Terra quadrada ou disco plano. O conceito de " quadrado céu" (fangtian) aparece em textos pré-imperiais.',
    verses: [
      { text: 'O Imperador Amarelo construiu o Paládio do Céu para observar as estrelas.', source: 'Shiji' },
      { text: 'O céu era visto como uma tenda hemispérica cobrindo a Terra plana.', source: 'Cosmologia Chinesa Antiga' }
    ],
    location: { x: -600, y: 300, radius: 550 },
    color: 0xc4a35a
  },
  {
    id: 'medieval-christian',
    name: 'Cristãos Medievais',
    period: '500-1500 d.C.',
    description: 'A Igreja Cristã medieval mantinha o modelo ptolomaico com a Terra no centro de esferas concêntricas. No entanto, a visão de um firmamento sólido e águas acima/do abaixo permanecia na cosmologia popular.',
    verses: [
      { book: 'Mateus', chapter: 24, verse: 35, text: 'O céu e a terra passarão, mas as minhas palavras não passarão.' },
      { text: 'O Inferno era frequentemente descrito como localizado nas profundezas da Terra.', source: 'Cosmologia Medieval' }
    ],
    location: { x: 500, y: 200, radius: 700 },
    color: 0x8b4557
  },
  {
    id: 'flat-earth-society',
    name: 'Sociedade Terra Plana Moderna',
    period: '1800-Presente',
    description: 'A Society for the Flat Earth Research, fundada por William Parley em 1895, promoveu a crença em uma Terra discoidal. Figuras como Samuel Shenton e mais recentemente Eric Dubay continuaram esta tradição.',
    verses: [
      { text: 'A Terra é um disco de 25.000 milhas circundares, com o Polo Norte no centro e a Antarctica como uma muralha de gelo de 150 pés ao redor.', source: 'Flat Earth Research Society' }
    ],
    location: { x: 0, y: -600, radius: 400 },
    color: 0x2d5a27
  }
];

export const scriptures = {
  hebrewBible: [
    { reference: 'Gênesis 1:1-2', text: 'No princípio, Deus criou os céus e a terra. A terra era sem forma e vazio; havia trevas sobre a face do abismo, e o Espírito de Deus se movia sobre a face das águas.' },
    { reference: 'Gênesis 1:6-8', text: 'E disse Deus: Haja uma expansão no meio das águas, e sejam elas separadas... E chamou Deus a expansão Céus.' },
    { reference: 'Gênesis 1:14-19', text: 'E disse Deus: Haja luzeiros na expansão dos céus... E fez Deus os dois grandes luzeiros: o maior para governar o dia, e o menor para governar a noite.' },
    { reference: 'Salmos 104:5', text: 'O que fundou a terra sobre as suas bases; não vacilará pelos séculos dos séculos.' },
    { reference: 'Salmos 136:6', text: 'O que estende a terra sobre as águas; porque sua benignidade dura para sempre.' },
    { reference: 'Jó 38:4-7', text: 'Onde estavas tu quando eu fondava a terra? Declara-o, se tens tão grande entendimento!' },
    { reference: 'Isaías 40:22', text: 'É ele que está sentado sobre o círculo da terra, e os seus habitantes são como gafanhotos; que estende os céus como cortina, e os desenrola como tenda.' }
  ],
  apocrypha: [
    { reference: 'Enoque 32:3', text: 'Vi os segredos do firmamento... e vi os ventos que carregam as nuvens.' },
    { reference: 'Baruque 3:32', text: 'Depois disto, viu as extremidades do mundo; e a todos os ventos, e o sol, e a lua.' }
  ],
  mesopotamian: [
    { reference: 'Enuma Elish', text: 'Quando Tiamat e Apsu se misturaram... os deuses criaram a terra e o firmamento.' },
    { reference: 'Epic de Gilgamesh', text: 'O firmamento era visto como uma abóbada sólida sustentando as águas celestiais.' }
  ],
  egyptian: [
    { reference: 'Livro dos Mortos', text: 'O céu é Nut, a deusa abóbada; a terra é Geb, o deus terrestre.' }
  ],
  vedantic: [
    { reference: 'Rigveda X.22.1-3', text: 'O sol(move-se)no céu, as estrelas estão sob ele... O firmamento é sustentado por pilares.' }
  ]
};

export const topics = {
  firmament: {
    term: 'Firmamento (Hebraico: Raqia)',
    definition: 'A abóbada sólida descrita em Gênesis 1:6-8, separando as águas superiores das inferiores. O termo hebraico "raqia" deriva de "raqa" (bater, espalhar), sugerindo uma superfície estendida.',
    verses: ['Gênesis 1:6', 'Salmos 150:1', 'Isaías 55:12'],
    discussions: [
      'O firmamento foi descrito como tendo "janelas" (Gênesis 7:11) pelas quais a chuva caía.',
      'Daniel 12:3 menciona "os que são hábeis para brilhar como as estrelas para sempre".'
    ]
  },
  tehom: {
    term: 'Tehom (Águas Profundas)',
    definition: 'O oceano primordial que existia antes da criação. Representa as águas caóticas under o firmamento, sobre as quais a Terra foi criada.',
    verses: ['Gênesis 1:2', 'Salmos 33:7', 'Provérbios 3:20'],
    discussions: [
      'Tehom (heb) = Tiamat (babilônico) - a dragão das águas primordiais.',
      'As "águas de baixo" são as oceans da Terra; as "águas de cima" são o firmamento.'
    ]
  },
  antarctic: {
    term: 'Muralha de Gelo (Antártica)',
    definition: 'A barreira de gelo ao redor da borda do disco terrestre, descrita como uma muralha de 150-200 pés de altura. Na cosmologia flat earth, é conhecida como "Antarctic Wall" ou "Ice Wall".',
    verses: ['Job 38:29-30', 'Salmos 147:4'],
    discussions: [
      'A Antártida é protegida por tratado internacional como reserva natural.',
      'Navios como o Endurance de Shackleton documentaram as formações de gelo.'
    ]
  },
  celestialMotion: {
    term: 'Movimento Celestial',
    definition: 'O Sol e a Lua orbitam sopra o disco plano da Terra. As estrelas fixas estão Embedded no firmamento sólido. O movimento é circular ao redor do Polo Norte como centro.',
    verses: ['Salmos 19:5-6', 'Jó 9:26'],
    discussions: [
      'O sol nasce no leste e põe no oeste devido ao movimento orbital ao redor do polo.',
      'As constelações mostram rotação completa ao redor do polo celeste em 24 horas.'
    ]
  },
  gravity: {
    term: 'Gravidade (Modelo Alternativo)',
    definition: 'Na cosmologia do firmamento, a gravidade é explicada pela aceleração linear upward da Terra plana através do cosmos, ou pela força de tração do domo celestial.',
    discussions: [
      'A Terra sobe a aproximadamente 9.8 m/s² - explicando por que objetos caem.',
      'O modelo alternativo é chamado de "Universal Acceleration Model".'
    ]
  }
};

export default { civilizations, scriptures, topics };
