# FlyCommerce — Home Page

Implementation of the FlyCommerce home page from Figma
([`LlTgTmIngQGaOHfB6co75I`, node `1597:32103`](https://www.figma.com/design/LlTgTmIngQGaOHfB6co75I/FlyCommerce-Website-Design?node-id=1597-32103)).

Static HTML/CSS/JS — no build step. Open `index.html`, or serve the folder:

```bash
npm start          # python3 -m http.server 8099
```

## Layout fidelity

The comp is 1920 × 17743 with a 1392 content column inside 264px gutters. The
build reproduces that at ≥1440px viewport width and measures 17702px tall
(0.2% off). Section origins land within ~36px of the comp throughout.

Design tokens in `assets/css/base.css` are lifted from the file's variable
collection rather than eyeballed:

| | |
|---|---|
| Headings | Sora Bold — 62/78, 52/62, 42/55, 36/43, 30/39 |
| Body | Lato Regular — 24/1.5, 20/30, 18/25, 16/21, 14/1.3 |
| Brand | `#155dfc` · Text 900/700/600 `#0f172a` / `#334155` / `#475569` |
| Surfaces | `#f8fafc` section · `#f1f5f9` panel · `#e9e9e9` hairline |
| Accents | Yellow `#facc15` · Green `#34d399` · Blue `#60a5fa` · Purple `#c4b5fd` |
| Elevation | `0 10px 50px rgba(0,0,0,.05)` · `0 84px 200px rgba(0,0,0,.08)` |
| Radii | 4 / 6 / 8 / 16 / 20 / 24 / full |

Fixed pixel tracks from the comp are expressed as percentages of the content
column (e.g. the capability accordion's `48.276% / 25.862% / 25.862%` resolves
to exactly 672/360/360 at 1392) so the proportions hold as the viewport
shrinks instead of overflowing.

## Product artwork

Every product screenshot in the comp is flattened raster art, and those bitmaps
were not reachable from the build environment. Each one is rebuilt in CSS and
inline SVG at the same box, radius and colour weighting — the storefront browser
mock, the phone, the theme thumbnails, the page-builder editor, and the payment,
shipping and analytics panels. Swap them for the exported assets when available;
the surrounding boxes already carry the comp's dimensions.

## Motion

GSAP + ScrollTrigger + Lenis, all vendored under `assets/vendor/` (no CDN at
runtime). Fonts are self-hosted in `assets/fonts/`.

- Lenis smooth scroll driven by the GSAP ticker, so ScrollTrigger never drifts
- Hero headline mask-up on load; per-section scroll reveals and list cascades
- Parallax on the hero panes, pointer tilt on hover
- Two logo/theme marquees on infinite timelines that slow on hover
- `75+` counts up when the themes band enters
- Hover/press interactions: nav underlines, button lift + arrow rotate, card
  lift, the capability accordion, FAQ disclosure, and the payment/shipping
  feature lists

Everything is gated behind `prefers-reduced-motion: reduce`, which also disables
Lenis and settles all reveals to their final state.

## Responsive

Verified with Chrome DevTools at 320 → 1920px: no horizontal overflow at any
width. Breakpoints at 1500 / 1240 / 1080 / 860 / 680 / 560 compress the column
structure before stacking it; the nav collapses to a drawer at 1080 and the
header CTA moves into that drawer at 680.

## Structure

```
index.html
assets/
  css/   base · components · mockups · sections · sections-2 · responsive · fonts
  js/    main.js
  fonts/ self-hosted Sora, Lato, Poppins, Inter, Lalezar (latin + latin-ext)
  vendor/ gsap.min.js · ScrollTrigger.min.js · lenis.min.js
```
