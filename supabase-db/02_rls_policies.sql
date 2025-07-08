-- Row Level Security (RLS) Policies for BradBoard
-- All authenticated users can CRUD any projects & tickets

-- Enable RLS on tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Projects RLS Policies
-- Allow authenticated users to view all projects
CREATE POLICY "Allow authenticated users to view all projects" ON projects
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to create projects
CREATE POLICY "Allow authenticated users to create projects" ON projects
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update all projects
CREATE POLICY "Allow authenticated users to update all projects" ON projects
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete all projects
CREATE POLICY "Allow authenticated users to delete all projects" ON projects
    FOR DELETE
    TO authenticated
    USING (true);

-- Tickets RLS Policies
-- Allow authenticated users to view all tickets
CREATE POLICY "Allow authenticated users to view all tickets" ON tickets
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to create tickets
CREATE POLICY "Allow authenticated users to create tickets" ON tickets
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update all tickets
CREATE POLICY "Allow authenticated users to update all tickets" ON tickets
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete all tickets
CREATE POLICY "Allow authenticated users to delete all tickets" ON tickets
    FOR DELETE
    TO authenticated
    USING (true);
