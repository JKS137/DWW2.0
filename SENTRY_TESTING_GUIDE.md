# Sentry Integration Testing Guide

## Overview
This guide walks you through testing your Sentry error tracking integration.

---

## Quick Start

### 1. Get Your Sentry DSN
1. Visit [sentry.io](https://sentry.io)
2. Sign up or log in
3. Create a new project → Select "React"
4. Copy your DSN (looks like: `https://xxx@xxx.ingest.us.sentry.io/xxx`)

### 2. Add DSN to `.env.local`
```env
VITE_SENTRY_DSN=https://your-dsn-here@xxx.ingest.us.sentry.io/xxx
```

### 3. Install Dependencies
```bash
npm install @sentry/react @sentry/tracing
```

### 4. Verify Setup
- Check `index.tsx` for Sentry initialization
- Check `App.tsx` for Sentry error boundary
- Check `.env.local` for VITE_SENTRY_DSN

---

## Testing Methods

### Method 1: Use SentryTestButton Component
Add to any page for quick testing:

```tsx
import SentryTestButton from '@/components/SentryTestButton';

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <SentryTestButton />
    </div>
  );
}
```

**Available Tests:**
- **Test Error** - Throws an exception (red button)
- **Test Message** - Sends info message (blue button)
- **Test Warning** - Sends warning message (yellow button)

### Method 2: Manual Testing in Browser Console
```javascript
// Throw an error
throw new Error('Manual test error');

// Send a message
Sentry.captureMessage('Test message', 'info');

// Capture an exception
try {
  throw new Error('Test exception');
} catch (e) {
  Sentry.captureException(e);
}
```

### Method 3: Test Via Service Functions
```typescript
import { captureMessage, addBreadcrumb } from '@/services/sentryService';

// Send message
captureMessage('Test from service', 'info');

// Add breadcrumb
addBreadcrumb('User performed action', 'test');

// Capture error
import { captureException } from '@/services/sentryService';
try {
  // some code
} catch (error) {
  captureException(error, { context: 'test' });
}
```

---

## Verification Checklist

After testing, verify these in Sentry dashboard:

- [ ] **Events appear in Sentry dashboard** (Issues tab)
- [ ] **Correct project selected** in Sentry
- [ ] **Release version shown** (should match package.json version)
- [ ] **Environment labeled** (development/production)
- [ ] **User context captured** (if logged in)
- [ ] **Breadcrumbs visible** in event details
- [ ] **Source map available** (if configured)
- [ ] **Slack notifications working** (if configured)

---

## Troubleshooting

### Events Not Appearing in Sentry
1. **Wrong DSN?** Check `.env.local` - must start with `https://`
2. **Not initialized?** Check `index.tsx` - Sentry.init() must be first
3. **CORS issue?** Check browser console for errors
4. **Sample rate too low?** Check `index.tsx` - tracesSampleRate should be 1.0 in dev

### DSN Not Loading
```bash
# Check environment variable
echo $env:VITE_SENTRY_DSN  # PowerShell
```

### Events Showing "404 Not Found"
- DSN is incorrect or expired
- Project deleted in Sentry
- Organization has been downgraded

---

## Sample Error Responses

### Successful Error Capture
```json
{
  "event_id": "1234567890abcdef",
  "timestamp": "2025-10-30T12:34:56.789Z",
  "level": "error",
  "message": "This is a test error from Sentry integration!",
  "environment": "development",
  "release": "0.0.0"
}
```

### With Breadcrumbs
```json
{
  "breadcrumbs": [
    {
      "timestamp": "2025-10-30T12:34:55.000Z",
      "category": "test",
      "message": "User clicked error test button",
      "level": "info"
    }
  ]
}
```

### With User Context
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

---

## Configuration Reference

### Sample Rates (in `index.tsx`)

```typescript
Sentry.init({
  // Development: capture everything
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,  // Always capture on error
});
```

**What this means:**
- **Development**: 100% of traces captured
- **Production**: 10% of traces (to save quota)
- **Errors**: Always captured with session replay

### Available Integrations

```typescript
integrations: [
  new BrowserTracing(),        // Performance monitoring
  new Sentry.Replay({          // Session replay
    maskAllText: true,          // Don't capture user text
    blockAllMedia: true,        // Don't capture images/video
  }),
]
```

---

## Next Steps

1. ✅ **Complete Testing**: Run all 3 test methods above
2. ✅ **Monitor Dashboard**: Check Sentry dashboard for events
3. ✅ **Set Up Alerts**: Configure Sentry alerts for critical errors
4. ✅ **Configure Release Tracking**: Add version to Sentry releases
5. ✅ **Enable Source Maps**: Upload source maps for better stack traces

---

## Service Functions Reference

### `sentryService.ts` Functions

| Function | Purpose | Example |
|----------|---------|---------|
| `captureException()` | Capture an error | `captureException(new Error('test'))` |
| `captureMessage()` | Send a message | `captureMessage('Test', 'info')` |
| `setUserContext()` | Track logged-in user | `setUserContext(userId, email)` |
| `clearUserContext()` | Remove user tracking | `clearUserContext()` |
| `addBreadcrumb()` | Add action trail | `addBreadcrumb('User clicked', 'ui')` |
| `captureApiError()` | Log API failures | `captureApiError(err, '/api/path', 'GET')` |
| `captureOCRError()` | Log OCR failures | `captureOCRError(err, 'file.jpg')` |
| `captureAuthError()` | Log auth failures | `captureAuthError(err, 'signIn')` |

---

## Performance Considerations

- **Sentry overhead**: < 50KB minified
- **Sampling**: Set sample rates to avoid quota overages
- **Replays**: Only captured on error to save storage
- **Breadcrumbs**: Limited to 100 per event

---

## Security Notes

- ✅ **DSN is public** - Safe to commit to repo (cannot be exploited)
- ✅ **PII masked** - User text blocked, personal data not sent
- ✅ **Source maps**: Optional, improves debugging without exposing code
- ⚠️ **Sensitive data**: Don't use Sentry.setContext() for passwords/tokens

---

## Pricing Reminder

**Free Tier (Sentry.io):**
- 5,000 events/month
- 5 releases tracked
- 1 GB session replays
- Plenty for testing and small apps

**When upgrading (if needed):**
- $29/month: 100K events + advanced features
- $99/month: 1M events + team collaboration

---

**Ready to test?** Start with the SentryTestButton! 🚀
