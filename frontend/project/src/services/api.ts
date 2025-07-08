import { Project, Ticket, TicketWithProject, User, Status, Priority } from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// Types for API responses
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  size: number;
}

interface TicketListResponse {
  tickets: TicketWithProject[];
  total: number;
  page: number;
  size: number;
}

// HTTP Client with authentication
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Try to get token from localStorage
    this.token = localStorage.getItem('access_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        // Handle different error status codes
        if (response.status === 401) {
          // Unauthorized - clear tokens and redirect to login
          this.clearToken();
          throw new Error('Authentication required. Please log in again.');
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        return {} as T;
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new ApiClient(API_BASE_URL);

export const api = {
  // Auth endpoints
  async login(email: string, password: string): Promise<User> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password
    });

    // Store tokens
    apiClient.setToken(response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);

    // Get user info from token - for now we'll decode the user from the response
    // In a real app, you might want to make a separate call to get user details
    const userResponse = await apiClient.get<User>('/auth/me');
    return userResponse;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    apiClient.clearToken();
  },

  async getCurrentUser(): Promise<User> {
    return await apiClient.get<User>('/auth/me');
  },

  // Projects endpoints
  async getProjects(): Promise<Project[]> {
    const response = await apiClient.get<ProjectListResponse>('/projects/');
    return response.projects;
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    return await apiClient.post<Project>('/projects/', project);
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    return await apiClient.put<Project>(`/projects/${id}`, updates);
  },

  async deleteProject(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },

  // Tickets endpoints
  async getTickets(): Promise<Ticket[]> {
    const response = await apiClient.get<TicketListResponse>('/tickets/');
    // Convert TicketWithProject to Ticket by removing project_title
    return response.tickets.map(({ project_title, ...ticket }) => ticket);
  },

  async createTicket(ticket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>): Promise<Ticket> {
    return await apiClient.post<Ticket>('/tickets/', ticket);
  },

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
    return await apiClient.put<Ticket>(`/tickets/${id}`, updates);
  },

  async deleteTicket(id: string): Promise<void> {
    await apiClient.delete(`/tickets/${id}`);
  },

  // Smart ticket creation
  async createTicketsFromText(text: string, projectId: string): Promise<Ticket[]> {
    const response = await apiClient.post<{ created_tickets: Ticket[] }>('/create', {
      text,
      project_id: projectId
    });
    return response.created_tickets;
  },

  // Export functionality
  async exportTickets(): Promise<string> {
    // Make a request to the export endpoint and return the CSV content
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/export/tickets/csv`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export tickets');
    }

    return await response.text();
  },

  // Users - for now we'll return an empty array since the backend doesn't have a users endpoint
  // In a real app, you might want to get users from the auth system
  async getUsers(): Promise<User[]> {
    // TODO: Implement users endpoint in backend or get from auth system
    return [];
  }
};