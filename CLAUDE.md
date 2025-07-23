# Claude Code Documentation & Decisions

## Project: Interactive RFC Learning Tutorial

## Implementation Guidelines

- When implementing each RFCs, work with individual PRs, tag the right issue in the PR, test the frontend,
  and when using any code snippets, prefer python. For each PR make a separate branch and work off that branch.
  Update the gameplan and claude.md before and after implementing changes and before submitting PRs and after
  merging them. IMPORTANT
- For each RFC, you must link to the RFC PDF so that people can choose to read the entire thing.
- Always include python examples for each RFC tutorial to demonstrate implementation and learning
- You must add docker-based examples for each RFC where relevant to show how it works locally.
- You must link to the RFC in every tutorial so people can read the original

### RFC Influence and Historical Context

- Each RFC must include a dedicated section explaining its influence on the broader Internet ecosystem
- Highlight how specific RFCs fundamentally transformed network communication, protocols, and technological infrastructure
- Provide historical context on how each RFC contributed to the evolution of internet standards and technologies

### Recent Implementation Progress

**Docker Examples Implementation** (Completed - July 22, 2025)

- **Branch**: `feat/other-rfcs`
- **Commits**: 68775da, 815b82d
- **Status**: Ready for PR to main

**Implemented RFCs with Docker Examples:**

1. **RFC 793 (TCP)**: Complete interactive demonstration

   - TCP client/server with three-way handshake
   - Network traffic monitoring with tcpdump
   - Connection state tracking and statistics
   - Files: `docker-examples/rfc793-tcp/`

2. **RFC 821 (SMTP)**: Full email server implementation

   - SMTP server with DNS simulation
   - Web interface for email management
   - Educational logging and message tracking
   - Files: `docker-examples/rfc821-smtp/`

3. **RFC 959 (FTP)**: Educational FTP server
   - Interactive FTP commands demonstration
   - File transfer examples and logging
   - Educational command explanations
   - Files: `docker-examples/rfc959-ftp/`

**Frontend Enhancements:**

- RFC badges component with status indicators
- Enhanced navigation and layout improvements
- Playwright tests for RFC verification
- Updated glossary with networking terms

**Next Steps:**

- Create PR for Docker examples implementation
- Continue with remaining Protocol Expansion Era RFCs (1034, 1035, 1390)
- Add enhanced visual elements and diagrams

### Technical Architecture Decisions

- You must run npm run build before pushing to remote.
- You must add every abbreviation to the glossary and link to it in each file.

### Glossary Expansion Requirements

- You must add terms related to the internet, networking and specific to RFCs to the glossary and add popup links for them.