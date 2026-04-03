import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>About | Lazy Cloud</title>
        <meta name="description" content="Lazy Unicorn is part of Lazy Factory Ventures." />
      </Helmet>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-lg font-bold tracking-tight hover:text-primary transition-colors duration-300">Lazy Cloud</Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors duration-300">Home</Link>
            <Link to="/about" className="text-foreground transition-colors duration-300">About</Link>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-sm">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-sm">Sign in</Button>
              </Link>
            )}
            <Link to="/#pricing">
              <Button size="sm" className="text-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 pt-16">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-3xl font-bold font-display">About</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Lazy Unicorn is part of{" "}
            <a
              href="https://lazyfactoryventures.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
            >
              Lazy Factory Ventures
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
