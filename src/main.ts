import { TblWidget } from './widget';

if (!customElements.get('tbl-widget')) {
  customElements.define('tbl-widget', TblWidget);
}

export { TblWidget };
export type { TWidgetConfig } from './widget/types';
export type { TNormalizedItem } from './mapper/types';
export type { TRecommendationType } from './api/types';
