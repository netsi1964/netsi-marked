import '../../src/index.js';
import { defineNetsiMarkedBuiltIns, supportsCustomizedBuiltIns } from '../../src/built-ins.js';

const sample = await fetch('../markdown/my-big-toe-demo.md').then((response) => response.text());
const root = document.documentElement;
const input = document.querySelector('#markdownInput');
const preview = document.querySelector('#preview');
const localeSelect = document.querySelector('#localeSelect');
const pluginSelect = document.querySelector('#pluginSelect');
const accentInput = document.querySelector('#accentInput');
const readyCode = document.querySelector('#readyCode');
const eventLog = document.querySelector('#eventLog');
const themeToggle = document.querySelector('#themeToggle');

input.value = sample;
preview.markdown = sample;
defineNetsiMarkedBuiltIns();

const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(localStorage.getItem('netsi-theme') || (prefersDark ? 'dark' : 'light'));
renderCode();

input.addEventListener('input', updatePreview);
localeSelect.addEventListener('change', updatePreview);
pluginSelect.addEventListener('change', updatePreview);
accentInput.addEventListener('input', () => {
  preview.style.setProperty('--netsi-marked-accent', accentInput.value);
  renderCode();
});
themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

['render-start', 'render-complete', 'render-error', 'copy', 'plugin-load', 'copy-error'].forEach((name) => {
  preview.addEventListener(`netsi-marked:${name}`, (event) => {
    const row = document.createElement('div');
    row.textContent = `${new Date().toLocaleTimeString()} netsi-marked:${name} ${JSON.stringify(event.detail)}`;
    eventLog.prepend(row);
  });
});

function updatePreview() {
  preview.locale = localeSelect.value;
  preview.setAttribute('locale', localeSelect.value);
  preview.setAttribute('plugins', selectedPlugins().join(','));
  preview.markdown = input.value;
  renderCode();
}

function selectedPlugins() {
  return [...pluginSelect.selectedOptions].map((option) => option.value);
}

function renderCode() {
  readyCode.textContent = `<netsi-marked\n  locale="${localeSelect.value}"\n  plugins="${selectedPlugins().join(',')}"\n  style="--netsi-marked-accent: ${accentInput.value}"\n>\n  <template type="text/markdown">\n${indent(input.value, 4)}\n  </template>\n</netsi-marked>`;
}

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('netsi-theme', theme);
  preview?.setAttribute('theme', theme);
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  themeToggle.textContent = theme === 'dark' ? 'Brug lyst tema' : 'Brug mørkt tema';
  preview?.dispatchEvent(new CustomEvent('netsi-marked:theme-change', { bubbles: true, composed: true, detail: { theme } }));
}

function indent(value, spaces) {
  const pad = ' '.repeat(spaces);
  return value.split('\n').map((line) => `${pad}${line}`).join('\n');
}

if (!supportsCustomizedBuiltIns()) {
  console.info('Customized built-ins are not supported in this browser. The autonomous <netsi-marked> element still works.');
}
