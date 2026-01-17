# Supabase Setup Guide - tinhtienvetay v0.2.0

This guide will help you set up Supabase for the dynamic pricing system.

## Prerequisites
- A Supabase account (free tier works fine)
- Database access to run SQL scripts

## Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Project Name**: `tinhtienvetay` (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select closest to Vietnam (Singapore recommended)
5. Click "Create new project" and wait ~2 minutes for provisioning

### 2. Get Your API Credentials

1. In your Supabase project dashboard, click "Settings" (gear icon) in sidebar
2. Click "API" under Project Settings
3. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Project API Key** - the `anon public` key

### 3. Update Environment Variables

1. Open your `.env.local` file in the project root
2. Replace the placeholders with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Create Database Schema

1. In Supabase dashboard, click "SQL Editor" in sidebar
2. Click "New query"
3. Open the file `supabase-schema.sql` from your project
4. Copy ALL the contents and paste into the SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see "Success. No rows returned" - this is normal!

### 5. Seed Initial Data

1. Still in SQL Editor, create another new query
2. Open the file `supabase-seed.sql`
3. Copy ALL the contents and paste into the editor
4. Click "Run"
5. You should see multiple success messages

### 6. Verify Tables Created

1. Click "Table Editor" in the sidebar
2. You should see 3 tables:
   - `global_settings`
   - `service_fee_rules`
   - `shipping_rate_rules`

3. Click on each table to verify data was inserted:
   - `global_settings`: Should have 3 rows (exchange_rate, hotline, zalo_link)
   - `service_fee_rules`: Should have ~18 rows
   - `shipping_rate_rules`: Should have ~30+ rows

### 7. Test the Connection

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. The calculator should load with a "ĐANG TẢI BẢNG GIÁ..." message, then switch to "XEM BÁO GIÁ CHI TIẾT" when data loads

4. Check browser console (F12) - you should NOT see any Supabase errors

### 8. (Optional) Set Up Row Level Security (RLS)

The schema already enables RLS with public read access. For production, you may want to:

1. Create an admin user in Supabase Auth
2. Update RLS policies to restrict write access to authenticated admins only

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure `.env.local` has both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your dev server after adding env variables

### Error: "relation 'global_settings' does not exist"
- The schema wasn't created. Go back to Step 4 and run `supabase-schema.sql`

### Calculator shows "LỖI TẢI DỮ LIỆU"
- Check browser console for specific error
- Verify your API credentials are correct
- Make sure you ran both schema AND seed SQL files

### Tables are empty
- Run the `supabase-seed.sql` file (Step 5)
- Verify in Table Editor that data was inserted

## Next Steps

Once setup is complete:
- ✅ Your calculator will fetch pricing from Supabase in real-time
- ✅ You can proceed to Phase 3: Building the Admin Dashboard
- ✅ Any changes you make in the database will immediately reflect in the calculator

## Security Notes

- The `anon` key is safe to expose in client-side code
- Row Level Security (RLS) is enabled to protect data
- Admin write access will be controlled through Supabase Auth in the next phase

---

Need help? Check the Supabase documentation: https://supabase.com/docs
