# Theme system

Three colours on a 60 / 30 / 10 split, in both light and dark mode.

| Role | Colour | Light mode | Dark mode |
|---|---|---|---|
| 60% base | cream `#F3EEE3` / ink `#111111` | cream page | ink page |
| 30% secondary | ink / cream | text, the Work and Contact bands, the ID card | text, the Work and Contact bands (cream), the ID card |
| 10% accent | orange `#FF5F1F` | markers, the primary button, chat badge | same |

Muted text, hairlines and panels are mixes of cream and ink. No other hues. Orange never goes on big headlines or small body text; it's for fills (buttons, the small square `.tick` marker) only.

## Tokens

Defined in `app/globals.css` as RGB channels (so Tailwind can add opacity, e.g. `bg-ink/5`) and mapped in `tailwind.config.ts`.

| Token | Tailwind | Use |
|---|---|---|
| `--paper` | `bg-paper` | Background |
| `--paper-raised` / `--paper-sunk` | `bg-paper-raised` / `bg-paper-sunk` | Cards, form, image wells |
| `--ink` / `--ink-soft` | `text-ink` / `text-ink-soft` | Headings / body |
| `--muted` | `text-muted` | Labels, metadata |
| `--line` / `--line-strong` | `border-line` / `border-line-strong` | Hairlines, 3D edges |
| `--accent` / `--accent-edge` / `--on-accent` | `bg-accent`, `text-accent-on` | Orange, its darker "edge" for push buttons, text on orange |

### `.band`

`.band` flips the palette for a block: on the cream page it's an ink band; in dark mode it's a cream band on the ink page. Everything inside keeps using the same tokens. Used by the Work section, the Contact + footer block, and the faces of the ID card.

(Not called `.invert` because Tailwind already has an `invert` filter utility.)

## Type

Loaded from Google Fonts in `app/layout.tsx`.

- **Archivo** (variable width) via `.display`: headings, set wide (112%) and heavy. `.display-quiet` is the narrow, light, muted second half of a headline.
- **Geist**: body text.
- **Geist Mono** (`.label`): small uppercase metadata.

## 3D

- `components/IdCard.tsx`: the hero ID card. Real thickness from stacked edge slices, tilts toward the pointer, idles with a slow sway on touch screens, flips on click / tap / Enter. The photo (`public/assets/profile/zohaib.jpg`) moves against the tilt for depth.
- `components/ui/Tilt.tsx`: pointer tilt + soft light for cards (mouse/pen only).
- `Work.tsx` `Screen`: project screens start tipped back and settle flat as they scroll into view.
- `.btn-press` / `.btn-ghost`: push buttons that travel down onto their edge when pressed.

All of it switches off when the user has reduced motion enabled.

## Theme switching

- An inline script in `app/layout.tsx` sets `light` or `dark` on `<html>` before first paint (saved choice in `localStorage.theme`, otherwise the system setting), so there's no flash.
- `components/ThemeProvider.tsx` keeps React in sync and follows system changes until the user picks a theme.
- `components/ThemeToggle.tsx` is the switch in the header.
