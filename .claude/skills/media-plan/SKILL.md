---
name: media-plan
description: Generate a phase-specific, brand-driven Media Plan HTML fragment for any advertising / marketing product. The skill reads a normalized Brand profile (provided by the host project), runs mandatory external searches for industry benchmarks, competitor moves, and seasonal / platform hotspots, then emits a single HTML fragment labeled with one of four advertising lifecycle phases (new_user / just_launched / running / dormant). The host project maps menu names in the output to its own routes; the skill itself binds to no file path, SDK, API, or router. Triggers: "media plan", "media plan for <brand>", "generate plan for this brand", "update media plan page", "媒体计划", "媒介计划", "投放方案", "帮 <brand> 出一版投放计划".
---

# Skill: media-plan

Produce a single, phase-correct, brand-specific HTML fragment that replaces a statically-authored Media Plan page with one driven by the current Brand's profile and fresh external intelligence.

This skill is **declarative**. It does not read project files, call APIs, or depend on any framework. It describes **what brand fields to consume, what to search for, and what HTML shape to return**. The host project is responsible for:

1. Feeding the skill a Brand profile that matches `brand-inputs.md`.
2. Mapping the `data-nav-to` menu names in the output to its own routes.
3. (Optional) Providing a project-specific design-system skill to chain into.

---

## Workflow (6 steps — execute in order)

### 1. Resolve Brand inputs
Read the normalized Brand profile from the conversation context (the host project passes it in, or the user pastes it). Fields and semantics are defined in [`brand-inputs.md`](brand-inputs.md).

- If any **required** field is missing, ask the user for it in one message — do NOT fabricate (especially for `client_industry`, `target_region`, `marketing_goal`, `competitors[]`).
- Optional fields may be omitted; skill will degrade gracefully (see each phase file for which sections become simpler when fields are missing).
- State signals (`has_published_campaign`, `days_since_first_publish`, `campaigns_active_count`, `campaigns_paused_at`) are needed for phase selection — if absent, ask or let the user force a phase ("force phase: running").

### 2. Select phase
Run the decision table in [`phase-selection.md`](phase-selection.md). First matching row wins. If nothing matches, default to `running` and add `data-phase-fallback="true"` on the root node.

### 3. Mandatory external searches
Execute all three search families in [`search-templates.md`](search-templates.md):

- **S1** — Industry benchmark
- **S2** — Competitor moves (top 3 competitors)
- **S3** — Seasonal / platform hotspots

All three MUST run. Each result consumed in the HTML must carry `data-source="<url>" data-fetched-at="<ISO8601>"`. If a search returns nothing useful, state that on the card (`data-card-state="warning"` + a short note) rather than making up numbers.

### 4. Apply the embedded design system + visual ground truth
Follow [`design-system.md`](design-system.md) for tokens, card patterns, typography scale, animation rules, and self-check.

**Critically — visual ground truth lives in [`references/visual-ground-truth/<phase>.html`](references/visual-ground-truth/).** These four files are the actual product's hand-designed phase pages. They are not "examples" or "structural anchors" — they are the **authoritative visual quality bar**. Every section's components, animations, gradient treatments, color choices, ring effects, type-tag pills, multi-column grids, and visualization shapes are reference design and must be **preserved**.

The fragment must render correctly with only Tailwind loaded — no project-specific CSS, no external font, no framework, no icon library, no chart library. If the brand profile supplies `colors[]`, override `--mp-primary` with the brand's primary hex on the root `<section>` (and only that token; do not redesign components).

### 5. Emit phase-specific HTML
Use the appropriate file in [`phases/`](phases/) for the section ordering and content guidance:

- [`phases/new_user.md`](phases/new_user.md)
- [`phases/just_launched.md`](phases/just_launched.md)
- [`phases/running.md`](phases/running.md)
- [`phases/dormant.md`](phases/dormant.md)

**Before generating, open [`references/visual-ground-truth/<phase>.html`](references/visual-ground-truth/) and copy its DOM structure section-by-section.** Keep every component, every gradient, every ring, every animation, every color treatment. **Replace only the brand-specific content**: brand name, industry-specific dimension labels, real numbers from S1/S2/S3, calendar-week dates, action copy, etc. The fragment you return should look like the demo HTML rendered for a different brand.

