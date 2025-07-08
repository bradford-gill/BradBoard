import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../common/Input';
import { SearchableSelect } from '../common/SearchableSelect';
import { Status } from '../../types';
import { useData } from '../../contexts/DataContext';

interface TicketFiltersProps {
  filters: {
    projectId: string;
    userId: string;
    status: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const { projects, users } = useData();

  const projectOptions = [
    { value: '', label: 'All Projects' },
    ...projects
      .map(p => ({ value: p.id, label: p.title }))
      .sort((a, b) => a.label.localeCompare(b.label))
  ];

  const userOptions = [
    { value: '', label: 'All Users' },
    ...users
      .map(u => ({ value: u.id, label: u.name }))
      .sort((a, b) => a.label.localeCompare(b.label))
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: Status.OPEN, label: 'Open' },
    { value: Status.IN_PROGRESS, label: 'In Progress' },
    { value: Status.DONE, label: 'Done' }
  ];

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <SearchableSelect
          label="Project"
          options={projectOptions}
          value={filters.projectId}
          onChange={(value) => handleFilterChange('projectId', value)}
          placeholder="All Projects"
        />
        
        <SearchableSelect
          label="Assigned To"
          options={userOptions}
          value={filters.userId}
          onChange={(value) => handleFilterChange('userId', value)}
          placeholder="All Users"
        />
        
        <SearchableSelect
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="All Status"
        />
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search tickets by title or description..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};