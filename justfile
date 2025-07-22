# RFC Tutorial - Docker-based Development Justfile

# Install dependencies locally (for IDE support)
install:
    cd frontend && npm install

# Build Docker images
build:
    docker compose build

# Start development server with Docker
dev:
    @echo "🚀 Starting RFC Tutorial development server..."
    @echo ""
    docker compose up -d
    @echo ""
    @echo "✅ Development server is running!"
    @echo ""
    @echo "📱 Access the app at:"
    @echo "   Local:    http://localhost:15173"
    @echo "   Network:  http://$(hostname -I | awk '{print $$1}' 2>/dev/null || echo '0.0.0.0'):15173"
    @echo ""
    @echo "📊 View logs: just logs"
    @echo "🛑 Stop server: just stop"
    @echo ""

# Stop development server
stop:
    @echo "🛑 Stopping RFC Tutorial development server..."
    docker compose down
    @echo "✅ Development server stopped"

# View logs from the development server
logs:
    docker compose logs -f frontend

# Restart the development server
restart: stop dev

# Build for production
build-prod:
    cd frontend && npm run build

# Preview production build
preview:
    cd frontend && npm run preview

# Run tests
test:
    cd frontend && npm run test

# Run tests in UI mode
test-ui:
    cd frontend && npm run test:ui

# Install Playwright browsers
install-browsers:
    cd frontend && npx playwright install

# Clean up Docker containers and images
clean:
    @echo "🧹 Cleaning up Docker containers and images..."
    docker compose down --rmi local --volumes --remove-orphans
    @echo "✅ Cleanup complete"

# Full setup: install deps, build images, and show status
setup: install build
    @echo ""
    @echo "✅ RFC Tutorial setup complete!"
    @echo ""
    @echo "🚀 Start development: just dev"
    @echo "🧪 Run tests: just test"
    @echo "📚 View help: just --list"

# Show Docker container status
status:
    @echo "📊 RFC Tutorial Container Status:"
    @echo ""
    docker compose ps
    @echo ""
    @if docker compose ps | grep -q "Up"; then \
        echo "📱 App URL: http://localhost:15173"; \
        echo "🌐 Network URL: http://$(hostname -I | awk '{print $$1}' 2>/dev/null || echo '0.0.0.0'):15173"; \
    fi

# Follow logs with colored output
logs-colored:
    docker compose logs -f --tail=100

# Open the app in default browser (Linux/macOS)
open:
    @if command -v xdg-open >/dev/null 2>&1; then \
        xdg-open http://localhost:15173; \
    elif command -v open >/dev/null 2>&1; then \
        open http://localhost:15173; \
    else \
        echo "Please open http://localhost:15173 in your browser"; \
    fi

# Development with logs (runs dev and shows logs)
dev-logs: dev logs

# Quick restart when files change
reload:
    @echo "🔄 Reloading frontend container..."
    docker compose restart frontend
    @echo "✅ Frontend reloaded"

# Help command
help:
    @echo "RFC Tutorial Development Commands:"
    @echo ""
    @echo "  setup         Complete project setup"
    @echo "  dev           Start development server with Docker"
    @echo "  stop          Stop development server"
    @echo "  restart       Restart development server"
    @echo "  logs          View development server logs"
    @echo "  status        Show container status and URLs"
    @echo "  test          Run Playwright tests"
    @echo "  clean         Clean up Docker containers"
    @echo "  open          Open app in default browser"
    @echo ""
    @echo "For more commands: just --list"
