import { BaseItemRenderer } from './BaseItemRenderer';
import type { TNormalizedItem } from '../../mapper';
import { h } from '../../utils';

export class OrganicItemRenderer extends BaseItemRenderer {
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

    children.push(
      h('div', {
        className: 'tbl-item-content',
        children: [
          h('h3', {
            className: 'tbl-item-title',
            props: { textContent: item.title }
          })
        ]
      })
    );

    return h('a', {
      className: 'tbl-item',
      attrs: {
        href: item.url,
        target: this.getLinkTarget(item)
      },
      children
    });
  }
}
