/* ============================================================
   Outerworks — lead capture for "The 10-Year Fence" offer page
   and area pages. Handles the [data-lead-form] fixed-price forms.

   Fields: name, mobile, postcode, approx fence length (m),
   optional photo upload.

   On submit we:
     1) validate the required fields,
     2) store the lead locally as a fallback record, and
     3) fire a notification to an email/webhook endpoint.

   ------------------------------------------------------------
   SECURITY NOTE — DO NOT re-add Telegram here.
   The previous Outerworks Telegram bot token was COMPROMISED.
   Do NOT wire a Telegram bot into this file. Once a new bot is
   provisioned, prefer a server-side relay (never ship a bot
   token in client-side JS). Until then this uses an
   email/webhook placeholder only. See the TODO below.
   ------------------------------------------------------------
   ============================================================ */

(function () {
  const cfg = (window.OuterworksSiteConfig || {});
  // TODO(owner): set the real lead endpoint before going live.
  //   Recommended: a serverless function / form backend (e.g. Formspree,
  //   a Cloudflare Worker, or your own webhook) that emails the team.
  //   Example config in assets/js/config.js:
  //       leadEndpoint: "https://formspree.io/f/your-lead-form-id"
  //   Notification target (for the endpoint to route to):
  //       leadNotifyEmail: "leads@outerworks.co.uk"   // TODO real inbox
  //   DO NOT put a Telegram bot token here (see security note above).
  const endpoint = ((cfg.leadEndpoint || '') + '').trim();
  const notifyEmail = ((cfg.leadNotifyEmail || '') + '').trim();

  const forms = document.querySelectorAll('[data-lead-form]');
  if (!forms.length) return;

  function setStatus(form, message, type) {
    const el = form.querySelector('[data-form-status]');
    if (!el) return;
    el.textContent = message || '';
    el.classList.remove('is-error', 'is-success');
    if (type) el.classList.add('is-' + type);
  }

  function storeLeadLocally(record) {
    // Fallback record so a lead is never lost if the network call fails.
    try {
      const key = 'ow-leads';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(record);
      localStorage.setItem(key, JSON.stringify(existing.slice(-50)));
    } catch (e) { /* storage may be unavailable; ignore */ }
  }

  function validate(form) {
    const required = ['name', 'mobile', 'postcode', 'fence_length'];
    for (const name of required) {
      const field = form.querySelector('[name="' + name + '"]');
      if (!field || !String(field.value).trim()) {
        return { ok: false, field };
      }
    }
    return { ok: true };
  }

  forms.forEach(function (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      const check = validate(form);
      if (!check.ok) {
        setStatus(form, 'Please add your name, mobile, postcode and rough fence length so we can price it.', 'error');
        if (check.field) check.field.focus();
        return;
      }

      const submit = form.querySelector('button[type="submit"]');
      const originalLabel = submit ? submit.textContent : '';
      const data = new FormData(form);
      data.append('_subject', 'New 10-Year Fence enquiry (fixed price request)');
      data.append('source_page', document.title);
      data.append('page_url', window.location.href);
      if (notifyEmail) data.append('_replyto_team', notifyEmail);

      // Local fallback record (photo intentionally not stored locally)
      storeLeadLocally({
        name: data.get('name'),
        mobile: data.get('mobile'),
        postcode: data.get('postcode'),
        fence_length: data.get('fence_length'),
        page: window.location.pathname
      });

      // No endpoint configured yet — make the state obvious in dev.
      if (!endpoint || endpoint.includes('your-lead-form-id')) {
        setStatus(form, 'Thanks — your details are saved. (Set leadEndpoint in assets/js/config.js to send them to the team.)', 'success');
        form.reset();
        return;
      }

      try {
        if (submit) { submit.disabled = true; submit.textContent = 'Sending…'; }
        setStatus(form, 'Sending your details…');

        // TODO(owner): the endpoint should notify the team (email/webhook).
        // Do NOT notify via a client-side Telegram bot — token was compromised.
        const response = await fetch(endpoint, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Request failed');

        form.reset();
        setStatus(form, 'Thanks — the team will confirm your fixed price band and start date shortly.', 'success');
        const prefix = '../'.repeat(Number(document.body.dataset.depth || 0));
        window.setTimeout(function () { window.location.href = prefix + 'thank-you/'; }, 400);
      } catch (err) {
        setStatus(form, 'That did not go through. Call or WhatsApp us on 07348 580359 and we will pick it up.', 'error');
      } finally {
        if (submit) { submit.disabled = false; submit.textContent = originalLabel; }
      }
    });
  });
})();
