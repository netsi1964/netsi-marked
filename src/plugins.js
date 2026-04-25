const DEFAULT_HIGHLIGHT_THEME = 'https://esm.sh/@highlightjs/cdn-assets@11.11.1/es/styles/github.min.css?raw';
const DEFAULT_HIGHLIGHT_DARK_THEME = 'https://esm.sh/@highlightjs/cdn-assets@11.11.1/es/styles/github-dark.min.css?raw';

export function createMermaidPlugin(options = {}) {
  const fencePattern = /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/gi;
  return {
    name: 'mermaid',
    test(markdown) {
      return /```mermaid[\s\S]*?```/i.test(markdown);
    },
    async afterRender(root, context) {
      const blocks = [...root.querySelectorAll('pre > code.language-mermaid')];
      if (!blocks.length) return;

      const mermaid = options.mermaid ?? (await import(options.src ?? 'https://esm.sh/mermaid@11.12.0')).default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: context.theme === 'dark' ? 'dark' : 'default',
        ...options.config
      });

      context.dispatch('plugin-load', { plugin: 'mermaid', blocks: blocks.length });

      for (const [index, code] of blocks.entries()) {
        const source = decodeHtml(code.textContent.trim());
        const host = document.createElement('figure');
        host.className = 'netsi-marked__diagram netsi-marked__diagram--mermaid';
        host.setAttribute('data-plugin', 'mermaid');
        const id = `${context.id}-mermaid-${index}`;
        const { svg } = await mermaid.render(id, source);
        host.innerHTML = svg;
        code.closest('pre').replaceWith(host);
      }
    }
  };
}

export function createHeadingAnchorPlugin(options = {}) {
  return {
    name: 'heading-anchors',
    afterRender(root, context) {
      const min = options.minLevel ?? 2;
      const max = options.maxLevel ?? 4;
      root.querySelectorAll(`h${min}, h${min + 1}, h${min + 2}, h${max}`).forEach((heading) => {
        if (!/^H[1-6]$/.test(heading.tagName)) return;
        const level = Number(heading.tagName.slice(1));
        if (level < min || level > max) return;
        if (!heading.id) heading.id = slugify(heading.textContent);
        const link = document.createElement('a');
        link.className = 'netsi-marked__anchor';
        link.href = `#${heading.id}`;
        link.textContent = '#';
        link.setAttribute('aria-label', `Link to ${heading.textContent}`);
        heading.append(' ', link);
      });
      context.dispatch('plugin-load', { plugin: 'heading-anchors' });
    }
  };
}

export function createCodeEnhancePlugin(options = {}) {
  return {
    name: 'code-enhance',
    async afterRender(root, context) {
      const blocks = [...root.querySelectorAll('pre > code')];
      if (!blocks.length) return;

      let hljs = options.hljs;
      if (options.highlight !== false && !hljs) {
        try {
          hljs = (await import(options.src ?? 'https://esm.sh/@highlightjs/cdn-assets@11.11.1/es/highlight.min.js')).default;
        } catch {
          hljs = null;
        }
      }

      for (const code of blocks) {
        const pre = code.closest('pre');
        const lang = getLanguage(code);
        pre.classList.add('netsi-marked__codeblock');
        if (lang) pre.dataset.language = lang;

        if (hljs && lang && hljs.getLanguage?.(lang)) {
          code.innerHTML = hljs.highlight(code.textContent, { language: lang }).value;
        } else if (hljs) {
          code.innerHTML = hljs.highlightAuto(code.textContent).value;
        }

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'netsi-marked__codecopy';
        button.textContent = options.copyLabel ?? 'Copy';
        button.addEventListener('click', async () => {
          await navigator.clipboard.writeText(code.textContent);
          button.textContent = options.copiedLabel ?? 'Copied';
          context.dispatch('copy', { type: 'code', language: lang || 'plain' });
          setTimeout(() => (button.textContent = options.copyLabel ?? 'Copy'), 1500);
        });
        pre.append(button);
      }
      context.dispatch('plugin-load', { plugin: 'code-enhance', blocks: blocks.length });
    }
  };
}

export function createExternalLinksPlugin() {
  return {
    name: 'external-links',
    afterRender(root, context) {
      root.querySelectorAll('a[href^="http://"], a[href^="https://"]').forEach((link) => {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      });
      context.dispatch('plugin-load', { plugin: 'external-links' });
    }
  };
}

export function createCalloutPlugin() {
  return {
    name: 'callouts',
    beforeParse(markdown) {
      return markdown.replace(/^> \[!(NOTE|TIP|WARNING|IMPORTANT)\]\s*\n((?:>.*(?:\n|$))+)/gim, (_, type, body) => {
        const text = body.replace(/^> ?/gm, '').trim();
        return `<aside class="netsi-marked__callout netsi-marked__callout--${type.toLowerCase()}" role="note"><strong>${type}</strong>\n\n${text}</aside>`;
      });
    }
  };
}

export function builtInPlugins() {
  return [
    createCalloutPlugin(),
    createMermaidPlugin(),
    createCodeEnhancePlugin(),
    createHeadingAnchorPlugin(),
    createExternalLinksPlugin()
  ];
}

function slugify(value = '') {
  return value.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
}

function getLanguage(code) {
  return [...code.classList].find((name) => name.startsWith('language-'))?.replace('language-', '') ?? '';
}

function decodeHtml(value) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

export const highlightThemes = {
  light: DEFAULT_HIGHLIGHT_THEME,
  dark: DEFAULT_HIGHLIGHT_DARK_THEME
};
