-- Sample data for BradBoard (optional)
-- This file can be used to populate the database with sample data for testing

-- Note: This assumes you have at least one user in auth.users
-- You'll need to replace the UUIDs with actual user IDs from your Supabase auth

-- Sample projects (replace user IDs with actual ones)
INSERT INTO projects (title, description, created_by) VALUES
('BradBoard Development', 'Main project for developing the BradBoard application', 'your-user-id-here'),
('Marketing Campaign', 'Q1 marketing campaign planning and execution', 'your-user-id-here'),
('Bug Fixes', 'Collection of bug fixes and maintenance tasks', 'your-user-id-here');

-- Sample tickets (replace project IDs and user IDs with actual ones)
INSERT INTO tickets (title, description, project_id, status, priority, created_by_id, created_by_name) VALUES
('Setup FastAPI backend', 'Create the initial FastAPI application structure', 'project-id-here', 'done', 3, 'user-id-here', 'User Name'),
('Implement authentication', 'Add user authentication with Supabase', 'project-id-here', 'in progress', 2, 'user-id-here', 'User Name'),
('Create ticket management', 'Build CRUD operations for tickets', 'project-id-here', 'open', 2, 'user-id-here', 'User Name'),
('Design landing page', 'Create the main landing page design', 'marketing-project-id-here', 'open', 1, 'user-id-here', 'User Name');

-- Instructions for using this file:
-- 1. Create a user account in your Supabase project
-- 2. Get the user ID from the auth.users table
-- 3. Replace 'your-user-id-here' with the actual user ID
-- 4. Run the INSERT statements for projects first
-- 5. Get the project IDs from the projects table
-- 6. Replace 'project-id-here' with actual project IDs
-- 7. Run the INSERT statements for tickets
