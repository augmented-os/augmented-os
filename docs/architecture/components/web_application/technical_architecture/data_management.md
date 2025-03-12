# Data Management

## Overview

The AugmentedOS Web Application implements a comprehensive data management strategy that enables efficient storage, retrieval, transformation, and synchronization of application data. This document details the patterns, technologies, and best practices used for data management across the application. The data management architecture supports the diverse requirements of workflow orchestration, task execution, integration management, analytics, and chat interfaces while providing a consistent developer experience.

## Data Management Architecture

The data management architecture follows a layered approach with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      Application Layer                          │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────┐  │
│  │ Feature     │  │ UI          │  │ State       │  │ Routing│  │
│  │ Components  │  │ Components  │  │ Management  │  │        │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      Data Access Layer                          │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────┐  │
│  │ Data        │  │ Query       │  │ Mutation    │  │ Data   │  │
│  │ Hooks       │  │ Resolvers   │  │ Resolvers   │  │ Context│  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      Data Management Layer                      │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────┐  │
│  │ State       │  │ Cache       │  │ Persistence │  │ Sync   │  │
│  │ Store       │  │ Manager     │  │ Manager     │  │ Manager│  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                      Storage Layer                              │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────┐  │
│  │ Memory      │  │ Browser     │  │ IndexedDB   │  │ Remote │  │
│  │ Storage     │  │ Storage     │  │ Storage     │  │ Storage│  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Storage Layer

The Storage Layer provides foundational data persistence capabilities:

* **Memory Storage**: Volatile in-memory storage for transient data
* **Browser Storage**: LocalStorage and SessionStorage for persistent client-side data
* **IndexedDB Storage**: Structured storage for larger datasets and offline capabilities
* **Remote Storage**: Integration with backend APIs for server-side persistence

### Data Management Layer

The Data Management Layer provides core data management capabilities:

* **State Store**: Centralized state management with Redux or similar libraries
* **Cache Manager**: Intelligent caching of data with cache invalidation strategies
* **Persistence Manager**: Coordination of data persistence across storage mechanisms
* **Sync Manager**: Synchronization of data between client and server

### Data Access Layer

The Data Access Layer provides domain-specific data access abstractions:

* **Data Hooks**: React hooks for declarative data access
* **Query Resolvers**: Resolution of data queries from various sources
* **Mutation Resolvers**: Handling of data mutations with validation
* **Data Context**: Context providers for data access in component trees

### Application Layer

The Application Layer consumes data management services:

* **Feature Components**: Domain-specific components and logic
* **UI Components**: Presentation components
* **State Management**: Integration with application state
* **Routing**: Navigation and deep linking

## State Management

The application uses a comprehensive state management approach:

### Redux Store

The central state store is implemented using Redux with a structured approach:

```typescript
// Root state definition
export interface RootState {
  auth: AuthState;
  workflows: WorkflowsState;
  tasks: TasksState;
  integrations: IntegrationsState;
  analytics: AnalyticsState;
  chat: ChatState;
  ui: UIState;
}

// Store configuration
export const configureStore = (preloadedState?: Partial<RootState>) => {
  const middlewares = [
    thunk,
    createLogger({ collapsed: true }),
    routerMiddleware(history)
  ];
  
  // Add additional middlewares in development
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(createLogger());
  }
  
  // Create store with middlewares
  const store = createStore(
    rootReducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(...middlewares))
  );
  
  // Enable hot module replacement for reducers
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  
  return store;
};
```

### Domain Slices

State is organized into domain-specific slices:

```typescript
// Workflow state slice
const workflowsSlice = createSlice({
  name: 'workflows',
  initialState: {
    items: [],
    selectedWorkflow: null,
    isLoading: false,
    error: null
  },
  reducers: {
    fetchWorkflowsStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchWorkflowsSuccess(state, action) {
      state.items = action.payload;
      state.isLoading = false;
    },
    fetchWorkflowsFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectWorkflow(state, action) {
      state.selectedWorkflow = action.payload;
    },
    createWorkflowStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    createWorkflowSuccess(state, action) {
      state.items.push(action.payload);
      state.selectedWorkflow = action.payload;
      state.isLoading = false;
    },
    createWorkflowFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateWorkflowStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    updateWorkflowSuccess(state, action) {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selectedWorkflow && state.selectedWorkflow.id === action.payload.id) {
        state.selectedWorkflow = action.payload;
      }
      state.isLoading = false;
    },
    updateWorkflowFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteWorkflowStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    deleteWorkflowSuccess(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (state.selectedWorkflow && state.selectedWorkflow.id === action.payload) {
        state.selectedWorkflow = null;
      }
      state.isLoading = false;
    },
    deleteWorkflowFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    }
  }
});
```

### Thunk Actions

Asynchronous operations are handled with thunk actions:

