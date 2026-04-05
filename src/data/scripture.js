export const civilizations = [
  {
    id: 'ancient-hebrews',
    name: 'Hebreus Antigos',
    period: '2000-400 a.C.',
    description: 'Povo chosen por Deus, guardiões das escrituras sobre a criação.',
    role: 'Guardiões das Escrituras',
    biblicalReferences: ['Gênesis 1', 'Salmos 104', 'Isaías 40']
  },
  {
    id: 'babylonians',
    name: 'Babilônios',
    period: '2000-500 a.C.',
    description: 'Aprenderam astronomia dos hebreus, construíram ziggurats.',
    role: 'Astrônomos',
    biblicalReferences: ['Daniel 2', 'Gênesis 11']
  },
  {
    id: 'egyptians',
    name: 'Egípcios',
    period: '3000-500 a.C.',
    description: 'Civilização antiga que preservou conhecimento cosmológico.',
    role: 'Preservadores de Conhecimento',
    biblicalReferences: ['Gênesis 12', 'Êxodo']
  },
  {
    id: 'greek-philosophers',
    name: 'Filósofos Gregos',
    period: '600-200 a.C.',
    description: 'Philosophers como Aristóteles e Ptolomeu estudaram o cosmos.',
    role: 'Filósofos Cosmológicos',
    biblicalReferences: ['Atos 17']
  },
  {
    id: 'norse',
    name: 'Nórdicos',
    period: '1000 a.C.-1000 d.C.',
    description: 'Povos vikings com sua própria cosmologia do Yggdrasil.',
    role: 'Cosmólogos Nórdicos',
    biblicalReferences: []
  },
  {
    id: 'chinese',
    name: 'Chineses',
    period: '2000 a.C.-presente',
    description: 'Astronomia antiga com registros detalhados de eclipses.',
    role: 'Astrônomos',
    biblicalReferences: []
  },
  {
    id: 'mayans',
    name: 'Maias',
    period: '2000 a.C.-1500 d.C.',
    description: 'Calendário avançado baseado em movimentos celestiais.',
    role: 'Calendrílogos',
    biblicalReferences: []
  },
  {
    id: 'indians',
    name: 'Indianos',
    period: '3000 a.C.-presente',
    description: 'Vedas descrevem a estrutura do universo.',
    role: 'Cosmólogos Vedicos',
    biblicalReferences: []
  },
  {
    id: 'persians',
    name: 'Persas',
    period: '1000 a.C.-600 d.C.',
    description: 'Estudaram astronomia e influenciaram o mundo islâmico.',
    role: 'Astrônomos',
    biblicalReferences: ['Daniel 6']
  },
  {
    id: 'arabs',
    name: 'Áabes',
    period: '600-1500 d.C.',
    description: 'Preservaram e expandiram o conhecimento grego.',
    role: 'Guardiões do Conhecimento',
    biblicalReferences: []
  },
  {
    id: 'early-christians',
    name: 'Cristãos Primitivos',
    period: '30-500 d.C.',
    description: 'Igreja primitiva preservou a cosmologia bíblica.',
    role: 'Guardiões da Fé',
    biblicalReferences: ['Apocalipse']
  },
  {
    id: 'flat-earth-society',
    name: 'Terra Plana Moderna',
    period: '1800-presente',
    description: 'Movimento moderno de pesquisa da cosmologia bíblica.',
    role: 'Pesquisadores',
    biblicalReferences: ['Job 38', 'Salmos 93', 'Isaías 45']
  }
];

