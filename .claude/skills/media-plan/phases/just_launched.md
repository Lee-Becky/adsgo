# Phase: just_launched

> **Visual ground truth: [`../references/visual-ground-truth/just_launched.html`](../references/visual-ground-truth/just_launched.html)** — open this file before generating. Mirror its DOM structure section-by-section. Replace only brand-specific content (brand name, KPI target value if set, real progress timestamps).

## Mission

Ads are live but too young to judge. The page's job is **reassure while directing attention**: confirm the launch went through, list the high-value setup items still unchecked, frame the learning window, point at 1–2 things the user should tune now so the learning period isn't wasted.

## Sections (in order)

The ground truth file contains these sections in this order:

1. **Header banner** — emerald celebratory `bg-white rounded-[20px] shadow + px-6 py-5` with rocket icon tile (`bg-emerald-100`) + "Your ads are live!" + sub-copy "N campaigns published — here's what's happening now"
2. **Optimize Goals Spotlight** — conditional warning card (`bg-amber-50 border-amber-200 rounded-xl p-5`) with `border-l-4 border-l-amber-400` if KPI target is unset OR misaligned vs S1 industry benchmark; otherwise success/aligned variant. Ring-haloed icon tile + headline + body + 2 CTA buttons
3. **2-column grid** (`lg:grid-cols-2 gap-4`):
   - **Launch Progress** card — vertical 4-step timeline (each step: 8×8 rounded-full color-tinted icon-tile + title + "Completed Xh ago" or "In progress · last sync Xm ago" or "Upcoming · in ~Xh")
   - **Complete Your Setup** checklist — 2x2 grid of toggle/navigate items (each: 7×7 colored icon-tile + title + sub-copy + small CTA link with `data-action`)
4. **Setup Complete Celebration** (conditional) — gradient `bg-gradient-to-r from-emerald-50 to-teal-50` banner with PartyPopper icon, only renders when all setup items are checked
5. **What to Expect Timeline** — single card with 3-stage horizontal timeline (Week 1 amber Learning / Week 2 sage Optimizing / Week 3 emerald Scaling), each stage is `rounded-lg p-4` with stage badge + headline + 2-sentence body citing S1 benchmark or S3 seasonal context

## Content guidance per section

### Header banner
- "N campaigns published — here's what's happening now and what to set up before the learning window closes." (replace N with actual count from state signal `campaigns_active_count`)
- Tone: supportive, patient. Early signal is noisy.

### Optimize Goals Spotlight
- If brand has a KPI target set AND it's within 1.5x of the S1 industry benchmark → success variant (no spotlight, or compact "Target aligned with industry" green pill)
- If brand has a target but it's > 1.5x industry benchmark → warning variant: "Your ROAS target looks aggressive vs industry" + body citing benchmark with `data-source` URL + 2 CTA buttons (`Adjust KPI target` + `Keep as-is`)
- If brand has NO target → warning variant: "Set your KPI target so AI can optimize" + CTA `Set target now`

### Launch Progress
- 4 steps in this order:
  1. Campaigns submitted to Meta & Google (Completed timestamp)
  2. Ads passed review, entering delivery (Completed timestamp)
  3. AI syncing performance hourly (In progress, last-sync timestamp)
  4. First budget optimization cycle / Full Running Media Plan unlocks (Upcoming, ETA based on `days_since_first_publish`)
- Use real timestamps if host provides; otherwise reason from `days_since_first_publish` (if 14h ago → step 1+2 done, step 3 in progress, step 4 in ~10h)

### Complete Your Setup
- 4 items in 2x2 grid (or 2x1 + 2x1 stacked on small screens):
  - Enable AI Budget Optimization (amber `data-action="enable-auto-execute"` `data-nav-to="ad-manager"`)
  - Enable Auto Creative Regen (blue `data-action="enable-auto-regen"` `data-nav-to="auto-regeneration-settings"`)
  - Verify conversion tracking (sage `data-action="configure-tracking"` `data-nav-to="integrations"`)
  - Upload more creatives (purple `data-action="upload-creative"` `data-nav-to="creative-library"`)
- Each shows: completed (`bg-emerald-50 border-emerald-200` with check icon + "X is now managing budgets automatically") OR pending (`bg-white border-gray-200` with icon + sub-copy + `Enable →` link)

### What to Expect Timeline
- 3 stages in `grid-cols-1 md:grid-cols-3 gap-4`
- Each stage card: tinted bg matching stage color (Week 1 = amber-50; Week 2 = sage/emerald-50; Week 3 = blue-50/sky-50)
- Body cites S1 (Meta typically needs ~50 conversions per adset for learning) and S3 (relevant seasonal events in the 14-day window)

## Hard rules for this phase

- **Mirror the demo structure exactly.** Layout is fully stable across brands.
- **Dynamic sections**: Optimize-goals-spotlight (KPI vs S1), Launch-progress (timestamps), Expected-timeline (cite S1+S3) — these change per brand.
- **Static-ish sections**: Header banner, Complete-your-setup (4 items are universal), Celebration banner — reuse demo copy with brand-name swap.
- **Tone**: supportive, patient. Don't over-celebrate; don't rush to forecast numbers.

## Allowed `data-nav-to` values (whitelist)

`optimize-goals` · `ad-manager` · `creative-library` · `analytics-dashboard` · `auto-regeneration-settings` · `integrations`

Plus any value in `brand.custom_menu_names[]`.

## Degradation table

| Brand field missing | Effect |
|---|---|
| No KPI target | Optimize-goals-spotlight goes warning + "Set target now" CTA |
| S1 returned nothing | Optimize-goals comparison falls back to "Industry data unavailable; we'll calibrate after Day 7"; expected-timeline omits the benchmark citation |
| S3 returned nothing | Expected-timeline week 3 stage still rendered but without seasonal callout |
| `campaigns_active_count` not host-provided | Header banner says "Your ads are live!" without the count |
