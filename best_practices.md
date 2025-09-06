# 📘 Project Best Practices

## 1. Project Purpose
Digital Warranty Vault is a React/TypeScript web application that helps users store, manage, and track product warranties. It uses AI-powered OCR to automatically extract warranty information from receipt images, stores data securely in Supabase, and provides automated email reminders for expiring warranties. The app features user authentication, warranty sharing capabilities, and a comprehensive dashboard for warranty management.

## 2. Project Structure
- **Root level**: Main app files (`App.tsx`, `index.tsx`, `types.ts`) and configuration files
- **`components/`**: Reusable UI components organized by functionality (modals, forms, cards, icons)
- **`pages/`**: Route-based page components (Dashboard, Login, Account, etc.)
- **`context/`**: React Context providers for global state management (Auth, Warranty)
- **`services/`**: Business logic and external API integrations (Supabase, Gemini AI, analytics)
- **`supabase/`**: Database functions and Edge Functions for server-side operations
- **`public/`**: Static assets and favicon

## 3. Test Strategy
- **Framework**: No formal testing framework currently implemented
- **Testing Philosophy**: Manual testing through development environment
- **Edge Functions**: Local testing using Supabase CLI with `supabase functions serve`
- **Email Testing**: Dedicated `test-email` Edge Function for testing email functionality
- **Environment Testing**: Separate local and production configurations

## 4. Code Style
- **TypeScript**: Strict typing with interfaces for all data structures (Warranty, OcrData, Category)
- **React Patterns**: Functional components with hooks, Context API for state management
- **Naming Conventions**:
  - Files: PascalCase for components (`WarrantyCard.tsx`), camelCase for services (`warrantyService.ts`)
  - Components: PascalCase (`AddWarrantyModal`, `SafeImage`)
  - Functions: camelCase (`signIn`, `updateUserPassword`, `trackPageView`)
  - Constants: camelCase for regular constants, UPPER_CASE for environment variables
- **Error Handling**: Consistent error objects with `{ error: AuthError | null }` pattern
- **Async/Await**: Preferred over Promises for async operations
- **Date Handling**: Use `toLocaleDateString()` for user-facing date displays, ISO strings for storage

## 5. Common Patterns
- **Service Layer Pattern**: All external API calls abstracted into service files
- **Context + Provider Pattern**: Global state management using React Context
- **Modal Pattern**: Consistent modal structure with backdrop, close handlers, and form validation
- **Error Boundary Pattern**: Configuration error screens for missing environment variables
- **Route Protection**: Authentication-based route guards in main App component
- **Loading States**: Consistent spinner component usage during async operations
- **Conditional Rendering**: Extensive use of ternary operators and logical AND for UI states

## 6. Do's and Don'ts
### ✅ Do's
- Always check for `supabase` client existence before making calls
- Use TypeScript interfaces for all data structures
- Implement proper error handling with consistent error object patterns
- Use the Context API for global state that needs to be shared across components
- Validate environment variables and show configuration errors when missing
- Use semantic HTML and proper accessibility attributes
- Implement proper loading states for all async operations
- Use the service layer for all external API interactions

### ❌ Don'ts
- Don't make direct Supabase calls from components - use service functions
- Don't ignore TypeScript errors or use `any` type
- Don't hardcode sensitive data - use environment variables
- Don't forget to handle loading and error states in UI components
- Don't bypass authentication checks for protected routes
- Don't use inline styles - prefer CSS classes and Tailwind utilities
- Don't forget to clean up subscriptions and event listeners in useEffect

## 7. Tools & Dependencies
- **Frontend Framework**: React 18.3.1 with TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0 with custom configuration for environment variables
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **AI Integration**: Google Gemini API for OCR processing
- **Styling**: Tailwind CSS (implied from class usage)
- **Animation**: Framer Motion 11.3.19
- **Analytics**: Vercel Analytics
- **Email**: SendGrid API (via Edge Functions)
- **Development**: Node.js with npm, Supabase CLI for local development

## 8. Other Notes
- **Environment Variables**: Critical for Supabase connection, Gemini API, and captcha services
- **Authentication Flow**: Supports email/password, Google OAuth, and GitHub OAuth
- **File Upload**: Images stored in Supabase Storage with proper access controls
- **Rate Limiting**: Custom rate limiter implementation for authentication attempts
- **Deployment**: Configured for Vercel with automatic redeployment scripts
- **Database Schema**: Uses RLS (Row Level Security) policies for data protection
- **Edge Functions**: Server-side logic for email reminders and testing
- **Sharing Feature**: UUID-based secure sharing with public read access
- **Client-Side Routing**: Custom routing implementation without external router library
- **Error Recovery**: Graceful degradation when services are unavailable
- **Performance**: Speed insights integration and optimized image loading with SafeImage component