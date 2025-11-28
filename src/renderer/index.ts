import type { TNormalizedItem } from '../mapper/types';
import WIDGET_STYLES from './styles.css?inline';

export const DEFAULT_WIDGET_TITLE = 'Recommended for you';

export class Renderer {
  private shadowRoot: ShadowRoot;

  constructor(shadowRoot: ShadowRoot) {
    this.shadowRoot = shadowRoot;
    this.injectStyles();
  }

  private injectStyles(): void {
    const style = document.createElement('style');
    style.textContent = WIDGET_STYLES;
    this.shadowRoot.appendChild(style);
  }

  renderLoading(): void {
    this.shadowRoot.innerHTML = '';
    this.injectStyles();

    const container = document.createElement('div');
    container.className = 'tbl-widget-container';

    const loading = document.createElement('div');
    loading.className = 'tbl-widget-loading';
    loading.textContent = 'Loading recommendations...';

    container.appendChild(loading);
    this.shadowRoot.appendChild(container);
  }

  renderError(message: string): void {
    this.shadowRoot.innerHTML = '';
    this.injectStyles();

    const container = document.createElement('div');
    container.className = 'tbl-widget-container';

    const error = document.createElement('div');
    error.className = 'tbl-widget-error';
    error.textContent = message;

    container.appendChild(error);
    this.shadowRoot.appendChild(container);
  }

  renderEmpty(): void {
    this.shadowRoot.innerHTML = '';
    this.injectStyles();

    const container = document.createElement('div');
    container.className = 'tbl-widget-container';

    const empty = document.createElement('div');
    empty.className = 'tbl-widget-empty';
    empty.textContent = 'No recommendations available';

    container.appendChild(empty);
    this.shadowRoot.appendChild(container);
  }

  private createItemElement(item: TNormalizedItem): HTMLElement {
    const isSponsored = item.type === 'sponsored';
    const target = isSponsored ? '_blank' : '_self';

    const link = document.createElement('a');
    link.href = item.url;
    link.target = target;
    link.className = `tbl-item ${isSponsored ? 'tbl-item-sponsored' : ''}`;

    if (item.thumbnailUrl) {
      const thumbnail = document.createElement('img');
      thumbnail.className = 'tbl-item-thumbnail';
      thumbnail.src = item.thumbnailUrl;
      thumbnail.alt = item.title;
      thumbnail.loading = 'lazy';
      link.appendChild(thumbnail);
    }

    const content = document.createElement('div');
    content.className = 'tbl-item-content';

    const title = document.createElement('h3');
    title.className = 'tbl-item-title';
    title.textContent = item.title;
    content.appendChild(title);

    if (isSponsored && item.branding) {
      const branding = document.createElement('div');
      branding.className = 'tbl-item-branding';
      branding.textContent = item.branding;
      content.appendChild(branding);
    }

    link.appendChild(content);

    return link;
  }

  renderRecommendations(items: TNormalizedItem[], title = DEFAULT_WIDGET_TITLE): void {
    this.shadowRoot.innerHTML = '';
    this.injectStyles();

    if (items.length === 0) {
      this.renderEmpty();
      return;
    }

    const container = document.createElement('div');
    container.className = 'tbl-widget-container';

    const header = document.createElement('div');
    header.className = 'tbl-widget-header';

    const titleElement = document.createElement('h2');
    titleElement.className = 'tbl-widget-title';
    titleElement.textContent = title;
    header.appendChild(titleElement);

    const branding = document.createElement('div');
    branding.className = 'tbl-widget-branding';

    const brandingText = document.createElement('span');
    brandingText.className = 'tbl-widget-branding-text';
    brandingText.textContent = 'Promoted Links';
    branding.appendChild(brandingText);

    header.appendChild(branding);
    container.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'tbl-widget-grid';

    items.forEach((item) => {
      const itemElement = this.createItemElement(item);
      grid.appendChild(itemElement);
    });

    container.appendChild(grid);
    this.shadowRoot.appendChild(container);
  }
}
