/**
 * Built-in plugin factories used by `netsi-marked`.
 *
 * These helpers return plugin objects that can be registered globally or passed
 * through the element's `plugins` attribute.
 *
 * @example
 * ```ts
 * import { createMermaidPlugin } from '@netsi/marked/plugins';
 * ```
 *
 * @module
 */

/**
 * Creates a plugin that lazy-loads Mermaid when fenced `mermaid` code blocks
 * are present in the markdown.
 * @param options Optional overrides for Mermaid loading and initialization.
 */
export function createMermaidPlugin(options?: Record<string, unknown>): {
  name: string;
  test(markdown: string): boolean;
  afterRender(root: HTMLElement, context: Record<string, unknown>): Promise<void>;
};

/**
 * Creates a plugin that appends anchor links to rendered headings.
 * @param options Optional heading level configuration.
 */
export function createHeadingAnchorPlugin(options?: Record<string, unknown>): {
  name: string;
  afterRender(root: HTMLElement, context: Record<string, unknown>): void;
};

/**
 * Creates a plugin that adds code highlighting and code-copy buttons.
 * @param options Optional Highlight.js loader and label overrides.
 */
export function createCodeEnhancePlugin(options?: Record<string, unknown>): {
  name: string;
  afterRender(root: HTMLElement, context: Record<string, unknown>): Promise<void>;
};

/**
 * Creates a plugin that adds `target="_blank"` and safe `rel` values to
 * external links.
 */
export function createExternalLinksPlugin(): {
  name: string;
  afterRender(root: HTMLElement, context: Record<string, unknown>): void;
};

/**
 * Creates a plugin that transforms GitHub-style callout blocks into semantic
 * HTML asides.
 */
export function createCalloutPlugin(): {
  name: string;
  beforeParse(markdown: string): string;
};

/**
 * Returns the default set of built-in plugins used by the custom element.
 */
export function builtInPlugins(): Array<Record<string, unknown>>;

/**
 * Default Highlight.js stylesheet URLs used by the code enhancement plugin.
 */
export const highlightThemes: {
  light: string;
  dark: string;
};