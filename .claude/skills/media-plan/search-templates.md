# Search Templates — Mandatory External Intelligence

Every generation MUST execute all three search families. Use whichever search tool is available in the session (`WebSearch`, `Tavily`, `Exa`, or equivalent). If none is available, stop and tell the user the skill requires a search tool.

Placeholders in `{curly_braces}` come from the Brand profile or current time. Replace them literally before searching.

---

## S1 — Industry benchmark

**Purpose** — Provide a defensible floor/ceiling for the Brand's KPI target. Without this, `status-bar` and `score-card.kpi` dimensions are guessing.

**Query template**
```
{client_industry} {client_industry_detail?} digital advertising benchmark {current_year} ROAS CPA CTR conversion rate {target_region}
```

**Fields required** — `client_industry`, `target_region`, `marketing_goal` (to know which metric to emphasize), `current_year`.

**Minimum evidence** — 1 result with a concrete number (e.g. "industry avg ROAS 2.5x"). Inject the number + source URL into the relevant card.

**Injected into**
- `status-bar` — KPI target sanity check
- `score-card` (phase=running) — `kpi` dimension narrative
- `expected-timeline` (phase=just_launched) — learning-phase expectation baseline

---

## S2 — Competitor moves

**Purpose** — Spot active competitor strategies the brand should counter or learn from.

**Query template (run once per top-3 competitors)**
```
{competitors[i].name} advertising campaign strategy {current_year} creative channel
```

**Fields required** — `competitors[0..2].name`. Skip gracefully if fewer than 3 exist.

**Minimum evidence** — per competitor: 1 result mentioning a recent campaign, channel move, creative theme, or platform pivot. If nothing recent is found, note "no recent public activity found" on the card (with `data-card-state="idle"`), don't fabricate.

**Injected into**
- `score-card.campaign_recommendation` (phase=running) — "what rivals are doing, what we should do"
- `operations-review` (phase=running) — if competitor pivoted channel, flag as optimization hint
- `restart-recommendation` (phase=dormant) — "market has moved while you were paused"
- `plan-roadmap` (phase=new_user) — helps shape the first-campaign suggestion

---

## S3 — Seasonal & platform hotspots

**Purpose** — Align weekly plan and creative angles with the next 30–60 days' real-world calendar and platform policy reality.

**Query templates (run BOTH)**
```
Q3a: {target_region} marketing calendar next 60 days {current_year} holidays events retail
Q3b: {primary_channel_of(marketing_channels)} ads policy update {current_year} Q{current_quarter}
```

Where `primary_channel_of(...)` means the first entry in `marketing_channels` or, if unavailable, "Meta Google TikTok" as a catch-all.

**Fields required** — `target_region`; `marketing_channels` helpful.

**Minimum evidence** — at least one upcoming event or one platform-policy item. Inject into the relevant forward-looking sections.

**Injected into**
- `weekly-strategy` (phase=running) — W+1 / W+2 rows cite seasonal themes
- `highlights` (phase=running) — external tailwinds callout
- `expected-timeline` (phase=just_launched) — what's coming during the 2-week learning period
- `plan-roadmap` (phase=new_user) — seed the recommended first campaign

---

## Evidence attachment rules

Every single number, claim, or name taken from a search result must attach:

```html
data-source="https://example.com/article"
data-fetched-at="2026-04-24T14:05:00Z"
```

…on the smallest wrapping element that contains the claim (often a `<li>`, `<span>`, or stat card).

## What counts as "executed"

A search family is "executed" only if a real query was sent and the result set was read. Telling the user "I would search for ..." does **not** count. If the tool fails or returns nothing, that must be reflected as `data-card-state="warning"` on the affected card, plus a one-line user-visible message ("Benchmark data unavailable — retry later").

## Budget guidance

- S1 — 1 query
- S2 — up to 3 queries (one per top-3 competitor)
- S3 — 2 queries (regional calendar + platform policy)

Total: ~6 searches per generation. Batch-parallelize where the tool supports it.
