# Phase Selection

The four lifecycle phases represent where the brand is in its ad-program journey. Pick exactly one phase per generation using the table below. Evaluate rows top-to-bottom; the first match wins.

| # | Condition | Phase |
|---|-----------|-------|
| 1 | `campaigns_paused_at` is a valid ISO8601 date AND `campaigns_active_count == 0` | `dormant` |
| 2 | `has_published_campaign == false` OR `days_since_first_publish == null` | `new_user` |
| 3 | `has_published_campaign == true` AND `days_since_first_publish != null` AND `days_since_first_publish <= 1` | `just_launched` |
| 4 | otherwise | `running` |

## Fallback rules

- If **any state signal is absent** and no rule fires cleanly, default to `running` and set `data-phase-fallback="true"` on the root `<section>`. Add a `<!-- phase inferred as running due to missing state signals -->` HTML comment above the first section.
- If the **user explicitly overrides** ("force phase: dormant" / "render as new_user"), honor it and add `data-phase-forced="true"` on the root.

## One-phase-per-call

Never emit two phases in one fragment. If the user wants to compare phases, run the skill multiple times and concatenate outside.

## Signal semantics (reminders)

- `campaigns_paused_at`: set only when at least one campaign has been paused and is still paused. Not the historical first pause.
- `has_published_campaign`: `true` from the moment the first campaign was first published, even if it was later paused (pause state is captured by `campaigns_paused_at` + `campaigns_active_count`).
- `days_since_first_publish`: fractional values allowed (e.g. `0.5` = 12 hours). Row 3 tests `<= 1`.
- `campaigns_active_count`: live, not-paused campaigns only.

## Why this order

- **Row 1 first** — a dormant account has richer historical signal than a brand-new one; we don't want to misread "paused account with many past campaigns" as `new_user`.
- **Row 2 second** — after ruling out dormant, zero-publish brands are unambiguously `new_user`.
- **Row 3 third** — only freshly-launched brands get the 24h welcome view.
- **Row 4 default** — the most information-dense phase, suitable whenever there's an active campaign past its first day.
