export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: {
    className?: string;
    attrs?: Record<string, string>;
    props?: Partial<HTMLElementTagNameMap[K]>;
    children?: Array<Node | string | null | undefined>;
    on?: Record<string, EventListenerOrEventListenerObject>;
  }
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag) as HTMLElementTagNameMap[K];

  if (options?.className) el.className = options.className;

  if (options?.attrs) {
    for (const [k, v] of Object.entries(options.attrs)) {
      el.setAttribute(k, v);
    }
  }

  if (options?.props) {
    Object.assign(el, options.props);
  }

  if (options?.children) {
    for (const c of options.children) {
      if (c == null) continue;
      if (typeof c === 'string') {
        el.appendChild(document.createTextNode(c));
      } else {
        el.appendChild(c);
      }
    }
  }

  if (options?.on) {
    for (const [evt, handler] of Object.entries(options.on)) {
      el.addEventListener(evt, handler);
    }
  }

  return el;
}
