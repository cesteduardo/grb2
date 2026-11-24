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
      title_home: 'GR Brands — Nada é enfeite.',
      desc_home: 'Sites e landing pages em que cada elemento trabalha: para ser entendido e para vender.',
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
      colTag: 'Estúdio de design e código.',
      colContactK: 'Contato',
      sectionsAria: 'Seções',
      optUnsure: 'Ainda não sei',
      svcLanding: 'Landing page',
      svcSite: 'Site institucional',
      svcStore: 'Loja virtual',
      svcLinks: 'Página de links',
      fName: 'Nome',
      fCompany: 'Empresa',
      fNote: 'O que mais a gente precisa saber?',
      fSend: 'Enviar pelo WhatsApp',
      fMail: 'ou por e-mail',
      fErrGoal: 'Escolha o objetivo do site.',
      fErrName: 'Diga o seu nome.',
      mHello: 'Olá! Vim pelo site da GR Brands.',
      mGoal: 'Objetivo',
      mProject: 'Projeto',
      mName: 'Nome',
      mCompany: 'Empresa',
      mSubject: 'Novo projeto',
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
      title_home: 'GR Brands — Nothing is ornament.',
      desc_home: 'Websites and landing pages where every element does a job: to be understood, and to sell.',
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
      colTag: 'A design and code studio.',
      colContactK: 'Contact',
      sectionsAria: 'Sections',
      optUnsure: 'Not sure yet',
      svcLanding: 'Landing page',
      svcSite: 'Company website',
      svcStore: 'Online store',
      svcLinks: 'Link page',
      fName: 'Name',
      fCompany: 'Company',
      fNote: 'What else should we know?',
      fSend: 'Send via WhatsApp',
      fMail: 'or by e-mail',
      fErrGoal: 'Choose what the website is for.',
      fErrName: 'Tell us your name.',
      mHello: 'Hi! I found you through the GR Brands website.',
      mGoal: 'Goal',
      mProject: 'Project',
      mName: 'Name',
      mCompany: 'Company',
      mSubject: 'New project',
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
   * Entrada por rolagem (seções abaixo da dobra)
   * ---------------------------------------------------------------- */
  var lazyEls = document.querySelectorAll('.reveal-scroll');
  if (lazyEls.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
      lazyEls.forEach(function (el) { io.observe(el); });
      // Âncoras (#trabalhos etc.) aparecem na hora, sem esperar a rolagem.
      var showHash = function () {
        var t = location.hash && document.getElementById(location.hash.slice(1));
        if (t && t.classList.contains('reveal-scroll')) t.classList.add('is-in');
      };
      window.addEventListener('hashchange', showHash);
      showHash();
    } else {
      lazyEls.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  /* ---------------------------------------------------------------- *
   * Formulário: monta a mensagem e abre o WhatsApp (sem servidor)
   * ---------------------------------------------------------------- */
  var form = document.getElementById('projectForm');
  if (form) {
    var WA = '5517992686970';
    var MAIL = 'contato@grbrands.com.br';
    var errEl = document.getElementById('formError');
    var mailEl = document.getElementById('formMail');
    var svcSel = document.getElementById('f-servico');

    // "Começar por aqui" em cada serviço já escolhe o tipo de projeto.
    document.querySelectorAll('[data-servico]').forEach(function (a) {
      a.addEventListener('click', function () { if (svcSel) svcSel.value = a.getAttribute('data-servico'); });
    });

    var labelOf = function (input) {
      if (!input) return '';
      var l = input.closest('label');
      var span = l && l.querySelector('[data-l="' + currentLang() + '"]');
      return (span || l || input).textContent.trim();
    };
    var compose = function () {
      var goal = form.querySelector('input[name="objetivo"]:checked');
      var lines = [t('mHello'), ''];
      if (goal) lines.push(t('mGoal') + ': ' + labelOf(goal));
      if (svcSel && svcSel.value) lines.push(t('mProject') + ': ' + svcSel.options[svcSel.selectedIndex].textContent.trim());
      var name = form.nome.value.trim(), company = form.empresa.value.trim(), msg = form.mensagem.value.trim();
      if (name) lines.push(t('mName') + ': ' + name);
      if (company) lines.push(t('mCompany') + ': ' + company);
      if (msg) lines.push('', msg);
      return lines.join('\n');
    };
    var syncMail = function () {
      if (mailEl) mailEl.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(t('mSubject')) + '&body=' + encodeURIComponent(compose());
    };
    form.addEventListener('input', syncMail);
    form.addEventListener('change', syncMail);
    window.addEventListener('grb:lang', syncMail);
    syncMail();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var problem = '';
      var first = null;
      if (!form.querySelector('input[name="objetivo"]:checked')) { problem = t('fErrGoal'); first = form.querySelector('input[name="objetivo"]'); }
      else if (!form.nome.value.trim()) { problem = t('fErrName'); first = form.nome; }
      if (problem) {
        errEl.textContent = problem;
        errEl.hidden = false;
        if (first) first.focus();
        return;
      }
      errEl.hidden = true;
      var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(compose());
      // Um link temporário abre em nova aba sem tirar o visitante da página.
      var a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

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
