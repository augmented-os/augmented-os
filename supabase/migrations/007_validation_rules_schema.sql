-- Validation Rules Schema Migration
-- Creates table for storing reusable validation rules for dynamic UI components

-- Create validation_rules table
CREATE TABLE validation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('regex', 'function', 'range', 'set', 'required', 'email', 'minLength', 'maxLength', 'pattern', 'min', 'max', 'oneOf')),
    value TEXT,
    error_message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX validation_rules_rule_id_idx ON validation_rules(rule_id);
CREATE INDEX validation_rules_type_idx ON validation_rules(type);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_validation_rules_updated_at 
    BEFORE UPDATE ON validation_rules 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert common validation rules
INSERT INTO validation_rules (rule_id, description, type, value, error_message) VALUES
('required', 'Field is required', 'required', '', 'This field is required'),
('email', 'Must be a valid email address', 'email', '^[^\s@]+@[^\s@]+\.[^\s@]+$', 'Please enter a valid email address'),
('min_length_3', 'Minimum 3 characters', 'minLength', '3', 'Must be at least 3 characters long'),
('max_length_255', 'Maximum 255 characters', 'maxLength', '255', 'Must be no more than 255 characters long'),
('positive_number', 'Must be a positive number', 'min', '0', 'Must be a positive number'),
('yes_no', 'Must be yes or no', 'oneOf', 'yes,no', 'Please select yes or no'),
('min_length_8', 'Minimum 8 characters', 'minLength', '8', 'Must be at least 8 characters long'),
('max_length_50', 'Maximum 50 characters', 'maxLength', '50', 'Must be no more than 50 characters long'),
('phone_number', 'Must be a valid phone number', 'pattern', '^[\+]?[1-9][\d]{0,15}$', 'Please enter a valid phone number'),
('url', 'Must be a valid URL', 'pattern', '^https?:\/\/.+', 'Please enter a valid URL'),
('integer', 'Must be a whole number', 'pattern', '^-?\d+$', 'Must be a whole number'),
('decimal', 'Must be a valid number', 'pattern', '^-?\d*\.?\d+$', 'Must be a valid number'),
('date_iso', 'Must be a valid date', 'pattern', '^\d{4}-\d{2}-\d{2}$', 'Must be a valid date (YYYY-MM-DD)'),
('non_negative', 'Must be zero or positive', 'min', '0', 'Must be zero or a positive number'),
('percentage', 'Must be between 0 and 100', 'range', '0,100', 'Must be between 0 and 100');

-- Add comments for documentation
COMMENT ON TABLE validation_rules IS 'Stores reusable validation rules for form fields in dynamic UI components';
COMMENT ON COLUMN validation_rules.rule_id IS 'Unique identifier for referencing this rule in UI component schemas';
COMMENT ON COLUMN validation_rules.type IS 'Type of validation: regex, function, range, set, required, email, minLength, maxLength, pattern, min, max, oneOf';
COMMENT ON COLUMN validation_rules.value IS 'Configuration value for the validation rule (e.g., regex pattern, min/max values, allowed options)';
COMMENT ON COLUMN validation_rules.error_message IS 'User-friendly error message to display when validation fails';
