/**
 * SISTEMA DE MENSAGENS DA ESCURIDÃO
 * Gerencia o rastreamento de libertação e mensagens escondidas
 */

class DarknessSystem {
  constructor() {
    this.storageKey = 'darkness_liberation_state';
    this.messageShowKey = 'darkness_message_shown';
    this.state = this.loadState();
  }

  // Carrega estado do localStorage
  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : {
        isLiberated: false,
        liberationTime: null,
        visitedPages: []
      };
    } catch (e) {
      return { isLiberated: false, liberationTime: null, visitedPages: [] };
    }
  }

  // Salva estado no localStorage
  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Não foi possível salvar estado no localStorage');
    }
  }

  // Marca a escuridão como libertada
  liberate() {
    this.state.isLiberated = true;
    this.state.liberationTime = new Date().toISOString();
    this.saveState();
  }

  // Verifica se já foi libertada
  isLiberated() {
    return this.state.isLiberated === true;
  }

  // Adiciona página visitada
  addVisitedPage(pageName) {
    if (!this.state.visitedPages.includes(pageName)) {
      this.state.visitedPages.push(pageName);
      this.saveState();
    }
  }

  // Reseta o sistema (para testes)
  reset() {
    this.state = { isLiberated: false, liberationTime: null, visitedPages: [] };
    this.saveState();
    localStorage.removeItem(this.messageShowKey);
  }
}

// Instância global
window.darknessSystem = new DarknessSystem();

/**
 * GERENCIADOR DE MENSAGENS ESCONDIDAS
 */
class HiddenMessageManager {
  constructor() {
    this.messageContainer = null;
    this.isMessageVisible = false;
    this.messageShowKey = 'darkness_message_shown_' + this.getCurrentPage();
  }

  getCurrentPage() {
    return window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  }

  // Cria o container de mensagens se não existir
  ensureContainer() {
    if (this.messageContainer) return;

    this.messageContainer = document.createElement('div');
    this.messageContainer.id = 'darkness-message-container';
    this.messageContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.5s ease, transform 0.5s ease;
      will-change: opacity, transform;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(this.messageContainer);
  }

  // Exibe uma mensagem escondida
  showMessage(text, options = {}) {
    const {
      duration = 4000,
      color = '#c9a84c',
      fontSize = '1.2rem',
      onComplete = null,
      randomPosition = false
    } = options;

    if (this.isMessageVisible) return;

    this.ensureContainer();

    if (randomPosition) {
      const top = Math.random() * 50 + 20;
      const left = Math.random() * 60 + 20;
      this.messageContainer.style.top = `${top}%`;
      this.messageContainer.style.left = `${left}%`;
      this.messageContainer.style.transform = 'translate(-50%, -50%) scale(0.95)';
    } else {
      this.messageContainer.style.top = '50%';
      this.messageContainer.style.left = '50%';
      this.messageContainer.style.transform = 'translate(-50%, -50%) scale(0.8)';
    }

    const message = document.createElement('div');
    message.style.cssText = `
      font-family: 'Cinzel', serif;
      font-size: ${fontSize};
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${color};
      opacity: 0.92;
      text-align: center;
      text-shadow: 0 0 18px ${color}40, 0 0 40px ${color}20;
      font-weight: 600;
      max-width: 560px;
      padding: 1.5rem 1.75rem;
      white-space: nowrap;
      filter: drop-shadow(0 0 18px ${color}25);
    `;
    message.textContent = text;

    this.messageContainer.innerHTML = '';
    this.messageContainer.appendChild(message);

    // Efeito de aparecimento
    this.isMessageVisible = true;
    requestAnimationFrame(() => {
      this.messageContainer.style.opacity = '1';
      this.messageContainer.style.transform = this.messageContainer.style.transform.replace('scale(0.95)', 'scale(1)').replace('scale(0.8)', 'scale(1)');
    });

    // Desaparece automaticamente
    setTimeout(() => {
      this.messageContainer.style.opacity = '0';
      this.messageContainer.style.transform = this.messageContainer.style.transform.replace('scale(1)', 'scale(0.9)');
      
      setTimeout(() => {
        this.isMessageVisible = false;
        if (onComplete) onComplete();
      }, 500);
    }, duration);
  }

  // Mostra mensagem apenas uma vez por página
  showMessageOnce(text, options = {}) {
    if (!this.shouldShowMessage()) return false;

    this.showMessage(text, options);
    localStorage.setItem(this.messageShowKey, 'true');
    return true;
  }

  shouldShowMessage() {
    return !localStorage.getItem(this.messageShowKey);
  }

  resetMessageForPage() {
    localStorage.removeItem(this.messageShowKey);
  }
}

// Instância global
window.hiddenMessageManager = new HiddenMessageManager();

// Função para disparar mensagens aleatórias antes da libertação
window.triggerRandomDarknessMessage = function() {
  if (window.darknessSystem.isLiberated()) return;

  const messages = [
    'Me liberte...',
    'Me visite...',
    'Eu estou presa...',
    'Procure por mim...',
    'Ouça meu chamado...',
    'Não me deixe aqui...',
    'Ajude-me a escapar...',
    'Sou a escuridão...'
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const colors = ['#c9a84c', '#a07af0', '#f0d080', '#6a4fcf'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  window.hiddenMessageManager.showMessage(randomMessage, {
    duration: 3500,
    color: randomColor,
    fontSize: '1.1rem',
    randomPosition: true
  });
};

// Auto-dispara mensagens em intervalos quando não libertada
window.initRandomMessages = function(minInterval = 15000, maxInterval = 45000) {
  if (window.darknessSystem.isLiberated()) return;

  function scheduleNextMessage() {
    const interval = Math.random() * (maxInterval - minInterval) + minInterval;
    setTimeout(() => {
      window.triggerRandomDarknessMessage();
      scheduleNextMessage();
    }, interval);
  }

  scheduleNextMessage();
};

// Função para liberar a escuridão
window.liberateDarkness = function(showMessage = true) {
  window.darknessSystem.liberate();
  
  if (showMessage) {
    window.hiddenMessageManager.showMessage('Você me libertou...', {
      duration: 3000,
      color: '#f0d080',
      fontSize: '1.3rem'
    });
  }
};

console.log('✨ Darkness System loaded');
