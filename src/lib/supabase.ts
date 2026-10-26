import { createClient } from '@supabase/supabase-js';

// Project credentials provided by the user
const getEnvVar = (name: string, fallback: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[name]) {
      return (import.meta as any).env[name];
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env && process.env[name]) {
      return process.env[name] as string;
    }
  } catch {}
  return fallback;
};

export const SUPABASE_URL = getEnvVar('VITE_SUPABASE_URL', 'https://jkaeilfiqaadmvxgcpjn.supabase.co');
export const SUPABASE_ANON_KEY = getEnvVar('VITE_SUPABASE_ANON_KEY', 'sb_publishable_diEh3AqJvda7w6AgknqIfw_hOuIbKoH');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface AppointmentData {
  booking_code: string;
  client_name: string;
  client_phone: string;
  service: string;
  artist: string;
  placement: string;
  size: string;
  appointment_date: string;
  time_slot: string;
  notes?: string;
  status?: string;
}

export interface ContactData {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
}

export interface SaveResult {
  success: boolean;
  data?: any;
  error?: string;
  tableMissing?: boolean;
}

/**
 * Saves an appointment booking record to the Supabase database.
 * Tries the primary 'appointments' table and falls back to 'bookings'.
 */
export async function saveAppointmentToSupabase(payload: AppointmentData): Promise<SaveResult> {
  try {
    const record = {
      booking_code: payload.booking_code,
      client_name: payload.client_name,
      client_phone: payload.client_phone,
      service: payload.service,
      artist: payload.artist,
      placement: payload.placement,
      size: payload.size,
      appointment_date: payload.appointment_date,
      time_slot: payload.time_slot,
      notes: payload.notes || '',
      status: payload.status || 'pending',
      created_at: new Date().toISOString(),
    };

    // Primary attempt: 'appointments'
    const { data, error } = await supabase
      .from('appointments')
      .insert([record])
      .select();

    if (!error) {
      return { success: true, data };
    }

    // Check if table missing (PGRST205)
    if (error.code === 'PGRST205') {
      // Try fallback to 'bookings'
      const fallback = await supabase
        .from('bookings')
        .insert([record])
        .select();

      if (!fallback.error) {
        return { success: true, data: fallback.data };
      }

      return {
        success: false,
        error: error.message,
        tableMissing: true,
      };
    }

    return {
      success: false,
      error: error.message,
      tableMissing: false,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Unknown network error saving appointment',
    };
  }
}

/**
 * Saves a contact form message to Supabase.
 */
export async function saveContactToSupabase(payload: ContactData): Promise<SaveResult> {
  try {
    const record = {
      name: payload.name,
      phone: payload.phone,
      email: payload.email || '',
      service: payload.service || 'General Inquiry',
      message: payload.message || '',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('contact_inquiries')
      .insert([record])
      .select();

    if (!error) {
      return { success: true, data };
    }

    if (error.code === 'PGRST205') {
      return {
        success: false,
        error: error.message,
        tableMissing: true,
      };
    }

    return {
      success: false,
      error: error.message,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Unknown error saving contact inquiry',
    };
  }
}

/**
 * Fetches existing appointments from Supabase (for studio dashboard / validation).
 */
export async function getAppointmentsFromSupabase(): Promise<{ data: any[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error && error.code === 'PGRST205') {
      const fallback = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      return fallback;
    }

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Ready-to-run SQL schema script for the user to execute in Supabase SQL Editor.
 */
export const SUPABASE_SQL_SCHEMA = `-- 1. Create appointments table in Supabase
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code TEXT,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  service TEXT,
  artist TEXT,
  placement TEXT,
  size TEXT,
  appointment_date TEXT,
  time_slot TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create contact inquiries table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- 4. Create policies to allow website visitors to submit forms
CREATE POLICY "Allow public inserts on appointments" ON public.appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on appointments" ON public.appointments
  FOR SELECT USING (true);

CREATE POLICY "Allow public inserts on contact_inquiries" ON public.contact_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select on contact_inquiries" ON public.contact_inquiries
  FOR SELECT USING (true);

-- 5. Create site_settings table (for custom studio logo and branding)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read site_settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow all upsert site_settings" ON public.site_settings
  FOR ALL USING (true) WITH CHECK (true);
`;
