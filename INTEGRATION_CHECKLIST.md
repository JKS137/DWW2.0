# Integration Implementation Checklist & Quick Reference

## Critical Path (Do These First)

### Week 1: Stabilization
- [ ] **Sentry Error Tracking** ⏱️ 4-6 hrs
  - [ ] Create Sentry.io account
  - [ ] Install SDK: `npm install @sentry/react`
  - [ ] Add DSN to environment variables
  - [ ] Wrap App component with `Sentry.withProfiler`
  - [ ] Set up Slack integration
  - [ ] Create error dashboard
  - **Files to modify**: `App.tsx`, `.env.example`
  - **Cost**: $29/month

- [ ] **Server-Side Rate Limiting** ⏱️ 4-6 hrs
  - [ ] Create `services/rateLimiter.ts` (see analysis)
  - [ ] Add rate limiting to `/gemini-ocr` endpoint
  - [ ] Add rate limiting to `/email-send` endpoint
  - [ ] Add rate limiting to `/warranty-create` endpoint
  - [ ] Return 429 status code on limit exceeded
  - [ ] Track rate limit metrics in Sentry
  - **Files to modify**: `services/*.ts`, Edge functions
  - **Cost**: Free

- [ ] **Email Bounce Handling** ⏱️ 6-8 hrs
  - [ ] Create `invalid_emails` table in Supabase
  - [ ] Create `sendgrid-webhook` Edge Function
  - [ ] Implement webhook handler for bounce events
  - [ ] Automatically remove bounced emails from sends
  - [ ] Notify users of delivery issues
  - [ ] Add bounce metrics to dashboard
  - **Files to create**: `supabase/functions/sendgrid-webhook/`
  - **Cost**: Free

- [ ] **Enhanced CI/CD Pipeline** ⏱️ 6-8 hrs
  - [ ] Create `.github/workflows/test.yml`
  - [ ] Add TypeScript type checking
  - [ ] Add ESLint configuration
  - [ ] Add unit tests (Jest)
  - [ ] Add code coverage reporting
  - [ ] Set up Codecov integration
  - **Files to create**: `.github/workflows/`, `jest.config.js`, `.eslintrc.json`
  - **Cost**: Free

**Week 1 Total**: 20-28 hours | **Cost**: $29/month

---

### Week 2-3: Monetization Foundation
- [ ] **Stripe Payment Integration** ⏱️ 40-60 hrs
  - [ ] Create Stripe account
  - [ ] Define product/price IDs for tiers
  - [ ] Create database tables:
    - [ ] `subscriptions` table
    - [ ] `invoices` table
    - [ ] `payment_events` table
  - [ ] Create `services/stripeService.ts`
  - [ ] Create Stripe webhook handler
  - [ ] Build checkout flow component
  - [ ] Create subscription management UI
  - [ ] Implement plan enforcement
  - [ ] Add invoice generation
  - [ ] Add payment retry logic
  - **Files to create**: 
    - `services/stripeService.ts`
    - `supabase/functions/stripe-webhook/`
    - `supabase/migrations/add_subscriptions_table.sql`
    - Components: `CheckoutFlow.tsx`, `SubscriptionManager.tsx`
  - **Cost**: 2.9% + $0.30/transaction

- [ ] **Async Task Queue (Bull + Redis)** ⏱️ 12-16 hrs
  - [ ] Add Redis connection
  - [ ] Install: `npm install bull redis`
  - [ ] Create `services/taskQueue.ts`
  - [ ] Move email sending to queue
  - [ ] Move OCR processing to queue
  - [ ] Implement retry logic with backoff
  - [ ] Add queue monitoring dashboard
  - [ ] Add metrics/alerting
  - **Files to create**: `services/taskQueue.ts`, `utils/queueMonitor.ts`
  - **Cost**: $6-15/month (Redis hosting)

**Week 2-3 Total**: 52-76 hours | **Cost**: +$6-15/month

---

