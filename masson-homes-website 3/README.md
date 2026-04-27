# Masson Homes — Website

Flat-fee real estate listing service for metro Atlanta. Built as a static site for deployment on Vercel.

## Stack

- Static HTML/CSS/JS — no build step, no framework, no dependencies
- Google Fonts (Cormorant Garamond + Raleway)
- Formspree for form submissions
- Vercel for hosting

## Project Structure

```
masson-homes-website/
├── index.html              # Main landing page
├── builders.html           # Builders & investors page
├── 404.html                # Custom 404 page
├── assets/
│   ├── logo-light.svg      # White text (for dark backgrounds / hero)
│   ├── logo-dark.svg       # Dark text (for scrolled nav / light areas)
│   ├── hero-video.mp4      # Hero background video
│   ├── hero-poster.jpg     # Poster frame (shows before video loads)
│   ├── og-image.jpg        # Social share preview (1200×630)
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   ├── icon-192.png
│   └── icon-512.png
├── css/styles.css          # All styles
├── js/scripts.js           # Nav, calculator, forms, focus trap, scroll reveal
├── favicon.ico             # Multi-size ICO
├── robots.txt
├── sitemap.xml
├── site.webmanifest        # PWA-style installation manifest
├── vercel.json             # Caching, clean URLs, security headers
├── .gitignore
└── README.md
```

## Deploy to Vercel

1. **Push this folder to a new GitHub repository:**
   ```bash
   cd masson-homes-website
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/masson-homes-website.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - [vercel.com/new](https://vercel.com/new) → Import the GitHub repo
   - Framework Preset: **Other**
   - Build Command & Output Directory: *leave blank*
   - Click Deploy

3. **Custom domain:** Vercel → Project → Settings → Domains → add `massonhomes.com` + `www.massonhomes.com`, update DNS per Vercel's instructions.

Any `git push` to `main` auto-deploys. Non-main branches get preview URLs automatically.

---

## Forms — Formspree Setup

**All four forms post to the same endpoint: `https://formspree.io/f/mwvwgqol`**

| Form | Location | Purpose | `form_type` |
|---|---|---|---|
| Quick callback | index.html → top of contact section | 2-field (name + phone) | `quick-call` |
| Main consultation | index.html → below the divider | Full intake form | *(none)* |
| Seller's Guide | index.html → guide section | Email capture for PDF | `seller-guide` |
| Builder scope call | builders.html → bottom | Volume inquiries | `builder-investor` |

**You don't need additional Formspree endpoints.** Each submission has a hidden `form_type` field and a distinct `_subject` line:

- *"Quick Callback Request — Masson Homes"*
- *"New Consultation Request — Masson Homes"*
- *"Guide Download Request — Masson Homes"*
- *"Builder/Investor Inquiry — Masson Homes"*

Filter by subject or form_type in Formspree's dashboard or your email client.

### Optional: separate endpoints per form

Create additional free-tier forms at [formspree.io/forms](https://formspree.io/forms) and replace the `action` URLs (search for `mwvwgqol` in index.html and builders.html).

### Seller's Guide PDF auto-response

1. Upload PDF somewhere public (Google Drive share, Dropbox, or `/assets/` here)
2. Formspree → your form → Settings → Autoresponses → Enable
3. Write the email template with the download link (or attach the PDF)
4. Filter: trigger only when `form_type=seller-guide`

### Form error fallback

If Formspree is unreachable, buttons show "Try again — or email hello@massonhomes.com" / "Connection error — or email us". **Set up `hello@massonhomes.com`** (or update the JS copy) so the fallback points somewhere real.

---

## Capacity Counter

Final CTA section shows:

> **4** openings · April 2026

Hardcoded in index.html. Edit `.capacity-count` monthly:

```html
<div class="capacity-count"><strong>4</strong>openings · April 2026</div>
```

**Update this every month.** Stale dates damage trust.

---

## Calculator — Business Rules

Savings calculator tier thresholds (in js/scripts.js → `feeInfo`):

| Home Value | Flat Fee |
|---|---|
| <$500,000 | $5,500 |
| $500,000 – $799,999 | $8,000 |
| $800,000 – $1,499,999 | $11,000 |
| $1,500,000+ | $13,500+ (custom consultation note shown) |

Homes below $100K don't trigger results. Change thresholds in both `js/scripts.js` AND the tier pricing in `index.html`.

---

## Accessibility

- WCAG AA contrast on all text (body `#4A4744` on warm white)
- Gold buttons use charcoal text (AAA contrast)
- Skip-to-content link, focus-visible outlines (gold 2px)
- `aria-live` on calculator announces full context
- Mobile menu: focus trap, Escape-to-close, click-outside-to-close
- Semantic HTML throughout
- Every form field has visible or sr-only label
- Hero video has `aria-hidden` + poster fallback

---

## SEO & Meta

- Meta description, OpenGraph, Twitter Card on both pages
- OG image (1200×630) for social share previews
- Clean URLs via `vercel.json` (`/builders` not `/builders.html`)
- `robots.txt` + `sitemap.xml`
- Theme color `#2C2C2C` for mobile browser chrome

For pre-launch SEO (10 blog posts per marketing plan), create `/blog/` with individual HTML files and link from footer.

---

## Brand

**Logos** (`/assets/`):
- `logo-light.svg` — white text for dark backgrounds
- `logo-dark.svg` — dark text for light backgrounds

Both are the co-branded Wynd Realty · Masson Homes · Flat Fee Real Estate lockup, GREC-compliant.

**Colors** (CSS variables in styles.css):
- `--charcoal: #2C2C2C`
- `--gold: #C9A96E` (decorative only)
- `--gold-dark: #A8864B` (AA-compliant text accent)
- `--warm-white: #F5F1EC`
- `--body-text: #4A4744` (AA-compliant body)

**Typography:**
- Headlines: Cormorant Garamond (serif)
- Body/UI: Raleway (sans)

---

## Local Development

```bash
python3 -m http.server 3000   # or: npx serve .   or: php -S localhost:3000
```

Visit `http://localhost:3000`.

---

## Maintenance

**Monthly:** update capacity counter

**Quarterly:** refresh market data (Atlanta Market Snapshot section) from Redfin/GAMLS; update Seller's Guide PDF

**As needed:** swap hero video, update founder bios, adjust tier pricing (Launch → Standard → Established), add testimonials after first closings

---

## Known Gaps / Deferred

- **No testimonials** — pre-launch. Add a section between tiers and cash-offer once you have first closings.
- **SVG logos are 41KB each** — could be optimized with SVGO to ~8KB.
- **No analytics** — add Plausible/Fathom/GA4 before launch if you want conversion tracking.
- **No A/B testing** — Vercel Edge Config + feature flags, or manual git-branch rotation.
- **No rate limiting beyond honeypot** — consider reCAPTCHA v3 or Formspree's built-in spam filter if bot traffic becomes a problem.

---

## License

© 2026 Masson Homes LLC. All rights reserved. Masson Homes LLC operates as a DBA under Wynd Realty (License H-55981, Broker Code WYND01).
