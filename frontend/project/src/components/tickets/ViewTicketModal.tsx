import React from 'react';
import { Modal } from '../common/Modal';
import { Ticket, Priority, Status } from '../../types';
import { useData } from '../../contexts/DataContext';
import { Button } from '../common/Button';
import { Edit } from 'lucide-react';

interface ViewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onEdit: (ticket: Ticket) => void;
}

export const ViewTicketModal: React.FC<ViewTicketModalProps> = ({ 
  isOpen, 
  onClose, 
  ticket,
  onEdit 
}) => {
  const { projects, users } = useData();

  if (!ticket) return null;

  const project = projects.find(p => p.id === ticket.project_id);
  const assignedUser = users.find(u => u.id === ticket.assigned_to_id);
  const createdByUser = users.find(u => u.id === ticket.created_by_id);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH: return 'bg-red-100 text-red-800 border-red-200';
      case Priority.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case Priority.LOW: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.OPEN: return 'bg-blue-100 text-blue-800 border-blue-200';
      case Status.IN_PROGRESS: return 'bg-purple-100 text-purple-800 border-purple-200';
      case Status.DONE: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleEdit = () => {
    onEdit(ticket);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ticket Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header with title and edit button */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-2">{ticket.title}</h2>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(ticket.priority)}`}>
                {Priority[ticket.priority]} Priority
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Description</h3>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
            <p className="text-gray-300 whitespace-pre-wrap">{ticket.description}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Project Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Project</span>
                <p className="text-white font-medium">{project?.title || 'Unknown Project'}</p>
              </div>
              {project?.description && (
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Project Description</span>
                  <p className="text-gray-300 text-sm">{project.description}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Assignment</h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Assigned To</span>
                <p className="text-white font-medium">{assignedUser?.name || ticket.assigned_to_name}</p>
                {assignedUser?.email && (
                  <p className="text-gray-400 text-sm">{assignedUser.email}</p>
                )}
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Created By</span>
                <p className="text-white font-medium">{createdByUser?.name || ticket.created_by_name}</p>
                {createdByUser?.email && (
                  <p className="text-gray-400 text-sm">{createdByUser.email}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Created</span>
              <p className="text-gray-300">
                {new Date(ticket.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</span>
              <p className="text-gray-300">
                {new Date(ticket.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleEdit}
            className="flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Ticket</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};