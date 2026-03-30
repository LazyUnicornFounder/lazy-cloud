import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <SEO title="Page Not Found" description="The page you are looking for does not exist or may have been moved. Head back to the homepage to explore all autonomous agents and features." noindex={true} />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-display font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground font-body">Page not found</p>
        <a href="/" className="text-foreground underline hover:opacity-70 font-body">Return to Home</a>
      </div>
    </main>
  );
};

export default NotFound;
