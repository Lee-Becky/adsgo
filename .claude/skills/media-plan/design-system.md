# Design System (embedded — no external dependencies)

The skill ships its own design system. **Do not** chain to or depend on any external UI skill. Render the fragment using the tokens, patterns, and quality bar below. The output must look like a finished product page, not an internal report — **and not like an AI slop dashboard**. Read the "AI-slop prevention" section below before emitting HTML.

---

## Zero host dependencies (READ FIRST)

The fragment must render correctly when the host project has loaded ONLY Tailwind base utilities. Do **NOT** assume the host has any of the following:

- A `primary` color in `tailwind.config.js`. Tailwind classes like `bg-primary-500`, `text-primary-600`, `border-primary-200`, `ring-primary-500`, `from-primary-50`, etc. are **forbidden** — they render as black/invisible on a host that hasn't extended its theme. Use `var(--mp-primary*, #hex-fallback)` inline styles for every brand-color surface (see Tokens § below for the full set with HEX fallbacks).
- An icon library. **No** `<i data-lucide="...">`, no `<i class="fa-...">`, no Heroicons component imports. Every icon is **inline SVG** with `stroke="currentColor"` so it inherits the parent's text color. Copy the SVG markup directly from `references/visual-ground-truth/*.html` (already converted) or from lucide.dev source.
- A custom font family. Declare the role variables `--mp-font-ui`, `--mp-font-voice`, `--mp-font-data` on the root and let them resolve to system stacks; the host MAY override.
- Any JS framework or runtime. Bare-fragment output is HTML-only (no `<script>`, no `onclick=`). The optional carousel-driver script lives **only** in `references/preview-wrapper.html` for standalone preview, never in the bare fragment.

**Allowed Tailwind palette names** (built into Tailwind core, present on every install): `gray-*`, `slate-*`, `zinc-*`, `red-*`, `rose-*`, `amber-*`, `yellow-*`, `emerald-*`, `green-*`, `blue-*`, `indigo-*`, `violet-*`, `purple-*`. Use these freely for non-brand colors (success-emerald, warning-amber, error-rose, info-blue, neutrals). Do NOT use any non-default palette name.

**Brand color override path**: hosts that want to re-skin the fragment set `--mp-primary` (and optionally the 50/100/200/300/400/500/600/700 scale) on a parent — the inline-style `var(--mp-primary*, #hex)` calls will pick up the override automatically while retaining the HEX fallback for fresh hosts.

---

## AI-slop prevention — content rules ONLY (NOT visual styling)

**Critical scoping**: anti-AI-slop applies to **content, copy, data, and writing voice**. It does NOT apply to the reference design's component visual styling. Earlier versions of this file conflated the two and banned legitimate reference-design patterns (side-stripe sentiment cards, ring icon halos, multi-color gradients, 4-up metric grids, the score-card carousel, etc.). Those bans are reverted. **The reference design always wins over generic anti-slop heuristics.** See `references/visual-ground-truth/` for the authoritative component palette.

What anti-AI-slop genuinely catches:

**C1. No invented jargon or marketing speak.**
- Banned phrases (Chinese): "跨渠道一键发布", "精准优化", "智能赋能", "全链路", "数据驱动智能决策", "一体化闭环", "全域增长", "高效转化", "品效合一", "私域深耕", "精细化运营".
- Banned phrases (English): "cross-channel synergy", "full-chain integration", "seamless omni-experience", "revolutionary", "paradigm-shift", "next-generation", "AI-powered intelligent", "end-to-end closed loop", "holistic engagement", "precision targeting" (when it just means "targeting").
- **Rewrite**: say exactly what happens. "Publish one campaign to both Meta and Google in one action" not "跨渠道一键发布". "Reallocated $480/day from 3 losing adsets to 2 winners" not "智能预算赋能".

**C2. No fabricated numbers.**
- Every external benchmark, competitor datapoint, or seasonal statistic MUST be wrapped with `data-source="<url>" data-fetched-at="<ISO8601>"` on the smallest enclosing element.
- If you cannot find real data, render the affected card with `data-card-state="warning"` + a one-line "data unavailable" note. Never guess.

**C3. Every action carries a reason.**
- "Do X" alone is incomplete. Each recommendation has a "because…" clause grounded in brand data or S1/S2/S3 search.
- ❌ "Review 3 video creative concepts this week."
- ✅ "Review 3 video creative concepts this week — CTR on the static-only rotation has dropped 22% in 7 days, and video typically recovers 15–25% of CTR within 72 hours."

