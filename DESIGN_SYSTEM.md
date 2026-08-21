---
version: alpha
name: "Resend Dark Developer"
description: "Resend is a developer-focused email platform with a bold, dark-first visual identity. The design pairs a large serif display typeface (ABCFavorit at 56–96px with tight negative letter-spacing) against a near-black (#000000) canvas, creating dramatic typographic contrast. Body and UI text use Inter, while Commit Mono handles code and technical labels. The color palette is intentionally restrained. near-black backgrounds, light gray text (#f0f0f0), and muted mid-grays. with occasional accent colors (violet, green, amber, blue) used sparingly for status and highlight contexts. CTAs use a white-on-black pill button. The layout is spacious with a centered max-width container, generous vertical rhythm, and a 4px-base spacing scale."
colors:
  surface-base: "#000000"
  accent-blue: "#3b9eff"
  accent-green: "#44ffa4"
  surface-elevated: "#262a2d"
  accent-violet: "#9281f7"
  cta-fill: "#ffffff"
  text-muted: "#a1a4a5"
  text-primary: "#f0f0f0"
  text-subtle: "#6c6c6c"
  border-subtle: "#464a4d"
  surface-tinted: "#f0f0f0"
  accent-amber: "#ffca16"
typography:
  display-hero:
    fontFamily: "aBCFavorit"
    fontSize: "56px"
    fontWeight: "400"
    lineHeight: "67.2px"
    letterSpacing: "-2.8px"
  display-large:
    fontFamily: "aBCFavorit"
    fontSize: "96px"
    fontWeight: "400"
    lineHeight: "1.1"
    letterSpacing: "-2.8px"
  section-heading:
    fontFamily: "aBCFavorit"
    fontSize: "20px"
    fontWeight: "400"
    lineHeight: "20px"
  nav-label:
    fontFamily: "aBCFavorit"
    fontSize: "14px"
    fontWeight: "500"
    lineHeight: "20px"
    letterSpacing: "0.35px"
  body-default:
    fontFamily: "inter"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "24px"
  body-small:
    fontFamily: "inter"
    fontSize: "14px"
    fontWeight: "400"
    lineHeight: "20px"
  label-medium:
    fontFamily: "inter"
    fontSize: "12px"
    fontWeight: "500"
    lineHeight: "16px"
  body-semibold:
    fontFamily: "inter"
    fontSize: "16px"
    fontWeight: "600"
    lineHeight: "24px"
  code-small:
    fontFamily: "commitMono"
    fontSize: "12px"
    fontWeight: "400"
    lineHeight: "16px"
  code-default:
    fontFamily: "commitMono"
    fontSize: "14px"
    fontWeight: "400"
    lineHeight: "20px"
  code-large:
    fontFamily: "commitMono"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "24px"
rounded:
  radius-sm: "4px"
  radius-md: "6px"
  radius-lg: "8px"
  radius-xl: "10px"
  radius-2xl: "12px"
  radius-3xl: "16px"
  radius-pill: "24px"
spacing:
  space-1: "2px"
  space-2: "4px"
  space-3: "6px"
  space-4: "8px"
  space-5: "12px"
  space-6: "14px"
  space-7: "16px"
  space-8: "20px"
  space-9: "24px"
  space-10: "32px"
  space-11: "40px"
  space-12: "48px"
  space-13: "64px"
  space-14: "80px"
  space-15: "96px"
  space-16: "104px"
---

## Overview

