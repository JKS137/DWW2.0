import { createClient } from '@supabase/supabase-js';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// Fix: Add declare for Deno to satisfy TypeScript linter in non-Deno environments.
declare const Deno: any;

// Define the shape of the data we expect from the 'warranties' and 'profiles' tables
interface Warranty {
  id: string;
  product_name: string;
  expiry_date: string;
  user_id: string;
  // Fix: The Supabase query for a relationship returns an array of objects, so the type is updated to reflect that.
  profiles: {
    email: string;
  }[] | null;
}

// Function to send an email using the SendGrid API
async function sendReminderEmailSendgrid(apiKey: string, senderEmail: string, recipientEmail: string, productName: string, expiryDate: string, appUrl: string) {
  const emailBody = `
    <div style=\"font-family: sans-serif; line-height: 1.6;\">\r
      <h2>Warranty Reminder</h2>\r
      <p>Hi there,</p>\r
      <p>This is a friendly reminder that your warranty for <strong>${productName}</strong> is expiring soon on <strong>${new Date(expiryDate).toLocaleDateString()}</strong>.</p>\r
      <p>You can view the details by visiting your dashboard:</p>\r
      <p><a href=\"${appUrl}\" style=\"display: inline-block; padding: 10px 15px; background-color: #007aff; color: white; text-decoration: none; border-radius: 5px;\">Go to Digital Warranty Vault</a></p>\r
      <p>Thanks,<br/>The Digital Warranty Vault Team</p>\r
    </div>\r
  `;

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: recipientEmail }],
        subject: `Your warranty for ${productName} is expiring soon!`,
      }],
      from: { email: senderEmail, name: "Digital Warranty Vault" },
      content: [{
        type: 'text/html',
        value: emailBody,
      }],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(`SendGrid API error: ${response.statusText} - ${JSON.stringify(errorBody)}`);
  }
  
  console.log(`[SendGrid] Email sent successfully to ${recipientEmail} for product ${productName}.`);
}

// Function to send an email using the Resend API
async function sendReminderEmailResend(apiKey: string, senderEmail: string, recipientEmail: string, productName: string, expiryDate: string, appUrl: string) {
  const html = `
    <div style=\"font-family: sans-serif; line-height: 1.6;\">\r
      <h2>Warranty Reminder</h2>\r
      <p>Hi there,</p>\r
      <p>This is a friendly reminder that your warranty for <strong>${productName}</strong> is expiring soon on <strong>${new Date(expiryDate).toLocaleDateString()}</strong>.</p>\r
      <p>You can view the details by visiting your dashboard:</p>\r
      <p><a href=\"${appUrl}\" style=\"display: inline-block; padding: 10px 15px; background-color: #007aff; color: white; text-decoration: none; border-radius: 5px;\">Go to Digital Warranty Vault</a></p>\r
      <p>Thanks,<br/>The Digital Warranty Vault Team</p>\r
    </div>\r
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: senderEmail,
      to: [recipientEmail],
      subject: `Your warranty for ${productName} is expiring soon!`,
      html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend API error: ${response.status} - ${errorBody}`);
  }

  console.log(`[Resend] Email sent successfully to ${recipientEmail} for product ${productName}.`);
}

serve(async (_req) => {
  try {
    // 1. Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const senderEmail = Deno.env.get('SENDER_EMAIL');
    const appUrl = Deno.env.get('APP_URL') ?? 'https://yourapp.com'; // Fallback URL

    if (!supabaseUrl || !serviceRoleKey || !senderEmail) {
        throw new Error('Missing required environment variables (Supabase URL/Key, Sender Email).');
    }
    if (!sendgridApiKey && !resendApiKey) {
        throw new Error('Missing email provider credentials. Provide SENDGRID_API_KEY or RESEND_API_KEY.');
    }

    // 2. Create Supabase client with the service role key for elevated access
    const supabaseClient = createClient(supabaseUrl, serviceRoleKey);

    // 3. Define dates for 30 and 7 days from now
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const thirtyDaysDateString = thirtyDaysFromNow.toISOString().split('T')[0];
    const sevenDaysDateString = sevenDaysFromNow.toISOString().split('T')[0];

    // 4. Fetch warranties expiring on these specific dates, along with the user's email
    const { data: warranties, error: warrantiesError } = await supabaseClient
      .from('warranties')
      .select('id, product_name, expiry_date, user_id, profiles ( email )')
      .in('expiry_date', [thirtyDaysDateString, sevenDaysDateString]);

    if (warrantiesError) throw warrantiesError;
    if (!warranties || warranties.length === 0) {
      return new Response(JSON.stringify({ message: 'No warranties expiring in 7 or 30 days.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // 5. Check which notifications have already been sent to prevent duplicates
    const warrantyIds = warranties.map(w => w.id);
    const { data: existingNotifications, error: notificationsError } = await supabaseClient
      .from('notifications')
      .select('warranty_id')
      .in('warranty_id', warrantyIds);
      
    if (notificationsError) throw notificationsError;
    
    const sentWarrantyIds = new Set(existingNotifications?.map(n => n.warranty_id));
    const warrantiesToSend = warranties.filter(w => !sentWarrantyIds.has(w.id));

    if (warrantiesToSend.length === 0) {
        return new Response(JSON.stringify({ message: 'All expiring warranties already have notifications sent.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // 6. Process and send emails for the filtered warranties
    const emailPromises = [];
    const notificationsToLog = [];

    for (const warranty of warrantiesToSend) {
      // Fix: Access the first element of the profiles array to get the user's email, as Supabase returns an array for relationships.
      const recipientEmail = warranty.profiles?.[0]?.email;
      if (!recipientEmail) {
        console.warn(`Warranty ${warranty.id} is missing a user email. Skipping.`);
        continue;
      }

      if (resendApiKey) {
        emailPromises.push(
          sendReminderEmailResend(
            resendApiKey, senderEmail, recipientEmail,
            warranty.product_name, warranty.expiry_date, appUrl
          )
        );
      } else if (sendgridApiKey) {
        emailPromises.push(
          sendReminderEmailSendgrid(
            sendgridApiKey, senderEmail, recipientEmail,
            warranty.product_name, warranty.expiry_date, appUrl
          )
        );
      }

      notificationsToLog.push({
        warranty_id: warranty.id,
        user_id: warranty.user_id,
        type: 'email',
      });
    }

    // 7. Send all emails concurrently
    await Promise.all(emailPromises);

    // 8. Log all sent notifications to the database in a single batch
    if (notificationsToLog.length > 0) {
        const { error: insertError } = await supabaseClient
            .from('notifications')
            .insert(notificationsToLog);
        if (insertError) throw insertError;
    }

    return new Response(JSON.stringify({ message: `Successfully processed and sent ${emailPromises.length} reminders.` }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('Error in reminder function:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});