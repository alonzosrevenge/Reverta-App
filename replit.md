# Overview

This is a spiritual journey web application that serves as a community platform for Muslim reverts, specifically targeting millennials and Gen Z users. The app provides users with different sections to explore their spiritual journey, including gamified habit tracking through "My Journey", interactive prayer guidance, community connection, and Islamic terminology learning. It features a modern, stylish dark mode design with vibrant gradients and animations that appeal to younger demographics.

Key features include:
- Welcoming landing page with streamlined authentication flow
- Complete user authentication system with seamless account creation and login
- "My Journey" - A grace-based habit tracking system with "Iman Score" gamification that celebrates small spiritual steps
- Interactive step-by-step prayer system starting with Fajr (dawn prayer) with Arabic text, English translations, and guidance
- Comprehensive Lingo Guide for learning Islamic spiritual terms with search functionality
- Protected routes ensuring personalized experience for authenticated users

The app specifically addresses the challenges Muslim reverts face by promoting gentle, incremental spiritual growth rather than overwhelming expectations. The authentication system prioritizes user experience by automatically signing users in after account creation and directing them to their personal journey page.

## Recent Updates (August 17, 2025)
- **ARABIC SCRIPT INTEGRATION COMPLETE**: Successfully replaced all icon boxes in prayer introduction pages with authentic Arabic script - الفجر (Fajr), الظهر (Dhuhr), العصر (Asr), المغرب (Maghrib), العشاء (Isha) now display beautifully with themed gradient styling and serif font
- **ALL FIVE DAILY PRAYERS COMPLETE**: Successfully completed all five daily prayer modules with authentic Islamic sequences, comprehensive step-by-step guidance, and unique visual themes for each prayer time
- **COMPLETE MAGHRIB PRAYER MODULE**: Created comprehensive Maghrib (sunset prayer) with full 28-step 3-rakah structure, purple/pink/rose gradient theme, and sunset background effects - includes authentic Islamic sequence with Surah Al-Ikhlāṣ and Surah Al-Falaq for first two rakahs
- **COMPLETE ISHA PRAYER MODULE**: Successfully created comprehensive Isha (night prayer) with full 33-step 4-rakah structure, indigo/blue/purple gradient theme, and starry background effects - includes authentic Islamic sequence with Surah Al-Ikhlāṣ and Surah An-Nās for first two rakahs
- **COMPLETE ASR PRAYER MODULE**: Successfully recreated Asr (afternoon prayer) with full 33-step 4-rakah structure and amber/orange/red gradient theme - includes authentic Islamic sequence with Surah Al-Ikhlāṣ and Surah Al-Falaq for first two rakahs
- **AUDIO TRANSLATION PLAYERS**: All prayers now feature complete audio functionality with state management, play/pause controls, and themed UI components using existing "Allahu Akbar" pronunciation audio
- **CONSISTENT PRAYER ARCHITECTURE**: All prayers follow proper Islamic structure - Fajr (13 steps, 2 rakahs), Maghrib (28 steps, 3 rakahs), Dhuhr/Asr/Isha (33 steps, 4 rakahs) → Final Tashahhud → Salawat → Tasleem
- **THEMATIC VISUAL CONSISTENCY**: Each prayer maintains distinct visual identity - Fajr (orange sunrise), Dhuhr (yellow/orange), Asr (amber/orange/red), Maghrib (purple/pink/rose sunset), Isha (indigo/blue/purple starry night)

## Previous Updates (August 13, 2025)
- **REVERTA LOGO INTEGRATION**: Successfully integrated custom Islamic geometric logo throughout the app with golden gradient borders and glowing effects on welcome page and navigation areas for strong brand consistency
- **COMMUNITY PAGE**: Built comprehensive Discord community introduction page with join button linking to https://discord.gg/x9Zj7Jzh, featuring community values, features grid, and elegant design matching app aesthetic
- **PROGRESS RING SYSTEM**: Completely redesigned My Journey page removing ImanScore in favor of elegant Apple Watch-style progress ring that fills as habits are completed (3 habits = 100%), with luxury dark gradient background (deep purple to midnight blue)
- **NEW HABIT SYSTEM**: Replaced old point-based system with 6 simplified daily habits featuring emojis, clear titles, and descriptions - focused on grace-based spiritual growth rather than scoring
- **ENHANCED UI**: Modern tech luxury design with smooth animations, rounded stroke caps on progress ring, and motivational messages that change based on completion ("Take one small step to begin 🌱" → "Day complete—well done 🌙")
- **PERSISTENT STATE**: Habits persist across refreshes using localStorage with today's date key, no global totals or streaks - just daily focus
- **PUSH NOTIFICATIONS SYSTEM**: Comprehensive notification system implemented with Web Push API, spiritual reminder messages, user preferences management, and notification settings page accessible via bell icon in My Journey
- **EXPANDED LINGO GUIDE**: Added 50+ essential Islamic terms covering Five Pillars, daily prayers, spiritual practices, common Arabic phrases, religious concepts, and community terms - now a comprehensive reference for Muslim reverts
- **DEVELOPMENT MODE**: Temporarily bypassed authentication for easier testing - users can access all features without login
- Media sections successfully added to all prayer modules with dedicated spaces at the top of each prayer step
- Media handling packages installed (@google-cloud/storage, @uppy components) with upload functionality and themed placeholders for pose demonstrations
- Fixed database connectivity issues by switching from Neon serverless to standard PostgreSQL driver
- Successfully connected to Replit PostgreSQL database for persistent user storage
- Authentication system now fully functional with proper password hashing and session management
- User accounts persist permanently with secure credential storage
- Streamlined registration flow automatically logs users in and redirects to My Journey page
- Built complete prayer modules for all five daily prayers:
  - Fajr: 2 rakahs (Dawn Prayer) - Orange/sunrise theme
  - Dhuhr: 4 rakahs (Midday Prayer) - Yellow/orange theme
  - Asr: 4 rakahs (Afternoon Prayer) - Amber/orange theme
  - Maghrib: 3 rakahs (Sunset Prayer) - Purple/pink theme
  - Isha: 4 rakahs (Night Prayer) - Indigo/blue theme with starry effects
