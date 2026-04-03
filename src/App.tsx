import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/ScrollToTop.tsx";

import Index from "./pages/Index.tsx";

const SignupPage = lazy(() => import("./pages/SignupPage.tsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage.tsx"));
const TermsPage = lazy(() => import("./pages/TermsPage.tsx"));
const DashboardLayout = lazy(() => import("./pages/dashboard/DashboardLayout.tsx"));
const DashboardOverview = lazy(() => import("./pages/dashboard/DashboardOverview.tsx"));
const DashboardFiles = lazy(() => import("./pages/dashboard/DashboardFiles.tsx"));
const DashboardTeam = lazy(() => import("./pages/dashboard/DashboardTeam.tsx"));
const DashboardSettings = lazy(() => import("./pages/dashboard/DashboardSettings.tsx"));
const DashboardClients = lazy(() => import("./pages/dashboard/DashboardClients.tsx"));
const DashboardClientDetail = lazy(() => import("./pages/dashboard/DashboardClientDetail.tsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview.tsx"));
const AdminSignups = lazy(() => import("./pages/AdminSignups.tsx"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess.tsx"));

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
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="files" element={<DashboardFiles />} />
                <Route path="clients" element={<DashboardClients />} />
                <Route path="clients/:clientId" element={<DashboardClientDetail />} />
                <Route path="team" element={<DashboardTeam />} />
                <Route path="settings" element={<DashboardSettings />} />
              </Route>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="signups" element={<AdminSignups />} />
              </Route>
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
