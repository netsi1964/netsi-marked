# netsi-marked

`netsi-marked` is a vanilla JavaScript custom element for rendering Markdown with [`marked`](https://marked.js.org/), safe HTML sanitizing, Mermaid diagrams, code block enhancements, CSS variables, i18n, custom events, container-query friendly layouts, and copy actions.

## Install

```bash
npm install netsi-marked
```

```js
import 'netsi-marked';
```

JSR target:

```bash
npx jsr add @netsi/marked
```

```js
import '@netsi/marked';
```

## Basic usage

```html
<netsi-marked locale="en" plugins="mermaid,code-enhance,heading-anchors">
  <template type="text/markdown">
# Hello Markdown

```js
console.log('Rendered by netsi-marked');
```
  </template>
</netsi-marked>
```

## Loading a `.md` file

```html
<netsi-marked src="./docs/page.md" plugins="mermaid,code-enhance"></netsi-marked>
```

## JavaScript API

```js
const element = document.querySelector('netsi-marked');
element.markdown = '# Updated markdown';
await element.copyMarkdown();
await element.copyFormatted();
```

## Attributes

| Attribute | Example | Description |
|---|---|---|
| `src` | `src="./demo.md"` | Fetches markdown from a URL. |
| `plugins` | `plugins="mermaid,code-enhance"` | Comma-separated plugin list. |
| `locale` | `locale="da"` | UI language. Defaults to document language or English. |
| `theme` | `theme="dark"` | Hint for Mermaid/theme-aware plugins. |
| `sanitize` | `sanitize="false"` | Sanitizing is enabled by default. Disable only for trusted content. |
| `plain` | `plain` | Hides the toolbar. |
| `headless` | `headless` | Renders only markdown content without card/chrome styling. |
| `view` | `view="raw"` | `preview` (default) renders HTML; `raw` shows markdown source text. |
| `breaks` | `breaks` | Enables GFM line breaks in marked. |

## Built-in plugins

1. `callouts` — supports GitHub-style callouts such as `> [!NOTE]`.
2. `mermaid` — lazy-loads Mermaid only when a Mermaid code fence is present.
3. `code-enhance` — adds code copy buttons and optional Highlight.js formatting.
4. `heading-anchors` — adds heading ids and anchor links.
5. `external-links` — adds `target="_blank"` and safe `rel` values to external links.

## Custom plugins

```js
import { NetsiMarked } from 'netsi-marked';

NetsiMarked.use({
  name: 'word-count',
  afterRender(root, context) {
    const count = root.innerText.trim().split(/\s+/).length;
    context.dispatch('plugin-load', { plugin: 'word-count', count });
  }
});
```

A plugin can expose:

```ts
type NetsiMarkedPlugin = {
  name: string;
  test?: (markdown: string) => boolean;
  beforeParse?: (markdown: string, context: object) => string | Promise<string>;
  afterRender?: (root: HTMLElement, context: object) => void | Promise<void>;
};
```

## Events

All events bubble and are composed.

| Event | Description |
|---|---|
| `netsi-marked:render-start` | Fired before markdown is parsed. |
| `netsi-marked:render-complete` | Fired after plugins finish. |
| `netsi-marked:render-error` | Fired when rendering fails. |
| `netsi-marked:copy` | Fired after markdown, formatted content, or code is copied. |
| `netsi-marked:copy-error` | Fired if formatted copying fails. |
| `netsi-marked:plugin-load` | Fired when a plugin has been applied or lazy-loaded. |
| `netsi-marked:theme-change` | Used by the complete demo when the theme toggle changes. |

```js
document.addEventListener('netsi-marked:render-complete', (event) => {
  console.log(event.detail);
});
```

## CSS variables

```css
netsi-marked {
  --netsi-marked-font: system-ui, sans-serif;
  --netsi-marked-mono: ui-monospace, monospace;
  --netsi-marked-bg: Canvas;
  --netsi-marked-fg: CanvasText;
  --netsi-marked-accent: #0969da;
  --netsi-marked-border: color-mix(in srgb, CanvasText 18%, transparent);
  --netsi-marked-radius: 0.75rem;
  --netsi-marked-pad: 1rem;
}
```

The rendered markdown is projected into Light DOM as `.netsi-marked-content`, so page-level CSS can style headings, code blocks, diagrams, callouts, and tables.

## Accessibility and i18n

1. Toolbar actions are real buttons with keyboard support.
2. Copy/render feedback is announced through an `aria-live` status region.
3. The demo includes focus states and `prefers-reduced-motion` handling.
4. UI labels are locale-driven.

```js
import { NetsiMarked } from 'netsi-marked';

NetsiMarked.setLocale('eo', {
  copyMarkdown: 'Kopii MD',
  copyFormatted: 'Kopii formatitan',
  copied: 'Kopiita'
});
```

## About `is="netsi-marked"`

There are two custom element families:

1. Autonomous custom elements, such as `<netsi-marked>`.
2. Customized built-in elements, such as `<textarea is="netsi-marked-textarea">`.

The same custom element name cannot be registered both ways in the same registry. Because this package prioritizes the autonomous `<netsi-marked>` element, it does not register `is="netsi-marked"`.

The optional built-in helper uses a distinct name:

```js
import { defineNetsiMarkedBuiltIns } from 'netsi-marked/built-ins';
defineNetsiMarkedBuiltIns();
```

```html
<textarea is="netsi-marked-textarea" preview-target="#preview"></textarea>
<netsi-marked id="preview"></netsi-marked>
```

Customized built-ins are not supported by Safari, so they are not used as the primary API.

## Test demos

Run a local static server from the project root:

```bash
npm run demo
```

Then open:

1. `test/complete-demo/`
2. `test/npm-simple-example/`
3. `test/jsr-simple-example/`

The markdown fixtures are in `test/markdown/` and use My Big TOE-inspired content with Mermaid diagrams and code examples.

The `npm-simple-example` and `jsr-simple-example` load published packages through browser ESM URLs:

1. npm: `https://esm.sh/netsi-marked`
2. JSR: `https://esm.sh/jsr/@netsi/marked`

Quick online demos:

1. JSR simple demo: https://codepen.io/netsi1964/pen/jEMgyzr
2. NPM simple demo: https://codepen.io/netsi1964/pen/dPpxNeQ

## CodePen Pen 2.0 notes

The complete demo is already split into multiple files. For CodePen Pen 2.0, copy these files:

1. `test/complete-demo/index.html`
2. `test/complete-demo/main.js`
3. `styles/netsi-marked.css`
4. `src/index.js`
5. `src/netsi-marked.js`
6. `src/plugins.js`
7. `src/locales.js`
8. `src/built-ins.js`
9. `test/markdown/my-big-toe-demo.md`

For a single remote import CodePen variant, replace local source imports with an ESM CDN import after publishing.

## Publish checklist

1. Update `package.json` and `jsr.json` versions.
2. Run `npm install`.
3. Run `npm test`.
4. Run `npm pack --dry-run`.
5. Run `npx jsr publish --dry-run`.
6. Push to GitHub and create a GitHub Release to trigger `.github/workflows/publish.yml`.
