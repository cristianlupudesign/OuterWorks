/* ============================================================
   Outerworks — enquiry forms ([data-lead-form]).

   No server is involved: on submit the form builds a message
   and opens WhatsApp to 07348 580359 with it ready to send.
   If WhatsApp can't open, the status line offers a pre-filled
   email to contact@outerworks.co.uk instead.

   Fields: name, mobile, postcode, job (what they need),
   optional rough size. Hidden: area, source_page.

   SECURITY: never put a messaging bot token in client-side JS.
   ============================================================ */

(function () {
  const WA_NUMBER = '447348580359';
  const EMAIL = 'contact@outerworks.co.uk';

  const forms = document.querySelectorAll('[data-lead-form]');
  if (!forms.length) return;

  function value(form, name) {
    const field = form.querySelector('[name="' + name + '"]');
    return field ? String(field.value || '').trim() : '';
  }

  function setStatus(form, html, type) {
    const el = form.querySelector('[data-form-status]');
    if (!el) return;
    el.innerHTML = html || '';
    el.classList.remove('is-error', 'is-success');
    if (type) el.classList.add('is-' + type);
  }

  function buildMessage(form) {
    const job = value(form, 'job');
    const lines = [
      'Hi Outerworks, I\'d like a price' + (job && job !== 'Something else' ? ' for ' + job.toLowerCase() : '') + '.',
      '',
      'Name: ' + value(form, 'name'),
      'Mobile: ' + value(form, 'mobile'),
      'Postcode: ' + value(form, 'postcode').toUpperCase()
    ];
    if (job) lines.push('Job: ' + job);
    const size = value(form, 'size');
    if (size) lines.push('Rough size: ' + size);
    const area = value(form, 'area');
    if (area) lines.push('Area page: ' + area);
    lines.push('', 'I can send photos here.');
    return lines.join('\n');
  }

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (value(form, '_gotcha')) return; // bot filled the honeypot

      const required = [
        ['name', 'your name'],
        ['mobile', 'a mobile number'],
        ['postcode', 'your postcode'],
        ['job', 'what you need']
      ];
      for (const [name, label] of required) {
        if (!value(form, name)) {
          setStatus(form, 'Please add ' + label + ' so we can price it.', 'error');
          const field = form.querySelector('[name="' + name + '"]');
          if (field) field.focus();
          return;
        }
      }

      const message = buildMessage(form);
      const waUrl = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message);
      const mailUrl = 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent('Price request — ' + (value(form, 'job') || 'outdoor works') + ' — ' + value(form, 'postcode').toUpperCase()) +
        '&body=' + encodeURIComponent(message);

      setStatus(form,
        'Opening WhatsApp — just press send. Didn\'t open? <a href="' + mailUrl + '">Email it instead</a> or call <a href="tel:07348580359">07348 580359</a>.',
        'success');

      window.location.href = waUrl;
    });
  });
})();
