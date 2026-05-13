/* @ts-self-types="./built-ins.d.ts" */

/**
 * Optional helpers for customized built-in elements that integrate with the
 * main netsi-marked preview element.
 */
import { NetsiMarked } from './netsi-marked.js';

/**
 * Important: a single custom element name cannot be registered twice.
 * If you define the autonomous <netsi-marked>, you cannot also define
 * is="netsi-marked" for a built-in element in the same registry.
 *
 * These opt-in customized built-ins use distinct names. They are excluded
 * from the default entrypoint because Safari does not support customized
 * built-in elements.
 */
export class NetsiMarkedTextarea extends HTMLTextAreaElement {
  /**
   * Syncs textarea input into the preview target defined by `preview-target`.
   */
  connectedCallback() {
    const target = this.getAttribute('preview-target');
    if (!target) return;
    const preview = document.querySelector(target);
    if (!preview) return;
    const update = () => {
      if ('markdown' in preview) preview.markdown = this.value;
    };
    this.addEventListener('input', update);
    update();
  }
}

/**
 * Registers the optional customized built-in preview helpers when the current
 * browser supports them.
 */
export function defineNetsiMarkedBuiltIns() {
  if (!supportsCustomizedBuiltIns()) return false;
  if (!customElements.get('netsi-marked-textarea')) {
    customElements.define('netsi-marked-textarea', NetsiMarkedTextarea, { extends: 'textarea' });
  }
  return true;
}

/**
 * Detects support for customized built-in elements in the current browser.
 */
export function supportsCustomizedBuiltIns() {
  try {
    const name = `x-test-${Math.random().toString(36).slice(2)}`;
    customElements.define(name, class extends HTMLButtonElement {}, { extends: 'button' });
    return document.createElement('button', { is: name }) instanceof HTMLButtonElement;
  } catch {
    return false;
  }
}

export { NetsiMarked };
