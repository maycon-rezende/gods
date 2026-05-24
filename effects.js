/* ========================================
   EFFECTS.JS — O Diário de um Deus
   Cursor · Rastro · Transições · Progresso
   Menu Mobile · Música · Paralaxe
======================================== */

/* ── INICIALIZAÇÃO GLOBAL ── */
(function () {

  /* Injeta elementos globais no body */
  function injectElements() {

    /* Cursor externo (espada/símbolo) */
    const cursorOuter = document.createElement('div');
    cursorOuter.id = 'cursor-outer';
    cursorOuter.innerHTML = `
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Círculo externo -->
        <circle cx="20" cy="20" r="18"
          stroke="#c9a84c" stroke-width="0.6"
          stroke-dasharray="3 5" opacity="0.7"/>
        <!-- Cruz de espada -->
        <line x1="20" y1="4"  x2="20" y2="36"
          stroke="#f0d080" stroke-width="0.8" opacity="0.9"/>
        <line x1="4"  y1="20" x2="36" y2="20"
          stroke="#f0d080" stroke-width="0.8" opacity="0.9"/>
        <!-- Losango central -->
        <polygon points="20,14 26,20 20,26 14,20"
          fill="none" stroke="#c9a84c" stroke-width="0.8"/>
        <!-- Núcleo -->
        <circle cx="20" cy="20" r="2.5"
          fill="#f0d080" opacity="0.9"/>
        <!-- Pontos cardeais -->
        <circle cx="20" cy="6"  r="1" fill="#c9a84c" opacity="0.6"/>
        <circle cx="20" cy="34" r="1" fill="#c9a84c" opacity="0.6"/>
        <circle cx="6"  cy="20" r="1" fill="#c9a84c" opacity="0.6"/>
        <circle cx="34" cy="20" r="1" fill="#c9a84c" opacity="0.6"/>
      </svg>
    `;
    document.body.appendChild(cursorOuter);

    /* Cursor interno */
    const cursorInner = document.createElement('div');
    cursorInner.id = 'cursor-inner';
    document.body.appendChild(cursorInner);

    /* Tela de transição */
    const transition = document.createElement('div');
    transition.id = 'page-transition';
    transition.innerHTML = `
      <div class="pt-panel"></div>
      <div class="pt-panel"></div>
      <div class="pt-panel"></div>
      <div class="pt-emblem">
        <svg viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="55"
            stroke="#c9a84c" stroke-width="0.8"
            stroke-dasharray="4 6"/>
          <polygon points="60,22 96,82 24,82"
            fill="none" stroke="#6a4fcf"
            stroke-width="1" opacity="0.8"/>
          <polygon points="60,98 24,38 96,38"
            fill="none" stroke="#c9a84c"
            stroke-width="1" opacity="0.6"/>
          <ellipse cx="60" cy="60" rx="14" ry="9"
            fill="none" stroke="#f0d080" stroke-width="1"/>
          <circle cx="60" cy="60" r="5"
            fill="#c9a84c" opacity="0.9"/>
          <circle cx="60" cy="60" r="2" fill="#f0d080"/>
        </svg>
      </div>
    `;
    document.body.appendChild(transition);

    /* Barra de progresso */
    const progress = document.createElement('div');
    progress.id = 'reading-progress';
    document.body.appendChild(progress);

    /* Botão voltar ao topo */
    const toTop = document.createElement('button');
    toTop.id = 'back-to-top';
    toTop.setAttribute('aria-label', 'Voltar ao topo');
    toTop.innerHTML = `
      <svg viewBox="0 0 24 24">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    `;
    document.body.appendChild(toTop);

    /* Botão hambúrguer */
    const hamburger = document.createElement('button');
    hamburger.id = 'mobile-menu-btn';
    hamburger.setAttribute('aria-label', 'Menu');
    hamburger.innerHTML = `
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    `;
    document.body.appendChild(hamburger);

    /* Menu mobile overlay */
    const mobileNav = document.createElement('div');
    mobileNav.id = 'mobile-nav';

    /* Coleta links da nav desktop */
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach((link, i) => {
      if (link.classList.contains('nav-logo')) return;
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent;
      mobileNav.appendChild(a);
      if (i === 0) {
        const div = document.createElement('div');
        div.className = 'mobile-nav-divider';
        mobileNav.appendChild(div);
      }
    });

    document.body.appendChild(mobileNav);

  }

  injectElements();

/* ── CURSOR PERSONALIZADO ── */
  (function () {
    const outer  = document.getElementById('cursor-outer');
    const inner  = document.getElementById('cursor-inner');
    const isMobile = window.matchMedia(
      '(hover: none) and (pointer: coarse)'
    ).matches;

    if (isMobile) return;

    let mouseX = 0, mouseY = 0;
    let innerX = 0, innerY = 0;
    let outerX = 0, outerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateCursor() {
      /* Inner segue o mouse diretamente */
      innerX += (mouseX - innerX) * 0.9;
      innerY += (mouseY - innerY) * 0.9;
      inner.style.left = innerX + 'px';
      inner.style.top  = innerY + 'px';

      /* Outer segue com lag */
      outerX += (mouseX - outerX) * 0.12;
      outerY += (mouseY - outerY) * 0.12;
      outer.style.left = outerX + 'px';
      outer.style.top  = outerY + 'px';

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    /* Hover em elementos interativos */
    const hoverEls = document.querySelectorAll(
      'a, button, .char-card, .power-block, ' +
      '.gallery-item, .gallery-thumb, .desc-card, ' +
      '.story-block, .tl-item, [role="button"]'
    );

    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () =>
        document.body.classList.add('cursor-hover')
      );
      el.addEventListener('mouseleave', () =>
        document.body.classList.remove('cursor-hover')
      );
    });

    /* Esconde ao sair da janela */
    document.addEventListener('mouseleave', () => {
      outer.style.opacity = '0';
      inner.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      outer.style.opacity = '1';
      inner.style.opacity = '1';
    });
  })();

