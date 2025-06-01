import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * UI State for Dynamic UI components
 * Manages conditional rendering state for components
 */
export interface DynamicUIState {
  [key: string]: unknown;
}

/**
 * Context value for Dynamic UI state management
 */
export interface DynamicUIStateContextValue {
  /** Current UI state */
  uiState: DynamicUIState;
  /** Update UI state */
  updateUIState: (updates: Partial<DynamicUIState>) => void;
  /** Set specific UI state property */
  setUIState: (key: string, value: unknown) => void;
  /** Reset UI state to initial state */
  resetUIState: () => void;
  /** Get specific UI state property */
  getUIState: (key: string) => unknown;
}

/**
 * Context for Dynamic UI state management
 */
const DynamicUIStateContext = createContext<DynamicUIStateContextValue | null>(null);

/**
 * Props for DynamicUIStateProvider
 */
export interface DynamicUIStateProviderProps {
  children: ReactNode;
  initialState?: DynamicUIState;
}

/**
 * Provider for Dynamic UI state management
 * Manages conditional rendering state for Dynamic UI components
 */
export const DynamicUIStateProvider: React.FC<DynamicUIStateProviderProps> = ({
  children,
  initialState = {}
}) => {
  const [uiState, setUIStateInternal] = useState<DynamicUIState>(initialState);

  const updateUIState = useCallback((updates: Partial<DynamicUIState>) => {
    setUIStateInternal(prev => ({ ...prev, ...updates }));
  }, []);

  const setUIState = useCallback((key: string, value: unknown) => {
    setUIStateInternal(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetUIState = useCallback(() => {
    setUIStateInternal(initialState);
  }, [initialState]);

  const getUIState = useCallback((key: string) => {
    return uiState[key];
  }, [uiState]);

  const contextValue: DynamicUIStateContextValue = {
    uiState,
    updateUIState,
    setUIState,
    resetUIState,
    getUIState
  };

  return (
    <DynamicUIStateContext.Provider value={contextValue}>
      {children}
    </DynamicUIStateContext.Provider>
  );
};

/**
 * Hook to use Dynamic UI state
 * Must be used within a DynamicUIStateProvider
 */
export const useDynamicUIState = (): DynamicUIStateContextValue => {
  const context = useContext(DynamicUIStateContext);
  if (!context) {
    throw new Error('useDynamicUIState must be used within a DynamicUIStateProvider');
  }
  return context;
};

/**
 * Hook to get UI state for conditional rendering
 * Returns a data object that includes both regular data and uiState
 */
export const useUIStateData = (data: Record<string, unknown>): Record<string, unknown> => {
  const { uiState } = useDynamicUIState();
  
  return {
    ...data,
    uiState
  };
}; 