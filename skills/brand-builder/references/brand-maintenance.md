# Brand Maintenance Reference

Detailed procedures for brand audit (Mode B), brand refresh (Mode C), full rebrand (Mode D), and consistency check (Mode E). These modes are summarized in SKILL.md — this file provides the full frameworks, scoring criteria, and templates.

---

## 1. Refresh vs. Rebrand Decision Framework

### 5-Question Diagnostic (detailed scoring)

Each question scored 1–5. Present to the user as an interactive exercise.

#### Q1: Core Values Alignment

| Score | Criteria | Example |
|-------|----------|---------|
| 5 | Values perfectly represent current mission and culture | "Our values of innovation and transparency are exactly who we are" |
| 4 | Minor gaps — values are right, expression is slightly off | "We still believe this, but the language feels corporate" |
| 3 | Some values resonate, others feel inherited/outdated | "Half of these were set by a previous leadership team" |
| 2 | Significant disconnect between stated and lived values | "We say 'customer first' but our brand feels product-centric" |
| 1 | Values don't represent the organization at all | "We've pivoted completely — these values are from a different company" |

#### Q2: Audience Relevance

| Score | Criteria | Example |
|-------|----------|---------|
| 5 | Brand strongly resonates with current target audience | "Our audience sees us exactly as we want to be seen" |
| 4 | Good resonance with minor blind spots | "Core audience loves us, but we're invisible to a growing segment" |
| 3 | Mixed reception — some connect, some don't | "Existing clients love us, new prospects find us confusing" |
| 2 | Growing disconnect between brand and audience expectations | "We look like a startup but sell to enterprises" |
| 1 | Brand actively repels or confuses target audience | "People think we do something completely different from what we offer" |

#### Q3: Visual Currency

| Score | Criteria | Example |
|-------|----------|---------|
| 5 | Timeless design that feels current and distinctive | "Our identity could have been designed last month" |
| 4 | Mostly current with minor dated elements | "Logo is strong, but our color palette feels 2015" |
| 3 | Showing age — recognizably from a previous era | "Gradients, drop shadows, and fonts that scream early 2010s" |
| 2 | Noticeably dated — creates credibility concerns | "Clients have mentioned our materials look old" |
| 1 | Severely outdated — embarrassing to use | "We avoid sending branded materials because they look unprofessional" |

#### Q4: Competitive Differentiation

| Score | Criteria | Example |
|-------|----------|---------|
| 5 | Instantly recognizable, clearly differentiated | "You'd never confuse us with a competitor" |
| 4 | Distinct but shares some category conventions | "We stand out, but follow some industry visual norms" |
| 3 | Somewhat differentiated — could be mistaken for peers | "We're in the blue-and-white consulting firm club" |
| 2 | Blends in with competitors | "Our materials look interchangeable with 3-4 competitors" |
| 1 | Indistinguishable from competitors or generic | "You could swap our logo onto a competitor's deck and nobody would notice" |

#### Q5: Business Model Fit

| Score | Criteria | Example |
|-------|----------|---------|
| 5 | Brand perfectly reflects current services and positioning | "Everything about our brand says exactly what we do" |
| 4 | Minor gaps — brand is right, scope has expanded slightly | "Brand covers our core, but we've added new service lines" |
| 3 | Noticeable mismatch — brand represents part of the business | "Our brand says 'PR agency' but we're really a full-service comms shop" |
| 2 | Significant mismatch — brand tells the wrong story | "We've merged/acquired and the brand only represents one legacy entity" |
| 1 | Complete mismatch — brand is from a different era/business | "We pivoted from B2C to B2B but the brand still screams consumer" |

### Decision Matrix

| Total Score | Recommendation | Rationale |
|-------------|---------------|-----------|
| 20–25 | **Mode C: Refresh** (light touch) | Brand equity is strong — modernize without disrupting recognition |
| 12–19 | **Mode C: Refresh** (with deep strategy update) | Foundation is sound but needs strategic realignment alongside visual evolution |
| 5–11 | **Mode D: Full Rebrand** | Too much is broken to evolve incrementally — reinvention is more efficient |

