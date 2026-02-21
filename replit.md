# Flowly - Personal Productivity Tracker

## Overview

Flowly is a personal productivity application that combines monthly goal setting, daily habit tracking, and task management. The app helps users define monthly mantras and objectives, track daily habits with visual progress, manage to-do lists, and maintain persistent notes. Built with a React frontend and Express backend, it uses PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled via Vite
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration (CSS variables for theming)
- **Charts**: Recharts for habit progress visualization
- **Animations**: Framer Motion for smooth transitions

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: REST API with typed route definitions in `shared/routes.ts`
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Schema Validation**: Zod schemas integrated with Drizzle (drizzle-zod)
- **Authentication**: Replit Auth integration (currently bypassed with guest user for development)

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines all tables
- **Key Tables**:
  - `users` - User accounts
  - `sessions` - Auth sessions (required for Replit Auth)
  - `monthlyGoals` - Monthly mantras, goals, and top 3 priorities
  - `habits` - User-defined habits to track
  - `habitCompletions` - Daily habit completion records
  - `dailyLogs` - Daily energy levels and notes
  - `todos` - Daily task items
  - `persistentNotes` - Permanent notes that persist across sessions

### Project Structure
- `/client` - React frontend application
- `/server` - Express backend with routes and storage
- `/shared` - Shared types, schemas, and route definitions
- `/migrations` - Drizzle database migrations

### Build System
- Development: `tsx` for TypeScript execution
- Production: Custom build script using esbuild (server) and Vite (client)
- Output: `dist/` directory with compiled server and static client files

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations with `db:push` command

### Authentication
- **Replit Auth**: OpenID Connect integration via `openid-client` package
- **Session Storage**: PostgreSQL-backed sessions using `connect-pg-simple`
- Currently bypassed with static guest user for simplified development

### Frontend Libraries
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, checkboxes, etc.)
- **Recharts**: Data visualization for habit statistics
- **date-fns**: Date manipulation and formatting
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Frontend development server with HMR
- **TypeScript**: Type checking across entire codebase
- **Tailwind CSS**: Utility-first styling with custom configuration