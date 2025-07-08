import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Ticket, User } from '../types';
import { api } from '../services/api';

interface DataState {
  projects: Project[];
  tickets: Ticket[];
  users: User[];
  isLoading: boolean;
  error: string | null;
}

interface DataContextType extends DataState {
  refreshData: () => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  createTicket: (ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => Promise<Ticket>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<Ticket>;
  deleteTicket: (id: string) => Promise<void>;
  createTicketsFromText: (text: string, projectId: string) => Promise<Ticket[]>;
  exportTickets: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [state, setState] = useState<DataState>({
    projects: [],
    tickets: [],
    users: [],
    isLoading: false,
    error: null
  });

  const refreshData = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const [projects, tickets, users] = await Promise.all([
        api.getProjects(),
        api.getTickets(),
        api.getUsers()
      ]);
      
      setState({
        projects,
        tickets,
        users,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load data'
      }));
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    const newProject = await api.createProject(projectData);
    setState(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const updatedProject = await api.updateProject(id, updates);
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? updatedProject : p)
    }));
    return updatedProject;
  };

  const deleteProject = async (id: string) => {
    await api.deleteProject(id);
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      tickets: prev.tickets.filter(t => t.project_id !== id)
    }));
  };

  const createTicket = async (ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => {
    const newTicket = await api.createTicket(ticketData);
    setState(prev => ({
      ...prev,
      tickets: [...prev.tickets, newTicket]
    }));
    return newTicket;
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    const updatedTicket = await api.updateTicket(id, updates);
    setState(prev => ({
      ...prev,
      tickets: prev.tickets.map(t => t.id === id ? updatedTicket : t)
    }));
    return updatedTicket;
  };

  const deleteTicket = async (id: string) => {
    await api.deleteTicket(id);
    setState(prev => ({
      ...prev,
      tickets: prev.tickets.filter(t => t.id !== id)
    }));
  };

  const createTicketsFromText = async (text: string, projectId: string) => {
    const newTickets = await api.createTicketsFromText(text, projectId);
    setState(prev => ({
      ...prev,
      tickets: [...prev.tickets, ...newTickets]
    }));
    return newTickets;
  };

  const exportTickets = async () => {
    const csvContent = await api.exportTickets();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tickets-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <DataContext.Provider value={{
      ...state,
      refreshData,
      createProject,
      updateProject,
      deleteProject,
      createTicket,
      updateTicket,
      deleteTicket,
      createTicketsFromText,
      exportTickets
    }}>
      {children}
    </DataContext.Provider>
  );
};