# CMI 3D Print Cost Calculator

A single-file static website that estimates 3D print costs by printer and material, and generates branded PDF quotes/invoices. Built for the Center for Medical Innovation (CMI), University of Utah.

Live site: https://koljaklug.github.io/print-cost-calculator/
Repo: https://github.com/koljaklug/print-cost-calculator

This repo also hosts a small, unrelated bonus tool — a readrrr-style speed reader — at `reader.html` (see [Speed Reader](#speed-reader) below).

## What it is

`index.html` is the entire application — no build step, no `npm install`, no bundler. React, ReactDOM, Babel Standalone, Tailwind CSS, and jsPDF are all loaded from CDNs (`unpkg.com` / `cdn.tailwindcss.com`) via `<script>` tags. The JSX app source lives in a `<script type="text/babel-source">` block; a small vanilla-JS snippet at the bottom transforms it with Babel (forcing the **classic** JSX runtime — see "Known quirks" below) and injects it as a real `<script>`.

All pricing data (printers, materials, pricing tiers) lives in a separate `pricing-config.js`, loaded before the app script — see "Editing pricing data" below.

This means the whole site can be opened from a single HTML file or hosted anywhere that serves static files — no server-side logic at all.

## How pricing works

**Printers** (`PRINTERS` in `pricing-config.js`) each have a setup fee, an hourly time cost, and a list of compatible materials:

| Printer | Setup fee | Time cost | Materials |
|---|---|---|---|
| Prusa | $15 | $1/hr | PLA, PETG, TPU, PVA |
| Form 4 | $15 | $3/hr | BioMed White, Clear, Elastic 50A, Flexible 80A, Tough 2000, Silicone 40A, BioMed Durable |
| Fuse | $20 | $3/hr | Nylon |

**Materials** (`MATERIALS`) each have a cost per gram/ml, ranging from $0.12 (PLA/PETG/TPU) to $1.35 (BioMed Durable). The material dropdown is filtered to whatever the selected printer supports.

**Base formula:**
```
Total = (Setup Fee × Tier Setup Multiplier) + (Print Time × Printer Time Cost) + (Material Amount × Material Cost × Tier Material Multiplier)
```

Time cost is always charged in full — only setup fee and material cost are affected by the pricing tier.

### Pricing tiers

A 3-way segmented toggle ("Pricing tier") controls the setup fee multiplier, the material cost multiplier, and the page's background color — all defined per-tier in `PRICING_STAGES` in `pricing-config.js`:

| Tier | Setup fee multiplier | Material multiplier | Background |
|---|---|---|---|
| Internal | 0.5x (half) | 1.5x | light blue (`bg-blue-100`) |
| External | 1x (full) | 4x | grey (`bg-slate-200`) |
| B2B | 0.5x (half) | 2x | light red (`bg-red-100`) |

**The pricing tier's multiplier values are intentionally not displayed anywhere in the UI** — the toggle just shows tier names (Internal/External/B2B); the resulting dollar totals show in the Cost Summary and PDF, but the multiplier/markup numbers themselves stay out of the page and the exported PDF.

### Quantity pricing (quote/invoice total)

The "Generate" section at the bottom adds a **Number of prints** field. The setup fee is charged once per job; time cost and material cost scale with quantity:

```
Quote Total = Setup Fee + (Time Cost + Material Cost) × Number of Prints
```

## PDF generation

The "4. Generate ___" section changes shape depending on the active pricing tier — different required fields, different PDF title, different filename prefix:

| Tier | Section title | Required fields | PDF title | Filename |
|---|---|---|---|---|
| Internal | Generate Internal Reference | Project, Part name | "Internal Print Cost Reference" | `Reference_<part>.pdf` |
| External | Generate Quote | Contact name, Department, Email address, Part name | "3D Print Quote" | `Quote_<part>.pdf` |
| B2B | Generate B2B Team Invoice | B2B Team Number, Part name | "Bench to Bedside - Internal Print Invoice" | `Invoice_<part>.pdf` |

All three PDF types show the CMI logo, date, the relevant fields, printer, material, and **only the final total** — no itemized setup/time/material cost breakdown and no visible markup/multiplier (the Cost Summary sidebar shows the setup/time/material dollar breakdown on-screen, but never the tier's multiplier values or a calculation formula — neither appears on the page or the PDF).

Fields have no example/placeholder text — they're intentionally blank until filled in.

PDF generation uses jsPDF (`window.jspdf.jsPDF`), loaded from `unpkg.com/jspdf@2.5.2`.

## Editing pricing data

Printers, materials, and pricing tiers all live in `pricing-config.js`, loaded as a plain global-scope `<script>` before the app script runs. To change a setup fee, time cost, material cost, add/remove a material or printer, or adjust a tier's multipliers or color, edit `pricing-config.js` only — `index.html` doesn't need to change. The file is plain JS with comments explaining each field.

## Logo

The CMI logo is embedded directly in `index.html` as a base64 JPEG data URI (`LOGO_DATA_URI` constant near the top of the script), so the page works fully offline/standalone with no extra image requests.

Source files live in `assets/`:
- `assets/logo.png` — original logo as provided (has transparency)
- `assets/logo_quote.jpg` — resized (900px wide) and flattened-to-white version actually embedded in the page

**Why not embed the original PNG directly:** the original has an alpha channel. jsPDF embeds transparent PNGs as an uncompressed raw bitmap instead of a compressed stream, which turned a ~40KB logo into an 8.8MB PDF. Flattening to a white background and converting to JPEG fixed this (PDFs are ~37KB).

**To swap the logo:** replace `assets/logo.png`, regenerate a flattened JPEG (`sips -s format jpeg -s formatOptions 90 -Z 900 logo.png --out logo_quote.jpg`), base64-encode it (`base64 -i logo_quote.jpg`), and paste the result into the `LOGO_DATA_URI` constant in `index.html`.

## Running locally

No build step needed — just serve the folder:

```bash
cd print-cost-calculator
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploying

Hosted via GitHub Pages from the `main` branch root. To publish changes:

```bash
git add index.html pricing-config.js
git commit -m "..."
git push
```

GitHub Pages rebuilds automatically (usually within 1–2 minutes) at https://koljaklug.github.io/print-cost-calculator/.

**Heads up:** if you ever edit `index.html` directly on GitHub's web editor, your local `git push` will be rejected until you `git pull`/merge — GitHub Pages doesn't know about local commits and vice versa.

## Known quirks

- **Tailwind CDN production warning** in the browser console ("cdn.tailwindcss.com should not be used in production...") is expected and harmless — it's just Tailwind's Play CDN reminding you it's not meant for high-traffic production sites. Fine for this use case.
- **Babel JSX runtime:** newer Babel Standalone builds default to the "automatic" JSX runtime, which emits an ES `import` statement that can't run in a plain (non-module) `<script>` tag. The build step at the bottom of `index.html` explicitly forces `runtime: "classic"` to avoid this — don't remove that option when editing.
- **Tailwind color classes must be real shades.** Tailwind's default palette only has specific steps per color (50, 100, 200, 300...) — there's no 150, 250, etc. A class like `bg-blue-150` compiles to nothing and silently renders no background at all. When picking a `bg` value in `pricing-config.js`, stick to real steps (50/100/200/...) or use an arbitrary-value class like `bg-[#dbeafe]` if you need an exact color Tailwind doesn't ship.
- The whole app is one file (plus `pricing-config.js`) with no tests and no type checking. Verify changes by serving locally and clicking through the UI (or checking the browser console for errors) before pushing.

## File structure

```
print-cost-calculator/
├── index.html          # the entire app (UI, PDF generation)
├── pricing-config.js   # printers, materials, and pricing tier data — edit this to adjust pricing
├── reader.html          # standalone speed-reader tool, unrelated to the calculator above
├── assets/
│   ├── logo.png         # original CMI logo (with transparency)
│   └── logo_quote.jpg   # flattened/resized version embedded in the PDF
└── README.md            # this file
```

## Speed Reader

`reader.html` is a self-contained RSVP (Rapid Serial Visual Presentation) speed reader, similar to the readrrr app: it flashes one word at a time so your eyes stay fixed and you don't scan the line.

- **Setup screen:** paste text directly, or upload a `.txt` or `.pdf` file (PDF text is extracted client-side with [pdf.js](https://mozilla.github.io/pdf.js/), loaded from a CDN). A slider sets reading speed from 200–800 WPM, with a live word count and estimated reading time.
- **Reading mode:** click "Start Reading" to go full-screen — plain black background, one word at a time in white, with the word's optimal recognition point (ORP) letter highlighted in red and horizontally fixed so your eyes don't move between words. The only visible control is an &times; in the corner to exit. Longer words and sentence-ending punctuation get slightly more display time.
- **Keyboard/mouse shortcuts in reading mode** (no on-screen buttons, to keep the screen distraction-free): click the word or press Space to pause/resume, Left/Right arrows to step a word at a time, Escape (or the &times;) to exit.

It's a separate, independent page from the cost calculator — open it directly at `reader.html` (or `https://koljaklug.github.io/print-cost-calculator/reader.html` once deployed).
