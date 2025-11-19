# GlucoNova - AI-Powered Diabetes Management Platform

## Overview

GlucoNova is a comprehensive diabetes management web application that provides AI-powered insulin forecasting, health monitoring, and doctor-patient collaboration. The platform supports multiple user roles (patients, doctors, and admins) with role-based access control and approval workflows. Patients can track glucose levels, log meals via voice input, upload medical reports, and receive personalized health insights. Healthcare providers can monitor patients, review medical records, and manage care remotely.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query for server state management
- Tailwind CSS for styling with a custom design system

**Design System:**
- shadcn/ui component library with customized "new-york" style preset
- Dark-themed interface with navy gradients (#040815 to #071627)
- Glassmorphism effects with backdrop blur on cards and modals
- Bright emerald/teal (rgb(52, 211, 153) / #34d399 / emerald-400) as primary accent color
- Button gradients use emerald-500 to emerald-400 with emerald-300 hover states
- Floating animated elements and wave gradients in bright emerald tones
- Responsive layout with sidebar navigation for desktop, collapsible for mobile

**Color Palette:**
- Primary text/links: emerald-400 (HSL 158 64% 52%) with emerald-300 hover
- Backgrounds: emerald-400/10 and emerald-400/20 for subtle accents
- Borders: emerald-400/20 and emerald-400/30
- Focus states: emerald-400 with emerald-400/20 rings
- CSS theme variables: primary, sidebar-primary, ring, and accent all use bright emerald (158 64% 52%)
- Chart colors: Bright emerald range (158 64% 44-60% lightness)

**State Management:**
- React Context API for authentication state (AuthProvider)
- Local component state for UI interactions
- TanStack Query for caching and synchronizing server data
- No global state management library (Redux, Zustand) used

**Component Architecture:**
- Reusable UI components from shadcn/ui (Button, Card, Input, etc.)
- Custom composite components (MetricCard, GlucoseTrendChart, VoiceAssistantCard)
- Layout components (PublicLayout for auth pages, MainLayout with AppSidebar for authenticated pages)
- Page-level components for each route (DashboardPage, LoginPage, RegisterPage, RoleSelectionPage, etc.)

**Routing Strategy:**
- Protected routes with role-based access control
- Automatic redirect to login for unauthenticated users
- Account approval check with pending approval screen
- Role-specific dashboards (patient, doctor, admin)
- Three-step registration flow:
  1. `/role-selection` - User selects Patient or Healthcare Provider role
  2. `/register?role=patient|doctor` - User enters credentials (role pre-selected via URL parameter)
  3. `/login` - User logs in after successful registration

**First-Time User Onboarding:**
- 640×460px glassmorphic modal with 4-step progress flow
- Step 1: Welcome message with "Get Started" CTA
- Step 2: PDF upload (drag-and-drop, browse), Demo Data option, or Manual Entry selection
- Step 3: Manual entry form with validation (if selected from Step 2)
- Step 4: Completion confirmation
- **Validation Requirements**: Name, DOB, Weight (>0 kg), Height (>0 cm) enforced before progression
- **Skip Functionality**: Users can skip onboarding; persistent banner reminds them to complete setup
- **State Persistence**: localStorage keys 'onboardingCompleted' and 'onboardingSkipped'
- **Accessibility**: Dialog includes VisuallyHidden title and description for screen readers
- **Modal Control**: Cannot be dismissed by overlay/ESC - only via "Skip" button or completion

**Dashboard Layout (Pixel-Perfect Specifications):**
- Container: max-width 1400px, centered, 24px padding
- Grid: Two columns (1fr + 360px) with 28px gap
- Header: 72px height, 24px horizontal padding
- Component Heights:
  - MetricCard (glucose, insulin, carbs, activity): 110px
  - GlucoseTrendChart: 360px with 12px border-radius
  - AI Insulin Prediction card: 120px
  - Voice Assistant card: 220px
  - Progress/Quick Action cards: flexible height

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js framework
- TypeScript for type safety across full stack
- MongoDB via Mongoose ODM for data persistence
- JWT (JSON Web Tokens) for authentication
- bcrypt.js for password hashing
- Multer for file upload handling (medical reports)

**API Design:**
- RESTful API endpoints with `/api` prefix
- Authentication middleware for protected routes
- Role-based authorization middleware
- Approval status middleware for pending users
- Centralized error handling

**Authentication & Registration Flow:**
- JWT tokens with 7-day expiration
- Token stored in localStorage on client
- Bearer token authentication in request headers
- Middleware validates token and extracts user information
- Admin approval required for new user accounts
- Registration flow separates role selection from credential entry:
  1. User clicks "Create account" on login page → navigates to `/role-selection`
  2. User selects role (Patient or Healthcare Provider) → navigates to `/register?role=<selected-role>`
  3. RegisterPage reads role from URL parameter, validates it, and redirects to role selection if missing
  4. User completes registration → redirects to `/login` (not directly to dashboard)
  5. After login → redirects to dashboard (shows "Account Pending Approval" if not yet approved by admin)

**Database Schema:**
- Users collection (name, email, password hash, role, approval status)
- HealthData collection (glucose, insulin, carbs, activity level, linked to user)
- Meals collection (nutrition info, voice recording flag, linked to user)
- MedicalReports collection (file metadata, uploaded by doctor or patient)
- Predictions collection (AI-generated insulin forecasts)

**File Management:**
- Multer middleware for handling multipart/form-data
- File uploads stored in `uploads/` directory
- File type validation (PDF, JPEG, PNG only)
- 20MB file size limit for medical reports
- File metadata stored in database with references to file system

### External Dependencies

**UI Component Library:**
- Radix UI primitives for accessible headless components
- shadcn/ui as a curated component collection built on Radix
- React Hook Form for form state management with Zod validation
- Recharts for data visualization (glucose trends, health metrics)

**Database:**
- MongoDB (connection via Mongoose)
- Fallback to in-memory storage if MongoDB unavailable
- Indexed fields for query performance (userId, timestamp)

**Third-Party Services (Planned):**
- Nutritionix API for nutrition analysis of voice-logged meals
- Web Speech API for voice input functionality (browser-native)
- AI/ML service for diabetes prediction and insulin forecasting (separate Python service, not yet integrated)

**Development Tools:**
- Replit-specific plugins for development (vite-plugin-runtime-error-modal, vite-plugin-cartographer)
- ESBuild for server-side bundling in production
- Drizzle Kit for database migrations (configured but using Mongoose instead)
- PostCSS with Autoprefixer for CSS processing

**Authentication:**
- jsonwebtoken library for JWT creation and verification
- bcryptjs for password hashing with salt rounds
- CORS middleware for cross-origin requests

**Notes:**
- The project is configured for PostgreSQL via Drizzle (drizzle.config.ts), but currently uses MongoDB with Mongoose models
- Database abstraction layer (storage.ts) supports both MongoDB and in-memory storage
- Environment variables required: DATABASE_URL (MongoDB connection string), JWT_SECRET (token signing key)