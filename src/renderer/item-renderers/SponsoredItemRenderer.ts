import { BaseItemRenderer } from './BaseItemRenderer';
import type { TNormalizedItem } from '../../mapper/types';
import { h } from '../../utils/dom';

export class SponsoredItemRenderer extends BaseItemRenderer {
  render(item: TNormalizedItem): HTMLElement {
    const children: Array<Node | string | null | undefined> = [];

    if (item.thumbnailUrl) {
      children.push(
        h('img', {
          className: 'tbl-item-thumbnail',
          attrs: {
            src: item.thumbnailUrl,
            alt: item.title,
            loading: 'lazy'
          },
          props: {
            loading: 'lazy'
          }
        })
      );
    }

    const contentChildren: Array<Node | string | null | undefined> = [
      h('h3', {
        className: 'tbl-item-title',
        props: { textContent: item.title }
      })
    ];

    if (item.branding) {
      contentChildren.push(
        h('div', {
          className: 'tbl-item-branding',
          props: { textContent: item.branding }
        })
      );
    }

    children.push(
      h('div', {
        className: 'tbl-item-content',
        children: contentChildren
      })
    );

    return h('a', {
      className: 'tbl-item tbl-item-sponsored',
      attrs: {
        href: item.url,
        target: this.getLinkTarget(item)
      },
      children
    });
  }
}
