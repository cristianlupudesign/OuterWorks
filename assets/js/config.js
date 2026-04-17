
window.OuterworksSiteConfig = {
  formspreeEndpoint: "https://formspree.io/f/your-form-id",

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
