import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApiClient, createApiClient } from '.';
import type { TApiRequestParams } from './types';

describe('ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
    vi.clearAllMocks();
  });

  describe('fetchRecommendations', () => {
    const mockParams: TApiRequestParams = {
      publisher: 'test-publisher',
      'app.type': 'desktop',
      'app.apikey': 'test-key',
      'source.id': '123',
      'source.type': 'article',
      'source.url': 'https://example.com',
      count: 6
    };

    it('should fetch recommendations successfully', async () => {
      const mockResponse = {
        id: 'test-id',
        list: [
          {
            id: '1',
            name: 'Test Article',
            type: 'text',
            description: 'Test description',
            origin: 'organic' as const,
            url: 'https://example.com/article',
            thumbnail: [{ url: 'https://example.com/thumb.jpg', width: '100', height: '100' }],
            categories: ['tech'],
            branding: 'Test Brand',
            duration: '5min',
            views: '1000',
            created: '2024-01-01'
          }
        ]
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const result = await apiClient.fetchRecommendations(mockParams);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should build correct URL with query parameters', async () => {
      const mockResponse = { id: 'test', list: [] };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      await apiClient.fetchRecommendations(mockParams);

      const calledUrl = (global.fetch as any).mock.calls[0][0];
      const url = new URL(calledUrl);

      expect(url.searchParams.get('publisher')).toBe('test-publisher');
      expect(url.searchParams.get('app.type')).toBe('desktop');
      expect(url.searchParams.get('app.apikey')).toBe('test-key');
      expect(url.searchParams.get('source.id')).toBe('123');
      expect(url.searchParams.get('source.type')).toBe('article');
      expect(url.searchParams.get('source.url')).toBe('https://example.com');
      expect(url.searchParams.get('count')).toBe('6');
    });

    it('should throw error when API returns non-ok status', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(apiClient.fetchRecommendations(mockParams)).rejects.toThrow(
        'Failed to fetch recommendations: API request failed with status 404: Not Found'
      );
    });

    it('should throw error when response is missing list field', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test' })
      });

      await expect(apiClient.fetchRecommendations(mockParams)).rejects.toThrow(
        'Failed to fetch recommendations: Invalid API response: missing or invalid "list" field'
      );
    });

    it('should throw error when list field is not an array', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'test', list: 'not-an-array' })
      });

      await expect(apiClient.fetchRecommendations(mockParams)).rejects.toThrow(
        'Failed to fetch recommendations: Invalid API response: missing or invalid "list" field'
      );
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(apiClient.fetchRecommendations(mockParams)).rejects.toThrow(
        'Failed to fetch recommendations: Network error'
      );
    });
  });
});

describe('createApiClient', () => {
  it('should create an ApiClient instance', () => {
    const client = createApiClient();
    expect(client).toBeInstanceOf(ApiClient);
  });

  it('should accept custom base URL', () => {
    const customUrl = 'https://custom-api.example.com/recommendations';
    const client = createApiClient(customUrl);
    expect(client).toBeInstanceOf(ApiClient);
  });
});
