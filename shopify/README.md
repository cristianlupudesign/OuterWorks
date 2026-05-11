# Shopify Sticker Editor

A self-contained Shopify Liquid page template that lets a customer:

- Upload an image (PNG, JPG, WEBP or SVG, up to 20 MB)
- Preview a die-cut sticker look on a white sticker base, with the 3 mm
  bleed marked by a red dashed ring
- See the chosen dimensions printed on the preview
- Pick a size in millimetres (20–500 mm per side)
- Pick a finish: no lamination, glossy laminate, or matte laminate
  (preview reflects each visually)
- Pick a quantity, with tiered discounts shown in real time
- Add to cart with all options captured as line item properties

The page is **preview only** — no print-ready artwork is generated. The
customer's original file is uploaded to Shopify's hosted async uploader
so the URL travels on the order line for the store owner to download.

---

## Install

1. Copy `templates/page.sticker-editor.liquid` into your theme's
   `templates/` folder. In the Shopify admin: **Online Store > Themes >
   ⋯ > Edit code > Add a new template > Page > sticker-editor**, then
   paste the file's contents.

2. Create a product called **Custom Stickers** (one variant, any
   placeholder price). Note its variant ID — the long number at the end
   of the variant URL in the admin.

3. Open the new template file in the theme editor and replace:

   ```js
   var STICKER_VARIANT_ID = 0000000000000;
   ```

   with the real variant ID.

4. Create a page (**Online Store > Pages > Add page**) and at the bottom
   of the page editor set **Theme template** to `sticker-editor`.

5. *(Optional but recommended)* Set up automatic discounts in
   **Discounts > Create discount** that mirror the `QUANTITY_TIERS`
   array in the template, so the cart total matches the preview:

   | Quantity   | Discount |
   |------------|----------|
   | 1–9        | —        |
   | 10–49      | 10% off  |
   | 50–99      | 20% off  |
   | 100–249    | 30% off  |
   | 250+       | 40% off  |

   Edit these tiers in the template if you want different thresholds.

## Tuning prices

In the template's `<script>` block:

```js
var BASE_PRICE = 1.50;     // minimum per sticker
var AREA_FACTOR = 0.45;    // per 1000 mm² of area
var FINISH_FEE = {
  'None': 0,
  'Glossy laminate': 0.15,
  'Matte laminate': 0.20
};
```

`unit price = BASE_PRICE + AREA_FACTOR * (width_mm * height_mm / 1000) +
finish fee`. The discount tier is then applied to `unit * qty`.

## Notes

- The product variant in Shopify must have a base price set; the
  template uses Shopify's automatic discounts to reach the displayed
  total. The variant price should equal the highest unit price you ever
  expect, so discounts only ever subtract — never add.
- For a fully custom per-line price, switch to Shopify Plus and Scripts,
  or use a draft-order / app proxy approach.
- The customer's uploaded file is sent to `/tools/async_uploader`, a
  built-in Shopify endpoint, and the resulting URL is added to the line
  as the `Artwork` property. To skip uploading and collect art by email
  instead, set `SKIP_UPLOAD = true` in the template.
