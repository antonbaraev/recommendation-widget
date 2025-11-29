import { BaseItemRenderer } from './BaseItemRenderer';
import { SponsoredItemRenderer } from './SponsoredItemRenderer';
import { OrganicItemRenderer } from './OrganicItemRenderer';
import type { TRecommendationType } from '../../api/types';

const DEFAULT_RENDERERS: Record<TRecommendationType, BaseItemRenderer> = {
  sponsored: new SponsoredItemRenderer(),
  organic: new OrganicItemRenderer()
};

export class ItemRendererFactory {
  private renderers: Record<TRecommendationType, BaseItemRenderer>;

  constructor() {
    this.renderers = { ...DEFAULT_RENDERERS };
  }

  getRenderer(type: TRecommendationType): BaseItemRenderer {
    const renderer = this.renderers[type];

    if (!renderer) {
      throw new Error(`No renderer registered for type: ${type}`);
    }

    return renderer;
  }

  registerRenderer(type: TRecommendationType, renderer: BaseItemRenderer): void {
    this.renderers[type] = renderer;
  }
}
