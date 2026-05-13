/* @ts-self-types="./index.d.ts" */

/**
 * Default JSR entrypoint for the netsi-marked package.
 *
 * Re-exports the custom element plus the locale and plugin helpers used to
 * extend the renderer in browser-first applications.
 */
export { NetsiMarked } from './netsi-marked.js';
export * from './plugins.js';
export * from './locales.js';

import { NetsiMarked } from './netsi-marked.js';
NetsiMarked.define();
