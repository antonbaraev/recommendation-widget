import type { ValueOf } from '../utils';

export type TApiRequestParams = {
  publisher: string;
  'app.type': string;
  'app.apikey': string;
  'source.id': string;
  'source.type': string;
  'source.url': string;
  count: number;
};

export type TApiResponse = {
  id: string;
  list: TRecommendationItem[];
};

export type TRecommendationItem = {
  id: string;
  name: string;
  type: string;
  description: string;
  origin: TRecommendationType;
  url: string;
  thumbnail?: Array<{
    url: string;
    width: string;
    height: string;
  }>;
  categories: string[];
  branding: string;
  duration: string;
  views: string;
  created: string;
};

export const RecommendationType = {
  Sponsored: 'sponsored',
  Organic: 'organic'
} as const;

export type TRecommendationType = ValueOf<typeof RecommendationType>;
