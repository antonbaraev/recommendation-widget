import { describe, it, expect } from 'vitest';
import { mapRecommendationItem, mapApiResponse } from '..';
import type { TRecommendationItem, TApiResponse } from '../../api';

describe('mapRecommendationItem', () => {
  it('should map sponsored item correctly', () => {
    const apiItem: TRecommendationItem = {
      id: '123',
      name: 'Sponsored Article',
      type: 'text',
      description: 'Test description',
      origin: 'sponsored',
      url: 'https://example.com/sponsored',
      thumbnail: [{ url: 'https://example.com/thumb.jpg', width: '100', height: '100' }],
      categories: ['tech'],
      branding: 'Acme Corp',
      duration: '5min',
      views: '1000',
      created: '2024-01-01'
    };

    const result = mapRecommendationItem(apiItem);

    expect(result).toEqual({
      id: '123',
      title: 'Sponsored Article',
      url: 'https://example.com/sponsored',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      type: 'sponsored',
      branding: 'Acme Corp'
    });
  });

  it('should map organic item correctly', () => {
    const apiItem: TRecommendationItem = {
      id: '456',
      name: 'Organic Article',
      type: 'text',
      description: 'Test description',
      origin: 'organic',
      url: 'https://example.com/organic',
      thumbnail: [{ url: 'https://example.com/thumb2.jpg', width: '100', height: '100' }],
      categories: ['news'],
      branding: 'Some Brand',
      duration: '3min',
      views: '500',
      created: '2024-01-02'
    };

    const result = mapRecommendationItem(apiItem);

    expect(result).toEqual({
      id: '456',
      title: 'Organic Article',
      url: 'https://example.com/organic',
      thumbnailUrl: 'https://example.com/thumb2.jpg',
      type: 'organic',
      branding: undefined
    });
  });

  it('should handle missing thumbnail', () => {
    const apiItem: TRecommendationItem = {
      id: '999',
      name: 'No Thumbnail Article',
      type: 'text',
      description: 'Test description',
      origin: 'organic',
      url: 'https://example.com/no-thumb',
      categories: [],
      branding: '',
      duration: '',
      views: '',
      created: ''
    };

    const result = mapRecommendationItem(apiItem);

    expect(result.thumbnailUrl).toBeUndefined();
  });

  it('should handle empty thumbnail array', () => {
    const apiItem: TRecommendationItem = {
      id: '888',
      name: 'Empty Thumbnail',
      type: 'text',
      description: 'Test description',
      origin: 'organic',
      url: 'https://example.com/empty',
      thumbnail: [],
      categories: [],
      branding: '',
      duration: '',
      views: '',
      created: ''
    };

    const result = mapRecommendationItem(apiItem);

    expect(result.thumbnailUrl).toBeUndefined();
  });
});

describe('mapApiResponse', () => {
  it('should map multiple items correctly', () => {
    const apiResponse: TApiResponse = {
      id: 'response-1',
      list: [
        {
          id: '1',
          name: 'Article 1',
          type: 'text',
          description: 'Desc 1',
          origin: 'sponsored',
          url: 'https://example.com/1',
          thumbnail: [{ url: 'https://example.com/1.jpg', width: '100', height: '100' }],
          categories: [],
          branding: 'Brand 1',
          duration: '',
          views: '',
          created: ''
        },
        {
          id: '2',
          name: 'Article 2',
          type: 'text',
          description: 'Desc 2',
          origin: 'organic',
          url: 'https://example.com/2',
          thumbnail: [{ url: 'https://example.com/2.jpg', width: '100', height: '100' }],
          categories: [],
          branding: '',
          duration: '',
          views: '',
          created: ''
        }
      ]
    };

    const result = mapApiResponse(apiResponse);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[0].type).toBe('sponsored');
    expect(result[1].id).toBe('2');
    expect(result[1].type).toBe('organic');
  });

  it('should return empty array for empty list', () => {
    const apiResponse: TApiResponse = {
      id: 'response-2',
      list: []
    };

    const result = mapApiResponse(apiResponse);

    expect(result).toEqual([]);
  });

  it('should handle missing list field', () => {
    const apiResponse = {
      id: 'response-3'
    } as any;

    const result = mapApiResponse(apiResponse);

    expect(result).toEqual([]);
  });

  it('should handle invalid list field', () => {
    const apiResponse = {
      id: 'response-4',
      list: 'not-an-array'
    } as any;

    const result = mapApiResponse(apiResponse);

    expect(result).toEqual([]);
  });
});
