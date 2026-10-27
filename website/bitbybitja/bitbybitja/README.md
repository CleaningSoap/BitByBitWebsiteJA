# BitByBit

A static storefront for **BitByBit**, a student-run company in the Junior Achievement Company Program. The visual language is perler-bead pixel art: chunky borders, hard shadows, pegboard textures, and bead-grid accents.

The site is deliberately in a **placeholder state**:

- All current products are replaced by eight generic placeholder cards with **Price TBD** and placeholder images.
- Most content images are generic placeholder graphics. The BitByBit logo and favicon remain real brand assets.
- The public sales calendar is **empty** and **read-only**. There are no demo events and no public edit controls.
- Team members can maintain the schedule in a separate, unlinked editor and publish it as a static data file.
- There are no accounts, sign-in, cart, checkout, or server.

## Preview

The quickest way on macOS: **double-click `Open-BitByBit.command`**. It starts the local server if needed and opens the brand URL.

Or, from inside this folder:

```bash
cd /path/to/website/bitbybitja
python3 -m http.server 4173 --bind 127.0.0.1
```

Open:

```
http://bitbybitja.localhost:4173/
```

`bitbybitja.localhost` is treated as loopback by modern browsers, so there is no raw IP in the address. Team editor (not linked publicly):

```
http://bitbybitja.localhost:4173/schedule-admin.html
```

If your browser does not resolve `*.localhost`, use `http://localhost:4173/`. The only remaining number in the local URL is the dev port; deploy to a domain to remove it (see below).

Default editor code: **`bitbybit-team`** — change it before launch (see the calendar section).

## URL / deployment

- **Local:** `http://bitbybitja.localhost:4173/` (brand host, no raw IP)
- **Fallback local:** `http://localhost:4173/`
- **Production:** deploy the contents of this folder to a letters-only domain containing `bitbybitja`, such as `https://bitbybitja.com`. A subdirectory such as `/bitbybitja/` also works because all links are relative.
- The local port remains numeric because non-root processes cannot bind port 80 on macOS. To remove the last digits locally, serve on port 80 with admin rights or use a production domain.
- No build step. Upload the folder to any static host.
- Keep the pages together; all internal links and assets are relative.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: static hero banner, placeholder collections/products, story, charity spotlight, community CTA |
| `about.html` | Company story, JA program, process, values, team placeholders |
| `products.html` | Placeholder product lookbook with category filters and quick view |
| `schedule.html` | **Read-only** public sales-day calendar |
| `charity.html` | Dedicated charity-partner placeholder page |
| `faq.html` | Help / FAQ with draft placeholder answers |
| `404.html` | Static not-found page |
| `schedule-admin.html` | Private team schedule editor — unlinked, `noindex`, code-gated |

The admin page is not in the navigation, footer, sitemap, or any public page.

## Products are placeholders

All eight original product entries were removed. `assets/js/products.js` now contains:

- **Product Placeholder 01–08**
- `price: null`, rendered as **Price TBD**
- Category slots: keychains, magnets, frames, desk
- Generic placeholder images: `assets/img/product-placeholder-one.svg` … `product-placeholder-eight.svg`
- Placeholder descriptions and specs

To add the real lineup, edit `PRODUCTS` in `assets/js/products.js`:

- Set `name`, `blurb`, `image`, `alt`, and `price`.
- Set `price` to a number (for example `8`) to render `$8.00`, or leave it `null` for **Price TBD**.
- Adjust `specs` for size, materials, and care.
- Remove unused placeholder cards.
- Update `FEATURED_IDS` if the home-page selection should change.
- If the team uses a currency other than `$`, update `money()` in the same file.
- Replace or remove the `"Placeholder"` badge on each product.

Home-page collection tiles use the four `collection-*.svg` placeholders and link to the category filters.

## Public calendar is read-only

`schedule.html` loads:

1. `assets/js/site.js` (shared UI)
2. `assets/js/schedule-core.js` (rendering helpers)
3. `assets/js/schedule-data.js` (the published schedule)
4. `assets/js/schedule.js` (read-only view)

