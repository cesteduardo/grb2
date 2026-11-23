/* GR Brands — idioma, tema e entrada. Compartilhado pela página inicial e
   pelos Escritos. Expõe window.GRB para o blog.js e avisa as trocas de
   idioma com o evento "grb:lang". */
(function () {
  'use strict';

  var html = document.documentElement;
  var page = html.getAttribute('data-page') || 'home';

  /* ---------------------------------------------------------------- *
   * Textos (PT / EN)
   * ---------------------------------------------------------------- */
  var DICT = {
    pt: {
      title_home: 'GR Brands — Sites, identidades visuais e apps',
      desc_home: 'Estamos construindo jeitos melhores de usar a internet com o Estúdio e os Apps da GR Brands.',
      title_blog: 'Escritos — GR Brands',
      desc_blog: 'Notas sobre design, escrita e ofício.',
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
      writing: 'Escritos',
      values: 'Valores',
      jobs: 'Vagas',
      newsletter: 'Newsletter',
      colStudioK: 'Estúdio',
      colStudio: 'GR Brands, design e código',
      colBaseK: 'Base',
      colTypeK: 'Composição',
      colType: 'Inter e Times New Roman',
      colMarkK: 'Símbolo',
      colMark: 'Um círculo cortado ao meio, girado −22°',
      colYearK: 'Ano',
      // Escritos
      skip: 'Pular para o texto',
      blogEyebrow: 'GR Brands · Escritos',
      blogIntro: 'Notas sobre design, escrita e ofício.',
      loading: 'Carregando…',
      empty: 'Ainda não há textos publicados.',
      loadError: 'Não foi possível carregar os textos. Abra o site por um servidor, não direto do arquivo.',
      notFound: 'Este texto não existe ou saiu do ar.',
      minRead: '{n} min de leitura',
      allPosts: 'Todos os escritos',
      prev: 'Anterior',
      next: 'Próximo'
    },
    en: {
      title_home: 'GR Brands — Websites, visual identities and apps',
      desc_home: 'We’re building better ways to use the internet with the GR Brands Studio and Apps.',
      title_blog: 'Writing — GR Brands',
      desc_blog: 'Notes on design, writing and craft.',
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
      writing: 'Writing',
      values: 'Company Values',
      jobs: 'Jobs',
      newsletter: 'Newsletter',
      colStudioK: 'Studio',
      colStudio: 'GR Brands, design and code',
      colBaseK: 'Based in',
      colTypeK: 'Typeset in',
      colType: 'Inter and Times New Roman',
      colMarkK: 'Symbol',
      colMark: 'A circle cut in half, turned −22°',
      colYearK: 'Year',
      skip: 'Skip to the text',
      blogEyebrow: 'GR Brands · Writing',
      blogIntro: 'Notes on design, writing and craft.',
      loading: 'Loading…',
      empty: 'Nothing published yet.',
      loadError: 'The texts could not be loaded. Open the site through a server, not straight from the file.',
      notFound: 'This text doesn’t exist or was taken down.',
      minRead: '{n} min read',
      allPosts: 'All writing',
      prev: 'Previous',
      next: 'Next'
    }
  };

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  function currentLang() { return html.getAttribute('data-lang') === 'en' ? 'en' : 'pt'; }
  function t(key, vars) {
    var s = (DICT[currentLang()] || DICT.pt)[key];
    if (s == null) s = DICT.pt[key];
    if (s == null) return key;
    if (vars) for (var k in vars) s = s.replace('{' + k + '}', vars[k]);
    return s;
  }

  function applyLang(lang) {
    html.setAttribute('data-lang', lang);
    html.lang = lang === 'pt' ? 'pt-BR' : 'en';

    // O texto de um post cuida do próprio título (blog.js).
    if (DICT.pt['title_' + page]) {
      document.title = t('title_' + page);
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', t('desc_' + page));
    }

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    document.querySelectorAll('.seg__btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    syncThemeLabel();
    try { window.dispatchEvent(new CustomEvent('grb:lang', { detail: { lang: lang } })); } catch (e) {}
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
    if (themeMeta) themeMeta.setAttribute('content', currentTheme() === 'dark' ? '#1B1B1B' : '#EEEEE7');
    if (themeBtn) themeBtn.setAttribute('aria-label', currentTheme() === 'dark' ? t('themeToLight') : t('themeToDark'));
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

  window.GRB = { t: t, lang: currentLang, DICT: DICT };
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
