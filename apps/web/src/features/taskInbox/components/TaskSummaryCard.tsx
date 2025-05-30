import React from 'react';
import { TableDataItem } from '../types';
import { DynamicDisplay } from '../../dynamicUI/components/DynamicDisplay';
import { useSchema } from '../../dynamicUI/hooks/useSchema';
import { TERM_SHEET_SUMMARY_ID } from '../constants/schemaIds';

interface TaskSummaryCardProps {
  taskDetails: TableDataItem;
}

export function TaskSummaryCard({ taskDetails }: TaskSummaryCardProps) {
  const { data: schema, isLoading, error } = useSchema(TERM_SHEET_SUMMARY_ID);
  
  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-600">Error loading summary: {error.message || 'Unknown error'}</div>
      </div>
    );
  }
  
  // Fallback if no schema available
  if (!schema) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Term Sheet Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Company</h4>
            <p className="mt-1 text-sm text-gray-900">{typeof taskDetails.company === 'string' ? taskDetails.company : 'Unknown'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Valuation</h4>
            <p className="mt-1 text-sm text-gray-900">{typeof taskDetails.valuation === 'string' ? taskDetails.valuation : 'Unknown'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Investment</h4>
            <p className="mt-1 text-sm text-gray-900">{typeof taskDetails.investment === 'string' ? taskDetails.investment : 'Unknown'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Equity</h4>
            <p className="mt-1 text-sm text-gray-900">{typeof taskDetails.equity === 'string' ? taskDetails.equity : 'Unknown'}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500">Documents</h4>
          {Array.isArray(taskDetails.documents) && taskDetails.documents.length > 0 ? (
            <ul className="mt-1 text-sm text-gray-900">
              {(taskDetails.documents as string[]).map((doc, index) => (
                <li key={index} className="truncate">{doc}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-gray-500">No documents available</p>
          )}
        </div>
      </div>
    );
  }
  
  // Use dynamic component with schema
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <DynamicDisplay
        schema={schema}
        data={taskDetails as Record<string, unknown>}
      />
    </div>
  );
} 