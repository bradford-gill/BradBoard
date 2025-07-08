import React, { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { TicketFilters } from '../components/tickets/TicketFilters';
import { TicketTable } from '../components/tickets/TicketTable';
import { AddTicketModal } from '../components/tickets/AddTicketModal';
import { EditTicketModal } from '../components/tickets/EditTicketModal';
import { ViewTicketModal } from '../components/tickets/ViewTicketModal';
import { ProjectModal } from '../components/projects/ProjectModal';
import { useData } from '../contexts/DataContext';
import { Ticket, Status } from '../types';

export const TicketsPage: React.FC = () => {
  const { tickets, isLoading } = useData();
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [showEditTicketModal, setShowEditTicketModal] = useState(false);
  const [showViewTicketModal, setShowViewTicketModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  const [filters, setFilters] = useState({
    projectId: '',
    userId: '',
    status: '',
    search: ''
  });

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesProject = !filters.projectId || ticket.project_id === filters.projectId;
      const matchesUser = !filters.userId || ticket.assigned_to_id === filters.userId;
      const matchesStatus = !filters.status || ticket.status === filters.status;
      const matchesSearch = !filters.search || 
        ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesProject && matchesUser && matchesStatus && matchesSearch;
    });
  }, [tickets, filters]);

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowEditTicketModal(true);
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowViewTicketModal(true);
  };

  const handleEditFromView = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowViewTicketModal(false);
    setShowEditTicketModal(true);
  };

  const handleAddSingleTicket = () => {
    setSelectedTicket(null);
    setShowEditTicketModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header 
          onAddTicket={() => setShowAddTicketModal(true)}
          onAddSingleTicket={handleAddSingleTicket}
          onAddProject={() => setShowProjectModal(true)}
        />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Loading tickets...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header 
        onAddTicket={() => setShowAddTicketModal(true)}
        onAddSingleTicket={handleAddSingleTicket}
        onAddProject={() => setShowProjectModal(true)}
      />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Tickets</h2>
          <p className="text-gray-400">Manage and track your project tickets</p>
        </div>
        
        <TicketFilters
          filters={filters}
          onFiltersChange={setFilters}
        />
        
        <TicketTable
          tickets={filteredTickets}
          onEditTicket={handleEditTicket}
          onViewTicket={handleViewTicket}
        />
      </div>

      <AddTicketModal
        isOpen={showAddTicketModal}
        onClose={() => setShowAddTicketModal(false)}
      />

      <EditTicketModal
        isOpen={showEditTicketModal}
        onClose={() => {
          setShowEditTicketModal(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
      />

      <ViewTicketModal
        isOpen={showViewTicketModal}
        onClose={() => {
          setShowViewTicketModal(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onEdit={handleEditFromView}
      />

      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
      />
    </div>
  );
};