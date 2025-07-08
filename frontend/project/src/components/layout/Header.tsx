import React from 'react';
import { LogOut, Plus, Download, FolderPlus, Ticket } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

interface HeaderProps {
  onAddTicket: () => void;
  onAddSingleTicket: () => void;
  onAddProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddTicket, onAddSingleTicket, onAddProject }) => {
  const { user, logout } = useAuth();
  const { exportTickets } = useData();

  const handleExport = async () => {
    try {
      await exportTickets();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">BradBoard</h1>
          <p className="text-sm text-gray-400">Project Management</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddTicket}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Smart Add Ticket(s)</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onAddSingleTicket}
            className="flex items-center space-x-2"
          >
            <Ticket className="h-4 w-4" />
            <span>Add Ticket</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onAddProject}
            className="flex items-center space-x-2"
          >
            <FolderPlus className="h-4 w-4" />
            <span>Add Project</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
          
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-600">
            <div className="text-sm">
              <div className="text-left">
                <span className="text-gray-400">Welcome, </span>
                <span className="font-medium text-white">{user?.name}</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};