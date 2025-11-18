#!/bin/bash

# UpTrade AI - One-Click Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Banner
echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║         UpTrade AI - Full Deck MVP Deployment           ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    print_info "Creating .env from .env.example..."
    
    if [ -f .env.example ]; then
        cp .env.example .env
        print_warning "Please edit .env file and add your API keys before continuing."
        print_info "Run: nano .env"
        exit 1
    else
        print_error ".env.example not found. Cannot create .env file."
        exit 1
    fi
fi

# Deployment mode selection
echo ""
print_info "Select deployment mode:"
echo "1) Local Docker Compose (Development/Testing)"
echo "2) Production Docker Compose (VPS/Server)"
echo "3) Deploy to Vercel (Dashboard only)"
echo "4) Deploy to Render (Backend only)"
echo "5) Full Deploy (Vercel + Render)"
echo ""
read -p "Enter your choice (1-5): " DEPLOY_MODE

case $DEPLOY_MODE in
    1)
        # Local Docker Compose
        print_info "Starting local deployment with Docker Compose..."
        
        # Build and start containers
        print_info "Building Docker images..."
        docker-compose down -v 2>/dev/null || true
        docker-compose up -d --build
        
        print_success "Containers started successfully!"
        
        # Wait for services to be healthy
        print_info "Waiting for services to be ready..."
        sleep 10
        
        # Test backend
        if curl -f http://localhost:8000/docs > /dev/null 2>&1; then
            print_success "Backend is running at http://localhost:8000"
            print_success "API Docs: http://localhost:8000/docs"
        else
            print_error "Backend failed to start. Check logs with: docker-compose logs backend"
        fi
        
        # Test dashboard (if running)
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            print_success "Dashboard is running at http://localhost:3000"
        else
            print_warning "Dashboard may still be starting..."
        fi
        
        print_info "View logs: docker-compose logs -f"
        print_info "Stop: docker-compose down"
        ;;
        
    2)
        # Production Docker Compose
        print_info "Starting production deployment..."
        
        # Check if docker-compose.prod.yml exists
        if [ ! -f docker-compose.prod.yml ]; then
            print_error "docker-compose.prod.yml not found!"
            exit 1
        fi
        
        # Build and start containers
        print_info "Building production Docker images..."
        docker-compose -f docker-compose.prod.yml down -v 2>/dev/null || true
        docker-compose -f docker-compose.prod.yml up -d --build
        
        print_success "Production containers started successfully!"
        
        # Wait for services
        print_info "Waiting for services to be ready..."
        sleep 15
        
        # Test backend
        if curl -f http://localhost:8000/docs > /dev/null 2>&1; then
            print_success "Backend is running at http://localhost:8000"
        else
            print_error "Backend failed to start. Check logs with: docker-compose -f docker-compose.prod.yml logs backend"
        fi
        
        print_info "View logs: docker-compose -f docker-compose.prod.yml logs -f"
        print_info "Stop: docker-compose -f docker-compose.prod.yml down"
        
        # Show next steps
        echo ""
        print_info "Next Steps:"
        echo "1. Point your domain to this server's IP"
        echo "2. Setup SSL with: certbot --nginx -d yourdomain.com"
        echo "3. Update nginx.prod.conf with your domain"
        echo "4. Restart nginx: docker-compose -f docker-compose.prod.yml restart nginx"
        ;;
        
    3)
        # Deploy to Vercel (Dashboard)
        print_info "Deploying dashboard to Vercel..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            print_info "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        # Check if frontend directory exists
        if [ ! -d "frontend" ]; then
            print_error "frontend directory not found!"
            exit 1
        fi
        
        cd frontend
        
        # Deploy to Vercel
        print_info "Deploying to Vercel..."
        vercel --prod
        
        cd ..
        
        print_success "Dashboard deployed to Vercel!"
        print_info "Remember to set NEXT_PUBLIC_API_URL environment variable in Vercel dashboard"
        ;;
        
    4)
        # Deploy to Render (Backend)
        print_info "Deploying backend to Render..."
        
        print_info "Steps to deploy on Render:"
        echo "1. Go to https://render.com"
        echo "2. Click 'New +' → 'Web Service'"
        echo "3. Connect your GitHub repository"
        echo "4. Use these settings:"
        echo "   - Runtime: Python 3"
        echo "   - Build Command: pip install -r requirements.txt"
        echo "   - Start Command: python beast_fastapi_server.py"
        echo "5. Add all environment variables from .env file"
        echo "6. Click 'Create Web Service'"
        
        print_warning "This is a manual process. Follow the steps above."
        ;;
        
    5)
        # Full Deploy (Vercel + Render)
        print_info "Full deployment guide:"
        echo ""
        echo "Frontend (Vercel):"
        echo "1. Go to https://vercel.com"
        echo "2. Import your GitHub repository"
        echo "3. Set root directory to 'frontend'"
        echo "4. Add environment variable: NEXT_PUBLIC_API_URL"
        echo "5. Deploy"
        echo ""
        echo "Backend (Render):"
        echo "1. Go to https://render.com"
        echo "2. Create new Web Service"
        echo "3. Connect GitHub repository"
        echo "4. Build: pip install -r requirements.txt"
        echo "5. Start: python beast_fastapi_server.py"
        echo "6. Add all .env variables"
        echo "7. Deploy"
        echo ""
        print_success "See DEPLOYMENT_GUIDE.md for detailed instructions"
        ;;
        
    *)
        print_error "Invalid choice. Exiting."
        exit 1
        ;;
esac

# Success message
echo ""
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║              Deployment Process Complete! 🚀            ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

print_info "For detailed deployment guide, see: DEPLOYMENT_GUIDE.md"
print_info "For API documentation, visit: http://localhost:8000/docs (if running locally)"