## The dual principle (READ THIS BEFORE EMITTING)

> **Visual = ground truth. Content = anti-AI-slop.**
>
> Both are MANDATORY. Either one missing produces AI slop:
>
> - Pretty visual + jargon-filled copy = AI dashboard
> - Concrete copy + degraded visuals (prose, plain bullets, naked metric numbers) = also AI slop, just a different flavor

### Visual = ground truth (NEVER degrade components)

The four `references/visual-ground-truth/<phase>.html` files are the reference design. The fragment you emit MUST mirror them at the component level:

- Sentiment cards have `border-l-4 border-l-{color}-400` accent + `ring-4 ring-{color}-100/50` icon halo + tinted background — **keep all three**.
- Score-card uses lavender section bg `bg-[#f8f7fc]`, the radar SVG with center phase label + clickable axis labels (`data-axis-id="{slug}"`), the flow connector (gradient line + chevron-in-circle), the gradient detail panel `linear-gradient(135deg, rgba(243,240,255,0.5)...)`, the `<problem-box>` + `<detail-panel>` carousel, the bottom dot-progress navigator with statically-filled active pill (no animation; switching is click-driven — user clicks a pill or a radar axis label) — **keep all six**.
- Weekly Strategy uses 4 week cards with multi-color gradients on the current-week card (`bg-gradient-to-br via-white` + inline `style="background-image:linear-gradient(135deg, var(--mp-primary-50, #f3f0ff) 0%, transparent 100%)"`), `week-breathe` animation, `infinity-pulse` on the ∞ symbol, and dimming/dashing for past/upcoming — **keep all four**.
- Operations Review uses the **horizontal SVG serpentine timeline** with `animateMotion` flowing dots and `<foreignObject>` mini-cards, plus the 3-up icon-tile metric strip on top — **keep both, do not degrade to a vertical `<ol>` list**.
- Highlights uses the 4-up Action Benefits metric grid + 4 best-performer color-tinted cards + external tailwinds list — **keep all three blocks, do not collapse to prose**.

If a section in the demo uses a 4-up grid, you use a 4-up grid. If it uses a gradient card, you use a gradient card. If it has a side-stripe sentiment border, you keep the side-stripe. **No "structured rows", no "narrative bullets", no "compact list" simplifications**. The component palette is fixed by the demo.

### Content = anti-AI-slop (always concrete, never jargon)

What goes INSIDE those preserved components is the agent's brand-specific reasoning, governed by [`writing-quality.md`](writing-quality.md):

- Every action is concrete (subject + verb + object + outcome).
- Every recommendation has a "because…" clause (drawn from brand data or S1/S2/S3 search).
- Every external number carries `data-source="<url>"`.
- Every projection has a range, not a point estimate.
- Banned phrases: "全链路智能赋能", "跨渠道无缝", "革命性", "seamless", "next-generation", "AI-powered intelligent". See `writing-quality.md` §3 for the full ban list.
- Voice calibration matches the phase (running = data-first verb-first; dormant = respectful evidence-based; etc.) and the brand's `brand_tone[]`.

### What does NOT trigger anti-AI-slop

These are reference design signatures, NOT AI slop. Do not "simplify them away":

- ✅ `border-l-4` left-accent strips on sentiment cards
- ✅ `ring-4` icon halos
- ✅ Multi-color gradients on bounded cards (`from-X via-Y to-Z`)
- ✅ Lavender/tinted section backgrounds
- ✅ 4-up metric grids (Highlights Action Benefits)
- ✅ Animations: `week-breathe`, `infinity-pulse`, `timelineEnter`, `pulseDot` (NOT `scoreProgress` — the dim-progress active pill is statically filled, no timer)
- ✅ Score-card carousel pattern (`<problem-box>` + `<detail-panel>` + dot-progress) — host React app or preview-mode JS wires the swap
- ✅ Inline SVG icons with `stroke="currentColor"` (copy from `references/visual-ground-truth/*.html` — already converted from the original `<i data-lucide="...">` placeholders to inline SVG so the fragment is zero-dependency)
- ✅ Card shadows on every card (used consistently across the reference)

These were briefly banned by an earlier version of this skill that misread "anti-AI-slop" as "anti-rich-visuals". That ban is reverted. The reference design always wins over generic anti-slop guidance.

The root node is always:

