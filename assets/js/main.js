/* Embolization Inc — site behaviour
   Plain JS, no dependencies. */

/* ---------------------------------------------------------------
   CONTACT FORM ENDPOINT — the one line to change.

   Default is FormSubmit (formsubmit.co), which needs no account:
   the FIRST submission triggers a one-time confirmation email to
   inquire@embolizationinc.com. Click the link in it once and the
   form is live from then on.

   To move to another provider (Formspree, HubSpot, a serverless
   function), replace this URL. Nothing else needs to change.
--------------------------------------------------------------- */
var FORM_ENDPOINT = 'https://formsubmit.co/ajax/inquire@embolizationinc.com';
var FALLBACK_EMAIL = 'inquire@embolizationinc.com';

(function () {
  'use strict';

  /* ---------- sticky header ---------- */
  var hdr = document.getElementById('hdr');
  var onScroll = function () {
    hdr.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  var toggle = document.getElementById('navtoggle');
  var nav = document.getElementById('nav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- reveal on scroll ---------- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealables = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- stat counters ---------- */
  var stats = document.querySelectorAll('[data-count]');
  var runCount = function (el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.dec || '0', 10);
    var suffix = el.dataset.suffix || '';
    if (reduced) { el.textContent = target.toFixed(dec) + suffix; return; }
    var start = performance.now(), dur = 1100;
    var tick = function (now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(dec) + suffix;
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCount(en.target); so.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    stats.forEach(function (el) { so.observe(el); });
  } else {
    stats.forEach(runCount);
  }

  /* ---------- footer year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ---------- contact form ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  var btn = document.getElementById('submitBtn');
  if (!form) return;

  form.setAttribute('action', FORM_ENDPOINT);

  var showError = function (msg) {
    status.className = 'formstatus err';
    status.innerHTML = msg;
  };

  var mailtoFallback = function (data) {
    var body =
      'Name: ' + (data.first_name || '') + ' ' + (data.last_name || '') + '\n' +
      'Email: ' + (data.email || '') + '\n' +
      'Institution: ' + (data.institution || '') + '\n' +
      'Interested in: ' + (data.interest || '') + '\n\n' +
      (data.message || '');
    return 'mailto:' + FALLBACK_EMAIL +
      '?subject=' + encodeURIComponent('Website enquiry — embolizationinc.com') +
      '&body=' + encodeURIComponent(body);
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'formstatus';
    status.textContent = '';

    if (!form.checkValidity()) { form.reportValidity(); return; }

    var fd = new FormData(form);
    if (fd.get('_honey')) return;          // bot trap
    var data = Object.fromEntries(fd.entries());

    btn.disabled = true;
    var original = btn.textContent;
    btn.textContent = 'Sending…';

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.ok ? r.json().catch(function () { return {}; }) : Promise.reject(r.status); })
      .then(function () {
        form.innerHTML =
          '<div style="text-align:center;padding:34px 10px">' +
          '<div style="width:56px;height:56px;margin:0 auto 20px;border-radius:50%;' +
          'background:rgba(0,229,160,.13);border:1px solid rgba(0,229,160,.4);display:grid;place-items:center">' +
          '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" stroke-width="2.6" ' +
          'stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>' +
          '<h3 style="font-size:21px;margin-bottom:10px">Request received</h3>' +
          '<p style="color:rgba(234,242,248,.72);margin:0">Thank you. Our team will be in touch shortly at ' +
          '<strong>' + String(data.email || '').replace(/[<>&"]/g, '') + '</strong>.</p></div>';
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = original;
        showError(
          'We could not send that automatically. Please email us directly at ' +
          '<a href="' + mailtoFallback(data) + '">' + FALLBACK_EMAIL + '</a> — ' +
          'your message is pre-filled in that link.'
        );
      });
  });
})();
