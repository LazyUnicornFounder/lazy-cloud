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
import LazyVoicePage from "./pages/LazyVoicePage.tsx";
import LazyVoiceSetup from "./pages/LazyVoiceSetup.tsx";
import LazyVoiceDashboard from "./pages/LazyVoiceDashboard.tsx";
import ListenPage from "./pages/ListenPage.tsx";
import LazyPayPage from "./pages/LazyPayPage.tsx";
import LazySmsPage from "./pages/LazySmsPage.tsx";
import LazyStreamPage from "./pages/LazyStreamPage.tsx";
import LazyStreamSetup from "./pages/LazyStreamSetup.tsx";
import LazyStreamDashboard from "./pages/LazyStreamDashboard.tsx";
import LazyCodePage from "./pages/LazyCodePage.tsx";
import LazyRunPage from "./pages/LazyRunPage.tsx";
import LazyAlertPage from "./pages/LazyAlertPage.tsx";
import LazyGitLabPage from "./pages/LazyGitLabPage.tsx";
import LazySupabasePage from "./pages/LazySupabasePage.tsx";
import LazyTelegramPage from "./pages/LazyTelegramPage.tsx";
import LazyLinearPage from "./pages/LazyLinearPage.tsx";
import LazyContentfulPage from "./pages/LazyContentfulPage.tsx";
import LazyPerplexityPage from "./pages/LazyPerplexityPage.tsx";
import PricingPage from "./pages/PricingPage.tsx";
import AutonomyPage from "./pages/AutonomyPage.tsx";
import PublicLayout from "./components/PublicLayout.tsx";

import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminOverview from "./pages/admin/AdminOverview.tsx";
import AdminBloggerPage from "./pages/admin/AdminBloggerPage.tsx";
import AdminSeoPage from "./pages/admin/AdminSeoPage.tsx";
import AdminGeoPage from "./pages/admin/AdminGeoPage.tsx";
import AdminStreamPage from "./pages/admin/AdminStreamPage.tsx";
import AdminVoicePage from "./pages/admin/AdminVoicePage.tsx";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage.tsx";
import AdminPlaceholderPage from "./pages/admin/AdminPlaceholderPage.tsx";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage.tsx";

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
                <Route path="analytics" element={<AdminAnalyticsPage />} />
                <Route path="blogger" element={<AdminBloggerPage />} />
                <Route path="seo" element={<AdminSeoPage />} />
                <Route path="geo" element={<AdminGeoPage />} />
                <Route path="store" element={<AdminPlaceholderPage name="Lazy Store" />} />
                <Route path="voice" element={<AdminVoicePage />} />
                <Route path="pay" element={<AdminPlaceholderPage name="Lazy Pay" />} />
                <Route path="sms" element={<AdminPlaceholderPage name="Lazy SMS" />} />
                <Route path="stream" element={<AdminStreamPage />} />
                <Route path="code" element={<AdminPlaceholderPage name="Lazy Code" />} />
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
              <Route path="/lazy-voice" element={<LazyVoicePage />} />
              <Route path="/lazy-voice-setup" element={<LazyVoiceSetup />} />
              <Route path="/lazy-voice-dashboard" element={<LazyVoiceDashboard />} />
              <Route path="/lazy-pay" element={<LazyPayPage />} />
              <Route path="/lazy-sms" element={<LazySmsPage />} />
              <Route path="/lazy-stream" element={<LazyStreamPage />} />
              <Route path="/lazy-stream-setup" element={<LazyStreamSetup />} />
              <Route path="/lazy-stream-dashboard" element={<LazyStreamDashboard />} />
              <Route path="/lazy-github" element={<LazyCodePage />} />
              <Route path="/lazy-run" element={<LazyRunPage />} />
              <Route path="/lazy-alert" element={<LazyAlertPage />} />
              <Route path="/lazy-gitlab" element={<LazyGitLabPage />} />
              <Route path="/lazy-supabase" element={<LazySupabasePage />} />
              <Route path="/lazy-telegram" element={<LazyTelegramPage />} />
              <Route path="/lazy-linear" element={<LazyLinearPage />} />
              <Route path="/lazy-contentful" element={<LazyContentfulPage />} />
              <Route path="/lazy-perplexity" element={<LazyPerplexityPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/autonomy" element={<AutonomyPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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