export interface Project {
  id: string; // uuid
  title: string;
  description: string;
  created_by_id: string;
  created_by_name: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

export enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3
}

export enum Status {
  OPEN = "open",
  IN_PROGRESS = "in progress",
  DONE = "done"
}

export interface Ticket {
  id: string; // uuid
  project_id: string; // uuid, FK to projects
  title: string;
  description: string;
  created_by_id: string; // uuid, FK to users
  created_by_name: string;
  status: Status;
  priority: Priority;
  assigned_to_id: string | null;
  assigned_to_name: string | null;
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

export interface TicketWithProject extends Ticket {
  project_title: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface TicketFilters {
  projectId?: string;
  userId?: string;
  status?: Status;
  search?: string;
}