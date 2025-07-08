import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Project } from '../../types';
import { useData } from '../../contexts/DataContext';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project }) => {
  const { createProject, updateProject } = useData();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description
      });
    } else {
      setFormData({
        title: '',
        description: ''
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsLoading(true);
    try {
      if (project) {
        await updateProject(project.id, formData);
      } else {
        await createProject({
          ...formData,
          created_by_id: '1', // Mock current user
          created_by_name: 'John Doe'
        });
      }
      
      setFormData({ title: '', description: '' });
      onClose();
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Add Project'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter project title"
            required
          />
        </div>
        
        <div>
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter project description"
            rows={4}
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
            disabled={!formData.title.trim()}
          >
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};