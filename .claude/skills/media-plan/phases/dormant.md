# Phase: dormant

> **Visual ground truth: [`../references/visual-ground-truth/dormant.html`](../references/visual-ground-truth/dormant.html)** — open this file before generating. Mirror its DOM structure section-by-section. Replace only brand-specific content (brand name, historical numbers if host provides, opportunity-cost figures, "why restart now" reasons grounded in S2/S3 search).

## Mission

All campaigns are paused. The page **respects the pause while showing its cost**: honor the user's choice to stop, validate past performance, quantify the opportunity being missed, offer three clear restart paths.

**Hard tone rule**: never shame, never nag, never use "should" or "must". The brand paused for a reason. The page makes restarting easy, not obligatory.

## Sections (in order)

The ground truth file contains these sections in this order:

1. **Paused Status banner** — muted `bg-gray-50 rounded-xl p-6 border border-gray-200` with PauseCircle icon-tile + "Your ads are currently paused" + "Paused for N days · Last active on DATE" + reason sub-line. **NO gradient, NO brand color.** Tone is calm.
2. **3-column main grid** (`lg:grid-cols-3 gap-4`):
   - **Historical Performance** card (left) — `bg-white rounded-xl border-[#F0F0F0] shadow + p-5`. Heading with TrendingUp emerald icon. 5 stat rows (Peak ROAS, Best CPA, Total Conversions, Total Spend, Days Active) — each row `flex items-center justify-between` with label (gray-500) + value (semibold, emerald for ROAS/CPA). Bottom: "Proven track record of success" badge with Target icon
   - **Why Restart Now** card (middle) — same card chrome. Heading with Zap blue icon. 4-bullet list (each `flex items-start gap-2` with blue dot + reason). Bottom: "AI analyzed N top performers during downtime" badge with BarChart3 icon
   - **Opportunity Cost** card (right) — same chrome. Heading with Clock amber icon. 2 stat blocks (`bg-amber-50 rounded-lg p-3` each): "Estimated Lost Conversions" + "Estimated Lost Revenue". Bottom: small caveat about industry-benchmark methodology
3. **Quick Restart Options strip** — gradient `bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6`. Header (icon-tile + title + sub-copy "Choose how you want to restart your campaigns"). 3 button-cards in `md:grid-cols-3 gap-3`, each white-bg button with type-icon (TrendingUp emerald / Zap blue / Target purple) + title + 1-line description.

## Content guidance per section

### Paused Status banner
- "Your ads are currently paused" — universal copy
- "Paused for N days · Last active on DATE" — N from `campaigns_paused_at`, DATE formatted short ("Mar 28")
- Reason sub-line — uses `pausedInfo.reason` if host provides, else generic "Paused manually"
- Tone: matter-of-fact, not alarmist

### Historical Performance
- 5 stats from host's historical performance data: Peak ROAS, Best CPA, Total Conversions, Total Spend, Days Active
- If host doesn't provide → render with `data-card-state="warning"` and "Historical performance data unavailable" text instead. Don't fabricate.

### Why Restart Now
- 4 reasons, each ONE sentence, grounded in real data:
  1. **Saved audience signal** (specific to brand): "Your proven winning audience [name] is saved and ready to re-target" — cite if `historicalPeak.bestAudience` available
  2. **Fresh creative variants** (S2 if relevant): "AI generated N new creative variants during pause"
  3. **Market timing** (S3 must be present): "[Specific event] is N days away — [category] demand typically lifts X% in run-up" with `data-source` URL
  4. **AI analysis during downtime**: "AI analyzed N top performers in your niche during the pause window"
- All 4 must be concrete and specific to THIS brand. No "AI is ready to help you succeed" generic copy.

### Opportunity Cost
- Lost conversions: estimate using `historicalPeak.conversions / historicalPeak.daysActive × pausedInfo.daysPaused` (cite method)
- Lost revenue: estimate using `historicalPeak.spend × historicalPeak.roas / daysActive × daysPaused` or industry benchmark from S1 (cite source URL)
- Caveat: "Based on your historical performance and industry benchmarks" — never present as exact

### Quick Restart Options
- 3 fixed options matching the demo:
  1. **Resume Best Performer** — emerald TrendingUp icon, "ROAS X.Xx campaign from Day Y" sub-copy. `data-action="restart-from-best"` `data-nav-to="ad-manager"`
  2. **Start Fresh with AI** — blue Zap icon, "N new campaigns ready" sub-copy. `data-action="restart-fresh"` `data-nav-to="batch-campaign-generator"` (or `auto-regeneration-settings`)
  3. **Custom Restart** — purple Target icon, "Pick and choose campaigns" sub-copy. `data-nav-to="ad-manager"` (no action; navigates user to choose)

## Hard rules for this phase

- **Mirror the demo structure exactly.** Layout is fully stable.
- **Tone**: respectful, evidence-based. Banned words/phrases: "should", "must", "don't miss out", "exclusive", "limited time", "act now", "you'll regret".
- **Every claim grounded**: historical numbers come from host data; market signals come from S2/S3 search with `data-source` URL; methodology is named for projections.
- **No gradient on the dormant header banner** — calm gray only. The only gradient on this page is the bottom Quick Restart Options strip (blue→indigo, soft).
- **Past tense for the pause** ("Paused on Mar 28"), present tense for what's still available ("your audiences are still warm").

## Allowed `data-nav-to` values (whitelist)

`ad-manager` · `batch-campaign-generator` · `campaign-editor` · `creative-library` · `analytics-dashboard` · `onboarding-restart` · `auto-regeneration-settings`

Plus any value in `brand.custom_menu_names[]`.

## Degradation table

| Brand field missing | Effect |
|---|---|
| Host historical performance data | Historical-Performance card → warning state with "data unavailable"; Opportunity-Cost card pivots to industry-benchmark estimation only (cite S1 URL) |
| `campaigns_paused_at` | Required for accurate "paused N days" — if missing, ask user |
| S2 returned nothing | "Why restart now" reason 2 (fresh creative variants) becomes generic; reason 3 (market timing) requires S3, keep that |
| S3 returned nothing | "Why restart now" reason 3 falls back to a brand-vertical seasonal generality without data-source — flag with `data-card-state="warning"` |
| Both S2 and S3 empty | "Why restart now" still renders 2 reasons (saved audience + AI analysis); flag the card state as warning so user knows external context wasn't fetched |
