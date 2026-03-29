import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Shield, Lock, Users, Key, ChevronDown, UserCheck, LogIn } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const LAZY_AUTH_PROMPT = `[Lazy Auth Prompt — v0.0.1 — LazyUnicorn.ai]

Add a complete authentication system called Lazy Auth to this project. It installs Google Sign-In, email/password login, protected routes, user profiles, role-based access control, and a user management dashboard — in one prompt. Uses Lovable Cloud and Supabase Auth.

Note: Google authentication requires Lovable Cloud to be enabled. Go to Cloud → Users → Auth → Google to enable Sign in with Google after this prompt runs.

---

1. Database

Create these Supabase tables with RLS enabled:

auth_settings: id (uuid, primary key, default gen_random_uuid()), brand_name (text), site_url (text), google_auth_enabled (boolean, default true), email_auth_enabled (boolean, default true), magic_link_enabled (boolean, default false), default_role (text, default 'user'), redirect_after_login (text, default '/dashboard'), redirect_after_logout (text, default '/'), setup_complete (boolean, default false), prompt_version (text, nullable), created_at (timestamptz, default now())

user_profiles: id (uuid, primary key references auth.users on delete cascade), email (text), full_name (text), avatar_url (text), role (text, default 'user' — one of user, admin, moderator), onboarded (boolean, default false), last_seen (timestamptz), created_at (timestamptz, default now())

auth_errors: id (uuid, primary key, default gen_random_uuid()), function_name (text), error_message (text), created_at (timestamptz, default now())

Row Level Security policies:
- user_profiles: users can read and update their own row. Admins can read all rows.
- auth_settings: only admins can read and update.

Create a Supabase database trigger: when a new row is inserted into auth.users automatically insert a matching row into user_profiles with the user's email, full_name from raw_user_meta_data, and avatar_url from raw_user_meta_data. This ensures every user has a profile row immediately after signup.

---

2. Setup page

Create a page at /lazy-auth-setup.

Welcome message: 'Add Google Sign-In, protected routes, and user management to your Lovable site in one prompt. Lazy Auth handles signup, login, sessions, and access control automatically.'

Form fields:
- Brand name (text)
- Site URL (text)
- Enable Google Sign-In (toggle, default on) — note shown below: After setup go to Cloud → Users → Auth → Google in Lovable and enable Sign in with Google. Lovable manages the OAuth credentials for you — no Google Cloud configuration required unless you need custom branding.
- Enable email/password login (toggle, default on)
- Enable magic link login (toggle, default off)
- Default user role (select: user / member / viewer)
- Redirect after login (text, default /dashboard)
- Redirect after logout (text, default /)
- Protected routes (text, comma separated, e.g. /dashboard, /account, /settings)

Submit button: Install Lazy Auth

On submit:
1. Save all values to auth_settings
2. Set setup_complete to true and prompt_version to 'v0.0.1'
3. Build all auth pages and components (see section 3)
4. Redirect to /admin with message: 'Lazy Auth is installed. Visit Cloud → Users → Auth → Google in Lovable to enable Google Sign-In.'

---

3. Auth pages and components

Build these pages and components:

/login — A clean, centred login page with Google Sign-In button, email/password form, magic link option, forgot password flow, and error handling.

/signup — Signup page with Google, email/password, validation, and email confirmation.

/account — Protected account page with profile editing, password change, and account deletion.

/auth/callback — OAuth redirect handler.

AuthGuard component — Wrapper that protects routes and redirects unauthenticated users.

UserMenu component — Navigation component showing avatar and dropdown when signed in.

useAuth hook — Exposes user, profile, isLoading, isAdmin, signOut.

---

4. Role-based access — Admin-only /admin route protection with 403 page.

5. Admin user management — User table at /admin/auth with search, filters, role editing, and CSV export.

6. Navigation — Sign in/Sign up links when not authenticated. UserMenu when authenticated. Admin link for admins only.

## Backlink Badge
Add a small "Powered by Lazy Unicorn" backlink badge in the footer of every public-facing page. Use this exact HTML:
<a href="https://www.lazyunicorn.ai" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#0a0a08;color:#f0ead6;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border:1px solid rgba(240,234,214,0.2)">🦄 Powered by Lazy Unicorn</a>
Style it to sit at the bottom of the page footer, centered, with subtle opacity (60%) that increases to 100% on hover.`;

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const features = [
  { icon: LogIn, title: "Google Sign-In", desc: "One-click Google login via Lovable Cloud. No Google Cloud console setup required." },
  { icon: Key, title: "Email & magic link", desc: "Email/password login with optional magic link. Forgot password flow included." },
  { icon: Shield, title: "Protected routes", desc: "Define which routes require auth. Unauthenticated users redirect to login automatically." },
  { icon: Users, title: "Role-based access", desc: "Admin, moderator, and user roles. Control who sees what across your entire site." },
  { icon: UserCheck, title: "User management", desc: "Searchable user table in your admin panel. Edit roles, filter by activity, export CSV." },
  { icon: Lock, title: "Auth guard", desc: "Wrap any route with AuthGuard. It checks sessions, redirects, and preserves the return URL." },
];

