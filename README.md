# Amaris Consulting Deliverables

Claude Code plugin for Amaris Consulting branded deliverables and brand tools

## Prerequisites

- Claude Code v2.1.49+
- Node.js 18+, Python 3.11+ with [uv](https://docs.astral.sh/uv/)
- GitHub access to this repo (`gh auth login`)

## Installation

Via marketplace:
```bash
/plugin marketplace add stromy-org/amaris-marketplace
/plugin install amaris-consulting
```

For local development:
```bash
git clone https://github.com/stromy-org/amaris-consulting.git
cd amaris-consulting
npm install
uv sync
claude --plugin-dir .
```

## Skills

| Skill | Description |
|-------|-------------|
| `example` | Example skill — replace with actual skills |

## Updating

```bash
/plugin update amaris-consulting
```

## License

See [LICENSE](LICENSE) for terms.
