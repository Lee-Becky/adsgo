# Data-Attribute Conventions

All interactivity in the emitted HTML is expressed through declarative `data-*` attributes. The host project intercepts events (click, change, etc.) and routes them to its own logic. The skill never writes inline JS.

---

## Root node (required on every generation)

```html
<section
  data-skill="media-plan"
  data-phase="new_user | just_launched | running | dormant"
  data-brand="{brand_name}"
  data-generated-at="{ISO8601}"
  data-phase-fallback="true?"     <!-- only when phase was inferred as running due to missing signals -->
  data-phase-forced="true?"       <!-- only when user override was applied -->
>
  <!-- menu-name-registry: ["brand-profile","campaign-editor",...] -->
  ...
</section>
```

---

## `data-nav-to` — navigation intent

Value is a **semantic menu name**, not a URL. The host project maps each value to its own route.

### Recommended vocabulary (stable across projects)

| Value | Meaning |
|---|---|
| `brand-profile` | Edit the brand's profile / identity page |
| `optimize-goals` | KPI / budget / objective settings |
| `campaign-editor` | Create or edit a single campaign |
| `batch-campaign-generator` | Bulk / AI-assisted campaign generation |
| `ad-manager` | View and manage running campaigns |
| `creative-library` | Review creative assets & variants |
| `analytics-dashboard` | Performance dashboards, detailed reports |
| `onboarding-restart` | Re-run onboarding for dormant / fresh reset |
| `auto-regeneration-settings` | Controls for automated creative regeneration |
| `integrations` | Connect external ad accounts, tracking pixels |
| `billing-budget` | Top-up, daily spend caps, invoices |

### Extension rule

If the Brand profile includes `custom_menu_names: string[]`, those values are **also legal** and must be echoed into the root-level `<!-- menu-name-registry: [...] -->` comment along with any recommended values used. The host project can thus reflect both built-in and custom menus in one pass.

### Validation

Every `data-nav-to` value on any element must be one of:
1. The recommended vocabulary above, OR
2. A value present in `brand.custom_menu_names`.

Anything else is an error.

---

## `data-card-state` — current visual/interaction state of a card

| Value | When to use |
|---|---|
| `idle` | Default / nothing pending |
| `collapsed` | Card is summarized, content hidden |
| `expanded` | Fully open |
| `loading` | Data still arriving (rare in this skill; only when S1/S2/S3 partially succeeded) |
| `pending` | Waiting on user action (approval, review) |
| `approved` | User already accepted this recommendation |
| `recommended` | Skill's top suggestion — visually prominent |
| `warning` | Something incomplete or failing (including "benchmark data unavailable") |
| `success` | A completed / positive state (e.g. KPI met, setup done) |

Only one `data-card-state` per card element.

---

## `data-action` — user-triggerable action on a button / control

| Value | Purpose |
|---|---|
| `approve-budget-suggestion` | Accept a budget reallocation the skill proposed |
| `review-creative` | Open the creative review flow |
| `publish-campaign` | Push a pending campaign live |
| `adjust-kpi-target` | Change ROAS / CPA / etc. target |
| `enable-auto-regen` | Turn on automatic creative regeneration |
| `enable-auto-execute` | Turn on automated budget optimization |
| `restart-from-best` | (dormant) Relaunch the historically best campaign |
| `restart-fresh` | (dormant) Start with fresh AI-suggested campaigns |
| `upload-creative` | Prompt user to upload raw creatives |
| `configure-tracking` | Fix pixel / event tracking |
| `acknowledge-warning` | Dismiss a non-critical warning card |

Same extension rule as `data-nav-to`: additional values may be defined by the host via a `brand.custom_actions: string[]` field, echoed in a `<!-- action-registry: [...] -->` comment.

---

## `data-source` — evidence attribution

Any claim drawn from an external search must attach:

```html
data-source="{url}"
data-fetched-at="{ISO8601}"
```

On the smallest wrapping element that contains the claim.

---

## Useful optional attributes

| Attribute | Purpose |
|---|---|
| `data-metric` | The metric name this element represents (e.g. `roas`, `cpa`, `ctr`) |
| `data-target` | Target value for a metric (pair with `data-metric`) |
| `data-current` | Current value for a metric |
| `data-period` | Time window (`7d`, `30d`, `this-week`, `w-1`, `w+1`) |
| `data-section` | Semantic section id matching the phase file (e.g. `summary-card`) |
| `data-competitor` | Name of the competitor this element references |
| `data-benchmark` | `industry-avg` / `industry-top-quartile` / `internal-best` |

These are optional but recommended — they enable host projects to render semantic-aware UI without re-parsing copy.

---

## Anti-patterns (do NOT do)

- ❌ `<button onclick="navigate('/campaigns')">` — no inline JS.
- ❌ `<a href="/ad-manager">` — the skill doesn't know real routes.
- ❌ `data-nav-to="/ad-manager"` — value must be the semantic name, not a path.
- ❌ `<script>...</script>` — never embed scripts.
- ❌ Text copy containing absolute URLs for navigation — use `data-nav-to` instead.
- ❌ Mixing languages in the same card unless the brand is explicitly multilingual.
