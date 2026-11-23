(function () {
  'use strict';

  /* ---------- Nav floating on scroll ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile menu ---------- */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  function openMenu() { hamburger.classList.add('open'); mobileMenu.classList.add('open'); mobileMenu.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); mobileMenu.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
  if (hamburger) hamburger.addEventListener('click', function () { mobileMenu.classList.contains('open') ? closeMenu() : openMenu(); });
  document.querySelectorAll('.mobile-link').forEach(function (l) { l.addEventListener('click', closeMenu); });

  /* ---------- FAQ: só um aberto por vez ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        document.querySelectorAll('.faq-item').forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- Form submit (placeholder) ---------- */
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var agree = document.getElementById('f-agree');
      if (!agree.checked) { agree.focus(); return; }
      var btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Enviando…';
      btn.style.opacity = '.7';
      setTimeout(function () {
        form.style.display = 'none';
        success.style.display = 'block';
      }, 900);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Modais (Termos / Privacidade) ---------- */
  function openModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    m.classList.add('open');
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  var openTerms = document.getElementById('openTerms');
  var openPrivacy = document.getElementById('openPrivacy');
  var openPrivacyFromForm = document.getElementById('openPrivacyFromForm');
  if (openTerms) openTerms.addEventListener('click', function (e) { e.preventDefault(); openModal('termsModal'); });
  if (openPrivacy) openPrivacy.addEventListener('click', function (e) { e.preventDefault(); openModal('privacyModal'); });
  if (openPrivacyFromForm) openPrivacyFromForm.addEventListener('click', function (e) { e.preventDefault(); openModal('privacyModal'); });
  document.querySelectorAll('.modal-close').forEach(function (btn) {
    btn.addEventListener('click', function () { closeModal(btn.closest('.modal-overlay').id); });
  });
  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(overlay.id); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(function (m) { closeModal(m.id); });
    }
  });

  /* ---------- Sticky bar: some near hero, reappear after scrolling ---------- */
  var stickyBar = document.getElementById('stickyBar');
  var hero = document.querySelector('.hero');
  if (stickyBar && hero) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        stickyBar.classList.toggle('is-hidden', entry.isIntersecting);
      });
    }, { threshold: 0 });
    io2.observe(hero);

    var contact = document.getElementById('contato');
    if (contact) {
      var io3 = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) stickyBar.classList.add('is-hidden');
        });
      }, { threshold: 0.3 });
      io3.observe(contact);
    }
  }
})();
