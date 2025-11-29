import type { TApiRequestParams, TApiResponse } from './types';
// TODO: remove this line when not needed for testing
// import { MOCKED_API_RESPONSE } from '../__mocks__/recommendations-response';

const BASE_URL = 'https://api.taboola.com/1.0/json/taboola-templates/recommendations.get';

export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(params: TApiRequestParams): string {
    const url = new URL(this.baseUrl);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    return url.toString();
  }

  async fetchRecommendations(params: TApiRequestParams): Promise<TApiResponse> {
    const url = this.buildUrl(params);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `API request failed with status ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      // TODO: remove this line when not needed for testing
      // const data = MOCKED_API_RESPONSE;

      if (!data || !Array.isArray(data.list)) {
        throw new Error('Invalid API response: missing or invalid "list" field');
      }

      return data as TApiResponse;
    } catch (e) {
      throw new Error(
        `Failed to fetch recommendations: ${e instanceof Error ? e.message : 'Unknown error'}`
      );
    }
  }
}

/**
 * Factory function to create API client
 */
export function createApiClient(baseUrl?: string): ApiClient {
  return new ApiClient(baseUrl);
}
