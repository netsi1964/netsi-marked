/**
 * Optional customized built-in element helpers for `netsi-marked`.
 *
 * These helpers are separate from the default entrypoint because Safari does
 * not support customized built-in elements.
 *
 * @module
 */

/**
 * A `<textarea is="netsi-marked-textarea">` helper that mirrors its value to a
 * target `netsi-marked` preview element.
 */
export class NetsiMarkedTextarea extends HTMLTextAreaElement {
  /** Attaches input syncing to the configured preview target. */
  connectedCallback(): void;
}

/**
 * Registers the optional customized built-in helpers when the current browser
 * supports them.
 */
export function defineNetsiMarkedBuiltIns(): boolean;

/**
 * Detects whether the current browser supports customized built-in elements.
 */
export function supportsCustomizedBuiltIns(): boolean;

/**
 * Re-export of the main custom element class for convenience.
 */
export { NetsiMarked } from './netsi-marked.js';