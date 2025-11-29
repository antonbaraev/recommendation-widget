import type { TNormalizedItem } from './types';
import type { TApiResponse } from '../api';
import { mapRecommendationItem } from './mapRecommendationItem';

export function mapApiResponse(apiResponse: TApiResponse): TNormalizedItem[] {
  if (!apiResponse.list || !Array.isArray(apiResponse.list)) {
    return [];
  }

  return apiResponse.list.map(mapRecommendationItem);
}