The public page **does not** load `schedule-admin.js` and contains:

- No **New event** button
- No add buttons on calendar days
- No event editor dialog
- No `data-event-id` edit hooks
- No calendar writes to localStorage

Visitors can navigate months, read event titles/times/locations, and nothing else. The current published data has no events:

```js
window.BITBYBIT_SCHEDULE = {
  "version": 1,
  "updated": "",
  "events": []
};
```

The page shows an empty-state notice, an empty “Next up” panel, and a “No sales days scheduled this month” hint.

## Team calendar editor

Open `schedule-admin.html` directly. It is protected by a simple shared code gate:

- Default code: **`bitbybit-team`**
- Change it in `assets/js/schedule-admin.js` at `var TEAM_CODE = "bitbybit-team";`
- Unlocking stores a session flag; **Lock editor** clears it and reloads.
- The gate is client-side and is **not real security**. Anyone who can read the JS can find or bypass the code. If the editor must be truly private, protect the whole site/admin path with hosting-level authentication (Basic Auth, Cloudflare Access, etc.). The public schedule stays read-only either way.

### Draft workflow

1. Open `schedule-admin.html` and enter the team code.
2. Add, edit, or delete sales days in the month view. Changes save to a **local draft**:
   ```
   localStorage["bitbybit.schedule.draft.v1"]
   ```
3. **Download published file** generates a fresh `schedule-data.js`.
4. Replace `assets/js/schedule-data.js` with the downloaded file.
5. Redeploy the site.
6. Bump the letters-only `?v=initial` query string on the schedule-data script in `schedule.html` and `schedule-admin.html` (for example `?v=second`, then `?v=third`) or purge the host cache so visitors receive the new dates.

The public page reads only the static published file. Editing the local draft does not change what visitors see until the file is replaced and deployed.

Editor details:

- **Reset draft** restores the draft from the currently published schedule.
- Event fields: title, type, date, start/end, location, internal notes.
- Internal notes are stored in the data file but are **not displayed** on the public calendar.
- The public page shows the `updated` timestamp from the published file as “Last published …”.
- Categories: `sale`, `market`, `school`, `custom`, `other`.
- Published shape:
  ```json
  {
    "version": 1,
    "updated": "2026-10-25T12:00:00.000Z",
    "events": [
      {
        "id": "uuid",
        "date": "2026-11-07",
        "start": "10:00",
        "end": "14:00",
        "title": "Pop-Up Sale",
        "category": "sale",
        "location": "Location TBA",
        "notes": ""
      }
    ]
  }
  ```

## Home banner

The home-page hero banner is static markup in `index.html`:

- Eyebrow, headline (line breaks preserved), description, CTA label/link, and accent color (`--hero-accent`) live in the `#hero` section
- The background image is `assets/img/banner-placeholder.svg`

To change the banner for visitors, edit that section directly. There is no in-browser banner editor.

## Contact details

- Email: **bitbybitja@gmail.com** — present on every public page footer, the FAQ contact card, and the charity page.
- Instagram: placeholder, displayed as `@placeholder` with a TBA/coming-soon tag. It is not linked.

To launch Instagram:

1. Search for `@placeholder` across the six main HTML pages (14 occurrences).
2. Replace with the real handle.
3. Turn the `.ig-row` footer content into a link:
   ```html
   <div class="ig-row"><span>Instagram:</span><a href="https://instagram.com/YOUR_HANDLE">@YOUR_HANDLE</a></div>
   ```
4. Update the FAQ and home community copy.

## Image placeholders

All content images are now explicit placeholder SVGs, except the brand logo and favicon. Recommended sizes:

