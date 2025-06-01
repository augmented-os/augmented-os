#!/bin/bash

# Demo Data Loader for Supabase
# Usage: ./scripts/load-demo-data.sh [demo_name]
# Available demos: ecommerce, coding, finance, yc, all

set -e

DEMO_NAME=${1:-"yc"}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SUPABASE_DIR="$PROJECT_ROOT/supabase"
SEEDS_DIR="$SUPABASE_DIR/seeds"

# Available demos
AVAILABLE_DEMOS=("ecommerce" "coding" "finance" "yc" "all")

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to validate demo name
validate_demo() {
    local demo=$1
    for valid_demo in "${AVAILABLE_DEMOS[@]}"; do
        if [[ "$demo" == "$valid_demo" ]]; then
            return 0
        fi
    done
    return 1
}

# Function to create temporary config
create_temp_config() {
    local demo=$1
    local temp_config="$SUPABASE_DIR/.temp/config_demo.toml"

    mkdir -p "$SUPABASE_DIR/.temp"
    cp "$SUPABASE_DIR/config.toml" "$temp_config"

    # Build SQL paths array
    local sql_paths_toml="sql_paths = ["
    local first_path=true

    # Add shared files
    if [[ -d "$SEEDS_DIR/shared" ]]; then
        while IFS= read -r file; do
            if [ "$first_path" = false ]; then sql_paths_toml+=", "; fi
            sql_paths_toml+="\"./seeds/shared/$(basename "$file")\""
            first_path=false
        done < <(find "$SEEDS_DIR/shared" -maxdepth 1 -name "*.sql" -print0 | xargs -0 ls -1 | sort)
    fi

    # Add demo-specific files
    if [[ "$demo" == "all" ]]; then
        for demo_type in "${AVAILABLE_DEMOS[@]}"; do
            if [[ "$demo_type" != "all" && -d "$SEEDS_DIR/demos/$demo_type" ]]; then
                while IFS= read -r file; do
                    if [ "$first_path" = false ]; then sql_paths_toml+=", "; fi
                    sql_paths_toml+="\"./seeds/demos/$demo_type/$(basename "$file")\""
                    first_path=false
                done < <(find "$SEEDS_DIR/demos/$demo_type" -maxdepth 1 -name "*.sql" -print0 | xargs -0 ls -1 | sort)
            fi
        done
    elif [[ -d "$SEEDS_DIR/demos/$demo" ]]; then
        while IFS= read -r file; do
            if [ "$first_path" = false ]; then sql_paths_toml+=", "; fi
            sql_paths_toml+="\"./seeds/demos/$demo/$(basename "$file")\""
            first_path=false
        done < <(find "$SEEDS_DIR/demos/$demo" -maxdepth 1 -name "*.sql" -print0 | xargs -0 ls -1 | sort)
    fi

    sql_paths_toml+="]"

    # Remove existing [db.seed] section and add new one
    local db_seed_config="\n[db.seed]\nenabled = true\n$sql_paths_toml\n"
    
    if grep -q "\[db.seed\]" "$temp_config"; then
        awk '
        BEGIN { printing = 1 }
        /\[db\.seed\]/ { printing = 0 }
        /^\[/ && !/\[db\.seed\]/ { printing = 1 }
        { if (printing) print }
        ' "$temp_config" > "${temp_config}.tmp" && mv "${temp_config}.tmp" "$temp_config"
    fi
    
    echo -e "$db_seed_config" >> "$temp_config"
    echo "$temp_config"
}

# Function to reset database with specific demo
load_demo() {
    local demo=$1
    
    echo "Loading demo data: $demo"
    
    # Change to supabase directory first
    cd "$SUPABASE_DIR"
    
    # Check if Supabase is running, start if needed
    if ! supabase status >/dev/null 2>&1; then
        echo "Starting Supabase services..."
        if ! supabase start; then
            print_error "Failed to start Supabase services"
            return 1
        fi
    fi
    
    # Backup original config
    local backup_config="$SUPABASE_DIR/config.toml.backup"
    cp "$SUPABASE_DIR/config.toml" "$backup_config"
    
    # Create temporary config with demo-specific seed paths
    local temp_config=$(create_temp_config "$demo")
    
    # Replace the original config with our temporary one
    cp "$temp_config" "$SUPABASE_DIR/config.toml"
    
    # Reset database with demo data
    if supabase db reset; then
        print_success "Demo data loaded successfully: $demo"
        load_result=0
    else
        print_error "Failed to load demo data: $demo"
        load_result=1
    fi
    
    # Restore original config
    mv "$backup_config" "$SUPABASE_DIR/config.toml"
    
    # Clean up temp config
    rm -f "$temp_config"
    
    return $load_result
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [demo_name]"
    echo ""
    echo "Available demos:"
    for demo in "${AVAILABLE_DEMOS[@]}"; do
        echo "  - $demo"
    done
    echo ""
    echo "Examples:"
    echo "  $0 yc           # Load YC demo data (default)"
    echo "  $0 ecommerce    # Load e-commerce demo data"
    echo "  $0 all          # Load all demo data"
}

# Main script logic
main() {
    # Check if help was requested
    if [[ "$1" == "--help" || "$1" == "-h" ]]; then
        show_usage
        exit 0
    fi
    
    # Validate demo name
    if ! validate_demo "$DEMO_NAME"; then
        print_error "Invalid demo name: $DEMO_NAME"
        echo ""
        show_usage
        exit 1
    fi
    
    # Check if we're in the right directory
    if [[ ! -f "$SUPABASE_DIR/config.toml" ]]; then
        print_error "Supabase config.toml not found. Please run from project root."
        exit 1
    fi
    
    # Load the demo
    load_demo "$DEMO_NAME"
    
    if [[ $? -eq 0 ]]; then
        print_success "Demo environment ready!"
        echo "Access Supabase Studio at: http://localhost:54323"
    else
        print_error "Failed to load demo data"
        exit 1
    fi
}

# Run main function
main "$@" 