/*
      # Create admin_tasks table

      This migration creates a table to store simple tasks for administrators.

      1. New Tables
        - `admin_tasks`
          - `id` (uuid, primary key): Unique identifier for the task.
          - `description` (text, not null): Description of the task.
          - `assignee` (text): Who the task is assigned to (Martyna, Maciej, Ayrton).
          - `deadline` (date): Due date for the task.
          - `status` (text, default 'Pendiente'): Current status ('Pendiente' or 'Realizada').
          - `created_at` (timestamptz, default now()): Timestamp when the task was created.
          - `completed_at` (timestamptz, nullable): Timestamp when the task was completed.
      2. Security
        - Enable RLS on `admin_tasks` table.
        - Add policies for admins to manage tasks.
    */

    -- Create the admin_tasks table
    CREATE TABLE IF NOT EXISTS admin_tasks (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      description text NOT NULL,
      assignee text CHECK (assignee IN ('Martyna', 'Maciej', 'Ayrton')),
      deadline date,
      status text DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Realizada')),
      created_at timestamptz DEFAULT now(),
      completed_at timestamptz
    );

    -- Enable Row Level Security
    ALTER TABLE admin_tasks ENABLE ROW LEVEL SECURITY;

    -- Allow admins full access to the tasks
    CREATE POLICY "Admins can manage tasks"
      ON admin_tasks
      FOR ALL
      TO authenticated
      USING (
        (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
      )
      WITH CHECK (
        (SELECT role FROM users WHERE id = auth.uid()) = 'admin' OR
        (SELECT role FROM users WHERE id = auth.uid()) = 'superadmin'
      );

    -- Add indexes for potential filtering/sorting
    CREATE INDEX IF NOT EXISTS idx_admin_tasks_status ON admin_tasks(status);
    CREATE INDEX IF NOT EXISTS idx_admin_tasks_assignee ON admin_tasks(assignee);
    CREATE INDEX IF NOT EXISTS idx_admin_tasks_deadline ON admin_tasks(deadline);