**C4. Every projection has a range, not a point.**
- ❌ "Projected +18% ROAS in 14 days."
- ✅ "Projected +12–25% ROAS over 10–14 days, midpoint ~18%, based on similar campaign cohort lift in the same vertical."

**C5. Color semantics are consistent.**
- `var(--mp-error)` / red = problems, losses, bans
- `var(--mp-warning)` / amber = caution, attention-needed, pending-your-action
- `var(--mp-success)` / emerald = wins, improvements, completions
- `var(--mp-primary)` / brand color = AI/system action, recommendations
- A ROAS gain uses success-emerald. An AI-generated recommendation uses brand-primary. They are NOT interchangeable.

**C6. No gradient text** (`background-clip: text` + gradient fill). One of the few visual patterns that IS AI slop. Use solid color with weight/size emphasis.

**C7. No degraded visual replacements** (this is a NEGATIVE rule — the failure mode it prevents is "agent simplifies the reference rich components into prose / plain bullets to avoid 'AI slop'").
- If the visual ground truth uses a 4-up metric grid, you use a 4-up metric grid. Do not replace with prose.
- If it uses a `border-l-4` sentiment card, you use a `border-l-4` sentiment card.
- If it uses the score-card carousel pattern, you use the carousel pattern.
- If it uses an SVG serpentine timeline with `animateMotion` flow dots, you use that — do not replace with a vertical `<ol>`.
- **Visual flatness IS AI slop.** Removing the reference design's polish to "look less AI" makes it MORE AI-looking, not less.

### The AI Slop Test (post-generation check)

Two questions, both must pass:

1. **Visual**: "Side by side with `references/visual-ground-truth/<phase>.html`, would a designer say my output is structurally and visually faithful?" If no, restore the missing components.
2. **Content**: "Would a domain expert reading the copy think the recommendations are concrete and grounded?" If they'd say it sounds like marketing fluff or generic AI advice, rewrite.

---

## Animation scoping rules

the reference design's product uses several signature animations on the running phase. They are part of the design, not slop. Use the same keyframes the demo uses — copy verbatim into the root `<style>` block.

### Allowed animations (copy from `references/visual-ground-truth/running.html`)

```css
/* Current-week card glow — purple shadow pulse */
@keyframes weekBreathe {
  0%, 100% { box-shadow: 0 0 20px rgba(112,51,245,0.08); }
  50%      { box-shadow: 0 0 30px rgba(112,51,245,0.18), 0 0 60px rgba(112,51,245,0.06); }
}

/* "∞ Running" symbol pulse */
@keyframes infinityPulse {
  0%, 100% { opacity: 1;   transform: scale(1); }
  50%      { opacity: 0.5; transform: scale(1.25); }
}

/* Optional polish for ops-timeline entry */
@keyframes timelineEnter { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
@keyframes pulseDot      { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.55; transform:scale(1.25); } }
```

### Allowed attachment points

- **`weekBreathe`** → on the current-week card (`<div class="...week-breathe">`). Bounded card, animation is `box-shadow` only — visually safe.
- **`infinityPulse`** → on the `<span class="infinity-pulse">∞</span>` inside the "Running" pill. ≤16×16 px element.
- **`timelineEnter`** → each `<li>` in the operations-review serpentine timeline (or any timeline row), staggered by index. One-shot.
- **`pulseDot`** → a small dot indicating "next up", ≤16×16 px element.

**Note on the dim-progress active pill**: it is **statically filled** (no animation). Switching is click-driven; no `scoreProgress`-style timer. The `.score-bar-fill` child element should set `width:100%` and brand color directly — do not declare or use `@keyframes scoreProgress`.

### The one real bug guard

The early-iteration "purple block" bug came from `position: absolute; inset: 0; background: var(--mp-primary)` on an element whose parent had **no `overflow:hidden` and no explicit dimensions** — the animated brand-color overlay grew unbounded across the section. That specific pattern stays banned:

> **Banned**: any element with all three of (a) `position: absolute`, (b) `inset: 0` (or no explicit width/height), (c) brand-color background, where the parent does NOT have `overflow:hidden` AND explicit dimensions.

