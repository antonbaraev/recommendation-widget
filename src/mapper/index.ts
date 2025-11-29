import type { TNormalizedItem } from './types';
import type { TRecommendationItem, TApiResponse, TRecommendationType } from '../api/types';
import { RecommendationType } from '../api/types';

function mapRecommendationType(origin: TRecommendationType): TRecommendationType {
  return origin;
}

function extractThumbnailUrl(item: TRecommendationItem): string | undefined {
  if (!item.thumbnail || !Array.isArray(item.thumbnail) || item.thumbnail.length === 0) {
    return undefined;
  }

  return item.thumbnail[0]?.url;
}

export function mapRecommendationItem(apiItem: TRecommendationItem): TNormalizedItem {
  const type = mapRecommendationType(apiItem.origin);

  return {
    id: apiItem.id,
    title: apiItem.name,
    url: apiItem.url,
    thumbnailUrl: extractThumbnailUrl(apiItem),
    type,
    branding: type === RecommendationType.Sponsored ? apiItem.branding : undefined
  };
}

export function mapApiResponse(apiResponse: TApiResponse): TNormalizedItem[] {
  if (!apiResponse.list || !Array.isArray(apiResponse.list)) {
    return [];
  }

  return apiResponse.list.map(mapRecommendationItem);
}
