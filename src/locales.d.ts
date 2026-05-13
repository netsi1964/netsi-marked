/**
 * Locale utilities for the `netsi-marked` toolbar and status text.
 *
 * @example
 * ```ts
 * import { mergeLocale } from '@netsi/marked/locales';
 * ```
 *
 * @module
 */

/**
 * Built-in locale dictionaries keyed by language code.
 */
export const locales: Record<string, Record<string, string>>;

/**
 * Creates a locale dictionary by shallow-merging a base locale with overrides.
 * @param base The starting locale dictionary.
 * @param override The overriding locale messages.
 */
export function mergeLocale(base?: Record<string, string>, override?: Record<string, string>): Record<string, string>;