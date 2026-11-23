/* GR Brands — modelo de página única: idioma, tema e entrada. */
(function () {
  'use strict';

  var html = document.documentElement;

  /* ---------------------------------------------------------------- *
   * Idioma (PT / EN)
   * ---------------------------------------------------------------- */
  var DICT = {
    pt: {
      title: 'GR Brands — Sites, identidades visuais e apps',
      description: 'Estamos construindo jeitos melhores de usar a internet com o Estúdio e os Apps da GR Brands.',
      theme: 'Tema',
      themeToLight: 'Mudar para o tema claro',
      themeToDark: 'Mudar para o tema escuro',
      langGroup: 'Idioma',
      homeAria: 'GR Brands, início',
      h1a: 'Estamos construindo jeitos melhores de usar a internet com o ',
      h1studio: 'Estúdio',
      h1b: ' e os ',
      h1apps: 'Apps',
      btnStudio: 'GR Estúdio',
      btnApps: 'GR Apps',
      navAria: 'Links',
      values: 'Valores',
      jobs: 'Vagas',
      newsletter: 'Newsletter'
    },
    en: {
      title: 'GR Brands — Websites, visual identities and apps',
      description: 'We’re building better ways to use the internet with the GR Brands Studio and Apps.',
      theme: 'Theme',
      themeToLight: 'Switch to light theme',
      themeToDark: 'Switch to dark theme',
      langGroup: 'Language',
      homeAria: 'GR Brands, home',
      h1a: 'We’re building better ways to use the internet with our ',
      h1studio: 'Studio',
      h1b: ' and ',
      h1apps: 'Apps',
      btnStudio: 'GR Studio',
      btnApps: 'GR Apps',
      navAria: 'Links',
      values: 'Company Values',
      jobs: 'Jobs',
      newsletter: 'Newsletter'
    }
  };

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  function currentLang() { return html.getAttribute('data-lang') === 'en' ? 'en' : 'pt'; }

  function applyLang(lang) {
    var t = DICT[lang] || DICT.pt;
    html.setAttribute('data-lang', lang);
    html.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.title = t.title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t.description);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t[el.getAttribute('data-i18n')];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var v = t[el.getAttribute('data-i18n-aria')];
      if (v != null) el.setAttribute('aria-label', v);
    });
    document.querySelectorAll('.seg__btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    syncThemeLabel();
  }

  document.querySelectorAll('.seg__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var lang = b.getAttribute('data-lang');
      if (lang === currentLang()) return;
      store.set('grb-lang', lang);
      applyLang(lang);
    });
  });

  /* ---------------------------------------------------------------- *
   * Tema (claro / escuro)
   * ---------------------------------------------------------------- */
  var themeBtn = document.getElementById('themeToggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function currentTheme() { return html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }

  function syncThemeLabel() {
    if (!themeBtn) return;
    var t = DICT[currentLang()];
    themeBtn.setAttribute('aria-label', currentTheme() === 'dark' ? t.themeToLight : t.themeToDark);
    if (themeMeta) themeMeta.setAttribute('content', currentTheme() === 'dark' ? '#1B1B1B' : '#EEEEE7');
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      store.set('grb-theme', next);
      syncThemeLabel();
    });
  }

  // Sem escolha salva, o tema acompanha o sistema.
  try {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (store.get('grb-theme')) return;
      html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      syncThemeLabel();
    });
  } catch (e) {}

  applyLang(currentLang());

  /* ---------------------------------------------------------------- *
   * Entrada: espera a abertura de vidro sair
   * ---------------------------------------------------------------- */
  var revealed = false;
  function reveal() {
    if (revealed) return;
    revealed = true;
    requestAnimationFrame(function () {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    });
  }

  if (!html.classList.contains('is-intro')) {
    reveal();
  } else {
    window.addEventListener('grb:intro-saindo', reveal);
    // A rede de segurança do <head> tira .is-intro sem disparar o evento.
    new MutationObserver(function (_, obs) {
      if (!html.classList.contains('is-intro')) { obs.disconnect(); reveal(); }
    }).observe(html, { attributes: true, attributeFilter: ['class'] });
  }
  setTimeout(reveal, 7000);
})();
