# Phoenix Tattooz Studio & Academy

> Premium website & management platform for **Phoenix Tattooz Studio & Academy** (Hisar, Haryana).
> Built with React 19, TypeScript, Tailwind CSS v4, Vite, Express, and Supabase.

---

## 🚀 Quick Deployment Guide

### Option A: Deploy on Vercel / Netlify (Frontend)
1. **Connect Repository** to Vercel/Netlify.
2. **Framework Preset:** Vite
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Environment Variables:**
   ```env
   VITE_SUPABASE_URL=https://jkaeilfiqaadmvxgcpjn.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_diEh3AqJvda7w6AgknqIfw_hOuIbKoH
   ```
*(Note: `vercel.json` is already included for SPA routing and video streaming).*

---

### Option B: Deploy on Render / Railway / VPS / Docker (Full-Stack Recommended)
This runs both the frontend and the Express dynamic CMS API (with file upload handling and real-time content management).

1. **Build Command:** `npm install && npm run build`
2. **Start Command:** `npm start`
3. **Environment Variables:**
   ```env
   PORT=3000
   NODE_ENV=production
   APP_URL=https://your-domain.com
   VITE_SUPABASE_URL=https://jkaeilfiqaadmvxgcpjn.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_diEh3AqJvda7w6AgknqIfw_hOuIbKoH
   GEMINI_API_KEY=your_gemini_api_key_here   # (Optional: free chatbot fallback engine active if not provided)
   ```

---

## 🗄️ Supabase Database Setup

If connecting to a new Supabase project:
1. Open your **Supabase Dashboard** -> **SQL Editor** -> **New query**.
2. Copy the entire contents of [`supabase-schema.sql`](./supabase-schema.sql) and paste it into the query box.
3. Click **Run**. All tables (`appointments`, `site_settings`, `contact_inquiries`) and RLS policies will be created automatically.

---

## 💻 Local Development

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
2. **Setup environment:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. **Run development server:**
   ```bash
   npm run dev
   ```
4. **Open in browser:**
   Visit [http://localhost:3000](http://localhost:3000)

---

## 🔑 Admin Panel & Credentials

- URL: `/admin` (or click Admin from the footer / quick link)
- Master Credentials are encrypted and enforced in `src/lib/adminAuth.ts`.
