# Deployment Configurations

Platform-specific deployment setup for generated websites.

## Compatibility Matrix

### Contact Form Compatibility

| Contact Form | GitHub Pages | Vercel | Netlify | Cloudflare Pages |
|-------------|:---:|:---:|:---:|:---:|
| `mailto` | Yes | Yes | Yes | Yes |
| `none` | Yes | Yes | Yes | Yes |
| `formspree` | Yes | Yes | Yes | Yes |
| `netlify-forms` | No | No | Yes | No |
| `custom-api` | No | Yes | Yes | Yes |

**Rules:**
- `mailto` is the preferred default for simple brochure sites and the standard path on GitHub Pages
- `netlify-forms` only valid with `platform: "netlify"`
- `custom-api` requires serverless — not available on GitHub Pages
- `formspree` is the universal hosted-form fallback

### Analytics Compatibility

All analytics options are client-side scripts — compatible with all platforms:

| Analytics | Requirements |
|-----------|-------------|
| `none` | No setup |
| `plausible` | SaaS account or self-hosted instance |
| `umami` | Self-hosted instance required |
| `google-analytics` | GA4 property ID |

## GitHub Pages

### Deploy Workflow

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Astro Config

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  // No 'base' needed with custom domain
  // Use base: '/<repo-name>' for github.io URLs
});
```

### Custom Domain Setup

1. Add 4 A records at DNS registrar:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
2. Add CNAME for `www`: `<org>.github.io`
3. Set custom domain in repo Settings → Pages
4. Enable "Enforce HTTPS"
5. Create `public/CNAME` file with domain name

## Vercel

### Deploy Workflow

No workflow needed — Vercel auto-deploys from GitHub. Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### Astro Config

```javascript
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://example.com',
  adapter: vercel(),
});
```

**Note**: Add `@astrojs/vercel` to dependencies if using serverless functions.
For static-only, no adapter needed.

## Netlify

### Deploy Config

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

### Netlify Forms Integration

Add `netlify` attribute to form:

```html
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <!-- fields -->
</form>
```

## Cloudflare Pages

### Deploy Config

Create `wrangler.toml`:

```toml
name = "website-name"
pages_build_output_dir = "dist"

[build]
command = "npm run build"
```

## Formspree Integration

Universal — works on all platforms:

```html
<form action="https://formspree.io/f/{form-id}" method="POST">
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

The form ID is created at formspree.io. Store the ID in `src/data/site.ts`.

## Analytics Integration

### Plausible

Add to BaseLayout `<head>`:

```html
<script defer data-domain="example.com"
  src="https://plausible.io/js/script.js"></script>
```

### Umami

```html
<script async
  src="https://analytics.example.com/script.js"
  data-website-id="xxx"></script>
```

### Google Analytics

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXX');
</script>
```
