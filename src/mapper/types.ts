import type { TRecommendationType } from '../api/types';

export type TNormalizedItem = {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  type: TRecommendationType;
  branding?: string;
};
