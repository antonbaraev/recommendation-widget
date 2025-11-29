import type { TNormalizedItem } from '../mapper';
import WIDGET_STYLES from './styles.css?inline';
import { h } from '../utils';
import { ItemRendererFactory } from './item-renderers';

export const DEFAULT_WIDGET_TITLE = 'Recommended for you';

export class Renderer {
  private shadowRoot: ShadowRoot;
  private itemRendererFactory: ItemRendererFactory;

  constructor(shadowRoot: ShadowRoot) {
    this.shadowRoot = shadowRoot;
    this.itemRendererFactory = new ItemRendererFactory();
    this.injectStyles();
  }

  private injectStyles(): void {
    const style = h('style', {
      props: { textContent: WIDGET_STYLES }
    });
    this.shadowRoot.appendChild(style);
  }

  renderLoading(): void {
    this.shadowRoot.innerHTML = '';
    this.injectStyles();

    const container = h('div', {
      className: 'tbl-widget-container',
      children: [
        h('div', {
          className: 'tbl-widget-loading',
          props: { textContent: 'Loading recommendations...' }
        })
      ]
    });

    this.shadowRoot.appendChild(container);
  }

  renderError(message: string): void {
    this.shadowRoot.innerHTML = '';
    this.injectStyles();

    const container = h('div', {
      className: 'tbl-widget-container',
      children: [
        h('div', {
          className: 'tbl-widget-error',
          props: { textContent: message }
        })
      ]
    });

    this.shadowRoot.appendChild(container);
  }

  renderEmpty(): void {
    this.shadowRoot.innerHTML = '';
    this.injectStyles();

    const container = h('div', {
      className: 'tbl-widget-container',
      children: [
        h('div', {
          className: 'tbl-widget-empty',
          props: { textContent: 'No recommendations available' }
        })
      ]
    });

    this.shadowRoot.appendChild(container);
  }

  private createItemElement(item: TNormalizedItem): HTMLElement {
    const renderer = this.itemRendererFactory.getRenderer(item.type);
    return renderer.render(item);
  }

  renderRecommendations(items: TNormalizedItem[], title = DEFAULT_WIDGET_TITLE): void {
    this.shadowRoot.innerHTML = '';
    this.injectStyles();

    if (items.length === 0) {
      this.renderEmpty();
      return;
    }

    const container = h('div', {
      className: 'tbl-widget-container',
      children: [
        h('div', {
          className: 'tbl-widget-header',
          children: [
            h('h2', {
              className: 'tbl-widget-title',
              props: { textContent: title }
            }),
            h('div', {
              className: 'tbl-widget-branding',
              children: [
                h('span', {
                  className: 'tbl-widget-branding-text',
                  props: { textContent: 'Promoted Links' }
                })
              ]
            })
          ]
        }),
        h('div', {
          className: 'tbl-widget-separator'
        }),
        h('div', {
          className: 'tbl-widget-grid',
          children: items.map((item) => this.createItemElement(item))
        })
      ]
    });

    this.shadowRoot.appendChild(container);
  }
}
