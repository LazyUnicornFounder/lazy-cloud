
-- Organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  logo_url TEXT,
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'professional', 'enterprise')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Org members table
CREATE TABLE public.org_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  invited_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(org_id, user_id)
);
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;

-- Org invites table
CREATE TABLE public.org_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  invited_by UUID REFERENCES auth.users(id),
  accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.org_invites ENABLE ROW LEVEL SECURITY;

-- Storage connections table
CREATE TABLE public.storage_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('s3', 'google_drive', 'upload')),
  config JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'indexing', 'error')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.storage_connections ENABLE ROW LEVEL SECURITY;

-- Security definer function to check org membership
CREATE OR REPLACE FUNCTION public.is_org_member(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.org_members
    WHERE user_id = _user_id AND org_id = _org_id
  )
$$;

-- Security definer function to check org admin
CREATE OR REPLACE FUNCTION public.is_org_admin(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.org_members
    WHERE user_id = _user_id AND org_id = _org_id AND role = 'admin'
  )
$$;

-- Helper to get user's org_id
CREATE OR REPLACE FUNCTION public.get_user_org_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM public.org_members WHERE user_id = _user_id LIMIT 1
$$;

-- RLS: organizations
CREATE POLICY "Members can view their org"
  ON public.organizations FOR SELECT
  USING (public.is_org_member(auth.uid(), id));

CREATE POLICY "Admins can update their org"
  ON public.organizations FOR UPDATE
  USING (public.is_org_admin(auth.uid(), id));

CREATE POLICY "Authenticated users can create orgs"
  ON public.organizations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS: org_members
CREATE POLICY "Members can view org members"
  ON public.org_members FOR SELECT
  USING (public.is_org_member(auth.uid(), org_id));

CREATE POLICY "Admins can insert org members"
  ON public.org_members FOR INSERT
  WITH CHECK (public.is_org_admin(auth.uid(), org_id) OR auth.uid() = user_id);

CREATE POLICY "Admins can update org members"
  ON public.org_members FOR UPDATE
  USING (public.is_org_admin(auth.uid(), org_id));

CREATE POLICY "Admins can delete org members"
  ON public.org_members FOR DELETE
  USING (public.is_org_admin(auth.uid(), org_id));

-- RLS: org_invites
CREATE POLICY "Members can view org invites"
  ON public.org_invites FOR SELECT
  USING (public.is_org_member(auth.uid(), org_id));

CREATE POLICY "Admins can create invites"
  ON public.org_invites FOR INSERT
  WITH CHECK (public.is_org_admin(auth.uid(), org_id));

CREATE POLICY "Admins can update invites"
  ON public.org_invites FOR UPDATE
  USING (public.is_org_admin(auth.uid(), org_id));

CREATE POLICY "Admins can delete invites"
  ON public.org_invites FOR DELETE
  USING (public.is_org_admin(auth.uid(), org_id));

-- RLS: storage_connections
CREATE POLICY "Members can view storage connections"
  ON public.storage_connections FOR SELECT
  USING (public.is_org_member(auth.uid(), org_id));

CREATE POLICY "Admins can manage storage connections"
  ON public.storage_connections FOR INSERT
  WITH CHECK (public.is_org_admin(auth.uid(), org_id));

CREATE POLICY "Admins can update storage connections"
  ON public.storage_connections FOR UPDATE
  USING (public.is_org_admin(auth.uid(), org_id));

CREATE POLICY "Admins can delete storage connections"
  ON public.storage_connections FOR DELETE
  USING (public.is_org_admin(auth.uid(), org_id));