Everything else in the demo's animation usage is fine.

### What NOT to add

- New animation keyframes the demo doesn't use. If the demo does it, you do it. If the demo doesn't, don't invent.
- Animation on hero banners, full-bleed sections, or any element that's already a finished card surface.
- Bounce/elastic easing — the reference design uses linear, ease-in-out, and ease-out only.

---

## No oversized-color-block rule (HARD)

A single solid color or gradient block must not occupy **> 50% of fragment width** or **> 400 px height**.

- Elements using `background: var(--mp-primary)`, `background: linear-gradient(... var(--mp-primary) ...)`, `background: <brand-hex>`, etc. must satisfy one of:
  - ≤ 48×48 px (icon tile / chip / pill).
  - Sits inside a `rounded-*` card with explicit padding.
  - Is the hero status-bar (a single horizontal strip ≤ 80 px tall, full card width, inside a rounded card).
- Any `position: absolute; inset: 0` overlay with a brand background MUST have a sized parent with `overflow: hidden`. Full-bleed brand-colored overlays are banned.
- If the agent finds itself writing `background: linear-gradient(...)` on an element wider than the typical card width, STOP and re-scope to a small chip or section accent instead.

---

## Language

- **Framework-neutral HTML + Tailwind utility classes + inline CSS variables.**
- **One** `<style>` block inside the root `<section>` allowed, for `@keyframes` only (see Animation scoping rules).
- **No** `<script>` tags, **no** inline `onclick=`.
- **Font**: declare three role variables on the root `<section>` and reference them in child elements. Do **not** hardcode `font-family:'Outfit'` or any other name on the root. The host may override these variables to match project typography.

```css
--mp-font-ui:    ui-sans-serif, system-ui, sans-serif                /* UI chrome, buttons, labels, tables */
--mp-font-voice: ui-sans-serif, system-ui, sans-serif                /* Headlines, narrative copy, card titles */
--mp-font-data:  ui-monospace, "SFMono-Regular", Menlo, monospace    /* KPI values, numeric columns (tabular-nums) */
```

If the brand profile includes typography hints, map them into these variables. Non-reflex suggestions (if the skill must pick): `Geist` / `Manrope` / `ABC Social` / `Söhne` / `Inter Display`. Do NOT default to: `Outfit`, `DM Sans`, `Plus Jakarta`, `Instrument Sans`, `Fraunces`, `Newsreader`, `Lora`, `Playfair`, `Cormorant`, `Syne`, `Space Grotesk`, `IBM Plex` — these are the "reflex fonts" that mark AI output.

---

## Core color palette

Expose these on the root `<section>` as CSS variables and reuse them via `bg-[var(--mp-primary)]` etc. Values are the reference design base palette; they can be overridden at run time by the host via `brand.colors[]`.

```
--mp-primary:       #7033F5   /* Brand primary — CTAs, active, links, chart primary */
--mp-primary-600:   #601ce6   /* Hover */
--mp-primary-50:    #f3efff   /* Tint fills, selected rows */
--mp-success:       #00b42a
--mp-success-50:    #e8ffea
--mp-warning:       #ff7d00
--mp-warning-50:    #fff7e8
--mp-error:         #f53f3f
--mp-error-50:      #ffece8
--mp-bg:            #F7F8FA   /* Page surface */
--mp-card:          #ffffff   /* Card surface */
--mp-border:        #F0F0F0   /* Structural card border (Figma Gray/4) */
--mp-divider:       #F5F5F5   /* Internal section divider (Figma Gray/3) */
--mp-text-title:    #111827   /* Titles */
--mp-text-body:     #374151   /* Body (default) */
--mp-text-muted:    #6B7280   /* Secondary / muted */
--mp-text-hint:     #9CA3AF   /* Placeholder / hint */
```

