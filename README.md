# danewesolko7.github.io
Dane Wesolko — Portfolio Site

A static site built with [Jekyll](https://jekyllrb.com/) and published by GitHub Pages. GitHub builds it on every push to `main`, so deploying is just pushing. The published output is plain HTML and CSS.

## Local preview

One-time setup (uses the macOS system Ruby; gems install into `vendor/`, not system-wide):

```sh
bundle install --path vendor/bundle
```

Run the preview server (rebuilds on save; restart it after editing `_config.yml`):

```sh
bundle exec jekyll serve
```

Open http://localhost:4000.

## Layout

```
_config.yml              site settings (title, email, LinkedIn, plugins)
_layouts/default.html    page shell: head, top bar, main, footer, scripts
_includes/               head.html · topbar.html · footer.html
_data/                   lists rendered by pages (work, experience, covers, packages…)
_templates/page.html     starter for a new page (never published)
assets/css/tokens.css    colors, type sizes, widths, dark mode. Change the look here
assets/css/base.css      element defaults, focus, skip link
assets/css/components.css  every shared component
assets/css/pages/        CSS only one page uses
assets/js/               nav.js (every page) + opt-in page scripts
assets/img/              images
```

## Adding a page

1. Copy `_templates/page.html` to the site root, for example `speaking.html`. It will publish at `/speaking/`.
2. Edit its front matter (title, description, nav).
3. Build the content from the components below. If a page needs something unique, add `assets/css/pages/<name>.css` and list it under `styles:`.

## Rules

- Colors and sizes come from `tokens.css` variables. No hex values elsewhere, and no inline `style=""`.
- Class names follow `.block`, `.block__part`, `.block--variant`.
- Breakpoints: 640px (stack to one column) and 768px (mobile nav).
- A component used by two pages belongs in `components.css`. A component used by one page belongs in `pages/`.

## Components

| Class | Use |
|---|---|
| `.hero`, `.hero--split` | Page intro. `--split` puts text beside media (`.hero__content` / `.hero__media`) |
| `.band`, `.band--rule`, `.surface-dark` | Full-width strip. `.surface-dark` stays black in light and dark mode |
| `.section` | Numbered section. Leave `.section__num` empty to auto-number. `--wide` for 1100px |
| `.section__head`, `--split` | Label + `.section__title` + `.section__intro`. `--split` puts a button on the right |
| `.stack` | Even vertical spacing between blocks in a section body |
| `.rows` / `.row` | Ruled rows. Default title \| text. Variants: `--table` (3 col), `--plain`, `--steps`. `a.row` is a link row |
| `.bullets`, `--sm` | Ruled list |
| `.grid`, `--sm`, `--lg`, `--3`, `--covers` | Responsive grids |
| `.cover`, `--lg` | Book cover image + caption |
| `.btn` + `--primary`, `--outline`, `--dark`, `--block` | Buttons. Group them in `.actions` |
| `.tag` + `--sm`, `--lg`, `--red`, `--muted` | Small uppercase label |
| `.lede`, `.note`, `.note--ruled` | Paragraph styles |
| `.stats`, `.cta-band`, `.plan`, `.quote`, `.faq`, `.split`, `.form` / `.field` | Landing-page pieces, see the book cover page for examples |
