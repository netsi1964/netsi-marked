export function createMermaidPlugin(options?: Record<string, unknown>): {
  name: string;
  test(markdown: string): boolean;
  afterRender(root: HTMLElement, context: Record<string, unknown>): Promise<void>;
};

export function createHeadingAnchorPlugin(options?: Record<string, unknown>): {
  name: string;
  afterRender(root: HTMLElement, context: Record<string, unknown>): void;
};

export function createCodeEnhancePlugin(options?: Record<string, unknown>): {
  name: string;
  afterRender(root: HTMLElement, context: Record<string, unknown>): Promise<void>;
};

export function createExternalLinksPlugin(): {
  name: string;
  afterRender(root: HTMLElement, context: Record<string, unknown>): void;
};

export function createCalloutPlugin(): {
  name: string;
  beforeParse(markdown: string): string;
};

export function builtInPlugins(): Array<Record<string, unknown>>;

export const highlightThemes: {
  light: string;
  dark: string;
};