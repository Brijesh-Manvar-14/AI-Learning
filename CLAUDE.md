# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Shopify Theme** based on Shopify's Dawn theme (v15.2.0), customized for the **Waymakers** brand. It uses Liquid templates, CSS, and JavaScript — no Node.js build pipeline.

## Development Commands

Theme development requires the [Shopify CLI](https://shopify.dev/docs/themes/tools/cli):

```bash
# Authenticate and connect to a store
shopify theme dev --store=<store-name>.myshopify.com

# Push theme to store
shopify theme push

# Pull latest theme settings from store
shopify theme pull

# Preview locally (starts dev server with hot reload)
shopify theme dev
```

## Architecture

### Custom vs. Base Code

All Waymakers-specific customizations are prefixed with `waymakers-`:

- `sections/waymakers-*.liquid` — custom brand sections (header, hero, featured-products, reviews, footer, why, press, ribbons)
- `assets/waymakers-home.css` — primary brand stylesheet
- `assets/waymakers-home.js` — brand-specific JavaScript
- `sections/custom-product.liquid` + `assets/custom-product.js` — custom product display with expandable descriptions and SVG star ratings

Everything else is inherited from the Dawn base theme and should be modified carefully to avoid breaking standard Shopify functionality.

### Key Files

| File | Purpose |
|---|---|
| `layout/theme.liquid` | Root HTML wrapper; loads fonts, CSS, scripts, and color scheme variables |
| `config/settings_schema.json` | Defines all theme settings exposed in Shopify admin |
| `config/settings_data.json` | Auto-generated theme settings (do not manually edit) |
| `templates/*.json` | Page-level section assignments (index, product, collection, etc.) |

### Component Model

- **Sections** (`sections/`) — full-page blocks configurable in the Shopify theme editor
- **Snippets** (`snippets/`) — reusable partials rendered via `{% render 'snippet-name' %}`
- **Assets** (`assets/`) — CSS and JS loaded explicitly in `theme.liquid` or via section `{% schema %}` blocks

### Styling Conventions

- CSS variables are used for theming (color schemes, spacing)
- Responsive breakpoints: 1024px, 768px, 699px, 425px, 320px
- Custom Inter font loaded via `@font-face` and CDN in `theme.liquid`

### JavaScript Patterns

- Dawn uses native Web Components (custom elements) for interactive UI (modals, drawers, disclosures)
- Waymakers custom code uses jQuery for DOM manipulation (e.g., "Read More/Less" toggles in `custom-product.js`)
- Global utilities are in `assets/global.js` (`SectionId`, `HTMLUpdateUtility`, `getFocusableElements`)

### Localization

- All user-facing strings in sections/snippets should use translation keys: `{{ 'key' | t }}`
- English default translations are in `locales/en.default.json`
- Schema labels use `t:settings_schema.*` keys defined per-language in `locales/*.schema.json`

---

## Figma Design System Integration

This section defines how to translate Figma designs into this codebase accurately.

### Design Tokens

#### Colors

Waymakers brand palette (hard-coded in `assets/waymakers-home.css` — no token file):

| Token Name | Value | Usage |
|---|---|---|
| Yellow (primary CTA) | `#ffd11f` | `.wm-button--yellow`, ribbon accent |
| Cyan | `#72e2ff` | Reviews section background |
| Pink | `#ffadd0` | Ribbon accent |
| Peach | `#fdc2c8` | Hero section background |
| Orange | `#fea36d` | "Why" section block accent |
| Pale Yellow | `#fff3a8` | Ribbon background |
| Black | `#000000` | Text, borders |
| White | `#ffffff` | Page background |
| Light Gray | `#f7f7f7` | Product card media background |

Shopify color scheme variables (defined in `layout/theme.liquid`, driven by `config/settings_schema.json`) cover standard UI surfaces:

```css
--color-background
--color-foreground
--color-button / --color-button-text
--color-secondary-button / --color-secondary-button-text
--color-link
--color-badge-foreground / --color-badge-background
```

When implementing a color from Figma: if it matches a Waymakers brand color above, use the hex directly in `waymakers-home.css`. If it's a theme surface color, map it to the appropriate CSS variable.

#### Typography

Two brand fonts are loaded globally via `layout/theme.liquid`:

| Variable | Font | Weights | Usage |
|---|---|---|---|
| `--font-heading-family` | Lilita One | 400 | All `wm-heading` elements, ribbons, feature callouts |
| `--font-body-family` | Kanit | 300, 400, 500, 600, 700 | Body text, buttons, nav, announcements |

Key type styles:

```css
/* Section heading */
.wm-heading { font: 400 90px/1.3 "Lilita One", serif; text-transform: uppercase; }

/* Button label */
.wm-button { font: 500 18px/1.3 Kanit, var(--font-body-family), sans-serif; text-transform: uppercase; }

/* Announcement / body */
.wm-announcement { font: 300 18px/1.6 Kanit, var(--font-body-family), sans-serif; }

/* Product card title */
.wm-product-card__title { font-weight: 500; font-size: 18px; text-transform: uppercase; }
```

When implementing text from Figma: use Lilita One for headings/display, Kanit for all other text. Match weight and `text-transform` to the patterns above.

#### Spacing & Layout

Container widths:

```css
.wm-page      { width: min(1840px, calc(100vw - 80px)); }
.wm-container { width: min(1500px, calc(100vw - 48px)); margin-inline: auto; }
```

Section vertical padding is set per-section via CSS custom properties:

```css
--wm-section-padding-top
--wm-section-padding-bottom
```

Common gap values: `14px` (mobile product grid), `20px` (desktop product grid), `28px` (press logos), `30px` (nav actions), `72px` (section heading to content).

Shopify global layout variables (set in `layout/theme.liquid`):

```css
--page-width: 160rem  /* configurable, default ~1200px */
--spacing-sections-desktop
--spacing-sections-mobile
--grid-desktop-vertical-spacing
--grid-desktop-horizontal-spacing
```

#### Border & Button Styling

The Waymakers button uses a "3D press" effect with asymmetric borders:

```css
.wm-button {
  min-height: 52px;
  padding: 14px 24px;
  border: 1px solid #000;
  border-right-width: 3px;
  border-bottom-width: 3px;
  border-radius: 61px; /* pill shape */
}
```

Shopify theme card/button radii are controlled via:
```css
--buttons-radius
--buttons-border-width
--product-card-corner-radius
```

---

### Component Library

There is no external component library or Storybook. Components are Liquid snippets/sections.

#### Waymakers Components (custom, in `sections/` and `snippets/`)

| Component | File | Notes |
|---|---|---|
| Header | `sections/waymakers-header.liquid` | 94px height, 3-col grid, logo + nav + icons |
| Hero | `sections/waymakers-hero.liquid` | 823px height, layered images, pill CTA |
| Featured Products | `sections/waymakers-featured-products.liquid` | Horizontal scroll slider, 4-col |
| Product Card | `snippets/waymakers-product-card.liquid` | 356×460px image, yellow CTA button |
| Ribbons | `sections/waymakers-ribbons.liquid` | Marquee animation, dual-row |
| Reviews | `sections/waymakers-reviews.liquid` | Video cards slider, #72e2ff bg |
| Why / Brand Story | `sections/waymakers-why.liquid` | Image + text grid layout |
| Press Logos | `sections/waymakers-press.liquid` | Logo marquee row |
| Footer | `sections/waymakers-footer.liquid` | Multi-column footer |

#### Dawn Base Components (in `snippets/` and `sections/`)

Standard Shopify snippets: `card-product.liquid`, `price.liquid`, `swatch.liquid`, `quantity-input.liquid`, `header-search.liquid`, `facets.liquid`. These are used on collection, product, cart, and search pages. Prefer editing the `waymakers-*` variants rather than these unless working on core Shopify pages.

---

### Frameworks & Libraries

| Concern | Technology |
|---|---|
| Templates | Liquid (server-rendered by Shopify) |
| Styling | Vanilla CSS with CSS custom properties |
| JavaScript | Vanilla ES6+ Web Components (Dawn), jQuery (Waymakers custom sections) |
| Build system | None — files are served directly by Shopify's CDN |
| Package manager | None |

No React, Vue, Tailwind, CSS Modules, Styled Components, or bundler (Webpack/Vite). When implementing Figma designs, output plain Liquid + CSS — do not introduce framework dependencies.

---

### Asset Management

- All assets (SVG, CSS, JS, images) live in `assets/`
- Referenced in Liquid using the `asset_url` filter: `{{ 'filename.svg' | asset_url }}`
- Images uploaded via Shopify admin are accessed via Shopify CDN URLs with Liquid image filters (`img_url`, `image_tag`)
- No local image optimization pipeline — Shopify handles CDN delivery and resizing

---

### Icon System

All icons are SVG files stored in `assets/`, named with the `wm-` prefix:

| File | Size | Usage |
|---|---|---|
| `wm-logo.svg` | 322×54px | Header brand logo |
| `wm-search.svg` | 22×22px | Search icon |
| `wm-profile.svg` | 22×22px | Account icon |
| `wm-cart.svg` | 22×22px | Cart icon |
| `wm-cart-badge.svg` | 17×17px | Cart item count badge |
| `wm-arrow.svg` | 8×13px | CTA arrow (right) |
| `wm-arrow-left.svg` | 14×14px | Slider back arrow |

**Usage pattern** — assign at the top of a section, then reference as `<img>`:

```liquid
{%- liquid
  assign logo = 'wm-logo.svg' | asset_url
  assign arrow = 'wm-arrow.svg' | asset_url
-%}
<img src="{{ logo }}" alt="{{ shop.name }}" width="322" height="54">
<img src="{{ arrow }}" alt="" width="8" height="13">
```

Icon link wrapper:

```css
.wm-icon-link {
  width: 22px; height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

When adding a new icon from Figma: export as SVG, name it `wm-<name>.svg`, place in `assets/`, and reference via `asset_url`.

---

### Styling Approach

- **Methodology**: Flat BEM-like class naming with `wm-` namespace (e.g., `wm-product-card__title`)
- **Scope**: All Waymakers styles are in `assets/waymakers-home.css`. Dawn base styles are in `assets/base.css` and `assets/component-*.css`
- **Global styles**: CSS custom properties declared in `layout/theme.liquid` under color scheme selectors (`.color-scheme-1`, etc.)
- **No CSS Modules, Sass, or PostCSS** — plain CSS only

**Responsive strategy**: Mobile-first with `max-width` breakpoints:

| Breakpoint | Behavior |
|---|---|
| `≤ 1200px` | Reduce heading size (90px → 64px), tighten nav gaps |
| `≤ 749px` | Full mobile layout: stacked header, hero height formula `min(755px, 193vw)`, single-column products |
| `≤ 425px` | Further adjustments for small phones |

When adding styles from a Figma component, add them to `assets/waymakers-home.css` inside the relevant section's comment block. Never add styles inline in Liquid files.

---

### Implementing a Figma Design into This Codebase

1. **Identify which section/snippet** the design maps to (check `templates/index.json` for homepage section order)
2. **Extract tokens**: map Figma colors → hex values above; map Figma text styles → Kanit or Lilita One with matching weight/size/transform
3. **Write Liquid markup** in the appropriate `sections/waymakers-*.liquid` or `snippets/` file
4. **Write CSS** in `assets/waymakers-home.css`, using `.wm-` BEM classes and `var(--wm-section-padding-*)` for section spacing
5. **Add SVG icons** to `assets/` and reference via `asset_url`
6. **Add section settings** in the `{% schema %}` block at the bottom of the section file to expose configurable values to the Shopify theme editor
7. **Register the section** in the appropriate `templates/*.json` file if it's a new page section
