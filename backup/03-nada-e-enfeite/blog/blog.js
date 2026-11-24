/* GR Brands — Escritos.
   Lê blog/textos.json (a lista de arquivos) e os .md de blog/textos/,
   cada um com um cabeçalho entre linhas de "---". Não há etapa de build:
   publicar é subir o .md e acrescentar o nome dele à lista.

   Cabeçalho aceito (as chaves em inglês também valem):
     titulo / title      obrigatório
     data / date         AAAA-MM-DD, obrigatório
     resumo / summary    uma ou duas linhas para a lista e o subtítulo
     idioma / lang       pt (padrão) ou en
     rascunho / draft    sim / true esconde o texto da lista */
(function () {
  'use strict';

  var GRB = window.GRB;
  var html = document.documentElement;
  var page = html.getAttribute('data-page');
  var stateEl = document.getElementById('state');

  var MONTHS = {
    pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };

  /* ---------------------------------------------------------------- *
   * Utilidades
   * ---------------------------------------------------------------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function state(key) {
    if (!stateEl) return;
    if (!key) { stateEl.hidden = true; return; }
    stateEl.hidden = false;
    stateEl.textContent = GRB.t(key);
    stateEl.setAttribute('data-state', key);
  }

  function parseFrontMatter(text) {
    var meta = {}, body = text.replace(/^﻿/, '');
    var m = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/.exec(body);
    if (m) {
      body = body.slice(m[0].length);
      m[1].split(/\r?\n/).forEach(function (line) {
        var i = line.indexOf(':');
        if (i < 1) return;
        var k = line.slice(0, i).trim().toLowerCase();
        var v = line.slice(i + 1).trim().replace(/^(["'])([\s\S]*)\1$/, '$2');
        meta[k] = v;
      });
    }
    var pick = function () {
      for (var j = 0; j < arguments.length; j++) if (meta[arguments[j]]) return meta[arguments[j]];
      return '';
    };
    var draft = /^(sim|true|yes|1)$/i.test(pick('rascunho', 'draft'));
    return {
      title: pick('titulo', 'título', 'title'),
      date: pick('data', 'date'),
      summary: pick('resumo', 'summary', 'description'),
      lang: /^en/i.test(pick('idioma', 'lang')) ? 'en' : 'pt',
      draft: draft,
      body: body
    };
  }

  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || '');
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }

  function formatDate(d) {
    if (!d) return '';
    var lang = GRB.lang();
    var mo = MONTHS[lang][d.getMonth()];
    return lang === 'en' ? mo + ' ' + d.getDate() + ', ' + d.getFullYear() : d.getDate() + ' ' + mo + ' ' + d.getFullYear();
  }

  function isoDate(d) {
    if (!d) return '';
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  function minutes(body) {
    var words = body.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`~\[\]()!-]/g, ' ').split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  }

  function slugOf(file) { return file.replace(/\.md$/i, ''); }
  var SLUG = /^[a-z0-9][a-z0-9-]*$/i;

  /* ---------------------------------------------------------------- *
   * Dados
   * ---------------------------------------------------------------- */
  function getText(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(r.status + ' ' + url);
      return r.text();
    });
  }

  function loadAll() {
    return getText('textos.json').then(function (raw) {
      var list = JSON.parse(raw);
      if (!Array.isArray(list)) list = list.textos || [];
      list = list.filter(function (f) { return typeof f === 'string' && SLUG.test(slugOf(f)); });
      return Promise.all(list.map(function (file) {
        return getText('textos/' + file).then(function (txt) {
          var p = parseFrontMatter(txt);
          p.slug = slugOf(file);
          p.d = parseDate(p.date);
          return p;
        }, function () { return null; });
      }));
    }).then(function (posts) {
      return posts
        .filter(function (p) { return p && !p.draft && p.title && p.d; })
        .sort(function (a, b) { return b.d - a.d || (a.slug < b.slug ? 1 : -1); });
    });
  }

  /* ---------------------------------------------------------------- *
   * Lista
   * ---------------------------------------------------------------- */
  var cache = null;

  function renderList() {
    var ol = document.getElementById('posts');
    if (!ol || !cache) return;
    ol.textContent = '';
    if (!cache.length) { state('empty'); return; }
    state(null);
    cache.forEach(function (p) {
      var li = el('li');
      var a = el('a', 'post-card glass');
      a.href = 'texto.html?t=' + encodeURIComponent(p.slug);
      if (p.lang === 'en') a.setAttribute('hreflang', 'en');

      var date = el('time', 'eyebrow post-card__date', formatDate(p.d));
      date.dateTime = isoDate(p.d);
      var title = el('h2', 'post-card__title', p.title);
      title.lang = p.lang === 'en' ? 'en' : 'pt-BR';
      a.appendChild(date);
      a.appendChild(title);
      if (p.summary) {
        var dek = el('p', 'post-card__dek', p.summary);
        dek.lang = title.lang;
        a.appendChild(dek);
      }
      a.appendChild(el('span', 'eyebrow post-card__meta', GRB.t('minRead', { n: minutes(p.body) })));
      li.appendChild(a);
      ol.appendChild(li);
    });
  }

  /* ---------------------------------------------------------------- *
   * Texto
   * ---------------------------------------------------------------- */
  var current = null;

  function renderMarkdown(md) {
    var box = document.createElement('div');
    box.innerHTML = window.marked.parse(md, { gfm: true });

    // Imagem com título vira figura com legenda: ![descrição](foto.webp "Legenda")
    box.querySelectorAll('img').forEach(function (img) {
      var src = img.getAttribute('src') || '';
      if (!/^(?:[a-z]+:|\/|#|data:)/i.test(src)) img.setAttribute('src', 'textos/' + src);
      img.loading = 'lazy';
      img.decoding = 'async';
      var cap = img.getAttribute('title');
      var parent = img.parentElement;
      var alone = parent && parent.tagName === 'P' && parent.childNodes.length === 1;
      if (cap || alone) {
        var fig = el('figure');
        img.removeAttribute('title');
        fig.appendChild(img.cloneNode(true));
        if (cap) fig.appendChild(el('figcaption', '', cap));
        (alone ? parent : img).replaceWith(fig);
      }
    });
    // Links para fora abrem em outra aba.
    box.querySelectorAll('a[href]').forEach(function (a) {
      if (/^https?:\/\//i.test(a.getAttribute('href')) && a.host !== location.host) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
    });
    return box;
  }

  function pagerCard(p, kind) {
    var a = el('a', 'pager-card glass pager-card--' + kind);
    a.href = 'texto.html?t=' + encodeURIComponent(p.slug);
    a.appendChild(el('span', 'eyebrow', GRB.t(kind === 'prev' ? 'prev' : 'next')));
    var tt = el('span', 'pager-card__title', p.title);
    tt.lang = p.lang === 'en' ? 'en' : 'pt-BR';
    a.appendChild(tt);
    return a;
  }

  function renderPostChrome() {
    if (!current) return;
    var p = current.post;
    var dateEl = document.getElementById('postDate');
    dateEl.textContent = formatDate(p.d);
    dateEl.dateTime = isoDate(p.d);
    document.getElementById('postRead').textContent = GRB.t('minRead', { n: minutes(p.body) });

    var pager = document.getElementById('pager');
    pager.textContent = '';
    var i = current.index, list = current.list;
    // A lista vai do mais novo ao mais antigo: o anterior é o seguinte nela.
    if (list[i + 1]) pager.appendChild(pagerCard(list[i + 1], 'prev'));
    if (list[i - 1]) pager.appendChild(pagerCard(list[i - 1], 'next'));
    pager.hidden = !pager.children.length;
  }

  function renderPost(list) {
    var slug = new URLSearchParams(location.search).get('t') || '';
    var index = -1;
    list.forEach(function (p, i) { if (p.slug === slug) index = i; });
    if (index < 0) { state('notFound'); return; }

    var p = list[index];
    current = { post: p, list: list, index: index };

    var art = document.getElementById('post');
    art.lang = p.lang === 'en' ? 'en' : 'pt-BR';
    document.getElementById('postTitle').textContent = p.title;
    var dek = document.getElementById('postDek');
    dek.textContent = p.summary;
    dek.hidden = !p.summary;

    var prose = document.getElementById('prose');
    prose.textContent = '';
    var box = renderMarkdown(p.body);
    while (box.firstChild) prose.appendChild(box.firstChild);

    document.title = p.title + ' — GR Brands';
    var meta = document.querySelector('meta[name="description"]');
    if (meta && p.summary) meta.setAttribute('content', p.summary);

    renderPostChrome();
    state(null);
    art.hidden = false;
  }

  /* ---------------------------------------------------------------- *
   * Partida
   * ---------------------------------------------------------------- */
  var all = null;
  state('loading');
  loadAll().then(function (list) {
    all = list;
    if (page === 'blog') { cache = list; renderList(); }
    else if (page === 'post') renderPost(list);
  }).catch(function () { state('loadError'); });

  window.addEventListener('grb:lang', function () {
    if (page === 'blog' && all) renderList();
    if (page === 'post') renderPostChrome();
    if (stateEl && !stateEl.hidden && stateEl.getAttribute('data-state')) {
      stateEl.textContent = GRB.t(stateEl.getAttribute('data-state'));
    }
  });
})();
