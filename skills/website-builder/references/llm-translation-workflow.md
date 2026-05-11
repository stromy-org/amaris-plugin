# LLM Translation Workflow

Skill-driven translation pipeline for multilingual Astro websites. Claude Code
performs the translation in-session — no Node script, no API key, no TMS.

This is the default workflow when `charter.website.i18n.translationWorkflow === "llm"`.

---

## Architecture

```
Source of truth (EN)                 Derived artifacts (target locale)
────────────────────                 ────────────────────────────────
src/data/company.ts    ── skill ──▶  src/data/company.ts
  (fields: Localized<T>)              (same file, nl field populated)
src/data/site.ts       ── skill ──▶  src/data/site.ts (same)
src/data/stats.ts      ── skill ──▶  (labels localized)
src/i18n/ui.en.ts      ── skill ──▶  src/i18n/ui.<locale>.ts
src/content/*/en/*.mdx ── skill ──▶  src/content/*/<locale>/*.mdx
                             │
                             ▼
              .i18n/translation-ledger.json
              (maps sha256(EN) → target locale approved output)
                             │
                             ▼
              src/i18n/glossary.md   (no-translate terms, preferred equivalents)
              src/i18n/brand-voice.md (archetype, register, tone, few-shot pairs)
```

## File Locations

| File | Purpose | Tracked in git? |
|------|---------|-----------------|
| `src/i18n/glossary.md` | No-translate terms + preferred locale equivalents | Yes |
| `src/i18n/brand-voice.md` | Archetype, register, tone rules, few-shot anchors | Yes |
| `.i18n/translation-ledger.json` | Cache: source hash → approved translations | Yes (intentional — makes re-runs stable) |
| `src/i18n/ui.<locale>.ts` | UI string translations per locale | Yes |
| `src/data/company.ts` | `Localized<T>` fields with all locales | Yes |

---

## Glossary Format (`src/i18n/glossary.md`)

```markdown
# Translation Glossary

## Do Not Translate (keep English verbatim)

- Brand Name (e.g., "Duke Strategies")
- Sub-brand names (e.g., "Duke Academy")
- Tagline (if decision is to keep EN)
- Founder names
- Industry terms kept in English (e.g., "M&A", "ESG", "due diligence")
- Partner/affiliate names
- Proper nouns (awards, publications)

## Preferred Equivalents

| English | Target Locale | Notes |
|---------|---------------|-------|
| Services | Onze diensten | NL example |
| About | Over ons | |
| Contact | Contact | Same in NL |

## Formatting Rules

- Numbers: copy verbatim
- Dates: format via `Intl.DateTimeFormat('<locale>')` — do not translate manually
- Phone numbers: copy verbatim
- Email addresses: copy verbatim
- URLs: copy verbatim

## Register

- Formal/informal pronoun choice (e.g., NL: formal `u`, never `je`)
```

---

## Brand Voice Format (`src/i18n/brand-voice.md`)

```markdown
# Brand Voice — Translation Guide

## Archetype & Tone

- Archetype: <from charter>
- Tone adjectives: <3-5 adjectives>
- Register: <formal/informal, pronoun choice>

## Signature Metaphors

- <metaphor family> — translate literally when idiomatic, rephrase otherwise
- Annotate per-phrase when a metaphor doesn't translate directly

## Sentence Rhythm

- <editorial style notes>
- <what to avoid: exclamation marks, marketing speak, anglicisms beyond glossary>

## Do-Not Patterns

- No exclamation marks in professional copy
- No "awesome/amazing" equivalents
- No anglicisms beyond the glossary whitelist

## Few-Shot Anchors (EN → Target Locale)

Provide 2-3 hand-picked golden translation pairs as calibration examples:

### Example 1 — Tagline
- EN: "Bridging Strategy and Impact"
- NL: "Bridging Strategy and Impact" (kept in English per glossary)

### Example 2 — Bio sentence
- EN: "With over 20 years in public affairs..."
- NL: "Met meer dan 20 jaar ervaring in public affairs..."

### Example 3 — Service description
- EN: "We help organizations navigate complex stakeholder landscapes."
- NL: "Wij helpen organisaties bij het navigeren van complexe stakeholder-landschappen."
```

---

## Translation Ledger Schema (`.i18n/translation-ledger.json`)

