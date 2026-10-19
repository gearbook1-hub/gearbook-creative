# Hosting, access and deploys

Who can see the hub, where finished files live, and how to confirm a deploy. Facts checked 2026-10-18 and 2026-10-19. The code wins over this file.

## Who can see it
- The repo `gearbook1-hub/gearbook-creative` is **public**, and GitHub Pages serves the hub publicly at https://gearbook1-hub.github.io/gearbook-creative/. Anyone with the link can see every page and piece, and read every piece's code and props, without being a contributor or signing in. Being a contributor only controls who can push.
- So nothing private goes in the repo: no secrets, member data, unreleased partner details or other people's videos (see CLAUDE.md rules).
- Making the hub private means a private repo plus Pages access control (a paid GitHub plan), or putting it behind Cloudflare Access like next.gearbook.shop. Not decided; nobody has asked for it.

## Downloads from the library (asked 2026-10-19, set aside)
Luke asked for download buttons on the library, then said "nevermind". What was found, for next time:
- Renders can't go in the repo: overlays are 190 to 310 MB each, GitHub refuses files over 100 MB, and the repo rule is no videos.
- **Google Drive** (GearBook Drive, Marketing/Reels, where the signup reel's master is) keeps downloads to the people the folder is shared with, even though the library page is public. Recommended.
- **GitHub Releases** takes files up to 2 GB, but on a public repo anyone with the link can download them.
- Risks of a public download: anyone could reuse finished GearBook videos, and they contain retailers' product photos (`product-photos.md`). There is no member data or secret in them.

## Confirming a deploy
- Every push to `main` runs "Deploy hub to GitHub Pages". Watch **that commit's** run: `gh run list --commit <sha>` (a plain `gh run list -L 1` just after a push can still show the previous run), then `gh run watch <id> --exit-status`, then `curl` a new file's URL for a 200.
- 2026-10-19: a deploy failed in `npm run build` with "next/font/google queries have exactly one entry" while fetching Outfit for `app/layout.tsx`, on a commit that didn't touch it. Re-running the job passed. Re-run once; if it fails again, it's real.
- Locally, type errors inside `.next/types/validator.ts` after pages change are a stale `.next`: `rm -rf .next` and build again.
- The library page (`app/library/page.tsx`) lists real pieces by hand. A new piece in `data/pieces.json` doesn't appear there until it's added to that page.
