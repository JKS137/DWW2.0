# Integration Architecture - Visual Reference Guide

## Current Architecture (As-Is)

```
┌─────────────────────────────────────────────────────────────────┐
│                        USERS' BROWSERS                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ React App (TypeScript, Tailwind CSS, Framer Motion)      │   │
│  │                                                            │   │
│  │  • Landing Page      • Dashboard      • Auth Flow        │   │
│  │  • Upload Receipt    • Warranty List  • Sharing          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────┬────────────────────────────────────────────────────────┘
          │
          │ HTTP/HTTPS
          │
┌─────────▼────────────────────────────────────────────────────────┐
│                    EDGE & CDN LAYER                               │
│                   (Vercel / Cloudflare)                           │
│  ✓ SPA Hosting  ✓ Static Assets  ✓ Caching                       │
└─────────┬────────────────────────────────────────────────────────┘
          │
          │ REST API Calls
          │
    ┌─────▼──────────────────────────────────────────────┐
    │          SUPABASE PLATFORM                          │
    │  ┌──────────────────────────────────────────────┐  │
    │  │ Supabase Auth (JWT)                          │  │
    │  │ • Google OAuth  • GitHub OAuth  • Email/Pass│  │
    │  └──────────────────────────────────────────────┘  │
    │  ┌──────────────────────────────────────────────┐  │
    │  │ PostgreSQL Database                          │  │
    │  │ • Warranties  • Users  • Shared Warranties   │  │
    │  │ • Notifications  • Profiles  • Subscriptions*│  │
    │  └──────────────────────────────────────────────┘  │
    │  ┌──────────────────────────────────────────────┐  │
    │  │ Supabase Storage (S3)                        │  │
    │  │ • Receipt Images  • PDFs*                    │  │
    │  └──────────────────────────────────────────────┘  │
    │  ┌──────────────────────────────────────────────┐  │
    │  │ Edge Functions (Deno)                        │  │
    │  │ • reminder-checker (Daily emails)            │  │
    │  │ • test-email (Email testing)                 │  │
    │  │ • stripe-webhook* (Payment events)           │  │
    │  │ • sendgrid-webhook* (Bounce handling)        │  │
    │  └──────────────────────────────────────────────┘  │
    └─────┬──────────────────────────────────────────────┘
          │
    ┌─────┴────────────────────────────────────────────────┐
    │        EXTERNAL API SERVICES                          │
    │                                                        │
    │  ✓ Google Gemini AI (OCR)                            │
    │    └─ Extract warranty details from receipts         │
    │                                                        │
    │  ✓ SendGrid / Resend (Email)                        │
    │    └─ Send reminder emails                           │
    │                                                        │
    │  ✓ Google Analytics (Analytics)                     │
    │    └─ Page views, user tracking                      │
    │                                                        │
    │  ✓ Google OAuth & GitHub (Auth)                     │
    │    └─ Social login                                   │
    │                                                        │
    │  ❌ Stripe (Payments) - NOT INTEGRATED              │
    │  ❌ Sentry (Errors) - NOT INTEGRATED                │
    │  ❌ Intercom (Support) - NOT INTEGRATED             │
    │                                                        │
    └────────────────────────────────────────────────────────┘

Legend: ✓ = Implemented | ❌ = Missing | * = Needs implementation
```

---

## Recommended Architecture (To-Be)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USERS' BROWSERS                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ React App + Sentry + Intercom                                 │  │
│  │                                                                 │  │
│  │  • Landing Page  • Dashboard  • Auth  • Notifications*        │  │
│  │  • Checkout*     • Subscription Mgmt*  • Sharing             │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────┬────────────────────────────────────────────────────────────┘
          │
          │ HTTP/HTTPS
          │