```json
{
  "schemaVersion": 1,
  "defaultLocale": "en",
  "targetLocales": ["nl"],
  "entries": {
    "<hash>": {
      "source": "<original EN string>",
      "translations": {
        "nl": "<translated string>"
      },
      "status": "pending | approved | stale",
      "path": "<file path where this string lives>",
      "field": "<field name or key>",
      "updatedAt": "<ISO 8601>"
    }
  }
}
```

### Hash computation

- Input: the exact EN source string (trimmed, normalized whitespace).
- Algorithm: SHA-256, first 12 hex characters.
- Purpose: detect when an EN string changes (hash changes → entry becomes `stale`).

### Status lifecycle

```
(new string) → pending → approved
                  ↑          │
                  └──stale───┘  (EN source changed)
```

- **`pending`**: newly translated, awaiting human review.
- **`approved`**: reviewed and accepted. Re-runs reuse this verbatim.
- **`stale`**: EN source changed since approval. Must be retranslated.

---

## Translation Procedure (step-by-step)

This is the procedure Claude Code follows when running a translation pass.

### Prerequisites

Load these files before translating:
1. `src/i18n/glossary.md`
2. `src/i18n/brand-voice.md`
3. `.i18n/translation-ledger.json`
4. All source files containing EN strings

### Step 1 — Enumerate translatable strings

Collect every user-facing string from:
- `src/i18n/ui.en.ts` (all keys)
- `src/data/company.ts` (all `Localized<string>` `.en` values)
- `src/data/site.ts` (all `Localized<string>` `.en` values)
- `src/data/stats.ts` (label fields)
- `src/content/*/en/*.mdx` (title, description, body — if content collections are translated)

### Step 2 — For each EN string

1. Compute `hash = sha256(source).substring(0, 12)`.
2. Look up `hash` in the ledger:
   - **Found + `approved`** → use the stored translation verbatim. Do not retranslate.
   - **Found + `stale`** → retranslate using glossary + voice rules. Update ledger entry.
   - **Not found** → translate from scratch. Append new ledger entry with `status: "pending"`.
3. Write the translation into the target file:
   - For `Localized<T>` fields: set `field.nl = translation`.
   - For `ui.<locale>.ts`: set the corresponding key.
   - For MDX: write the translated file to `src/content/<collection>/<locale>/`.

### Step 3 — System prompt for translation

When translating, Claude Code uses this internal framing:

```
You are translating for [Brand Name], a [archetype] brand in [industry].

Voice: [tone adjectives from brand-voice.md]
Register: [formal/informal, pronoun]
Metaphor family: [signature metaphors]

Rules:
1. NEVER translate terms in the "Do Not Translate" glossary list.
2. USE the "Preferred Equivalents" table for standard terms.
3. COPY numbers, emails, URLs, phone numbers, and dates verbatim.
4. MATCH the sentence rhythm described in brand-voice.md.
5. When the ledger has an "approved" entry for this hash, USE IT VERBATIM.
6. For new translations, aim for natural [target locale] that a native speaker
   would write — not translationese.

Few-shot anchors:
[Include the 2-3 examples from brand-voice.md]
```

### Step 4 — Write results

- Update all target files with translations.
- Update `.i18n/translation-ledger.json` with new/updated entries.
- All new entries get `status: "pending"`.

### Step 5 — Run invariant checks (pre-approval)

Before presenting for review, verify:

1. **Completeness**: every `Localized<string>` has both `en` and target locale.
2. **Number preservation**: numbers in NL output match EN source byte-for-byte.
3. **Email preservation**: email addresses identical.
4. **URL preservation**: URLs identical.
5. **Phone preservation**: phone numbers identical.
6. **Glossary compliance**: every "Do Not Translate" term that appears in EN also
   appears verbatim in the target locale output.
7. **UI key completeness**: `ui.<locale>.ts` has no missing keys vs. `ui.en.ts`.
8. **No orphan translations**: no target-locale string exists without an EN source.

Report any violations before proceeding to review.

---

## Review & Approval Procedure

### Human review

1. The user reviews `git diff src/data src/i18n .i18n` to see all changes.
2. Manual edits are accepted — Claude updates the ledger entry with the corrected
   translation (the ledger always reflects the committed state).
3. The user says "approve" (or approves individual entries).

### Approval

When the user approves:
1. Flip every `pending` ledger entry to `approved`.
2. Update `updatedAt` timestamps.
3. Commit the final state.

After approval, re-runs will reuse every approved translation verbatim (stable output).

---

## Maintenance Patterns

### Adding a new page

