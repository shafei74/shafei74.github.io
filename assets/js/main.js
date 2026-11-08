/* =========================================================
   Mohamed Elshafei — Portfolio interactions & motion
   Content lives in content/content.js (window.SITE).
   ========================================================= */
(function () {
  'use strict';

  var SITE = window.SITE || { videos: [], medicalVideos: [], contact: {} };
  var doc = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var gsap = window.gsap, ST = window.ScrollTrigger, Flip = window.Flip;
  var motion = !!(gsap && ST) && !reduce;
  var lenis = null;

  if (motion) { gsap.registerPlugin(ST); if (Flip) gsap.registerPlugin(Flip); doc.classList.add('motion', 'has-morph'); }
  else doc.classList.add('no-motion');
  doc.classList.add('ready');

  var CAT = { skincare: 'Skincare', haircare: 'Haircare' };
  var TAG = {
    awareness: 'Medical awareness', education: 'Pharmaceutical education', medication: 'Medication information',
    myths: 'Myths & facts', safety: 'Drug interactions & safety', science: 'Scientific explanations'
  };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var visibleOnly = function (arr) { return (arr || []).filter(function (v) { return v && v.visible !== false; }); };

  /* -------------------------------------------------------
     RENDER — two separate galleries
       work:    skincare & haircare portfolio (portrait cards)
       medical: medical content ("case file" cards)
     ------------------------------------------------------- */
  var playIcon = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 1.6v12.8L14 8z" fill="currentColor"/></svg>';
  var LISTS = {
    work: { videos: visibleOnly(SITE.videos), grid: $('#work-grid'), filters: $('#work .filters'), item: '.card' },
    medical: { videos: visibleOnly(SITE.medicalVideos), grid: $('#med-grid'), filters: $('#medical .filters'), item: '.rx' }
  };

  function mediaButton(key, v, i, chip) {
    return '<button class="card__media" type="button" data-list="' + key + '" data-i="' + i + '" aria-label="Play video: ' + esc(v.title) + '">' +
      '<img src="' + esc(v.thumbnail) + '" alt="" loading="lazy" decoding="async" width="720" height="1280">' +
      (v.preview && fine ? '<video muted loop playsinline preload="none" data-src="' + esc(v.preview) + '" aria-hidden="true"></video>' : '') +
      '<span class="card__top">' + chip + (v.duration ? '<span class="card__dur">' + esc(v.duration) + '</span>' : '') + '</span>' +
      '<span class="card__play" aria-hidden="true">' + playIcon + '</span></button>';
  }

  LISTS.work.grid.innerHTML = LISTS.work.videos.map(function (v, i) {
    return '<article class="card" data-tags="' + esc(v.category) + '" data-i="' + i + '">' +
      mediaButton('work', v, i, '<span class="chip" data-cat="' + esc(v.category) + '">' + esc(CAT[v.category] || v.category) + '</span>') +
      '<div class="card__body">' +
        '<p class="card__meta"><b>' + pad(i + 1) + '</b><span>' + esc(v.topic) + '</span></p>' +
        '<h3 class="card__title">' + esc(v.title) + '</h3>' +
        '<p class="card__desc">' + esc(v.description) + '</p>' +
      '</div></article>';
  }).join('');

  LISTS.medical.grid.innerHTML = LISTS.medical.videos.map(function (v, i) {
    var tags = v.tags || [];
    return '<article class="rx" data-tags="' + esc(tags.join(' ')) + '" data-i="' + i + '">' +
      mediaButton('medical', v, i, '<span class="chip" data-cat="medical">Medical</span>') +
      '<div class="rx__body">' +
        '<p class="rx__top"><span class="rx__no">Rx ' + pad(i + 1) + '</span><span>' + esc(v.duration || '') + '</span></p>' +
        '<p class="rx__tags">' + tags.map(function (t) { return '<span>' + esc(TAG[t] || t) + '</span>'; }).join('') + '</p>' +
        '<h3 class="rx__title">' + esc(v.title) + '</h3>' +
        '<p class="rx__desc">' + esc(v.description) + '</p>' +
        '<button class="rx__cta" type="button" data-play="' + i + '">Watch video ' + playIcon + '</button>' +
      '</div></article>';
  }).join('');
  if (!LISTS.medical.videos.length) $('#medical').hidden = true;

  /* filters (one bar per gallery) */
  function setupFilters(key, labels, valuesOf) {
    var L = LISTS[key], wrap = L.filters, grid = L.grid, pill = $('.filters__pill', wrap);
    var vals = [];
    L.videos.forEach(function (v) { valuesOf(v).forEach(function (t) { if (vals.indexOf(t) < 0) vals.push(t); }); });
    ['all'].concat(vals).forEach(function (c, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.dataset.filter = c; b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      var count = c === 'all' ? L.videos.length : L.videos.filter(function (v) { return valuesOf(v).indexOf(c) > -1; }).length;
      b.innerHTML = (c === 'all' ? 'All' : esc(labels[c] || c)) + '<sup>' + pad(count) + '</sup>';
      wrap.appendChild(b);
    });
    if (vals.length < 2) wrap.style.display = 'none';

    function movePill(btn, instant) {
      if (!btn) return;
      if (instant) pill.style.transition = 'none';
      pill.style.width = btn.offsetWidth + 'px';
      pill.style.transform = 'translateX(' + (btn.offsetLeft - 5) + 'px)';
      if (instant) { pill.offsetWidth; pill.style.transition = ''; }
    }
    var current = 'all';
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn || btn.dataset.filter === current) return;
      current = btn.dataset.filter;
      $$('button', wrap).forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      movePill(btn);
      var cards = $$(L.item, grid);
      var state = motion && Flip ? Flip.getState(cards) : null;
      var h0 = grid.offsetHeight;
      cards.forEach(function (c) { c.hidden = !(current === 'all' || c.dataset.tags.split(' ').indexOf(current) > -1); });
      if (state) {
        // hold the grid's height while cards fly, then ease to the new height,
        // so the sections below — and the pinned process section — never jump.
        var h1 = grid.offsetHeight;
        grid.style.height = h0 + 'px';
        gsap.to(grid, { height: h1, duration: .85, ease: 'expo.inOut' });
        Flip.from(state, {
          duration: .85, ease: 'expo.inOut', absolute: true, scale: true,
          onEnter: function (els) { return gsap.fromTo(els, { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .8, ease: 'expo.out', delay: .15 }); },
          onLeave: function (els) { return gsap.to(els, { opacity: 0, scale: .9, duration: .5, ease: 'power2.in' }); },
          onComplete: function () { gsap.delayedCall(.05, function () { grid.style.height = ''; ST.refresh(); }); }
        });
      }
    });
    var sync = function () { movePill($('button[aria-pressed="true"]', wrap), true); };
    window.addEventListener('load', sync);
    window.addEventListener('resize', sync);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
    sync();
  }
  setupFilters('work', CAT, function (v) { return [v.category]; });
  setupFilters('medical', TAG, function (v) { return v.tags || []; });

  /* hover previews + tilt (both galleries) */
  $$('.card, .rx').forEach(function (card) {
    var media = $('.card__media', card);
    var vid = $('video', card);
    var hoverEl = card.classList.contains('rx') ? card : media; // medical cards preview on whole-card hover
    hoverEl.addEventListener('mouseenter', function () {
      if (!vid) return;
      if (!vid.src) vid.src = vid.dataset.src;
      var p = vid.play(); if (p && p.catch) p.catch(function () {});
      vid.onplaying = function () { card.classList.add('is-previewing'); };
    });
    hoverEl.addEventListener('mouseleave', function () { if (vid) { vid.pause(); card.classList.remove('is-previewing'); } });
    if (motion && fine) {
      media.addEventListener('mousemove', function (e) {
        var r = media.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        gsap.to(media, { rotateY: px * 6, rotateX: -py * 6, transformPerspective: 1000, duration: .6, ease: 'power3.out' });
      });
      media.addEventListener('mouseleave', function () { gsap.to(media, { rotateY: 0, rotateX: 0, duration: .9, ease: 'expo.out' }); });
    }
  });

  /* -------------------------------------------------------
     VIDEO PLAYER (dialog) — shared, but each gallery keeps
     its own playlist so the categories never mix.
     ------------------------------------------------------- */
  var player = $('#player');
  var stage = $('.player__stage', player);
  var pvideo = $('.player__video', player);
  var lastFocus = null, current = -1, currentList = 'work';

  function visibleIndexes() {
    var L = LISTS[currentList];
    return $$(L.item, L.grid).filter(function (c) { return !c.hidden; }).map(function (c) { return +c.dataset.i; });
  }
  function fillPlayer(i) {
    var v = LISTS[currentList].videos[i]; current = i;
    var chip = $('.chip', player);
    if (currentList === 'medical') { chip.textContent = 'Medical'; chip.dataset.cat = 'medical'; }
    else { chip.textContent = CAT[v.category] || v.category; chip.dataset.cat = v.category; }
    player.dataset.list = currentList;
    $('.player__topic', player).textContent = v.topic || '';
    $('.player__title', player).textContent = v.title;
    $('.player__desc', player).textContent = v.description || '';
    var link = $('.player__link', player);
    if (v.link) { link.href = v.link; link.hidden = false; } else link.hidden = true;
    var list = visibleIndexes(), pos = list.indexOf(i);
    $('.player__pos', player).textContent = pad(pos + 1) + ' / ' + pad(list.length);
    pvideo.poster = v.thumbnail || '';
    pvideo.src = v.video;
    var p = pvideo.play(); if (p && p.catch) p.catch(function () {});
  }
  function openPlayer(key, i, fromEl) {
    var v = LISTS[key].videos[i];
    if (!v.video) { if (v.link) window.open(v.link, '_blank', 'noopener'); return; }
    currentList = key;
    lastFocus = document.activeElement;
    player.hidden = false;
    document.body.classList.add('is-locked');
    if (lenis) lenis.stop();
    fillPlayer(i);
    doc.classList.add('player-open');
    if (motion && fromEl) {
      var a = fromEl.getBoundingClientRect(), b = stage.getBoundingClientRect();
      gsap.fromTo($('.player__backdrop', player), { opacity: 0 }, { opacity: 1, duration: .6, ease: 'power2.out' });
      gsap.fromTo(stage, {
        x: a.left - b.left, y: a.top - b.top, scaleX: a.width / b.width, scaleY: a.height / b.height, transformOrigin: '0 0', borderRadius: 18
      }, { x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 22, duration: 1, ease: 'expo.inOut' });
      gsap.fromTo($$('.player__info > *, .player__close', player), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .9, ease: 'expo.out', stagger: .06, delay: .45 });
    }
    $('.player__close', player).focus({ preventScroll: true });
  }
  function closePlayer() {
    if (player.hidden) return;
    var done = function () {
      pvideo.pause(); pvideo.removeAttribute('src'); pvideo.load();
      player.hidden = true;
      document.body.classList.remove('is-locked');
      doc.classList.remove('player-open');
      if (lenis) lenis.start();
      gsap && gsap.set([stage, $('.player__backdrop', player)], { clearProps: 'all' });
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    };
    pvideo.pause();
    var L = LISTS[currentList];
    var target = $('.card__media[data-i="' + current + '"]', L.grid);
    if (motion && target && !target.closest(L.item).hidden) {
      var a = target.getBoundingClientRect(), b = stage.getBoundingClientRect();
      var inView = a.bottom > 0 && a.top < window.innerHeight;
      gsap.to($$('.player__info > *, .player__close', player), { opacity: 0, duration: .25 });
      gsap.to($('.player__backdrop', player), { opacity: 0, duration: .7, delay: .2 });
      if (inView) {
        gsap.to(stage, { x: a.left - b.left, y: a.top - b.top, scaleX: a.width / b.width, scaleY: a.height / b.height, transformOrigin: '0 0', borderRadius: 18, duration: .85, ease: 'expo.inOut', onComplete: done });
      } else gsap.to(stage, { opacity: 0, scale: .92, duration: .5, ease: 'power2.in', onComplete: done });
    } else done();
  }
  function step(dir) {
    var list = visibleIndexes(), pos = list.indexOf(current);
    var next = list[(pos + dir + list.length) % list.length];
    if (motion) {
      gsap.to(stage, { opacity: 0, duration: .25, onComplete: function () { fillPlayer(next); gsap.to(stage, { opacity: 1, duration: .4 }); } });
      gsap.fromTo($$('.player__info > *', player), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6, stagger: .05, delay: .25, ease: 'expo.out' });
    } else fillPlayer(next);
  }

  Object.keys(LISTS).forEach(function (key) {
    LISTS[key].grid.addEventListener('click', function (e) {
      var m = e.target.closest('.card__media');
      var cta = e.target.closest('[data-play]');
      if (m) openPlayer(key, +m.dataset.i, m);
      else if (cta) openPlayer(key, +cta.dataset.play, $('.card__media', cta.closest(LISTS[key].item)));
    });
  });
  player.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) closePlayer();
    else if (e.target.closest('[data-prev]')) step(-1);
    else if (e.target.closest('[data-next]')) step(1);
  });
  document.addEventListener('keydown', function (e) {
    if (player.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closePlayer(); }
    else if (e.target !== pvideo && e.key === 'ArrowRight') step(1);
    else if (e.target !== pvideo && e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Tab') {
      var f = $$('button, a[href]:not([hidden]), video', player).filter(function (el) { return el.offsetParent !== null; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* -------------------------------------------------------
     RENDER — contact
     ------------------------------------------------------- */
  var C = SITE.contact || {};
  var rows = [];
  if (C.instagram && C.instagram.url) rows.push({ k: 'Instagram', v: C.instagram.handle, href: C.instagram.url, ext: true });
  if (C.linkedin && C.linkedin.url) rows.push({ k: 'LinkedIn', v: C.linkedin.handle, href: C.linkedin.url, ext: true });
  if (C.email) rows.push({ k: 'Email', v: C.email, href: 'mailto:' + C.email });
  if (C.whatsapp) rows.push({ k: 'WhatsApp', v: '+' + String(C.whatsapp).replace(/\D/g, ''), href: 'https://wa.me/' + String(C.whatsapp).replace(/\D/g, ''), ext: true });
  (C.other || []).forEach(function (o) { if (o && o.url) rows.push({ k: o.label, v: o.handle || o.url.replace(/^https?:\/\/(www\.)?/, ''), href: o.url, ext: true }); });
  $('#contact-list').innerHTML = rows.map(function (r) {
    return '<li class="contact__row reveal"><a href="' + esc(r.href) + '"' + (r.ext ? ' target="_blank" rel="noopener"' : '') + '>' +
      '<span class="contact__k">' + esc(r.k) + '</span><span class="contact__v">' + esc(r.v) + '</span>' +
      '<span class="contact__arrow" aria-hidden="true">↗</span>' + (r.ext ? '<span class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)"> (opens in a new tab)</span>' : '') + '</a></li>';
  }).join('');
  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  /* -------------------------------------------------------
     NAV — mobile menu, active link, hide on scroll
     ------------------------------------------------------- */
  var nav = $('.nav'), toggle = $('.nav__toggle'), menu = $('#menu');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.classList.toggle('is-locked', open);
    if (lenis) open ? lenis.stop() : lenis.start();
    if (open && motion) gsap.fromTo($$('a', menu), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, stagger: .06, ease: 'expo.out' });
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });

  // anchor links
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var t = $(id); if (!t) return;
    e.preventDefault();
    if (!menu.hidden) setMenu(false);
    if (lenis) lenis.scrollTo(t, { duration: 1.6, easing: function (x) { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); } });
    else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    if (history.replaceState) history.replaceState(null, '', id);
  });

  // simple nav state when motion is disabled
  if (!motion) {
    window.addEventListener('scroll', function () { nav.classList.toggle('is-scrolled', window.scrollY > 40); }, { passive: true });
    return;
  }

  /* =======================================================
     MOTION (GSAP + ScrollTrigger + Lenis)
     ======================================================= */
  if (window.Lenis) {
    lenis = new window.Lenis({ lerp: .095, smoothWheel: true });
    lenis.on('scroll', ST.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* --- text splitting --- */
  function splitChars(el) {
    var txt = el.textContent; el.textContent = '';
    txt.split('').forEach(function (ch) {
      var s = document.createElement('span'); s.className = 'char'; s.textContent = ch === ' ' ? ' ' : ch; el.appendChild(s);
    });
  }
  function splitWords(el, masked) {
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            var word = document.createElement('span'); word.className = 'word'; word.textContent = w;
            if (masked) {
              var m = document.createElement('span'); m.className = 'wm';
              m.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em';
              m.appendChild(word); frag.appendChild(m);
            } else frag.appendChild(word);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    el.setAttribute('aria-label', label);
    Array.prototype.slice.call(el.children).forEach(function (c) { c.setAttribute('aria-hidden', 'true'); });
  }

  var heroName = $('.hero__name');
  heroName.setAttribute('aria-label', 'Mohamed Elshafei');
  $$('.split-chars', heroName).forEach(function (el) { splitChars(el); el.setAttribute('aria-hidden', 'true'); });
  $$('.split-lines').forEach(function (el) { splitWords(el, true); });
  $$('.scrub-words').forEach(function (el) { splitWords(el, false); });

  /* --- custom cursor --- */
  if (fine) {
    doc.classList.add('has-cursor');
    var cur = $('.cursor');
    var qx = gsap.quickTo(cur, 'x', { duration: .45, ease: 'power3' });
    var qy = gsap.quickTo(cur, 'y', { duration: .45, ease: 'power3' });
    window.addEventListener('mousemove', function (e) { qx(e.clientX); qy(e.clientY); }, { passive: true });
    document.addEventListener('mouseover', function (e) {
      var t = e.target;
      cur.classList.toggle('is-play', !!t.closest('.card__media'));
      cur.classList.toggle('is-link', !t.closest('.card__media') && !!t.closest('a, button'));
      cur.classList.toggle('is-hidden', !!t.closest('.player'));
    });
    document.addEventListener('mouseleave', function () { cur.classList.add('is-hidden'); });
    document.addEventListener('mouseenter', function () { cur.classList.remove('is-hidden'); });
  }

  /* --- magnetic elements --- */
  if (fine) $$('.magnetic').forEach(function (el) {
    var inner = el.firstElementChild;
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * .28, y: y * .38, duration: .6, ease: 'power3.out' });
      if (inner) gsap.to(inner, { x: x * .14, y: y * .18, duration: .6, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', function () {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, .4)' });
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, .4)' });
    });
  });

  /* --- intro: loader → hero --- */
  var loader = $('.loader');
  var heroChars = $$('.hero__name .char');
  var archPath = $('.hero__arch-line path');

  gsap.set(heroChars, { yPercent: 115, rotate: 4 });
  gsap.set('.hero__headline .hl', { yPercent: 115 });
  gsap.set(['.hero__eyebrow', '.hero__sub', '.hero__actions', '.scroll-cue'], { opacity: 0, y: 24 });
  gsap.set('.hero__portrait', { clipPath: 'inset(100% 0% 0% 0%)' });
  gsap.set('.hero__portrait-inner', { scale: 1.35 });
  gsap.set(['.hero__tag', '.hero__badge'], { opacity: 0, scale: .85 });
  gsap.set(archPath, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set('.nav', { yPercent: -120 });
  gsap.set('.hero__bgword', { opacity: 0 });
  gsap.set('.hero__ar-text', { clipPath: 'inset(-20% 0% -20% 100%)' });
  gsap.set('.hero__ar-line', { scaleX: 0 });

  function heroIntro() {
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.hero__portrait', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' }, 0)
      .to('.hero__portrait-inner', { scale: 1, duration: 2.2, ease: 'expo.out' }, .3)
      .to('.hero__ar-text', { clipPath: 'inset(-20% 0% -20% 0%)', duration: 1.6, ease: 'expo.inOut' }, .35)
      .to('.hero__ar-line', { scaleX: 1, duration: 1.4, ease: 'expo.out' }, 1.1)
      .to(heroChars, { yPercent: 0, rotate: 0, duration: 1.4, stagger: .035 }, .45)
      .to(archPath, { strokeDashoffset: 0, duration: 2.2, ease: 'power3.inOut' }, .6)
      .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 1.2 }, .7)
      .to('.hero__headline .hl', { yPercent: 0, duration: 1.3, stagger: .1 }, .95)
      .to(['.hero__sub', '.hero__actions'], { opacity: 1, y: 0, duration: 1.2, stagger: .1 }, 1.15)
      .to(['.hero__tag', '.hero__badge'], { opacity: 1, scale: 1, duration: 1.2, stagger: .12, ease: 'back.out(1.6)' }, 1.3)
      .to('.nav', { yPercent: 0, duration: 1.2 }, 1.2)
      .to(['.scroll-cue', '.hero__bgword'], { opacity: 1, y: 0, duration: 1.4 }, 1.5);
    return tl;
  }

  (function runLoader() {
    if (lenis) lenis.stop();
    window.scrollTo(0, 0);
    var count = $('.loader__count'), bar = $('.loader__bar i');
    var o = { p: 0 };
    var img = $('.hero__portrait img');
    var ready = new Promise(function (res) {
      if (img.complete) res(); else { img.addEventListener('load', res); img.addEventListener('error', res); }
      setTimeout(res, 3500);
    });
    var tl = gsap.timeline();
    tl.fromTo('.loader__mark span', { y: 0, yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: .08, ease: 'expo.out' }, .1)
      .to('.loader__line', { opacity: 1, duration: .8 }, .4)
      .to('.loader__ar', { opacity: 1, duration: .9 }, .25)
      .to(o, { p: 86, duration: 1.3, ease: 'power2.inOut', onUpdate: function () { count.textContent = String(Math.round(o.p)).padStart(3, '0'); bar.style.transform = 'scaleX(' + o.p / 100 + ')'; } }, 0);
    Promise.all([ready, new Promise(function (r) { tl.eventCallback('onComplete', r); })]).then(function () {
      gsap.timeline()
        .to(o, { p: 100, duration: .45, ease: 'power2.out', onUpdate: function () { count.textContent = String(Math.round(o.p)).padStart(3, '0'); bar.style.transform = 'scaleX(' + o.p / 100 + ')'; } })
        .to('.loader__mark span', { yPercent: -110, duration: .7, stagger: .05, ease: 'expo.in' }, '+=.05')
        .to(['.loader__line', '.loader__foot', '.loader__ar'], { opacity: 0, duration: .4 }, '<')
        .to(loader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut', onComplete: function () { loader.classList.add('is-done'); if (lenis) lenis.start(); } }, '-=.2')
        .add(heroIntro(), '-=.75');
    });
  })();

  /* --- hero: mouse parallax + scroll-out --- */
  if (fine) {
    var hx = gsap.quickTo('.hero__portrait-inner', 'x', { duration: 1.2, ease: 'power3' });
    var hy = gsap.quickTo('.hero__portrait-inner', 'y', { duration: 1.2, ease: 'power3' });
    var bx = gsap.quickTo('.hero__badge', 'x', { duration: 1.4, ease: 'power3' });
    var by = gsap.quickTo('.hero__badge', 'y', { duration: 1.4, ease: 'power3' });
    var gx = gsap.quickTo('.hero__glow', 'x', { duration: 2, ease: 'power3' });
    $('.hero').addEventListener('mousemove', function (e) {
      var px = e.clientX / window.innerWidth - .5, py = e.clientY / window.innerHeight - .5;
      hx(px * -18); hy(py * -14); bx(px * 26); by(py * 20); gx(px * 80);
    });
  }
  gsap.to('.hero__visual', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.matchMedia().add('(min-width: 1025px)', function () {
    gsap.to('.hero__copy', { y: -80, opacity: .15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  });

  /* --- page progress & nav --- */
  gsap.to('.progress i', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });
  ST.create({
    start: 0, end: 'max',
    onUpdate: function (self) {
      var y = self.scroll();
      nav.classList.toggle('is-scrolled', y > 40);
      nav.classList.toggle('is-hidden', self.direction === 1 && y > window.innerHeight * .7 && menu.hidden);
    }
  });
  $$('[data-link]').forEach(function (a) {
    var sec = $(a.getAttribute('href')); if (!sec) return;
    ST.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: function (s) { a.classList.toggle('is-active', s.isActive); } });
  });

  /* --- body colour morph between dark & light sections --- */
  $$('[data-theme]').forEach(function (sec) {
    if (!sec.matches('section')) return;
    ST.create({ trigger: sec, start: 'top 55%', end: 'bottom 55%', onToggle: function (s) { if (s.isActive) { document.body.classList.toggle('is-light', sec.dataset.theme === 'light'); document.body.classList.toggle('is-medical', sec.dataset.theme === 'medical'); } } });
  });

  /* --- generic reveals --- */
  ST.batch('.reveal', {
    start: 'top 88%', once: true,
    onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 1.2, stagger: .08, ease: 'expo.out', overwrite: true }); }
  });
  $$('.split-lines').forEach(function (el) {
    gsap.from($$('.word', el), { yPercent: 115, duration: 1.3, stagger: .05, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
  $$('.scrub-words').forEach(function (el) {
    gsap.fromTo($$('.word', el), { opacity: .14 }, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: true } });
  });
  $$('.parallax').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.from('.about__img--sm', { y: 120, ease: 'none', scrollTrigger: { trigger: '.about__media', start: 'top bottom', end: 'bottom 30%', scrub: true } });

  /* --- specialties --- */
  $$('.spec__panel').forEach(function (p, i) {
    gsap.fromTo(p, { clipPath: 'inset(14% 8% 14% 8% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', ease: 'none', scrollTrigger: { trigger: p, start: 'top 95%', end: 'top 35%', scrub: true } });
    gsap.fromTo($('.spec__media img', p), { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from($$('.spec__idx, .spec__title, .spec__body li', p), { opacity: 0, y: 30, duration: 1.1, stagger: .05, ease: 'expo.out', delay: i * .1, scrollTrigger: { trigger: p, start: 'top 55%', once: true } });
  });

  /* --- marquee (scroll-velocity reactive) --- */
  var mt = $('.marquee__track');
  if (mt) {
    mt.innerHTML += mt.innerHTML;
    var loop = gsap.to(mt, { xPercent: -50, ease: 'none', duration: 38, repeat: -1 });
    var dir = 1;
    ST.create({
      trigger: '.marquee', start: 'top bottom', end: 'bottom top',
      onUpdate: function (self) {
        dir = self.direction;
        var v = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 400);
        gsap.to(loop, { timeScale: dir * v, duration: .3, overwrite: true, onComplete: function () { gsap.to(loop, { timeScale: dir, duration: 1.2 }); } });
      }
    });
  }

  /* --- video cards entrance (both galleries) --- */
  gsap.set('.card, .rx', { opacity: 0 });
  ST.batch('.card, .rx', {
    start: 'top 90%', once: true,
    onEnter: function (b) { gsap.fromTo(b, { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 1.3, stagger: .1, ease: 'expo.out', clearProps: 'transform' }); }
  });

  /* --- process: horizontal pin on desktop, stacked on smaller screens --- */
  var mm = gsap.matchMedia();
  var track = $('.process__track'), steps = $$('.step', track);
  var countEl = $('.process__count'), barEl = $('.process__bar i');
  function setStep(i) {
    steps.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
    countEl.textContent = pad(i + 1);
    barEl.style.transform = 'scaleX(' + (i + 1) / steps.length + ')';
  }
  mm.add('(min-width: 1025px)', function () {
    doc.classList.add('is-hscroll');
    ST.refresh();
    var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    var tw = gsap.to(track, {
      x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: {
        trigger: '.process', start: 'top top', end: function () { return '+=' + dist(); },
        pin: true, scrub: .8, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: function (s) { setStep(Math.min(steps.length - 1, Math.floor(s.progress * steps.length))); }
      }
    });
    gsap.from(steps, { opacity: 0, x: 120, duration: 1.2, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.process', start: 'top 70%', once: true } });
    setStep(0);
    return function () { doc.classList.remove('is-hscroll'); tw.kill(); };
  });
  mm.add('(max-width: 1024px)', function () {
    var trs = steps.map(function (s, i) {
      gsap.from(s, { opacity: 0, y: 50, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 88%', once: true } });
      return ST.create({ trigger: s, start: 'top 60%', end: 'bottom 60%', onToggle: function (st) { if (st.isActive) setStep(i); } });
    });
    return function () { trs.forEach(function (t) { t.kill(); }); };
  });

  /* --- why list: highlight the item in focus --- */
  $$('.why__item').forEach(function (it) {
    ST.create({ trigger: it, start: 'top 62%', end: 'bottom 62%', toggleClass: 'is-active' });
  });

  /* --- medical section --- */
  gsap.fromTo('.med__visual img', { yPercent: -8 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.med__visual', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.med__visual', { clipPath: 'inset(20% 0% 20% 0% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', ease: 'none', scrollTrigger: { trigger: '.med__visual', start: 'top 95%', end: 'top 45%', scrub: true } });
  gsap.from('.med__topics li', { opacity: 0, y: 16, duration: .9, stagger: .05, ease: 'expo.out', scrollTrigger: { trigger: '.med__topics', start: 'top 90%', once: true } });

  /* --- contact --- */
  gsap.fromTo('.contact__glow', { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'top 20%', scrub: true } });

  /* the pinned process section adds scroll distance — make sure it is measured
     before the triggers that sit below it, then recalculate */
  ST.sort();
  ST.refresh();

  /* refresh once fonts & images settle */
  window.addEventListener('load', function () { ST.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
})();
