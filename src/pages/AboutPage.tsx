import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About | Lazy Cloud</title>
        <meta name="description" content="Lazy Unicorn is part of Lazy Factory Ventures." />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
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
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>
      </div>
    </>
  );
}