### Risk Factors (override scoring if present)

| Risk Factor | Impact | Recommendation |
|-------------|--------|----------------|
| Legal/trademark issues with current brand | Forces change | Mode D regardless of score |
| Merger/acquisition creating dual-brand confusion | Forces consolidation | Mode D with brand architecture work |
| Brand associated with a crisis or scandal | Reputation reset needed | Mode D with careful transition |
| Brand equity valued at >$1M (or significant market recognition) | High cost of disruption | Lean toward Mode C even at lower scores |
| Audience under 30 (digital-native) | Higher tolerance for change | Either mode works; lean toward bold moves |

---

## 2. Mode B: Brand Audit — Detailed Procedures

### Audit Preparation

Before scoring, gather:
1. **Brand artifacts** — all existing brand materials (charter.json, logos, guidelines, templates, website, social profiles)
2. **Scope agreement** — which dimensions to audit (default: all 5; user may skip Stakeholder Alignment if no external data)
3. **Audit objectives** — what triggered the audit? (routine check, leadership change, market shift, competitor move)

### Assessment Dimensions

#### Dimension 1: Brand Substance (strategic foundation)

| Score | Criteria |
|-------|----------|
| 5 | Mission, vision, values clearly articulated, consistently referenced, and actively lived |
| 4 | Strategy elements exist and are mostly current; minor gaps in articulation |
| 3 | Some strategic elements exist but feel generic or disconnected from daily operations |
| 2 | Strategy is vague, outdated, or contradicted by actual behavior |
| 1 | No articulated brand strategy; brand operates on inertia |

**What to check:**
- Does `profile.json` contain mission, vision, values?
- If `messaging/` exists: are pillars aligned with stated positioning?
- Does the brand archetype (if documented) coherently inform downstream elements?
- Is the positioning statement differentiated or could any competitor claim the same thing?

#### Dimension 2: Visual Consistency

| Score | Criteria |
|-------|----------|
| 5 | All materials perfectly match charter.json; logo usage impeccable; colors exact |
| 4 | Minor deviations (e.g., slightly off-brand color in one template); overall consistent |
| 3 | Noticeable inconsistencies across channels (web vs. print vs. social use different palettes) |
| 2 | Significant drift — multiple logo versions in use, colors don't match charter |
| 1 | No visual consistency; brand looks different everywhere |

**What to check:**
- Compare actual hex values in materials against `charter.json` colors
- Check logo usage: correct lockup? Clear space respected? Used on correct backgrounds?
- Typography: are specified fonts actually used? Fallbacks consistent?
- Layout patterns: do materials follow documented spacing/grid?

**Color drift detection (automated):**
1. Load `charter.json` → extract all color hex values
2. If materials are HTML/CSS → extract used colors and compare
3. Flag any color that differs by more than ΔE > 5 from the nearest charter color
4. Present drift examples with side-by-side swatches

#### Dimension 3: Messaging Consistency

| Score | Criteria |
|-------|----------|
| 5 | Unified voice across all channels; key messages consistently present; tagline usage correct |
| 4 | Voice is mostly consistent; occasional tone shifts between channels |
| 3 | Mixed messaging — some channels on-brand, others freelancing |
| 2 | Contradictory messages across channels; no clear unified voice |
| 1 | No messaging framework; every piece of content invents its own voice |

**What to check:**
- If `messaging/pillars.json` exists: are pillars reflected in actual communications?
- Tone alignment: does copy across materials match the documented voice guidelines?
- Tagline usage: is it used consistently? Modified without authorization?
- Cross-channel coherence: do website, proposals, social, press releases sound like the same brand?

**If no messaging framework exists:** Score N/A, note in findings, recommend establishing one via the `messaging-framework` skill.

#### Dimension 4: Competitive Positioning

| Score | Criteria |
|-------|----------|
| 5 | Clearly differentiated; unique visual and verbal territory; strong category presence |
| 4 | Well-positioned with minor category overlaps |
| 3 | Some differentiation but shares significant territory with competitors |
| 2 | Blends into category; hard to distinguish from peers |
| 1 | Indistinguishable from competitors; no unique positioning |