### Week 4: Customer Success
- [ ] **Customer Support Integration (Intercom)** ⏱️ 2-4 hrs
  - [ ] Create Intercom account
  - [ ] Install: `npm install react-intercom`
  - [ ] Add Intercom component to App
  - [ ] Set up user data tracking
  - [ ] Configure automated messages
  - [ ] Set up team inbox
  - **Files to modify**: `App.tsx`
  - **Cost**: $63/month

**Week 4 Total**: 2-4 hours | **Cost**: +$63/month

---

## Phase 2: Growth Features

### In-App Notifications System ⏱️ 8-12 hrs
- [ ] Create database table: `user_notifications`
- [ ] Create `NotificationCenter` component
- [ ] Implement real-time updates via Supabase subscriptions
- [ ] Add notification preferences UI
- [ ] Add read/unread tracking
- [ ] Create notification service
- **Files to create**: 
  - `components/NotificationCenter.tsx`
  - `services/notificationService.ts`
  - `supabase/migrations/add_notifications_ui_table.sql`
- **Cost**: Free

### Advanced Analytics ⏱️ 6-8 hrs
- [ ] Update `analyticsService.ts` with event tracking
- [ ] Add events for:
  - [ ] Warranty created
  - [ ] OCR processed
  - [ ] Plan upgraded
  - [ ] Shared warranty
  - [ ] Error events
- [ ] Create Google Analytics dashboard
- [ ] Add custom events to Sentry
- [ ] Track user segments
- **Files to modify**: `services/analyticsService.ts`
- **Cost**: Free

### Performance Monitoring ⏱️ 4-6 hrs
- [ ] Add Web Vitals tracking
- [ ] Monitor API latency
- [ ] Track database query performance
- [ ] Create performance dashboard
- [ ] Set up performance alerts
- **Files to create**: `services/performanceService.ts`
- **Cost**: Free (with Sentry Pro)

---

## Environment Variables Checklist

```bash
# Authentication
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# AI
VITE_GEMINI_API_KEY=AIza...

# Storage
VITE_SUPABASE_BUCKET=receipts

# Analytics
VITE_GA_MEASUREMENT_ID=G-...

# CAPTCHA
VITE_CAPTCHA_PROVIDER=turnstile
VITE_TURNSTILE_SITE_KEY=...
VITE_HCAPTCHA_SITE_KEY=...

# Error Tracking
VITE_SENTRY_DSN=https://...@sentry.io/...

# Email
SENDGRID_API_KEY=SG....
RESEND_API_KEY=re_...
SENDER_EMAIL=noreply@...

# Payments
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Redis / Task Queue
REDIS_URL=redis://...

# Intercom
REACT_APP_INTERCOM_ID=...

# Monitoring
SENTRY_AUTH_TOKEN=...
SENTRY_ORG=...
SENTRY_PROJECT=...
```

---

## Package Dependencies to Add

### Phase 1
```bash
npm install @sentry/react @sentry/tracing
npm install bull redis
```

### Phase 2
```bash
npm install stripe
npm install react-intercom
npm install @segment/analytics-next
```

### Testing & QA
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install --save-dev sonarqube-scanner
```

---

## Edge Functions to Create

### Priority 1
```
supabase/functions/
├── sendgrid-webhook/        # Handle bounces, complaints
├── stripe-webhook/          # Handle subscription events
└── task-processor/          # Process async tasks
```

### Priority 2
```
supabase/functions/
├── ocr-processor/           # Async OCR processing
├── email-dispatcher/        # Batch email sending
└── notification-pusher/     # Real-time notifications
```

---

## Database Migrations Needed

### Phase 1
```sql
-- subscriptions table
CREATE TABLE subscriptions (...)

-- invoices table
CREATE TABLE invoices (...)

-- payment_events table (for audit trail)
CREATE TABLE payment_events (...)

-- invalid_emails table
CREATE TABLE invalid_emails (...)
```

### Phase 2
```sql
-- user_notification_preferences
CREATE TABLE user_notification_preferences (...)

-- api_rate_limits (audit log)
CREATE TABLE api_rate_limits (...)

