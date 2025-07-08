import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Edit, Trash2 } from 'lucide-react';
import { Ticket, Priority, Status } from '../../types';
import { useData } from '../../contexts/DataContext';
import { Button } from '../common/Button';

interface TicketTableProps {
  tickets: Ticket[];
  onEditTicket: (ticket: Ticket) => void;
  onViewTicket: (ticket: Ticket) => void;
}

type SortField = 'title' | 'project' | 'assigned_to' | 'status' | 'priority' | 'created_at';
type SortDirection = 'asc' | 'desc';

export const TicketTable: React.FC<TicketTableProps> = ({ tickets, onEditTicket, onViewTicket }) => {
  const { projects, deleteTicket } = useData();
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'project':
        const aProject = projects.find(p => p.id === a.project_id);
        const bProject = projects.find(p => p.id === b.project_id);
        aValue = aProject?.title.toLowerCase() || '';
        bValue = bProject?.title.toLowerCase() || '';
        break;
      case 'assigned_to':
        aValue = a.assigned_to_name.toLowerCase();
        bValue = b.assigned_to_name.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'priority':
        aValue = a.priority;
        bValue = b.priority;
        break;
      case 'created_at':
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      default:
        aValue = a.title;
        bValue = b.title;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH: return 'bg-red-100 text-red-800';
      case Priority.MEDIUM: return 'bg-yellow-100 text-yellow-800';
      case Priority.LOW: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.OPEN: return 'bg-blue-100 text-blue-800';
      case Status.IN_PROGRESS: return 'bg-purple-100 text-purple-800';
      case Status.DONE: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const handleDelete = async (ticketId: string) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteTicket(ticketId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleRowClick = (ticket: Ticket, e: React.MouseEvent) => {
    // Don't trigger row click if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onViewTicket(ticket);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center space-x-1">
                  <span>Title</span>
                  <SortIcon field="title" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => handleSort('project')}
              >
                <div className="flex items-center space-x-1">
                  <span>Project</span>
                  <SortIcon field="project" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => handleSort('assigned_to')}
              >
                <div className="flex items-center space-x-1">
                  <span>Assigned To</span>
                  <SortIcon field="assigned_to" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <SortIcon field="status" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center space-x-1">
                  <span>Priority</span>
                  <SortIcon field="priority" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created</span>
                  <SortIcon field="created_at" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {sortedTickets.map((ticket) => {
              const project = projects.find(p => p.id === ticket.project_id);
              return (
                <tr 
                  key={ticket.id} 
                  className="hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={(e) => handleRowClick(ticket, e)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{ticket.title}</div>
                      <div className="text-sm text-gray-400 truncate max-w-xs">
                        {ticket.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{project?.title || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{ticket.assigned_to_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {Priority[ticket.priority]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditTicket(ticket)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(ticket.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {sortedTickets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400">
            <div className="text-lg font-medium text-gray-300">No tickets found</div>
            <div className="text-sm mt-1">Try adjusting your filters or create a new ticket</div>
          </div>
        </div>
      )}
    </div>
  );
};