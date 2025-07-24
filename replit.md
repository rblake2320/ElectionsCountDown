# Election Tracker Platform

## Overview

This is a comprehensive election tracking and candidate management platform built with a modern full-stack architecture. The platform provides real-time election data, candidate management tools, voter analytics, and secure campaign portals. It combines multiple data sources to deliver accurate, up-to-date election information with advanced security and compliance features.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite with custom plugin configurations
- **Development**: Hot module replacement and runtime error overlay

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **API Structure**: RESTful APIs with comprehensive error handling
- **Real-time Features**: Event-driven architecture for live election updates

### Database Architecture
- **Primary Database**: PostgreSQL (Neon serverless)
- **Schema Management**: Drizzle ORM with migration system
- **Connection Pooling**: Neon serverless pool with WebSocket support
- **Data Archival**: Automated archival system for old analytics data
- **Backup Strategy**: Automated PostgreSQL dumps with compression

## Key Components

### Election Management System
- Comprehensive election database covering federal, state, and local elections
- Real-time election result tracking and updates
- Candidate management with detailed profiles and positions
- Multi-source data aggregation from government APIs

### Candidate Portal System
- Secure candidate authentication with JWT tokens
- Subscription-based access control (Basic, Premium, Enterprise tiers)
- Campaign content management and Q&A systems
- Voter interaction tracking and analytics
- Position statement management with AI validation

### Security & Compliance Framework
- Multi-layer authentication and authorization
- Rate limiting per subscription tier
- Content validation and sanitization
- GDPR, CCPA, and other privacy regulation compliance
- Comprehensive audit logging and IP tracking
- Bot prevention with behavioral analysis

### Data Integration Services
- **Government APIs**: Integration with data.gov, Google Civic Info, Census Bureau
- **Congressional Data**: ProPublica Congress API, OpenStates integration
- **Third-party Services**: Perplexity AI for fact-checking and validation
- **Geographic Services**: MapQuest for location-based data
- **Real-time Monitoring**: Web scraping and RSS feed monitoring

### Analytics & Monitoring
- User interaction tracking with privacy compliance
- Real-time performance monitoring and alerting
- Campaign analytics dashboard with demographic insights
- Cache performance optimization
- Database query optimization and indexing

## Data Flow

1. **Data Ingestion**: Multiple external APIs and services feed election data into the system
2. **Validation**: AI-powered validation service verifies data accuracy using multiple sources
3. **Storage**: Validated data is stored in PostgreSQL with proper indexing and relationships
4. **Caching**: Frequently accessed data is cached in-memory for performance
5. **API Delivery**: RESTful APIs serve data to frontend applications
6. **Real-time Updates**: Event-driven system pushes live updates to connected clients
7. **Analytics Collection**: User interactions are tracked and analyzed for insights

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit**: Development and deployment platform
- **WebSocket Support**: For real-time features

### API Integrations
- **ProPublica Congress API**: Congressional data and voting records
- **Google Civic Information API**: Election and candidate information
- **Data.gov APIs**: Government election data
- **Census Bureau API**: Demographic and district data
- **MapQuest API**: Geocoding and location services
- **Perplexity AI API**: Fact-checking and content validation
- **OpenStates API**: State legislature data

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **Vite**: Frontend build tool and development server
- **ESBuild**: Backend JavaScript bundling
- **TypeScript**: Type safety across the entire stack

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reload
- **Database**: Neon development database with connection pooling
- **Environment**: Node.js 20 with ES modules support

### Production Deployment
- **Platform**: Replit autoscale deployment
- **Build Process**: Vite build for frontend, ESBuild for backend
- **Database**: Neon production database with optimized connection pooling
- **Monitoring**: Built-in performance monitoring and alerting
- **Backup**: Automated daily backups with 30-day retention

### Security Considerations
- Environment variables for all API keys and secrets
- CORS configuration for secure cross-origin requests
- Rate limiting to prevent abuse
- Content Security Policy headers
- SQL injection prevention through parameterized queries

### Performance Optimization
- Database query optimization with proper indexing
- Multi-layer caching strategy (memory + database)
- Connection pooling for database efficiency
- Automated data archival for performance maintenance
- CDN-ready static asset serving

## Recent Changes

### July 23, 2025 - 2026 Midterm Election Data Integration & System Optimization
- **2026 Midterm Data**: Integrated comprehensive election seat totals covering 545-550 significant offices
- **Congressional Elections**: Added all 435 House seats + 35 Senate seats (33 Class 2 + 2 special elections)
- **Gubernatorial Races**: Documented 39 governor elections (36 states + 3 territories) with incumbent analysis
- **Major Mayoral Elections**: Integrated 30-35 major city elections from Ballotpedia top-100 cities
- **Perplexity API**: Fixed model compatibility issues with updated API endpoints
- **Critical Bug Fixes**: Resolved all 4 major issues - Congressional search, candidate comparison, Global Observatory crashes, and API authentication

### July 23, 2025 - GitHub Integration & Project Completion
- **GitHub Repository**: Prepared complete project for GitHub with comprehensive documentation
- **Documentation Suite**: Added README.md, CONTRIBUTING.md, LICENSE, and DEPLOYMENT.md
- **Project Structure**: Organized all files for public repository distribution
- **API Authentication**: Verified all percentage data comes from authentic sources only
- **Michigan Election Integration**: Added 9 real candidates with verified credentials

### July 22, 2025 - System Fixes & API Configuration
- **TypeScript Compilation**: Fixed all storage system compilation errors and duplicate function implementations
- **Database Schema**: Added missing electionCycles and campaignAccounts tables to complete schema
- **Query Optimization**: Resolved database query type issues and improved performance
- **API Key Analysis**: Analyzed provided API key (3637e88c-cbbc-496d-9ebc-a8c40d57d8c2) for congressional data APIs
- **Platform Stability**: System running stably with 587+ elections and Google Civic API integration

### June 17, 2025 - Interactive Polling Trend Visualization & Data Accuracy
- **Polling Data Accuracy System**: Implemented comprehensive solution distinguishing static database values from live polling data
- **Interactive Polling Charts**: Created full visualization system with line/area charts, time range filters, and trend analysis
- **Data Source Indicators**: Added visual indicators (yellow for static data, green for live data) with source tracking
- **Election Details Page**: Built dedicated page with comprehensive polling analysis and candidate comparison
- **Dropdown Fixes**: Resolved UI component issues in Global Dashboard using proper shadcn Select components

### June 16, 2025 - Data Collection & UI Improvements
- **OpenFEC Integration**: Added authentic campaign finance data collection from Federal Election Commission
- **Firecrawl Service**: Implemented web scraping for official election sources and news monitoring
- **Browser Automation**: Integrated Puppeteer, Playwright, and Selenium for advanced data collection
- **Theme Visibility Fix**: Resolved text visibility issues in countdown timers and election cards for both light and dark themes
- **API Endpoints**: Added comprehensive endpoints for election data scraping, candidate enrichment, and news monitoring

### Data Collection Capabilities
- Campaign finance data from OpenFEC API for federal candidates
- Web scraping from official state election websites
- Real-time news monitoring from trusted sources
- Browser automation with safety testing before implementation

## Changelog

- June 17, 2025. Interactive Polling Trend Visualization implemented
- June 16, 2025. Initial setup with comprehensive election tracking platform

## User Preferences

Preferred communication style: Simple, everyday language.
Theme preference: Adaptive text visibility for both light and dark modes.