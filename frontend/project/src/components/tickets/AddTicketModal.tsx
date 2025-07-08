import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Textarea } from '../common/Textarea';
import { Select } from '../common/Select';
import { useData } from '../../contexts/DataContext';

interface AddTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTicketModal: React.FC<AddTicketModalProps> = ({ isOpen, onClose }) => {
  const { projects, createTicketsFromText } = useData();
  const [text, setText] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const projectOptions = projects.map(p => ({ value: p.id, label: p.title }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !projectId) return;

    setIsLoading(true);
    try {
      await createTicketsFromText(text, projectId);
      setText('');
      setProjectId('');
      onClose();
    } catch (error) {
      console.error('Failed to create tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setText('');
    setProjectId('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Smart Add Ticket(s)" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Select
            label="Project"
            options={projectOptions}
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="Select a project"
            required
          />
        </div>
        
        <div>
          <Textarea
            label="Ticket Details"
            placeholder="Enter ticket details, one per line. For example:
            
Design homepage layout
Implement user authentication
Add responsive navigation
Fix login bug
Create API documentation"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            helperText="Each line will be converted into a separate ticket"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={!text.trim() || !projectId}
          >
            Create Tickets
          </Button>
        </div>
      </form>
    </Modal>
  );
};