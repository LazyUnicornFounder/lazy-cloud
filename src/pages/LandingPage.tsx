import { Link } from "react-router-dom";
import { Cloud, Search, FileText, Upload, Brain, Shield, Globe, BookMarked, MessageSquare, Lock, CheckCircle, ArrowRight, Building2, Scale, Landmark, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Files indexed", value: "55,000+" },
  { label: "Processed", value: "61GB" },
  { label: "Setup time", value: "One afternoon" },
  { label: "Languages", value: "English & Arabic" },
];

const steps = [
  { icon: Upload, title: "Upload your files", desc: "Connect existing storage or upload directly. Supports PDF, Word, Excel, CAD, images, and more." },
  { icon: Brain, title: "We index everything", desc: "AI reads, chunks, and embeds every document. Full semantic search across your entire archive." },
  { icon: Search, title: "Ask anything", desc: "Search in plain language. Get exact files, page numbers, and AI-powered answers with citations." },
];

const useCases = [
  { icon: Building2, title: "Construction & Engineering", desc: "Find that FIDIC clause in seconds, not hours." },
  { icon: Scale, title: "Legal", desc: "Search 25 years of court decisions and contracts simultaneously." },
  { icon: Building, title: "Corporate", desc: "Every policy, procedure, and memo — instantly searchable." },
  { icon: Landmark, title: "Government", desc: "Decades of records, one search bar." },
];

const features = [
  { icon: Search, title: "Semantic search", desc: "Understands meaning, not just keywords." },
  { icon: Globe, title: "Arabic + English", desc: "RTL built in. Search in either language." },
  { icon: FileText, title: "PDF preview", desc: "View results with page highlighting." },
  { icon: BookMarked, title: "Bookmarks & collections", desc: "Save and organise important findings." },
  { icon: MessageSquare, title: "Chat with citations", desc: "Ask questions, get answers with sources." },
  { icon: Lock, title: "Your data stays yours", desc: "Client-owned infrastructure." },
];

const pricing = [
  { name: "Starter", price: "$499", period: "/month", features: ["Up to 50GB", "50,000 files", "5 users", "Email support"], cta: "Start Free Trial", highlight: false },
  { name: "Professional", price: "$999", period: "/month", features: ["Up to 500GB", "500,000 files", "25 users", "Priority support", "Custom branding"], cta: "Start Free Trial", highlight: true },
  { name: "Enterprise", price: "Custom", period: "", features: ["Unlimited everything", "On-premise option", "Dedicated support", "SLA"], cta: "Contact Us", highlight: false },
];

const testimonials = [
  { name: "Ahmad Al-Hassan", title: "Director of Engineering", company: "Gulf Construction Co.", quote: "We had 25 years of documents scattered across drives. Now our engineers find exactly what they need in seconds." },
  { name: "Sarah Mitchell", title: "Legal Operations Manager", company: "Sterling Law Group", quote: "Lazy Cloud transformed how our team handles case research. What used to take days now takes minutes." },
  { name: "Omar Khalil", title: "IT Director", company: "Ministry of Infrastructure", quote: "The Arabic language support was a game-changer for us. Finally, a tool that understands our documents natively." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Link to="/" className="flex items-center gap-2">
            <Cloud className="h-7 w-7 text-primary" />
            <span className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Lazy Cloud</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#security" className="hover:text-foreground transition-colors">Security</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            25 Years of Documents.{" "}
            <span className="text-primary">One Search.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Turn your company's file archive into an AI-powered search assistant. Ask questions in plain English or Arabic — get the exact file and page number.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="text-base px-8 h-12">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-base px-8 h-12" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
              See Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/50">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {stats.map((s) => (
            <div key={s.label} className="text-center py-8 px-4">
              <div className="text-2xl md:text-3xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">How It Works</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">Three steps to unlock your entire document archive.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-sm font-semibold text-primary mb-2">Step {i + 1}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">Built for Document-Heavy Industries</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">Every industry has archives. We make them searchable.</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {useCases.map((uc) => (
              <Card key={uc.title} className="border border-border bg-card">
                <CardContent className="p-8">
                  <uc.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">{uc.title}</h3>
                  <p className="text-muted-foreground text-sm">{uc.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">Everything You Need</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">Powerful features built for enterprise document management.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                <f.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-bold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-24 px-6 bg-foreground text-background">
        <div className="container mx-auto max-w-4xl text-center">
          <Shield className="h-12 w-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Your Data, Your Servers, Your Keys.</h2>
          <p className="text-lg opacity-70 max-w-2xl mx-auto mb-10">
            We deploy on your infrastructure. Client-owned AWS and database accounts. End-to-end encryption. SOC 2 compatible architecture. Full audit trails. NDA + DPA standard.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {["Client-owned infrastructure", "End-to-end encryption", "Full audit trails", "NDA + DPA standard"].map((item) => (
              <div key={item} className="flex items-center gap-2 justify-center">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">Simple Pricing</h2>
          <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">Start with a free trial. Scale as your archive grows.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((plan) => (
              <Card key={plan.name} className={`relative border ${plan.highlight ? "border-primary shadow-lg shadow-primary/10 ring-2 ring-primary" : "border-border"}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={plan.name === "Enterprise" ? "#" : "/signup"}>
                    <Button className="w-full" variant={plan.highlight ? "default" : "outline"}>
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-16">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border border-border">
                <CardContent className="p-8">
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic">"{t.quote}"</p>
                  <div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <span className="text-sm font-bold text-primary">{t.name.charAt(0)}</span>
                    </div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.title}, {t.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-primary" />
            <span className="font-bold">Lazy Cloud</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#security" className="hover:text-foreground transition-colors">Security</a>
            <span className="cursor-default">Privacy Policy</span>
            <span className="cursor-default">Terms of Service</span>
          </nav>
          <div className="text-sm text-muted-foreground">© 2026 Lazy Cloud</div>
        </div>
      </footer>
    </div>
  );
}
