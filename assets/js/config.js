
window.OuterworksSiteConfig = {
  formspreeEndpoint: "https://formspree.io/f/your-form-id",

  // TODO(owner): lead endpoint for the "10-Year Fence" fixed-price forms.
  // Point this at a form backend / webhook that emails the team.
  // SECURITY: do NOT wire the Telegram bot here — the old token was
  // compromised. Provision a new bot server-side later; never ship a
  // bot token in client-side JS.
  leadEndpoint: "https://formspree.io/f/your-lead-form-id",
  leadNotifyEmail: "leads@outerworks.co.uk", // TODO(owner): real team inbox

  // Top announcement bar — set text to empty string to hide.
  // Changing the `id` forces the bar to reappear even for users who dismissed a previous message.
  announcement: {
    id: "autumn-2026",
    text: "Autumn storm season — free surveys across West London. Book before the winter winds.",
    ctaLabel: "Get my fixed price",
    ctaHref: "ten-year-fence/#get-my-fixed-price"
  },

  // Coverage postcode prefixes (outward part). Matches will show a green "in area" state.
  coveragePrefixes: ["HA", "UB", "W", "NW", "TW", "WD"]
};
