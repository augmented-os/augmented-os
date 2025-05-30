-- Core setup and configuration for all demos - SEED specific settings
-- This file runs first during seeding and sets up common functionality for the seeding process.

-- SET session_replication_role = replica; -- This will be handled by individual seed files that perform bulk inserts.

-- Core configuration settings beneficial for the seeding process
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false); -- Search path is usually handled by migrations or default DB settings
SET check_function_bodies = false; -- Can be useful if seeds indirectly use functions being created/altered
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off; -- Often disabled for seed scripts to insert data easily

-- Common utility functions and types are now in migrations.

-- The `reset-demo.sh` script will run all files in `shared` then all files in the specific `demo` folder.
-- Each seed file responsible for bulk data insertion should manage its own session_replication_role.

-- Set session back to normal at the end of all seed scripts
-- Note: Each seed file might need to manage its own session_replication_role if it needs to insert data
-- or this can be the very last statement in the last seed file.
-- For simplicity, we will ensure each seed file that inserts data handles its own replication role if needed,
-- or rely on a final global "SET session_replication_role = DEFAULT;" in a very last seed script if we adopt that pattern.
-- For now, this file will set it to replica and expect other seed files or a final one to reset it.

-- To be safe, if this is the ONLY file in shared/ or the first of many,
-- it might be better to not include "SET session_replication_role = DEFAULT;" here,
-- and instead have it in the very last seed file that runs, or individually in files that need it.

-- The `reset-demo.sh` script will run all files in `shared` then all files in the specific `demo` folder.
-- It is advisable to have a final script in each demo folder (e.g., 999_finalize_demo.sql)
-- that could run `SET session_replication_role = DEFAULT;` if needed. 