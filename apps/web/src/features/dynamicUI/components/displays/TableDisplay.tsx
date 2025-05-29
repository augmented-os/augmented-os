import React from 'react';
import { cn } from '@/lib/utils';

interface TableDisplayConfig {
  columns: Array<{
    key: string;
    label: string;
    width?: string;
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  }>;
  rowClassName?: (row: Record<string, unknown>) => string;
}

interface TableDisplayProps {
  data: unknown;
  config?: TableDisplayConfig;
  className?: string;
}

export const TableDisplay: React.FC<TableDisplayProps> = ({ 
  data, 
  config, 
  className 
}) => {
  // Ensure data is an array
  const tableData = Array.isArray(data) ? data : [];

  if (!config || !config.columns || config.columns.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No table configuration provided
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {config.columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    column.width || "w-1/4"
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.length === 0 ? (
              <tr>
                <td 
                  colSpan={config.columns.length}
                  className="px-6 py-8 text-center text-gray-500 text-sm"
                >
                  No data available
                </td>
              </tr>
            ) : (
              tableData.map((row, index) => {
                const rowData = row as Record<string, unknown>;
                const rowClasses = config.rowClassName 
                  ? config.rowClassName(rowData) 
                  : '';
                
                return (
                  <tr key={index} className={rowClasses}>
                    {config.columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 text-sm break-words"
                      >
                        {column.render 
                          ? column.render(rowData[column.key], rowData)
                          : (
                              <span className={
                                column.key === 'term' 
                                  ? 'font-medium text-gray-900'
                                  : 'text-gray-500'
                              }>
                                {String(rowData[column.key] || '')}
                              </span>
                            )
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 