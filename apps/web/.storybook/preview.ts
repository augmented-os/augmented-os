import type { Preview } from '@storybook/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../src/index.css';
import { DynamicUIStateProvider } from '../src/features/dynamicUI/contexts/DynamicUIStateContext';
import { ThemeProvider } from 'next-themes';

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