```html
<section data-skill="media-plan"
         data-phase="<phase>"
         data-brand="<brand_name>"
         data-generated-at="<ISO8601>">
  <!-- menu-name-registry: [ ...list of data-nav-to values used... ] -->
  ...
</section>
```

Follow the required semantic sections **in the declared order**. Interaction attributes must conform to [`data-attributes.md`](data-attributes.md).

### 6. Self-check (before returning)
Verify — if any fails, fix and regenerate before returning:

1. `data-phase` matches the decision from step 2.
2. All required sections for that phase are present in the declared order.
3. At least one `data-source` attribute exists for each of S1, S2, S3 (three distinct URLs).
4. Every `data-nav-to` / `data-card-state` / `data-action` value is in the whitelist in `data-attributes.md` (or in the brand's `custom_menu_names[]`).
5. Primary copy language matches the Brand's primary language (inferred from `brand_tone` + `target_region`).
6. All 15 visual-quality items at the bottom of [`design-system.md`](design-system.md) pass — especially the AI-slop prevention (B1–B8), Animation scoping, and No-oversized-color-block bans.
7. Copy passes the quick self-check in [`writing-quality.md`](writing-quality.md) — no banned jargon, every recommendation has a reason, every number has a source or method.
8. **Portability — no Tailwind theme extensions in the output.** `grep -ohE 'class="[^"]+"' output.html | grep -E '\b(primary|brand)-[0-9]+\b'` returns ZERO matches. Brand color is delivered via `var(--mp-primary*, #hex)` inline styles only.
9. **Portability — no icon-library placeholders.** `grep -c 'data-lucide=' output.html` returns 0; `grep -c '<i class="fa-' output.html` returns 0. Every icon is inline `<svg>...</svg>` with `stroke="currentColor"`.

---

## Hard rules (never break these)

### Visual rules (the reference design system is authoritative)

- **Visual ground truth**: every section's visual structure must mirror the corresponding section in `references/visual-ground-truth/<phase>.html`. Components, gradients, animations, ring effects, color treatments, multi-column grids, type pills — **all preserved**. The agent's job is to swap content, not redesign components.
- **No visual degradation**: do NOT replace the reference design's components with "simplified" versions. Specifically banned: replacing the 4-up Action Benefits grid with prose; replacing the score-card carousel with a flat list; replacing the operations-review serpentine timeline with a vertical `<ol>`; removing `ring-4` halos, `border-l-4` accents, multi-color gradients, or animation keyframes. If the demo has it, you keep it.
- **Output shape**: in `bare` mode (default), a single HTML fragment — one `<section data-skill="media-plan" ...>...</section>` and nothing else. In `preview` mode, a complete `<!DOCTYPE html>` document with Tailwind CDN that contains exactly one such `<section>` in the body. Never JSON. Never markdown-wrapped. Never wrapped in ` ```html ` fences. See "Output mode" below.
- **`<style>` block**: a single `<style>` block is permitted inside the root `<section>` for `@keyframes` declarations used by this fragment (`weekBreathe`, `infinityPulse`, `timelineEnter`, `pulseDot` — copy from the visual-ground-truth file). Do NOT include `scoreProgress` — it is no longer used. Keep the block under ~30 lines.
- **Zero host dependencies**: the fragment must render correctly with only Tailwind base utilities loaded — **no extension** of Tailwind's `theme.colors` (so no `primary-*` / `brand-*` classes), no icon library (no `<i data-lucide="...">`, no `<i class="fa-...">`), no imported font, no chart library, no remote images. Use built-in Tailwind palette names (`gray-*`, `emerald-*`, `amber-*`, `indigo-*`, etc.) for non-brand colors and `var(--mp-primary*, #hex-fallback)` inline styles for brand color. Every icon is inline SVG with `stroke="currentColor"`. See `design-system.md` § "Zero host dependencies".
- **No inline JS in bare fragment**: zero `<script>`, zero `onclick=`, zero event handlers — interactivity flows through declarative `data-*` attributes the host wires up. Preview mode MAY include the canonical dim-swap script (see `references/preview-wrapper.html`).
- **Brand color override only via tokens**: if the brand profile supplies `colors[]`, override `--mp-primary` only. Do NOT redesign cards, repaint sentiment colors (emerald = success, amber = caution, etc. stay semantic), or reskin the reference design palette beyond the primary token.

### Content rules (anti-AI-slop applies HERE, never to visual styling)

- **No fabricated numbers**: every external benchmark, competitor datapoint, or seasonal statistic MUST be backed by a `data-source` URL. If you cannot find real data, write `data-card-state="warning"` and say the data is unavailable.
- **No invented jargon / marketing speak**: see banned-phrases list in [`writing-quality.md`](writing-quality.md) §3 ("全链路智能赋能", "革命性", "seamless", "next-generation", etc.).
- **Every action carries a reason**: each recommendation in the fragment must include a "because…" clause grounded in brand data or S1/S2/S3 search.
- **Every projection has a range, not a point**.
- **Voice calibration**: copy tone follows `brand_tone[]`; language follows `target_region` + the brand's written-language cues.
- **No project-specific references**: do not embed file paths (`src/...`), route paths (`/campaigns`), component names (`MediaPlan.jsx`), or SDK calls. Use only the semantic menu names from `data-attributes.md`.
- **Calendar weeks, not sliding 7-day windows**: any weekly plan uses real calendar week boundaries per [`phases/running.md`](phases/running.md).
- **Fail loud, not silent**: if required fields are missing, ask the user — do not auto-fill.

---

## What the skill DOES NOT do

- Does not render the HTML. The host app is responsible for embedding the fragment (e.g. via `dangerouslySetInnerHTML`) and wiring `data-nav-to` / `data-action` clicks to real routes/handlers.
- Does not fetch or mutate Brand data. The profile comes from the caller.
- Does not persist the output. Each generation is stateless.
- Does not schedule regenerations. Host decides when to re-invoke.

---

## Output mode — bare fragment vs preview

The fragment produced by this skill **relies on Tailwind CSS being loaded by the host**. When embedded in the consumer's React/Vue/etc. app, Tailwind is already global, and the fragment renders correctly via `dangerouslySetInnerHTML` / `innerHTML`.

**But: opening the bare fragment directly in a browser will look broken** — every Tailwind utility class (`flex`, `grid`, `lg:grid-cols-12`, `space-y-5`, `rounded-xl`, `text-base`, `font-semibold`, padding/gap/etc.) does nothing without a Tailwind stylesheet. Only the inline `style="..."` parts render. The result is a vertical text dump that looks unstyled.

To handle this, the skill supports **two output modes**, decided per-invocation:

### `bare` (default)
- Output is exactly one `<section data-skill="media-plan" ...>...</section>` and nothing else.
- Use this for production embedding.
- Choose this mode when the user asks "generate the plan" / "give me the HTML" / "for the React app".

### `preview`
- Output is a complete HTML document: `<!DOCTYPE html><html>...<head>` (with Tailwind CDN script + Google Fonts Outfit link) `</head><body>` then the same `<section data-skill="media-plan">` then `</body></html>`.
- Use this when the user asks "save it to a file" / "I want to preview it" / "open in a browser" / "render it".
- Skeleton (paste this around the fragment):
  ```html
  <!DOCTYPE html>
  <html lang="{en|zh}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{brand_name} · {Phase} · {date} (preview)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style> body { margin: 0; background: #F7F8FA; } </style>
  </head>
  <body>
    <!-- the bare fragment goes here, unchanged -->
  </body>
  </html>
  ```
- A reusable wrapper template ships at [`references/preview-wrapper.html`](references/preview-wrapper.html) — paste your fragment into it for a quick preview.

### Mode-detection heuristic

If the user is going to **save the output to a file** or **open it in a browser**, use `preview`. Default to `bare`. When uncertain, ask once.

---

## Minimal working invocation (example)

> User: "Generate a media plan for the current brand. Here is the profile: { brand_name: 'Adsgo Ai', client_industry: 'Marketing & Advertising', target_region: 'Global', marketing_goal: 'conversion', has_published_campaign: true, days_since_first_publish: 14, competitors: [...], ... }"

→ Skill reads fields, selects `running`, runs S1/S2/S3, applies the embedded design system, emits `<section data-skill="media-plan" data-phase="running" ...>...</section>` with status-bar, summary-card, weekly-strategy, score-card, operations-review, highlights — all populated from the brand profile and the three searches, with every external number carrying a `data-source` URL.
