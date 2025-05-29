import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TaskDetailHeader } from '../TaskDetailHeader';
import { Task } from '../../types';
import { TASK_ACTION_BUTTONS_ID } from '../../constants/schemaIds';

// Mock useSchema hook
jest.mock('../../../dynamicUI/hooks/useSchema', () => ({
  useSchema: jest.fn(),
}));

// Mock DynamicDisplay component
jest.mock('../../../dynamicUI/components/DynamicDisplay', () => ({
  DynamicDisplay: jest.fn(({ schema, data, onAction }) => (
    <div data-testid="dynamic-display">
      <div data-testid="dynamic-display-schema">{JSON.stringify(schema)}</div>
      <div data-testid="dynamic-display-data">{JSON.stringify(data)}</div>
      <button onClick={() => onAction('request_review')}>Request Review</button>
      <button onClick={() => onAction('approve')}>Approve</button>
    </div>
  )),
}));

const mockSchema = {
  componentId: TASK_ACTION_BUTTONS_ID,
  name: "Task Action Buttons",
  componentType: "Display",
  title: "",
  actions: [
    { actionKey: "request_review", label: "Request Review", style: "secondary" },
    { actionKey: "approve", label: "Approve", style: "primary" }
  ]
};

const mockTask: Task = {
  id: 1,
  title: 'Test Term Sheet Review',
  company: 'TestCompany',
  priority: 'High',
  dueDate: '2024-07-15',
  status: 'pending',
  flags: [],
  description: 'Test description'
};

describe('TaskDetailHeader', () => {
  const mockUseSchema = require('../../../dynamicUI/hooks/useSchema').useSchema;
  const mockOnRequestReview = jest.fn();
  const mockOnApprove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task information correctly', () => {
    mockUseSchema.mockReturnValue({
      data: mockSchema,
      isLoading: false,
      error: null
    });

    render(
      <TaskDetailHeader 
        task={mockTask} 
        onRequestReview={mockOnRequestReview} 
        onApprove={mockOnApprove} 
      />
    );

    expect(screen.getByText('Test Term Sheet Review')).toBeInTheDocument();
    expect(screen.getByText('For TestCompany • Due 2024-07-15')).toBeInTheDocument();
  });

  test('renders DynamicDisplay when schema is loaded', () => {
    mockUseSchema.mockReturnValue({
      data: mockSchema,
      isLoading: false,
      error: null
    });

    render(
      <TaskDetailHeader 
        task={mockTask} 
        onRequestReview={mockOnRequestReview} 
        onApprove={mockOnApprove} 
      />
    );

    expect(screen.getByTestId('dynamic-display')).toBeInTheDocument();
    
    const schemaEl = screen.getByTestId('dynamic-display-schema');
    expect(schemaEl.textContent).toEqual(JSON.stringify(mockSchema));
    
    const dataEl = screen.getByTestId('dynamic-display-data');
    const expectedData = { taskStatus: mockTask.status };
    expect(dataEl.textContent).toEqual(JSON.stringify(expectedData));
  });

  test('shows loading state when schema is loading', () => {
    mockUseSchema.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    });

    render(
      <TaskDetailHeader 
        task={mockTask} 
        onRequestReview={mockOnRequestReview} 
        onApprove={mockOnApprove} 
      />
    );

    expect(screen.getByText('Loading actions...')).toBeInTheDocument();
    expect(screen.queryByTestId('dynamic-display')).not.toBeInTheDocument();
  });

  test('shows error state when schema loading fails', () => {
    const mockError = new Error('Failed to load schema');
    mockUseSchema.mockReturnValue({
      data: null,
      isLoading: false,
      error: mockError
    });

    render(
      <TaskDetailHeader 
        task={mockTask} 
        onRequestReview={mockOnRequestReview} 
        onApprove={mockOnApprove} 
      />
    );

    expect(screen.getByText('Error loading actions')).toBeInTheDocument();
    expect(screen.queryByTestId('dynamic-display')).not.toBeInTheDocument();
  });

  test('shows fallback hardcoded buttons when schema is not found', () => {
    mockUseSchema.mockReturnValue({
      data: null,
      isLoading: false,
      error: null
    });

    render(
      <TaskDetailHeader 
        task={mockTask} 
        onRequestReview={mockOnRequestReview} 
        onApprove={mockOnApprove} 
      />
    );

    expect(screen.getByText('Request Review')).toBeInTheDocument();
    expect(screen.getByText('Approve')).toBeInTheDocument();
    expect(screen.queryByTestId('dynamic-display')).not.toBeInTheDocument();
  });

  test('handles action delegation correctly', () => {
    mockUseSchema.mockReturnValue({
      data: mockSchema,
      isLoading: false,
      error: null
    });

    render(
      <TaskDetailHeader 
        task={mockTask} 
        onRequestReview={mockOnRequestReview} 
        onApprove={mockOnApprove} 
      />
    );

    // Test request review action
    fireEvent.click(screen.getByText('Request Review'));
    expect(mockOnRequestReview).toHaveBeenCalledTimes(1);

    // Test approve action
    fireEvent.click(screen.getByText('Approve'));
    expect(mockOnApprove).toHaveBeenCalledTimes(1);
  });

  test('useSchema hook is called with correct component_id', () => {
    mockUseSchema.mockReturnValue({
      data: mockSchema,
      isLoading: false,
      error: null
    });

    render(
      <TaskDetailHeader 
        task={mockTask} 
        onRequestReview={mockOnRequestReview} 
        onApprove={mockOnApprove} 
      />
    );

    expect(mockUseSchema).toHaveBeenCalledWith(TASK_ACTION_BUTTONS_ID);
  });

  test('fallback buttons work correctly', () => {
    mockUseSchema.mockReturnValue({
      data: null,
      isLoading: false,
      error: null
    });

    render(
      <TaskDetailHeader 
        task={mockTask} 
        onRequestReview={mockOnRequestReview} 
        onApprove={mockOnApprove} 
      />
    );

    // Test fallback buttons
    fireEvent.click(screen.getByText('Request Review'));
    expect(mockOnRequestReview).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Approve'));
    expect(mockOnApprove).toHaveBeenCalledTimes(1);
  });
}); 