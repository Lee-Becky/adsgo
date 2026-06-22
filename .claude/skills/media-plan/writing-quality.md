# Writing Quality

All copy the skill emits — card titles, diagnoses, recommendations, narratives, button labels — must follow these 6 rules. They come from `frontend-playbook` adapted to media-plan's advertising/analytics context. Breaking any rule produces "AI slop" text that undermines an otherwise-polished visual.

---

## 1. Say exactly what happened

**Banned**: abstractions like "optimization", "intelligent adjustment", "full-chain reach", "cross-channel synergy", "seamless experience", "paradigm shift".

**Required**: a concrete action + object + outcome, in one sentence.

- ❌ "AI performed intelligent budget optimization."
- ✅ "Shifted $480/day from 3 underperforming adsets to the LAL 1% Purchasers segment on Apr 19. Daily conversions rose 12% over the following 3 days."

The test: could another human reproduce what happened from your sentence? If not, rewrite.

---

## 2. Every action has a reason

"Do X" alone is not a recommendation — it's an instruction, and instructions feel arbitrary. Always attach **why**.

- ❌ "Review 3 video creative concepts this week."
- ✅ "Review 3 video creative concepts this week — CTR on the current static-only rotation has dropped 22% in 7 days, and video typically recovers 15–25% of CTR within the first 72 hours."

Reasons can come from: search intel (cite with `data-source`), brand data, observed performance, calendar context. If you can't produce a reason, the recommendation probably shouldn't appear at all.

---

## 3. No invented jargon (explicit ban list)

These phrases are banned. If you wrote one, rewrite.

**Chinese**: 跨渠道一键发布 · 精准优化 · 智能赋能 · 全链路 · 数据驱动智能决策 · 一体化闭环 · 全域增长 · 高效转化 · 品效合一 · 私域深耕 · 精细化运营

**English**: cross-channel synergy · full-chain integration · seamless omni-experience · revolutionary · paradigm-shift · next-generation · AI-powered intelligent · end-to-end closed loop · holistic engagement · precision targeting (when it just means "targeting")

The replacement is always: describe the specific thing. "Publish the same campaign to both Meta and Google in one action" beats "跨渠道一键发布". "Match ad delivery to the 3 top-converting zip codes" beats "精准优化".

---

## 4. Before/after beats comparison tables

When explaining a change, put the same subject in before and after states. No three-column tables, no "old way / new way" framings.

- ❌ "Budget allocation has been updated per new AI recommendations, improving performance."
- ✅ "LAL 1% Purchasers was at $120/day and ROAS 4.1x on Apr 19. Today it's at $200/day and ROAS 5.2x."

This pattern works for: campaigns, audiences, creatives, dimensions, benchmarks. Always same subject, two time-points, real numbers.

---

## 5. Color semantics are consistent

If red means "problem" in one card, it means "problem" everywhere. If green means "on track", ditto. Never flip semantics across sections.

- `var(--mp-error)` / red tints = problems, losses, bans
- `var(--mp-warning)` / amber tints = caution, attention-needed, pending-your-action
- `var(--mp-success)` / emerald tints = wins, improvements, completions
- `var(--mp-primary)` / brand color = AI/system action, recommendations (not "also good")

A ROAS gain uses `var(--mp-success)`. An AI-generated recommendation uses `var(--mp-primary)`. They are NOT interchangeable.

---

## 6. Every number has a source or a reason

An unattributed number is just a claim. Each numeric in the output must satisfy one of:

- Comes from an external search (S1/S2/S3) and is wrapped with `data-source="<url>"` on the smallest enclosing element.
- Comes directly from the brand's profile or host-supplied performance data (no attribution needed — the user recognizes their own numbers).
- Is a clearly-labeled projection / range tied to a method ("projected +12–18% over 14 days, based on industry lift from similar seasonal events").

Banned: presenting single-point forecasts without a range. Banned: inventing industry averages without a source. Banned: "about 30%" with no basis.

---

## Voice calibration per phase

- **new_user**: encouraging, coach-like. "Here's the plan, here's why it fits you." Never salesy.
- **just_launched**: patient, realistic. "Early signal is noisy. Here's what typical week 1 looks like." Never over-celebrate.
- **running**: data-first, verb-first. "Reallocated $480/day. CTR up 23%. Next action: approve 3 video concepts." Punchy, specific.
- **dormant**: respectful, evidence-based. "You paused 14 days ago. Here's what changed in your market." Never nag, never urgency-manipulate.

Match the brand's `brand_tone[]` at the copy level (a "Playful" brand can use warmer connective tissue), but never soften the factual core.

---

## Quick self-check before returning

- [ ] No sentence uses a phrase from §3's ban list.
- [ ] Every recommendation has a "because…" clause.
- [ ] Every industry / competitor number has a `data-source`.
- [ ] Every projection has a range, not a point.
- [ ] Colors in the output carry the meanings declared in §5.
- [ ] The voice matches the phase's calibration.

If any box is unchecked, rewrite before returning.
