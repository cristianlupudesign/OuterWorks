
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
