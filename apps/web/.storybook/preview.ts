import type { Preview } from '@storybook/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../src/index.css';
import { DynamicUIStateProvider } from '../src/features/dynamicUI/contexts/DynamicUIStateContext';
import { ThemeProvider } from 'next-themes';

// Custom CSS to hide folder icons
const customCSS = `
  /* Hide default Storybook folder icons for Dynamic UI sections */
  [data-nodeid*="dynamic-ui"] [data-testid="icon"] {
    display: none !important;
  }
  
  /* Alternative: Hide folder icons globally in sidebar */
  .sidebar-item[data-ref-id*="dynamic-ui"] [data-testid="icon"] {
    display: none !important;
  }
  
  /* More comprehensive targeting */
  [data-item-id*="dynamic-ui"] .sidebar-item-icon,
  [data-item-id*="dynamic-ui"] .sidebar-item [data-testid="icon"],
  [data-item-id*="dynamic-ui"] .sidebar-item svg[data-testid*="folder"],
  .sidebar-item[title*="Dynamic UI"] [data-testid="icon"] {
    display: none !important;
  }
  
  /* Target specific Dynamic UI sections */
  [data-item-id*="getting-started"] [data-testid="icon"],
  [data-item-id*="implementation-guides"] [data-testid="icon"],
  [data-item-id*="real-world-examples"] [data-testid="icon"],
  [data-item-id*="testing-quality"] [data-testid="icon"],
  [data-item-id*="developer-tools"] [data-testid="icon"] {
    display: none !important;
  }
`;

// Inject custom CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = customCSS;
  document.head.appendChild(style);
}

// Create a default QueryClient for Storybook
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries in Storybook for faster development
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true, // Disable Storybook's background control since we're using next-themes
    },
    docs: {
      autodocs: 'tag',
      defaultName: 'Documentation',
    },
    options: {
      storySort: {
        order: [
          'Dynamic UI', [
            '🎯 Getting Started', [
              'Introduction',
              'Architecture Overview', 
              'Getting Started Guide'
            ],
            '📖 Implementation Guides', [
              'Schema Design Guide',
              'Validation System',
              'Performance Guide'
            ],
            '🌟 Real-World Examples', [
              'Business Workflows',
              'Task Management',
              'Advanced Patterns'
            ],
            '🧪 Testing & Quality', [
              'Interaction Tests',
              'Edge Case Tests'
            ],
            '🛠️ Developer Tools', [
              'Schema Builder'
            ]
          ],
          'Components', [
            'Dynamic UI Components',
            'Composite Components', 
            'Atomic Components'
          ],
          '*'
        ],
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
        wide: {
          name: 'Wide Desktop',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
  },
  decorators: [
    (Story) => {
      // Create a fresh QueryClient for each story to avoid cache pollution
      const queryClient = createQueryClient();
      
      return React.createElement(
        QueryClientProvider,
        {
          client: queryClient,
          children: React.createElement(
            ThemeProvider,
            {
              attribute: 'class',
              defaultTheme: 'light',
              enableSystem: true,
              themes: ['light', 'dark'],
              children: React.createElement(
                DynamicUIStateProvider,
                {
                  initialState: {},
                  children: React.createElement(Story)
                }
              )
            }
          )
        }
      );
    },
  ],
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview; 