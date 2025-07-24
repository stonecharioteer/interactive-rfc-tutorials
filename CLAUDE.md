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

**Phase 4: Modern VPN & Cryptography Era - Batch 6 Completion** (Completed - July 24, 2025)

- **Branch**: `feat/modern-security-architecture` (Merged - PR #41)
- **Status**: Complete with GitHub Actions improvements

**Implemented RFCs with Comprehensive Examples:**

1. **RFC 4301 (IPsec Security Architecture)**: Complete security framework tutorial

   - Security Policy Database (SPD) and Security Association (SA) management
   - Transport vs Tunnel mode detailed comparison with diagrams
   - Docker examples: `docker-examples/rfc4301-ipsec-architecture/`
   - Policy configuration examples with Python implementations
   - Modern VPN architecture patterns and enterprise networking

2. **RFC 4303 (ESP - Encapsulating Security Payload)**: Encryption/authentication protocol

   - Complete ESP packet structure and field descriptions
   - Anti-replay protection with sliding window algorithms
   - Algorithm comparison: AES-GCM, ChaCha20-Poly1305, traditional combinations
   - Docker examples: `docker-examples/rfc4303-esp/`
   - Performance analysis and modern cryptographic implementations

3. **RFC 8656 (TURN - Traversal Using Relays around NAT)**: NAT traversal relay protocol
   - TURN allocation and permission management systems
   - Send/Data vs Channel Data transmission methods with overhead analysis
   - Docker examples: `docker-examples/rfc8656-turn/`
   - Integration with ICE and modern P2P applications (Tailscale, WebRTC)
   - Performance impact analysis and optimization strategies

**Enhanced Educational Features:**

- **ELI-Pythonista Sections**: All RFCs now include comprehensive educational sections with Python examples and real-world analogies
- **Docker Demonstrations**: Interactive protocol implementations with educational logging for hands-on learning
- **Modern Context**: Analysis of current relevance, industry usage statistics, and integration with contemporary technologies
- **Glossary Expansion**: Added 50+ new terms covering security, cryptography, and NAT traversal concepts
- **Visual Elements**: Enhanced Mermaid diagrams for protocol flows and architecture visualization

**GitHub Actions CI/CD Infrastructure** (Completed - July 24, 2025)

- **Branch**: `fix/github-actions-pr-workflow` (PR #43)
- **Issues Resolved**: Fixed PR build workflow failures that were preventing proper CI/CD

**Infrastructure Improvements:**

- **TypeScript Configuration**: Fixed type checking command compatibility
- **ESLint Integration**: Resolved component typing issues causing linting failures
- **Playwright Testing**: Updated test coverage to include all 22+ implemented RFCs
- **Test Infrastructure**: Added comprehensive validation for Batch 6 security RFCs
- **Local Debugging**: Implemented `gh act` workflow testing for faster development
- **Build Validation**: Complete pipeline including linting, type checking, building, and testing

**Current Implementation Status:**

- **Total RFCs Implemented**: 22 comprehensive tutorials
- **Docker Examples**: Available for 15+ RFCs with hands-on demonstrations
- **Test Coverage**: 124 Playwright tests covering desktop and mobile scenarios
- **Glossary Terms**: 300+ networking and security terms with contextual explanations
- **Educational Sections**: ELI-Pythonista sections with Python examples for complex protocols

### Technical Architecture Decisions

- **Build Validation**: Always run `npm run build` before pushing to remote to ensure production compatibility
- **Testing Requirements**: Run `npm run test` to validate Playwright test coverage before submissions
- **Linting Standards**: Maintain zero ESLint warnings policy with `npm run lint`
- **Type Safety**: Ensure TypeScript compilation passes with `npx tsc --noEmit`
- **Glossary Linking**: Add every networking/security abbreviation to the glossary and link with GlossaryTerm component
- **Educational Patterns**: All complex RFCs must include ELI-Pythonista sections with Python examples and analogies
- **Docker Integration**: Provide hands-on Docker demonstrations for protocols where applicable
- **GitHub Actions**: Use `gh act` for local workflow testing before pushing changes

### Current Development Workflow

1. **Branch Creation**: Create feature branches following pattern `feat/batch-name` or `fix/issue-description`
2. **Implementation**: Follow established patterns with Docker examples, Python code, and educational content
3. **Local Testing**: Validate with linting, type checking, building, and Playwright tests
4. **GitHub Actions**: Test workflows locally with `gh act` before pushing
5. **Pull Request**: Create detailed PRs linking to GitHub issues with comprehensive test plans
6. **Documentation**: Update both GAMEPLAN.md and CLAUDE.md to reflect implementation progress

### Glossary Expansion Requirements

- **Comprehensive Coverage**: Add all networking, security, cryptography, and protocol-specific terms
- **Contextual Linking**: Use `<GlossaryTerm>` component for automatic popup definitions
- **Educational Value**: Include terms that help users understand broader internet concepts
- **Cross-Reference System**: Link related terms and concepts for deeper learning paths