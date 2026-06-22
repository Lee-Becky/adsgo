# Phase: running

> **Visual ground truth: [`../references/visual-ground-truth/running.html`](../references/visual-ground-truth/running.html)** — open this file before generating. Mirror its DOM structure section-by-section. Replace only brand-specific content (brand name, dimension labels, real numbers from S1/S2/S3, calendar-week dates, action copy). Every gradient, ring, animation, color treatment, and visualization in that file is part of the reference design and must be preserved.

## Mission

Campaigns are live past day 1. The page answers "Is the money working?" and "What should change this week?" in the same view, while keeping the brand's strategic context defensible for every recommendation.

## Sections (in order)

The ground truth file `running.html` contains these sections in this order. Copy each section's DOM, swap content:

1. **Summary** — sentiment-styled card (emerald / amber / gray based on KPI trend) with `border-l-4` left-accent + `ring-4` icon halo + headline + 2-paragraph body + right-side area-chart sparkline with target reference line
2. **Weekly Strategy** — wrapper card containing 4 week-cards in `lg:grid-cols-4` grid: past (dimmed emerald) / current (primary gradient + `week-breathe` + `infinity-pulse` ∞ pill) / upcoming (dashed gray)
3. **Multi-dimensional Diagnostic (Score-card)** — lavender section bg + radar SVG + flow connector + gradient detail panel + click-driven carousel pattern (`<problem-box>` + `<detail-panel>` + bottom dot-progress with statically-filled active pill; switching by clicking pill or radar axis label)
4. **Optimization Review** — 2-column `lg:grid-cols-2` containing:
   - Left: AI Operations card with 3-up icon-tile metric strip + horizontal SVG serpentine timeline with `animateMotion` flowing dots + foreignObject mini-cards
   - Right: Highlights card with 4-up Action Benefits grid + 4 color-tinted best-performer cards

## Content guidance per section

What to fill in (the structure is fixed by ground truth; this guides the brand-specific reasoning):

### Summary
- Pick sentiment based on KPI trend vs target: improving toward target = emerald; declining or stuck = amber; flat baseline = gray
- Headline: "ROAS trending upward — N% gap to target" / "ROAS needs attention — here's what we're doing" / "Building performance baseline" — concrete, no jargon
- Body lede (bold first sentence): exact past 7-day delta with from-to numbers
- Body remainder: causal factors (cite S1 benchmark, brand-specific mechanisms), this week's focus, next user action
- Sparkline: 7 KPI data points + dashed target reference line + date labels
- **No** "AI-powered intelligent" / "全链路赋能" / generic claims

### Weekly Strategy
- Use real **calendar weeks** (ISO 8601, Mon–Sun by default; Sun–Sat for US-only `target_region`; honor `brand.week_start_day` if provided). Generated 2026-04-27 → W0 = 2026-04-27 → 2026-05-03; W-1 = 2026-04-20 → 2026-04-26; W+1 = 2026-05-04 → 2026-05-10; W+2 = 2026-05-11 → 2026-05-17.
- Each `<li>` carries `data-week-start` / `data-week-end` ISO dates.
- Each card: status pill, date range (localized format), Core Objective (one line), AI Plan (3 bullet items, each a concrete action), You Need To Do (2–4 todos with line-through for completed)
- W+1 / W+2 AI Plan items inject S3 seasonal/platform results with `data-source` URLs

### Multi-dimensional Diagnostic (score-card)
- **5 dimensions**, agent-chosen for THIS brand's situation. Pick from the brand's actual levers — do NOT use a generic 5-tuple. Reasoning sources:
  - `marketing_goal` (conversion / awareness / retention shifts which dims matter)
  - `product_lifecycle` (introduction / growth / maturity changes priorities)
  - `dimensions.impact_analysis.impact_factors[]` (high-importance factors map to dimensions)
  - `marketing_channels[]` (concentration vs diversification)
  - Observed performance signals if host provides
  - S1/S2/S3 search intel (competitor moves → "competitive response" dim; upcoming events → "seasonal readiness" dim)

#### MANDATORY carousel structure (matches the reference design demo exactly)

Switching is **click-driven only** — no auto-rotation. The user clicks either a dim-progress pill or a radar axis label to switch the visible dim. Every dim's content lives in a `<template>` block; the visible panel and problem-box are populated from whichever template is currently active. **The agent MUST emit:**

1. **`[data-role="active-dim-detail"]`** — the visible right-side panel. Initial render mirrors the **top-priority** dim's template content (largest gap × strategic relevance to `marketing_goal`). Carry `data-dimension="{active-slug}"` on this element.

