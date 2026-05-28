-- Run this script in your Supabase SQL Editor to add the dashboard layout preference

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dashboard_layout JSONB DEFAULT '["overview", "charts", "categories", "transactions"]'::jsonb;
