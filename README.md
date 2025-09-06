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

