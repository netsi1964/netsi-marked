export const locales = {
  en: {
    copyMarkdown: 'Copy MD',
    copyFormatted: 'Copy formatted',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    loading: 'Rendering markdown…',
    rendered: 'Markdown rendered',
    error: 'Could not render markdown',
    openSource: 'Open source markdown',
    renderedLabel: 'Rendered markdown content'
  },
  da: {
    copyMarkdown: 'Kopiér MD',
    copyFormatted: 'Kopiér formateret',
    copied: 'Kopieret',
    copyFailed: 'Kopiering fejlede',
    loading: 'Renderer markdown…',
    rendered: 'Markdown renderet',
    error: 'Markdown kunne ikke renderes',
    openSource: 'Åbn markdown-kilde',
    renderedLabel: 'Renderet markdown-indhold'
  }
};

export function mergeLocale(base = {}, override = {}) {
  return { ...base, ...override };
}
