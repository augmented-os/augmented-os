# Development Guide

This guide covers the development workflow for contributing to Augmented OS.

## Quick Start for New Developers

```bash
# 1. Clone and install
git clone https://github.com/augmented-os/augmented-os.git
cd augmented-os
npm install

# 2. Start everything with demo data
npm run dev:demo

# 3. Open in browser
open http://localhost:5173
```

That's it! You now have a fully functional development environment with sample data.

## Development Workflow

### Starting Development

```bash
# Start everything (database + web app)
npm run dev

# Start fresh with clean demo data
npm run dev:fresh

# Just load demo data without starting services
npm run demo
```

### Managing Services

```bash
# Check what's running
npm run health

# Individual service control
npm run db:start        # Start Supabase only
npm run db:stop         # Stop Supabase only
npm run db:status       # Check Supabase status
npm run db:studio       # Open Supabase Studio

# Quick database operations
npm run demo:yc         # Load YC demo
npm run demo:ecommerce  # Load e-commerce demo
npm run demo:finance    # Load finance demo
npm run demo:all        # Load all demos
```

### Code Quality

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Generate TypeScript types from Supabase
npm run gen:types
```

## Project Structure

```
augmented-os/
├── apps/
│   └── web/              # Next.js web application
├── scripts/              # Development and deployment scripts
│   ├── load-demo-data.sh # Demo data management
│   └── health-check.sh   # Service health checking
├── supabase/            # Database and backend
│   ├── migrations/      # Database schema migrations
│   └── seeds/           # Demo data
│       ├── shared/      # Data used by all demos
│       └── demos/       # Demo-specific data
└── docs/                # Documentation
```

## Service URLs

When developing locally:

- **Application**: http://localhost:5173
- **Supabase Studio**: http://localhost:54323 (database admin)
- **API Gateway**: http://localhost:54321 (REST API)
- **Health Check**: `npm run health`

## Working with Demo Data

### Available Demos

- **YC Demo** (`yc`): Venture capital term sheet review workflow
- **E-commerce Demo** (`ecommerce`): Order processing and inventory management  
- **Finance Demo** (`finance`): Financial document processing and compliance
- **Coding Demo** (`coding`): Code review and deployment workflows

### Demo Data Structure

Each demo includes:
- **Database schemas**: Core tables and relationships
- **Sample data**: Realistic test data for the domain
- **Workflows**: Pre-configured business processes
- **UI Components**: Domain-specific interface components
- **Tasks**: Example tasks and assignments

### Creating New Demo Data

1. Create a new directory: `supabase/seeds/demos/[your-demo]/`
2. Add SQL files following the naming convention:
   - `002_core_workflows_seed.sql` - Workflow definitions
   - `003b_integration_instances_seed.sql` - Integration configs
   - `004_business_store_seed.sql` - Domain data
   - `005_task_execution_seed.sql` - Task definitions and instances
   - `006_dynamic_ui_seed.sql` - UI component configurations

3. Test your demo:
   ```bash
   ./scripts/load-demo-data.sh your-demo
   ```

## Database Development

### Schema Changes

1. Create a new migration:
   ```bash
   cd supabase
   supabase migration new your_migration_name
   ```

2. Edit the migration file in `supabase/migrations/`

3. Apply migrations:
   ```bash
   npm run demo  # This will apply all migrations + seed data
   ```

### Working with Types

Generate TypeScript types after schema changes:
```bash
npm run gen:types
```

This updates `apps/web/src/types/supabaseTypes.ts` with the latest database schema.

## UI Development

The UI is built using:
- **React** with **TypeScript** 
- **Tailwind CSS** for styling
- **Shadcn/ui** for component primitives
- **React Query** for data fetching
- **React Router** for navigation

### Dynamic UI System

Augmented OS features a database-driven UI system where interface components are configured in the database rather than hardcoded. See:

- `apps/web/src/features/dynamicUI/` - Dynamic rendering system
- `supabase/seeds/*/006_dynamic_ui_seed.sql` - UI configurations

## Troubleshooting

### Services Won't Start

```bash
# Check what's running
npm run health

# Stop everything and restart
npm run db:stop
npm run dev:fresh
```

### Database Issues

```bash
# Reset database with fresh demo data
npm run demo

# Check Supabase logs
cd supabase && supabase logs
```

### Port Conflicts

If you get port conflicts, check what's using the ports:
```bash
lsof -i :5173   # Web app
lsof -i :54321  # Supabase API
lsof -i :54323  # Supabase Studio
```

### Build Issues

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run typecheck
```

## Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Make** your changes
4. **Test** thoroughly: `npm run typecheck && npm run lint`
5. **Commit** your changes: `git commit -m "Add your feature"`
6. **Push** to your branch: `git push origin feature/your-feature`
7. **Submit** a pull request

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** rules: `npm run lint`
- Write **clear commit messages**
- Add **JSDoc comments** for functions
- Use **semantic naming** for components and variables

### Testing

Before submitting:
```bash
npm run typecheck    # TypeScript checks
npm run lint         # Code style checks
npm run health       # Service health checks
```

## Getting Help

- **Documentation**: Check the `docs/` directory
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Community**: Join our Discord community 