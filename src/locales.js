export const locales = {
  en: {
    copyMarkdown: 'Copy MD',
    copyFormatted: 'Copy formatted',
    copied: 'Copied',
    copyFailed: 'Copy failed',
    loading: 'Rendering markdown…',
    rendered: 'Markdown rendered',
    raw: 'Showing raw markdown',
    error: 'Could not render markdown',
    openSource: 'Open source markdown',
    renderedLabel: 'Rendered markdown content',
    rawLabel: 'Raw markdown content'
  },
  da: {
    copyMarkdown: 'Kopiér MD',
    copyFormatted: 'Kopiér formateret',
    copied: 'Kopieret',
    copyFailed: 'Kopiering fejlede',
    loading: 'Renderer markdown…',
    rendered: 'Markdown renderet',
    raw: 'Viser rå markdown',
    error: 'Markdown kunne ikke renderes',
    openSource: 'Åbn markdown-kilde',
    renderedLabel: 'Renderet markdown-indhold',
    rawLabel: 'Rå markdown-indhold'
  }
};

export function mergeLocale(base = {}, override = {}) {
  return { ...base, ...override };
}