**What to check:**
- Compare visual identity against 3-5 direct competitors (if known)
- Identify shared color palettes, similar logo approaches, overlapping messaging
- Assess whether the brand's stated differentiation is actually visible in materials
- Note any "category cliché" elements (e.g., every fintech uses blue + geometric sans-serif)

#### Dimension 5: Stakeholder Alignment

| Score | Criteria |
|-------|----------|
| 5 | Internal team and external audiences perceive brand identically to how it's intended |
| 4 | Minor gaps between intent and perception; largely aligned |
| 3 | Internal team has different brand understanding than external audiences |
| 2 | Significant perception gaps; brand promise doesn't match delivery |
| 1 | Complete disconnect between intended and perceived brand |

**What to check:**
- If stakeholder research/surveys exist, compare against brand intent
- If no external data: assess based on available materials (website messaging vs. internal docs)
- Flag if brand promise in marketing materials is dramatically different from service delivery evidence
- This dimension may be scored N/A if insufficient evidence is available

### Health Scorecard Template

Generate an HTML page with:

```
Brand Health Scorecard — [Brand Name]
Date: [YYYY-MM-DD]

Radar chart (5 axes, one per dimension, 1-5 scale)
Color-coded bands:
  - 1.0–2.0: Critical (red)      — requires immediate attention
  - 2.1–3.0: Needs Attention (amber) — clear improvement path
  - 3.1–4.0: Healthy (light green)   — solid with minor gaps
  - 4.1–5.0: Strong (dark green)     — exemplary

Overall Health Score: [weighted average] / 5.0
Band: [Critical | Needs Attention | Healthy | Strong]

Per-dimension cards:
  [Dimension name] — [Score]/5 — [Band]
  Key findings: [2-3 bullet points]
  Evidence: [specific examples with screenshots/references]
  Recommended actions: [prioritized list]
```

Build the radar chart using inline SVG (no external dependencies). Use brand colors from charter.json for styling.

### Audit Report Structure

Generate as DOCX or Markdown:

1. **Executive Summary** — overall health score, top 3 findings, recommended next steps
2. **Audit Scope & Methodology** — what was assessed, scoring framework used
3. **Dimension Analysis** (one section per dimension):
   - Score and band
   - Detailed findings with evidence
   - Specific examples of strengths and weaknesses
   - Comparison against best practices
4. **Drift Report** — specific deviations from documented brand standards
   - Color drift (hex comparison table)
   - Typography drift (specified vs. actual fonts)
   - Logo usage issues (with examples)
   - Messaging drift (tone/content deviations)
5. **Recommendations** — prioritized action plan with effort estimates
   - Quick wins (can fix today)
   - Short-term improvements (1-4 weeks)
   - Strategic initiatives (requires deeper work — may trigger Mode C or D)
6. **Appendix** — raw scoring data, materials reviewed, methodology notes

---

## 3. Mode C: Brand Refresh — Detailed Procedures

### Equity Assessment Framework

For each brand element, classify as **keep**, **evolve**, or **retire**:

