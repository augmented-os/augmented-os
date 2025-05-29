import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { TaskSummaryCard } from '../TaskSummaryCard';
import { TaskDetail } from '../../types';
import { TERM_SHEET_SUMMARY_ID } from '../../constants/schemaIds';

// Mock useSchema hook
jest.mock('../../../dynamicUI/hooks/useSchema', () => ({
  useSchema: jest.fn(),
}));

// Mock DynamicDisplay component
jest.mock('../../../dynamicUI/components/DynamicDisplay', () => ({
  DynamicDisplay: jest.fn(({ schema, data, className }) => (
    <div data-testid="dynamic-display" className={className}>
      <div data-testid="dynamic-display-schema">{JSON.stringify(schema)}</div>
      <div data-testid="dynamic-display-data">{JSON.stringify(data)}</div>
    </div>
  )),
}));

const mockSchema = {
  componentId: TERM_SHEET_SUMMARY_ID,
  name: "Term Sheet Summary",
  componentType: "Display",
  title: "Term Sheet Summary",
  displayTemplate: "<div>{{company}} - {{valuation}}</div>"
};

const mockTaskDetails: TaskDetail = {
  company: 'TestCompany',
  valuation: '$10M',
  investment: '$2M',
  equity: '20%',
  documents: ['term-sheet.pdf', 'financial-model.xlsx'],
  extractedTerms: []
};

describe('TaskSummaryCard', () => {
  const mockUseSchema = require('../../../dynamicUI/hooks/useSchema').useSchema;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders DynamicDisplay when schema is loaded', () => {
    mockUseSchema.mockReturnValue({
      data: mockSchema,
      isLoading: false,
      error: null
    });

    render(<TaskSummaryCard taskDetails={mockTaskDetails} />);

    expect(screen.getByTestId('dynamic-display')).toBeInTheDocument();
    expect(screen.getByTestId('dynamic-display')).toHaveClass('mb-6');
    
    const schemaEl = screen.getByTestId('dynamic-display-schema');
    expect(schemaEl.textContent).toEqual(JSON.stringify(mockSchema));
    
    const dataEl = screen.getByTestId('dynamic-display-data');
    expect(dataEl.textContent).toEqual(JSON.stringify(mockTaskDetails));
  });

  test('shows loading state when schema is loading', () => {
    mockUseSchema.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    });

    render(<TaskSummaryCard taskDetails={mockTaskDetails} />);

    expect(screen.getByText('Loading term sheet summary...')).toBeInTheDocument();
    expect(screen.queryByTestId('dynamic-display')).not.toBeInTheDocument();
  });

  test('shows error state when schema loading fails', () => {
    const mockError = new Error('Failed to load schema');
    mockUseSchema.mockReturnValue({
      data: null,
      isLoading: false,
      error: mockError
    });

    render(<TaskSummaryCard taskDetails={mockTaskDetails} />);

    expect(screen.getByText('Error loading term sheet summary: Failed to load schema')).toBeInTheDocument();
    expect(screen.queryByTestId('dynamic-display')).not.toBeInTheDocument();
  });

  test('shows fallback hardcoded display when schema is not found', () => {
    mockUseSchema.mockReturnValue({
      data: null,
      isLoading: false,
      error: null
    });

    render(<TaskSummaryCard taskDetails={mockTaskDetails} />);

    expect(screen.getByText('Term Sheet Summary')).toBeInTheDocument();
    expect(screen.getByText('TestCompany')).toBeInTheDocument();
    expect(screen.getByText('$10M')).toBeInTheDocument();
    expect(screen.getByText('$2M')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('term-sheet.pdf')).toBeInTheDocument();
    expect(screen.getByText('financial-model.xlsx')).toBeInTheDocument();
    expect(screen.queryByTestId('dynamic-display')).not.toBeInTheDocument();
  });

  test('useSchema hook is called with correct component_id', () => {
    mockUseSchema.mockReturnValue({
      data: mockSchema,
      isLoading: false,
      error: null
    });

    render(<TaskSummaryCard taskDetails={mockTaskDetails} />);

    expect(mockUseSchema).toHaveBeenCalledWith(TERM_SHEET_SUMMARY_ID);
  });
}); 