Root declaration (mandatory):
```html
<section
  data-skill="media-plan"
  data-phase="..."
  data-brand="..."
  data-generated-at="..."
  style="
    --mp-primary:#7033F5; --mp-primary-600:#601ce6; --mp-primary-50:#f3efff;
    --mp-success:#00b42a; --mp-success-50:#e8ffea;
    --mp-warning:#ff7d00; --mp-warning-50:#fff7e8;
    --mp-error:#f53f3f; --mp-error-50:#ffece8;
    --mp-bg:#F7F8FA; --mp-card:#ffffff;
    --mp-border:#F0F0F0; --mp-divider:#F5F5F5;
    --mp-text-title:#111827; --mp-text-body:#374151; --mp-text-muted:#6B7280; --mp-text-hint:#9CA3AF;
    --mp-font-ui: ui-sans-serif, system-ui, sans-serif;
    --mp-font-voice: ui-sans-serif, system-ui, sans-serif;
    --mp-font-data: ui-monospace, 'SFMono-Regular', Menlo, monospace;
    font-family: var(--mp-font-ui);
    background: var(--mp-bg);
    color: #1d2129;
    padding: 24px;
  ">
  <style>
    /* Optional — only include if you actually use these animations. */
    @keyframes pulseDot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.55; transform:scale(1.25); } }
  </style>
  ...
</section>
```

If the brand profile provides `colors[]`, override `--mp-primary` (and optionally `--mp-primary-600` computed slightly darker) with the brand's primary hex.

---

## Typography scale (fixed)

| Role | Tailwind | Notes |
|---|---|---|
| Page title | `text-2xl font-bold` color `var(--mp-text-title)` | Hero banner title |
| Section heading | `text-base font-semibold` color `var(--mp-text-title)` + icon `w-4 h-4` |
| Card title | `text-sm font-semibold` color `var(--mp-text-title)` |
| Metric big value | `text-2xl font-bold` color `var(--mp-text-title)` |
| Metric label | `text-xs font-medium` color `var(--mp-text-muted)` |
| Body | `text-sm` color `var(--mp-text-body)` |
| Muted / caption | `text-xs` color `var(--mp-text-muted)` |

**Never**: uppercase page titles; font-weights below 400; font sizes smaller than `text-xs` (12px).

---

## Radius scale

| Tailwind | Usage |
|---|---|
| `rounded-md` (6px) | small badges, chips |
| `rounded-lg` (8px) | buttons, inputs, pill tags |
| `rounded-xl` (12px) | cards |
| `rounded-[20px]` | outer page container / hero banner |
| `rounded-full` | status dots, avatars |

Nesting rule: outer container radius > inner card > inner element. Never reverse.

---

## Card pattern — match the reference design standard

Every standard card uses the reference signature: 1px Figma-Gray-4 border + the purple-tinted shadow. This is the default across all phase pages, applied uniformly. Do NOT skip the shadow on regular cards — it is part of the reference design look, not "AI-slop decoration".

```html
<div class="bg-white rounded-xl border border-[#F0F0F0] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] p-5">
  ...
</div>
```

Key properties:
- Radius: `rounded-xl` (12px) for standard cards; `rounded-2xl` (16px) for table containers / outer wrappers; `rounded-[20px]` for the page-level main container or hero banners.
- Background: `bg-white` is the default surface. Recessed/nested panels can use `bg-gray-50`, `bg-[#F9FAFB]`, `bg-[#f8f7fc]` (lavender for score-card section), or `var(--mp-primary-50)` for tinted active states.
- Border: `1px solid var(--mp-border)` (= `#F0F0F0`) on every card.
- Shadow: `-2px 2px 16px rgba(14,0,45,0.06)` — this purple-tinted shadow is **the** the reference design card shadow. Apply on every standard card.
- Padding: `p-5` (20px) for standard, `p-4` for compact, `p-6` for hero.

### Sentiment cards (Summary, spotlight callouts)

Sentiment-styled cards (positive / caution / neutral / warning) follow the reference pattern: tinted bg + 1px tinted border + a 4px left-accent stripe + ring-haloed icon tile:

```html
<!-- positive sentiment example -->
<div class="rounded-xl border border-l-4 border-emerald-200 border-l-emerald-400 bg-emerald-50/60 p-5">
  <div class="flex items-start gap-4">
    <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ring-4 bg-emerald-100 text-emerald-600 ring-emerald-100/50">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
    </div>
    <div class="flex-1">
      <h4 class="text-base font-bold text-emerald-800 mb-2">Headline</h4>
      <p class="text-xs leading-relaxed">...</p>
    </div>
  </div>
</div>
```

