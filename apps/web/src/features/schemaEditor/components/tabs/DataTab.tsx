import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export function DataTab() {
  return (
    <div className="p-6">
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <h3 className="text-lg font-medium text-gray-700">Table Data</h3>
      </div>
      
      <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-300 rounded-lg">
        <FileSpreadsheet className="w-10 h-10 mx-auto mb-3 text-gray-400" />
        <p className="font-medium">Data View Coming Soon</p>
        <p className="text-sm mt-1">This section will display the actual data rows from the table.</p>
      </div>
      
      {/* Basic table skeleton for preview */}
      <div className="mt-6 opacity-50">
         <div className="bg-white border rounded-md shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b px-4 py-3 grid grid-cols-4 gap-4">
            <div className="font-medium text-gray-600 text-sm">Column 1</div>
            <div className="font-medium text-gray-600 text-sm">Column 2</div>
            <div className="font-medium text-gray-600 text-sm">Column 3</div>
            <div className="font-medium text-gray-600 text-sm">Column 4</div>
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="px-4 py-3 grid grid-cols-4 gap-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 