/**
 * Custom element entrypoint for rendering Markdown with sanitizing, plugins,
 * copy actions, and locale-aware labels.
 *
 * @example
 * ```ts
 * import { NetsiMarked } from '@netsi/marked/element';
 *
 * NetsiMarked.define();
 * ```
 *
 * @module
 */

/**
 * Browser custom element that renders Markdown into light DOM and can enhance
 * the output with built-in plugins such as Mermaid and code copy actions.
 */
export class NetsiMarked extends HTMLElement {
  /** Attribute names that trigger rerendering when changed. */
  static observedAttributes: string[];

  /** Registered locale dictionaries keyed by locale code. */
  static locales: Record<string, Record<string, string>>;

  /** Globally available plugin definitions for all instances. */
  static plugins: Array<Record<string, unknown>>;

  /**
   * Registers the custom element if it has not already been defined.
   * @param tagName The custom element name to register.
   */
  static define(tagName?: string): void;

  /**
   * Adds a plugin to the global plugin registry.
   * @param plugin The plugin definition to append.
   */
  static use(plugin: Record<string, unknown>): void;

  /**
   * Merges locale messages into the locale registry.
   * @param name The locale code to update.
   * @param messages The message overrides for that locale.
   */
  static setLocale(name: string, messages: Record<string, string>): void;

  /** The markdown source currently assigned to the element. */
  get markdown(): string;
  set markdown(value: string);

  /** The locale code used for labels and status text. */
  get locale(): string;

  /** The theme hint exposed to theme-aware plugins. */
  get theme(): string;

  /** Whether rendered HTML is sanitized before insertion. */
  get sanitize(): boolean;

  /** Whether the element renders a preview or the raw markdown source. */
  get view(): 'preview' | 'raw';

  /** Reads markdown, renders it, and runs the active plugin pipeline. */
  render(): Promise<void>;

  /** Copies the current markdown source to the clipboard. */
  copyMarkdown(): Promise<void>;

  /** Copies the rendered output as rich HTML with plain-text fallback. */
  copyFormatted(): Promise<void>;
}