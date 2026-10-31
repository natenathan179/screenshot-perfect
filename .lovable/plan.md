# PeptideLabs — Build Plan

Inquiry-based product catalogue for PeptideLabs ("Advancing Peptide Science"), matching the uploaded homepage mockup. No online payment: cart "checkout" and product "Request Quote" both open an inquiry form sent via FormSubmit to the owner's email.

## Design
- Colours: Navy Blue, Ice Blue, White, Charcoal Grey. Clean clinical/lab style like the mockup.
- Top info bar, logo + search + account/wishlist/cart header, navy category nav bar, rich footer with newsletter.
- Fully responsive (mobile menu drawer, stacked grids).
- Generated imagery: hero vial, 4 category banners, article covers.

## Public pages (each with unique SEO title/description and long, informative content)
- Home — hero, 4 category cards, Featured, New Arrivals, Best Sellers, Quality & Documentation, About teaser, Latest articles, support CTA.
- Shop All — search, category filter, sort, price range.
- Category pages — Peptides, Steroids, Biotechnology, Research Products (intro copy + filtered grid).
- Product detail — image gallery, specs (purity, size, form, storage), description, COA note, related products, Add to Cart, Request Quote.
- New Arrivals, Best Sellers.
- Cart — edit quantities; "Checkout" opens inquiry modal listing every cart item.
- Blog list + article detail (6+ long educational SEO articles, seeded).
- Reviews — 35 reviews with randomuser.me photos, star summary.
- About, Contact (form), FAQ, Shipping, Returns, Track Order (form inquiry), Privacy, Terms, Regulatory Disclosures.
- Research-use / jurisdiction disclaimer shown on products and footer.

## Inquiry modal
- Shows selected product(s): image, name, size, price, quantity.
- Fields: name, email, phone, country, organisation, quantity, message; validated.
- Submitted to FormSubmit with all product details; success state + cart cleared after checkout.
- Contact, Track Order and newsletter forms also go through FormSubmit.

## Admin (/admin)
- Login page only (accounts created by you in the Cloud auth panel; any signed-in user is admin).
- Dashboard with counts.
- Products CRUD: name, slug, category, price, size, purity, badges (featured / bestseller / new), stock status, descriptions, specs, multiple image uploads (file upload, not links).
- Blog posts CRUD with cover upload.
- Reviews CRUD.

## Data (Lovable Cloud)
- Tables: products, product_images, posts, reviews. Public can read; only signed-in users can write.
- Storage bucket for product and blog images.
- Seed: ~16 products across categories, 6+ articles, 35 reviews.
- Cart and wishlist kept in the visitor's browser.

## Technical notes
- TanStack routes per page, loaders + React Query, head() per route, sitemap/robots.
- Email/password auth enabled, no signup UI; `_authenticated` admin layout.
- FormSubmit via AJAX endpoint `https://formsubmit.co/ajax/<email>`.

## Needed from you
- The email address FormSubmit should deliver to (I'll use a placeholder until provided). FormSubmit sends a one-time activation email on the first submission.
