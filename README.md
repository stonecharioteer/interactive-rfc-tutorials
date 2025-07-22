# Interactive RFC Learning Tutorial

A mobile-friendly web application for learning important RFCs that shaped the evolution of the internet.
Journey through internet history from the first RFC in 1969 to modern HTTP standards, with interactive
content and visual learning aids.

## 🎯 Project Overview

This project provides an interactive timeline-based learning experience covering 21 critical RFCs across
5 historical eras:

- **Foundation Era (1969-1982)**: Birth of the Internet
- **Protocol Expansion (1983-1990)**: Building Infrastructure
- **Web Era (1990s-2000s)**: World Wide Web Revolution
- **Modern Networking (2000s-2010s)**: Security and Performance
- **Current Standards (2020s)**: Modern Internet

## ✨ Features

- 📱 **Mobile-First Design**: Responsive web app that works perfectly on phones, tablets, and desktop
- 🎮 **Interactive Content**: Rich educational content with visual aids and examples
- 📊 **Visual Learning**: Network diagrams, protocol demonstrations, and code examples
- 🏆 **Progress Tracking**: Local progress tracking with browser storage
- 🔍 **Easy Navigation**: Timeline-based RFC discovery and learning paths
- 🎨 **Modern UI**: Clean design built with React and Tailwind CSS
- 🐍 **Code Examples**: Python implementations and practical demonstrations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Just (command runner) - [Install here](https://github.com/casey/just)

### Setup

```bash
# Clone the repository
git clone https://github.com/learnwithcarter-ai/interactive-tutorials.git
cd interactive-tutorials

# Complete project setup
just setup

# Start development server
just dev
```

This will:

- Install all dependencies
- Set up Playwright browsers for testing
- Launch the development server at <http://localhost:5173>

### Access the Application

- **Development Server**: <http://localhost:5173>
- **Production Build**: `just build && just preview`

## 🏗️ Architecture

### Frontend

- **React + TypeScript**: Modern web development with type safety
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **File-Based Content**: Individual RFC components for maximum flexibility

### Content Structure

Each RFC tutorial is implemented as its own React component:

```
frontend/src/pages/rfcs/
├── RFC1.tsx      # Host Software (1969)
├── RFC791.tsx    # Internet Protocol (1981)
├── RFC821.tsx    # Simple Mail Transfer Protocol (1982)
└── ...
```

### Data Storage

- **Progress Tracking**: Browser localStorage for offline capability
- **RFC Content**: Static React components with rich educational content
- **No Database**: Simplified architecture with file-based content

## 📚 Development

### Common Commands

```bash
# Development
just dev                    # Start development server
just build                  # Build for production
just preview                # Preview production build

# Testing
just test                   # Run Playwright tests
just test-ui                # Run tests in UI mode

# Setup
just install                # Install dependencies
just install-browsers       # Install Playwright browsers
just setup                  # Complete setup
```

### RFC Content Development

Each RFC tutorial includes:

- **Historical Context**: Why the RFC was created and its impact
- **Technical Deep-Dive**: Detailed protocol explanations
- **Visual Examples**: Code snippets, protocol flows, and diagrams
- **Modern Relevance**: How the RFC impacts today's internet

### Adding New RFCs

1. Create a new component in `frontend/src/pages/rfcs/RFCxxx.tsx`
2. Add the RFC metadata to `frontend/src/data/rfcs.ts`
3. The routing system will automatically pick up the new RFC

## 📖 RFC Tutorial Content

### Currently Implemented RFCs

See [GitHub Issues](https://github.com/learnwithcarter-ai/interactive-tutorials/issues) for
implementation status of all 21 RFCs.

The tutorial covers essential protocols like:

- RFC 1: Host Software (Foundation of the Internet)
- RFC 791: Internet Protocol (IP addressing and routing)
- RFC 821: SMTP (Email delivery system)
- RFC 1945: HTTP/1.0 (World Wide Web protocol)
- And many more...

## 🤝 Contributing

We welcome contributions! Please see our [GAMEPLAN.md](./GAMEPLAN.md) for detailed project roadmap
and [CLAUDE.md](./CLAUDE.md) for technical decisions.

### Development Process

1. Pick an RFC from our [GitHub Issues](https://github.com/learnwithcarter-ai/interactive-tutorials/issues)
2. Create a feature branch for the RFC implementation
3. Add the RFC component following existing patterns
4. Test the tutorial content on mobile and desktop
5. Submit a pull request with your implementation

## 📝 Documentation

- [**GAMEPLAN.md**](./GAMEPLAN.md) - Comprehensive project roadmap and feature planning
- [**CLAUDE.md**](./CLAUDE.md) - Technical architecture decisions and tradeoffs

## 🧪 Testing Strategy

- **E2E Tests**: Playwright tests covering mobile and desktop usage
- **Component Testing**: Individual RFC page testing
- **Responsive Testing**: Multi-viewport testing for mobile compatibility
- **Type Checking**: Strict TypeScript validation

```bash
just test           # Run all Playwright tests
just test-ui        # Interactive test runner
```

## 📱 Mobile Experience

The application is built mobile-first with:

- **Responsive Design**: Optimized for phones, tablets, and desktop
- **Touch-Friendly**: Easy navigation on mobile devices
- **Offline Progress**: Local storage works without internet
- **Fast Loading**: Static site with minimal JavaScript bundle

## 🚀 Deployment

### Development

```bash
just dev              # Local development server
```

### Production

The application builds to static files that can be deployed anywhere:

```bash
just build            # Creates dist/ folder with static files
just preview          # Preview the production build locally
```

Deploy the `dist/` folder to any static hosting service:

- Vercel, Netlify, GitHub Pages
- AWS S3, Google Cloud Storage
- Any web server or CDN

### GitHub Pages Deployment

This project includes automatic deployment to GitHub Pages via GitHub Actions:

1. **Automatic Deployment**: Pushes to `main` branch automatically trigger deployment
2. **Build Process**: Uses Node.js 18 and runs `npm ci && npm run build`
3. **Static Hosting**: Serves the built site from `frontend/dist/`
4. **Custom Domain**: Configure in repository settings if needed

The deployment workflow will:

- Install dependencies with `npm ci`
- Build the production bundle with `npm run build`
- Deploy to GitHub Pages automatically

**Setup Requirements:**

1. Enable GitHub Pages in repository Settings > Pages
2. Set Source to "GitHub Actions"
3. The workflow will handle the rest automatically

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- **IETF**: For maintaining the RFC series and internet standards
- **RFC Authors**: The pioneers who documented internet protocols
- **Open Source Community**: For the amazing tools that make this possible

## 🔗 Links

- [Project Repository](https://github.com/learnwithcarter-ai/interactive-tutorials)
- [Issue Tracker](https://github.com/learnwithcarter-ai/interactive-tutorials/issues)
- [IETF RFC Database](https://www.rfc-editor.org/)
- [Internet History Timeline](https://en.wikipedia.org/wiki/History_of_the_Internet)

---

Learn the protocols that power the internet! 🌐
