export class NetsiMarked extends HTMLElement {
  static observedAttributes: string[];
  static locales: Record<string, Record<string, string>>;
  static plugins: Array<Record<string, unknown>>;
  static define(tagName?: string): void;
  static use(plugin: Record<string, unknown>): void;
  static setLocale(name: string, messages: Record<string, string>): void;
  get markdown(): string;
  set markdown(value: string);
  get locale(): string;
  get theme(): string;
  get sanitize(): boolean;
  get view(): 'preview' | 'raw';
  render(): Promise<void>;
  copyMarkdown(): Promise<void>;
  copyFormatted(): Promise<void>;
}