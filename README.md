# Outerworks static website

GitHub-ready multipage site for Outerworks with shared CSS/JS, responsive navigation, service pages, stock photography, and a Formspree-ready enquiry flow.

## Included pages

- Home
- Services hub
- Individual service pages:
  - Fencing
  - Decking
  - Pergolas
  - Paving
  - Sheds
  - Grass Cutting
  - Parcel Boxes
  - Gates
  - Sleeper Planters
  - Shed Bases
  - Garden Clearances
- Areas We Cover
- About
- Contact
- Privacy
- Terms
- Cookies
- Thank You
- 404 page

## Before publishing

### 1) Connect Formspree
Edit this file:

`assets/js/config.js`

Replace:

`https://formspree.io/f/your-form-id`

with your real Formspree endpoint.

All quote forms use that one config value.

### 2) Review legal text
Privacy, Terms and Cookies pages are solid starter pages, but they should still be reviewed against your exact live setup.

### 3) Add real testimonials later
No testimonials were fabricated in this build. A reviews section can be added once you have the exact wording you want to publish.

## GitHub Pages deployment

1. Create a GitHub repository
2. Upload the contents of this folder to the repository root
3. In GitHub, open **Settings > Pages**
4. Set the source to your main branch and root folder
5. Save and wait for GitHub Pages to publish

All links are relative, so the site works both on:
- a GitHub Pages project URL
- a custom domain later

## Contact details wired into the site

- Phone: 07348 580359
- Email: contact@outerworks.co.uk
- WhatsApp: 07348 580359
- Location: West London
- Hours: 08:00–17:00

## Notes

- Logo assets were built from the supplied Outerworks logo
- Photography uses stock Unsplash image URLs
- The site is mobile-first and includes:
  - transparent nav that solidifies on scroll
  - reveal-on-scroll animation
  - parallax sections
  - hover zoom service cards
  - service subpages