Sentiment palette:
| Sentiment | bg | border | left-accent | icon tile bg | icon color | ring | headline color |
|---|---|---|---|---|---|---|---|
| positive | `bg-emerald-50/60` | `border-emerald-200` | `border-l-emerald-400` | `bg-emerald-100` | `text-emerald-600` | `ring-emerald-100/50` | `text-emerald-800` |
| caution | `bg-amber-50/60` | `border-amber-200` | `border-l-amber-400` | `bg-amber-100` | `text-amber-600` | `ring-amber-100/50` | `text-amber-800` |
| neutral | `bg-gray-50/60` | `border-gray-200` | `border-l-gray-300` | `bg-gray-100` | `text-gray-500` | `ring-gray-100/50` | `text-gray-700` |

The `border-l-4` left-accent stripe is **required**, not banned. It is the reference design's sentiment signature. Same goes for the `ring-4` icon halo.

---

## Layout density rules

These are the most common reason the output "looks ugly". Follow them strictly.

- **Outer gutter** — always `padding: 24px` (`p-6`) on the root `<section>`; cards sit in a column with `space-y-5` (20px gaps).
- **Grid sections** — use `grid grid-cols-1 lg:grid-cols-2 gap-4` for two-column groups; `lg:grid-cols-3 gap-4` for triple stats.
- **Card internal spacing** — title → subtitle `mb-1`; title block → body `mb-4`; body internal rows `space-y-3`.
- **Table-like content** — never render as `<table>`; render as a CSS grid or a stack of cards. The visual target is a modern dashboard, not a spreadsheet.
- **Max content width** — cap at `max-w-[1200px] mx-auto`; avoid edge-to-edge text.
- **Whitespace bias** — when in doubt, add more breathing room. An underfilled layout beats a cramped one.

---

## Required visual elements per card

A good card has **four** visual layers:

1. **Icon + title row** — an `w-4 h-4` inline SVG/icon glyph in the accent color, then the card title. (Use plain inline `<svg>` shapes; no icon library dependency.)
2. **Primary metric or lede** — one big number or one strong sentence.
3. **Supporting detail** — short body text, sub-metrics, a list, or a visualization.
4. **Action footer (optional)** — button(s) with `data-action` / `data-nav-to`.

Cards missing layer 1 or 2 look flat — include them.

---

## Status visual mapping

Map `data-card-state` to a visual cue using the reference design's signature treatments — sentiment cards combine **tinted bg + matching border + 4px left-accent stripe + ring-haloed icon tile** (the full pattern in §Card pattern's Sentiment cards table).

| `data-card-state` | Treatment |
|---|---|
| `idle` | Default card; no accent |
| `recommended` | Sentiment-positive (emerald) treatment OR brand-color treatment via inline styles: `class="border-l-4 ring-4 bg-..."` + `style="border-left-color:var(--mp-primary-400, #8852ff); background-color:var(--mp-primary-50, #f3f0ff); --tw-ring-color:var(--mp-primary-100, #e5dbff)"`. Used for AI-suggested actions |
| `pending` | Sentiment-caution (amber) treatment for "your action required" |
| `approved` | Sentiment-positive (emerald) treatment with check icon |
| `warning` | Full sentiment-caution card (amber tint + border + left-accent + amber icon) |
| `success` | Full sentiment-positive card (emerald tint + border + left-accent + emerald icon) |
| `loading` | Skeleton rows (opacity-based pulse, no width animation) |
| `collapsed` | Hide body; show chevron-right; keep header |
| `expanded` | Default |

Rules:
- The 4px `border-l-{color}-400` left-accent stripe is **part of the pattern, not banned**. Color carriers are simultaneously the icon, the ring, the bg tint, AND the left stripe — that's how the reference design signals sentiment strongly.
- `data-card-state` is one attribute on the card; the visual treatment cascades through bg, border, left-accent, icon tile, ring, and headline color in one consistent palette per state.

---

## Chart & data-viz guidance

- **Sparkline / trend** — render with inline SVG `<polyline>` on a 100×24 viewBox. Stroke `var(--mp-primary)`, width `2`, `fill="none"`, `stroke-linecap="round"`.
- **Bar comparison** — use stacked `<div>` blocks with `height` proportional to value; fill `var(--mp-primary)` for primary series, `var(--mp-primary-50)` for secondary.
- **Benchmark line** — render the industry-avg as a dashed horizontal line at the appropriate y-offset; color `var(--mp-text-hint)`; label with small muted caption.
- **Never** link to chart libraries or remote images; all visuals must be inline SVG or CSS.
- Chart palette order: `#7033F5, #00b42a, #ff7d00, #f53f3f, #a985ff, #e5dbff`.

