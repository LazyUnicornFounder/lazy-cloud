import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/ScrollToTop.tsx";
import PublicLayout from "./components/PublicLayout.tsx";

// Eagerly load homepage only
import Index from "./pages/Index.tsx";

// Lazy-load all other pages
const AboutPage = lazy(() => import("./pages/AboutPage.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess.tsx"));
const LazyBloggerPage = lazy(() => import("./pages/LazyBloggerPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const LazySeoPage = lazy(() => import("./pages/LazySeoPage.tsx"));
const LazySeoSetup = lazy(() => import("./pages/LazySeoSetup.tsx"));
const LazySeoDashboard = lazy(() => import("./pages/LazySeoDashboard.tsx"));
const LazyGeoPage = lazy(() => import("./pages/LazyGeoPage.tsx"));
const LazyStorePage = lazy(() => import("./pages/LazyStorePage.tsx"));
const LazyDropPage = lazy(() => import("./pages/LazyDropPage.tsx"));
const LazyPrintPage = lazy(() => import("./pages/LazyPrintPage.tsx"));
const LazyVoicePage = lazy(() => import("./pages/LazyVoicePage.tsx"));
const LazyVoiceSetup = lazy(() => import("./pages/LazyVoiceSetup.tsx"));
const LazyVoiceDashboard = lazy(() => import("./pages/LazyVoiceDashboard.tsx"));
const ListenPage = lazy(() => import("./pages/ListenPage.tsx"));
const LazyPayPage = lazy(() => import("./pages/LazyPayPage.tsx"));
const LazySmsPage = lazy(() => import("./pages/LazySmsPage.tsx"));
const LazyStreamPage = lazy(() => import("./pages/LazyStreamPage.tsx"));
const LazyStreamSetup = lazy(() => import("./pages/LazyStreamSetup.tsx"));
const LazyStreamDashboard = lazy(() => import("./pages/LazyStreamDashboard.tsx"));
const LazyGitHubPage = lazy(() => import("./pages/LazyGitHubPage.tsx"));
const LazyRunPage = lazy(() => import("./pages/LazyRunPage.tsx"));
const LazyAlertPage = lazy(() => import("./pages/LazyAlertPage.tsx"));
const LazyGitLabPage = lazy(() => import("./pages/LazyGitLabPage.tsx"));
const LazySupabasePage = lazy(() => import("./pages/LazySupabasePage.tsx"));
const LazyTelegramPage = lazy(() => import("./pages/LazyTelegramPage.tsx"));
const LazyLinearPage = lazy(() => import("./pages/LazyLinearPage.tsx"));
const LazyContentfulPage = lazy(() => import("./pages/LazyContentfulPage.tsx"));
const LazyPerplexityPage = lazy(() => import("./pages/LazyPerplexityPage.tsx"));
const LazyCrawlPage = lazy(() => import("./pages/LazyCrawlPage.tsx"));
const PricingPage = lazy(() => import("./pages/PricingPage.tsx"));
const AutonomyPage = lazy(() => import("./pages/AutonomyPage.tsx"));
const LazySecurityPage = lazy(() => import("./pages/LazySecurityPage.tsx"));
const LazyMailPage = lazy(() => import("./pages/LazyMailPage.tsx"));
const LazyDesignPage = lazy(() => import("./pages/LazyDesignPage.tsx"));
const LazyAuthPage = lazy(() => import("./pages/LazyAuthPage.tsx"));
const LazyAdminPage = lazy(() => import("./pages/LazyAdminPage.tsx"));
const LazyGranolaPage = lazy(() => import("./pages/LazyGranolaPage.tsx"));
const LazyGranolaSetup = lazy(() => import("./pages/LazyGranolaSetup.tsx"));
const LazyLaunchPage = lazy(() => import("./pages/LazyLaunchPage.tsx"));
const LazyYouTubePage = lazy(() => import("./pages/LazyYouTubePage.tsx"));
const LazyAgentsPage = lazy(() => import("./pages/LazyAgentsPage.tsx"));
const LazyWatchPage = lazy(() => import("./pages/LazyWatchPage.tsx"));
const LazyFixPage = lazy(() => import("./pages/LazyFixPage.tsx"));
const LazyBuildPage = lazy(() => import("./pages/LazyBuildPage.tsx"));
const LazyIntelPage = lazy(() => import("./pages/LazyIntelPage.tsx"));
const LazyRepurposePage = lazy(() => import("./pages/LazyRepurposePage.tsx"));
const LazyTrendPage = lazy(() => import("./pages/LazyTrendPage.tsx"));
const LazyChurnPage = lazy(() => import("./pages/LazyChurnPage.tsx"));
const ChangelogPage = lazy(() => import("./pages/ChangelogPage.tsx"));
const UpgradeGuidePage = lazy(() => import("./pages/UpgradeGuidePage.tsx"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage.tsx"));
const UseCasesPage = lazy(() => import("./pages/UseCasesPage.tsx"));
const WaitlistPage = lazy(() => import("./pages/WaitlistPage.tsx"));
const LazyWaitlistPage = lazy(() => import("./pages/LazyWaitlistPage.tsx"));
const LazyCloudPage = lazy(() => import("./pages/LazyCloudPage.tsx"));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminSettingsPage = lazy(() => import("./pages/admin/AdminSettingsPage"));
const AdminCloudSignups = lazy(() => import("./pages/admin/AdminCloudSignups"));
const AgentPage = lazy(() => import("./pages/admin/AgentPage"));

const DocsLayout = lazy(() => import("./pages/docs/DocsLayout"));
const DocsIntro = lazy(() => import("./pages/docs/DocsIntro"));
const DocsQuickstart = lazy(() => import("./pages/docs/DocsQuickstart"));
const DocsHowItWorks = lazy(() => import("./pages/docs/DocsHowItWorks"));

// Named exports need wrapper
const DocsContentAgents = lazy(() => import("./pages/docs/DocsAgents").then(m => ({ default: m.DocsContentAgents })));
const DocsCommerceAgents = lazy(() => import("./pages/docs/DocsAgents").then(m => ({ default: m.DocsCommerceAgents })));
const DocsMediaAgents = lazy(() => import("./pages/docs/DocsAgents").then(m => ({ default: m.DocsMediaAgents })));
const DocsDevAgents = lazy(() => import("./pages/docs/DocsAgents").then(m => ({ default: m.DocsDevAgents })));
const DocsOpsAgents = lazy(() => import("./pages/docs/DocsAgents").then(m => ({ default: m.DocsOpsAgents })));
const DocsLaunch = lazy(() => import("./pages/docs/DocsPlatform").then(m => ({ default: m.DocsLaunch })));
const DocsCloud = lazy(() => import("./pages/docs/DocsPlatform").then(m => ({ default: m.DocsCloud })));
const DocsRun = lazy(() => import("./pages/docs/DocsPlatform").then(m => ({ default: m.DocsRun })));
const DocsAdminPlatform = lazy(() => import("./pages/docs/DocsPlatform").then(m => ({ default: m.DocsAdmin })));
const DocsWaitlist = lazy(() => import("./pages/docs/DocsPlatform").then(m => ({ default: m.DocsWaitlist })));
const DocsAdminOverview = lazy(() => import("./pages/docs/DocsAdmin").then(m => ({ default: m.DocsAdminOverview })));
const DocsAdminSettings = lazy(() => import("./pages/docs/DocsAdmin").then(m => ({ default: m.DocsAdminSettings })));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <PublicLayout>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminOverview />} />
                  <Route path=":agentSlug" element={<AgentPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                  <Route path="cloud-signups" element={<AdminCloudSignups />} />
                </Route>
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/lazy-blogger" element={<LazyBloggerPage />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/lazy-seo" element={<LazySeoPage />} />
                <Route path="/lazy-seo-setup" element={<LazySeoSetup />} />
                <Route path="/lazy-seo-dashboard" element={<LazySeoDashboard />} />
                <Route path="/lazy-geo" element={<LazyGeoPage />} />
                <Route path="/lazy-store" element={<LazyStorePage />} />
                <Route path="/lazy-drop" element={<LazyDropPage />} />
                <Route path="/lazy-print" element={<LazyPrintPage />} />
                <Route path="/lazy-voice" element={<LazyVoicePage />} />
                <Route path="/lazy-voice-setup" element={<LazyVoiceSetup />} />
                <Route path="/lazy-voice-dashboard" element={<LazyVoiceDashboard />} />
                <Route path="/lazy-pay" element={<LazyPayPage />} />
                <Route path="/lazy-sms" element={<LazySmsPage />} />
                <Route path="/lazy-stream" element={<LazyStreamPage />} />
                <Route path="/lazy-stream-setup" element={<LazyStreamSetup />} />
                <Route path="/lazy-stream-dashboard" element={<LazyStreamDashboard />} />
                <Route path="/lazy-github" element={<LazyGitHubPage />} />
                <Route path="/lazy-run" element={<LazyRunPage />} />
                <Route path="/lazy-alert" element={<LazyAlertPage />} />
                <Route path="/lazy-gitlab" element={<LazyGitLabPage />} />
                <Route path="/lazy-supabase" element={<LazySupabasePage />} />
                <Route path="/lazy-telegram" element={<LazyTelegramPage />} />
                <Route path="/lazy-linear" element={<LazyLinearPage />} />
                <Route path="/lazy-contentful" element={<LazyContentfulPage />} />
                <Route path="/lazy-perplexity" element={<LazyPerplexityPage />} />
                <Route path="/lazy-crawl" element={<LazyCrawlPage />} />
                <Route path="/lazy-admin" element={<LazyAdminPage />} />
                <Route path="/lazy-granola" element={<LazyGranolaPage />} />
                <Route path="/lazy-granola-setup" element={<LazyGranolaSetup />} />
                <Route path="/lazy-youtube" element={<LazyYouTubePage />} />
                <Route path="/lazy-launch" element={<LazyLaunchPage />} />
                <Route path="/lazy-agents" element={<LazyAgentsPage />} />
                <Route path="/waitlist" element={<WaitlistPage />} />
                <Route path="/lazy-waitlist" element={<LazyWaitlistPage />} />
                <Route path="/lazy-watch" element={<LazyWatchPage />} />
                <Route path="/lazy-fix" element={<LazyFixPage />} />
                <Route path="/lazy-build" element={<LazyBuildPage />} />
                <Route path="/lazy-intel" element={<LazyIntelPage />} />
                <Route path="/lazy-repurpose" element={<LazyRepurposePage />} />
                <Route path="/lazy-trend" element={<LazyTrendPage />} />
                <Route path="/lazy-churn" element={<LazyChurnPage />} />
                <Route path="/lazy-cloud" element={<LazyCloudPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/autonomy" element={<AutonomyPage />} />
                <Route path="/lazy-security" element={<LazySecurityPage />} />
                <Route path="/lazy-mail" element={<LazyMailPage />} />
                <Route path="/lazy-design" element={<LazyDesignPage />} />
                <Route path="/lazy-auth" element={<LazyAuthPage />} />
                <Route path="/changelog" element={<ChangelogPage />} />
                <Route path="/upgrade-guide" element={<UpgradeGuidePage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/use-cases" element={<UseCasesPage />} />
                <Route path="/docs" element={<DocsLayout />}>
                  <Route index element={<DocsIntro />} />
                  <Route path="quickstart" element={<DocsQuickstart />} />
                  <Route path="how-it-works" element={<DocsHowItWorks />} />
                  <Route path="platform/launch" element={<DocsLaunch />} />
                  <Route path="platform/cloud" element={<DocsCloud />} />
                  <Route path="platform/run" element={<DocsRun />} />
                  <Route path="platform/admin" element={<DocsAdminPlatform />} />
                  <Route path="platform/waitlist" element={<DocsWaitlist />} />
                  <Route path="agents/content" element={<DocsContentAgents />} />
                  <Route path="agents/commerce" element={<DocsCommerceAgents />} />
                  <Route path="agents/media" element={<DocsMediaAgents />} />
                  <Route path="agents/dev" element={<DocsDevAgents />} />
                  <Route path="agents/ops" element={<DocsOpsAgents />} />
                  <Route path="admin/overview" element={<DocsAdminOverview />} />
                  <Route path="admin/settings" element={<DocsAdminSettings />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </PublicLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
