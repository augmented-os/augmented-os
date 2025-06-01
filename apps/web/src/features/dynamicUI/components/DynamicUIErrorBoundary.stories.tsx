import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DynamicUIErrorBoundary } from './DynamicUIErrorBoundary';

// Create a wrapper component to work around class component issues in Storybook
const ErrorBoundaryWrapper: React.FC<{
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}> = ({ children, fallback }) => (
  <DynamicUIErrorBoundary fallback={fallback}>
    {children}
  </DynamicUIErrorBoundary>
);

const meta: Meta<typeof ErrorBoundaryWrapper> = {
  title: 'Dynamic UI/System Integration/Error Boundary',
  component: ErrorBoundaryWrapper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Error boundary component for dynamic UI components. Provides comprehensive error handling with graceful degradation and customizable fallback components.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Child components to wrap with error boundary',
    },
    fallback: {
      control: false,
      description: 'Optional custom fallback component to render when an error occurs',
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Component that throws an error for testing
const ErrorThrowingComponent: React.FC<{ shouldThrow?: boolean; errorMessage?: string }> = ({ 
  shouldThrow = true, 
  errorMessage = 'Something went wrong in the component' 
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-green-800 font-medium">Component Working Correctly</h3>
      <p className="text-green-700 text-sm mt-1">
        This component is rendering successfully without any errors.
      </p>
    </div>
  );
};

// Custom fallback component for testing
const CustomErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="custom-error-fallback bg-purple-50 border border-purple-200 rounded-lg p-6">
    <div className="flex items-center mb-4">
      <div className="flex-shrink-0">
        <svg 
          className="w-6 h-6 text-purple-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-lg font-medium text-purple-800">
          Custom Error Handler
        </h3>
      </div>
    </div>
    
    <div className="text-purple-700">
      <p className="mb-3">
        A custom error boundary caught this error and is displaying a specialized fallback UI.
      </p>
      
      <div className="bg-purple-100 rounded p-3 font-mono text-sm">
        <strong>Error:</strong> {error.message}
      </div>
    </div>
    
    <div className="mt-6">
      <button
        onClick={() => window.location.reload()}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
      >
        Reload Application
      </button>
    </div>
  </div>
);

// Working component for comparison
const WorkingComponent: React.FC = () => (
  <div className="p-6 bg-card border border-border rounded-lg">
    <h2 className="text-xl font-semibold text-foreground mb-4">Dynamic Form Component</h2>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Name</label>
        <input 
          type="text" 
          className="w-full p-2 border border-border rounded-md" 
          placeholder="Enter your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Email</label>
        <input 
          type="email" 
          className="w-full p-2 border border-border rounded-md" 
          placeholder="Enter your email"
        />
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
          Submit
        </button>
        <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
          Cancel
        </button>
      </div>
    </div>
  </div>
);

// Complex component that might fail
const ComplexComponent: React.FC<{ data?: { items: Array<{ name: string }> } }> = ({ data }) => {
  // This will throw if data is undefined and we try to access properties
  const processData = () => {
    return data!.items.map((item: { name: string }) => item.name.toUpperCase());
  };

  return (
    <div className="p-6 bg-card border border-border rounded-lg">
      <h2 className="text-xl font-semibold text-foreground mb-4">Data Processing Component</h2>
      <div className="space-y-2">
        {processData().map((name: string, index: number) => (
          <div key={index} className="p-2 bg-muted rounded">
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

export const WorkingComponent_: Story = {
  args: {
    children: <WorkingComponent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a working component wrapped in the error boundary. No error occurs, so the component renders normally.',
      },
    },
  },
};

export const DefaultErrorFallback: Story = {
  args: {
    children: <ErrorThrowingComponent shouldThrow={true} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the default error fallback when a component throws an error. The error boundary catches the error and displays a user-friendly message.',
      },
    },
  },
};

export const CustomErrorFallback_: Story = {
  args: {
    children: <ErrorThrowingComponent shouldThrow={true} />,
    fallback: CustomErrorFallback,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a custom error fallback component. You can provide your own fallback component to customize the error display.',
      },
    },
  },
};

export const NetworkError: Story = {
  args: {
    children: <ErrorThrowingComponent 
      shouldThrow={true} 
      errorMessage="Failed to fetch data from API: Network request failed" 
    />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the error boundary handles network-related errors with descriptive error messages.',
      },
    },
  },
};

export const ValidationError: Story = {
  args: {
    children: <ErrorThrowingComponent 
      shouldThrow={true} 
      errorMessage="Validation failed: Required field 'email' is missing" 
    />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the error boundary handles validation errors in form components.',
      },
    },
  },
};

export const DataProcessingError: Story = {
  args: {
    children: <ComplexComponent data={undefined} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the error boundary handles errors that occur during data processing, such as accessing properties on undefined objects.',
      },
    },
  },
};

export const JavaScriptError: Story = {
  args: {
    children: <ErrorThrowingComponent 
      shouldThrow={true} 
      errorMessage="TypeError: Cannot read property 'map' of undefined" 
    />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the error boundary handles common JavaScript runtime errors.',
      },
    },
  },
};

export const MultipleComponents: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <WorkingComponent />
        <ErrorThrowingComponent shouldThrow={true} errorMessage="Second component failed" />
        <WorkingComponent />
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the error boundary handles multiple components, where one fails but others continue to work. The entire boundary content is replaced with the error fallback.',
      },
    },
  },
};

export const NestedErrorBoundaries: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <WorkingComponent />
        <DynamicUIErrorBoundary fallback={CustomErrorFallback}>
          <ErrorThrowingComponent shouldThrow={true} errorMessage="Nested component error" />
        </DynamicUIErrorBoundary>
        <WorkingComponent />
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows nested error boundaries where an inner boundary catches an error while outer components continue to work normally.',
      },
    },
  },
};

export const RecoveryScenario: Story = {
  args: {
    children: <ErrorThrowingComponent shouldThrow={false} />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a component that has recovered from an error state and is now working correctly.',
      },
    },
  },
}; 