/**
 * NIIDO HOME — Landing Page JavaScript
 * Responsabilidades:
 *  - Galería de producto con thumbnails
 *  - Lightbox de imágenes
 *  - Acordeón de características
 *  - Animaciones de entrada (Intersection Observer)
 *  - Header sticky con sombra al scroll
 *  - Menú móvil toggle
 *  - Contador de promo (countdown)
 */

'use strict';

/* ===================================================
   1. HEADER — sombra al hacer scroll
   =================================================== */
(function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ===================================================
   2. MENÚ MÓVIL
   =================================================== */
(function initMobileMenu() {
  const btn = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const links = menu ? menu.querySelectorAll('a') : [];

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('active');
    btn.setAttribute('aria-expanded', String(isOpen));
    // Intercambiar icono hamburguesa / X
    btn.querySelector('.icon-open').classList.toggle('hidden', isOpen);
    btn.querySelector('.icon-close').classList.toggle('hidden', !isOpen);
  });

  // Cerrar menú al elegir link
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      btn.querySelector('.icon-open').classList.remove('hidden');
      btn.querySelector('.icon-close').classList.add('hidden');
    });
  });
})();

/* ===================================================
   3. GALERÍA DE PRODUCTO
   =================================================== */
(function initGallery() {
  const mainImg = document.getElementById('gallery-main-img');
  const thumbs = document.querySelectorAll('.gallery-thumb');

  if (!mainImg || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.dataset.src;
      const alt = thumb.dataset.alt || '';

      // Fade out / switch / fade in
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = src;
        mainImg.alt = alt;
        mainImg.style.opacity = '1';
      }, 200);

      // Marcar activo
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  // Activar primera thumbnail
  if (thumbs[0]) thumbs[0].classList.add('active');

  // Transición suave en imagen principal
  mainImg.style.transition = 'opacity 0.2s ease';
})();

/* ===================================================
   4. LIGHTBOX
   =================================================== */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const mainImg = document.getElementById('gallery-main-img');

  if (!lightbox || !lightboxImg || !mainImg) return;

  const open = (src) => {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Click en imagen principal → lightbox
  const galleryMainWrap = document.querySelector('.gallery-main');
  if (galleryMainWrap) {
    galleryMainWrap.addEventListener('click', () => open(mainImg.src));
  }

  // Cerrar con botón o click fuera
  if (closeBtn) closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

/* ===================================================
   5. ACORDEÓN
   =================================================== */
(function initAccordion() {
  const buttons = document.querySelectorAll('.accordion-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');

      // Cerrar todos
      document.querySelectorAll('.accordion-btn.open').forEach(openBtn => {
        openBtn.classList.remove('open');
        openBtn.nextElementSibling.classList.remove('open');
      });

      // Abrir el clickeado (si estaba cerrado)
      if (!isOpen) {
        btn.classList.add('open');
        body.classList.add('open');
      }
    });
  });

  // Abrir el primero por defecto
  if (buttons[0]) {
    buttons[0].classList.add('open');
    buttons[0].nextElementSibling.classList.add('open');
  }
})();

/* ===================================================
   6. ANIMATIONS — Intersection Observer
   =================================================== */
(function initReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: mostrar todo
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => observer.observe(el));
})();

/* ===================================================
   7. COUNTDOWN (Promo limitada)
   =================================================== */
(function initCountdown() {
  const el = document.getElementById('promo-countdown');
  if (!el) return;

  // Fecha límite: 30 días desde hoy
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 30);

  const pad = (n) => String(n).padStart(2, '0');

  const update = () => {
    const now = new Date();
    const diff = deadline - now;
    if (diff <= 0) {
      el.textContent = '¡Promoción finalizada!';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    document.getElementById('cd-days').textContent = pad(d);
    document.getElementById('cd-hours').textContent = pad(h);
    document.getElementById('cd-minutes').textContent = pad(m);
    document.getElementById('cd-seconds').textContent = pad(s);
  };

  update();
  setInterval(update, 1000);
})();

/* ===================================================
   8. SMOOTH SCROLL para links internos
   =================================================== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 80; // altura del header fijo
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ===================================================
   9. SELECTOR DE TALLA (colores)
   =================================================== */