1. Write the EN content first.
2. Run the translation workflow — new strings get `pending` ledger entries.
3. Review and approve.

### Editing an EN string

1. Edit the EN field in the source file.
2. The old hash no longer matches → the ledger entry becomes `stale`.
3. Run the translation workflow — stale entries get retranslated.
4. Review and approve the updated translation.

### Adding a new locale

1. Update `charter.website.i18n.locales` and `labels`.
2. Update `astro.config.mjs` and `src/i18n/utils.ts`.
3. Create `src/i18n/ui.<newlocale>.ts` (empty typed stub).
4. Create `src/pages/<newlocale>/` by duplicating page structure.
5. Run the translation workflow for the new locale.
6. Review and approve.

### Bulk retranslation

To retranslate everything (e.g., after a voice/glossary change):
1. Mark all ledger entries as `stale`.
2. Run the translation workflow.
3. Review and approve.

---

## Pseudo-Locale Sweep

Before considering translations complete, run a pseudo-locale check:

1. Temporarily create an `en-XA` locale that wraps every `t()` output with
   `[[ ... ]]` brackets.
2. Build the site with this pseudo-locale.
3. Any text on the rendered page that is NOT wrapped in `[[ ]]` is a hardcoded
   string that bypassed the translation system.
4. Fix any discovered hardcoded strings, then remove the pseudo-locale.

This catches strings that were accidentally inlined in templates instead of using
`t('key')` or `pickLocale()`.

---

## Failure Modes & Recovery

| Failure | Symptom | Recovery |
|---------|---------|----------|
| Glossary term translated | "Duke Strategies" appears as "Duke Strategieen" | Add to glossary "Do Not Translate" list, mark ledger entry stale, retranslate |
| Wrong register | `je` used instead of `u` | Update brand-voice.md register rule, mark affected entries stale |
| Number altered | "20 years" → "twintig jaar" | Invariant check catches this; fix and re-run |
| Ledger hash collision | Two different strings share a 12-char hash (astronomically unlikely) | Extend hash to 16 chars for the colliding entries |
| Stale translations accumulate | Many `stale` entries after bulk EN edits | Run bulk retranslation (see above) |

---

## Relationship to Other Workflows

- **`inline` workflow**: manual editing of `ui.ts` and MDX. Still supported but
  `llm` is the default for new sites.
- **`tms` workflow**: Lokalise/Crowdin/Phrase sync via CI. For high-volume sites
  with professional translators.
- **Future automation**: the ledger + glossary + voice files are machine-readable.
  Converting this pipeline to a CI job using `@anthropic-ai/sdk` is possible
  without refactoring storage — only the execution path changes.

---

## Practical Notes (from Duke Strategies pilot, 2026-04)

Non-binding lessons from the first full LLM translation rollout.

### Pre-translation: extract hardcoded strings first

**Inline hardcoded strings are the #1 translation gap.** Before the first translation
pass, do a systematic sweep of all page templates to extract every user-visible string
to `ui.en.ts`. Common misses:

- Testimonial quotes embedded inline in page templates (not from data)
- Section headings and button labels written directly in `.astro` files
- Contact page mailto body templates (greeting lines, field labels)
- Academy program lists hardcoded in the homepage instead of sourced from data

Run the extraction sweep as a discrete step before any translation begins.

### Array fields in `Localized<T>` data

Array fields like `industries[]`, `deliverables[]`, `approach[]`, `signals[]` require
each element to be `Localized<string>`, not the array itself:

```ts
// Correct — each element is Localized<string>
industries: Localized<string>[];
// Each entry:
industries: [
  { en: "Energy", nl: "Energie" },
  { en: "Financial Services", nl: "Financiële dienstverlening" },
]
// Resolved per element:
service.industries.map(tag => pickLocale(tag, lang))
```

The workflow docs' enumeration step (Step 1) must account for this pattern — each
array element is a separate translatable string.

### Mailto body templates

Contact page mailto templates contain translatable text (greetings, field labels) mixed
with untranslatable data (email address, subject format). The glossary should explicitly
address mailto body translation rules — e.g., which parts to translate and which to
preserve verbatim.

### Combining type refactoring with translation

When a site starts monolingual and adds a second locale, the `Localized<T>` type
refactoring and NL value population should happen in a single pass. Wrapping strings in
`{ en: "..." }` then immediately adding `nl` in the next step means touching every data
entry twice. Combine into one edit per field.