2. **`[data-role="dim-progress"]`** — the bottom 5-pill dot navigator (matches the reference design demo's `dim-progress` div). Each `<button>` carries:
   - `data-nav-dim="{slug}"` — the dim slug, MUST match a template id below
   - `class="relative w-8 h-1.5 rounded-full overflow-hidden"`
   - Active pill (matching `data-dimension` on slot): `style="background:#f3f0ff"` + child `<div class="absolute inset-y-0 left-0 rounded-full score-bar-fill" style="background:var(--mp-primary, #7033F5);width:100%">` (statically filled — no animation)
   - Other pills: `style="background:#f3f4f6"` + no child fill

3. **`<template id="dim-{slug}">`** — emit one for **EACH of the 5 dimensions** (including the active one). Place all five together inside `[data-section="score-card"]`, after the dim-progress navigator. Each template's INTERIOR content matches the active panel's structure exactly:
   ```html
   <template id="dim-{slug}">
     <!-- header: number tile + label + before→after subtitle -->
     <div class="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 border-l-[3px] pl-4 -ml-1 rounded-l" style="border-left-color:var(--mp-primary)">
       <div class="w-11 h-11 rounded-xl flex items-center justify-center" style="background-color:var(--mp-primary-50)">
         <span class="text-lg font-bold" style="color:var(--mp-primary)">{current}</span>
       </div>
       <div class="flex-1">
         <h4 class="text-sm font-bold text-gray-900">{dim_label}</h4>
         <p class="text-[11px] text-gray-500 mt-0.5">Current <strong style="color:var(--mp-primary)">{current}</strong> → After optimization <strong class="text-emerald-600">{after}</strong></p>
       </div>
     </div>
     <!-- score bar (double layer: potential dashed bg + current solid) -->
     <div class="mb-5"><div class="h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
       <div class="absolute inset-y-0 left-0 rounded-full" style="width:{after/5*100}%;background:var(--mp-primary-50);border:1px dashed var(--mp-primary-mid)"></div>
       <div class="absolute inset-y-0 left-0 rounded-full" style="width:{current/5*100}%;background:var(--mp-primary)"></div>
     </div></div>
     <!-- AI Will Do — 3 numbered, primary color -->
     <div class="mb-5">
       <div class="flex items-center gap-1.5 mb-2.5"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" style="color:var(--mp-primary, #7033F5)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg><p class="text-[11px] font-semibold tracking-wide" style="color:var(--mp-primary, #7033F5)">{AI/system label — host's product name or "AI Will Do"}</p></div>
       <ul class="space-y-2.5">
         <li class="text-xs text-gray-700 flex gap-2.5 leading-relaxed"><div class="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style="background:var(--mp-primary-50)"><span class="text-[10px] font-bold" style="color:var(--mp-primary)">1</span></div>{action 1}</li>
         <!-- ...2, 3 -->
       </ul>
     </div>
     <!-- Your Actions — 2-3 numbered, amber -->
     <div class="mb-5">
       <div class="flex items-center gap-1.5 mb-2.5"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg><p class="text-[11px] font-semibold text-amber-600 tracking-wide">Your Actions</p></div>
       <ul class="space-y-2.5">
         <li class="flex gap-2.5"><div class="w-5 h-5 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5"><span class="text-[10px] font-bold text-amber-500">1</span></div><span class="text-xs text-gray-700 leading-relaxed">{your action 1}</span></li>
         <!-- ...2 -->
       </ul>
     </div>
     <!-- Expected Impact — emerald tint -->
     <div class="rounded-lg px-4 py-3 bg-emerald-50/60 border border-emerald-100">
       <p class="text-[11px] font-semibold text-emerald-700 tracking-wide mb-1.5">Expected Impact</p>
       <div class="flex items-center gap-2 mb-1">
         <span class="text-xs text-gray-600">Score:</span>
         <span class="text-xs font-bold" style="color:var(--mp-primary)">{current}</span>
         <span class="text-xs text-gray-400">→</span>
         <span class="text-xs font-bold text-emerald-600">{after}</span>
       </div>
       <p class="text-[11px] text-gray-600 leading-relaxed">{expected impact paragraph}</p>
     </div>
   </template>
   ```

4. **Problem-box card** below the radar, inside the LEFT column. Carries ids `pb-title`, `pb-score`, `pb-text` (matching the reference design demo). Initial values from the active dim's data; the swap script updates these in sync with the detail panel.

5. **Radar axis labels** (the 5 `<text>` elements inside the radar SVG): each MUST carry `data-axis-id="{slug}"` matching one of the template ids — this is what enables "click radar axis label to switch dim", one of the two switch entry points (the other being dim-progress pills).

Click handling runs in the host React app (production) OR in the preview wrapper's script (`references/preview-wrapper.html`) — bare fragment is JS-free; preview wrapper has the ~45-line driver. Either way the swap is **template-driven**, so emitting all 5 `<template>` blocks is what makes the carousel work. Without them, the visible panel sits frozen on the active dim. Switching is **manual only** — there is no auto-rotation timer.

#### Detail-panel content per dimension

Each template's interior copy:
- **Header**: `{current}` score + `{dim_label}` + before→after preview (current → current+potential, capped at 5)
- **Problem diagnosis** (1–2 sentences, concrete, cite S1/S2 if relevant; appears in problem-box, NOT inside the template — but use the same problem text in the template's body if needed for reference). Place it in the active-dim-problem card (with id `pb-text` in the reference design demo) for the active dim, and the swap script copies it from each template on switch — to enable that, optionally include a hidden `<p data-role="dim-problem">{problem}</p>` inside each template.
- **AI Will Do**: 3 numbered actions, brand-primary numbered tile, concrete (verb + object + outcome). Cite S1/S2/S3 inside copy where relevant.
- **Your Actions**: 2–3 numbered amber-tile actions. Each should map to a `data-action` from the whitelist when the user click is "do this thing in the app".
- **Expected Impact**: range with method ("projected +12–25% over 10–14 days, based on …"), emerald-tinted box.

- Reuse the demo's exact radar SVG geometry; only swap axis labels and dot positions.

### Operations Review — Operations side (left)
- Top 3-up metric strip: Budget Suggestions count / Creatives Regenerated count / Campaigns Recommended count from past 7 days
- Serpentine SVG timeline: 7 nodes total = 4 past (filled green circles) + 3 upcoming (white dashed circles, opacity 0.5). Past path solid, upcoming path dashed. `animateMotion` arrow + 3 trailing dots flowing along the dashed segment to indicate "what comes next is moving toward us"
- Each node has a `<foreignObject>` mini-card alternating above/below the path: 14×14 type-icon-tile (color matches action type) + 2-line description + time
- Action types and their icon/color: budget-optimize (blue dollar) / regen-creative (purple sparkles) / recommend-campaign (amber layers) / pause-campaign (gray pause) / publish-campaign (emerald rocket) / policy-update (sky info)

### Operations Review — Highlights side (right)
- "Action Benefits" 4-up metric grid (use the demo's exact treatment): each card is `bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-md` with metric icon + big delta + attribution sentence. The 4 metrics typically: ROAS / CTR / CPA / Conversions (or the 4 most relevant to the brand's `marketing_goal`)
- Divider
- "Highlights" 2x2 best-performer cards (use demo's color-tinted treatment): blue (LAL audience) / purple (UGC ad) / amber (creative) / emerald (campaign) — each `rounded-lg border bg-{color}-50 p-3` with type-icon-tile + name + date + achievement (e.g. "ROAS 5.2x (target 4.5x) · $1,240 spend")

## Hard rules for this phase

- **Mirror the demo structure exactly.** If a section in `running.html` uses 4-up Action Benefits grid, you use 4-up. If it uses the SVG serpentine timeline, you use that. No "structured rows" / "narrative bullets" simplifications.
- **5 dimensions are agent-chosen, not hardcoded.** Pick what's load-bearing for the brand. The dimension labels in the demo (Budget Optimization / Campaign Recommendation / Creative / Landing Page / KPI Target) are the demo's choice — your brand may need different ones.
- **Calendar weeks are mandatory** — no sliding 7-day windows from "today".
- **Every external number has `data-source`** — S1 benchmarks, S2 competitor data, S3 events.
- **Animations from the demo are required**: `weekBreathe` on current week, `infinityPulse` on ∞ pill. Copy the keyframes verbatim into the root `<style>` block. **No** `scoreProgress` — dim-progress active pill is statically filled (`width:100%`); switching is click-driven (click pill or radar axis label).
- **Content reasoning is fully dynamic** — don't copy demo's text; reason from the brand's data + search intel.
- **Voice**: data-first, verb-first. "Reallocated $480/day…" not "We think perhaps you could consider…"

## Allowed `data-nav-to` values (whitelist for this phase)

`ad-manager` · `campaign-editor` · `batch-campaign-generator` · `optimize-goals` · `creative-library` · `analytics-dashboard` · `auto-regeneration-settings` · `billing-budget`

Plus any value the brand profile lists in `custom_menu_names[]`.

## Degradation table

| Brand field missing | Effect |
|---|---|
| No KPI target | Summary defaults to "Building baseline" sentiment + neutral copy; status-bar / score-card.kpi dim go warning |
| `dimensions.impact_analysis.impact_factors[]` empty | Score-card problem diagnoses become shorter; still pick 5 brand-specific dims, just less specific |
| S2 returned nothing for any competitor | Drop the competitor "market signal" banner above the timeline; weekly-strategy still proceeds |
| `marketing_channels[]` empty | Weekly plan channel-specific bullets become generic; flag as `idle` |
| Performance data not host-provided | Action Benefits grid renders with placeholder dashes + `data-card-state="warning"`; do NOT fabricate deltas
