# BitByBit

A static storefront for **BitByBit**, a student-run company in the Junior Achievement Company Program. The visual language is perler-bead pixel art: chunky borders, hard shadows, pegboard textures, and bead-grid accents.

The shop is a **fridge magnet** lineup across four collections. **Snowmelts is limited edition; the other three are permanent lines.**

| Collection | Availability | Theme | Catalogue | Price |
| --- | --- | --- | --- | --- |
| **Snowmelts** | Limited edition | Christmas | Christmas Star, Gingerbread Man, Snowman | $7 CAD |
| **Itty Bitty Canvas** | Permanent | Famous painting recreations | Starry Night, Mona Lisa, Great Wave | $5 CAD (Great Wave $7) |
| **Canadots** | Permanent | Canadian | Canada Flag, Maple Syrup | $5 CAD |
| **Meltimals** | Permanent | Animals | Cat, Beaver, Crab, Penguin, Grey Penguin | $5 CAD |

Product photos are real and the full catalogue is priced in **Canadian dollars (CAD)**. There is no keychain, frame, or desk-product line.

Other live brand details:

- Slogan: **“A bit of fun in every bag.”**
- Instagram: **[@bitbybitja](https://www.instagram.com/bitbybitja/)** (linked from every footer and the FAQ).
- Charity pledge: **20% of net proceeds** to **Upstream Ottawa Mental Health Community Support**.
- Next sales days: **November 14 at St. Laurent Mall, Ottawa, 11:00 AM–1:00 PM** and **December 13 at Merivale Mall, Ottawa**.
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
| `index.html` | Home: new banner, four collection tiles, featured magnets, story/process photo, Upstream Ottawa spotlight, sales-day CTA |
| `about.html` | Company story, JA program, process photo, values |
| `products.html` | Fridge magnet lookbook with collection filters and quick view |
| `schedule.html` | **Read-only** public sales-day calendar |
| `charity.html` | Charity page for Upstream Ottawa and the 20% pledge |
| `faq.html` | Help / FAQ with draft placeholder answers |
| `404.html` | Static not-found page |
| `schedule-admin.html` | Private team schedule editor — unlinked, `noindex`, code-gated |

The admin page is not in the navigation, footer, sitemap, or any public page.

## Products

`assets/js/products.js` is the single source of truth for the catalogue. Each entry has:

- `id`, `name`, `category`, `price`
- `image`, `alt`
- optional `badge` / `badgeClass` (Snowmelts items use the limited-edition badge)
- real `blurb`; quick-view specs are generated from the product's collection, format, finish, and price

Current entries:

| ID | Name | Category | Image |
| --- | --- | --- | --- |
| `snowmelts-christmas-star` | Christmas Star | `snowmelts` | `assets/img/products/christmas-star.jpg` |
| `snowmelts-gingerbread-man` | Gingerbread Man | `snowmelts` | `assets/img/products/gingerbread-man.jpg` |
| `snowmelts-snowman` | Snowman | `snowmelts` | `assets/img/products/snowman.jpg` |
| `itty-bitty-canvas-starry-night` | Starry Night | `itty-bitty-canvas` | `assets/img/products/starry-night.jpg` |
| `itty-bitty-canvas-mona-lisa` | Mona Lisa | `itty-bitty-canvas` | `assets/img/products/mona-lisa.jpg` |
| `itty-bitty-canvas-great-wave` | Great Wave | `itty-bitty-canvas` | `assets/img/products/great-wave.jpg` |
| `canadots-canada-flag` | Canada Flag | `canadots` | `assets/img/products/canada-flag.jpg` |
| `canadots-maple-syrup` | Maple Syrup | `canadots` | `assets/img/products/maple-syrup.jpg` |
| `meltimals-cat` | Cat | `meltimals` | `assets/img/products/cat.jpg` |
| `meltimals-beaver` | Beaver | `meltimals` | `assets/img/products/beaver.jpg` |
| `meltimals-crab` | Crab | `meltimals` | `assets/img/products/crab.jpg` |
| `meltimals-penguin` | Penguin | `meltimals` | `assets/img/products/penguin.jpg` |
| `meltimals-grey-penguin` | Grey Penguin | `meltimals` | `assets/img/products/grey-penguin.jpg` |

To finish the catalogue:

- Set `price` to a number (for example `7`) to render `$7.00 CAD`, or leave it `null` for **Price TBD**.
- Keep every product image at **4:3 (800 × 600)** so cards and quick view stay aligned. The new portrait source photos were center-cropped to 4:3 during processing.
- Update `FEATURED_IDS` if the home-page selection should change.
- All prices render with CAD in `money()`. Update that helper if the currency changes.

### Collection copy

Each collection has one tagline and one description. The full copy renders in the four `.collection-card` articles in `products.html`; the short tagline also appears in the home-page `.collection-tile__tagline` spans in `index.html`. Edit both places together.

| Collection | Tagline | Description |
| --- | --- | --- |
| Snowmelts | Deck the fridge. Fill the stocking. | Festive Christmas magnets that dress up the house for the holidays and make an easy stocking stuffer. |
| Itty Bitty Canvas | A masterpiece, fridge-sized. | Great paintings rebuilt bead by bead — a tiny Louvre for your fridge door. |
| Canadots | Proudly pixelated, eh. | From coast to coast to fridge: Canadian icons in perler beads. |
| Meltimals | No fur. No mess. All charm. | Perler-bead animals that melt your heart — pick one and give it a home on the fridge. |

Home-page collection tiles and the hero banner use the four collection line photos in `assets/img/collections/` and link to the matching `?category=` filter. Collection keys are `snowmelts`, `itty-bitty-canvas`, `canadots`, and `meltimals`.

Availability is carried by the card badge only where it matters: Snowmelts uses **Limited edition** (`tag--pink`); the three permanent lines are unbadged. The collection cards on the shop page also show each line's starting price.

## Brand assets

- `assets/img/logo-mark.png` — the BitByBit pixel banner logo with the black background removed, transparent, 480 × 614.
- `assets/img/favicon-64.png`, `favicon-192.png`, `favicon-512.png` — browser tab, Apple touch, and PWA icons generated from the logo.
- `assets/img/collections/*.jpg` — four collection line photos used by the home banner, collection tiles, and collection cards (900 × 675).
- `assets/img/process.jpg` — behind-the-scenes production photo (1200 × 900), used on the home story and about pages.
- `assets/img/products/*.jpg` — thirteen product photos, 800 × 600.
- `assets/img/upstream-ottawa.png` — Upstream Ottawa charity mark, transparent 500 × 500.

The light header, footer, and community panel place the white logo on a dark ink plate, so keep the transparent PNG rather than flattening it onto white.

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
| 2026-11-14, 11:00 AM–1:00 PM | BitByBit at St. Laurent Mall | St. Laurent Mall, Ottawa |
| 2026-12-13 | BitByBit at Merivale Mall | Merivale Mall, Ottawa |

St. Laurent Mall is published as **11:00 AM–1:00 PM**. Merivale Mall still shows **Time TBA** until the team adds its start/end times. The page opens on the next month that has a sales day instead of the current month when the current month is empty.

To publish a change, use the team editor or edit `assets/js/schedule-data.js` directly, then bump the `?v=` query on the `schedule-data.js` script in `schedule.html` and `schedule-admin.html` (currently `?v=second`) or purge the host cache.

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
6. Bump the letters-only `?v=second` query string on the schedule-data script in `schedule.html` and `schedule-admin.html` (for example `?v=third`, then `?v=fourth`) or purge the host cache so visitors receive the new dates.

The public page reads only the static published file. Editing the local draft does not change what visitors see until the file is replaced and deployed.

Editor details:

- **Reset draft** restores the draft from the currently published schedule.
- Event fields: title, type, date, start/end, location, internal notes.
- Internal notes are stored in the data file but are **not displayed** on the public calendar.
- The public page shows the `updated` timestamp from the published file as “Last published …”.
- Categories: `sale`, `market`, `school`, `custom`, `other`.

## Home banner

The new home banner is a light, pastel hero built from markup and the four collection line photos:

- Copy lives in `.hero__content`; the four linked collection cards live in `.hero__banner`.
- Collection images are `assets/img/collections/*.jpg`; each card links to its `?category=` shop filter.
- The background is a CSS pastel gradient with a pegboard dot texture. No hero background image is required.
- To change the banner, edit the `#hero` section in `index.html`. There is no in-browser banner editor.

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

The site uses light cream, pink, azure, and lavender surfaces with deep plum text and borders. Legacy aliases (`--mint`, `--lemon`, `--blue`, `--purple`) point at the palette values, and soft background tints are defined alongside them. Calendar category colours in `assets/js/schedule-core.js` and the legend dots in the schedule pages use the same palette.

Typography uses Pixelify Sans for headings and buttons, and Inter (`--label`) for small uppercase labels: navigation, breadcrumbs, eyebrows, tags, filter buttons, product cards, table labels, and footer headings. This keeps the pixel look while making short words such as “Charity” legible at small sizes. Donation and statistic figures also use Inter with tabular numerals so digits such as the `2` in `20%` read clearly.

## Images

Real product, collection, process, logo, and charity images are in place. There are no image placeholders left.

- Product photo paths live in `assets/js/products.js`; collection photo paths live in `index.html` and `products.html`.
- Use compressed WebP/JPEG for new photos. If an aspect ratio changes, update the `width`/`height` attributes and the relevant CSS `aspect-ratio`.
- Product cards and quick view use 4:3 images; collection tiles crop square; collection cards crop 16:10.

## Content still to confirm

- FAQ answers for shipping, payment, reservations, and custom lead times.
- Product size and material details.
- Merivale Mall sales-day times.

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
        ├── products/        # thirteen 800 × 600 product photos
        ├── collections/     # four 900 × 675 collection line photos
        ├── logo-mark.png    # transparent brand logo
        ├── upstream-ottawa.png
        ├── process.jpg
        └── …                # favicon
```

## Accessibility and behavior notes

- Skip links, semantic headings, native `<dialog>` modals, keyboard-operable nav, visible focus styles, and reduced-motion support.
- The public calendar is intentionally non-editable: static event chips, no add buttons, no editor dialog.
- The team editor page is `noindex,nofollow` and unlinked from public pages.
- The calendar grid scrolls horizontally inside its card on narrow screens.
- Fonts come from Google Fonts (`Pixelify Sans`, `Press Start 2P`, `Inter`) with local fallbacks.
- The site works without JavaScript for reading copy, but product cards, filters, the calendar, and the team editor require JavaScript.
- Browser storage may be blocked in private modes; the team editor reports save failures instead of silently claiming success.
