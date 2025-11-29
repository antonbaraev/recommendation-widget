import { describe, it, expect, beforeEach } from 'vitest';
import { Renderer } from '..';
import type { TNormalizedItem } from '../../mapper';

describe('Renderer', () => {
  let shadowRoot: ShadowRoot;
  let renderer: Renderer;

  beforeEach(() => {
    const host = document.createElement('div');
    shadowRoot = host.attachShadow({ mode: 'open' });
    renderer = new Renderer(shadowRoot);
  });

  describe('renderLoading', () => {
    it('should render loading state', () => {
      renderer.renderLoading();

      const loading = shadowRoot.querySelector('.tbl-widget-loading');
      expect(loading).toBeTruthy();
      expect(loading?.textContent).toBe('Loading recommendations...');
    });

    it('should include styles', () => {
      renderer.renderLoading();

      const style = shadowRoot.querySelector('style');
      expect(style).toBeTruthy();
    });
  });

  describe('renderError', () => {
    it('should render error state with message', () => {
      const errorMessage = 'Failed to load data';
      renderer.renderError(errorMessage);

      const error = shadowRoot.querySelector('.tbl-widget-error');
      expect(error).toBeTruthy();
      expect(error?.textContent).toBe(errorMessage);
    });

    it('should include styles', () => {
      renderer.renderError('Test error');

      const style = shadowRoot.querySelector('style');
      expect(style).toBeTruthy();
    });
  });

  describe('renderEmpty', () => {
    it('should render empty state', () => {
      renderer.renderEmpty();

      const empty = shadowRoot.querySelector('.tbl-widget-empty');
      expect(empty).toBeTruthy();
      expect(empty?.textContent).toBe('No recommendations available');
    });
  });

  describe('renderRecommendations', () => {
    const mockItems: TNormalizedItem[] = [
      {
        id: '1',
        title: 'Sponsored Article',
        url: 'https://example.com/sponsored',
        thumbnailUrl: 'https://example.com/thumb1.jpg',
        type: 'sponsored',
        branding: 'Acme Corp'
      },
      {
        id: '2',
        title: 'Organic Article',
        url: 'https://example.com/organic',
        thumbnailUrl: 'https://example.com/thumb2.jpg',
        type: 'organic'
      }
    ];

    it('should render recommendations grid', () => {
      renderer.renderRecommendations(mockItems);

      const grid = shadowRoot.querySelector('.tbl-widget-grid');
      expect(grid).toBeTruthy();

      const items = shadowRoot.querySelectorAll('.tbl-item');
      expect(items.length).toBe(2);
    });

    it('should render title', () => {
      renderer.renderRecommendations(mockItems, 'Custom Title');

      const title = shadowRoot.querySelector('.tbl-widget-title');
      expect(title).toBeTruthy();
      expect(title?.textContent).toBe('Custom Title');
    });

    it('should use default title when not provided', () => {
      renderer.renderRecommendations(mockItems);

      const title = shadowRoot.querySelector('.tbl-widget-title');
      expect(title?.textContent).toBe('Recommended for you');
    });

    it('should render sponsored items with correct attributes', () => {
      renderer.renderRecommendations(mockItems);

      const sponsoredItem = shadowRoot.querySelector('.tbl-item-sponsored') as HTMLAnchorElement;
      expect(sponsoredItem).toBeTruthy();
      expect(sponsoredItem.target).toBe('_blank');
    });

    it('should render organic items without target blank', () => {
      renderer.renderRecommendations(mockItems);

      const items = shadowRoot.querySelectorAll('.tbl-item') as NodeListOf<HTMLAnchorElement>;
      const organicItem = Array.from(items).find(
        (item) => !item.classList.contains('tbl-item-sponsored')
      );

      expect(organicItem).toBeTruthy();
      expect(organicItem?.target).toBe('_self');
    });

    it('should render thumbnails with lazy loading', () => {
      renderer.renderRecommendations(mockItems);

      const images = shadowRoot.querySelectorAll(
        '.tbl-item-thumbnail'
      ) as NodeListOf<HTMLImageElement>;
      expect(images.length).toBe(2);
      expect(images[0].loading).toBe('lazy');
      expect(images[0].src).toBe('https://example.com/thumb1.jpg');
    });

    it('should render item titles', () => {
      renderer.renderRecommendations(mockItems);

      const titles = shadowRoot.querySelectorAll('.tbl-item-title');
      expect(titles.length).toBe(2);
      expect(titles[0].textContent).toBe('Sponsored Article');
      expect(titles[1].textContent).toBe('Organic Article');
    });

    it('should render branding for sponsored items', () => {
      renderer.renderRecommendations(mockItems);

      const branding = shadowRoot.querySelector('.tbl-item-branding');
      expect(branding).toBeTruthy();
      expect(branding?.textContent).toBe('Acme Corp');
    });

    it('should not render branding for organic items', () => {
      const organicOnlyItems: TNormalizedItem[] = [
        {
          id: '1',
          title: 'Organic Only',
          url: 'https://example.com/organic',
          type: 'organic'
        }
      ];

      renderer.renderRecommendations(organicOnlyItems);

      const branding = shadowRoot.querySelector('.tbl-item-branding');
      expect(branding).toBeFalsy();
    });

    it('should render empty state when items array is empty', () => {
      renderer.renderRecommendations([]);

      const empty = shadowRoot.querySelector('.tbl-widget-empty');
      expect(empty).toBeTruthy();
    });

    it('should handle items without thumbnails', () => {
      const itemsWithoutThumbnails: TNormalizedItem[] = [
        {
          id: '1',
          title: 'No Thumbnail',
          url: 'https://example.com/no-thumb',
          type: 'organic'
        }
      ];

      renderer.renderRecommendations(itemsWithoutThumbnails);

      const thumbnail = shadowRoot.querySelector('.tbl-item-thumbnail');
      expect(thumbnail).toBeFalsy();

      const title = shadowRoot.querySelector('.tbl-item-title');
      expect(title?.textContent).toBe('No Thumbnail');
    });
  });
});
