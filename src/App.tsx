import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Admin from "./pages/Admin.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import CompanyDetail from "./pages/CompanyDetail.tsx";
import NaivePage from "./pages/NaivePage.tsx";
import PolsiaPage from "./pages/PolsiaPage.tsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.tsx";
import GuidePage from "./pages/GuidePage.tsx";
import LaunchPage from "./pages/LaunchPage.tsx";
import AutonomyScale from "./pages/AutonomyScale.tsx";
import NotFound from "./pages/NotFound.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

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
            <Route path="/admin" element={<Admin />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/autonomy-scale" element={<AutonomyScale />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/launch" element={<LaunchPage />} />
            <Route path="/company/naive" element={<NaivePage />} />
            <Route path="/company/polsia" element={<PolsiaPage />} />
            <Route path="/company/:slug" element={<CompanyDetail />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;