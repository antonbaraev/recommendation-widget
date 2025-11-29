import type { TNormalizedItem } from '../../mapper';
import { RecommendationType } from '../../api';

export abstract class BaseItemRenderer {
  abstract render(item: TNormalizedItem): HTMLElement;

  protected getLinkTarget(item: TNormalizedItem): string {
    return item.type === RecommendationType.Sponsored ? '_blank' : '_self';
  }
}
