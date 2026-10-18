# Roca on the hosted hub (Adobe Fonts)

Roca comes from Matt's Adobe Fonts web project `aac5uoe`, the same one gearbook.shop uses. Only Matt can change it, from his Adobe account.

## Status
Checked 2026-10-18: Roca loads on https://gearbook1-hub.github.io/gearbook-creative/, in the hub and inside the motion pieces, with no changes to the Adobe project. Nothing to do unless that changes.

## Check first
Open https://gearbook1-hub.github.io/gearbook-creative/. If the big title "How the motion mod *thinks*" is in Roca (rounded, chunky serif, same as gearbook.shop), nothing needs doing. If it's a thinner, plainer serif (Newsreader, the fallback), follow the steps below.

## Steps for Matt
1. Go to https://fonts.adobe.com and sign in with the Adobe account that owns the GearBook fonts.
2. Top right, click the **Web Projects** icon (the `</>` icon). You can also go straight to https://fonts.adobe.com/my_fonts#web_projects-section.
3. Find the project whose embed code is `aac5uoe` (the one used by gearbook.shop) and click **Edit project**.
4. If the project has a **Domains** field, add these on separate lines, then **Save changes**:
   - `gearbook1-hub.github.io`
   - `localhost` (for running the hub on your own computer)
5. Wait a few minutes, then hard-refresh the hub (Ctrl+Shift+R, or Cmd+Shift+R on a Mac).

Changes can take up to a few minutes to reach Adobe's servers. Adding a domain doesn't change anything on gearbook.shop.
