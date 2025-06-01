-- Migration to create core utility functions and enum types

-- Common utility functions that all demos might need
CREATE OR REPLACE FUNCTION public.generate_uuid()
RETURNS uuid
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT gen_random_uuid();
$$;

-- Common trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Common enum types that might be used across demos
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workflow_status') THEN
    CREATE TYPE public.workflow_status AS ENUM ('draft', 'active', 'paused', 'completed', 'error');
  END IF;

  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_status') THEN
    CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END $$;
