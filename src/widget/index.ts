import { createApiClient } from '../api';
import { mapApiResponse } from '../mapper';
import { Renderer } from '../renderer';
import type { TWidgetConfig } from './types';
import type { TApiRequestParams } from '../api/types';

const DEFAULT_CONFIG = {
  publisher: 'taboola-templates',
  appType: 'desktop',
  apiKey: 'f9040ab1b9c802857aa783c469d0e0ff7e7366e4',
  count: Math.floor(Math.random() * 4 + 6)
};

export class TblWidget extends HTMLElement {
  private renderer: Renderer | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return ['source-id', 'source-type', 'source-url', 'count', 'publisher', 'app-type', 'api-key'];
  }

  connectedCallback(): void {
    if (!this.shadowRoot) {
      console.error('Shadow root not initialized');
      return;
    }

    this.renderer = new Renderer(this.shadowRoot);
    this.loadRecommendations();
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (this.isConnected && oldValue !== newValue) {
      this.loadRecommendations();
    }
  }

  private getConfig(): TWidgetConfig | null {
    const sourceId = this.getAttribute('source-id');
    const sourceType = this.getAttribute('source-type');
    const sourceUrl = this.getAttribute('source-url');

    if (!sourceId || !sourceType || !sourceUrl) {
      return null;
    }

    return {
      sourceId,
      sourceType,
      sourceUrl,
      publisher: this.getAttribute('publisher') || DEFAULT_CONFIG.publisher,
      appType: this.getAttribute('app-type') || DEFAULT_CONFIG.appType,
      apiKey: this.getAttribute('api-key') || DEFAULT_CONFIG.apiKey,
      count: parseInt(this.getAttribute('count') || String(DEFAULT_CONFIG.count), 10)
    };
  }

  private buildApiParams(config: TWidgetConfig): TApiRequestParams {
    return {
      publisher: config.publisher || DEFAULT_CONFIG.publisher,
      'app.type': config.appType || DEFAULT_CONFIG.appType,
      'app.apikey': config.apiKey || DEFAULT_CONFIG.apiKey,
      'source.id': config.sourceId,
      'source.type': config.sourceType,
      'source.url': config.sourceUrl,
      count: config.count || DEFAULT_CONFIG.count
    };
  }

  private async loadRecommendations(): Promise<void> {
    if (!this.renderer) {
      return;
    }

    const config = this.getConfig();

    if (!config) {
      this.renderer.renderError(
        'Missing required attributes: source-id, source-type, and source-url are required'
      );
      return;
    }

    this.renderer.renderLoading();

    try {
      const apiClient = createApiClient();
      const apiParams = this.buildApiParams(config);
      const apiResponse = await apiClient.fetchRecommendations(apiParams);

      const recommendations = mapApiResponse(apiResponse);

      this.renderer.renderRecommendations(recommendations);

      this.dispatchEvent(
        new CustomEvent('tbl-loaded', {
          detail: { count: recommendations.length }
        })
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load recommendations';
      this.renderer.renderError(message);

      this.dispatchEvent(
        new CustomEvent('tbl-error', {
          detail: { error: message }
        })
      );
    }
  }

  reload(): void {
    this.loadRecommendations();
  }
}