-- performance_metrics
CREATE TABLE performance_metrics (...)
```

---

## Testing Requirements

### Unit Tests
```typescript
// Test services/rateLimiter.ts
// Test services/stripeService.ts
// Test services/taskQueue.ts
// Target: 80%+ coverage
```

### Integration Tests
```typescript
// Test Stripe checkout flow
// Test email sending pipeline
// Test payment webhook handling
// Test subscription status changes
```

### E2E Tests
```typescript
// Test full signup → payment → subscription flow
// Test warranty creation with different plans
// Test plan upgrade/downgrade
```

---

## Monitoring & Alerts Setup

### Sentry Alerts
- [ ] Critical errors (PII in logs)
- [ ] Error rate > 5%
- [ ] Payment processing failures
- [ ] OCR API failures
- [ ] Email send failures

### Slack Channels
- [ ] #errors - all Sentry issues
- [ ] #payments - payment events
- [ ] #ops - uptime & performance
- [ ] #support - customer issues

### Dashboards
- [ ] Real-time error dashboard
- [ ] Payment metrics
- [ ] API usage & rate limits
- [ ] Email delivery stats
- [ ] OCR processing times

---

## Security Checklist

### Before Production Launch
- [ ] All API keys rotated
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Secrets not in git history
- [ ] Encryption for sensitive data
- [ ] Regular security audit scheduled

### Privacy Compliance
- [ ] Privacy policy written and linked
- [ ] GDPR delete endpoint created
- [ ] Data export functionality implemented
- [ ] Cookie consent integrated
- [ ] Data retention policies set
- [ ] Audit logs for data access

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code review completed
- [ ] Security scan passed
- [ ] Performance benchmarks met
- [ ] Database migrations tested
- [ ] Environment variables verified
- [ ] Backups configured

### Deployment
- [ ] Blue-green deployment set up
- [ ] Rollback plan documented
- [ ] Monitoring alerts active
- [ ] On-call rotation ready
- [ ] Incident playbooks created

### Post-Deployment
- [ ] Health checks passing
- [ ] Error rate normal
- [ ] Performance acceptable
- [ ] User testing complete
- [ ] Analytics tracking working

---

## Timeline Summary

```
Week 1:  Sentry + Rate Limiting + CI/CD        20-28 hrs
Week 2:  Stripe Integration (Part 1)            20-30 hrs
Week 3:  Stripe Integration (Part 2) + Queue    20-30 hrs
Week 4:  Customer Support + Testing             10-15 hrs
Week 5+: Advanced Features & Optimization       15-20 hrs
```

**Total**: 75-123 hours (~2-3 months at 10 hrs/week)

---

## Cost Breakdown (Monthly Recurring)

| Service | Cost | Essential? |
|---------|------|-----------|
| Stripe | 2.9% + $0.30/txn | YES |
| SendGrid | $9.95 | YES |
| Sentry | $29 | YES |
| Intercom | $63 | YES |
| Redis | $10 | YES |
| **Total** | **~$112 + Stripe %** | |

**Breakeven**: Need ~$200/month in subscriptions ($120 Starter + $80 Pro)

---

## Questions & Notes

### Before Starting Implementation
1. Have you decided on Stripe vs PayPal vs both?
2. What's your data retention policy for deleted users?
3. Do you need multi-currency support?
4. Should SMS alerts be on roadmap?
5. Who will be on-call for production issues?
6. What's your SLA target (99.9%, 99.95%, etc.)?

### Technical Decisions
1. Store payment data in database or Stripe only?
2. Implement webhooks for real-time updates or polling?
3. Use Bull + Redis or managed service like AWS SQS?
4. Implement feature flags for gradual rollout?
5. What's your incident response time target?

---

## Resources & References

- [Stripe Documentation](https://stripe.com/docs)
- [Sentry Setup Guide](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Bull Queue Docs](https://github.com/OptimalBits/bull)
- [Intercom Integration](https://www.intercom.com/help/en/articles/5589717-install-the-intercom-messenger)
- [GDPR Compliance](https://gdpr-info.eu/)
- [OWASP Security Guide](https://owasp.org/)

---

**Last Updated**: October 30, 2025
**Next Review**: After Phase 1 completion
