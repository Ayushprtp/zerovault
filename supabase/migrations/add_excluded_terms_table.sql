-- Add a new table for excluded terms
CREATE TABLE excluded_terms (
  term TEXT PRIMARY KEY NOT NULL
);

-- Enable Row Level Security for the table
ALTER TABLE excluded_terms ENABLE ROW LEVEL SECURITY;

-- Policy to allow 'admin' and 'dev' roles to insert
CREATE POLICY "Admins and developers can insert excluded terms"
    ON public.excluded_terms FOR INSERT
    WITH CHECK (( SELECT auth.role() ) IN ('admin', 'dev'));

-- Policy to allow 'admin' and 'dev' roles to update
CREATE POLICY "Admins and developers can update excluded terms"
    ON public.excluded_terms FOR UPDATE
    USING (( SELECT auth.role() ) IN ('admin', 'dev'));

-- Policy to allow 'admin' and 'dev' roles to delete
CREATE POLICY "Admins and developers can delete excluded terms"
    ON public.excluded_terms FOR DELETE
    USING (( SELECT auth.role() ) IN ('admin', 'dev'));

-- Policy to deny all users from selecting (reading) excluded terms
CREATE POLICY "No one can read excluded terms"
    ON public.excluded_terms FOR SELECT
    USING (false);