```typescript
// Fetch workflows thunk
export const fetchWorkflows = () => async (dispatch, getState) => {
  try {
    dispatch(fetchWorkflowsStart());
    
    // Get API client from state
    const { auth } = getState();
    const apiClient = createApiClient(auth.token);
    
    // Fetch workflows from API
    const response = await apiClient.get('/workflows');
    
    // Dispatch success action with normalized data
    dispatch(fetchWorkflowsSuccess(response.data));
  } catch (error) {
    // Handle error and dispatch failure action
    dispatch(fetchWorkflowsFailure(error.message));
    
    // Log error for monitoring
    logger.error('Failed to fetch workflows', error);
  }
};

// Create workflow thunk
export const createWorkflow = (workflowData) => async (dispatch, getState) => {
  try {
    dispatch(createWorkflowStart());
    
    // Get API client from state
    const { auth } = getState();
    const apiClient = createApiClient(auth.token);
    
    // Create workflow via API
    const response = await apiClient.post('/workflows', workflowData);
    
    // Dispatch success action
    dispatch(createWorkflowSuccess(response.data));
    
    // Return created workflow for chaining
    return response.data;
  } catch (error) {
    // Handle error and dispatch failure action
    dispatch(createWorkflowFailure(error.message));
    
    // Log error for monitoring
    logger.error('Failed to create workflow', error);
    
    // Rethrow for caller handling
    throw error;
  }
};
```

### Selectors

Selectors provide efficient access to state:

```typescript
// Basic selectors
export const selectWorkflows = state => state.workflows.items;
export const selectSelectedWorkflow = state => state.workflows.selectedWorkflow;
export const selectWorkflowsLoading = state => state.workflows.isLoading;
export const selectWorkflowsError = state => state.workflows.error;

// Memoized selectors
export const selectWorkflowById = createSelector(
  [selectWorkflows, (_, workflowId) => workflowId],
  (workflows, workflowId) => workflows.find(workflow => workflow.id === workflowId)
);

export const selectWorkflowsByStatus = createSelector(
  [selectWorkflows, (_, status) => status],
  (workflows, status) => workflows.filter(workflow => workflow.status === status)
);

export const selectWorkflowsCount = createSelector(
  [selectWorkflows],
  workflows => workflows.length
);

export const selectWorkflowsCountByStatus = createSelector(
  [selectWorkflows],
  workflows => {
    return workflows.reduce((counts, workflow) => {
      counts[workflow.status] = (counts[workflow.status] || 0) + 1;
      return counts;
    }, {});
  }
);
```

## Local Storage

The application uses a structured approach to browser storage:

### Storage Service

A service abstracts browser storage operations:

```typescript
// Storage service
export class StorageService {
  private prefix: string;
  
  constructor(prefix = 'augmentedos') {
    this.prefix = prefix;
  }
  
  // Generate prefixed key
  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }
  
  // Set item in localStorage with expiration
  setItem(key: string, value: any, expirationMinutes?: number): void {
    const item = {
      value,
      expiration: expirationMinutes 
        ? new Date().getTime() + expirationMinutes * 60 * 1000 
        : null
    };
    
    localStorage.setItem(this.getKey(key), JSON.stringify(item));
  }
  
  // Get item from localStorage with expiration check
  getItem<T>(key: string): T | null {
    const itemStr = localStorage.getItem(this.getKey(key));
    
    if (!itemStr) {
      return null;
    }
    
    try {
      const item = JSON.parse(itemStr);
      
      // Check if item is expired
      if (item.expiration && new Date().getTime() > item.expiration) {
        this.removeItem(key);
        return null;
      }
      
      return item.value as T;
    } catch (error) {
      console.error(`Error parsing stored item: ${key}`, error);
      return null;
    }
  }
  
  // Remove item from localStorage
  removeItem(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }
  
  // Clear all items with prefix
  clear(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${this.prefix}:`)) {
        localStorage.removeItem(key);
      }
    }
  }
  
  // Get all keys with prefix
  getKeys(): string[] {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${this.prefix}:`)) {
        keys.push(key.replace(`${this.prefix}:`, ''));
      }
    }
    return keys;
  }
  
  // Check if key exists
  hasKey(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null;
  }
  
  // Set item in sessionStorage
  setSessionItem(key: string, value: any): void {
    sessionStorage.setItem(this.getKey(key), JSON.stringify({ value }));
  }
  
  // Get item from sessionStorage
  getSessionItem<T>(key: string): T | null {
    const itemStr = sessionStorage.getItem(this.getKey(key));
    
    if (!itemStr) {
      return null;
    }
    
    try {
      const item = JSON.parse(itemStr);
      return item.value as T;
    } catch (error) {
      console.error(`Error parsing stored session item: ${key}`, error);
      return null;
    }
  }
  
  // Remove item from sessionStorage
  removeSessionItem(key: string): void {
    sessionStorage.removeItem(this.getKey(key));
  }
  
  // Clear all session items with prefix
  clearSession(): void {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(`${this.prefix}:`)) {
        sessionStorage.removeItem(key);
      }
    }
  }
}

// Create singleton instance
export const storageService = new StorageService();
```

### Storage Hooks

React hooks provide easy access to storage:

```typescript
// Local storage hook
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: { expiration?: number }
): [T, (value: T) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = storageService.getItem<T>(key);
      // Return stored value or initialValue
      return item !== null ? item : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function
  const setValue = (value: T) => {
    try {
      // Save state
      setStoredValue(value);
      // Save to local storage
      storageService.setItem(key, value, options?.expiration);
    } catch (error) {
      // Handle errors
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  return [storedValue, setValue];
}

// Session storage hook
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from session storage by key
      const item = storageService.getSessionItem<T>(key);
      // Return stored value or initialValue
      return item !== null ? item : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function
  const setValue = (value: T) => {
    try {
      // Save state
      setStoredValue(value);
      // Save to session storage
      storageService.setSessionItem(key, value);
    } catch (error) {
      // Handle errors
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };
  
  return [storedValue, setValue];
}
```


