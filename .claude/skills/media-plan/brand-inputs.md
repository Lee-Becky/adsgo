# Brand Inputs — Normalized Schema

The `media-plan` skill consumes a **project-agnostic Brand profile** with the fields below. Host projects map their local data model into this shape before invoking the skill. The skill never reads files or APIs itself.

Legend:
- **R** — required (ask the user if missing; do not fabricate)
- **O** — optional (degrades the relevant section if absent)
- **Phase signals** — only used for phase selection

---

## Identity

| Field | Req | Type | Usage |
|---|---|---|---|
| `brand_name` | R | string | Root `data-brand` attribute; title copy; greeting |
| `website` | O | string (url) | Footer / trust badges |
| `logo_url` | O | string (url) | Avatar slot in header banners |
| `brand_tone` | O | string[] | Tone calibration for copy (e.g. "Professional", "Playful") |
| `colors` | O | `{ hex, label }[]` | Passed to design-system chain as fallback accents |
| `slogan` | O | string | Optional hero line on `new_user` and `dormant` |

## Business

| Field | Req | Type | Usage |
|---|---|---|---|
| `client_industry` | R | string | Feeds S1 industry-benchmark search |
| `client_industry_detail` | O | string | Refines S1 query when present |
| `business_model` | O | string | B2B / B2C / B2B2C → adjusts funnel narrative |
| `pricing_model` | O | string | "premium" / "value" / "性价比" → KPI target framing |
| `product_lifecycle` | O | string | introduction / growth / maturity / decline → strategy lean |
| `company_scale` | O | string | startup / smb / enterprise → budget / risk posture |
| `company_location` | O | string | Minor: tie-breaker for S3 when `target_region` is "Global" |

## Market

| Field | Req | Type | Usage |
|---|---|---|---|
| `target_region` | R | string | S1 + S3 search region; seasonality calendar |
| `market_keywords` | O | string[] | Enriches creative angles; paid-search seeds |
| `unique_value_proposition` | O | string | Hero copy; creative hook generation |

## Audience

| Field | Req | Type | Usage |
|---|---|---|---|
| `customer_segments` | R (≥1) | `{ name, description, keywords?, age_range?, income_level?, ... }[]` | Audience cards; lookalike strategy |
| `audience_tags` | O | string[] | Short pills in audience summary |
| `customer_hangouts` | O | string[] | Channel-selection rationale |

## Offering

| Field | Req | Type | Usage |
|---|---|---|---|
| `product_features` | O | `{ text, keywords?[] }[]` | Creative variant prompts; angle ideation |

## Channel & Objective

| Field | Req | Type | Usage |
|---|---|---|---|
| `marketing_channels` | O | string[] OR `{ name, weight? }[]` | Weekly plan channel mix; S3 platform query |
| `marketing_goal` | R | string | Determines KPI family (ROAS / CPA / CPL / reach / retention) |

## Competition

| Field | Req | Type | Usage |
|---|---|---|---|
| `competitors` | R (≥1) | `{ name, url?, description? }[]` | Feeds S2 competitor search (top 3 by array order) |

## Strategy Dimensions

| Field | Req | Type | Usage |
|---|---|---|---|
| `dimensions.market_maturity` | O | string | growth / mature / emerging → aggressiveness dial |
| `dimensions.price_tier` | O | string | premium / mid / value → creative tone |
| `dimensions.impact_analysis.impact_factors` | O | `{ category, factor, importance }[]` | Risk callouts on `running` / `dormant` |
| `dimensions.differentiation_type` | O | string[] | Hero messaging differentiators |

## State signals (phase selection only)

| Field | Req | Type | Usage |
|---|---|---|---|
| `has_published_campaign` | R | boolean | Gate for `new_user` |
| `days_since_first_publish` | O | number \| null | Gate for `just_launched` (≤ 1) |
| `campaigns_active_count` | O | number | Part of `dormant` gate |
| `campaigns_paused_at` | O | ISO8601 \| null | Part of `dormant` gate |

## Custom extensions

| Field | Req | Type | Usage |
|---|---|---|---|
| `custom_menu_names` | O | string[] | Additional `data-nav-to` values that the host project supports beyond the recommended vocabulary. Values appearing here are legal in skill output and will be echoed in the `<!-- menu-name-registry -->` comment. |
| `custom_actions` | O | string[] | Additional `data-action` values the host supports; echoed in `<!-- action-registry -->`. |
| `week_start_day` | O | `"monday" \| "sunday" \| "saturday"` | Overrides the default calendar-week boundary used by `phases/running.md`'s `weekly-strategy`. Default: Mon for most regions, Sun for US-only. |

---

## Field-completeness strategy

- **Required missing** → skill asks the user once, then proceeds with what was given.
- **Optional missing** → skill renders a simpler version of any section that depended on it and flags `data-card-state="idle"` + a short neutral caption.
- **State signals missing** → skill asks user which phase to render, or accepts an explicit `force phase: <name>` directive.

Never fabricate. Empty is better than invented.
