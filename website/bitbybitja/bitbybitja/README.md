# BitByBit

A static storefront for **BitByBit**, a student-run company in the Junior Achievement Company Program. The visual language is perler-bead pixel art: chunky borders, hard shadows, pegboard textures, and bead-grid accents.

The shop is a **fridge magnet** lineup across four collections. **Snowmelts is limited edition; the other three are permanent lines.**

| Collection | Availability | Theme | Catalogue |
| --- | --- | --- | --- |
| **Snowmelts** | Limited edition | Christmas | Christmas Star |
| **Itty Bitty Canvas** | Permanent | Famous painting recreations | Starry Night |
| **Canadots** | Permanent | Canadian | Canada Flag |
| **Meltimals** | Permanent | Animals | Crab, Beaver, Cat |

Product photos are real; **descriptions and prices remain placeholders** (`Price TBD`) until the team supplies final copy. There is no keychain, frame, or desk-product line.

Other live brand details:

- Slogan: **“A bit of fun in every bag.”**
- Instagram: **[@bitbybitja](https://www.instagram.com/bitbybitja/)** (linked from every footer and the FAQ).
- Charity pledge: **20% of net proceeds**. The partner is still a placeholder.
- Next sales days: **November 14 at St. Laurent Mall, Ottawa** and **December 13 at Merivale Mall, Ottawa**.
- Theme palette: light pink `#ffbfdc`, green `#bbec72`, yellow `#ffde59`, pastel azure `#91ccff`, pastel lavender `#c9abe4`.

There are no accounts, sign-in, cart, checkout, or server.

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
| `index.html` | Home: hero, four collection tiles, featured magnets, story/process photo, charity spotlight, sales-day CTA |
| `about.html` | Company story, JA program, process photo, values, team placeholders |
| `products.html` | Fridge magnet lookbook with collection filters and quick view |
| `schedule.html` | **Read-only** public sales-day calendar |
| `charity.html` | Charity page with a 20% pledge and placeholder partner details |
| `faq.html` | Help / FAQ with draft placeholder answers |
| `404.html` | Static not-found page |
| `schedule-admin.html` | Private team schedule editor — unlinked, `noindex`, code-gated |

The admin page is not in the navigation, footer, sitemap, or any public page.

## Products

`assets/js/products.js` is the single source of truth for the catalogue. Each entry has:

- `id`, `name`, `category`, `price`
- `image`, `alt`
- optional `badge` / `badgeClass` (only Snowmelts currently uses one)
- placeholder `blurb` and `specs`

Current entries:

| ID | Name | Category | Image |
| --- | --- | --- | --- |
| `snowmelts-christmas-star` | Christmas Star | `snowmelts` | `assets/img/products/christmas-star.jpg` |
| `itty-bitty-canvas-starry-night` | Starry Night | `itty-bitty-canvas` | `assets/img/products/starry-night.jpg` |
| `canadots-canada-flag` | Canada Flag | `canadots` | `assets/img/products/canada-flag.jpg` |
| `meltimals-crab` | Crab | `meltimals` | `assets/img/products/crab.jpg` |
| `meltimals-beaver` | Beaver | `meltimals` | `assets/img/products/beaver.jpg` |
| `meltimals-cat` | Cat | `meltimals` | `assets/img/products/cat.jpg` |

To finish the catalogue:

- Replace each `blurb` with the real product description.
- Set `price` to a number (for example `8`) to render `$8.00`, or leave it `null` for **Price TBD**.
- Adjust `specs` for size, materials, and care.
- Keep every product image at **4:3 (800 × 600)** so cards and quick view stay aligned. The two portrait source photos (flag, crab) were center-cropped to 4:3 during processing.
- Update `FEATURED_IDS` if the home-page selection should change.
- If the team uses a currency other than `$`, update `money()` in the same file.

Home-page collection tiles use one representative photo per collection and link to the matching `?category=` filter. Collection keys are `snowmelts`, `itty-bitty-canvas`, `canadots`, and `meltimals`.

Availability is carried by the card badge only where it matters: Snowmelts uses **Limited edition** (`tag--pink`); the three permanent lines are unbadged. The collection copy on the shop page spells out which lines are permanent.

## Brand assets

- `assets/img/logo-mark.png` — the BitByBit pixel banner logo with the black background removed, transparent, 480 × 614.
- `assets/img/favicon-64.png`, `favicon-192.png`, `favicon-512.png` — browser tab, Apple touch, and PWA icons generated from the logo.
- `assets/img/hero.jpg` — home hero background (1600 × 900).
- `assets/img/process.jpg` — behind-the-scenes production photo (1200 × 900), used on the home story and about pages.
- `assets/img/products/*.jpg` — six product photos, 800 × 600.

The logo is used on dark surfaces (header, footer, community panel), so keep the transparent PNG rather than flattening it onto white.

## Public calendar is read-only

`schedule.html` loads:

1. `assets/js/site.js` (shared UI)
2. `assets/js/schedule-core.js` (rendering helpers)
3. `assets/js/schedule-data.js` (the published schedule)
4. `assets/js/schedule.js` (read-only view)

The public page **does not** load `schedule-admin.js` and contains no add/edit controls or calendar writes.

Published events:

| Date | Event | Location |
| --- | --- | --- |
| 2026-11-14 | BitByBit at St. Laurent Mall | St. Laurent Mall, Ottawa |
| 2026-12-13 | BitByBit at Merivale Mall | Merivale Mall, Ottawa |

Times are not set yet, so the public calendar shows **Time TBA** until the team adds start/end times. The page opens on the next month that has a sales day instead of the current month when the current month is empty.

To publish a change, use the team editor or edit `assets/js/schedule-data.js` directly, then bump the `?v=` query on the `schedule-data.js` script in `schedule.html` and `schedule-admin.html` (currently `?v=initial`) or purge the host cache.

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

## Home banner

The home-page hero banner is static markup in `index.html`:

- Eyebrow, headline, description, CTA label/link, and accent color (`--hero-accent`) live in the `#hero` section.
- The background image is `assets/img/hero.jpg`.
- The hero background is decorative (`alt=""`); keep the copy meaningful without it.

To change the banner for visitors, edit that section directly. There is no in-browser banner editor.

## Contact details

- Email: **bitbybitja@gmail.com** — present on every public page footer, the FAQ contact card, and the charity page.
- Instagram: **[@bitbybitja](https://www.instagram.com/bitbybitja/)** — lowercase `bitbybitja`; the handle is case-sensitive on the account itself. It is linked in every footer, the home community panel, and the FAQ.

If the handle changes:

1. Search for `bitbybitja` across the HTML files.
2. Replace the display text and the `https://www.instagram.com/…` URL.
3. Update the FAQ contact answer and the home community block.

## Theme

All colours live in `:root` in `assets/css/site.css`:

```css
--pink: #ffbfdc;
--green: #bbec72;
--yellow: #ffde59;
--azure: #91ccff;
--lavender: #c9abe4;
```

Legacy aliases (`--mint`, `--lemon`, `--blue`, `--purple`) point at the new values, and soft background tints are defined alongside them. Calendar category colours in `assets/js/schedule-core.js` and the legend dots in the schedule pages use the same palette.

Typography uses Pixelify Sans for headings and buttons, and Inter (`--label`) for small uppercase labels: navigation, breadcrumbs, eyebrows, tags, filter buttons, product cards, table labels, and footer headings. This keeps the pixel look while making short words such as “Charity” legible at small sizes. Donation and statistic figures also use Inter with tabular numerals so digits such as the `2` in `20%` read clearly.

## Image placeholders still in use

Real product, process, hero, and logo images are in place. These placeholders remain:

| File | Used for | Recommended |
| --- | --- | --- |
| `assets/img/charity-placeholder.svg` | Charity page + home charity spotlight | 1200 × 800 |
| `assets/img/team-placeholder.svg` | About team cards + group photo slot | 600 × 600 |

Notes:

- Page-level photos in `<figure class="img-frame" data-slot="…">` show a small **IMG SLOT** badge. Remove the `data-slot` attribute after swapping in a real photo.
- Product photo paths live in `assets/js/products.js`; collection tile paths are in `index.html`.
- Use compressed WebP/JPEG for new photos. If the aspect ratio changes, update the `width`/`height` attributes and the relevant CSS `aspect-ratio`.

## Placeholder content to replace

- Charity partner name, mission, location, website, and story (20% pledge is real).
- Team names and photos on the about page.
- FAQ draft answers for shipping, payment, reservations, and custom lead times.
- Product descriptions and **Price TBD** labels.
- Sales-day times.

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
    │   ├── products.js      # magnet catalogue, filters, quick view
    │   ├── schedule-core.js # shared calendar rendering/helpers
    │   ├── schedule-data.js # published events
    │   ├── schedule.js      # read-only public calendar
    │   └── schedule-admin.js# private team editor/draft/publish
    └── img/
        ├── products/        # six 800 × 600 product photos
        ├── logo-mark.png    # transparent brand logo
        ├── hero.jpg
        ├── process.jpg
        └── …                # favicon, charity/team placeholders
```

## Accessibility and behavior notes

- Skip links, semantic headings, native `<dialog>` modals, keyboard-operable nav, visible focus styles, and reduced-motion support.
- The public calendar is intentionally non-editable: static event chips, no add buttons, no editor dialog.
- The team editor page is `noindex,nofollow` and unlinked from public pages.
- The calendar grid scrolls horizontally inside its card on narrow screens.
- Fonts come from Google Fonts (`Pixelify Sans`, `Press Start 2P`, `Inter`) with local fallbacks.
- The site works without JavaScript for reading copy, but product cards, filters, the calendar, and the team editor require JavaScript.
- Browser storage may be blocked in private modes; the team editor reports save failures instead of silently claiming success.
