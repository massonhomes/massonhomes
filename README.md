# Masson Homes — Website

Full static site for Vercel / GitHub. Italiana (headings, ≈ Kudryashev Display
Sans) + Inter (body, ≈ Aileron); navy/cream/taupe/gold; zero border-radius.

## Structure
index.html · how-we-work.html · pricing.html · where-we-work.html ·
roswell.html · alpharetta.html · milton.html · sandy-springs.html ·
guide.html · approach.html · sell.html · contact.html
assets/ (styles.css, logos, favicon)

## Deploy
Drag the folder into Vercel or push to massonhomes/massonhomes. No build step.

## Photography
Hero rotation, market plates, galleries, and lifestyle bands use real
photography hotlinked from Unsplash (Unsplash License — free for commercial use,
no attribution required). These are representative stand-ins; replace with
commissioned local imagery (Milton estate, Canton Street, horse country, Avalon,
Crabapple) per the shot list. To self-host: download each into assets/ and
change the src. The hero is a rotating slideshow — each .hero-slide holds one
photo and its data-caption; swap the <img> for a muted autoplay <video> if you
want motion. (Note: these images load in any normal browser; they could not be
previewed inside the build sandbox, which blocks the image host.)

## Equity calculator (home + pricing)
Interactive: sale-price and listing-commission sliders + a flat-fee tier toggle,
output framed as equity *kept* (not "savings"). Listing-side only, with a
negotiable/not-a-quote disclaimer. NEEDS JEFF'S REVIEW before publish — it is
cost-comparison advertising.

## Integrations
Forms → Formspree mwvwgqol (form_source/form_type hidden fields). Etsy guide link
live. Calendly inline widget wired on contact.html with a PLACEHOLDER data-url —
replace with the real Masson Homes Calendly link.

## Pending before publish
- Jeff Bergstrom advertising review (esp. the calculator)
- Phone reconciliation (firm 404.933.4017 shown; confirm Rachel's direct line)
- Real Calendly URL on contact.html
- FMLS listings display rules (active-listing modules are honest empty states)
- Replace Unsplash stand-ins with commissioned local photography

## Compliance built in
"Pricing analysis" not "appraisal" · "Licensed agent" not "Realtor" · equity
framing · no exclamation points · no fabricated stats/reviews · Wynd Realty at
equal/greater prominence + full disclosure + Equal Housing Opportunity on every page.
