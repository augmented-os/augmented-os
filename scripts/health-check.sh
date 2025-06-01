#!/bin/bash

# Health Check Script for Augmented OS Services
# Verifies that Supabase and web services are running properly

set -e

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

echo "🔍 Checking Augmented OS services..."

# Check Supabase services
echo ""
echo "📊 Supabase Services:"

# Check if Supabase is running
if curl -s http://localhost:54321/health >/dev/null 2>&1; then
    print_success "Supabase API Gateway (Kong) - http://localhost:54321"
else
    print_error "Supabase API Gateway (Kong) - http://localhost:54321"
fi

if curl -s http://localhost:54323 >/dev/null 2>&1; then
    print_success "Supabase Studio - http://localhost:54323"
else
    print_error "Supabase Studio - http://localhost:54323"
fi

# Check database connectivity via the API Gateway
if curl -s http://localhost:54321/rest/v1/ >/dev/null 2>&1; then
    print_success "PostgreSQL Database (via PostgREST) - http://localhost:54321/rest/v1/"
else
    print_error "PostgreSQL Database (via PostgREST) - http://localhost:54321/rest/v1/"
fi

# Check web application
echo ""
echo "🌐 Web Application:"

if curl -s http://localhost:5173 >/dev/null 2>&1; then
    print_success "Web App (Vite) - http://localhost:5173"
else
    print_warning "Web App (Vite) - http://localhost:5173 (may not be started yet)"
fi

echo ""
echo "📋 Quick Links:"
echo "   🖥️  Application: http://localhost:5173"
echo "   🗄️  Supabase Studio: http://localhost:54323"
echo "   📡 API Gateway: http://localhost:54321"

# Check if we can query the database
echo ""
echo "🔌 Database Connection:"
if command -v psql >/dev/null 2>&1; then
    if PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -c "SELECT 1;" >/dev/null 2>&1; then
        print_success "Database connection successful"
    else
        print_error "Could not connect to database"
    fi
else
    print_warning "psql not available, skipping database connection test"
fi 