Resend is a developer-focused email platform with a bold, dark-first visual identity. The design pairs a large serif display typeface (ABCFavorit at 56–96px with tight negative letter-spacing) against a near-black (#000000) canvas, creating dramatic typographic contrast. Body and UI text use Inter, while Commit Mono handles code and technical labels. The color palette is intentionally restrained. near-black backgrounds, light gray text (#f0f0f0), and muted mid-grays. with occasional accent colors (violet, green, amber, blue) used sparingly for status and highlight contexts. CTAs use a white-on-black pill button. The layout is spacious with a centered max-width container, generous vertical rhythm, and a 4px-base spacing scale.

**Signature traits:**
- Dual typeface system: Pairs aBCFavorit and inter across the type hierarchy.
- Soft, rounded geometry: Generous corner rounding up to 24px.

## Colors

The palette uses 18 validated color tokens across 2 theme profiles. Semantic roles stay attached to observed usage so generation agents can choose accents without inventing new color meaning.

**Semantic naming:**
- **surface-primary** maps to `surface-base`: Role "primary" is grounded by usage context "Primary page background and hero section fill".
- **action-text** maps to `text-primary`: Role "text" is grounded by usage context "Headings, body text, nav links on dark background".
- **content-text** maps to `text-muted`: Role "text" is grounded by usage context "Secondary text, nav items, captions, muted labels".
- **border-border** maps to `border-subtle`: Role "border" is grounded by usage context "Dividers, card outlines, input borders".

### Dark Theme

### Primary Brand
- **Surface Base** (#000000): Primary page background and hero section fill. Role: primary. {authored: rgb(0, 0, 0), space: rgb, alpha: 0.3}
- **Accent Blue** (#3b9eff): Informational highlights, link accents. Role: accent. {authored: rgb(59, 158, 255), space: rgb}
- **Accent Green** (#44ffa4): Success states, status indicators. Role: accent. {authored: rgba(68, 255, 164, 0.62), space: rgb, alpha: 0.62}

### Text Scale
- **Accent Violet** (#9281f7): Highlight accents, feature callouts, badge backgrounds. Role: text. {authored: rgb(146, 129, 247), space: rgb}
- **CTA Fill** (#ffffff): Get started button background, primary action fill. Role: text. {authored: rgb(255, 255, 255), space: rgb}
- **Text Muted** (#a1a4a5): Secondary text, nav items, captions, muted labels. Role: text. {authored: rgb(161, 164, 165), space: rgb}
- **Text Primary** (#f0f0f0): Headings, body text, nav links on dark background. Role: text. {authored: rgb(240, 240, 240), space: rgb}
- **Text Subtle** (#6c6c6c): Tertiary text, disabled states, placeholder text. Role: text. {authored: rgb(108, 108, 108), space: rgb}

### Interactive
- **Border Subtle** (#464a4d): Dividers, card outlines, input borders. Role: border. {authored: rgb(70, 74, 77), space: rgb}

### Surface & Shadows
- **Surface Elevated** (#262a2d): Slightly elevated card or panel surfaces. Role: background. {authored: rgb(38, 42, 45), space: rgb}

### Light Theme

### Primary Brand
- **CTA Fill** (#000000): Get started button background in light mode. Role: primary. {authored: rgb(0, 0, 0), space: rgb, alpha: 0.3}

### Text Scale
- **Accent Amber** (#ffca16): Warning states, highlight badges. Role: text. {authored: rgb(255, 202, 22), space: rgb}
- **Accent Violet** (#9281f7): Highlight accents, feature callouts. Role: text. {authored: rgb(146, 129, 247), space: rgb}
- **Text Muted** (#a1a4a5): Secondary text, nav items, captions. Role: text. {authored: rgb(161, 164, 165), space: rgb}
- **Text Primary** (#000000): Headings and primary body text on light background. Role: text. {authored: rgb(0, 0, 0), space: rgb, alpha: 0.3}

### Interactive
- **Border Subtle** (#ebeced): Hairline borders, card outlines, dividers. Role: border. {authored: rgb(235, 236, 237), space: rgb}

### Surface & Shadows
- **Surface Base** (#ffffff): Primary page background in light mode. Role: background. {authored: rgb(255, 255, 255), space: rgb}
- **Surface Tinted** (#f0f0f0): Light gray surface fills, footer, section backgrounds. Role: background. {authored: rgb(240, 240, 240), space: rgb}

## Typography

Typography uses aBCFavorit, inter, commitMono across extracted hierarchy roles. Keep hierarchy mapped to these token rows before adding decorative type styles.

Mixes aBCFavorit and inter and commitMono for visual contrast. Weight range spans regular, medium, semi-bold. Sizes range from 12px to 96px.

### Type Scale Evidence
| Role | Font | Size | Weight | Line Height | Letter Spacing | Stack / Features | Notes |
|------|------|------|--------|-------------|----------------|------------------|-------|
| Hero headline — 'Email for developers' large display text | aBCFavorit | 56px | 400 | 67.2px | -2.8px | aBCFavorit, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; features: "ss01", "ss04", "ss11" | Extracted token |
| Largest hero heading variant (probe-confirmed h1 at 96px) | aBCFavorit | 96px | 400 | 1.1 | -2.8px | aBCFavorit, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; features: "ss01", "ss04", "ss11" | Extracted token |
| Section titles and sub-headings | aBCFavorit | 20px | 400 | 20px | normal | aBCFavorit, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; features: "ss01", "ss04", "ss11" | Extracted token |
| Navigation labels and small UI labels | aBCFavorit | 14px | 500 | 20px | 0.35px | aBCFavorit, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; features: "ss01", "ss04", "ss11" | Extracted token |
| Primary body text, paragraph content | inter | 16px | 400 | 24px | normal | inter, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji | Extracted token |
| Secondary body text, descriptions, captions | inter | 14px | 400 | 20px | normal | inter, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji | Extracted token |
| UI labels, badges, tags | inter | 12px | 500 | 16px | normal | inter, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji | Extracted token |
| Emphasized body text, card titles | inter | 16px | 600 | 24px | normal | inter, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji | Extracted token |
| Inline code, technical labels, API snippets | commitMono | 12px | 400 | 16px | normal | commitMono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace | Extracted token |
| Code blocks, terminal output, technical content | commitMono | 14px | 400 | 20px | normal | commitMono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace | Extracted token |
| Larger code display contexts | commitMono | 16px | 400 | 24px | normal | commitMono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace | Extracted token |

## Layout

Responsive system uses 2 breakpoint tier(s): mobile, desktop.

This system uses a 4px base grid with scale values 2, 4, 6, 8, 12, 14, 16, 20, 24, 32, 40, 48, 64, 80, 96, 104.

### Responsive Strategy
- **mobile (<= 600px)**: Constrain layout for small viewports and prioritize vertical stacking.
- **desktop (Unknown)**: Expand layout density and horizontal composition for wide viewports.

### Spacing System
| Token | Value | Px | Notes |
|------|-------|----|-------|
| space-1 | 2px | 2 | Extracted spacing token |
| space-2 | 4px | 4 | Extracted spacing token |
| space-3 | 6px | 6 | Extracted spacing token |
| space-4 | 8px | 8 | Extracted spacing token |
| space-5 | 12px | 12 | Extracted spacing token |
| space-6 | 14px | 14 | Extracted spacing token |
| space-7 | 16px | 16 | Extracted spacing token |
| space-8 | 20px | 20 | Extracted spacing token |
| space-9 | 24px | 24 | Extracted spacing token |
| space-10 | 32px | 32 | Extracted spacing token |
| space-11 | 40px | 40 | Extracted spacing token |
| space-12 | 48px | 48 | Extracted spacing token |
| space-13 | 64px | 64 | Extracted spacing token |
| space-14 | 80px | 80 | Extracted spacing token |
| space-15 | 96px | 96 | Extracted spacing token |
| space-16 | 104px | 104 | Extracted spacing token |

## Elevation & Depth

Keep depth flat unless validated shadow or interaction evidence appears in the extraction payload. Do not invent shadows beyond this evidence boundary.

### Shadow Evidence
| Shadow Token | Layers | Details |
|--------------|--------|---------|
| n/a | 0 | No validated shadow payload |

### Interaction Signals
| Theme | Signal | Evidence |
|-------|--------|----------|
| Light | backdrop-filter | blur(25px) |
| Light | outline-color | rgb(240, 240, 240) ; rgb(161, 164, 165) ; rgb(235, 236, 237) |
| Light | outline-width | 3px |
| Light | outline-offset | 0px |
| Light | transform | matrix(1, 0, 0, 1, 0, 20) ; matrix(1, 0, 0, 1, -471.671, 0) ; matrix(1, 0, 0, 1, 0, 0) |
| Dark | backdrop-filter | blur(25px) |
| Dark | outline-color | rgb(240, 240, 240) ; rgb(161, 164, 165) ; rgb(235, 236, 237) |
| Dark | outline-width | 3px |
| Dark | outline-offset | 0px |
| Dark | transform | matrix(1, 0, 0, 1, 0, 20) ; matrix(1, 0, 0, 1, -521.563, 0) ; matrix(1, 0, 0, 1, 0, 0) |

## Shapes

Shape language maps directly to rounded tokens. Keep component corners consistent with the role mapping below before introducing bespoke geometry.

### Radius Roles
| Token | Value | Px | Role Mapping |
|------|-------|----|--------------|
| radius-sm | 4px | 4 | Subtle corner |
| radius-md | 6px | 6 | Subtle corner |
| radius-lg | 8px | 8 | Control corner |
| radius-xl | 10px | 10 | Control corner |
| radius-2xl | 12px | 12 | Control corner |
| radius-3xl | 16px | 16 | Card corner |
| radius-pill | 24px | 24 | Large surface corner |

### Geometry Evidence
| Radius Token | Shape | Units |
|--------------|-------|-------|
| radius-sm | 4px | px |
| radius-md | 6px | px |
| radius-lg | 8px | px |
| radius-xl | 10px | px |
| radius-2xl | 12px | px |
| radius-3xl | 16px | px |
| radius-pill | 24px | px |

## Components

(none detected)

## Do's and Don'ts

Guardrails protect Dual typeface system, Soft, rounded geometry without adding unsupported visual claims.

| Do | Don't |
|----|---------|
| Do maintain consistent spacing using the base grid | Don't make unsupported claims about absent visual features |
| Do maintain WCAG AA contrast ratios (4.5:1 for normal text) | Don't mix rounded and sharp corners in the same view |
| Do use the primary color only for the single most important action per screen |  |
| Do verify evidence before writing new design-system guidance |  |

## Responsive Evidence

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <= 600px | (max-width: 600px) |
| Breakpoint 2 | Unknown | (hover: none) and (pointer: coarse) |

## Agent Prompt Guide

### Example Component Prompts
- Create button component using validated primary color role and spacing tokens.
- Create card component with mapped radius role and evidence-backed elevation.
- Create form input component using inferred typography hierarchy and border roles.

### Iteration Guide
1. Start with extracted palette and typography roles only.
2. Map spacing and radius directly from token tables before visual polish.
3. Apply component patterns one section at a time and compare against source intent.
4. Keep elevation claims tied to explicit evidence in output.
5. Iterate with smallest diffs and re-check section hierarchy after each change.
