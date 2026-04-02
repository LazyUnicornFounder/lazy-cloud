## Phase 1: Clean Slate
- Delete all existing page files, components, hooks, data files, and edge functions
- Clean up App.tsx routes to only have the new pages
- Update index.html title/meta to "Lazy Cloud"

## Phase 2: Database
- Create fresh tables: `organizations`, `org_members`, `org_invites`, `storage_connections`
- Add RLS policies scoped to org membership
- Enable Supabase Auth (email+password)

## Phase 3: Landing Page (`/`)
- Hero with headline "25 Years of Documents. One Search."
- Stats bar, How it Works, Use Cases, Features grid
- Security section, Pricing (3 tiers), Testimonials
- Footer with links

## Phase 4: Auth & Signup (`/signup`)
- Signup form with company name, full name, email, password
- Industry & data size dropdowns
- Creates organization + org_member on signup
- Login page at `/login`

## Phase 5: Dashboard (`/dashboard`)
- Protected route with sidebar layout
- Overview cards (files indexed, storage, queries, active users)
- Setup wizard (connect storage, indexing progress, ready)
- Team management (`/dashboard/team`)
- Settings (`/dashboard/settings`)

## Design
- Clean, professional SaaS aesthetic (not the dark LazyUnicorn theme)
- Light mode primary, modern typography
- Blue/indigo primary accent