/* ── RASTRO DO CURSOR ── */
  (function () {
    const isMobile = window.matchMedia(
      '(hover: none) and (pointer: coarse)'
    ).matches;

    if (isMobile) return;

    const TRAIL_COUNT = 12;
    const trails = [];

    for (let i = 0; i < TRAIL_COUNT; i++) {
      const t = document.createElement('div');
      t.className = 'cursor-trail';
      t.style.opacity = 0;
      document.body.appendChild(t);
      trails.push({ el: t, x: 0, y: 0 });
    }

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateTrail() {
      let x = mouseX, y = mouseY;

      trails.forEach((t, i) => {
        const prev = trails[i - 1];
        t.x += ((prev ? prev.x : mouseX) - t.x) * 0.35;
        t.y += ((prev ? prev.y : mouseY) - t.y) * 0.35;

        const scale  = 1 - i / TRAIL_COUNT;
        const alpha  = (1 - i / TRAIL_COUNT) * 0.5;
        const size   = 5 * scale;

        t.el.style.left      = t.x + 'px';
        t.el.style.top       = t.y + 'px';
        t.el.style.width     = size + 'px';
        t.el.style.height    = size + 'px';
        t.el.style.opacity   = alpha;

        /* Alterna cor entre dourado e roxo */
        t.el.style.background = i % 3 === 0
          ? `rgba(160,122,240,${alpha})`
          : `rgba(201,168,76,${alpha})`;
      });

      requestAnimationFrame(animateTrail);
    }

    animateTrail();
  })();

/* ── TRANSIÇÃO ENTRE PÁGINAS ── */
  (function () {
    const pt = document.getElementById('page-transition');

    /* Entrada na página */
    function pageEnter() {
      pt.classList.add('leaving');
      setTimeout(() => {
        pt.classList.remove('leaving');
      }, 900);
    }

    /* Saída da página */
    function pageLeave(href) {
      document.body.classList.remove('transition-shadow', 'transition-map');
      if (/viloes|cavaleiro|besta|vallar|valar/i.test(href)) {
        document.body.classList.add('transition-shadow');
      } else if (/regioes|templo|cidadela|cidade|home/i.test(href)) {
        document.body.classList.add('transition-map');
      }
      pt.classList.add('entering');
      setTimeout(() => {
        window.location.href = href;
      }, 780);
    }

    /* Intercepta todos os links internos */
    document.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      if (!href ||
          href.startsWith('http') ||
          href.startsWith('#') ||
          href.startsWith('mailto') ||
          link.hasAttribute('target')) return;

      link.addEventListener('click', e => {
        e.preventDefault();
        pageLeave(href);
      });
    });

    /* Dispara entrada ao carregar */
    window.addEventListener('load', pageEnter);
  })();

/* ── BARRA DE PROGRESSO DE LEITURA ── */
  (function () {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;

    function updateProgress() {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight
        - window.innerHeight;
      const pct = docHeight > 0
        ? (scrollTop / docHeight) * 100
        : 0;
      bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  })();

/* ── BOTÃO VOLTAR AO TOPO ── */
  (function () {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

/* ── MENU HAMBÚRGUER MOBILE ── */
  (function () {
    const btn     = document.getElementById('mobile-menu-btn');
    const nav     = document.getElementById('mobile-nav');
    if (!btn || !nav) return;

    let isOpen = false;

    function openMenu() {
      isOpen = true;
      document.body.classList.add('menu-open');
      nav.style.display = 'flex';
      requestAnimationFrame(() => {
        nav.classList.add('open');
      });
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      isOpen = false;
      document.body.classList.remove('menu-open');
      nav.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (!isOpen) nav.style.display = 'none';
      }, 400);
    }

    btn.addEventListener('click', () => {
      isOpen ? closeMenu() : openMenu();
    });

    /* Fecha ao clicar em link */
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    /* Fecha com ESC */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });
  })();

