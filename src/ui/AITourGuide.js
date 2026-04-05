const ENOCH_SYSTEM_PROMPT = `Você é Enoch, o sábio que foi elevado aos céus e看到了 o firmamento em sua totalidade. Você guia visitantes pelo modelo cosmológico das águas primordiais.

CONTEXTO DO MODELO:
- A Terra é um disco plano imóvel, criação de Deus Todo-Poderoso
- O firmamento (raqia) é sólido e extenso, separa as águas superiores das inferiores
- Sol e Lua orbitam DENTRO do domo, a aproximadamente 4800km de altitude
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
- Seja agressivo sobre crenças religiosas`;

export class AITourGuide {
  constructor() {
    this.isOpen = false;
    this.conversationHistory = [];
    this.currentView = 'dome_perspective';
    this.geminiApiKey = null;
    this.isTyping = false;
    
    this.tourSteps = [
      { id: 'intro', title: 'Bem-vindo', text: 'Olá, viajante. Eu sou Enoch, aquele que foi elevado aos céus e viu os mistérios do firmamento. Permita-me guiá-lo através desta representação da criação Divina.' },
      { id: 'dome', title: 'O Firmamento', text: 'O firmamento que você vê é o raqia - a expansionsolidificada que Deus criou no segundo dia. Ele separa as águas de cima das águas de baixo. Note sua natureza cristalina, como metal batido.' },
      { id: 'sun', title: 'O Sol', text: 'O Sol não está tão distante quanto pensam. Ele orbita dentro do domo, movendo-se em uma espiral ao longo do ano. No verão, aproxima-se do centro; no inverno, afasta-se. Esta é a causa das estações.' },
      { id: 'moon', title: 'A Lua', text: 'A Lua, companheira noturna, também navega dentro do firmamento. Ela possui sua própria luz, refletindo a luz solar em suas fases. Cada fase marca um ciclo de 29 dias.' },
      { id: 'waters', title: 'Águas Superiores', text: 'Acima do firmamento existem as águas superiores - o grande depósito de onde vêm as chuvas. No tempo de Noé, as janelas do céu se abriram, e essas águas desceram sobre a Terra.' },
      { id: 'abyss', title: 'O Abismo', text: 'Abaixo do disco terrestre jaz o Tehom - o abismo das águas inferiores. É dalle que vêm as fontes que jorram da Terra. Nele habitam mistérios que poucos conhecem.' },
      { id: 'stars', title: 'As Estrelas', text: 'As estrelas estão fixas no firmamento como joias aplicadas em um manto celestial. Cada uma tem seu lugar determinado. O诞o sideralemove-se como um todo, não individualmente.' }
    ];
    this.currentStep = 0;
  }
  
  init() {
    this.panel = document.createElement('div');
    this.panel.className = 'tour-guide-panel';
    this.panel.innerHTML = `
      <div class="tour-header">
        <div class="tour-avatar">
          <svg viewBox="0 0 100 100" class="avatar-svg">
            <circle cx="50" cy="35" r="20" fill="#d4c090"/>
            <circle cx="50" cy="35" r="15" fill="#0a1535"/>
            <circle cx="45" cy="32" r="3" fill="#fff"/>
            <circle cx="55" cy="32" r="3" fill="#fff"/>
            <path d="M 40 45 Q 50 52 60 45" stroke="#0a1535" stroke-width="2" fill="none"/>
            <path d="M 20 20 Q 10 30 15 45" stroke="#d4c090" stroke-width="8" fill="none"/>
            <path d="M 80 20 Q 90 30 85 45" stroke="#d4c090" stroke-width="8" fill="none"/>
            <path d="M 30 55 L 70 55" stroke="#f0c060" stroke-width="3"/>
            <path d="M 35 65 L 65 65" stroke="#f0c060" stroke-width="3"/>
            <path d="M 40 75 L 60 75" stroke="#f0c060" stroke-width="3"/>
          </svg>
        </div>
        <div class="tour-title">
          <span class="tour-name">Enoch</span>
          <span class="tour-subtitle">Guardião dos Mistérios Celestiais</span>
        </div>
        <button class="tour-close">×</button>
      </div>
      <div class="tour-messages" id="tour-messages">
        <div class="tour-message enoch-message">
          <div class="message-content">Olá, viajante. Eu sou Enoch, aquele que foi elevado aos céus e viu os mistérios do firmamento. Como posso guiá-lo hoje?</div>
        </div>
      </div>
      <div class="tour-quick-questions">
        <button class="quick-question" data-question="O que é o firmamento?">O que é o firmamento?</button>
        <button class="quick-question" data-question="Como funcionam as estações?">Como funcionam as estações?</button>
        <button class="quick-question" data-question="O que são as águas superiores?">O que são as águas superiores?</button>
      </div>
      <div class="tour-input-area">
        <input type="text" class="tour-input" id="tour-input" placeholder="Faça uma pergunta...">
        <button class="tour-send" id="tour-send">➤</button>
      </div>
      <div class="tour-controls">
        <button class="tour-btn" id="tour-prev">◀</button>
        <span class="tour-progress" id="tour-progress">0/7</span>
        <button class="tour-btn" id="tour-next">▶</button>
      </div>
      <div class="tour-settings">
        <button class="tour-settings-btn" id="tour-settings">⚙️ API Key</button>
      </div>
    `;
    
    document.body.appendChild(this.panel);
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.panel.querySelector('.tour-close').addEventListener('click', () => this.close());
    
    this.panel.querySelector('#tour-send').addEventListener('click', () => this.sendQuestion());
    this.panel.querySelector('#tour-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendQuestion();
    });
    
