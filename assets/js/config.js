
window.OuterworksSiteConfig = {
  // Enquiry delivery. FormSubmit sends straight to the inbox below — the very
  // first enquiry triggers a one-time activation email from formsubmit.co:
  // click the link in it once and every enquiry after that lands normally.
  // If you later move to Formspree, paste your https://formspree.io/f/... URL here instead.
  formspreeEndpoint: "https://formsubmit.co/ajax/contact@outerworks.co.uk",

  // If the form service is ever down, enquiries fall back to a pre-filled
  // WhatsApp message to this number so no lead is lost.
  whatsappNumber: "447348580359",

  // Top announcement bar — set text to empty string to hide.
  // Changing the `id` forces the bar to reappear even for users who dismissed a previous message.
  announcement: {
    id: "summer-2026",
    text: "Summer slots are filling — free site visits across West London this week.",
    ctaLabel: "Book a free visit",
    ctaHref: "contact/#quote-form"
  },

  // Coverage postcode prefixes (outward part). Matches will show a green "in area" state.
  coveragePrefixes: ["HA", "UB", "W", "NW", "TW", "WD"]
};
