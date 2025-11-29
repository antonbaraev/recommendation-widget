# Recommendation Widget

An embeddable recommendation widget built as a Shadow-DOM custom element using TypeScript and Vite. This widget can be safely embedded in any web application (React, Vue, Angular, plain JS) without style or DOM conflicts.

## Features

- **Shadow DOM Encapsulation**: Complete isolation from host page styles and DOM
- **Dual Bundle Format**: Available as ESM module and IIFE script
- **Responsive**: Mobile and desktop optimized layouts
- **Lazy Loading**: Images load on demand for better performance
- **Event-Driven**: Custom events for load success and errors
- **Dynamic Updates**: Automatically reloads when attributes change

## Installation

### NPM (for bundled projects)

```bash
npm install tbl-widget
```

### CDN (for script tag usage)

```html
<script src="https://cdn.example.com/tbl-widget.iife.js"></script>
```

## Usage

```javascript
// Import the widget
import 'tbl-widget';

// Use in your template/JSX
<tbl-widget
  source-id="214321562187"
  source-type="video"
  source-url="https://www.site.com/videos/214321562187.html"
  count="6"
></tbl-widget>;
```

### Script Tag (HTML)

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.example.com/tbl-widget.iife.js"></script>
  </head>
  <body>
    <tbl-widget
      source-id="214321562187"
      source-type="video"
      source-url="https://www.site.com/videos/214321562187.html"
      count="6"
    >
    </tbl-widget>
  </body>
</html>
```

### Programmatic Usage

```javascript
// Create widget element
const widget = document.createElement('tbl-widget');

// Set required attributes
widget.setAttribute('source-id', '214321562187');
widget.setAttribute('source-type', 'video');
widget.setAttribute('source-url', 'https://www.site.com/videos/214321562187.html');
widget.setAttribute('count', '6');

// Add to page
document.body.appendChild(widget);
```

## Configuration

### Attributes

| Attribute     | Required | Default             | Description                               |
| ------------- | -------- | ------------------- | ----------------------------------------- |
| `source-id`   | Yes      | -                   | Source identifier for the content         |
| `source-type` | Yes      | -                   | Type of source (e.g., 'video', 'article') |
| `source-url`  | Yes      | -                   | URL of the source content                 |
| `count`       | No       | `6`                 | Number of recommendations to display      |
| `publisher`   | No       | `taboola-templates` | Publisher identifier                      |
| `app-type`    | No       | `desktop`           | Application type                          |
| `api-key`     | No       | Default key         | API authentication key                    |

### Required Attributes

The widget requires three mandatory attributes:

```html
<tbl-widget
  source-id="your-source-id"
  source-type="your-source-type"
  source-url="https://your-site.com/content"
>
</tbl-widget>
```

## Events

The widget emits custom events that you can listen to:

### `tbl-loaded`

Fired when recommendations are successfully loaded.

```javascript
widget.addEventListener('tbl-loaded', (event) => {
  console.log(`Loaded ${event.detail.count} recommendations`);
});
```

### `tbl-error`

Fired when an error occurs during loading.

```javascript
widget.addEventListener('tbl-error', (event) => {
  console.error('Error:', event.detail.error);
});
```

## Methods

### `reload()`

Manually reload the widget recommendations.

```javascript
const widget = document.querySelector('tbl-widget');
widget.reload();
```

## Recommendation Types

The widget supports different types of recommendations:

### Sponsored

- Opens in a new tab (`target="_blank"`)
- Shows branding information
- Highlighted with distinct styling

### Organic

- Opens in the same tab
- No branding displayed
- Standard styling

## Development

### Prerequisites

- Node.js 20+ (required by Vite 7 and Vitest 4)
- npm 8+

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

### Building

The build process creates two bundles:

1. **ESM** (`tbl-widget.es.js`): For modern bundlers and module imports
2. **IIFE** (`tbl-widget.iife.js`): For script tag embedding

```bash
npm run build
```

Output files are in the `dist/` directory.

### Testing

The project includes comprehensive unit tests for:

- API client (request building, error handling)
- Data mapper (normalization, type mapping)
- Renderer (DOM generation, event handling)

```bash
# Run tests once
npm test -- --run

# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:coverage
```

## API Integration

The widget integrates with the Taboola Recommendations API:

**Endpoint**: `GET /1.0/json/taboola-templates/recommendations.get`

**Required Parameters**:

- `publisher`: Publisher identifier
- `app.type`: Application type (desktop/mobile)
- `app.apikey`: API authentication key
- `source.id`: Source content identifier
- `source.type`: Source content type
- `source.url`: Source content URL
- `count`: Number of recommendations

**Response Format**:

```json
{
  "id": "response-id",
  "list": [
    {
      "id": "item-id",
      "name": "Item Title",
      "url": "https://example.com/item",
      "origin": "sponsored|organic|video",
      "thumbnail": [
        {
          "url": "https://example.com/thumb.jpg",
          "width": "100",
          "height": "100"
        }
      ],
      "branding": "Brand Name",
      ...
    }
  ]
}
```

## Browser Support

- Chrome/Edge 53+
- Firefox 63+
- Safari 10.1+
- Opera 40+

The widget uses modern web standards:

- Custom Elements V1
- Shadow DOM V1
- ES2015+ JavaScript

## Styling

The widget uses Shadow DOM for complete style encapsulation. Host page styles do not affect the widget, and widget styles do not leak to the host page.

## Code Formatting

This project uses [Prettier](https://prettier.io/) for code formatting with the following configuration:

- Single quotes
- Semicolons
- 2 spaces for indentation
- 100 character line width
- No trailing commas

**Available scripts:**

```bash
# Format all files
npm run format

# Check if files are formatted correctly
npm run format:check
```

The Prettier configuration is in [.prettierrc](.prettierrc).

## Example Framework Integration

### React

```jsx
import React, { useEffect, useRef } from 'react';
import 'tbl-widget';

function RecommendationWidget({ sourceId, sourceType, sourceUrl, count }) {
  const widgetRef = useRef(null);

  useEffect(() => {
    const widget = widgetRef.current;

    const handleLoad = (e) => {
      console.log('Loaded:', e.detail.count);
    };

    const handleError = (e) => {
      console.error('Error:', e.detail.error);
    };

    widget?.addEventListener('tbl-loaded', handleLoad);
    widget?.addEventListener('tbl-error', handleError);

    return () => {
      widget?.removeEventListener('tbl-loaded', handleLoad);
      widget?.removeEventListener('tbl-error', handleError);
    };
  }, []);

  return (
    <tbl-widget
      ref={widgetRef}
      source-id={sourceId}
      source-type={sourceType}
      source-url={sourceUrl}
      count={count}
    />
  );
}
```
