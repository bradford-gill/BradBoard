# BradBoard Frontend
Project management - as simple as can be.

## Features
- Projects & Tickets interface
- Add tickets(s) using plain text 
- Ticket view with filtering
- Filter by project, user, date, status, ...
- Simple Auth UI

## Tech Stack
Frontend: React (TypeScript)
UI Library: TailwindCSS (or your preferred styling)
State Management: React hooks / Context API
HTTP Client: Axios or fetch
Auth: Integration with Supabase Auth (or mock for development)

## Data Models (TypeScript Interfaces)

```typescript
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
  assigned_to_id: string;
  assigned_to_name: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
}
```

## API Integration

### API Endpoints (Frontend will consume these):
- `POST /auth/login` - User authentication
- `POST /auth/logout` - User logout
- `GET /projects` - Fetch all projects
- `POST /projects` - Create new project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `GET /tickets` - Fetch all tickets (with filtering)
- `POST /tickets` - Create new ticket
- `PUT /tickets/:id` - Update ticket
- `DELETE /tickets/:id` - Delete ticket
- `POST /create` - Smart ticket creation from text
- `GET /export` - Export tickets as CSV

## Design System

### Color Palette:
Primary:
- Charcoal Black #1C1C1C
- Cloud White #F5F5F5

Accent:
- Slate Gray #4B4B4B
- Electric Blue #3A8DFF

### Typography:
- Primary: Inter
- Secondary: Familjen Grotesk

### Component Structure:
```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Dropdown.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── tickets/
│   │   ├── TicketTable.tsx
│   │   ├── TicketRow.tsx
│   │   ├── TicketFilters.tsx
│   │   └── AddTicketModal.tsx
│   └── projects/
│       └── ProjectModal.tsx
├── pages/
│   ├── Login.tsx
│   └── TicketsPage.tsx
├── hooks/
│   ├── useAuth.tsx
│   ├── useTickets.tsx
│   └── useProjects.tsx
├── services/
│   └── api.ts
└── types/
    └── index.ts
```

## Pages

### Login Page
- Simple login form
- Email/password fields
- Login button
- Clean, minimal design

### Tickets Page
**Header Section:**
- Smart Add Ticket(s) button
- Add Project button
- Export All As CSV button
- Logout button

**Filters Section:**
- Row 1: Multi-select dropdowns for:
  - Project filter
  - User filter
  - Status filter
- Row 2: Search input for title & description

**Table Section:**
- Responsive table displaying tickets
- Sortable columns
- Each row shows: Title, Project, Assigned To, Status, Priority, Created Date
- Click to edit functionality
- Sort by priority (ascending) then created_at (descending)

## Modals

### Add Ticket(s) Modal
- Text area for plain text input
- Project selection dropdown
- Submit button for AI processing
- Loading state during processing

### Add/Edit Ticket Modal
- Form fields: Title, Description, Project, Assigned To, Status, Priority
- Save/Cancel buttons
- Validation

### Add/Edit Project Modal
- Form fields: Title, Description
- Save/Cancel buttons
- Validation

## State Management

### Auth Context
- User authentication state
- Login/logout functions
- Token management

### Data Context
- Tickets state
- Projects state
- Loading states
- Error handling

## Key Features to Implement

1. **Responsive Design** - Works on desktop and mobile
2. **Real-time Updates** - Optimistic updates for better UX
3. **Error Handling** - User-friendly error messages
4. **Loading States** - Skeleton screens and spinners
5. **Form Validation** - Client-side validation with helpful messages
6. **Accessibility** - ARIA labels, keyboard navigation
7. **Search & Filtering** - Real-time filtering and search
8. **Export Functionality** - CSV download
9. **Smart Ticket Creation** - Integration with AI endpoint for parsing text

## Development Notes

- Mock API responses during development
- Use React Router for navigation
- Implement proper TypeScript types throughout
- Add proper error boundaries
- Implement proper loading and error states for all async operations. when loading show a spinner. 