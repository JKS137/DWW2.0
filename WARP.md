# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Development Commands

### Development
- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Package Management
- `npm install` - Install dependencies
- No test suite is currently configured (no Jest/Vitest setup found)

### Supabase Edge Functions
- `supabase functions deploy reminder-checker` - Deploy the email reminder function
- `supabase functions serve reminder-checker` - Serve function locally for testing
- `supabase start` - Start local Supabase services
- `supabase secrets set --env-file ./supabase/functions/.env.local` - Set local function secrets

### Deployment
- `vercel-redeploy.bat` / `vercel-redeploy.ps1` / `vercel-redeploy.sh` - Redeploy to Vercel (platform-specific scripts)

## Architecture Overview

### Tech Stack
- **Frontend**: React 18.3.1 with TypeScript, Vite for bundling
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **AI Integration**: Google Gemini API for OCR receipt processing
- **Email**: SendGrid API for warranty expiration reminders
- **Animation**: Framer Motion for UI animations

### Application Structure

#### Core Architecture
- **Single-page application** with client-side routing implemented in `App.tsx`
- **Context-based state management** using React Context API
- **Supabase-first architecture** with all data operations through Supabase client

#### Key Contexts
- `AuthContext` - Manages user authentication state and Supabase Auth integration
- `WarrantyContext` - Handles warranty CRUD operations, OCR processing, and state management

#### Data Flow
1. **Receipt Upload → OCR Processing**:
   - File uploaded to Supabase Storage via `warrantyService.ts`
   - Stub warranty record created with "Processing Receipt..." status
   - Google Gemini API processes image via `geminiService.ts`
   - Record updated with extracted product name, purchase date, and warranty duration

2. **Warranty Management**:
   - All operations flow through `WarrantyContext`
   - Optimistic updates with rollback on failure
   - Automatic expiry date calculation from purchase date + warranty duration

3. **Sharing System**:
   - Generate unique share tokens stored in `shared_warranties` table
   - Public access to warranty details via share links (`/share/:token`)

### Database Schema
- `warranties` table - Main warranty records
- `shared_warranties` table - Share tokens for public warranty access
- `notifications` table - Tracks sent email reminders
- `profiles` table - User profile data (extends Supabase Auth)

### Key Services

#### `warrantyService.ts`
- All database operations for warranties
- File upload/deletion to Supabase Storage
- Share link generation and retrieval
- Expiry date calculations

#### `geminiService.ts` 
- Google Gemini AI integration for OCR
- Converts files to base64 for API consumption
- Structured JSON response parsing with schema validation
- Lazy initialization with error handling

#### `supabaseClient.ts`
- Single Supabase client instance with configuration validation
- Hardcoded URL and anon key (consider moving to environment variables)
- Error handling for missing configuration

### Component Architecture
- **Pages**: Route-level components in `/pages` directory
- **Components**: Reusable UI components in `/components` directory
- **Icons**: SVG icon components in `/components/icons`
- **Modal Pattern**: Consistent modal implementations for CRUD operations

### Environment Configuration
- **Required Environment Variables**:
  - `GEMINI_API_KEY` - For OCR functionality (mapped to `process.env.API_KEY` in Vite config)
  - Supabase credentials are hardcoded in `supabaseClient.ts`

### Email Reminder System
- **Edge Function**: `supabase/functions/reminder-checker/index.ts`
- **Scheduled Execution**: Uses pg_cron to run daily
- **Logic**: Sends reminders for warranties expiring in exactly 7 or 30 days
- **Deduplication**: Uses `notifications` table to prevent duplicate emails
- **HTML Email Templates**: Inline HTML with SendGrid API

## Development Guidelines

### File Organization
- Follow existing patterns: context files in `/context`, services in `/services`, components by feature
- Icon components should extend the existing pattern in `/components/icons`
- Page components should handle routing logic, delegate business logic to contexts

### State Management
- Use contexts for shared state across components
- Implement optimistic updates with error rollback for better UX
- Avoid prop drilling by utilizing the context system

### Error Handling
- Services should throw meaningful error messages
- Components should gracefully handle and display errors
- Use configuration error screens for initialization failures

### Supabase Integration
- All database queries go through service layer functions
- Use Row Level Security (RLS) policies for data access control
- Handle Supabase client initialization errors gracefully

### OCR Processing
- Always create stub records before processing to show immediate feedback
- Handle OCR failures by updating the record with error state
- Parse and validate Gemini API responses with proper error messages

### Security Considerations
- Share tokens provide read-only access without authentication
- User data is isolated through Supabase RLS policies
- File uploads are scoped to user directories in Storage

## Notable Implementation Details

- **Custom Routing**: Manual client-side routing instead of React Router
- **File Upload Strategy**: Upload first, then process OCR to provide immediate feedback
- **Animation System**: Uses Framer Motion for page transitions and component animations
- **TypeScript Patterns**: Extensive use of utility types and proper interface definitions
- **Error Boundaries**: Configuration error handling prevents app crashes
- **Service Integration**: Lazy initialization pattern for external API clients
