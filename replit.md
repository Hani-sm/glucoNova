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
- Emerald green (#10b981) as primary accent color
- Orange (#f97316) for call-to-action buttons
- Responsive layout with sidebar navigation for desktop, collapsible for mobile

**State Management:**
- React Context API for authentication state (AuthProvider)
- Local component state for UI interactions
- TanStack Query for caching and synchronizing server data
- No global state management library (Redux, Zustand) used

**Component Architecture:**
- Reusable UI components from shadcn/ui (Button, Card, Input, etc.)
- Custom composite components (MetricCard, GlucoseTrendChart, VoiceAssistantCard)
- Layout components (PublicLayout for auth pages, MainLayout with AppSidebar for authenticated pages)
- Page-level components for each route (DashboardPage, LoginPage, RegisterPage, etc.)

**Routing Strategy:**
- Protected routes with role-based access control
- Automatic redirect to login for unauthenticated users
- Account approval check with pending approval screen
- Role-specific dashboards (patient, doctor, admin)

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

**Authentication Flow:**
- JWT tokens with 7-day expiration
- Token stored in localStorage on client
- Bearer token authentication in request headers
- Middleware validates token and extracts user information
- Admin approval required for new user accounts

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