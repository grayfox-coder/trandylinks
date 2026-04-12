# Supabase Admin Panel Setup Guide

## Overview
Your website now uses **Supabase** for storing and managing links. The admin panel allows you to add, edit, and delete links that automatically appear on your main website in real-time.

## Prerequisites
- Supabase account (free at https://supabase.com)
- Your Supabase credentials are already configured in `js/supabase-config.js`

## Step 1: Create the Links Table in Supabase

1. Go to https://app.supabase.com and sign in
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste this SQL:

```sql
-- Create links table
CREATE TABLE public.links (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  badge TEXT,
  commission TEXT,
  cta TEXT DEFAULT 'Learn More',
  highlight BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own links"
  ON public.links FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own links"
  ON public.links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links"
  ON public.links FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links"
  ON public.links FOR DELETE
  USING (auth.uid() = user_id);

-- Allow public read access (for main website)
CREATE POLICY "Public can view all links"
  ON public.links FOR SELECT
  USING (TRUE);

-- Create indexes for better performance
CREATE INDEX idx_links_user_id ON public.links(user_id);
CREATE INDEX idx_links_category ON public.links(category);
CREATE INDEX idx_links_created_at ON public.links(created_at DESC);
```

6. Click **Run** to execute the SQL

## Step 2: Create an Admin User

1. In Supabase, go to **Authentication** → **Users**
2. Click **Add user**
3. Enter:
   - Email: `admin@mylinks.local` (or any email you prefer)
   - Password: Create a strong password (this is what you'll use to login to the admin panel)
4. Click **Create user**

## Step 3: Access the Admin Panel

1. Open your website and go to `/admin/admin.html`
2. You'll see a login screen
3. Enter the password you created in Step 2
4. Click **Login**

## Step 4: Add Your First Link

1. Click **Add Link** in the sidebar
2. Fill in the form:
   - **Image URL**: Link to the product/service image
   - **Title**: Product name
   - **Category**: Choose from the dropdown
   - **Badge**: Optional (HOT, FREE, DEAL)
   - **Description**: Brief description
   - **Commission Info**: Optional (e.g., "Earn $20 per referral")
   - **CTA Button Text**: Button label (default: "Learn More")
   - **URL**: Your affiliate link
   - **Highlight**: Check to add a green border
3. Click **Add Link**

## Step 5: View Links on Main Website

1. Go to your main website (index.html)
2. Your links will automatically appear in the grid
3. They're organized by category and can be filtered

## Features

### Real-Time Sync
- When you add/edit/delete a link in the admin panel, it appears on the main website instantly
- No need to refresh the page

### Link Management
- **View**: See all your links in a table
- **Edit**: Click the ✏️ icon to edit any link
- **Delete**: Click the 🗑️ icon to delete a link

### Data Management
- **Export**: Download all links as JSON
- **Import**: Upload a JSON file to add multiple links at once
- **Clear All**: Delete all links (use with caution!)

### Categories
- Recommended
- Deals
- AI Tools
- Hosting
- Finance
- Health
- Resources

## Troubleshooting

### "Incorrect password" error
- Make sure you're using the password you set in Step 2
- Check that the email is `admin@mylinks.local` (or whatever you set)

### Links not appearing on main website
- Check that the links table was created successfully
- Make sure you're logged in to the admin panel
- Check browser console for errors (F12 → Console)

### "Column user_id does not exist" error
- Run the SQL from Step 1 again to create the table properly
- Make sure you executed the entire SQL block

### Real-time updates not working
- Refresh the page
- Check that Supabase is connected (check browser console)
- Make sure you have internet connection

## Security Notes

1. **Change your password regularly** in Supabase
2. **Don't share your admin password** with anyone
3. **Use HTTPS** when accessing the admin panel
4. **Row Level Security (RLS)** is enabled - only you can see/edit your links

## Next Steps

1. Add all your affiliate links via the admin panel
2. Customize the main website styling (css/style.css)
3. Deploy to GitHub Pages or your hosting provider
4. Share your link hub with your audience!

## Support

For issues with Supabase:
- Visit https://supabase.com/docs
- Check the Supabase dashboard for error messages

For issues with the website:
- Check browser console (F12 → Console)
- Make sure all files are in the correct locations
- Verify Supabase credentials in js/supabase-config.js