┌─────────▼────────────────────────────────────────────────────────────┐
│                    EDGE & CDN LAYER                                   │
│                  (Vercel with Analytics)                              │
│  ✓ SPA Hosting  ✓ Static Assets  ✓ Caching  ✓ Performance tracking  │
│  ✓ CI/CD Pipeline  ✓ Automated Tests  ✓ Security Scanning           │
└─────────┬────────────────────────────────────────────────────────────┘
          │
          │ REST API Calls + Webhooks
          │
    ┌─────▼──────────────────────────────────────────────────────┐
    │           SUPABASE PLATFORM (ENHANCED)                      │
    │  ┌────────────────────────────────────────────────────────┐ │
    │  │ Supabase Auth (JWT + Rate Limiting)                    │ │
    │  │ • Google OAuth  • GitHub OAuth  • CAPTCHA              │ │
    │  │ • 30-second login cooldown (exists)                    │ │
    │  │ • API rate limiting (NEW)                              │ │
    │  └────────────────────────────────────────────────────────┘ │
    │  ┌────────────────────────────────────────────────────────┐ │
    │  │ PostgreSQL Database (Enhanced Schema)                  │ │
    │  │ • Warranties  • Users  • Shared Warranties             │ │
    │  │ • Notifications  • Profiles                            │ │
    │  │ • Subscriptions (NEW)  • Invoices (NEW)                │ │
    │  │ • Payment Events (NEW) • Invalid Emails (NEW)          │ │
    │  │ • User Notification Prefs (NEW)                        │ │
    │  │ • API Rate Limits Audit (NEW)                          │ │
    │  └────────────────────────────────────────────────────────┘ │
    │  ┌────────────────────────────────────────────────────────┐ │
    │  │ Supabase Storage + Backup                              │ │
    │  │ • Receipt Images  • PDFs (Invoices)                    │ │
    │  │ • Automated backups  • Point-in-time recovery          │ │
    │  └────────────────────────────────────────────────────────┘ │
    │  ┌────────────────────────────────────────────────────────┐ │
    │  │ Edge Functions (Enhanced)                              │ │
    │  │ • reminder-checker (with retries)                      │ │
    │  │ • test-email                                           │ │
    │  │ • stripe-webhook* (NEW)                                │ │
    │  │ • sendgrid-webhook* (NEW - bounce handling)            │ │
    │  │ • task-processor* (NEW - async jobs)                   │ │
    │  │ • notification-dispatcher* (NEW)                       │ │
    │  │ • ocr-processor* (NEW - async OCR)                     │ │
    │  └────────────────────────────────────────────────────────┘ │
    └─────┬────────────────────────────────────────────────────────┘
          │
    ┌─────┴────────────────────────────────────────────────────────┐
    │      SUPPORTING INFRASTRUCTURE (NEW)                          │
    │                                                                │
    │  Redis Cache* (Task Queue + Rate Limiting)                   │
    │  └─ Bull Queue for async jobs                                │
    │  └─ Job retries with exponential backoff                     │
    │                                                                │
    │  Monitoring & Observability*                                 │
    │  ├─ Sentry (Error tracking + Session replay)                │
    │  ├─ Custom analytics dashboard                               │
    │  ├─ Performance monitoring                                   │
    │  └─ Slack integration for alerts                             │
    │                                                                │
    │  Message Queue Backends*                                      │
    │  ├─ Email queue (reliable sending)                           │
    │  ├─ OCR queue (scalable processing)                          │
    │  └─ Notification queue (real-time)                           │
    │                                                                │
    └────────────────────────────────────────────────────────────────┘
          │
    ┌─────▼────────────────────────────────────────────────────────────┐
    │        EXTERNAL API SERVICES (EXPANDED)                           │
    │                                                                    │
    │  ✓ Google Gemini AI (OCR) - With retry logic*                   │
    │    └─ Extract warranty details with fallback to manual entry    │
    │                                                                    │
    │  ✓ SendGrid / Resend (Email) - With bounce handling*            │
    │    └─ Warranty reminders, password reset, verification          │
    │    └─ Webhook for bounce/complaint events                       │
    │                                                                    │
    │  ✓ Google Analytics (Analytics) - Enhanced event tracking*      │
    │    └─ Page views, custom events, conversion tracking            │
    │                                                                    │
    │  ✓ Google OAuth & GitHub (Auth)                                │
    │    └─ Social login with account linking*                        │
    │                                                                    │
    │  ✓ Stripe (Payments) * NEW                                      │
    │    └─ Subscribe to plans  ✓ Manage subscriptions               │
    │    └─ Generate invoices   ✓ Handle retries                     │
    │    └─ Webhook for events  ✓ Customer portal                    │
    │                                                                    │
    │  ✓ Sentry (Error Tracking) * NEW                               │
    │    └─ Real-time error alerts  ✓ Session replay                 │
    │    └─ Performance monitoring  ✓ Release tracking               │
    │                                                                    │
    │  ✓ Intercom (Customer Support) * NEW                           │
    │    └─ Live chat support  ✓ Knowledge base                      │
    │    └─ Ticket management  ✓ Automated messages                  │
    │                                                                    │
    │  ✓ Cloudflare (CDN) * NEW (optional)                           │
    │    └─ Global caching  ✓ DDoS protection                        │
    │    └─ Rate limiting    ✓ WAF rules                             │
    │                                                                    │
    └────────────────────────────────────────────────────────────────────┘