export const scriptureReferences = [
  // Gênesis - Criação
  { book: 'Gênesis', chapter: 1, verse: 1, text: 'No princípio, Deus criou os céus e a terra.', topic: 'Criação' },
  { book: 'Gênesis', chapter: 1, verse: 2, text: 'E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas.', topic: 'Águas Primordiais' },
  { book: 'Gênesis', chapter: 1, verse: 6, text: 'E disse Deus: Haja uma expansão no meio das águas, e separação entre águas e águas.', topic: 'Firmamento' },
  { book: 'Gênesis', chapter: 1, verse: 7, text: 'Assim fez Deus a expansão, e separação entre as águas que estavam debaixo da expansão e as que estavam acima dela; e assim foi.', topic: 'Águas Superiores' },
  { book: 'Gênesis', chapter: 1, verse: 8, text: 'E Deus chamou a expansão Céus; e houve tarde, e manhã, o segundo dia.', topic: 'Firmamento/Céus' },
  { book: 'Gênesis', chapter: 1, verse: 9, text: 'E disse Deus: Ajuntem-se as águas debaixo dos céus num só lugar, e apareça a seca; e assim foi.', topic: 'Terra Seca' },
  { book: 'Gênesis', chapter: 1, verse: 14, text: 'E disse Deus: Haja luzeiros na expansão dos céus, para separação do dia e da noite; e sejam para sinais, e para estações, e para dias, e anos.', topic: 'Sol/Lua/Estrelas' },
  { book: 'Gênesis', chapter: 1, verse: 20, text: 'E disse Deus: Povoem-se as águas de abundância de seres viventes, e voem aves sobre a terra, sob a expansão dos céus.', topic: 'Criação' },
  
  // Salmos
  { book: 'Salmos', chapter: 93, verse: 1, text: 'O SENHOR reigns; ele está vestido de magnificência; o SENHOR está vestido de força; também se cingiu deinja; o mundo também está firme, para que não seja movido.', topic: 'Terra Firme' },
  { book: 'Salmos', chapter: 96, verse: 10, text: 'Dizei entre as nações: O SENHOR reigns; o mundo também será firmso, para que não seja movido; ele julgará os povos com retidão.', topic: 'Terra Firme' },
  { book: 'Salmos', chapter: 104, verse: 1, text: 'Bendize, ó minha alma, ao SENHOR; SENHOR meu Deus, tu és mui великий; estás vestido de majestade e excelência.', topic: 'Deus Criador' },
  { book: 'Salmos', chapter: 104, verse: 2, text: 'Que vestes de luz como de uma veste; que estendes os céus como uma cortina.', topic: 'Céus como Cortina' },
  { book: 'Salmos', chapter: 104, verse: 3, text: 'Que põe as vigas das suas câmaras nas águas; que faz das nuvens o seu carro; que anda sobre as asas do vento.', topic: 'Águas Acima' },
  { book: 'Salmos', chapter: 104, verse: 5, text: 'Que fundou a terra sobre as suas bases; não será abalada para todo o sempre.', topic: 'Terra Firmada' },
  { book: 'Salmos', chapter: 104, verse: 24, text: 'Quão variadas são as tuas obras, SENHOR! Com sabedoria as fizeste todas; a terra está cheia das tuas criaturas.', topic: 'Criação' },
  
  // Job
  { book: 'Job', chapter: 9, verse: 6, text: 'Que assenta a terra sobre as suas bases; para que não seja movida em tempo algum.', topic: 'Terra Imóvel' },
  { book: 'Job', chapter: 26, verse: 7, text: 'Estende o norte sobre o vazio; pendura a terra sobre o nada.', topic: 'Terra Suspensa' },
  { book: 'Job', chapter: 26, verse: 8, text: 'Prende as águas nas suas nuvens, e as nuvens não se rompem sob o peso delas.', topic: 'Águas nas Nuvens' },
  { book: 'Job', chapter: 26, verse: 11, text: 'As colunas dos céus tremem, e se espantam da sua increpação.', topic: 'Colunas dos Céus' },
  { book: 'Job', chapter: 37, verse: 18, text: 'Ou podes tu estender os céus, tão firmes como um espelho de fundição?', topic: 'Céus Firmes' },
  { book: 'Job', chapter: 38, verse: 4, text: 'Onde estavas tu quando eu fundava a terra? Dize-me, se tens tanto entendimento.', topic: 'Fundação da Terra' },
  { book: 'Job', chapter: 38, verse: 6, text: 'Sobre que estão fundadas as suas bases? Ou quem laying o seu canto-pedra?', topic: 'Fundações da Terra' },
  { book: 'Job', chapter: 38, verse: 8, text: 'Ou quem encerrou o mar com portas, quando irrompia como se saísse do ventre?', topic: 'Mar Encerado' },
  { book: 'Job', chapter: 38, verse: 11, text: 'E disseste: Até aqui virás, e não passarás; e aqui se quebrará a pride das tuas ondas.', topic: 'Limites do Mar' },
  
  // Isaías
  { book: 'Isaías', chapter: 13, verse: 13, text: 'Por isso, eu farei estremecer os céus, e a terra se moverá do seu lugar, ante a ira do SENHOR dos Exércitos.', topic: 'Movimento dos Céus' },
  { book: 'Isaías', chapter: 40, verse: 4, text: 'Todo vale seja exaltado, e todo monte e outeiro seja abatido; e o torto seja retificado, e os lugares asperos se tornem planos.', topic: 'Terra Achatada' },
  { book: 'Isaías', chapter: 40, verse: 12, text: 'Quem mediu as águas com o seu punho, e os céus com o seu palmo, e abarcou a terra com o seu pujo?', topic: 'Deus Mede os Céus' },
  { book: 'Isaías', chapter: 40, verse: 22, text: 'Ele é o que está assentado sobre o círculo da terra, e os que habitam nela são como gafanhots; ele é o que estende os céus como cortina, e os distende como tenda para morar.', topic: 'Terra como Círculo' },
  { book: 'Isaías', chapter: 40, verse: 26, text: 'Levantai ao alto os vossos olhos, e vede quem criou estas coisas; ele faz sair o seu exército por número; ele chama a todas por nome; por causa da grandeza do seu poder, e porque é forte em força, nenhuma delas falta.', topic: 'Criação das Estrelas' },
  { book: 'Isaías', chapter: 42, verse: 5, text: 'Assim diz Deus, o SENHOR, que criou os céus, e os estendeu; que spreadiu a terra, e o que dela nasce; que dá respiração ao povo que nela vive, e espírito aos que andam nela.', topic: 'Terra Espraiada' },
  { book: 'Isaías', chapter: 44, verse: 24, text: 'Assim diz o SENHOR, teu Redentor, e o que te formou desde o ventre: Eu sou o SENHOR que fiz todas as coisas; que estendi os céus sozinho, e espraiei a terra por mim mesmo.', topic: 'Deus Espraiou a Terra' },
  { book: 'Isaías', chapter: 45, verse: 12, text: 'Eu fiz a terra, e criei o homem sobre ela; eu, as minhas mãos, estenderam os céus, e todo o seu exército mandei.', topic: 'Deus Criou a Terra' },
  { book: 'Isaías', chapter: 45, verse: 18, text: 'Porque assim diz o SENHOR que criou os céus, o Deus que formou a terra e a fez; ele a firmou, não a criou vazia, mas a formou para ser habitada: Eu sou o SENHOR, e não há outro.', topic: 'Terra Habitada' },
  { book: 'Isaías', chapter: 48, verse: 13, text: 'Também a minha mão fundou a terra, e a minha direita mediu os céus com o palmo; quando eu os chamava, eles compareceram insieme.', topic: 'Deus Mede os Céus' },
  
  // Jeremias
  { book: 'Jeremias', chapter: 10, verse: 12, text: 'É ele que fez a terra pelo seu poder, que firmou o mundo pela sua sabedoria, e pela sua inteligência estendeu os céus.', topic: 'Deus Firmou a Terra' },
  { book: 'Jeremias', chapter: 10, verse: 13, text: 'Ao/ruído de muitos sons, há água no céu, e sobem vapores da extremidade da terra; também faz as Chuvas descer, e faz sair o vento dos seus tesouros.', topic: 'Águas Acima e Abaixo' },
  { book: 'Jeremias', chapter: 31, verse: 37, text: 'Assim diz o SENHOR: Se puderem ser medidos os céus em cima, e as fundações da terra Pesquisados em baixo, também rejeitarei toda a descendência de Israel, por tudo o que fizeram, diz o SENHOR.', topic: 'Fundações da Terra' },
  
  // Provérbios
  { book: 'Provérbios', chapter: 3, verse: 19, text: 'O SENHOR pela sabedoria fundou a terra; pelo entendimento firmou os céus.', topic: 'Sabedoria na Criação' },
  { book: 'Provérbios', chapter: 8, verse: 27, text: 'Quando ele preparava os céus, eu estava presente; quando traçava o círculo sobre a face do abismo.', topic: 'Círculo da Terra' },
  { book: 'Provérbios', chapter: 8, verse: 28, text: 'Quando firmava as nuvens em cima, e quando fortalecia as fontes do abismo.', topic: 'Fontes do Abismo' },
  { book: 'Provérbios', chapter: 8, verse: 29, text: 'Quando dava ao mar o seu decreto, para que as águas não transpassassem o seu mando; quando firmava os fundamentos da terra.', topic: 'Fundamentos da Terra' },
  
  // Amós
  { book: 'Amós', chapter: 9, verse: 6, text: 'É ele que edifica as suas câmaras высокими, eFounda a sua vaulta sobre a terra; que chama as águas do mar, e as derrama sobre a terra; o SENHOR é o seu nome.', topic: 'Águas Derramadas' },
  
  // Ageu
  { book: 'Ageu', chapter: 2, verse: 6, text: 'Porque assim diz o SENHOR dos Exércitos: Ainda uma vez, daqui a pouco, farei tremer os céus, e a terra, e o mar, e o seco.', topic: 'Terra Tremendo' },
  
  // Hebreus
  { book: 'Hebreus', chapter: 1, verse: 10, text: 'E: Tu, Senhor, no princípio fundaste a terra, e os céus são obras das tuas mãos.', topic: 'Deus Fundou a Terra' },
  { book: 'Hebreus', chapter: 11, verse: 3, text: 'Pela fé entendemos que os mundos foram preparados pela palavra de Deus, de maneira que o que se vê não foi feito do que era visível.', topic: 'Mundos Preparados' },
  
  // Apocalipse
  { book: 'Apocalipse', chapter: 1, verse: 8, text: 'Eu sou o Alfa e o Ômega, diz o SENHOR, que é, e que era, e que há de vir, o Todo-Poderoso.', topic: 'Deus Eterno' },
  { book: 'Apocalipse', chapter: 7, verse: 1, text: 'E depois disto vi quatro anjos sobre os quatro cantos da terra, detendo os quatro ventos da terra, para que nenhum vento soprasse sobre a terra, nem sobre o mar, nem sobre árvore alguma.', topic: 'Quatro Cantos da Terra' },
  { book: 'Apocalipse', chapter: 10, verse: 2, text: 'E tinha na sua mão um livrinho aberto; e pôs o seu pé direito sobre o mar, e o esquerdo sobre a terra.', topic: 'Mar e Terra' },
  { book: 'Apocalipse', chapter: 14, verse: 7, text: 'Adorai ao que fez o céu, e a terra, e o mar, e as fontes das águas.', topic: 'Adoração ao Criador' },
  { book: 'Apocalipse', chapter: 20, verse: 11, text: 'E vi um grande trono branco, e o que estava assentado sobre ele, de cuja face fugiu a terra e o céu; e não se achou lugar para eles.', topic: 'Terra e Céu Fogem' },
  { book: 'Apocalipse', chapter: 21, verse: 1, text: 'E vi um novo céu, e uma nova terra; porque o primeiro céu e a primeira terra se foram, e o mar já não existe.', topic: 'Novo Céu e Nova Terra' }
];

export function getScriptureForTopic(topic) {
  return scriptureReferences.filter(ref => ref.topic === topic);
}

export function getScriptureForCivilization(civilizationId) {
  const civ = civilizations.find(c => c.id === civilizationId);
  return civ ? civ.biblicalReferences : [];
}

export function searchScripture(query) {
  const lowerQuery = query.toLowerCase();
  return scriptureReferences.filter(ref => 
    ref.text.toLowerCase().includes(lowerQuery) ||
    ref.book.toLowerCase().includes(lowerQuery) ||
    ref.topic.toLowerCase().includes(lowerQuery)
  );
}

export function formatScriptureRef(ref) {
  return `${ref.book} ${ref.chapter}:${ref.verse}`;
}

export default {
  civilizations,
  scriptureReferences,
  getScriptureForTopic,
  getScriptureForCivilization,
  searchScripture,
  formatScriptureRef
};
