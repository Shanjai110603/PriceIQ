# Supabase Setup Guide (From Scratch)

Since we are starting fresh, follow these exact steps to initialize your backend.

## Step 1: Create Project (Refer to your screenshots)
1.  **Organization**: Select "[Your Organization]" (or your desired org).
2.  **Project Name**: `priceiq-platform`
3.  **Database Password**: **IMPORTANT** - Generate a strong password and **SAVE IT IMMEDIATELY** in a password manager or notepad. You cannot see it again.
4.  **Region**: `Asia-Pacific` (or closest to you).
5.  **Click "Create new project"**.
    *   *Wait approx 1-2 minutes for the database to provision.*

## Step 2: Run the Schema Script
Once the dashboard loads:
1.  Look at the icons on the far left sidebar.
2.  Click the **SQL Editor** icon (looks like a terminal `>_`).
3.  Click **+ New Query**.
4.  Copy the content from the file `supabase/schema.sql` in your project VS Code.
    *   *I have just created this file for you with the full setup.*
5.  Paste it into the Supabase SQL Editor.
6.  Click **Run** (bottom right).
    *   *You should see "Success" in the results pane.*

## Step 3: Connect to PriceIQ
1.  In Supabase, go to **Project Settings** (Gear icon, bottom left).
2.  Click **API** in the sidebar.
3.  Find **Project URL** and **anon public** key.
4.  In VS Code, rename `.env.local.example` to `.env.local` (if you haven't already).
5.  Update the file with your new keys:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://your-new-project-id.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-long-anon-key-here
    ```
6.  **Restart your terminal**:
    *   `Ctrl + C` to stop.
    *   `npm run dev` to start again.

## Step 4: Verify
1.  Go to `http://localhost:3000/explore`.
2.  Try searching for "React".
    *   If you see results or filters loading, **Success!** Your App is now talking to the new Database.
