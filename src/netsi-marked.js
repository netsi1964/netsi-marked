import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { builtInPlugins } from './plugins.js';
import { locales, mergeLocale } from './locales.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
:host {
  --netsi-marked-font: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --netsi-marked-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  --netsi-marked-bg: Canvas;
  --netsi-marked-fg: CanvasText;
  --netsi-marked-muted: color-mix(in srgb, CanvasText 68%, transparent);
  --netsi-marked-border: color-mix(in srgb, CanvasText 18%, transparent);
  --netsi-marked-accent: #0969da;
  --netsi-marked-radius: 0.75rem;
  --netsi-marked-gap: 0.65rem;
  --netsi-marked-pad: 1rem;
  --netsi-marked-code-bg: color-mix(in srgb, CanvasText 6%, Canvas);
  --netsi-marked-toolbar-bg: color-mix(in srgb, CanvasText 4%, Canvas);
  display: block;
  color: var(--netsi-marked-fg);
  font-family: var(--netsi-marked-font);
  container-type: inline-size;
}
.wrapper {
  border: 1px solid var(--netsi-marked-border);
  border-radius: var(--netsi-marked-radius);
  background: var(--netsi-marked-bg);
  overflow: clip;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--netsi-marked-gap);
  padding: 0.6rem var(--netsi-marked-pad);
  border-block-end: 1px solid var(--netsi-marked-border);
  background: var(--netsi-marked-toolbar-bg);
}
.actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
button {
  border: 1px solid var(--netsi-marked-border);
  border-radius: 999px;
  background: var(--netsi-marked-bg);
  color: var(--netsi-marked-fg);
  cursor: pointer;
  font: inherit;
  padding: 0.4rem 0.7rem;
}
button:hover { border-color: var(--netsi-marked-accent); }
button:focus-visible { outline: 3px solid color-mix(in srgb, var(--netsi-marked-accent) 35%, transparent); outline-offset: 2px; }
.status { color: var(--netsi-marked-muted); font-size: 0.875rem; }
.content-slot { padding: var(--netsi-marked-pad); }
:host([plain]) .toolbar { display: none; }
:host([headless]) .toolbar { display: none; }
:host([headless]) .wrapper {
  border: 0;
  border-radius: 0;
  background: transparent;
  overflow: visible;
}
:host([headless]) .content-slot { padding: 0; }
.netsi-marked-content--raw {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: var(--netsi-marked-mono);
  line-height: 1.6;
}
@container (max-width: 32rem) {
  .toolbar { align-items: stretch; flex-direction: column; }
  .actions { justify-content: flex-start; }
}
`);

export class NetsiMarked extends HTMLElement {
  static observedAttributes = ['src', 'plugins', 'sanitize', 'locale', 'theme', 'plain', 'headless', 'view'];
  static locales = { ...locales };
  static plugins = builtInPlugins();

  static define(tagName = 'netsi-marked') {
    if (!customElements.get(tagName)) customElements.define(tagName, this);
  }

  static use(plugin) {
    this.plugins = [...this.plugins, plugin];
  }

  static setLocale(name, messages) {
    this.locales[name] = mergeLocale(this.locales[name] ?? {}, messages);
  }

  #shadow;
  #content;
  #status;
  #copyMd;
  #copyFormatted;
  #abort;
  #sourceMarkdown = '';
  #initialMarkdown = '';
  #renderedHtml = '';
  #id = `netsi-marked-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#shadow.adoptedStyleSheets = [sheet];
    this.#shadow.innerHTML = `
      <section class="wrapper" part="wrapper">
        <header class="toolbar" part="toolbar">
          <span class="status" part="status" aria-live="polite"></span>
          <div class="actions" part="actions">
            <button type="button" class="copy-md" part="copy-md"></button>
            <button type="button" class="copy-formatted" part="copy-formatted"></button>
          </div>
        </header>
        <div class="content-slot" part="content-slot"><slot name="rendered"></slot></div>
      </section>
    `;
    this.#status = this.#shadow.querySelector('.status');
    this.#copyMd = this.#shadow.querySelector('.copy-md');
    this.#copyFormatted = this.#shadow.querySelector('.copy-formatted');
    this.#copyMd.addEventListener('click', () => this.copyMarkdown());
    this.#copyFormatted.addEventListener('click', () => this.copyFormatted());
  }

  connectedCallback() {
    this.#upgradeProperty('markdown');
    // Capture any inline markdown/template content before it gets replaced by the render host.
    this.#initialMarkdown = this.#extractInitialMarkdown();
    this.#ensureContentHost();
    this.#updateLabels();
    this.render();
  }

  disconnectedCallback() {
    this.#abort?.abort();
  }

  attributeChangedCallback() {
    if (!this.isConnected) return;
    this.#updateLabels();
    this.render();
  }

  get markdown() {
    return this.#sourceMarkdown || this.getAttribute('markdown') || this.#initialMarkdown;
  }

  set markdown(value) {
    this.#sourceMarkdown = String(value ?? '');
    if (this.isConnected) this.render();
  }

  get locale() {
    return this.getAttribute('locale') || document.documentElement.lang || 'en';
  }

  get theme() {
    return this.getAttribute('theme') || document.documentElement.dataset.theme || preferredTheme();
  }

  get sanitize() {
    return this.getAttribute('sanitize') !== 'false';
  }

  get view() {
    return this.getAttribute('view') === 'raw' ? 'raw' : 'preview';
  }

  async render() {
    this.#abort?.abort();
    this.#abort = new AbortController();
    const signal = this.#abort.signal;

    try {
      this.#dispatch('render-start');
      this.#setStatus(this.#t('loading'));
      const markdown = await this.#readMarkdown(signal);
      if (signal.aborted) return;

      if (this.view === 'raw') {
        this.#renderedHtml = '';
        this.#content.classList.add('netsi-marked-content--raw');
        this.#content.textContent = markdown;
        this.#content.setAttribute('aria-label', this.#t('rawLabel'));
        this.#setStatus(this.#t('raw'));
        this.#dispatch('render-complete', { markdown, html: '', plugins: [], view: 'raw' });
        return;
      }

      this.#content.classList.remove('netsi-marked-content--raw');

      const context = this.#context();
      let prepared = markdown;
      const plugins = this.#activePlugins(markdown);
      for (const plugin of plugins) prepared = await maybe(plugin.beforeParse?.(prepared, context), prepared);

      let html = marked.parse(prepared, {
        async: false,
        gfm: true,
        breaks: this.hasAttribute('breaks')
      });

      if (this.sanitize) {
        html = DOMPurify.sanitize(html, {
          ADD_TAGS: ['iframe'],
          ADD_ATTR: ['target', 'rel', 'part']
        });
      }

      this.#renderedHtml = html;
      this.#content.innerHTML = html;
      this.#content.setAttribute('aria-label', this.#t('renderedLabel'));

      for (const plugin of plugins) await plugin.afterRender?.(this.#content, context);
      this.#setStatus(this.#t('rendered'));
      this.#dispatch('render-complete', {
        markdown,
        html: this.#content.innerHTML,
        plugins: plugins.map((p) => p.name),
        view: 'preview'
      });
    } catch (error) {
      if (signal.aborted) return;
      this.#setStatus(this.#t('error'));
      this.#dispatch('render-error', { error });
      console.error(error);
    }
  }

  async copyMarkdown() {
    const markdown = await this.#readMarkdown();
    await navigator.clipboard.writeText(markdown);
    this.#setStatus(this.#t('copied'));
    this.#dispatch('copy', { type: 'markdown' });
  }

  async copyFormatted() {
    const html = this.#content.innerHTML || this.#renderedHtml;
    const plain = this.#content.innerText;
    try {
      if (window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([plain], { type: 'text/plain' })
          })
        ]);
      } else {
        await navigator.clipboard.writeText(plain);
      }
      this.#setStatus(this.#t('copied'));
      this.#dispatch('copy', { type: 'formatted' });
    } catch (error) {
      this.#setStatus(this.#t('copyFailed'));
      this.#dispatch('copy-error', { error });
    }
  }

  #ensureContentHost() {
    if (this.#content?.isConnected) return;
    this.#content = document.createElement('article');
    this.#content.className = 'netsi-marked-content';
    this.#content.slot = 'rendered';
    this.#content.part = 'content';
    this.#content.tabIndex = -1;
    this.replaceChildren(this.#content);
  }

  async #readMarkdown(signal) {
    if (this.hasAttribute('src')) {
      const response = await fetch(this.getAttribute('src'), { signal });
      if (!response.ok) throw new Error(`Could not fetch ${this.getAttribute('src')}: ${response.status}`);
      return response.text();
    }
    return this.#sourceMarkdown || this.getAttribute('markdown') || this.#initialMarkdown;
  }

  #extractInitialMarkdown() {
    const template = this.querySelector('template[type="text/markdown"]');
    if (template) return template.innerHTML.trim();
    return this.textContent.trim();
  }

  #activePlugins(markdown) {
    const requested = (this.getAttribute('plugins') || 'callouts,mermaid,code-enhance,heading-anchors,external-links')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    return this.constructor.plugins.filter((plugin) => requested.includes(plugin.name) && (!plugin.test || plugin.test(markdown)));
  }

  #context() {
    return {
      id: this.#id,
      element: this,
      theme: this.theme,
      locale: this.locale,
      dispatch: (name, detail) => this.#dispatch(name, detail)
    };
  }

  #dispatch(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(`netsi-marked:${name}`, { bubbles: true, composed: true, detail }));
  }

  #t(key) {
    const lang = this.locale.toLowerCase().split('-')[0];
    return (this.constructor.locales[lang] ?? this.constructor.locales.en)[key] ?? key;
  }

  #updateLabels() {
    if (!this.#copyMd) return;
    this.#copyMd.textContent = this.#t('copyMarkdown');
    this.#copyFormatted.textContent = this.#t('copyFormatted');
  }

  #setStatus(value) {
    this.#status.textContent = value;
  }

  #upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }
}

function preferredTheme() {
  return matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

async function maybe(value, fallback) {
  return value instanceof Promise ? value : value ?? fallback;
}
