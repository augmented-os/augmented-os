import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConnectionStatus } from '../types';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface SearchAndFilterProps {
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (statuses: Array<'active' | 'inactive' | 'error'>) => void;
  onSortChange: (sort: { by: string; direction: 'asc' | 'desc' }) => void;
  className?: string;
}

export function SearchAndFilter({
  onSearchChange,
  onStatusFilterChange,
  onSortChange,
  className = '',
}: SearchAndFilterProps) {
  const [searchValue, setSearchValue] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<Array<'active' | 'inactive' | 'error'>>([]);
  const [showFilters, setShowFilters] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Debounce search input
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      onSearchChange(searchValue);
    }, 300);
    
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchValue, onSearchChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleStatusToggle = (status: 'active' | 'inactive' | 'error') => {
    setSelectedStatuses(prev => {
      const newStatuses = prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status];
      
      onStatusFilterChange(newStatuses);
      return newStatuses;
    });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, direction] = value.split('-');
    onSortChange({ 
      by: sortBy, 
      direction: direction as 'asc' | 'desc' 
    });
  };

  const clearSearch = () => {
    setSearchValue('');
    onSearchChange('');
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    onStatusFilterChange([]);
  };

  return (
    <div className={`w-full space-y-3 ${className}`}>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search integrations..."
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-9 pr-9"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9 text-gray-400 hover:text-gray-600"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        
        <Button
          variant="outline"
          size="default"
          className="flex items-center gap-1"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {selectedStatuses.length > 0 && (
            <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
              {selectedStatuses.length}
            </Badge>
          )}
        </Button>
        
        <Select onValueChange={handleSortChange} defaultValue="name-asc">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="status-asc">Status (Active first)</SelectItem>
            <SelectItem value="lastUsed-desc">Recently used</SelectItem>
            <SelectItem value="created-desc">Newest</SelectItem>
            <SelectItem value="created-asc">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 py-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <Badge
            variant={selectedStatuses.includes('active') ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => handleStatusToggle('active')}
          >
            Active
          </Badge>
          <Badge
            variant={selectedStatuses.includes('inactive') ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => handleStatusToggle('inactive')}
          >
            Inactive
          </Badge>
          <Badge
            variant={selectedStatuses.includes('error') ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => handleStatusToggle('error')}
          >
            Error
          </Badge>
          
          {selectedStatuses.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 text-gray-500 hover:text-gray-900" 
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 