- Each prayer includes authentic Arabic text, English translations, step-by-step guidance, and progress tracking

# User Preferences

Preferred communication style: Simple, everyday language.
Target audience: Muslim reverts, millennials and Gen Z
Design preference: Super stylish, modern dark mode with vibrant gradients and animations

# System Architecture

## Frontend Architecture

The application uses a modern React-based frontend with TypeScript:

- **React 18** with functional components and hooks
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing instead of React Router
- **Tailwind CSS** for styling with a custom design system
- **shadcn/ui** component library for consistent UI components using Radix UI primitives

The frontend follows a component-based architecture with:
- Page components in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/`
- Custom hooks in `client/src/hooks/`
- Utility functions in `client/src/lib/`

## Backend Architecture

The backend is built with Express.js using TypeScript:

- **Express.js** server with middleware for JSON parsing and request logging
- **Node.js** with ESM modules
- Modular route registration system in `server/routes.ts`
- Abstract storage interface pattern with in-memory implementation as default
- Error handling middleware with proper HTTP status codes

## Data Storage Solutions

The application is designed with a flexible storage architecture:

- **Abstract storage interface** (`IStorage`) allows switching between different storage implementations
- **In-memory storage** (`MemStorage`) as the default implementation for development
- **Drizzle ORM** configured for PostgreSQL with schema definitions
- **PostgreSQL** as the target production database with Neon serverless support
- Database migrations managed through Drizzle Kit

## Authentication and Authorization

Currently, the authentication system is minimal with:
- Basic user schema with username/password fields
- Zod validation schemas for user input
- Storage interface methods for user CRUD operations
- Session handling prepared with `connect-pg-simple` for PostgreSQL sessions

## State Management

- **TanStack Query (React Query)** for server state management and data fetching
- Custom query client configuration with error handling
- API request utilities with credential-based authentication
- Toast notifications for user feedback using Radix UI Toast

## Styling and Theme System

- **Tailwind CSS** with custom configuration
- **CSS custom properties** for theme colors and design tokens
- **Neutral color scheme** as the base theme
- **Inter font family** for typography
- Responsive design with mobile-first approach

## Development Workflow

- **TypeScript** for type safety across the entire stack
- **ESBuild** for production bundling
- **TSX** for development server with hot reloading
- Path aliases for clean imports (`@/` for client, `@shared/` for shared code)
- Development and production build scripts

# External Dependencies

## UI and Styling

- **@radix-ui/* packages** - Comprehensive set of accessible UI primitives for components like dialogs, dropdowns, forms, and navigation
- **tailwindcss** - Utility-first CSS framework for styling
- **class-variance-authority** - For creating type-safe component variants
- **clsx** and **tailwind-merge** - For conditional CSS class management
- **lucide-react** - Icon library for consistent iconography

## Data and State Management

- **@tanstack/react-query** - Server state management and data fetching
- **drizzle-orm** and **drizzle-zod** - Type-safe ORM with Zod schema validation
- **@neondatabase/serverless** - Serverless PostgreSQL driver for Neon database
- **zod** - Schema validation library

## Form Handling

- **react-hook-form** - Performance-focused form library
- **@hookform/resolvers** - Validation resolvers for React Hook Form

## Development Tools

- **vite** - Build tool and development server
- **@vitejs/plugin-react** - Vite plugin for React support
- **tsx** - TypeScript execution environment for development
- **@replit/vite-plugin-runtime-error-modal** - Development error overlay
- **@replit/vite-plugin-cartographer** - Development tooling for Replit environment

## Routing and Navigation

- **wouter** - Minimalist routing library for React

## Utilities

- **date-fns** - Date manipulation and formatting
- **nanoid** - Unique ID generation
- **cmdk** - Command palette component for search interfaces