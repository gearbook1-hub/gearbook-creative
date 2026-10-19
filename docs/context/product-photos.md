# Product photos for mockups

Where the product pictures in a piece come from, and the limits on getting them. Learned building M28 (2026-10-18). The code wins over this file.

## Sources, in order
1. **gearbook.shop's own pages.** `curl https://www.gearbook.shop/shop/<category>` and read the `<img src=… alt=…>` tags; the product images there are what members already chose. Categories (2026-10-18): climbing, skiing-splitboarding, hiking-backpacking, water-sports, boating-sailing, film-photography. Small: climbing had about a dozen products, nothing alpine.
2. **The retailer's own listing**, for a product GearBook's pages don't have. Backcountry blocks plain `curl` (202, empty body), so open backcountry.com in the browser pane and run `fetch('/Store/catalog/search.jsp?q=…')` from that page, parsing the result with `DOMParser`. Product images are at `content.backcountry.com/images/items/large/<BRAND>/<SKU>/<COLOUR>.jpg`, and those URLs download fine with `curl`.
3. **The partner product mirror** (gearbook repo, Cloudflare D1) is what pros really search, but it needs `MIRROR_API_URL` and a key. This machine has no staging key, and the production mirror is off limits for this. Don't use it for mockups unless a staging key is set up.

## Preparing them
- Shrink each to a 180x180 JPEG on white (`ffmpeg -vf "scale=180:180:force_original_aspect_ratio=decrease,pad=180:180:(ow-iw)/2:(oh-ih)/2:color=white" -q:v 4`): 2 to 9 KB each. Save to `public/pieces/<piece>/products/<short-name>.jpg` and reference by short name in the props.
- Show them on white tiles with `object-fit: contain` and a small inset, like the shop page; a coloured tile behind a white product photo looks cut out.
- Check them all in one `hstack` strip before using them.
- Delete photos a piece no longer uses in the same commit.

## Names
- Use the product's real name as the retailer sells it. Backcountry now sells only the GRIGRI+, so M28 says "Petzl GRIGRI+" though Luke asked for a GriGri.

## Rights (open question)
These are the retailers' images, committed to a public repo and shown in GearBook marketing. Showing a retailer's own image to sell that product is normal affiliate use, and M27 already commits screenshots of gearbook.shop that contain them, but no one has checked the partner terms. Ask Luke before handing out bulk downloads of them.
