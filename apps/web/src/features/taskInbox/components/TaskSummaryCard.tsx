import React from 'react';
import { TaskDetail } from '../types';
import { DynamicDisplay } from '../../dynamicUI/components/DynamicDisplay';
import { useSchema } from '../../dynamicUI/hooks/useSchema';
import { TERM_SHEET_SUMMARY_ID } from '../constants/schemaIds';

interface TaskSummaryCardProps {
  taskDetails: TaskDetail;
}

export function TaskSummaryCard({ taskDetails }: TaskSummaryCardProps) {
  const { data: schema, isLoading, error } = useSchema(TERM_SHEET_SUMMARY_ID);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <div className="text-center text-gray-500">Loading term sheet summary...</div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg shadow-sm p-4">
          <div className="text-center text-red-600">Error loading term sheet summary: {error.message}</div>
        </div>
      </div>
    );
  }

  // Fallback to hardcoded display if schema not found
  if (!schema) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Term Sheet Summary</h3>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 gap-4 p-4 border-b border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-500">Company</p>
              <p className="mt-1 text-sm text-gray-900">{taskDetails.company}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Valuation</p>
              <p className="mt-1 text-sm text-gray-900">{taskDetails.valuation}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Investment Amount</p>
              <p className="mt-1 text-sm text-gray-900">{taskDetails.investment}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Equity</p>
              <p className="mt-1 text-sm text-gray-900">{taskDetails.equity}</p>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm font-medium text-gray-500 mb-2">Attached Documents</p>
            {taskDetails.documents.map((doc, index) => (
              <div key={index} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                {doc}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Use DynamicDisplay with schema from database
  return (
    <DynamicDisplay
      schema={schema}
      data={taskDetails as unknown as Record<string, unknown>}
      className="mb-6"
    />
  );
} 