| File | Used for | Recommended |
| --- | --- | --- |
| `assets/img/banner-placeholder.svg` | Home hero default background | 1600 × 900 |
| `assets/img/product-placeholder-one.svg` … `product-placeholder-eight.svg` | Product cards + quick view | 420 × 320 |
| `assets/img/collection-keychains.svg` | Home collection tile | 420 × 320 |
| `assets/img/collection-magnets.svg` | Home collection tile | 420 × 320 |
| `assets/img/collection-frames.svg` | Home collection tile | 420 × 320 |
| `assets/img/collection-desk.svg` | Home collection tile | 420 × 320 |
| `assets/img/feature-placeholder.svg` | Products page feature block | 1200 × 800 |
| `assets/img/about-placeholder.svg` | About/home workshop photo | 1200 × 800 |
| `assets/img/charity-placeholder.svg` | Charity page / home spotlight | 1200 × 800 |
| `assets/img/team-placeholder.svg` | Team member + group photo slots | 600 × 600 |
| `assets/img/logo-mark.svg` | Brand mark (kept) | 110 × 100 |
| `assets/img/favicon.svg` | Browser icon (kept) | 64 × 64 |

Notes:

- Page-level photos in `<figure class="img-frame" data-slot="…">` show a small **IMG SLOT** badge. Remove the `data-slot` attribute after swapping in a real photo.
- Product photo paths live in `assets/js/products.js`; collection tile paths are in `index.html`.
- The placeholder SVGs themselves contain a slot filename and dimensions, so it is obvious which file to replace.
- Use compressed WebP/JPEG for real photos. If the aspect ratio changes, update the `width`/`height` attributes and the relevant CSS `aspect-ratio`.

## Other placeholder content to replace

- `Placeholder` / `TBD` / `TBA` / `[X]` — charity page, FAQ policies, team names, Instagram.
- `Team Member` — about-page team cards.
- `Charity name coming soon.` and partner detail rows.
- Draft FAQ answers for shipping, payment, reservations, and custom lead times.
- The product cards, descriptions, and **Price TBD** labels.
- The empty sales calendar (publish real dates through the team editor).

## Structure

```
bitbybitja/
├── index.html
├── about.html
├── products.html
├── schedule.html          # read-only public calendar
├── schedule-admin.html    # private, unlinked team editor
├── charity.html
├── faq.html
├── 404.html
├── site.webmanifest
├── Open-BitByBit.command
├── README.md
└── assets/
    ├── css/site.css
    ├── js/
    │   ├── site.js          # nav, dialogs, toast, footer year, FAQ hash targets
    │   ├── products.js      # placeholder catalogue, filters, quick view
    │   ├── schedule-core.js # shared calendar rendering/helpers
    │   ├── schedule-data.js # published events (currently empty)
    │   ├── schedule.js      # read-only public calendar
    │   └── schedule-admin.js# private team editor/draft/publish
    └── img/                 # placeholder SVGs + brand mark
```

## Accessibility and behavior notes

- Skip links, semantic headings, native `<dialog>` modals, keyboard-operable nav, visible focus styles, and reduced-motion support.
- The public calendar is intentionally non-editable: static event chips, no add buttons, no editor dialog.
- The team editor page is `noindex,nofollow` and unlinked from public pages.
- The calendar grid scrolls horizontally inside its card on narrow screens.
- Fonts come from Google Fonts (`Pixelify Sans`, `Press Start 2P`, `Inter`) with local fallbacks.
- The site works without JavaScript for reading copy, but product cards, filters, the calendar, and the team editor require JavaScript.
- Browser storage may be blocked in private modes; the team editor reports save failures instead of silently claiming success.

## QA performed

Served at `http://bitbybitja.localhost:4173/` and checked across the following flows:

- Public pages at 1440 px, tablet, and mobile widths (down to 320 px): no console errors, failed requests, broken images, duplicate IDs, or horizontal overflow.
- Product catalogue: eight placeholder cards, **Price TBD**, filters, categories, and quick view.
- Public calendar: empty state, no add/edit buttons, no editor dialog, no edit hooks, no calendar localStorage writes.
- Published-data test: temporarily seeded a published event; the public page rendered it as non-interactive text (no edit hooks) and restored the empty data afterward.
- Team editor: gate rejects incorrect code, accepts the default code, adds draft events, persists drafts, downloads a valid `schedule-data.js`, and does not affect the public page.
- Banner editor: opens with the placeholder image, live preview, save/reload persistence, and reset.
- Internal links and local assets audited after the word-based filename changes; no broken references.