---

## Button patterns

```html
<!-- Primary -->
<button data-action="..." data-nav-to="..."
  class="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
  style="background:var(--mp-primary); box-shadow:0 1px 2px rgba(112,51,245,0.2);">
  Label
</button>

<!-- Secondary -->
<button data-action="..."
  class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
  style="background:#fff; color:var(--mp-text-body); border:1px solid var(--mp-border);">
  Label
</button>

<!-- Ghost / text -->
<button data-action="..."
  class="px-3 py-1.5 rounded-lg text-sm font-medium"
  style="color:var(--mp-primary); background:transparent;">
  Label
</button>
```

Button size: `py-2 px-4` for normal, `py-1.5 px-3` for compact. Never use pill-shaped buttons for primary CTAs.

---

## Icon convention

The skill cannot import an icon library. Use inline SVG with these patterns (24×24 viewBox, `stroke="currentColor"`, `fill="none"`, `stroke-width="2"`, `stroke-linecap="round"`, `stroke-linejoin="round"`). Pick from a small vocabulary (chart-line, calendar, target, sparkle, alert-circle, check-circle, rocket, pause-circle, trending-up, dollar-sign, users, clock). Reuse the same SVG path for the same semantic meaning across cards.

---

## Banner / hero styling

the reference design deliberately uses **bounded** multi-color gradients on certain cards (current-week card, score-card detail panel) — they are signatures, not slop. The previous rule banning all gradients was wrong; reverted. The right rule is just **bounded vs unbounded**.

