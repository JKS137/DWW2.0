import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// Allow TypeScript to compile in non-Deno editors
// (Supabase Edge Functions run on Deno and provide Deno.env at runtime)
// deno-lint-ignore no-explicit-any
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function sendWithResend(apiKey: string, from: string, to: string, subject: string, html: string, text: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error ${res.status}: ${body}`);
  }
}

async function sendWithSendgrid(apiKey: string, from: string, to: string, subject: string, html: string, text: string) {
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: to }],
          subject,
        },
      ],
      from: { email: from, name: 'Digital Warranty Vault' },
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html', value: html },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`SendGrid error ${res.status}: ${JSON.stringify(body)}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const isJson = req.headers.get('content-type')?.includes('application/json');
    const body = isJson ? await req.json().catch(() => ({})) : {};

    const senderEmail = Deno.env.get('SENDER_EMAIL');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');

    if (!senderEmail) {
      throw new Error('Missing SENDER_EMAIL secret. Set it in Supabase project settings (Edge Functions secrets).');
    }

    const to = body.to || url.searchParams.get('to') || senderEmail;
    const subject = body.subject || 'Test email from Digital Warranty Vault';
    const text = body.text || `This is a test email. Sent at ${new Date().toISOString()}.`;
    const html =
      body.html ||
      `<div style="font-family:sans-serif;line-height:1.6"><h2>Test Email</h2><p>This is a test email from <strong>Digital Warranty Vault</strong>.</p><p>Sent at ${new Date().toISOString()}.</p></div>`;
    const provider: 'resend' | 'sendgrid' | undefined = body.provider;

    if (!resendApiKey && !sendgridApiKey) {
      throw new Error('No email provider configured. Provide RESEND_API_KEY or SENDGRID_API_KEY in secrets.');
    }

    if (provider === 'resend') {
      if (!resendApiKey) throw new Error('RESEND_API_KEY not set.');
      await sendWithResend(resendApiKey, senderEmail, to, subject, html, text);
    } else if (provider === 'sendgrid') {
      if (!sendgridApiKey) throw new Error('SENDGRID_API_KEY not set.');
      await sendWithSendgrid(sendgridApiKey, senderEmail, to, subject, html, text);
    } else if (resendApiKey) {
      await sendWithResend(resendApiKey, senderEmail, to, subject, html, text);
    } else if (sendgridApiKey) {
      await sendWithSendgrid(sendgridApiKey, senderEmail, to, subject, html, text);
    }

    const response = { message: 'Test email queued successfully', to, provider: provider || (resendApiKey ? 'resend' : 'sendgrid') };
    return new Response(JSON.stringify(response), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  } catch (err: any) {
    const error = { error: err?.message || 'Unknown error' };
    return new Response(JSON.stringify(error), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  }
});

