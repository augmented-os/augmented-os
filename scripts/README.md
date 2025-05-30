# Scripts

This directory contains utility scripts for managing the Augmented OS project.

## Development Environment

### `health-check.sh`

Verifies that all services are running properly and accessible.

**Usage:**
```bash
# From project root
./scripts/health-check.sh

# Or using npm script
npm run health
```

**What it checks:**
- Supabase API Gateway (Kong) - http://localhost:54321
- Supabase Studio - http://localhost:54323
- PostgreSQL Database - http://localhost:54322
- Web Application (Vite) - http://localhost:5173
- Database connection with a test query

**Example output:**
```
🔍 Checking Augmented OS services...

📊 Supabase Services:
✓ Supabase API Gateway (Kong) - http://localhost:54321
✓ Supabase Studio - http://localhost:54323
✓ PostgreSQL Database - http://localhost:54322

🌐 Web Application:
✓ Web App (Vite) - http://localhost:5173

📋 Quick Links:
   🖥️  Application: http://localhost:5173
   🗄️  Supabase Studio: http://localhost:54323
   📡 API Gateway: http://localhost:54321

🔌 Database Connection:
✓ Database connection successful
```

## Demo Data Management

### `load-demo-data.sh`

Loads demo environments with pre-configured data, workflows, and UI components.

**Usage:**
```bash
# From project root
./scripts/load-demo-data.sh [demo_name]

# Or using npm scripts
npm run demo          # Load YC demo (default)
npm run demo:yc       # Load YC demo
npm run demo:ecommerce # Load e-commerce demo  
npm run demo:finance  # Load finance demo
npm run demo:coding   # Load coding demo
npm run demo:all      # Load all demo data
```

**Available Demos:**
- **yc**: Term sheet review workflow for venture capital
- **ecommerce**: Order processing and inventory management
- **finance**: Financial document processing and compliance
- **coding**: Code review and deployment workflows
- **all**: Loads all available demo data

**Options:**
- `--help`, `-h`: Show usage information

**What it does:**
1. Validates the demo name
2. Creates a temporary Supabase config with demo-specific seed files
3. Runs `supabase db reset` to rebuild the database with demo data
4. Restores the original config
5. Cleans up temporary files

**Requirements:**
- Must be run from the project root directory
- Supabase CLI must be installed and configured
- Local Supabase instance must be running 