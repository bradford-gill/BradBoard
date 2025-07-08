import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Select } from '../common/Select';
import { Ticket, Priority, Status } from '../../types';
import { useData } from '../../contexts/DataContext';

interface EditTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

export const EditTicketModal: React.FC<EditTicketModalProps> = ({ isOpen, onClose, ticket }) => {
  const { projects, users, createTicket, updateTicket } = useData();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: '',
    assigned_to_id: '',
    assigned_to_name: '',
    status: Status.OPEN,
    priority: Priority.MEDIUM
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        project_id: ticket.project_id,
        assigned_to_id: ticket.assigned_to_id,
        assigned_to_name: ticket.assigned_to_name,
        status: ticket.status,
        priority: ticket.priority
      });
    } else {
      setFormData({
        title: '',
        description: '',
        project_id: '',
        assigned_to_id: '',
        assigned_to_name: '',
        status: Status.OPEN,
        priority: Priority.MEDIUM
      });
    }
  }, [ticket]);

  const projectOptions = projects.map(p => ({ value: p.id, label: p.title }));
  const userOptions = users.map(u => ({ value: u.id, label: u.name }));
  const statusOptions = [
    { value: Status.OPEN, label: 'Open' },
    { value: Status.IN_PROGRESS, label: 'In Progress' },
    { value: Status.DONE, label: 'Done' }
  ];
  const priorityOptions = [
    { value: Priority.LOW.toString(), label: 'Low' },
    { value: Priority.MEDIUM.toString(), label: 'Medium' },
    { value: Priority.HIGH.toString(), label: 'High' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.project_id || !formData.assigned_to_id) return;

    setIsLoading(true);
    try {
      const assignedUser = users.find(u => u.id === formData.assigned_to_id);
      const ticketData = {
        ...formData,
        assigned_to_name: assignedUser?.name || '',
        priority: Number(formData.priority) as Priority,
        created_by_id: '1', // Mock current user
        created_by_name: 'John Doe'
      };

      if (ticket) {
        await updateTicket(ticket.id, ticketData);
      } else {
        await createTicket(ticketData);
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to save ticket:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserChange = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setFormData(prev => ({
      ...prev,
      assigned_to_id: userId,
      assigned_to_name: user?.name || ''
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ticket ? 'Edit Ticket' : 'Add Ticket'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter ticket title"
            required
          />
        </div>
        
        <div>
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter ticket description"
            rows={4}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Project"
            options={projectOptions}
            value={formData.project_id}
            onChange={(e) => setFormData(prev => ({ ...prev, project_id: e.target.value }))}
            placeholder="Select a project"
            required
          />
          
          <Select
            label="Assigned To"
            options={userOptions}
            value={formData.assigned_to_id}
            onChange={(e) => handleUserChange(e.target.value)}
            placeholder="Select a user"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Status }))}
            required
          />
          
          <Select
            label="Priority"
            options={priorityOptions}
            value={formData.priority.toString()}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) as Priority }))}
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={!formData.title.trim() || !formData.project_id || !formData.assigned_to_id}
          >
            {ticket ? 'Update Ticket' : 'Create Ticket'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};