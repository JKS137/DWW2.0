import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../services/supabaseClient';

type Data = {
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase client not initialized.' });
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  });

  if (error) {
    console.error('Error resending verification email:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Verification email sent successfully.' });
}