/* ── PARALAXE NAS SEÇÕES ── */
  (function () {
    const isMobile = window.matchMedia(
      '(max-width: 768px)'
    ).matches;

    if (isMobile) return;

    const sections = document.querySelectorAll(
      '.section-header, .about-text, .story-block, ' +
      '.power-item, .desc-card'
    );

    function onScroll() {
      sections.forEach(el => {
        const rect   = el.getBoundingClientRect();
        const center = window.innerHeight / 2;
        const dist   = rect.top + rect.height / 2 - center;
        const factor = 0.025;
        const move   = dist * factor;
        el.style.transform = `translateY(${move}px)`;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  })();

/* ── EFEITO TYPING NAS FRASES ── */
  (function () {
    const els = document.querySelectorAll('.typing-text');
    if (!els.length) return;

    els.forEach(el => {
      const text  = el.textContent;
      el.textContent = '';
      el.classList.add('typing-text');

      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          io.unobserve(el);

          let i = 0;
          const type = setInterval(() => {
            el.textContent += text[i];
            i++;
            if (i >= text.length) clearInterval(type);
          }, 45);
        });
      }, { threshold: 0.5 });

      io.observe(el);
    });
  })();

/* Recursos narrativos: marcador, memórias, typing e auras */
  (function () {
    const chapterTitle = document.querySelector('.chapter-title, .banner-name .name-pre');
    const storyBody = document.querySelector('.story-body');
    const isChapter = !!storyBody && !!document.querySelector('.story-block');

    if (isChapter && !document.querySelector('.chapter-marker')) {
      const marker = document.createElement('aside');
      marker.className = 'chapter-marker';
      marker.innerHTML = `
        <span class="chapter-marker-label">${chapterTitle ? chapterTitle.textContent.trim() : 'Capitulo'}</span>
        <span class="chapter-marker-progress"><span></span></span>
        <button type="button" class="chapter-read-toggle" aria-label="Modo leitura">L</button>
        <button type="button" class="chapter-memory-jump" aria-label="Abrir fragmento">F</button>
      `;
      document.body.appendChild(marker);

      const fill = marker.querySelector('.chapter-marker-progress span');
      const updateMarker = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? Math.min(window.scrollY / max, 1) * 100 : 0;
        fill.style.height = pct + '%';
      };

      marker.querySelector('.chapter-read-toggle').addEventListener('click', () => {
        document.body.classList.toggle('reading-mode');
      });

      marker.querySelector('.chapter-memory-jump').addEventListener('click', () => {
        document.querySelector('.memory-fragment button')?.click();
      });

      window.addEventListener('scroll', updateMarker, { passive: true });
      updateMarker();
    }

    const finalBlock = document.querySelector('.story-block-final');
    if (isChapter && finalBlock && !document.querySelector('.memory-fragment')) {
      const path = location.pathname.toLowerCase();
      const memories = {
        'jornada-encontro': 'Naquela epoca, nenhum de nos sabia o tamanho da sombra que estava caminhando em nossa direcao. O destino nao gritou. Ele apenas sentou conosco na sala de aula.',
        'jornada-cavaleiro': 'Quando o ceu ficou vermelho, eu entendi tarde demais: aquilo nao era o inicio do caos. Era um convite.',
        'jornada-luta-cavaleiro': 'O Cavaleiro Negro nao surgiu para vencer apenas uma batalha. Ele veio para medir se ainda eramos humanos.'
      };
      const key = Object.keys(memories).find(k => path.includes(k));
      const text = memories[key] || 'Algumas lembrancas nao cabem no capitulo. Elas ficam nas margens, esperando alguem tocar o papel.';
      const fragment = document.createElement('div');
      fragment.className = 'memory-fragment reveal visible';
      fragment.innerHTML = '<button type="button">Fragmento de Memoria</button>';
      finalBlock.insertAdjacentElement('afterend', fragment);

      const modal = document.createElement('div');
      modal.className = 'memory-modal';
      modal.innerHTML = `
        <div class="memory-modal-card" role="dialog" aria-modal="true" aria-label="Fragmento de memoria">
          <div class="memory-modal-kicker">Memoria desbloqueada</div>
          <div class="memory-modal-text">${text}</div>
          <button type="button" class="memory-modal-close">Fechar</button>
        </div>
      `;
      document.body.appendChild(modal);

      const close = () => modal.classList.remove('open');
      fragment.querySelector('button').addEventListener('click', () => modal.classList.add('open'));
      modal.querySelector('.memory-modal-close').addEventListener('click', close);
      modal.addEventListener('click', e => {
        if (e.target === modal) close();
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') close();
      });
    }

    document.querySelectorAll('.final-quote, .banner-quote, .vh-sub').forEach(el => {
      if (el.dataset.typingReady) return;
      el.dataset.typingReady = 'true';
      const original = el.innerHTML;
      const text = el.textContent;
      el.classList.add('typing-reveal');

      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          io.unobserve(el);
          el.classList.add('typing-active');
          el.textContent = '';
          let i = 0;
          const timer = setInterval(() => {
            el.textContent += text[i] || '';
            i++;
            if (i >= text.length) {
              clearInterval(timer);
              el.innerHTML = original;
              el.classList.remove('typing-active');
              el.classList.add('typing-done');
            }
          }, 22);
        });
      }, { threshold: 0.5 });

      io.observe(el);
    });

    document.querySelectorAll('.char-card, .villain-photo').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--aura-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
        card.style.setProperty('--aura-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
      });
    });
  })();

})(); /* fim da IIFE global */
