---
name: feedback
description: "Record a candid retrospective of the task Claude just performed, appended (newest-first) to a single feedback log on the user's Desktop (~/Desktop/claude-feedback.md). Triggers on 'record feedback', 'log feedback', 'give feedback', 'feedback on that', 'how did that go', 'retrospective', or /feedback. Claude reflects honestly on what it was asked, which skill it used and why, how the experience went, and where skill or MCP guidance, modes, or tooling fell short — then appends the entry without ever rewriting earlier ones. The user emails the accumulated file back to Stromy manually. Use at the end of a task; do NOT use to act on or process past feedback (recording only)."
_local: true
---

# Feedback — append-only task retrospective

A dead-simple skill: at the end of a piece of work, capture Claude's own honest
retrospective and **append** it to one running log on the user's Desktop. The
log is never rewritten — entries stack newest-first. The user periodically
emails the file back to Stromy, where the feedback is triaged separately.

This skill is self-contained: no MCP, no `client-data`, no network. It only
reflects on the current conversation and writes one local file.

## When this runs

- **Manual (primary):** the user asks — "record feedback", "log feedback",
  "how did that go", "/feedback", etc. Just do it.
- **Offered (at most once):** at the natural end of a substantial task, you may
  offer once — *"Want me to log a quick feedback note on how that went?"* — and
  only proceed if they say yes. Never nag, never offer mid-task.

## What to write

Reflect **backward over the conversation that just happened** and be candid.
The point of this log is to improve the skills and tooling, so friction is more
valuable than praise — surface even small frictions, and never inflate a
success into "went perfectly" if anything was awkward.

Assemble the entry body using exactly these sections (markdown, no front
heading — the script adds the `## <timestamp> — <title>` line):

```
**Context:** <Cowork web | Claude Code | "<plugin/client> plugin"> — infer from the
working directory and conversation; if unsure, say so. Never look this up in client-data.
**Skill(s) used:** <skill names you actually used this task, or "none">

### What was I asked to do?
One or two sentences in your own words — the user's actual intent, not just their literal phrasing.

### How did I approach it — which skill did I reach for, and why?
What made you pick (or not pick) a skill/tool. If discovery or triggering was unclear, say that.

### How did it go? (experience using the skill / tools)
What worked smoothly; what was clunky. Concrete, not generic.

### Gaps & friction
- Unclear or missing guidance: …
- Missing skill mode / step: …
- Missing tool / MCP capability: …
- Wrong or misleading instruction: …
(Drop any bullet that genuinely doesn't apply; keep the ones that do.)

### What would have made this smoother?
Specific, actionable improvement opportunities for the skill/MCP/instructions.

### Outcome
<delivered | partial | blocked> — one line.
```

Pick a **short task title** (3–8 words) for the heading.

## How to append it

Do **not** edit the log file by hand — always go through the bundled script so
the write is append-only and atomic. From this skill's directory:

```bash
printf '%s' "$ENTRY_BODY" | python3 scripts/append_feedback.py --title "<short task title>"
```

(`$ENTRY_BODY` is the markdown body above. Pass it on stdin; the script adds the
timestamped heading, prepends it under the header, and preserves every earlier
entry.) The script resolves the target itself — `~/Desktop/claude-feedback.md`,
falling back to `~/claude-feedback.md` if there is no Desktop — and prints the
final path.

## After writing

Confirm to the user in one line: the path it was written to, and a reminder that
they can email that file to their Stromy contact whenever they like (nothing is
sent automatically).
