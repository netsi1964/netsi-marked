/**
 * Default package entrypoint for the browser-first `netsi-marked` custom element.
 *
 * Re-exports the main element, locale helpers, and built-in plugin factories.
 *
 * @example
 * ```ts
 * import '@netsi/marked';
 * ```
 *
 * @module
 */

/**
 * The main custom element used to render Markdown.
 */
export { NetsiMarked } from './netsi-marked.js';

/**
 * Built-in plugin factories and plugin-related helpers.
 */
export * from './plugins.js';

/**
 * Built-in locale dictionaries and locale merge helpers.
 */
export * from './locales.js';