---
name: getting-started
client_summary: "Start here: install your plugin, switch on your tools, and find your way to the right guide."
description: >
  Day-0 setup and orientation for a Stromy plugin — install it, switch on the
  connectors it needs, confirm it worked, and find which guide answers your
  question. Use whenever someone is new, asks how to get started, how to
  install or set up the plugin, what they have available, or hits one of the
  two common snags: skills that look out of date after an update, or a tool
  that reads "Connected" but will not run in the chat. This skill ships inside
  the plugin and needs no connector, so it is the one that still answers when
  nothing else is switched on.
---
<!--
  GENERATED FILE — DO NOT EDIT.
  Owner:       scripts/sync-local-skills.py (operator-run: ./scripts/sync.sh local-skills)
  Source:      docs/enablement/skills/getting-started/SKILL.md
  This file is a mirror of its canonical source. A local edit here will be
  overwritten by the next mirror run. Edit the source, then:
    ./scripts/sync.sh local-skills
  Hand-authored skill? Set `_local: true` in frontmatter instead.
-->

<!--
Client-facing enablement doc — "Day 0" setup, distinct from the per-product guides.
Rendered into each client's SharePoint Training/ pack by the training-pack skill (C5),
alongside getting-started-core and the guides. Registered in coverage.md as the
`setup` topic; backed by briefs/getting-set-up.md (C8).

DUAL SURFACE — this file is BOTH the authored Day-0 doc AND the canonical source of the
`getting-started` local skill mirrored into every client plugin (`sync-manifest.json`
`local-skill-mirrors`). There is deliberately no second copy: edit here, then run
`./scripts/sync.sh local-skills`. It is a LOCAL skill, never MCP-hosted, because its whole
job is to still work when no connector is switched on — the failure mode it exists to fix.

AUDIENCE: the client, not the operator. Keep it plain-language and sensitivity-clean —
no client names, secrets, pricing, internal paths, or methodology detail; it ships to
every client. Like the `/` and `+` invocation UX, the install/settings UI is NOT
documented anywhere in-repo — every UI step here is grounded on LIVE CAPTURE of the real
app (see docs/enablement/media/setup/) plus operator confirmation. Never cite a repo path
for a UI step. Media anchors <!-- media: setup/... --> mark where the captured screenshot
is embedded at pack render time.
-->

# Getting set up — install, connect, and a fix for the two things that trip people up

This is the "Day 0" walkthrough: get your Stromy plugin installed, switch on the tools
it needs, and confirm it all worked. It also covers the **two setup snags** almost
everyone hits at least once — a plugin that looks out of date, and a tool that says it's
connected but won't run — so you can clear them yourself in under a minute.

You do this once per device. After that your setup travels with you into every
conversation (see *Getting started* for how that works).

## Before you start

You need three things, and Stromy provides the last two:

- A **Claude account** with plugin access (Claude for Work / Team, or Cowork).
- Your **plugin link** — the one-line marketplace address Stromy sends you (it looks
  like an `owner/name` handle, not a website).
- A minute. That's genuinely it — there's nothing to download or configure by hand.

## 1. Install your plugin

Your plugin is what carries *your* setup — your brand and voice for anything produced,
and the data access and tools your work depends on.

1. Open **Settings → Plugins** (or **Connectors & plugins**) in Claude.
2. **Add the marketplace** using the address Stromy gave you, then **Install** the
   plugin it lists for you.
3. Give it a moment, then confirm the plugin shows as installed with a skill count.

<!-- media: setup/01-add-marketplace -->
<!-- media: setup/02-install-plugin -->

> Installing is tied to **your account**, not one device — so once it's installed it
> shows up whether you use Claude in a **web browser** (claude.ai) or the **desktop
> app**. You don't install twice.

## 2. Switch on your tools

Some skills do their work through **connectors** — the engines that render a document or
query a data source. A connector has to be (a) **authorized** once, and (b) **on for the
conversation** you're working in.

1. In **Settings → Connectors**, find the Stromy connectors listed for you and click
   **Connect** on each.
