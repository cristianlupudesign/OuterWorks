
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
    id: "spring-2026",
    text: "Spring bookings now open — site visits within 7 days across West London.",
    ctaLabel: "Book a slot",
    ctaHref: "contact/#quote-form"
  },

  // Coverage postcode prefixes (outward part). Matches will show a green "in area" state.
  coveragePrefixes: ["HA", "UB", "W", "NW", "TW", "WD"]
};
