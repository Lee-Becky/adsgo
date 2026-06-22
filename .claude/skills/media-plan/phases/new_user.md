# Phase: new_user

> **Visual ground truth: [`../references/visual-ground-truth/new_user.html`](../references/visual-ground-truth/new_user.html)** — open this file before generating. Mirror its DOM structure. Replace only brand-specific content (brand name, value proposition).

## Mission

The brand has not yet published any campaign. The page's job is **convert profile into confidence**: show the brand a credible plan is waiting, and make publishing the first campaign feel like the obvious next click.

## Sections (in order)

The ground truth file is the simplest of the four phases — essentially a single hero CTA card. Copy it verbatim:

1. **Hero CTA card** — `bg-white rounded-[20px] shadow-[-2px_2px_16px_rgba(14,0,45,0.06)] py-16 flex items-center justify-center`. Inside: rocket icon tile (`class="w-16 h-16 rounded-2xl"` + inline `style="background-color:var(--mp-primary-50, #f3f0ff); color:var(--mp-primary, #7033F5)"` with inline-SVG rocket icon — `stroke="currentColor"` so it inherits the tile's color), "Launch your first campaign" headline, sub-copy (1-sentence brand-aware), primary CTA button → `data-nav-to="batch-campaign-generator"` + `data-action="publish-campaign"`, dashed divider, "What happens after you publish" 4-step icon list

## Content guidance

### Hero CTA
- Headline: "Launch your first campaign" — universal across brands
- Sub-copy (1 sentence): "Your Media Plan will come to life once your ads are running. Create and publish a campaign — the platform will take it from there." — slight brand-aware paraphrase OK, keep encouraging tone (NOT salesy)
- 4-step list (the lucide icons + colors are fixed in the demo):
  - Radio (blue): "Ads go live on Meta / Google within hours"
  - Sparkles (amber): "the platform starts syncing performance data every hour"
  - TrendingUp (emerald): "AI optimizes budgets, pauses losers, scales winners"
  - BarChart3 (primary): "Your dashboard populates with real-time insights"
- Tone: encouraging, **not** salesy. The user hasn't committed yet — show the plan, don't push.

## Hard rules for this phase

- **Mirror the demo structure exactly.** This phase is the most stable of the four — the layout is universal across brands. Most content is templated.
- **Voice**: encouraging, coach-like. Match `brand_tone[]` for connective tissue (a "Playful" brand → "let's map out…"; a "Professional" brand → "Plan ready. Publish to begin."). Never salesy, never over-promise KPIs (the user hasn't set them yet).
- **No KPI numbers**. The user hasn't published or configured a target — do not predict ROAS X or conversions Y.

## Allowed `data-nav-to` values (whitelist)

`brand-profile` · `optimize-goals` · `batch-campaign-generator` · `campaign-editor` · `creative-library` · `integrations`

Plus any value in `brand.custom_menu_names[]`.

## Degradation table

| Brand field missing | Effect |
|---|---|
| `brand_name` | Required — ask user before generating |
| `slogan` | Skip the optional sub-headline variant (use the universal copy) |
| `customer_segments[0]` | OK; new_user phase doesn't depend on it directly |
