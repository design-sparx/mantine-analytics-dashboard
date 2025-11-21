# Data Mode System

The Data Mode system allows users to switch between **mock data** and **real API endpoints** throughout the application. This is useful for:

- **Development**: Work on UI features without needing a backend
- **Testing**: Test UI behavior with predictable, controlled data
- **Demos**: Showcase features without exposing real data
- **Offline Mode**: Continue working when the backend is unavailable

## Features

- **Global Toggle**: Switch between mock and real data modes from the Theme Customizer
- **Persistent State**: Data mode preference is saved in localStorage
- **Instant Switching**: Changes take effect immediately without page reload
- **Transparent Integration**: Works seamlessly with existing API hooks
- **Extensible**: Easy to add mock data for new endpoints

## Architecture

### Components

1. **DataModeContext** (`contexts/data-mode/`)
   - Manages global data mode state
   - Provides hooks for accessing and toggling the mode
   - Persists settings to localStorage

2. **Mock Data Registry** (`lib/mocks/`)
   - Centralized registry for all mock data
   - Organized by feature/endpoint
   - Supports dynamic route parameters

3. **API Utilities** (`lib/endpoints/api-utils.ts`)
   - Modified to check data mode before making requests
   - Returns mock data when in mock mode
   - Falls back to real API in real mode

4. **UI Toggle** (`components/theme-customizer/tabs/DataTab.tsx`)
   - User-friendly toggle in Theme Customizer
   - Shows current mode status
   - Provides information about the feature

## Usage

### For Users

1. **Open Theme Customizer**: Click the theme customizer button in the header
2. **Navigate to Data Tab**: Click on the "Data" tab
3. **Toggle Mode**: Use the switch to toggle between Mock and Real API modes
4. **Instant Effect**: The change takes effect immediately

### For Developers

#### Using the DataMode Context

```tsx
import { useDataMode } from '@/contexts/data-mode';

function MyComponent() {
  const { mode, isMockMode, isRealMode, toggleMode, setMode } = useDataMode();

  return (
    <div>
      <p>Current mode: {mode}</p>
      <button onClick={toggleMode}>Toggle Mode</button>
      <button onClick={() => setMode('mock')}>Use Mock Data</button>
      <button onClick={() => setMode('real')}>Use Real API</button>
    </div>
  );
}
```

#### Adding Mock Data for New Endpoints

1. **Create a mock data file** in `lib/mocks/data/`:

```typescript
// lib/mocks/data/products.mock.ts
import type { components } from '@/lib/api';
import type { MockResponse } from '../types';

type Product = components['schemas']['ProductDto'];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Sample Product',
    price: 29.99,
    // ... other fields
  },
  // ... more products
];

export const productsMockData = {
  list: (): MockResponse<Product[]> => ({
    succeeded: true,
    data: mockProducts,
    errors: [],
    message: 'Mock products retrieved successfully',
  }),

  byId: (id: string): MockResponse<Product> => {
    const product = mockProducts.find((p) => p.id === id);
    return {
      succeeded: !!product,
      data: product || null,
      errors: product ? [] : ['Product not found'],
      message: product ? 'Mock product retrieved' : 'Product not found',
    };
  },

  create: (data: Product): MockResponse<Product> => {
    const newProduct = { ...data, id: String(mockProducts.length + 1) };
    mockProducts.push(newProduct);
    return {
      succeeded: true,
      data: newProduct,
      errors: [],
      message: 'Mock product created successfully',
    };
  },

  update: (id: string, data: Partial<Product>): MockResponse<Product> => {
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return {
        succeeded: false,
        data: null,
        errors: ['Product not found'],
        message: 'Product not found',
      };
    }
    mockProducts[index] = { ...mockProducts[index], ...data };
    return {
      succeeded: true,
      data: mockProducts[index],
      errors: [],
      message: 'Mock product updated successfully',
    };
  },

  delete: (id: string): MockResponse<{ success: boolean }> => {
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) {
      return {
        succeeded: false,
        data: { success: false },
        errors: ['Product not found'],
        message: 'Product not found',
      };
    }
    mockProducts.splice(index, 1);
    return {
      succeeded: true,
      data: { success: true },
      errors: [],
      message: 'Mock product deleted successfully',
    };
  },
};
```

2. **Register the mock data** in `lib/mocks/registry.ts`:

