---
name: tokens
description: Mod 01. Use when GearBook's brand colours or fonts change, or when a piece looks off-brand. Keeps lib/brand.ts and app/globals.css in step with the main site and the iOS app.
---

# Tokens

Sources of truth, in order:
1. `gearbook/app/globals.css` `:root` (the website) for bark, sage, cream, amber, slate and the fonts (Roca from Adobe kit `aac5uoe`, Outfit, Afacad Flux).
2. `GearBook-IOS-App/scripts/make_assets.py` for the dark appearance (page `#17140D`, surface `#241F15`, muted surface `#2E281C`, muted ink `#C9C2AE`, sage-light `#8AAD93`).

When either changes, update `lib/brand.ts` (used by the Remotion pieces) and the variables at the top of `app/globals.css` (used by this hub), then re-run `npm run render:check` so every piece is re-checked with the new values.