Legend: ✓ = Implemented | * = New/Enhanced | ❌ = Not needed for MVP
```

---

## Data Flow Diagrams

### Current: Warranty Upload & OCR

```
User ──→ React UI ─→ Upload Form ─→ Supabase Storage
                                         │
                                         ├→ Save URL to DB
                                         │
                                    User waits...
                                         │
                                    (No async processing)
                                         │
                            Gemini OCR (if user clicks)
                                         │
                                    Extract data
                                         │
                                    Update warranty
                                         │
                            User sees results or error
```

### Recommended: Async OCR Processing

```
User ──→ React UI ─→ Upload Form ─→ Supabase Storage
                                         │
                                         ├→ Create warranty stub
                                         │
                                    Add job to Bull Queue
                                         │
                        User sees "Processing..." message
                                         │
                    Task Worker processes async OCR
                                         │
              ┌──→ Try Gemini API ──→ Extract ──→ Update DB
              │                              │
         Fail │                         Success
              │                              │
         Retry │                    Notify user via
              │                    real-time update
        Backoff │
              │
        3 retries:
        1s, 2s, 4s, 8s
              │
           Failed
              │
        Log error to Sentry
        Notify user
```

### Current: Email Reminders

```
Daily Cron Job (10 AM UTC)
         │
    Query DB for expiring warranties
         │
   For each warranty:
         │
    Send via SendGrid
         │
    (No webhook handling)
         │
    Bounces? Unknown.
    User never knows.
```

### Recommended: Reliable Email Flow

```
Daily Cron Job ─→ Add to Email Queue ──→ Worker
                                           │
                              ┌────────────┴────────────┐
                              │                         │
                         Send via SendGrid        Send via Resend
                              │                         │
                    ┌─────────┴─────────┐     ┌─────────┴─────────┐
                    │                   │     │                   │
                Success            Fail/Retry  Success         Fail/Retry
                    │                   │     │                   │
                Log event          Exponential  Log event    Exponential
                    │              Backoff      │           Backoff
                    │              (0.1s, 0.2s, │           (repeats)
                    │               0.4s, ...)  │
                    │                   │       │
                    ├───────────────────┼───────┤
                                       │
                            Webhook: Event Received
                                       │
                    ┌──────────┬───────┴────────┬──────────┐
                    │          │               │          │
                Delivered  Bounced      Complained    Spam
                    │          │               │
                Update    Add to           Remove
                Status    Unsubscribe      from sends
                    │      List             │
                Success  Remove and       Log error
                         Notify user
