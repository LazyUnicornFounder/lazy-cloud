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
import CompanyDetail from "./pages/CompanyDetail.tsx";
import NaivePage from "./pages/NaivePage.tsx";
import PolsiaPage from "./pages/PolsiaPage.tsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.tsx";
import GuidePage from "./pages/GuidePage.tsx";
import LaunchPage from "./pages/LaunchPage.tsx";
import AutonomyScale from "./pages/AutonomyScale.tsx";
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
import PricingPage from "./pages/PricingPage.tsx";

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
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/autonomy-scale" element={<AutonomyScale />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/launch" element={<LaunchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/lazy-blogger" element={<LazyBloggerPage />} />
            <Route path="/company/naive" element={<NaivePage />} />
            <Route path="/company/polsia" element={<PolsiaPage />} />
            <Route path="/company/:slug" element={<CompanyDetail />} />
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
            <Route path="/lazy-code" element={<LazyCodePage />} />
            <Route path="/lazy-run" element={<LazyRunPage />} />
            <Route path="/lazy-alert" element={<LazyAlertPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;