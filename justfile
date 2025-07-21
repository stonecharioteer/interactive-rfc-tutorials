# RFC Tutorial - Simple Frontend Justfile

# Install dependencies
install:
    cd frontend && npm install

# Run development server
dev:
    cd frontend && npm run dev

# Build for production
build:
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

# Setup complete project
setup: install install-browsers
    @echo "✅ RFC Tutorial setup complete!"
    @echo "Run 'just dev' to start the development server"

# Help command
help:
    @just --list