```

---

## Integration Timeline

### Week 1: Foundations
```
┌─────────────────────────────────────────────────────────────┐
│                    STABILIZATION PHASE                       │
├─────────────────────────────────────────────────────────────┤
│ Mon  Tue  Wed  Thu  Fri  Sat  Sun                           │
├─────────────────────────────────────────────────────────────┤
│ □     □    ✓    ✓    ✓           Sentry Integration         │
│ □     ✓    ✓    ✓    ✓           Rate Limiting              │
│ ✓     ✓    ✓    ✓    □           Email Bounces              │
│ ✓     ✓    ✓    ✓    ✓           CI/CD Pipeline             │
├─────────────────────────────────────────────────────────────┤
│ Deliverable: Error tracking, protected APIs                │
└─────────────────────────────────────────────────────────────┘
```

### Weeks 2-3: Monetization
```
┌──────────────────────────────────────────────────────────────┐
│                   MONETIZATION PHASE                          │
├──────────────────────────────────────────────────────────────┤
│  Week 2 (Mon-Fri)     Week 3 (Mon-Fri)                      │
│ ┌────────────────┐   ┌────────────────┐                     │
│ │ Stripe Setup   │   │ Stripe Setup   │                     │
│ │ • Accounts     │   │ • Webhooks     │                     │
│ │ • Products     │   │ • Testing      │                     │
│ │ • Checkout     │   │ • Error Handle │                     │
│ │ • Database     │   │ • Retries      │                     │
│ └────────────────┘   └────────────────┘                     │
│ ┌────────────────┐   ┌────────────────┐                     │
│ │ Task Queue     │   │ Task Queue     │                     │
│ │ • Redis setup  │   │ • Testing      │                     │
│ │ • Bull config  │   │ • Monitoring   │                     │
│ │ • Jobs design  │   │ • Deployment   │                     │
│ └────────────────┘   └────────────────┘                     │
│ ┌────────────────┐   ┌────────────────┐                     │
│ │ Support Tools  │   │ Testing & QA   │                     │
│ │ • Intercom     │   │ • Integration  │                     │
│ │ • Settings     │   │ • Load test    │                     │
│ │ • Config       │   │ • Go-live plan │                     │
│ └────────────────┘   └────────────────┘                     │
├──────────────────────────────────────────────────────────────┤
│ Deliverable: Full payment processing, async tasks           │
└──────────────────────────────────────────────────────────────┘
```

### Weeks 4+: Growth
```
┌──────────────────────────────────────────────────────────────┐
│                      GROWTH PHASE                             │
├──────────────────────────────────────────────────────────────┤
│  Week 4           Week 5           Week 6          Week 7+   │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────┐ ┌─────────┐ │
│ │ In-App       │ │ Analytics    │ │ Perf     │ │ Optimize │ │
│ │ Notifications│ │ Enhancements │ │ Monitor  │ │ & Scale  │ │
│ │             │ │             │ │         │ │         │ │
│ │ • Realtime  │ │ • Event track│ │ • Metrics│ │ • Retry  │ │
│ │ • Prefs UI  │ │ • Cohorts    │ │ • Alerts │ │ • Cache  │ │
│ │ • Updates   │ │ • Dashboard  │ │ • Logs   │ │ • Index  │ │
│ └──────────────┘ └──────────────┘ └──────────┘ └─────────┘ │
├──────────────────────────────────────────────────────────────┤
│ Deliverable: Data-driven optimization, scale to 1000+ users │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Dependency Graph

```
┌─────────────────────┐
│   App.tsx           │◄────────────── Error Boundary
│  (Main Component)   │               (Error Handling)
└────────┬────────────┘
         │
    ┌────┴────────────────────────────────────────┐
    │                                              │
┌───▼──────┐      ┌──────────────┐     ┌────────┐│
│ Pages    │      │  Components  │     │Context ││
├──────────┤      ├──────────────┤     ├────────┤│
│• Landing │      │• Dashboard   │     │• Auth  ││
│• Login   │      │• Cards       │     │• Warranty
│• Dash    │      │• Forms       │     │        │
│• Detail  │      │• Modals      │     │        │
└────┬─────┘      └──────┬───────┘     └───┬────┘
     │                   │                  │
     └───────────────────┼──────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ┌───▼────┐      ┌────▼─────┐    ┌───▼────┐
    │Services │      │  Utils   │    │  Types │
    ├────────┤      ├──────────┤    ├────────┤
    │• Warranty
    │• Gemini │      │• Supabase│    │• Warranty
    │• Stripe*│      │• Date    │    │• User
    │• Email  │      │• Format  │    │
    │• Auth   │      │          │    │
    └────┬───┘      └──────────┘    └────────┘
         │
    ┌────▼──────────────────────┐
    │   External Services       │
    ├──────────────────────────┤
    │ ✓ Supabase      ✓ Stripe*│
    │ ✓ Gemini        ✓ Sentry*│
    │ ✓ SendGrid      ✓ GA     │
    │ ✓ OAuth         ✓ Intercom*
    └──────────────────────────┘

* = New/To be added
```

---

## Risk Heatmap

