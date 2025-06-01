-- E-commerce Demo Schema and Base Data
-- Contains workflow folders and basic setup for e-commerce scenarios

SET session_replication_role = replica;

-- Insert workflow folders for e-commerce demo
INSERT INTO "public"."poc_workflow_folders" ("id", "name", "created_at") VALUES 
('19e604aa-1aa3-41bc-bc55-c4ea280bd3b7', 'E-commerce Demos', '2025-04-12 19:36:57.692921+00'),
('ecom-orders-folder', 'Order Processing', now()),
('ecom-inventory-folder', 'Inventory Management', now()),
('ecom-customer-folder', 'Customer Service', now());

SET session_replication_role = DEFAULT; 