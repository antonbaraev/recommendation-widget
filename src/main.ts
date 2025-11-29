import { TblWidget } from './widget';

if (!customElements.get('tbl-widget')) {
  customElements.define('tbl-widget', TblWidget);
}

export { TblWidget };
export type { TWidgetConfig } from './widget';
export type { TNormalizedItem } from './mapper';
export type { TRecommendationType } from './api';
