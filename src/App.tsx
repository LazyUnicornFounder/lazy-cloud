import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.tsx";
import LazyBloggerPage from "./pages/LazyBloggerPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import LazySeoPage from "./pages/LazySeoPage.tsx";
import LazySeoSetup from "./pages/LazySeoSetup.tsx";
import LazySeoDashboard from "./pages/LazySeoDashboard.tsx";
import LazyGeoPage from "./pages/LazyGeoPage.tsx";
import LazyStorePage from "./pages/LazyStorePage.tsx";
import LazyDropPage from "./pages/LazyDropPage.tsx";
import LazyPrintPage from "./pages/LazyPrintPage.tsx";

import LazyVoicePage from "./pages/LazyVoicePage.tsx";
import LazyVoiceSetup from "./pages/LazyVoiceSetup.tsx";
import LazyVoiceDashboard from "./pages/LazyVoiceDashboard.tsx";
import ListenPage from "./pages/ListenPage.tsx";
import LazyPayPage from "./pages/LazyPayPage.tsx";
import LazySmsPage from "./pages/LazySmsPage.tsx";
import LazyStreamPage from "./pages/LazyStreamPage.tsx";
import LazyStreamSetup from "./pages/LazyStreamSetup.tsx";
import LazyStreamDashboard from "./pages/LazyStreamDashboard.tsx";
import LazyGitHubPage from "./pages/LazyGitHubPage.tsx";
import LazyRunPage from "./pages/LazyRunPage.tsx";
import LazyAlertPage from "./pages/LazyAlertPage.tsx";
import LazyGitLabPage from "./pages/LazyGitLabPage.tsx";
import LazySupabasePage from "./pages/LazySupabasePage.tsx";
import LazyTelegramPage from "./pages/LazyTelegramPage.tsx";
import LazyLinearPage from "./pages/LazyLinearPage.tsx";
import LazyContentfulPage from "./pages/LazyContentfulPage.tsx";
import LazyPerplexityPage from "./pages/LazyPerplexityPage.tsx";
import LazyCrawlPage from "./pages/LazyCrawlPage.tsx";
import PricingPage from "./pages/PricingPage.tsx";
import AutonomyPage from "./pages/AutonomyPage.tsx";
import LazySecurityPage from "./pages/LazySecurityPage.tsx";
import LazyMailPage from "./pages/LazyMailPage.tsx";
import LazyDesignPage from "./pages/LazyDesignPage.tsx";
import LazyAuthPage from "./pages/LazyAuthPage.tsx";
import LazyAdminPage from "./pages/LazyAdminPage.tsx";
import LazyGranolaPage from "./pages/LazyGranolaPage.tsx";
import LazyGranolaSetup from "./pages/LazyGranolaSetup.tsx";
import LazyLaunchPage from "./pages/LazyLaunchPage.tsx";
import LazyYouTubePage from "./pages/LazyYouTubePage.tsx";
import LazyAgentsPage from "./pages/LazyAgentsPage.tsx";

import LazyWatchPage from "./pages/LazyWatchPage.tsx";
import LazyFixPage from "./pages/LazyFixPage.tsx";
import LazyBuildPage from "./pages/LazyBuildPage.tsx";
import LazyIntelPage from "./pages/LazyIntelPage.tsx";
import LazyRepurposePage from "./pages/LazyRepurposePage.tsx";
import LazyTrendPage from "./pages/LazyTrendPage.tsx";
import LazyChurnPage from "./pages/LazyChurnPage.tsx";

import ChangelogPage from "./pages/ChangelogPage.tsx";
import UpgradeGuidePage from "./pages/UpgradeGuidePage.tsx";
import HowItWorksPage from "./pages/HowItWorksPage.tsx";
import UseCasesPage from "./pages/UseCasesPage.tsx";
import PublicLayout from "./components/PublicLayout.tsx";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AgentPage from "./pages/admin/AgentPage";
import WaitlistPage from "./pages/WaitlistPage.tsx";
import LazyWaitlistPage from "./pages/LazyWaitlistPage.tsx";
import LazyCloudPage from "./pages/LazyCloudPage.tsx";

import DocsLayout from "./pages/docs/DocsLayout";
import DocsIntro from "./pages/docs/DocsIntro";
import DocsQuickstart from "./pages/docs/DocsQuickstart";
import DocsHowItWorks from "./pages/docs/DocsHowItWorks";
import { DocsContentAgents, DocsCommerceAgents, DocsMediaAgents, DocsDevAgents, DocsMonitorAgents, DocsIntelligenceAgents } from "./pages/docs/DocsAgents";
import { DocsAdminOverview, DocsAdminSettings } from "./pages/docs/DocsAdmin";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <PublicLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path=":agentSlug" element={<AgentPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PublicLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
