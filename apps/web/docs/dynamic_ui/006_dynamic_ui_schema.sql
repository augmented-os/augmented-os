-- Dynamic UI Schema Migration
-- Creates tables for storing dynamic UI component definitions

-- Create ui_components table
CREATE TABLE ui_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    component_type VARCHAR(50) NOT NULL CHECK (component_type IN ('Form', 'Modal', 'Display', 'Custom')),
    title VARCHAR(255) NOT NULL,
    fields JSONB,
    layout JSONB,
    actions JSONB,
    display_template TEXT,
    custom_props JSONB,
    version VARCHAR(50) DEFAULT '1.0.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX ui_components_component_id_idx ON ui_components(component_id);
CREATE INDEX ui_components_type_idx ON ui_components(component_type);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_ui_components_updated_at 
    BEFORE UPDATE ON ui_components 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE ui_components IS 'Stores dynamic UI component definitions for forms, displays, and modals';
COMMENT ON COLUMN ui_components.component_id IS 'Unique business identifier for the component';
COMMENT ON COLUMN ui_components.component_type IS 'Type of component: Form, Modal, Display, or Custom';
COMMENT ON COLUMN ui_components.fields IS 'JSON array of field definitions for forms';
COMMENT ON COLUMN ui_components.actions IS 'JSON array of action button definitions';
COMMENT ON COLUMN ui_components.display_template IS 'HTML template with placeholders for display components';