(function initSizeSelector() {
  const options = document.querySelectorAll('.size-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });
})();

/* ===================================================
   10. STICKY CTA — mostrar después de scroll
   =================================================== */
(function initStickyCTA() {
  const stickyCTA = document.getElementById('sticky-cta');
  if (!stickyCTA) return;

  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      stickyCTA.style.transform = 'translateY(0)';
    } else {
      stickyCTA.style.transform = 'translateY(100%)';
    }
  }, { threshold: 0 });

  observer.observe(heroSection);
})();

/* ===================================================
   11. GALERÍA DE INCENTIVOS — Carrusel por mes
       Al hacer clic en un thumbnail se muestra en la
       imagen principal con efecto fade suave.
   =================================================== */
(function initIncentiveGalleries() {
  /**
   * Seleccionamos todos los thumbnails de incentivos.
   * Cada botón tiene:
   *   data-target  → ID de la <img> principal a actualizar
   *   data-src     → ruta de la imagen a mostrar
   *   data-alt     → texto alternativo de accesibilidad
   */
  const thumbs = document.querySelectorAll('.inc-thumb');
  if (!thumbs.length) return;

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      const targetId = thumb.dataset.target;
      const newSrc = thumb.dataset.src;
      const newAlt = thumb.dataset.alt || '';
      const mainImg = document.getElementById(targetId);

      if (!mainImg || !newSrc) return;

      // ── 1. Obtener todos los thumbs del mismo grupo (mismo target) ──
      const siblingThumbs = document.querySelectorAll(
        '.inc-thumb[data-target="' + targetId + '"]'
      );

      // ── 2. Si ya está activo, no hacer nada ──
      if (thumb.classList.contains('active')) return;

      // ── 3. Fade-out de la imagen principal ──
      mainImg.classList.add('fading');

      setTimeout(function () {
        // ── 4. Cambiar src + alt ──
        mainImg.src = newSrc;
        mainImg.alt = newAlt;

        // ── 5. Fade-in ──
        mainImg.classList.remove('fading');

        // ── 6. Actualizar estado activo en los thumbnails ──
        siblingThumbs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-pressed', 'false');
        });
        thumb.classList.add('active');
        thumb.setAttribute('aria-pressed', 'true');
      }, 280); // coincide con la duración del CSS transition fade
    });
  });
})();

/* ===================================================
   12. CARRUSEL DE PREMIOS E INCENTIVOS
   =================================================== */
(function initPrizesCarousel() {
  const track = document.getElementById('prizes-track');
  const prevBtn = document.getElementById('prizes-prev');
  const nextBtn = document.getElementById('prizes-next');
  const dots = document.querySelectorAll('.prize-dot');

  if (!track || !prevBtn || !nextBtn || !dots.length) return;

  const total = dots.length;
  let current = 0;
  let autoTimer = null;

  /** Mueve el carrusel al slide indicado */
  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });

    // ── Actualizar info-box con fade ──
    var infoBox = document.getElementById('prizes-info-box');
    var infoTag = document.getElementById('prize-info-tag');
    var infoTitle = document.getElementById('prize-info-title');
    var infoSub = document.getElementById('prize-info-sub');
    var infoConditions = document.getElementById('prize-info-conditions');
    var biciSpecs = document.getElementById('bici-specs');
    var slides = track.querySelectorAll('.prize-slide');

    if (infoBox && infoTag && infoTitle && infoSub && slides[current]) {
      var slide = slides[current];
      // Fade-out: duración coincide con transition CSS del info-box (0.45s)
      infoBox.classList.add('fading');
      setTimeout(function () {
        infoTag.textContent = slide.dataset.tag || '';
        infoTitle.textContent = slide.dataset.title || '';
        infoSub.textContent = slide.dataset.sub || '';

        // ── Condiciones opcionales ──
        var cond = slide.dataset.conditions || '';
        if (infoConditions) {
          infoConditions.textContent = cond;
          infoConditions.classList.toggle('visible', cond.length > 0);
        }

        // Fade-in
        infoBox.classList.remove('fading');
      }, 450);
    }

    // ── Mostrar ficha técnica solo en el slide de la bicicleta (índice 2) ──
    if (biciSpecs) {
      if (current === 2) {
        biciSpecs.classList.add('visible');
        biciSpecs.setAttribute('aria-hidden', 'false');
      } else {
        biciSpecs.classList.remove('visible');
        biciSpecs.setAttribute('aria-hidden', 'true');
      }
    }
  }

  /** Inicia el auto-avance cada 5 segundos */
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function () {
      goTo(current + 1);
    }, 5000);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  /* Flechas */
  prevBtn.addEventListener('click', function () {
    goTo(current - 1);
  });

  nextBtn.addEventListener('click', function () {
    goTo(current + 1);
  });

  /* Dots */
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(dot.dataset.index, 10));
    });
  });

  /* Swipe táctil */
  let touchStartX = 0;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    }
  }, { passive: true });

  /* Inicializar — sin auto-avance */
  goTo(0);
})();

