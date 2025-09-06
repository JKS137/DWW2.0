# Digital Warranty Vault

A web application to store, manage, and track your product warranties. Simply upload a photo of your receipt, and the app uses AI to automatically extract product details and expiry dates, keeping all your warranties organized in one secure place.

## ✨ Features

- **AI-Powered OCR**: Automatically extracts product name, purchase date, and warranty duration from receipt images using Google's Gemini AI.
- **Secure Authentication**: User accounts and authentication managed by Supabase Auth.
- **Cloud Storage**: Receipts are securely stored in Supabase Storage.
- **Dashboard**: View all your warranties in a clean grid or list format.
- **Search & Filtering**: Instantly search by product name and filter by status (Active/Expired) or category.
- **Visual Alerts**: Warranties that are expiring soon or have expired are visually highlighted.
- **Automated Email Reminders**: A daily cron job sends email reminders via SendGrid for warranties expiring in 30 or 7 days.
- **CRUD Operations**: Full support for creating, reading, updating, and deleting warranties.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **AI**: Google Gemini API
- **Email**: SendGrid API

## 🚀 Getting Started

### 1. Project Setup

The project is designed to run in a web-based development environment that provides the necessary environment variables.

- **Supabase URL & Anon Key**: The app connects to a Supabase project using a pre-configured URL and Anon Key.
- **Google Gemini API Key**: The `API_KEY` for the Gemini AI service is also provided by the environment.

No local setup is required if you are running the app in its intended environment.

### 2. Automated Email Reminders

The application includes a Supabase Edge Function that runs daily to send email reminders for expiring warranties.

#### How It Works

- The function `reminder-checker` queries the database for all warranties expiring in exactly 30 days or 7 days.
- It checks the `notifications` table to ensure a reminder hasn't already been sent for each specific warranty.
- It uses the SendGrid API to send a formatted HTML email to the user.
- After successfully sending an email, it logs a record in the `notifications` table to prevent duplicates.

#### Configuration

To enable the reminder function, you must set the following secrets in your Supabase project dashboard under **Project Settings > Edge Functions**:

1.  Click **Add new secret**.
2.  Add the following secrets:
    - `SUPABASE_SERVICE_ROLE_KEY`: Your project's `service_role` key. Found in **Project Settings > API**. This is required for the function to have the necessary permissions to query all user data.
    - `SENDGRID_API_KEY`: Your API key from your SendGrid account.
    - `SENDER_EMAIL`: The verified email address you want to send reminders from (e.g., `noreply@yourdomain.com`).
    - `APP_URL`: The public URL of your application (e.g., `https://your-project-ref.supabase.co`) to include in the email link.

#### Deploying the Function

Deploy the function to your Supabase project using the Supabase CLI:

```bash
supabase functions deploy reminder-checker
```

#### Scheduling the Function (Cron Job)

You can schedule the function to run daily using `pg_cron` in the Supabase dashboard.

1.  Go to **Database > Extensions** and enable `pg_cron`.
2.  Go to the **SQL Editor** and run the following query to schedule the function to run once every day at 10:00 AM UTC:

```sql
SELECT cron.schedule(
    'daily-warranty-reminder', -- a unique name for your cron job
    '0 10 * * *', -- cron syntax for "at 10:00 AM every day"
    $$
    SELECT net.http_post(
        url:='https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/reminder-checker',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer <YOUR_SUPABASE_ANON_KEY>"}'::jsonb,
        body:='{}'::jsonb
    )
    $$
);
```
**Important**: Replace `<YOUR_PROJECT_REF>` and `<YOUR_SUPABASE_ANON_KEY>` with your actual project reference ID and anon key from your Supabase API settings.

#### Testing Locally

You can test the function locally using the Supabase CLI:

```bash
# Start the local Supabase services
supabase start

# Set the required secrets for local testing
supabase secrets set --env-file ./supabase/functions/.env.local

# Serve the function locally
supabase functions serve reminder-checker

# You can then invoke the function using cURL or another tool.
```
Your `.env.local` file should look like this:
```
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SENDGRID_API_KEY=...
SENDER_EMAIL=...
APP_URL=http://localhost:3000
```