```
                    IMPACT (High ↑)
                         │
        CRITICAL          │        CRITICAL
        │                 │           │
        ├─ No Payments    │    ├─ No Error Track
        │  (Monetization) │    │  (Production)
        │                 │    │
        ├─ No Queue       │    ├─ No Rate Limits
        │  (Reliability)  │    │  (Security)
        │                 │    │
        ├─ Email Issues   │    └─ No Support
        │  (UX)           │       (Growth)
        │                 │
  HIGH  ├─────────────────┼─────────────────┐ HIGH
  │     │                 │                 │  │
  │     ├─ Analytics*     │    ├─ Monitoring
  │     │  (Growth)       │    │  (Ops)
  │     │                 │    │
  │     ├─ CI/CD*         │    ├─ Perf Track
  │     │  (Ops)          │    │  (Growth)
  │     │                 │    │
  PROB  ├─ Notifications* │    ├─ Webhooks
  │     │  (UX)           │    │  (Scaling)
  │     │                 │    │
  │     ├─ CRM            │    ├─ SMS
  │     │  (Future)       │    │  (Enhancement)
  │     │                 │    │
  LOW   └─────────────────┼─────────────────┘ LOW
        LOW         PROBABILITY (High →)
```

---

## Service Integration Costs

```
SERVICE              TIER        COST/MONTH    WHEN
─────────────────────────────────────────────────────
Vercel               Hobby       Free          Now ✓
Google Analytics     Free        Free          Now ✓
SendGrid             Free        Free (100/d)  Now ✓
Supabase             Free        Free (500MB)  Now ✓
─────────────────────────────────────────────────────
Sentry               Pro         $29           Week 1
Redis                Basic       $6-15         Week 2
Stripe               Standard    2.9% + $0.30  Week 2
Intercom             Basic       $63           Week 3
─────────────────────────────────────────────────────
Total Recurring:                 $100-108 + Stripe %

BREAKEVEN POINT: $200/month in subscriptions
(67% take-home rate assumed)

PROFIT AT:
$300/month → $134 profit
$500/month → $234 profit
$1000/month → $584 profit
```

---

## Decision Tree: Which Integration First?

```
START
  │
  ├─ Need production-ready app?
  │  YES → Start with Sentry (Week 1)
  │  │      └─ Error tracking is CRITICAL foundation
  │  │
  │  └─ Need to monetize?
  │     YES → Start with Stripe (Week 2)
  │     │     └─ Pricing page needs backing
  │     │
  │     NO → Start with analytics (Week 3)
  │          └─ Understand user behavior first
  │
  ├─ Already have payment processing?
  │  YES → Skip to customer support (Week 4)
  │  │     └─ Add Intercom for user help
  │  │
  │  NO → Do Stripe first (Week 2)
  │       └─ Required for monetization
  │
  ├─ Users having crashes?
  │  YES → Add Sentry immediately (Priority 1)
  │  │     └─ Prevents revenue loss
  │  │
  │  NO → Add rate limiting (Priority 2)
  │       └─ Prevents API abuse
  │
  ├─ Need to scale?
  │  YES → Add task queue (Priority 1)
  │  │     └─ Prevents crashing at scale
  │  │
  │  NO → Can defer to later
  │       └─ Safe at current user count

END
```

---

## Success Metrics Dashboard

```
PHASE 1 SUCCESS (Week 2)
├─ Error Visibility
│  ├─ 100% of production errors in Sentry
│  ├─ Sentry dashboard accessible
│  └─ Slack alerts configured
├─ API Protection
│  ├─ Rate limits active
│  ├─ No abuse detected
│  └─ Metrics tracked
├─ CI/CD
│  ├─ All tests passing
│  ├─ Deployments automated
│  └─ Rollback time < 5 min
└─ Email Quality
   ├─ Bounces < 2%
   ├─ Deliverability > 95%
   └─ Complaints < 0.1%

PHASE 2 SUCCESS (Week 6)
├─ Payment Processing
│  ├─ First paid subscription received
│  ├─ Churn rate tracking
│  └─ Subscription > 10 active
├─ Task Queue
│  ├─ Email success > 99%
│  ├─ OCR processing reliable
│  └─ Retry logic working
└─ Support
   ├─ Support tickets < 1 hour response
   ├─ User satisfaction > 4.0/5
   └─ CSAT score tracked

PHASE 3 SUCCESS (Week 9)
├─ Growth Metrics
│  ├─ MAU > 50
│  ├─ Retention > 60% after month 1
│  └─ Revenue > $200/month
├─ Technical Health
│  ├─ Uptime > 99.5%
│  ├─ Error rate < 0.5%
│  └─ Page load < 2s
└─ User Experience
   ├─ Net promoter score > 40
   ├─ Feature adoption > 70%
   └─ Support volume handled
```

---

**Ready to build!** Start with Phase 1 next week. 🚀
