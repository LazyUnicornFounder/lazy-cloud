
-- Table: waitlist_settings
CREATE TABLE public.waitlist_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_running BOOLEAN DEFAULT false,
  setup_complete BOOLEAN DEFAULT false,
  prompt_version TEXT DEFAULT '0.0.1',
  waitlist_name TEXT DEFAULT 'Join Our Waitlist',
  waitlist_description TEXT DEFAULT 'Be the first to know when we launch.',
  launch_date TIMESTAMPTZ,
  is_launched BOOLEAN DEFAULT false,
  referral_enabled BOOLEAN DEFAULT true,
  referral_reward_threshold INTEGER DEFAULT 3,
  referral_reward_description TEXT DEFAULT 'Get early access',
  welcome_email_enabled BOOLEAN DEFAULT true,
  welcome_email_subject TEXT DEFAULT 'You''re on the list! 🎉',
  welcome_email_body TEXT DEFAULT 'Thanks for joining our waitlist. We''ll notify you as soon as we launch.',
  followup_enabled BOOLEAN DEFAULT false,
  followup_delay_days INTEGER DEFAULT 3,
  followup_subject TEXT DEFAULT 'Still excited? We are too!',
  followup_body TEXT DEFAULT 'Just a quick update - we''re working hard to launch soon.',
  launch_email_subject TEXT DEFAULT 'We''re Live! 🚀',
  launch_email_body TEXT DEFAULT 'The wait is over! Click below to create your account.',
  slack_enabled BOOLEAN DEFAULT false,
  slack_channel TEXT DEFAULT '#waitlist',
  page_headline TEXT DEFAULT 'Something Amazing is Coming',
  page_subheadline TEXT DEFAULT 'Join the waitlist and be the first to know.',
  page_cta_text TEXT DEFAULT 'Join Waitlist',
  page_background_color TEXT DEFAULT '#ffffff',
  page_accent_color TEXT DEFAULT '#6366f1',
  page_show_counter BOOLEAN DEFAULT true,
  page_show_position BOOLEAN DEFAULT true,
  share_twitter_text TEXT DEFAULT 'I just joined the waitlist for something amazing! Join me:',
  share_linkedin_text TEXT DEFAULT 'Excited to be on this waitlist!',
  share_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.waitlist_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read waitlist_settings" ON public.waitlist_settings
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow authenticated read waitlist_settings" ON public.waitlist_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated update waitlist_settings" ON public.waitlist_settings
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert waitlist_settings" ON public.waitlist_settings
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Service role full access waitlist_settings" ON public.waitlist_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Table: waitlist_subscribers
CREATE TABLE public.waitlist_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  referral_code TEXT UNIQUE NOT NULL DEFAULT '',
  referred_by UUID REFERENCES public.waitlist_subscribers(id),
  referral_count INTEGER DEFAULT 0,
  position INTEGER,
  priority_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'waiting',
  converted_user_id UUID,
  converted_at TIMESTAMPTZ,
  welcome_email_sent BOOLEAN DEFAULT false,
  welcome_email_sent_at TIMESTAMPTZ,
  followup_email_sent BOOLEAN DEFAULT false,
  followup_email_sent_at TIMESTAMPTZ,
  launch_email_sent BOOLEAN DEFAULT false,
  launch_email_sent_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.waitlist_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert waitlist_subscribers" ON public.waitlist_subscribers
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow anon select waitlist_subscribers" ON public.waitlist_subscribers
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow authenticated full access waitlist_subscribers" ON public.waitlist_subscribers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access waitlist_subscribers" ON public.waitlist_subscribers
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Function: auto-assign position
CREATE OR REPLACE FUNCTION public.assign_waitlist_position()
RETURNS TRIGGER AS $$
BEGIN
  NEW.position := COALESCE(
    (SELECT MAX(position) + 1 FROM public.waitlist_subscribers),
    1
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_waitlist_position
  BEFORE INSERT ON public.waitlist_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_waitlist_position();

-- Function: generate referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.referral_code := UPPER(SUBSTRING(MD5(NEW.email || NOW()::TEXT) FROM 1 FOR 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_referral_code
  BEFORE INSERT ON public.waitlist_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_referral_code();

-- Function: increment referral count
CREATE OR REPLACE FUNCTION public.increment_referral_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referred_by IS NOT NULL THEN
    UPDATE public.waitlist_subscribers
    SET referral_count = referral_count + 1,
        priority_score = priority_score + 10,
        status = CASE 
          WHEN referral_count + 1 >= COALESCE((SELECT referral_reward_threshold FROM public.waitlist_settings LIMIT 1), 3)
          THEN 'priority'
          ELSE status
        END,
        updated_at = NOW()
    WHERE id = NEW.referred_by;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_referrer_count
  AFTER INSERT ON public.waitlist_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_referral_count();

-- Function: increment daily signups (RPC)
CREATE OR REPLACE FUNCTION public.increment_daily_signups()
RETURNS void AS $$
BEGIN
  INSERT INTO public.waitlist_stats (date, signups_count)
  VALUES (CURRENT_DATE, 1)
  ON CONFLICT (date) DO UPDATE SET signups_count = waitlist_stats.signups_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Table: waitlist_errors
CREATE TABLE public.waitlist_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_details JSONB,
  subscriber_id UUID REFERENCES public.waitlist_subscribers(id),
  function_name TEXT,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.waitlist_errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access waitlist_errors" ON public.waitlist_errors
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access waitlist_errors" ON public.waitlist_errors
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Table: waitlist_stats
CREATE TABLE public.waitlist_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE DEFAULT CURRENT_DATE,
  signups_count INTEGER DEFAULT 0,
  referrals_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,
  unsubscribes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.waitlist_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access waitlist_stats" ON public.waitlist_stats
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon read waitlist_stats" ON public.waitlist_stats
  FOR SELECT TO anon USING (true);

CREATE POLICY "Service role full access waitlist_stats" ON public.waitlist_stats
  FOR ALL TO service_role USING (true) WITH CHECK (true);