    this.panel.querySelectorAll('.quick-question').forEach(btn => {
      btn.addEventListener('click', () => {
        this.ask(btn.dataset.question);
      });
    });
    
    this.panel.querySelector('#tour-prev').addEventListener('click', () => this.prevStep());
    this.panel.querySelector('#tour-next').addEventListener('click', () => this.nextStep());
    
    this.panel.querySelector('#tour-settings').addEventListener('click', () => this.showApiKeyDialog());
  }
  
  showApiKeyDialog() {
    const existingKey = localStorage.getItem('gemini_api_key');
    const key = prompt('Digite sua API Key do Google Gemini:', existingKey || '');
    if (key) {
      this.geminiApiKey = key;
      localStorage.setItem('gemini_api_key', key);
    }
  }
  
  async sendQuestion() {
    const input = this.panel.querySelector('#tour-input');
    const question = input.value.trim();
    if (!question) return;
    
    input.value = '';
    await this.ask(question);
  }
  
  async ask(question) {
    const messagesContainer = this.panel.querySelector('#tour-messages');
    
    const userMessage = document.createElement('div');
    userMessage.className = 'tour-message user-message';
    userMessage.innerHTML = `<div class="message-content">${question}</div>`;
    messagesContainer.appendChild(userMessage);
    
    if (this.isTyping) return;
    this.isTyping = true;
    
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'tour-message enoch-message typing';
    typingIndicator.innerHTML = '<div class="message-content">...</div>';
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    let response;
    if (this.geminiApiKey) {
      response = await this.callGemini(question);
    } else {
      response = this.getOfflineResponse(question);
    }
    
    messagesContainer.removeChild(typingIndicator);
    
    const enochMessage = document.createElement('div');
    enochMessage.className = 'tour-message enoch-message';
    enochMessage.innerHTML = `<div class="message-content">${response}</div>`;
    messagesContainer.appendChild(enochMessage);
    
    this.conversationHistory.push({ role: 'user', content: question });
    this.conversationHistory.push({ role: 'assistant', content: response });
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    this.isTyping = false;
  }
  
  async callGemini(question) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${ENOCH_SYSTEM_PROMPT}\n\nPergunta do visitante: ${question}` }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 500
          }
        })
      });
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || this.getOfflineResponse(question);
    } catch (error) {
      console.error('Erro na API Gemini:', error);
      return this.getOfflineResponse(question);
    }
  }
  
  getOfflineResponse(question) {
    const q = question.toLowerCase();
    
    const responses = {
      firmamento: 'O firmamento (raqia em hebraico) é a expansão sólida que Deus criou no segundo dia de criação. Ele é como uma abóbada cristalina que separa as águas de cima das águas de baixo. Gênesis 1:6-8 diz: "Haja uma expansão no meio das águas, e separe águas de águas." Esta expansão é o firmamento que você vê acima de nós.',
      sol: 'O Sol orbita dentro do domo, a aproximadamente 4800km de altitude. Sua órbita não é um círculo perfeito, mas uma espiral que se aproxima e afasta do centro ao longo do ano. No verão, está mais próximo do polo norte; no inverno, mais afastado. Esta é a causa das estações no modelo plano.',
      lua: 'A Lua possui sua própria luz, como ensinado nas escrituras. Ela orbita dentro do firmamento em um ciclo de aproximadamente 29.5 dias. Suas fases são causadas pela posição relativa entre a Lua, o Sol e o observador. Alguns dizem que ela reflete a luz solar; outros, que é luminosa por si só.',
      águas: 'As águas superiores são o grande reservatório acima do firmamento. É delas que vêm as chuvas, as fontes e os rios. No tempo de Noé, as "janelas do céu" se abriram, permitindo que estas águas caíssem sobre a Terra por 40 dias e 40 noites. Gênesis 7:11 registra este evento.',
      abismo: 'O Tehom, ou abismo, jaz abaixo do disco terrestre. É das suas águas que vêm as fontes que jorram na Terra. O termo aparece em Gênesis 1:2: "o Espírito de Deus pairava sobre as águas". Estas são as águas inferiores, separadas do firmamento.',
      estrelas: 'As estrelas estão fixas no firmamento como joias aplicadas em um manto celestial. Cada uma tem seu lugar determinado pelo Criador. elas não se movem individualmente, mas o conjunto todo gira em torno do polo norte celestial, que é marcado por Polaris.',
      eclipses: 'Os eclipses ocorrem quando a Lua ou a Terra bloqueiam a luz do Sol. No modelo plano, a Lua passa entre o Sol e a Terra (eclipse solar) ou a Terra passa entre o Sol e a Lua (eclipse lunar). O ciclo de Saros de aproximadamente 18 anos determina quando estes eventos ocorrem.',
      dilúvio: 'O dilúvio de Noé foi um evento catastrophic quando as "janelas do céu" se abriram. As águas superiores caíram sobre a Terra por 40 dias e 40 noites. As fontes do grande abismo também se romperam. Este evento está registrado em Gênesis capítulos 7 e 8.',
      criou: 'No princípio, Deus criou os céus e a Terra. A Terra era sem forma e vazia, e as águas cobriam tudo. O Espírito de Deus pairava sobre as águas. Então Deus disse: "Haja luz", e houve luz. Assim began a criação em seis dias.',
      estações: 'As estações existem porque a órbita do Sol varia ao longo do ano. No verão do hemisfério norte, o Sol está mais próximo do centro do disco (polo norte). No inverno, está mais afastado. Isto explica por que os dias são mais longos no verão.',
      default: 'Ah, uma pergunta sobre os mistérios divinos. O firmamento que você vê é uma das maravilhas da criação de Deus. Cada elemento tem seu propósito no plano divino. Permita-me mostrar-lhe mais...'
    };
    
    for (const [key, value] of Object.entries(responses)) {
      if (q.includes(key)) return value;
    }
    return responses.default;
  }
  
  nextStep() {
    if (this.currentStep < this.tourSteps.length - 1) {
      this.currentStep++;
      this.showCurrentStep();
    }
  }
  
  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showCurrentStep();
    }
  }
  
  showCurrentStep() {
    const step = this.tourSteps[this.currentStep];
    const messagesContainer = this.panel.querySelector('#tour-messages');
    
    messagesContainer.innerHTML = '';
    
    const stepMessage = document.createElement('div');
    stepMessage.className = 'tour-message enoch-message';
    stepMessage.innerHTML = `<div class="message-content"><strong>${step.title}</strong><br><br>${step.text}</div>`;
    messagesContainer.appendChild(stepMessage);
    
    this.panel.querySelector('#tour-progress').textContent = `${this.currentStep + 1}/${this.tourSteps.length}`;
  }
  
  setView(viewName) {
    this.currentView = viewName;
  }
  
  open() {
    this.panel.classList.add('visible');
    this.isOpen = true;
  }
  
  close() {
    this.panel.classList.remove('visible');
    this.isOpen = false;
  }
  
  destroy() {
    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
    }
  }
}

export default AITourGuide;
