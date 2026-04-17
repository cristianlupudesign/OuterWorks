
(function () {
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const depth = Number(body.dataset.depth || 0);
  const basePrefix = '../'.repeat(depth);

  // Header scroll state
  const header = document.querySelector('[data-site-header]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }

  if (header) {
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  }

  function closeMenu() {
    if (!header) return;
    header.classList.remove('menu-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && header) {
    navToggle.addEventListener('click', function () {
      const open = header.classList.toggle('menu-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (event) {
      if (!header.classList.contains('menu-open')) return;
      const inside = event.target.closest('.mobile-panel, [data-nav-toggle], .nav-brand');
      if (!inside) closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 880) closeMenu();
    });
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if (!reduceMotion && reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(item => observer.observe(item));
  } else {
    reveals.forEach(item => item.classList.add('is-visible'));
  }

  // Parallax
  const heroParallax = document.querySelectorAll('[data-parallax="hero"]');
  const viewportParallax = document.querySelectorAll('[data-parallax="viewport"]');

  function updateParallax() {
    if (reduceMotion) return;
    const sy = window.scrollY;
    const vh = window.innerHeight;

    heroParallax.forEach(el => {
      const speed = Number(el.dataset.speed || 0.35);
      el.style.transform = `translate3d(0, ${sy * speed}px, 0)`;
    });

    viewportParallax.forEach(el => {
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > vh + 120) return;
      const range = Number(el.dataset.range || 120);
      const direction = Number(el.dataset.direction || 1);
      const progress = (vh - rect.top) / (vh + rect.height);
      const offset = (progress - 0.5) * range * direction;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  }

  if (!reduceMotion && (heroParallax.length || viewportParallax.length)) {
    let ticking = false;
    const requestTick = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
    };
    updateParallax();
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
  }

  // Current year
  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Prefill service select from query string
  const params = new URLSearchParams(window.location.search);
  const selectedService = params.get('service');
  if (selectedService) {
    document.querySelectorAll('select[name="service"]').forEach(select => {
      const match = Array.from(select.options).find(opt => opt.value === selectedService);
      if (match) select.value = selectedService;
    });
  }

  // Formspree handling
  const config = window.OuterworksSiteConfig || {};
  const endpoint = (config.formspreeEndpoint || '').trim();
  const forms = document.querySelectorAll('[data-quote-form]');

  function setStatus(form, message, type) {
    const status = form.querySelector('[data-form-status]');
    if (!status) return;
    status.textContent = message || '';
    status.classList.remove('is-error', 'is-success');
    if (type === 'error') status.classList.add('is-error');
    if (type === 'success') status.classList.add('is-success');
  }

  // Gallery filter
  const galleryFilter = document.querySelector('[data-gallery-filter]');
  const galleryGrid = document.querySelector('[data-gallery-grid]');
  if (galleryFilter && galleryGrid) {
    const items = galleryGrid.querySelectorAll('.gallery-item');
    galleryFilter.addEventListener('click', function (event) {
      const btn = event.target.closest('button[data-filter]');
      if (!btn) return;
      const filter = btn.dataset.filter;
      galleryFilter.querySelectorAll('button').forEach(b => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      items.forEach(item => {
        const cat = item.dataset.cat || '';
        const show = filter === 'all' || cat === filter;
        item.classList.toggle('is-hidden', !show);
      });
    });
  }

  // Floating quick-contact FAB (WhatsApp + phone) — injected once per page
  if (!document.querySelector('[data-quick-contact]')) {
    const fab = document.createElement('div');
    fab.className = 'quick-contact';
    fab.setAttribute('data-quick-contact', '');
    fab.innerHTML = `
      <a class="quick-contact-btn quick-contact-wa" href="https://wa.me/447348580359" target="_blank" rel="noopener" aria-label="Message Outerworks on WhatsApp">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 12a8.5 8.5 0 0 1-12.7 7.4L3.5 20.5l1.1-4.3A8.5 8.5 0 1 1 20.5 12Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 9.5c.2 1.2.7 2.3 1.5 3.2.8.9 1.9 1.5 3.1 1.8.4.1.8 0 1.1-.2l.7-.5c.3-.2.7-.2 1 0l1.2.7c.3.2.4.5.4.8 0 .8-.7 1.5-1.7 1.5-3.7 0-6.7-3-6.7-6.7 0-1 .7-1.7 1.5-1.7.3 0 .6.2.8.4l.7 1.2c.2.3.2.7 0 1l-.5.7c-.2.3-.3.7-.1 1Z" fill="currentColor"/></svg>
      </a>
      <a class="quick-contact-btn quick-contact-call" href="tel:07348580359" aria-label="Call Outerworks on 07348 580359">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7.5 4h3l1.1 4.4-1.9 1.9a14.6 14.6 0 0 0 4 4l1.9-1.9L20 13.5v3a2 2 0 0 1-2.2 2C10.7 18 6 13.3 5.5 6.2A2 2 0 0 1 7.5 4Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
      <a class="quick-contact-btn quick-contact-email" href="mailto:contact@outerworks.co.uk" aria-label="Email Outerworks at contact@outerworks.co.uk">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="m5 8 7 5 7-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
    `;
    document.body.appendChild(fab);
  }

  // Dismissible announcement bar
  const ann = config.announcement;
  if (ann && ann.text && !document.querySelector('[data-announcement]')) {
    const key = 'ow-announce-' + (ann.id || 'default');
    if (localStorage.getItem(key) !== 'dismissed') {
      const bar = document.createElement('div');
      bar.className = 'announcement';
      bar.setAttribute('data-announcement', '');
      const cta = ann.ctaHref
        ? `<a class="announcement-cta" href="${basePrefix}${ann.ctaHref.replace(/^\//, '')}">${ann.ctaLabel || 'Read more'}</a>`
        : '';
      bar.innerHTML = `
        <div class="container announcement-inner">
          <span class="announcement-text">${ann.text}</span>
          ${cta}
          <button class="announcement-close" type="button" aria-label="Dismiss announcement">&times;</button>
        </div>
      `;
      document.body.insertBefore(bar, document.body.firstChild);
      document.documentElement.classList.add('has-announcement');
      bar.querySelector('.announcement-close').addEventListener('click', () => {
        localStorage.setItem(key, 'dismissed');
        bar.remove();
        document.documentElement.classList.remove('has-announcement');
      });
    }
  }

  // Postcode checker — shows a friendly result based on HA/UB/W/NW/TW/WD prefixes
  const postcodeForm = document.querySelector('[data-postcode-check]');
  if (postcodeForm) {
    const input = postcodeForm.querySelector('input[name="postcode"]');
    // Result element sits next to the form, not inside it
    const result = document.querySelector('[data-postcode-result]');
    const prefixes = (config.coveragePrefixes || []).map(p => p.toUpperCase());
    postcodeForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!input || !result) return;
      const raw = (input.value || '').trim().toUpperCase().replace(/\s+/g, ' ');
      if (!raw) return;
      const outward = raw.split(' ')[0].replace(/[0-9]/g, '');
      const match = prefixes.includes(outward);
      result.className = 'postcode-result ' + (match ? 'is-match' : 'is-wide');
      result.innerHTML = match
        ? `<strong>${raw} is in our usual patch.</strong> Expect a reply the same working day.`
        : `<strong>${raw} is outside the usual patch.</strong> Larger jobs still travel — send a message and we'll confirm.`;
    });
  }

  forms.forEach(form => {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      if (!endpoint || endpoint.includes('your-form-id')) {
        setStatus(form, 'Add your Formspree endpoint in assets/js/config.js before going live.', 'error');
        return;
      }

      const submit = form.querySelector('button[type="submit"]');
      const originalLabel = submit ? submit.textContent : '';
      const formData = new FormData(form);
      formData.append('_subject', 'New enquiry from the Outerworks website');
      formData.append('page_url', window.location.href);

      try {
        if (submit) {
          submit.disabled = true;
          submit.textContent = 'Sending…';
        }
        setStatus(form, 'Sending your message…');

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        form.reset();
        setStatus(form, 'Thanks — your message has been sent.', 'success');
        window.setTimeout(() => {
          window.location.href = `${basePrefix}thank-you/`;
        }, 300);
      } catch (error) {
        setStatus(form, 'That did not go through. Please try again or contact us directly by phone or WhatsApp.', 'error');
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.textContent = originalLabel;
        }
      }
    });
  });
})();