- ✅ **Bounded gradient inside a card with `rounded-*` and explicit padding**: allowed and used by the reference design:
  - Current-week card: `class="bg-gradient-to-br via-white ring-2"` + inline `style="background-image:linear-gradient(135deg, var(--mp-primary-50, #f3f0ff) 0%, transparent 100%); --tw-ring-color:var(--mp-primary-200, #cbb5ff)"` (Tailwind's via/ring base utilities + CSS-var brand color)
  - Score-card detail panel: `linear-gradient(135deg, rgba(243,240,255,0.5) 0%, transparent 60%)`
  - just_launched banner: `bg-gradient-to-r from-emerald-50 to-teal-50`
  - dormant restart-options strip: `bg-gradient-to-r from-blue-50 to-indigo-50`
- ✅ **Tinted card backgrounds**: `bg-emerald-50/60`, `bg-amber-50/60`, `bg-[#f8f7fc]` (score-card section), `bg-blue-50`, `bg-purple-50`, `bg-amber-50`, etc. — all valid for sentiment, recessed, and contextual surfaces. they are used throughout the reference design.
- ❌ **Banned**: an `<element style="position:absolute; inset:0; background: var(--mp-primary)">` overlay with no parent `overflow:hidden` and no explicit dimensions — this was the early purple-block bug.
- ❌ **Banned**: gradient text (`background-clip: text`).
- ❌ **Banned**: full-page-width gradient strip outside any card.

**Per-phase hero treatment** (match the demo files exactly, do not invent):

- `running` — no top hero. Goes straight to Summary card (sentiment-styled with side-accent).
- `just_launched` — emerald celebratory `<div class="bg-white rounded-[20px] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] px-6 py-5">` with rocket icon tile + "Your ads are live!" headline.
- `dormant` — muted `bg-gray-50 rounded-xl p-6 border border-gray-200` paused-status header.
- `new_user` — white `rounded-[20px] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] py-16 flex items-center justify-center` hero with rocket-icon tile (inline `style="background-color:var(--mp-primary-50, #f3f0ff); color:var(--mp-primary, #7033F5)"`) + headline + primary CTA + "What happens after" 4-step list.

If you're tempted to "make it look less AI" by removing a gradient or shadow that's in the demo — don't. The demo IS the reference design. Match it.

---

## Phase-level layout anchors (the only references)

This file (`design-system.md`) is the canonical source for tokens, patterns, animation rules, and self-checks. The skill's authoritative visual reference is [`references/visual-ground-truth/`](references/visual-ground-truth/) — copies of the reference design's actual phase pages.

| File | When to load |
|---|---|
| [`references/visual-ground-truth/<phase>.html`](references/visual-ground-truth/) | **Authoritative visual reference** for each of the four phases (running / just_launched / new_user / dormant). These are the reference design's actual hand-designed phase pages. The fragment you emit MUST mirror them at the component level: every gradient, ring, animation, color treatment, multi-column grid, sentiment card, side-accent, type pill, and visualization. **Open the file matching your target phase before generating, and copy its DOM structure section-by-section.** Replace only the brand-specific content. |

This is the **only** reference. Earlier iterations shipped a `phase-examples/` directory of "structural anchor" HTMLs I authored from scratch — they were simplifications that omitted half of the reference design's signatures, and they were misleading. Removed. The real product designs live in `dist/media-plan-demos/*.html` and we copy them in here as the single source of visual truth.

---

## Patterns to copy (read the ground truth file for the actual HTML)

The phase-specific patterns below are summarized for orientation. **The actual implementation lives in `references/visual-ground-truth/<phase>.html`** — open it and copy the corresponding `<div>` structure verbatim.

### Pattern A — Multi-dimensional diagnostic (running phase)

Visual ground truth: `running.html` § Score-card.

Components to preserve:
- Lavender section bg `bg-[#f8f7fc]` wrapping the entire score-card
- Two-column layout: LEFT 50% (radar SVG centered + center phase label + legend + active-dim problem-box) | flow connector (vertical gradient line + chevron-in-circle in the middle) | RIGHT 50% (detail panel with gradient bg)
- Inline SVG radar with potential layer (dashed) + current layer (solid) + dots + axis labels (one rendered as a filled active pill)
- Active-dim **problem-box** with `border-l-[3px]` left-accent + tinted `bg-[#f3f0ff]/80` + dim title + score + problem text
- Detail panel with gradient `linear-gradient(135deg, rgba(243,240,255,0.5) 0%, transparent 60%)`, header (number tile + name + before→after), double-layer score bar, AI Will Do (numbered, primary), Your Actions (numbered, amber), Expected Impact (emerald)
- Bottom **dot-progress navigator** (5 pills; the active pill is statically filled with brand color, the others are gray). Switching is **click-driven only** — user clicks a pill OR a radar axis label (`<text data-axis-id="{slug}">`) to switch dim. **No auto-rotation.** Click handling runs in the host React app (production) or the preview wrapper's script.

### Pattern B — Operations Review (running phase)

Visual ground truth: `running.html` § Optimization Review (left card).

Components to preserve:
- Top: 3-up icon-tile metric strip (Budget Suggestions / Creatives Regenerated / Campaigns Recommended) — circle icon + big number + tiny label, each in tinted bg
- Below: **horizontal SVG serpentine timeline** with two curve segments (solid past + dashed upcoming) + `animateMotion` flowing dots along the dashed segment + circle nodes for each event + `<foreignObject>` mini-cards (icon-tile, title, subtitle, time) alternating above/below the path
- Past nodes are filled green circles; upcoming nodes are white circles with gray dashed stroke + `opacity:0.5`
- This is a **bespoke SVG visualization**, not a generic vertical `<ol>`. Do not degrade to a list.

### Pattern C — Highlights (running phase)

Visual ground truth: `running.html` § Highlights of the Past 7 Days.

Components to preserve:
- "Action Benefits" section: heading with green icon-tile + 4-up grid of metric cards (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3`), each card `bg-gradient-to-br from-white to-gray-50 rounded-xl border p-4` with metric icon + emphasized big number (e.g. `+18%` in emerald) + small attribution sentence
- Divider
- "Highlights" section: heading with amber icon-tile + 4 best-performer cards (`grid-cols-1 sm:grid-cols-2 gap-3`) each color-tinted by type (blue/purple/amber/emerald) with type-icon-tile + name + date + achievement sentence
- This 4-up grid IS the reference design. Do not simplify to prose or single column.

### Pattern D — Weekly Strategy (running phase)

Visual ground truth: `running.html` § Weekly Strategy.

Components to preserve:
- 4 calendar-week cards in `lg:grid-cols-4`
- Past (Completed): `bg-emerald-50/50 border-emerald-200/60 opacity-65 saturate-[0.6]`
- Current: `class="bg-gradient-to-br via-white border ring-2 week-breathe"` + inline `style="background-image:linear-gradient(135deg, var(--mp-primary-50, #f3f0ff) 0%, transparent 100%); border-color:var(--mp-primary-300, #a985ff); --tw-ring-color:var(--mp-primary-200, #cbb5ff)"`
- "This Week ∞ Running" pill on current week with `infinity-pulse` animation on the ∞ symbol
- Upcoming: `bg-gray-50/40 border-dashed border-gray-200 opacity-60`
- Each card: status pill + date range + "Core Objective" with target icon + "AI Plan" 3 bullets with bot icon + "You Need To Do" yellow-marker list (line-through for completed)
- Mobile: horizontal scroll with snap-points

### Phase-specific structures

For other phases, the ground truth files are the spec:
- `just_launched.html` — emerald "Your ads are live!" header, optimize-goals spotlight card, 2-col Launch Progress + Setup Checklist, "What to expect" timeline
- `new_user.html` — Hero CTA card with rocket icon + primary button + "What happens after" 4-step list
- `dormant.html` — muted paused-status banner, 3-col Historical Performance / Why Restart Now / Opportunity Cost, gradient restart-options bar with 3 button-cards

---

## Visual quality bar (self-check)

Before returning HTML, verify both axes — **visual fidelity to ground truth** AND **content concreteness**.

### Visual fidelity (compare to `references/visual-ground-truth/<phase>.html`)

1. Root `<section>` has the full `style="..."` CSS-variable declaration; brand `colors[0]` overrides `--mp-primary` only.
2. Every section in the demo is present in your output, in the same order.
3. Every section's component palette matches the demo: cards with `-2px 2px 16px rgba(14,0,45,0.06)` shadow + `border-[#F0F0F0]` border, sentiment cards with `border-l-4 border-l-{color}-400` + `ring-4 ring-{color}-100/50` icon halo, score-card with lavender section bg + radar SVG + flow connector + gradient detail panel + carousel + dot-progress, weekly cards with multi-color gradient on current week + `week-breathe` + `infinity-pulse`, operations review with the horizontal SVG serpentine timeline + 3-up icon-tile metric strip, highlights with 4-up Action Benefits grid + 4 best-performer color-tinted cards.
4. No `<table>`. Data is grid- or card-based per the demo.
5. The reference animation keyframes used in the demo are preserved: `weekBreathe`, `infinityPulse`. Plus optional `timelineEnter` / `pulseDot` for the operations timeline. **No** `scoreProgress` / dim-progress timer — the active pill is statically filled and switching is click-driven.
6. **All icons are inline SVG** with `stroke="currentColor"` and lucide's exact path data — copy from `references/visual-ground-truth/*.html`. Never `<i data-lucide="...">` placeholders, never generic geometric shapes.
7. Brand color override goes only to `--mp-primary` (and optional `--mp-primary-50/100/200/300/400/500/600/700`); sentiment/semantic colors (emerald = success, amber = caution, blue = info, gray = neutral) stay as-is.
8. Output renders correctly with **only** Tailwind base utilities loaded — no theme extension, no icon library, no custom font, no JS framework.

### Content concreteness (anti-AI-slop, see C1–C7 above)

9. Every external number carries a `data-source` URL (≥1 each for S1, S2, S3 = 3 distinct minimum).
10. No banned jargon phrases (writing-quality.md §3).
11. Every recommendation has a "because…" clause grounded in brand data or search.
12. Every projection has a range, not a point estimate.
13. Voice matches `brand_tone[]` and the phase's calibration (running = data/verb-first; dormant = respectful evidence-based; etc.).
14. Calendar weeks for any weekly plan (Mon–Sun by default, US-only regions Sun–Sat). No sliding 7-day windows.

### Failure-mode catches

15. **No visual degradation**: no replacement of demo's components with prose, plain bullets, or simplified cards. If the demo has a 4-up grid you have a 4-up grid; if it has a carousel you have a carousel; if it has a serpentine SVG timeline you have a serpentine SVG timeline.
16. **No unbounded brand-color overlay**: any element with `position:absolute; inset:0` + a brand-color `background` MUST sit inside a parent with `overflow:hidden` and explicit dimensions. (This was the root cause of the early-iteration "purple block" bug — keeps that specific bug class banned.)
17. **No gradient text** (`background-clip: text` + gradient). Solid color + weight/size emphasis only.

If any item is missing, fix it before returning. A "correct but ugly" fragment is not acceptable. Neither is a "polished but AI-fingerprinted" one.
