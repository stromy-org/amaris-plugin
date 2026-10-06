# Sources — Amaris Consulting voice (captured 2026-10-06)

Note: WebFetch returns model-summarised page text; quoted strings were relayed
verbatim by that tool and not re-checked against raw HTML.

## Read
- https://amaris.com : tagline "Make it happen, together.", nav, headline list.
- https://amaris.com/about-us/ : why/who/how mission text, five values, culture statement (anchors).
- https://amaris.com/fr/ : French hero "Réalisons cela ensemble.", nous/formal register, nav.
- https://amaris.com/insights/ : headline list (English only).
- https://amaris.com/insights/news/what-does-a-global-change-agent-consultant-actually-do/ : people profile, narrative style.
- https://amaris.com/insights/viewpoint/mes-governance-in-life-sciences-what-annex-22-and-the-new-ai-rules-really-mean/ : expert viewpoint style, anchors.
- https://amaris.com/insights/news/when-consulting-skills-create-social-impact-amaris-consultings-volunteering-programme/ : editorial opening (anchor).
- https://amaris.com/insights/news/advancing-workplace-equality-amaris-consulting-frances-2026-gender-equality-index-results/ : formal compliance register.
- https://amaris.com/client-story/the-ai-powered-transformation-of-a-leading-water-treatment-company/ : case structure.
- https://amaris.com/client-story/success-of-a-leader-in-health-technology/ : case tone.
- https://amaris.com/insights/news/renaud-montagne-appointed-as-co-ceo-of-amaris-consulting-alongside-federico-corsi-marking-a-new-stage-in-its-development/ : press release register.
- https://careers.amaris.com/journey : candidate register, you/we (anchor).
- Web search snippets (secondhand): French value names; Forbes/awards mentions (not used in voice files).

## Not accessed / thin
- https://amaris.com/news/ : fetch error (socket hang up).
- https://amaris.com/fr/a-propos/ : 404. https://amaris.com/spotlight/ : French page text not returned.
- French press kit PDF (cdn.amaris.com): HTTP 400. No French long-form body copy read.
- LinkedIn (www and fr): 404 / not fetchable; no Apify run made. No X or YouTube read. Social voice is unverified.
- groupamaris.com surfaced in search but is a different company; excluded.

## Social pass (2026-10-06, Apify)

# Social sources: Amaris Consulting

- Brand: Amaris Consulting (amaris.com). Handles taken from the amaris.com footer (read via WebFetch): X https://x.com/amaris, LinkedIn https://www.linkedin.com/company/amaris/. Facebook also linked (not scraped).
- X account verified: userName "Amaris", name "Amaris Consulting". LinkedIn verified: author.name "Amaris Consulting | Part of Mantu", universalName "amarisconsulting" (the /company/amaris/ URL resolved to it).
- Actors and runs (both succeeded first try, no retries, no login):
  - apidojo/tweet-scraper, run qYmLCB1TN0GUcadwe, dataset gobHncXKvNxJ9Gobx. Reported 20 items in the run summary but 40 were returned when fetched. Used 40 of 40 (no retweets or replies).
  - harvestapi/linkedin-company-posts, run DyFOpXodLGGTjubO2, dataset PhiNxRvzn7Cb6fOuE. Fetched 30; used 27 (excluded 1 employee post by Renaud Montagne, 2 company reshares carrying a repostId).
- Approx cost: well under $0.10 combined (runs took 11 s and 4 s; pay-per-result, exact billing not read).
- Lessons: the X feed is dormant (latest post 2024-08-08), so it is a stale register source. amaris.com HTML is client-rendered, so curl found no links; WebFetch rendering found the footer. No wrong-slug issue.
- Raw files: raw-x.json (4 items) and raw-linkedin.json (5 items) hold only the quoted items, not the full 40/27 sets. Counts in the profile section were hand-tallied from the fetched datasets, not computed by script.
- check_anchor_facts.py on social-anchors.md: exit 0.
