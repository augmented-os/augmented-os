import React, { Component, ReactNode, ComponentType, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ComponentType<{ error: Error }>;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component for dynamic UI components.
 * Provides comprehensive error handling with graceful degradation.
 */
export class DynamicUIErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Dynamic UI Error:', error, errorInfo);
    
    // Log error details for debugging
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    // TODO: Send error to error reporting service
    // errorReportingService.captureException(error, { extra: errorInfo });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}

/**
 * Default fallback component shown when an error occurs
 */
const DefaultErrorFallback: React.FC<{ error: Error }> = ({ error }) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="error-boundary bg-red-50 border border-red-200 rounded-lg p-6 m-4">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <svg 
            className="w-6 h-6 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-red-800">
            Something went wrong
          </h3>
        </div>
      </div>
      
      <div className="text-red-700">
        <p className="mb-3">
          The form could not be loaded. Please try refreshing the page.
        </p>
        
        {isDevelopment && (
          <details className="mt-4">
            <summary className="cursor-pointer font-medium text-red-800 hover:text-red-900">
              Error details (development mode)
            </summary>
            <div className="mt-2 p-3 bg-red-100 rounded border font-mono text-sm">
              <div className="mb-2">
                <strong>Message:</strong> {error.message}
              </div>
              {error.stack && (
                <div>
                  <strong>Stack trace:</strong>
                  <pre className="mt-1 whitespace-pre-wrap text-xs">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
      
      <div className="mt-6">
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}; 