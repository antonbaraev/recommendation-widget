import { ApiClient } from './ApiClient';

export function createApiClient(baseUrl?: string): ApiClient {
  return new ApiClient(baseUrl);
}
