# Seeds Organization for Business Demos

## Structure

```
seeds/
├── shared/              # Common data shared across all demos
│   ├── 000_core_setup.sql      # Core tables, functions, etc.
│   └── 001_integrations.sql    # Integration definitions
├── demos/
│   ├── ecommerce/       # E-commerce business demo
│   │   ├── 100_ecommerce_schema.sql
│   │   ├── 101_ecommerce_data.sql # Placeholder for e-commerce specific data
│   │   └── 102_ecommerce_workflows.sql # Placeholder for e-commerce specific workflows
│   ├── saas/           # SaaS business demo
│   │   ├── 200_saas_schema.sql
│   │   ├── 201_saas_data.sql
│   │   └── 202_saas_workflows.sql
│   ├── finance/        # Finance/accounting demo
│   │   ├── 300_finance_schema.sql
│   │   ├── 301_finance_data.sql
│   │   └── 302_finance_workflows.sql
│   └── yc_accelerator/ # Y Combinator accelerator demo
│       ├── 400_yc_schema.sql
│       ├── 401_yc_data.sql
│       └── 402_yc_workflows.sql
└── scripts/
    └── reset-demo.sh    # Script to reset DB with specific demo seeds

```

## Usage

The `reset-demo.sh` script, now located in the `supabase/` directory (i.e., `../reset-demo.sh` from this `seeds` directory, or `./reset-demo.sh` if you are in the `supabase` directory), dynamically generates the necessary configuration for `supabase db reset` based on the chosen demo. It automatically includes files from `seeds/shared/` and the selected `seeds/demos/<demo_name>/` directory.

### Default Behavior (All Shared + All Demos Data)
If you run `supabase db reset` directly without the script, its behavior will depend on the `sql_paths` in your main `supabase/config.toml`. 
To load all shared and all demo data by default with a direct `supabase db reset`, your `supabase/config.toml` should include:
```toml
[db.seed]
enabled = true
sql_paths = [
    "./seeds/shared/*.sql",
    "./seeds/demos/ecommerce/*.sql",
    "./seeds/demos/saas/*.sql",
    "./seeds/demos/finance/*.sql",
    "./seeds/demos/yc_accelerator/*.sql"
]
```
To load only shared data by default:
```toml
[db.seed]
enabled = true
sql_paths = ["./seeds/shared/*.sql"]
```


### Using the `reset-demo.sh` Script

Navigate to the `supabase/` directory (where `reset-demo.sh` is now located) to run the script.

**Commands:**

*   `./reset-demo.sh ecommerce`
    *   Resets the database and seeds it with:
        *   All files in `supabase/seeds/shared/*.sql`
        *   All files in `supabase/seeds/demos/ecommerce/*.sql`
*   `./reset-demo.sh saas`
    *   Resets with `shared/*.sql` and `demos/saas/*.sql`.
*   `./reset-demo.sh all` (or `./reset-demo.sh` with no arguments)
    *   Resets with `shared/*.sql` and all files from `demos/ecommerce/*.sql`, `demos/saas/*.sql`, etc.
*   `./reset-demo.sh --list <demo_name_or_all>`
    *   Lists the SQL files that *would be* loaded for the specified demo without actually resetting the database. Example: `./reset-demo.sh --list ecommerce`
*   `./reset-demo.sh --help`
    *   Shows usage instructions and available demos.

### Available Demos (based on folders in `supabase/seeds/demos/`)
- `ecommerce` - E-commerce order processing workflows
- `saas` - SaaS subscription and user management
- `finance` - Financial reporting and reconciliation
- `yc_accelerator` - Y Combinator investment workflows

## Demo-Specific Features

### E-commerce Demo
- Order approval workflows
- Inventory management
- Customer communication
- Payment processing

### SaaS Demo
- User onboarding flows
- Subscription management
- Feature flagging
- Usage analytics

### Finance Demo
- Payout processing
- Transaction matching
- Xero integration
- Financial reporting

### YC Accelerator Demo
- Company evaluation
- Term sheet management
- Investor relations
- Due diligence workflows 