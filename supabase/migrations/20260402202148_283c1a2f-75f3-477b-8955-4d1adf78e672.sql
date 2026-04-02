
-- Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  full_name text,
  company_name text,
  data_size text,
  industry text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Files table
CREATE TABLE public.files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text,
  size_bytes bigint DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  storage_path text,
  indexed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org files" ON public.files FOR SELECT USING (public.is_org_member(auth.uid(), org_id));
CREATE POLICY "Admins can insert files" ON public.files FOR INSERT WITH CHECK (public.is_org_admin(auth.uid(), org_id));
CREATE POLICY "Admins can update files" ON public.files FOR UPDATE USING (public.is_org_admin(auth.uid(), org_id));
CREATE POLICY "Admins can delete files" ON public.files FOR DELETE USING (public.is_org_admin(auth.uid(), org_id));

CREATE INDEX idx_files_org_id ON public.files(org_id);

-- Search history table
CREATE TABLE public.search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  query text NOT NULL,
  results_count integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org searches" ON public.search_history FOR SELECT USING (public.is_org_member(auth.uid(), org_id));
CREATE POLICY "Users can insert own searches" ON public.search_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_search_history_org_id ON public.search_history(org_id);
CREATE INDEX idx_search_history_created ON public.search_history(created_at);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