/* ===================================================
   13. VIDEO PROMOCIONAL — Bucle silencioso / Modo activo
       • Por defecto: autoplay, muted, loop, SIN controles
       • Al hacer clic / tap en el OVERLAY: activa sonido,
         muestra controles nativos, quita el bucle
       • Al presionar X o al terminar el video:
         vuelve al bucle silencioso (resetea al inicio)
   =================================================== */
(function initPromoVideo() {
  var wrap = document.getElementById('promo-video-wrap');
  var video = document.getElementById('promo-video');
  var overlay = document.getElementById('promo-video-overlay');
  var closeBtn = document.getElementById('promo-video-close');

  if (!wrap || !video || !overlay || !closeBtn) return;

  /* ─────────────────────────────────────────────────
     MODO BUCLE — silencioso, sin controles
  ───────────────────────────────────────────────── */
  function setLoopMode() {
    video.muted = true;
    video.loop = true;
    video.removeAttribute('controls');

    if (video.paused) video.play().catch(function () { });

    // El overlay vuelve a ser visible y a capturar clics
    overlay.classList.remove('hidden-overlay');
    closeBtn.hidden = true;
    wrap.classList.add('loop-mode');
    wrap.classList.remove('active-mode');
  }

  /* ─────────────────────────────────────────────────
     MODO ACTIVO — con sonido y controles nativos
  ───────────────────────────────────────────────── */
  function setActiveMode() {
    // 1. Primero ocultar el overlay (libera pointer-events al video)
    overlay.classList.add('hidden-overlay');
    closeBtn.hidden = false;
    wrap.classList.remove('loop-mode');
    wrap.classList.add('active-mode');

    // 2. Activar sonido, quitar bucle y agregar controles
    video.muted = false;
    video.loop = false;
    video.setAttribute('controls', '');

    // 3. Reiniciar desde el inicio y reproducir
    video.currentTime = 0;
    video.play().catch(function () {
      // Si el navegador bloquea audio no muted → regresar al bucle
      video.muted = true;
      setLoopMode();
    });
  }

  /* ─────────────────────────────────────────────────
     EVENTOS
  ───────────────────────────────────────────────── */

  // Clic en el OVERLAY → activa modo sonido.
  // En modo bucle el overlay tiene pointer-events:auto y cubre el video.
  // En modo activo tiene pointer-events:none → los controles nativos quedan libres.
  overlay.addEventListener('click', function () {
    setActiveMode();
  });

  // Botón X → volver al bucle
  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    setLoopMode();
  });

  // Al terminar el video → bucle silencioso
  video.addEventListener('ended', function () {
    setLoopMode();
  });

  /* ─────────────────────────────────────────────────
     INTERSECTION OBSERVER — ahorro de recursos
     Pausa cuando sale del viewport; reanuda al volver
  ───────────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var visObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Visible: reanudar solo si está en bucle y pausado
          if (wrap.classList.contains('loop-mode') && video.paused) {
            video.play().catch(function () { });
          }
        } else {
          // Fuera de pantalla: pausar y resetear si estaba activo
          if (!video.paused) video.pause();
          if (wrap.classList.contains('active-mode')) setLoopMode();
        }
      });
    }, { threshold: 0.2 });

    visObs.observe(wrap);
  }

  /* ─────────────────────────────────────────────────
     INICIALIZACIÓN
  ───────────────────────────────────────────────── */
  wrap.classList.add('loop-mode');
  closeBtn.hidden = true;
  // El autoplay+muted del HTML ya arrancó el video; solo aseguramos el estado
})();
