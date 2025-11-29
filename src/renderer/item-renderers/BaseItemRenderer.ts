import type { TNormalizedItem } from '../../mapper/types';
import { RecommendationType } from '../../api/types';

export abstract class BaseItemRenderer {
  abstract render(item: TNormalizedItem): HTMLElement;

  protected getLinkTarget(item: TNormalizedItem): string {
    return item.type === RecommendationType.Sponsored ? '_blank' : '_self';
  }
}
