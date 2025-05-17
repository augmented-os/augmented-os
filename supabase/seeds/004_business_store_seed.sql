-- Seed data for the tenant_schemas table

INSERT INTO "public"."tenant_schemas" ("schema_id", "tenant_id", "version", "schema_json", "applied_at", "created_at", "updated_at") VALUES ('5743bb70-3fcb-4fd6-a335-19ea13aae10c', '3e6a053f-09c3-4dd2-aeff-8c97584fe860', '1', '{"schemas": [{
  "name": "yc_demo",
  "tables": [
    {
      "name": "companies",
      "columns": {
        "id": {"type": "uuid", "comment": "Unique identifier for the company", "default": "gen_random_uuid()", "nullable": false},
        "name": {"type": "text", "comment": "Company name", "nullable": false},
        "founded_date": {"type": "date", "comment": "Date the company was founded", "nullable": true},
        "website": {"type": "text", "comment": "Company website URL", "nullable": true}
      },
      "comment": "Startups that YC might invest in.",
      "primaryKey": ["id"],
      "indexes": [{"name": "companies_pkey", "method": "BTREE", "unique": true, "columns": ["id"]}]
    },
    {
      "name": "founders",
      "columns": {
        "id": {"type": "uuid", "comment": "Unique identifier for the founder", "default": "gen_random_uuid()", "nullable": false},
        "name": {"type": "text", "comment": "Founder''s full name", "nullable": false},
        "email": {"type": "text", "comment": "Founder''s email address", "nullable": true, "isunique": true},
        "linkedin_url": {"type": "text", "comment": "Founder''s LinkedIn profile URL", "nullable": true}
      },
      "comment": "Individuals who founded companies.",
      "primaryKey": ["id"],
      "indexes": [
        {"name": "founders_pkey", "method": "BTREE", "unique": true, "columns": ["id"]},
        {"name": "founders_email_key", "method": "BTREE", "unique": true, "columns": ["email"]}
      ]
    },
    {
      "name": "company_founders",
      "columns": {
        "company_id": {"type": "uuid", "comment": "Reference to the company", "nullable": false},
        "founder_id": {"type": "uuid", "comment": "Reference to the founder", "nullable": false},
        "role": {"type": "text", "comment": "Founder''s role in the company (e.g., CEO, CTO)", "nullable": true},
        "equity_percentage": {"type": "numeric", "comment": "Founder''s equity percentage", "nullable": true}
      },
      "comment": "Join table linking companies and their founders, and their role/equity.",
      "primaryKey": ["company_id", "founder_id"],
      "indexes": [
        {"name": "company_founders_pkey", "method": "BTREE", "unique": true, "columns": ["company_id", "founder_id"]}
      ],
      "foreignKeys": [
        {"name": "fk_company", "columns": ["company_id"], "references": {"table": "companies", "schema": "yc", "columns": ["id"]}},
        {"name": "fk_founder", "columns": ["founder_id"], "references": {"table": "founders", "schema": "yc", "columns": ["id"]}}
      ]
    },
    {
      "name": "investors",
      "columns": {
        "id": {"type": "uuid", "comment": "Unique identifier for the investor", "default": "gen_random_uuid()", "nullable": false},
        "name": {"type": "text", "comment": "Investor name (e.g., Y Combinator, a specific partner)", "nullable": false},
        "type": {"type": "text", "comment": "Type of investor (e.g., Accelerator, VC, Angel)", "nullable": true}
      },
      "comment": "Investors or investing entities.",
      "primaryKey": ["id"],
      "indexes": [{"name": "investors_pkey", "method": "BTREE", "unique": true, "columns": ["id"]}]
    },
    {
      "name": "rounds",
      "columns": {
        "id": {"type": "uuid", "comment": "Unique identifier for the funding round", "default": "gen_random_uuid()", "nullable": false},
        "company_id": {"type": "uuid", "comment": "Reference to the company", "nullable": false},
        "name": {"type": "text", "comment": "Name of the round (e.g., Seed, Series A)", "nullable": false},
        "round_date": {"type": "date", "comment": "Date the round was closed or initiated", "nullable": true}
      },
      "comment": "Funding rounds for companies.",
      "primaryKey": ["id"],
      "indexes": [{"name": "rounds_pkey", "method": "BTREE", "unique": true, "columns": ["id"]}],
      "foreignKeys": [
        {"name": "fk_company", "columns": ["company_id"], "references": {"table": "companies", "schema": "yc", "columns": ["id"]}}
      ]
    },
    {
      "name": "term_sheets",
      "columns": {
        "id": {"type": "uuid", "comment": "Unique identifier for the term sheet", "default": "gen_random_uuid()", "nullable": false},
        "company_id": {"type": "uuid", "comment": "Reference to the company receiving the term sheet", "nullable": false},
        "investor_id": {"type": "uuid", "comment": "Reference to the investor issuing the term sheet", "nullable": false},
        "round_id": {"type": "uuid", "comment": "Reference to the funding round", "nullable": false},
        "version": {"type": "integer", "comment": "Version of the term sheet for this round/company", "nullable": false, "default": "1"},
        "amount_offered": {"type": "numeric", "comment": "Amount offered in the term sheet", "nullable": true},
        "valuation_cap": {"type": "numeric", "comment": "Valuation cap, if any", "nullable": true},
        "discount_rate": {"type": "numeric", "comment": "Discount rate for SAFE/convertible, if any", "nullable": true},
        "status": {"type": "text", "comment": "Status of the term sheet (e.g., draft, sent, signed, withdrawn)", "nullable": false, "default": "''draft''"},
        "issued_date": {"type": "date", "comment": "Date the term sheet was issued", "nullable": true},
        "expiry_date": {"type": "date", "comment": "Date the term sheet expires", "nullable": true},
        "created_at": {"type": "timestamp with time zone", "comment": "Record creation timestamp", "default": "now()", "nullable": false, "withTimeZone": true},
        "updated_at": {"type": "timestamp with time zone", "comment": "Last update timestamp", "default": "now()", "nullable": false, "withTimeZone": true}
      },
      "comment": "Term sheets issued by investors to companies.",
      "primaryKey": ["id"],
      "indexes": [{"name": "term_sheets_pkey", "method": "BTREE", "unique": true, "columns": ["id"]}],
      "foreignKeys": [
        {"name": "fk_company", "columns": ["company_id"], "references": {"table": "companies", "schema": "yc", "columns": ["id"]}},
        {"name": "fk_investor", "columns": ["investor_id"], "references": {"table": "investors", "schema": "yc", "columns": ["id"]}},
        {"name": "fk_round", "columns": ["round_id"], "references": {"table": "rounds", "schema": "yc", "columns": ["id"]}}
      ]
    }
  ]
},{"name": "airbnb_agent", "tables": [{"name": "clients", "columns": {"id": {"type": "uuid", "comment": "Unique identifier for the client", "default": "gen_random_uuid()", "nullable": false}, "name": {"type": "text", "comment": "Client name", "nullable": false}, "active": {"type": "boolean", "comment": "Whether the client is currently active", "nullable": false}}, "comment": "Client organisations", "indexes": [{"name": "clients_pkey", "method": "BTREE", "unique": true, "columns": ["id"]}], "primaryKey": ["id"]}, {"name": "rental_detail_categories", "columns": {"key": {"type": "text", "comment": "Unique key identifier for the category", "nullable": false}, "name": {"type": "text", "comment": "Display name of the category", "nullable": false}, "schema": {"type": "jsonb", "comment": "JSON schema for the category", "nullable": true}}, "comment": "Categories of rental information", "indexes": [{"name": "rental_details_pkey", "method": "BTREE", "unique": true, "columns": ["key"]}], "primaryKey": ["key"]}, {"name": "rental_details", "columns": {"id": {"type": "uuid", "comment": "Unique identifier for the rental details", "default": "gen_random_uuid()", "nullable": false}, "details": {"type": "jsonb", "comment": "JSON data containing rental details", "nullable": true}, "updated_at": {"type": "timestamp with time zone", "comment": "Last update timestamp", "default": "now()", "nullable": false, "withTimeZone": true}, "display_name": {"type": "text", "comment": "Human-readable name for the rental details", "nullable": false}}, "comment": "Public rental information", "indexes": [{"name": "rental_details_pkey1", "method": "BTREE", "unique": true, "columns": ["id"]}], "primaryKey": ["id"]}, {"name": "rental_groups", "columns": {"id": {"type": "uuid", "comment": "Unique identifier for the rental group", "default": "gen_random_uuid()", "nullable": false}, "name": {"type": "text", "comment": "Name of the rental group", "nullable": false}, "order": {"type": "smallint", "comment": "Display order of the group", "nullable": false}, "active": {"type": "boolean", "comment": "Whether the rental group is active", "nullable": false}}, "comment": "Rental categories", "indexes": [{"name": "rental_groups_pkey", "method": "BTREE", "unique": true, "columns": ["id"]}], "primaryKey": ["id"]}, {"name": "rentals", "columns": {"id": {"type": "uuid", "comment": "Unique identifier for the rental", "default": "uuid_generate_v4()", "nullable": false}, "name": {"type": "text", "comment": "Name of the rental property", "nullable": false}, "active": {"type": "boolean", "comment": "Whether the rental is currently active", "nullable": false}, "pms_id": {"type": "text", "comment": "Property Management System identifier", "nullable": false}, "end_date": {"type": "date", "comment": "End date of the rental availability", "nullable": true}, "client_id": {"type": "uuid", "comment": "Reference to the client who owns this rental", "nullable": true}, "fee_agent": {"type": "numeric", "comment": "Agent fee for the rental", "nullable": false}, "watchlist": {"type": "boolean", "comment": "Whether the rental is on the watchlist", "nullable": false}, "max_guests": {"type": "integer", "comment": "Maximum number of guests allowed", "nullable": false}, "start_date": {"type": "date", "comment": "Start date of the rental availability", "nullable": true}, "updated_at": {"type": "timestamp with time zone", "comment": "Last update timestamp", "default": "now()", "nullable": true, "withTimeZone": true}, "fee_cleaning": {"type": "numeric", "comment": "Cleaning fee for the rental", "nullable": false}, "rental_group_id": {"type": "uuid", "comment": "Reference to the group this rental belongs to", "nullable": false}}, "comment": "Rental portfolio", "indexes": [{"name": "rentals_pkey", "method": "BTREE", "unique": true, "columns": ["id"]}], "primaryKey": ["id"], "foreignKeys": [{"name": "fk_client", "columns": ["client_id"], "references": {"table": "clients", "schema": "airbnb_agent", "columns": ["id"]}}, {"name": "fk_rental_group", "columns": ["rental_group_id"], "references": {"table": "rental_groups", "schema": "airbnb_agent", "columns": ["id"]}}]}, {"name": "stock", "columns": {"id": {"type": "text", "comment": "Unique identifier for the stock item", "nullable": false}, "name": {"type": "text", "comment": "Name of the stock item", "nullable": false}, "cost_price": {"type": "numeric", "comment": "Cost price of the stock item", "nullable": false}, "available_count": {"type": "integer", "comment": "Available quantity of the stock item", "nullable": false}}, "comment": "Inventory of supplied items", "indexes": [{"name": "stock_pkey", "method": "BTREE", "unique": true, "columns": ["id"]}], "primaryKey": ["id"]}]}], "schemaVersion": "1.0.0"}', null, '2025-05-02 14:57:06.329615+00', '2025-05-02 14:57:06.329615+00');
