# Contact Page Patterns

Guidelines for building high-converting B2B contact pages in Astro websites.

## Layout

Use a **split layout**: value proposition + contact info on the left (sticky on desktop),
form + alternative CTAs on the right. This pattern consistently outperforms
single-column layouts for B2B conversion.

```
hero-section (split, with background image at low opacity)
├── left column (sticky)
│   ├── section-kicker ("Contact")
│   ├── display heading
│   ├── body paragraph (1-2 sentences)
│   ├── score-line / trust element
│   ├── contact details (email, linkedin, location)
│   └── trust signal box ("We respond within 24h")
└── right column
    ├── form card (elevated surface)
    ├── discovery call card (sunken surface, calendar CTA)
    └── direct email channels (small route cards)
```

## Form Design

### Fields (B2B optimal — 4-5 fields max)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | text | yes | `autocomplete="name"` |
| Work email | email | yes | `autocomplete="email"`, placeholder `you@company.com` |
| Company | text | no | `autocomplete="organization"` |
| Inquiry type | select | no | Pre-qualify leads; show contextual hint on change |
| Message | textarea | yes | Outcome-oriented label: "How can we help?" not "Message" |

Skip phone number — it reduces conversion without improving lead quality for
consultancy services.

### Field Styling (theme-safe)

```css
.form-field input,
.form-field textarea,
.form-field select {
  border: 1.5px solid var(--border-default);
  background: var(--surface-primary);    /* NOT --surface-sunken */
  color: var(--text-body);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
}

.form-field input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(accent, 0.15);
}
```

**Critical dark mode rule**: Use `--surface-primary` for input backgrounds (not
`--surface-sunken`). `--surface-sunken` is darker than the card in dark mode,
making inputs disappear. `--surface-primary` provides subtle contrast against the
`--surface-elevated` card background.

### Labels

```css
.form-field label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--text-muted);
}
```

### Select dropdowns

Always use a custom chevron icon and `appearance: none` on the select. The native
browser dropdown arrow breaks visual consistency, especially in dark mode.

### Placeholders

Use descriptive placeholders that guide the user: "Your full name", "you@company.com",
"Tell us about your goals, current setup, and timeline..."

Set placeholder opacity to 0.6 to distinguish from filled values.

## CTA Text

Use outcome-driven CTAs, not generic labels:

| Good | Bad |
|------|-----|
| "Start the conversation" | "Submit" |
| "Get your AI strategy call" | "Send" |
| "Book a discovery call" | "Schedule" |

## Form Card Container

The form card should use `--surface-elevated` background with `--border-default`
border. This creates clear visual separation from the page background in both
light and dark mode.

```css
.contact-form-card {
  background: var(--surface-elevated);
  border: 1px solid var(--border-default);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}
```

## Discovery Call Section

Always include an alternative to the form — an embedded or linked calendar booking.
Place it immediately below the form card as a secondary CTA.

Pattern:
- Icon badge (accent color) + heading + description
- Pill-shaped outline link to Calendly/Cal.com
- Use `--surface-sunken` background to visually distinguish from the form card

## Trust Signals

Place at least one trust signal adjacent to the form:

- Response time guarantee ("We respond within 24 hours")
- Client count or notable logos
- A short testimonial
- Security/privacy note

Position this on the left column near the contact details, not buried below the fold.

## Direct Email Channels

For B2B sites with multiple departments, show small route cards below the form:

```
[Research & Intel]        [Partnerships]
intel@company.com         partnerships@company.com
```

These use `--surface-elevated` bg with subtle border, hover highlights with accent.

## Dark Mode Checklist

- [ ] Form card visually distinct from page background
- [ ] Input fields have visible borders (1.5px `--border-default`)
- [ ] Input text is `--text-body`, not a primitive color
- [ ] Placeholder text visible but muted (opacity 0.6 of `--text-muted`)
- [ ] Labels use `--text-muted` (not a primitive gray)
- [ ] Focus ring uses accent color with transparency
- [ ] Select dropdown arrow visible
- [ ] Discovery call card distinct from form card (different surface tier)
- [ ] All links use `--accent` or `--text-heading` for contrast
- [ ] Success/error states use semantic colors with transparency, not solid backgrounds

## Formspree Integration

Standard pattern for Astro static sites:

```js
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  btn.setAttribute('disabled', '');

  var data = new FormData(form);
  var res = await fetch(form.action, {
    method: 'POST',
    body: data,
    headers: { 'Accept': 'application/json' }
  });

  if (res.ok) {
    form.classList.add('hidden');
    success.classList.remove('hidden');
  } else {
    error.classList.remove('hidden');
    btn.removeAttribute('disabled');
  }
});
```

Re-initialize after Astro page transitions:
```js
document.addEventListener('astro:after-swap', initContactForm);
```

## Anti-patterns

- **Invisible inputs**: Using `--surface-sunken` for input bg on a `--surface-sunken` page
- **No labels**: Relying only on placeholders — they disappear on focus
- **Generic CTAs**: "Submit", "Send" — tells the user nothing about what happens next
- **Phone field for consultancy**: Reduces conversion, rarely used for first contact
- **Form-only page**: No alternative contact method — always offer email + calendar
- **Dark mode afterthought**: Hardcoded colors that only work in light mode