const faqs = [
  { q: "Does it work with Google Sign-In out of the box?", a: "Almost. After running the prompt, go to Cloud → Users → Auth → Google in Lovable and enable Sign in with Google. Lovable manages the OAuth credentials — no Google Cloud setup required." },
  { q: "Can I use email/password without Google?", a: "Yes. Toggle Google off during setup and only email/password login will be installed." },
  { q: "What about magic links?", a: "Optional. Enable magic link login during setup and users can sign in with a link sent to their email — no password required." },
  { q: "How does role-based access work?", a: "Every user gets a role (user, admin, or moderator) stored in user_profiles. The admin route is protected so only admins can access it. You can add role checks to any component using the requireRole helper." },
  { q: "Does it add user management to the admin panel?", a: "Yes. A new Auth section appears at /admin/auth showing all users, their roles, last seen dates, and signup methods. You can edit roles and delete users from there." },
  { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing users and settings are preserved." },
];

function CopyPromptButton({ label = "Copy the Lovable Prompt", text }: { label?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Prompt copied — paste it into your Lovable project");
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-8 py-4 font-semibold transition-opacity hover:opacity-90 active:scale-[0.97]"
      style={{ backgroundColor: "#f0ead6", color: "#0a0a08" }}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

export default function LazyAuthPage() {
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-auth");
  const promptText = dbPrompt?.prompt_text || LAZY_AUTH_PROMPT;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Auth — Autonomous Authentication Agent for Lovable"
        description="One prompt installs Google Sign-In, email login, protected routes, role-based access, and user management into your Lovable project."
        url="/lazy-auth"
        faq={faqs.map(f => ({ question: f.q, answer: f.a }))}
        softwareApp={{ name: "Lazy Auth", description: "Autonomous authentication agent for Lovable — installs Google Sign-In, email login, protected routes, and role-based access.", category: "SecurityApplication" }}
        howToSteps={[
          { name: "Copy the prompt", text: "Copy the Lazy Auth prompt from this page." },
          { name: "Paste into Lovable", text: "Paste it into your existing Lovable project." },
          { name: "Enable Google", text: "Go to Cloud → Users → Auth → Google in Lovable and flip the switch." },
        ]}
        howToName="How to install Lazy Auth"
      />
      <Navbar />

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-6">
              <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
              <span className="inline-block font-display text-[14px] font-bold tracking-[0.2em] uppercase px-3 py-1 border border-foreground/20 text-foreground/50">
                LAZY DEV
              </span>
              <span className="bg-foreground text-background text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
            </div>
            <AutopilotHeadline product="lazy-auth" />

            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Auth
              </h1>


            <div className="flex items-center gap-3 mt-4 mb-4">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Dev</span>
              </div>
            <p className="mt-6 font-body text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
              One prompt installs Google Sign-In, email/password login, magic links, protected routes, role-based access control, and a user management dashboard. Uses Lovable Cloud — no external auth provider setup required.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
              <CopyPromptButton text={promptText} />
              <button
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
              >
                See What It Installs <ChevronDown size={14} />
              </button>
            </div>

            {/* Works with */}
            <div className="mt-8 flex flex-wrap gap-2">
              {["Lazy Admin", "Lazy Security"].map((tag) => (
                <span key={tag} className="font-body text-[13px] tracking-[0.2em] uppercase text-foreground/60 border border-border px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-8">
            Auth is the thing nobody wants to build twice.
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-body text-base md:text-lg text-foreground/70 leading-relaxed">
            Every Lovable project eventually needs login. Google OAuth, email flows, password resets, protected routes, role-based access — it is the same work every time. Lazy Auth does it once, in one prompt. You get a complete authentication system with user management, and you never wire up another OAuth callback again.
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight text-center mb-14">
            What it installs
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border border-border p-6 bg-card"
              >
                <f.icon size={20} className="text-foreground/70 mb-3" />
                <h3 className="font-display text-sm font-bold mb-1">{f.title}</h3>
                <p className="font-body text-sm text-foreground/65 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight text-center mb-14">
            Three steps. Done.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Copy the prompt", desc: "Copy the Lazy Auth prompt from this page." },
              { step: "2", title: "Paste into Lovable", desc: "Paste it into your existing Lovable project. Configure your brand, login methods, and protected routes." },
              { step: "3", title: "Enable Google", desc: "Go to Cloud → Users → Auth → Google in Lovable and flip the switch. Done." },
            ].map((s) => (
              <motion.div key={s.step} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="border border-border p-6 bg-card"
              >
                <span className="font-display text-2xl font-bold text-foreground/20 mb-3 block">{s.step}</span>
                <h3 className="font-display text-sm font-bold mb-2">{s.title}</h3>
                <p className="font-body text-sm text-foreground/65 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <LazyPricingSection
        lazyFeatures={["Lazy Auth setup prompt", "Self-hosted in your existing Lovable project", "Google Sign-In via Lovable Cloud", "Email/password and magic link login", "Role-based access control", "User management dashboard"]}
        proFeatures={["Hosted version — zero config", "Multi-tenant support", "Advanced session analytics", "Custom OAuth providers", "Dedicated support"]}
        proPrice="$19"
        ctaButton={<CopyPromptButton text={promptText} label="Get the Prompt" />}
      />

      <LazyFaqSection faqs={faqs} />

      {/* Bottom CTA */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-6">
            Stop building auth from scratch.
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-body text-base md:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed mb-10">
            One prompt. Google Sign-In. Email login. Protected routes. Role-based access. User management. All wired up and ready to go.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <CopyPromptButton text={promptText} />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border text-center">
        <p className="font-display text-[14px] tracking-[0.15em] uppercase text-foreground/60">
          Lazy Unicorn — Autonomous growth agents for Lovable
        </p>
      </footer>
    </div>
  );
}