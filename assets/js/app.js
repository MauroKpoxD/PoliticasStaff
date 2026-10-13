/* ================================================================
   NIXXOSMP · Manual de Staff
   App JS — menú móvil, sección activa, reveal, emails ofuscados
   y barra de progreso de lectura.
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     REFERENCIAS BASE
     ============================================================ */
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('nav.links a');

  /* ============================================================
     MENÚ MÓVIL
     ============================================================ */
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      const open = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Cerrar el menú al hacer click en cualquier link */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (header) header.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Cerrar el menú con ESC cuando está abierto */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header && header.classList.contains('open')) {
      header.classList.remove('open');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    }
  });

  /* ============================================================
     SECCIÓN ACTIVA EN EL NAV (rAF-throttled)
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  let ticking = false;

  function highlightNav() {
    let current = '';
    sections.forEach(function (section) {
      const top = section.offsetTop - 140;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href') || '';
      const hash = href.split('#')[1];
      link.classList.toggle('active', Boolean(hash) && hash === current);
    });

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(highlightNav);
      ticking = true;
    }
  }, { passive: true });

  highlightNav();

  /* ============================================================
     REVEAL ON SCROLL
     ============================================================ */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');

  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    /* Fallback: mostrar todo de una si no hay IO o si el usuario
       pidió reduced motion */
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ============================================================
     EMAILS OFUSCADOS
     Ensambla el correo en runtime para evitar scraping trivial.
     El atributo data-u tiene la parte local y data-d el dominio.
     El caracter @ se inyecta como \u0040 para no dejarlo plano
     en el HTML.
     ============================================================ */
  document.querySelectorAll('.obfuscated-email').forEach(function (el) {
    const u = el.dataset.u;
    const d = el.dataset.d;
    if (!u || !d) return;

    const email = u + '\u0040' + d;

    const a = document.createElement('a');
    a.href = 'mailto:' + email;
    a.textContent = email;

    el.textContent = '';
    el.appendChild(a);
  });

  /* ============================================================
     BARRA DE PROGRESO DE LECTURA
     Mide el scroll vertical sobre la altura total del documento
     y actualiza el ancho de la barra en el top del header.
     ============================================================ */
  const readBar = document.getElementById('readBar');

  if (readBar) {
    let progressTicking = false;

    function updateProgress() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const height = doc.scrollHeight - doc.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      readBar.style.width = pct + '%';
      progressTicking = false;
    }

    window.addEventListener('scroll', function () {
      if (!progressTicking) {
        window.requestAnimationFrame(updateProgress);
        progressTicking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', updateProgress, { passive: true });

    /* Estado inicial */
    updateProgress();
  }

});