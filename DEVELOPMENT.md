# Development notes

How this site is built, previewed and edited. The [README](README.md) is about Dane.

A static site built with [Jekyll](https://jekyllrb.com/) and published by GitHub Pages. GitHub builds it on every push to `main`, so deploying is just pushing. The published output is plain HTML and CSS.

## Local preview

Ruby **3.3.4** (pinned in `.ruby-version`) matches what GitHub Pages builds with. It's managed by [rbenv](https://github.com/rbenv/rbenv), installed from GitHub, with no Homebrew needed (Homebrew no longer supports Intel Macs).

One-time machine setup (already done on this Mac):

```sh
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
# ~/.zshrc
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init - zsh)"

# Ruby 3.3 needs libyaml, which macOS doesn't ship. Build it once into ~/.rbenv/deps:
#   download yaml-0.2.5.tar.gz from https://pyyaml.org/download/libyaml/
#   ./configure --prefix=$HOME/.rbenv/deps/libyaml && make && make install
RUBY_CONFIGURE_OPTS="--with-libyaml-dir=$HOME/.rbenv/deps/libyaml" rbenv install 3.3.4
```

Keep `~/.rbenv/deps/libyaml`: Ruby links against it.

Project setup (gems install into `vendor/`):

```sh
bundle config set --local path vendor/bundle
bundle install
```

Run the preview server (rebuilds on save; restart it after editing `_config.yml`):

```sh
bundle exec jekyll serve
```

Open http://localhost:4000.

To match a newer GitHub Pages release later, compare https://pages.github.com/versions/ with `bundle exec github-pages versions`, then run `bundle update github-pages`. If it needs a newer Ruby: `git -C ~/.rbenv/plugins/ruby-build pull`, then `rbenv install <version>` and update `.ruby-version`.

## Layout

```
_config.yml              site settings (title, email, LinkedIn, plugins)
_layouts/default.html    page shell: head, color field (top bar + hero), main, footer, scripts
_includes/               head · topbar · hero (+ hero/ asides) · footer · section-head · points · faq · shot
_data/                   lists rendered by pages (work, experience, covers, packages…)
_templates/page.html     starter for a new page (never published)
assets/css/tokens.css    palette, type scale, layout, and the ground / field / band scopes. Change the look here
assets/css/base.css      element defaults, focus, skip link
assets/css/components.css  every shared component
assets/css/pages/        CSS only one page uses
assets/js/               nav.js (every page) + opt-in page scripts
assets/img/              images: covers/, graphic/, work/ (JPG masters + the WebP the pages use), og/ share cards
scripts/                 make-og.sh + og-card.html share images, make-webp.py WebP images (not published)
robots.txt, llms.txt, site.webmanifest, favicon.ico   root files for crawlers and browsers
```

## Adding a page

1. Copy `_templates/page.html` to the site root, for example `speaking.html`. It will publish at `/speaking/`.
2. Edit its front matter (title, description, crumb, ground, field, hero). The header links are global: add the page to `_data/nav.yml` if it belongs in them.
3. Make its share image: `scripts/make-og.sh <slug> <theme> "Kicker" "Title with *highlighted* word" "Crumb"` (theme: paper, dark, red, blue or yellow, matching the page) and set `image: /assets/img/og/<slug>.png`.
4. Build the content from the components below. If a page needs something unique, add `assets/css/pages/<name>.css` and list it under `styles:`.
5. Add a line for it under **Pages** in `llms.txt`.

## Adding an image

1. Drop the JPG into `assets/img/covers/`, `graphic/` or `work/`.
2. Run `python3 scripts/make-webp.py` (needs `pip install pillow`). It writes `<name>.webp`, plus `<name>-720.webp` for anything wider than 1000px.
3. Reference the `.webp` in the page or `_data/` file, with `width`, `height` and `alt`. Add `loading="lazy" decoding="async"` unless it's in the first screen. Product screenshots (1440×1080) go through `{% include shot.html %}`, which adds the 720w `srcset`.

The JPGs aren't published (`exclude:` in `_config.yml`); they're the masters for both scripts.

## Forms

Forms post to FormSubmit (`https://formsubmit.co/<email>`) and return visitors to `/thanks/` via the hidden `_next` field. Copy the hidden fields from an existing form. The first submission to a new address triggers a confirmation email that has to be clicked before messages arrive.

## SEO and GEO

Every page gets the following from `_includes/seo.html` and `_includes/schema.html`, driven by front matter:

| Front matter | Effect |
|---|---|
| `title`, `description` | `<title>`, meta description, Open Graph and Twitter tags. Keep titles under ~60 characters and descriptions under ~160 |
| `image`, `image_alt` | Share image (1200×630). Defaults to `site.image` |
| `og_type: profile`, `schema_type: ProfilePage` | Used on the home page so search and AI engines read it as a person's profile |
| `schema: <name>` | Adds `_includes/schema/<name>.html` to the page's JSON-LD (e.g. Service + FAQPage on the book page) |
| `noindex: true` | Keeps a page out of search results |

Site-wide:
- **JSON-LD** — WebSite, Person (identity details live in `_config.yml` under `person:`), WebPage, BreadcrumbList.
- **`/sitemap.xml`** — generated by `jekyll-sitemap`. Add `sitemap: false` to a page's front matter to leave it out.
- **`/robots.txt`** — allows all crawlers, including AI search and training crawlers.
- **`/llms.txt`** — a plain summary of the site for AI tools, built from `_data/`.
- **Icons** — `favicon.ico`, `assets/icons/` (SVG, Apple touch, 192/512), and `site.webmanifest`.
- **Search Console / Bing** — paste verification codes into `verification:` in `_config.yml`.
- **Analytics** — paste the snippet into `_includes/analytics.html` and set `analytics: true`. It only loads in production builds.
- **Domain** — the site lives at `danewesolko7.github.io` (`url:` in `_config.yml`). `danewesolko.com` forwards there through GoDaddy. Don't add a `CNAME` file or set a custom domain in GitHub Pages settings: GitHub would redirect back to the domain and create a loop.

Check structured data after changes with https://search.google.com/test/rich-results or https://validator.schema.org.

## Rules

- Colors and sizes come from `tokens.css` variables. No hex values elsewhere, and no inline `style=""` except CSS custom properties carrying data (the timeline's `--from`/`--to`).
- Class names follow `.block`, `.block__part`, `.block--variant`.
- Breakpoints: 600px (two-column card grids) and 1024px (desktop: 12-column grid, desktop type scale, inline nav).
- A component used by two pages belongs in `components.css`. A component used by one page belongs in `pages/`.
- No border radius, no shadows. Rules (1, 2, 4px) and color fields do the structural work.

## Look

Helvetica Neue (system font, no web font), a 12-column grid, a primary palette and large type. Each service has its own color: product = ink, graphic = red, book covers = blue.

| Front matter | Effect |
|---|---|
| `ground: paper \| white \| dark` | Page background and its text, rule and accent colors (`.ground-*` in `tokens.css`) |
| `field: red \| blue \| yellow` | Color field behind the header and hero; buttons inside it recolor themselves |
| `accent: blue` | Blue section numbers, labels and primary buttons (book covers) |
| `hero:` | The page intro, rendered by `_includes/hero.html` (see the comment there for its keys) |

## Components

| Class / include | Use |
|---|---|
| `.wrap`, `.grid12` | 1184px content column with 20/48px margins; 12-column grid on desktop |
| `.section` + `section-head.html` | Numbered section: 2px rule, auto number, label, h2, intro. `--aside` puts a label-only head beside the body, `--form` puts the text beside a form. `.section__body` (`--full`) and `.section__sub` place the content |
| `.band` + `.band-ink` / `.ground-*` | Full-width color strip around a section |
| `.label`, `.h2`, `.lead`, `.pull`, `.muted`, `.link` | Type roles |
| `.btn` + `--primary`, `--outline`, `--block`, `--arrow` | Buttons. Group them in `.actions` |
| `points.html` → `.points` (`--2 --3 --4`, `--steps`) | Ruled title + text items in columns; steps get a 4px accent rule |
| `.list` (`--2 --4 --lg --sm`) | Ruled `<ul>` |
| `.entries` / `.entry` (`--wide`) | CV jobs and portfolio items on an 11-column grid |
| `.stats` (`--wide`) | Key facts `<dl>` in a hero |
| `.cta-strip` | Bordered line of copy + button |
| `.figure` | Image + caption |
| `faq.html` → `.faq` | One-open-at-a-time accordion (native `<details name>`) |
| `.form`, `.field` (`--half`), `.field__hint` | Forms: bottom-border fields, two columns from 600px |
| `.service-link`, `.on-ink / .on-red / .on-blue` | Service row with a color bar; service color fills |