```typescript
import { productsMockData } from './data/products.mock';

export const mockDataRegistry: MockDataRegistry = {
  // ... existing entries

  // Products endpoints
  '/api/v1/products': {
    GET: productsMockData.list(),
    POST: (data) => productsMockData.create(data),
  },

  // Product by ID
  '/api/v1/products/:id': {
    GET: null, // Handled dynamically
    PUT: (data) => null, // Handled dynamically
    DELETE: null, // Handled dynamically
  },
};

// Add dynamic route handler in getMockData function
export function getMockData<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
): T | null {
  // ... existing code

  // Handle dynamic product routes
  const productByIdMatch = endpoint.match(/^\/api\/v1\/products\/(.+)$/);
  if (productByIdMatch) {
    const id = productByIdMatch[1];
    switch (method) {
      case 'GET':
        return productsMockData.byId(id) as T;
      case 'PUT':
        return productsMockData.update(id, data) as T;
      case 'DELETE':
        return productsMockData.delete(id) as T;
    }
  }

  return null;
}

// Update hasMockData function
export function hasMockData(endpoint: string): boolean {
  // ... existing checks

  if (endpoint.match(/^\/api\/v1\/products\/.+$/)) {
    return true;
  }

  return false;
}
```

3. **Export from index** in `lib/mocks/index.ts`:

```typescript
export * from './data/products.mock';
```

#### API Utilities Behavior

The modified API utilities in `lib/endpoints/api-utils.ts` automatically:

1. Check the current data mode from localStorage
2. If in mock mode AND mock data exists for the endpoint:
   - Return mock data immediately
   - Simulate a 300ms delay for realistic feel
   - Skip real API calls
3. If in real mode OR no mock data exists:
   - Make real API calls as normal
   - Handle authentication and permissions

## Mock Data Structure

All mock data follows the standard `ApiResponse` format:

```typescript
type ApiResponse<T> = {
  succeeded: boolean;
  data: T;
  errors: string[];
  message: string;
};
```

## File Structure

```
contexts/
  data-mode/
    DataModeContext.tsx   # React context and provider
    types.ts              # TypeScript types
    utils.ts              # Storage utilities
    index.ts              # Exports

lib/
  mocks/
    data/                 # Mock data by feature
      invoices.mock.ts
      stats.mock.ts
      products.mock.ts
      # ... more mock files
    registry.ts           # Central registry
    types.ts              # Mock types
    index.ts              # Exports

  endpoints/
    api-utils.ts          # Modified to support data mode

components/
  theme-customizer/
    tabs/
      DataTab.tsx         # UI toggle component
```

## Benefits

1. **Development Velocity**: Build UI features without waiting for backend APIs
2. **Reliable Testing**: Use consistent, predictable data for testing
3. **Offline Capability**: Work without an internet connection
4. **Demo Ready**: Switch to mock mode for presentations and demos
5. **No Code Changes**: Toggle modes without modifying application code
6. **Type Safety**: Full TypeScript support with auto-generated API types

## Limitations

- Mock data is stored in memory and resets on page reload
- Dynamic route handlers must be added manually in the registry
- Mock data must be kept in sync with real API schemas
- No built-in data persistence for mutations in mock mode

## Best Practices

1. **Keep Mock Data Realistic**: Use realistic values that represent actual use cases
2. **Cover Edge Cases**: Include mock data for error states, empty states, etc.
3. **Update with Schema Changes**: When API schemas change, update mock data accordingly
4. **Document Mock Endpoints**: Add comments explaining what each mock endpoint represents
5. **Use TypeScript**: Leverage type safety by using generated OpenAPI types

## Examples

### Invoices

The invoices feature has full mock data support:

- List invoices with pagination
- Get invoice by ID
- Create, update, and delete invoices
- Includes various invoice states (paid, pending, overdue, draft)

See `lib/mocks/data/invoices.mock.ts` for reference implementation.

### Stats

The stats feature demonstrates simple mock data:

- Overview statistics with trend indicators
- Revenue, users, orders, and conversion metrics

See `lib/mocks/data/stats.mock.ts` for reference implementation.

## Future Enhancements

Potential improvements for the data mode system:

- **Mock Data Persistence**: Save mock data changes to localStorage
- **Mock Data Generator**: Auto-generate mock data from OpenAPI schemas
- **Network Simulation**: Simulate network delays and errors
- **Mock Data Presets**: Multiple preset data scenarios (empty, full, error states)
- **Visual Indicator**: Show badge in UI when in mock mode
- **Developer Tools**: DevTools panel for managing mock data
- **Import/Export**: Export and import mock data sets
