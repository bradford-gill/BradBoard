-- BradBoard Database Schema
-- Create tables for projects and tickets

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_by_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_by_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_by_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_by_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in progress', 'done')),
    priority INTEGER NOT NULL DEFAULT 2 CHECK (priority IN (1, 2, 3)),
    assigned_to_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_to_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
-- CREATE INDEX IF NOT EXISTS idx_projects_created_by_id ON projects(created_by_id);
-- CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
-- 
-- CREATE INDEX IF NOT EXISTS idx_tickets_project_id ON tickets(project_id);
-- CREATE INDEX IF NOT EXISTS idx_tickets_created_by_id ON tickets(created_by_id);
-- CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
-- CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
-- CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to_id ON tickets(assigned_to_id);
-- CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
-- CREATE INDEX IF NOT EXISTS idx_tickets_priority_created_at ON tickets(priority ASC, created_at DESC);
-- 
-- -- Create full-text search indexes for title and description
-- CREATE INDEX IF NOT EXISTS idx_tickets_title_search ON tickets USING gin(to_tsvector('english', title));
-- CREATE INDEX IF NOT EXISTS idx_tickets_description_search ON tickets USING gin(to_tsvector('english', description));

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at 
    BEFORE UPDATE ON tickets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