2. A Stromy sign-in page opens in a new window (this is a standard **OAuth** sign-in —
   the same "Sign in with…" flow you've used on other sites). Approve it, and the window
   returns you to Claude with the connector showing **Connected**. Stromy never sees your
   Claude password, and Claude never sees your connector password — the sign-in is handled
   between you and Stromy. This is a **one-time** step per connector.
3. In a chat, open the **`+` menu → Connectors** and make sure the ones you need are
   **enabled for this chat**.

<!-- media: setup/03-authorize-connector -->
<!-- media: setup/03a-oauth-consent -->
<!-- media: setup/04-enable-in-chat -->

That last step is the one people miss — see *Troubleshooting* below.

## 3. Check it worked

Start a fresh chat and type **`/`** in the message box. You should see your skills, and
in the list each skill is **grouped under your plugin's name**. If you see them, you're
done — head to *Getting started* to learn how to actually work with them.

Or just ask: **"Describe my workspace."** Claude will list the plugin and skills it can see
and which connectors are on for the chat — the same check, in one sentence, and a good habit
to keep (see *Seeing what's inside your plugin* below).

<!-- media: setup/05-slash-check -->

There are two ways to run a skill (the `/` menu you just used, and the `+` menu →
**Plugins**), but most of the time you'll simply describe what you want and let Claude
pick — that's covered in *Getting started*.

## Seeing what's inside your plugin — your skills and tools

You don't have to memorise what you have. The quickest way is simply to **ask**; you can
also browse it by hand.

### Just ask Claude to describe your workspace

In any chat, ask in plain words:

> **"Describe my workspace."**

or *"What skills and tools do I have here?"* — and Claude will report what it can actually
see from where it's sitting: which **plugin(s)** you have installed, the **skills** each one
gives you, and which **connectors** are switched on for *this* conversation.

This is worth doing in a new chat, and it's the best first move whenever something seems
off. Because Claude is describing its own live setup rather than reading a list someone
wrote down, it's the fastest way to confirm an update actually landed, or that a connector
is genuinely on and not just *Connected* (see *Troubleshooting* below). Ask follow-ups the
same way — *"what can the research skills do?"*, *"is my brand data loaded?"* — and you'll
learn the shape of your setup far faster than by clicking through menus.

One thing Claude generally **can't** tell you is your plugin's **version number** — that
isn't exposed to it. **Settings → Plugins** is the place to read the version.

### Or browse it by hand

- **Your skills** — open the **`+` menu → Plugins → your plugin**. You'll see the full
  list of skills that plugin gives you, each with a one-line description of what it's for.
  This is also how you pick a brand when you have more than one plugin installed: the
  skills grouped under `your-brand` carry `your-brand`'s setup.
- **Your tools** — open **Settings → Connectors** (or the **`+` menu → Connectors** in a
  chat). Each connector expands to show the individual tools it provides — the engines
  that render a PDF, query a data source, and so on. You rarely call these directly (a
  skill uses them for you), but this is where you confirm what's available and that it's
  switched on.

Typing **`/`** and beginning a skill's name is the fast path to the same list — it filters
as you type, and each entry shows which plugin it belongs to.

<!-- media: setup/08-view-plugin-skills -->
<!-- media: setup/09-view-connector-tools -->

## Working in the browser and the desktop app

Same account, same setup, two places to use it: **claude.ai in a web browser** and the
**Claude desktop app**. Because installs live on your account, anything you set up in one
appears in the other. Use whichever you prefer — the guides and worked examples look the
same in both.

## Troubleshooting — the two common snags

### "I updated, but Claude still shows the old version of my skills"

Occasionally the **web** copy of your plugin lags behind after an update — you see the
old skills even though a new version shipped. This happens because claude.ai keeps a
cached copy of the marketplace. **Reinstalling the plugin on its own usually won't clear
it.** The reliable fix is to refresh the *marketplace*:

1. In **Settings → Plugins**, find your **marketplace** entry (not the plugin).
2. Open its **⋮ menu → Remove** to remove the marketplace.
3. **Add the marketplace again** using the same address.

Removing and re-adding forces Claude to fetch a fresh copy, and your up-to-date skills
appear. Your data and history are untouched — this only refreshes the plugin catalogue.

To check whether it worked, ask in a **new** chat: **"Describe my workspace — which skills
can you see?"** Comparing that answer before and after tells you whether the refresh
actually took, without guessing from the menus.

<!-- media: setup/06-remove-marketplace -->

### "A tool says it's connected, but Claude can't use it"

If Claude tells you a connector isn't available even though **Settings** shows it
connected, it's almost always **off for that particular conversation**. You can confirm it
in one question — ask **"which connectors are enabled in this chat?"** and Claude will tell
you what it can actually reach, which is the distinction Settings doesn't show you. Then fix
it one of two ways:

- Open the **`+` menu → Connectors** in that chat and switch the connector **on**, or
- Start a **new chat** — new chats pick up your currently-enabled connectors.

<!-- media: setup/07-connector-not-usable -->

### "Claude says it can't find my brand"

If you have **more than one** Stromy plugin installed (one per brand or entity), run the
skill from the plugin of the brand you want — its setup applies automatically. If a chat
is tied to a plugin without your brand data, Claude will say so plainly rather than
guessing. Pick your brand's plugin from the `/` or `+` menu and try again.

## Where to go next — the guide for what you want to do

Setup is a one-off. From here on, each **guide** teaches one product: what it's for, which
skill to reach for, how the skills hand off, and a worked example end to end. You'll only
have the guides for the products you're subscribed to — if one isn't in your `/` menu, that
product isn't part of your setup, which is expected, not a fault.

| You want to… | Ask for |
|---|---|
| Make a document, deck, PDF, chart or video | `format-guide` |
| Research Dutch government, policy or legislation | `nl-guide` |
| Edit your website, brand or assets | `asset-guide` |
| Generate branded images or short video | `media-guide` |
| Run a hosted analysis, like stakeholder mapping | `wf-guide` |
| Ask questions about Stromy itself | `org-guide` |

You don't have to remember the names. Describe what you're after in plain words and Claude
will pick the right one — or type **`/`** and browse. And if you're not sure what you have,
ask **"describe my workspace"** (above).

**One thing worth knowing before you start:** the guides live on Stromy's servers and reach
you through a connector, so a guide can only open if that product's connector is switched on
for the chat. If Claude tells you a connector isn't enabled, that's the fix — switch it on in
the `+` menu, or start a new chat. This skill is the exception: it ships inside your plugin,
so it always works.

## Getting help

If something's still not right, the fastest signal you can give us is the **feedback**
skill (`asset-feedback`) — it records what happened so we can fix it. It also runs
automatically at the end of every job, so you can just add a note when you have one.
Beyond that, your Stromy contact is always the human backstop.

---

*Next: read **Getting started** for how your setup travels with you and the everyday way
of working, then your product guides for what each set of skills can do.*