| Element | Keep (strong equity) | Evolve (update, don't replace) | Retire (start fresh) |
|---------|---------------------|-------------------------------|---------------------|
| **Logo** | Highly recognized; works at all sizes; timeless design | Recognizable but dated; needs modernization | Unrecognizable; doesn't scale; fundamentally flawed |
| **Colors** | Distinctive; strong associations; works across media | Good palette base but needs expansion or rebalancing | Generic; clashes with positioning; poor accessibility |
| **Typography** | Readable; distinctive; available for digital + print | Good typeface family but needs weight/style expansion | Dated; poor screen rendering; licensing issues |
| **Tagline** | Memorable; differentiating; tested well | Good concept but expression needs freshening | Meaningless; generic; no longer relevant |
| **Voice** | Distinctive; consistently applied; resonates | Recognizable but inconsistent; needs codification | Undefined; contradictory; alienates audience |
| **Imagery style** | Cohesive; distinctive; supports brand story | Good direction but execution is inconsistent | No defined style; stock-photo-generic |

Present this as an interactive exercise — show the current state of each element and ask the user to classify.

### Visual Evolution Approaches

After equity assessment, propose one of three evolution approaches:

1. **Refinement** — Subtle polish. Same DNA, cleaner execution. Logo gets sharper geometry, colors get better contrast, typography gets updated weights.
   - *When:* Most elements scored "keep". Brand is strong but looks slightly dated.
   - *Risk:* Low. Stakeholders may not even notice the changes.

2. **Modernization** — Visible evolution. Core elements preserved but significantly updated. New color extensions, contemporary typography, refreshed logo.
   - *When:* Mix of "keep" and "evolve". Brand needs a visible step forward.
   - *Risk:* Medium. Requires some internal communication.

3. **Extension** — Additive expansion. Keep existing identity but add new elements (sub-brands, motion principles, digital-first assets, expanded palette).
   - *When:* Identity is strong but incomplete for modern channels.
   - *Risk:* Low-medium. Existing materials remain valid; new ones expand the system.

### Phase Integration

Refresh enters the existing Phase 2–6 pipeline with modifications:

**Phase 2 (Visual Identity) — modified:**
- "Direction 0" is the current brand, presented alongside 2 new evolved directions
- Each new direction must pass the "squint test" against Direction 0
- User compares all three; may choose to blend elements

**Phase 3–6 — optional:**
- After direction selection, ask user: "How deep should the refresh go?"
  - Visual identity only → stop after Phase 2, export updated charter.json
  - + Design system → include Phase 3
  - + Imagery refresh → include Phase 4
  - + Template refresh → include Phase 5
  - Full refresh → all phases including brand book

### Squint Test Methodology

The "squint test" validates that the refresh preserves brand recognition:

1. Place old and new brand side by side at full size — note the differences
2. Scale both to 64×64px (thumbnail size) — they should feel like the same family
3. Show both as a mobile app icon — silhouette should be recognizably related
4. Place both logos on a white business card — the gestalt should be similar
5. If a stakeholder who knows the old brand would be confused by the new one, it's a rebrand, not a refresh

### Migration Plan Template

Generate as Markdown:

```markdown
# Brand Refresh Migration Plan — [Brand Name]

## Asset Inventory
| Asset Type | Current Version | New Version | Status |
|-----------|----------------|-------------|--------|
| Logo (primary) | [old file] | [new file] | Ready |
| Color palette | [old charter] | [new charter] | Ready |
| ... | ... | ... | ... |

## Old-to-New Mapping
| Element | Old | New | Change Type |
|---------|-----|-----|-------------|
| Primary color | #XXXXXX | #YYYYYY | Evolved |
| Heading font | [old] | [new] | Replaced |
| ... | ... | ... | ... |

## Priority Tiers
### Tier 1 — Immediate (Week 1)
- Digital properties (website, social profiles, email signatures)
- Active proposal templates
- Business cards (next print run)

### Tier 2 — Short-term (Weeks 2-4)
- Internal documents and templates
- Marketing collateral
- Partner/vendor communications

### Tier 3 — As-needed (Months 2-6)
- Printed materials (use existing stock, reprint with new brand)
- Signage and environmental graphics
- Archived materials (update if actively referenced)

## Rollout Timeline
| Week | Actions | Owner |
|------|---------|-------|
| 1 | Update digital assets, announce internally | ... |
| 2 | Distribute new templates, update email sigs | ... |
| ... | ... | ... |

## Stakeholder Notification
- Internal announcement: [date] — [channel]
- Client notification: [date] — [method]
- Public announcement: [date] — [channel] (if applicable)
```

---

## 4. Mode D: Full Rebrand — Detailed Procedures

### Rebrand Assessment

Before committing to a full rebrand, document:

1. **The "Why"** — what's driving the rebrand? (merger, pivot, reputation, growth, legal)
2. **Risk Analysis:**
   - Brand equity at stake (how much recognition/goodwill will be lost?)
   - Cost estimate (internal effort, external agency costs, material replacement)
   - Timeline pressure (is there a hard deadline? e.g., merger completion date)
   - Stakeholder sensitivity (will customers/partners be confused or concerned?)
3. **Go/No-Go Framework:**
   - Does the "why" justify the cost and risk?
   - Is there executive/leadership alignment?
   - Is the timeline realistic?
   - Present findings and get explicit user confirmation before proceeding

### Brand Archaeology

Catalog the current brand before building the new one:

1. **Inventory current assets** — every logo variant, color, font, template, guideline document
2. **Identify transferable equity** — elements that have value even if the brand changes:
   - Brand recognition elements (shapes, colors, spatial relationships)
   - Audience trust signals (longevity indicators, credibility markers)
   - Cultural associations (what does the brand mean to people?)
3. **Sacred cows conversation** — explicitly ask: "Is there ANYTHING from the current brand that absolutely must survive?" Common sacred cows:
   - A specific color ("our clients associate us with this blue")
   - A symbol or icon element
   - A name or name element
   - A tagline or phrase
4. Document sacred cows as hard constraints for Phase 0–6

### "Departing From" Context

Each phase in a rebrand explicitly contrasts against the old brand:

- **Phase 0 (Discovery):** "The old brand was positioned as [X]. We're departing from that because [Y]. The new brand should [Z]."
- **Phase 1 (Strategy):** Side-by-side old vs. new positioning. Show what's changing and why.
- **Phase 2 (Visual):** Present old visual identity as "Direction 0" for reference. New directions should feel deliberately different (unlike refresh, where they feel related).
- **Phase 3 (Design System):** Document old-to-new token mapping for migration.
- **Phase 4 (Imagery):** Show old imagery style as anti-reference — "we're moving away from this aesthetic."
- **Phase 5 (Templates):** Build entirely fresh — no evolution from old templates.
- **Phase 6 (Brand Book):** Include a "Brand Evolution" page showing old → new journey.

### Transition Planning

#### Communication Plan Template

```markdown
# Rebrand Communication Plan — [Brand Name]

## Internal Communications
### Pre-announcement (2-4 weeks before launch)
- Leadership briefing with rationale and preview
- Department head toolkit (talking points, FAQ)

### Launch day
- All-hands announcement with brand reveal
- New brand toolkit distribution (templates, guidelines, assets)
- Email signature changeover instructions

### Post-launch (weeks 1-4)
- FAQ document for common questions
- Feedback channel for issues
- Weekly check-ins on adoption

## External Communications
### Clients/Partners
- Personal outreach to top accounts (pre-launch)
- Formal announcement email/letter (launch day)
- Updated proposals and contracts with new branding

### Public/Market
- Press release (if warranted)
- Social media announcement
- Website switchover
- Industry publication outreach (if relevant)
```

#### Phased Rollout Schedule

| Phase | Timeline | Scope | Success Criteria |
|-------|----------|-------|-----------------|
| **Soft launch** | Week 1 | Internal systems, email, website | All digital touchpoints updated |
| **Client rollout** | Weeks 2-3 | Client-facing materials, proposals, contracts | Top 20 accounts notified |
| **Full rollout** | Weeks 4-8 | All materials, signage, print, partners | 100% material replacement |
| **Cleanup** | Months 3-6 | Retire old assets, update archived materials | No old-brand materials in active use |

#### Asset Deprecation Schedule

```markdown
## Asset Deprecation

### Immediate removal (Day 1)
- Old logo files from shared drives
- Old email signature templates
- Old social profile images

### Phased replacement (Weeks 1-4)
- Proposal templates → new versions
- Report templates → new versions
- Marketing collateral → new versions

### Gradual retirement (Months 1-6)
- Printed materials → use existing stock, reprint with new brand
- Signage → replace at next scheduled maintenance
- Partner co-branded materials → coordinate with partner timeline

### Archive (permanent)
- Old brand book → archive folder (reference only)
- Historical materials → clearly marked as "previous brand"
```

#### Post-Launch Monitoring

After rebrand launch, monitor for 90 days:
- Old brand materials still in circulation (flag for replacement)
- Stakeholder feedback and sentiment
- Brand recognition metrics (if measurable)
- Internal adoption rate (are people using new templates?)

---

## 5. Mode E: Consistency Check — Detailed Procedures

### Compliance Evaluation Criteria

| Element | Source of Truth | Pass Criteria | Fail Criteria |
|---------|----------------|---------------|---------------|
| **Logo usage** | `brand/logos/` + guidelines | Correct lockup, clear space, approved backgrounds | Wrong variant, insufficient clear space, unauthorized modification |
| **Primary colors** | `charter.json` → `colors` | Exact hex match (±ΔE 3) | Color differs by ΔE > 5, or uses non-brand color prominently |
| **Secondary colors** | `charter.json` → `colors` | Used appropriately per guidelines | Overused, or secondary used as primary |
| **Typography — headings** | `charter.json` → `fonts.heading` | Correct font family and weight | Wrong font, wrong weight, mixed heading fonts |
| **Typography — body** | `charter.json` → `fonts.body` | Correct font family, appropriate size (14-18px) | Wrong font, size too small/large, poor line height |
| **Tone of voice** | Brand guidelines / `messaging/` | Matches documented voice attributes | Contradicts voice guidelines (e.g., playful when brand is authoritative) |
| **Key messages** | `messaging/pillars.json` (if exists) | Core messages present or aligned | Off-message, contradicts positioning, makes unauthorized claims |
| **Image style** | Imagery direction guide | Matches documented imagery themes and treatment | Off-brand imagery, wrong style, inconsistent treatment |

### Material Handling

Different material types require different evaluation approaches:

| Material Type | How to Evaluate |
|--------------|----------------|
| **Files (PPTX, DOCX, PDF)** | Open file, extract colors/fonts/images, compare against charter |
| **URLs / websites** | Use playwright to screenshot, extract computed styles, compare |
| **Images (PNG, JPG)** | Visual comparison against brand standards — logo usage, color presence, typography |
| **Descriptions / copy** | Evaluate tone and messaging against voice guidelines |
| **Social media posts** | Check visual consistency + messaging alignment |
| **Email templates** | Check layout, colors, fonts, logo placement, signature format |

### Compliance Scorecard Template

Generate as HTML:

```
Brand Consistency Check — [Brand Name]
Date: [YYYY-MM-DD]
Materials reviewed: [count]

Overall Compliance: [X]%

Per-item table:
| Material | Element | Status | Finding | Fix |
|----------|---------|--------|---------|-----|
| Slide deck v2 | Logo | ✅ Pass | Correct lockup on dark bg | — |
| Slide deck v2 | Colors | ⚠️ Warning | Accent color is #FF6B35, charter says #FF6B2D | Update to #FF6B2D |
| Slide deck v2 | Typography | ❌ Fail | Using Arial instead of Inter | Replace with Inter |
| Website hero | Tone | ⚠️ Warning | Slightly more casual than guidelines suggest | Review voice guidelines |
| ... | ... | ... | ... | ... |

Status key:
  ✅ Pass — fully compliant
  ⚠️ Warning — minor deviation, low impact
  ❌ Fail — non-compliant, needs correction

Summary:
  Passes: [n] ([%])
  Warnings: [n] ([%])
  Fails: [n] ([%])

Priority fixes:
1. [Most impactful fix]
2. [Second most impactful]
3. [Third most impactful]
```

### Graceful Handling of Missing Brand Standards

If the brand data is incomplete (e.g., no `messaging/`, no imagery guide):

1. Note which standards are unavailable: "Cannot evaluate messaging consistency — no messaging framework found."
2. Evaluate only against available standards
3. In recommendations, suggest establishing missing standards: "Consider building a messaging framework to enable future consistency checks."
4. Score available elements only — don't penalize for missing standards, but don't give a pass either

### Quick Check vs. Deep Check

**Quick check** (default for Mode E):
- Evaluate 3-5 specific materials provided by the user
- Check the 4 most visible elements: logo, colors, typography, tone
- Produce scorecard with fix recommendations
- ~15-minute workflow

**Deep check** (user requests comprehensive audit):
- Redirect to Mode B (Brand Audit) — it's the full assessment
- Mode E is intentionally lightweight; Mode B is the thorough version
