import { Link } from "react-router-dom";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <Link to="/" className="font-display text-lg font-bold tracking-tight">Lazy Cloud</Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16 prose prose-invert prose-sm [&>h2]:mt-10">
        <h1 className="text-3xl font-bold font-display mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: April 3, 2026</p>

        <p>Lazy Cloud ("we", "us", "our") operates the Lazy Cloud platform. This policy explains how we collect, use, and protect your information.</p>

        <h2>1. Information We Collect</h2>
        <p><strong>Account information:</strong> name, email address, company name, industry, and password when you sign up.</p>
        <p><strong>Usage data:</strong> search queries, feature usage, login times, and browser/device information.</p>
        <p><strong>Uploaded content:</strong> documents and files you upload or connect to the platform for indexing.</p>
        <p><strong>Payment information:</strong> processed by our third-party payment provider. We do not store credit card numbers.</p>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide and maintain the Lazy Cloud service</li>
          <li>To index and make your documents searchable</li>
          <li>To communicate with you about your account and service updates</li>
          <li>To improve the platform based on usage patterns</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>3. Your Documents</h2>
        <p>Your documents are yours. We do not:</p>
        <ul>
          <li>Read, share, or sell your documents</li>
          <li>Use your documents to train AI models</li>
          <li>Access your documents except as required to provide the indexing service</li>
          <li>Retain your documents after you delete them or terminate your account</li>
        </ul>
        <p>Documents are stored in infrastructure you control (your own AWS S3 bucket or equivalent). We process document text solely to generate search indexes and embeddings.</p>

        <h2>4. Data Storage and Security</h2>
        <ul>
          <li>All data is encrypted at rest (AES-256) and in transit (TLS 1.2+)</li>
          <li>Documents are stored in your chosen cloud region</li>
          <li>Access is controlled by role-based permissions</li>
          <li>We maintain audit logs of all system access</li>
          <li>We conduct regular security assessments</li>
        </ul>

        <h2>5. Data Sharing</h2>
        <p>We do not sell your personal information. We share data only with:</p>
        <ul>
          <li>Service providers necessary to operate the platform (cloud hosting, payment processing, embedding APIs)</li>
          <li>Law enforcement when required by law</li>
          <li>Parties you explicitly authorize</li>
        </ul>

        <h2>6. Third-Party Services</h2>
        <p>Lazy Cloud uses the following third-party services to operate:</p>
        <ul>
          <li>Supabase (database and authentication)</li>
          <li>AWS S3 (file storage)</li>
          <li>Voyage AI (document embedding — text is processed but not stored)</li>
        </ul>
        <p>Each provider has their own privacy policy and data processing terms.</p>

        <h2>7. Data Retention</h2>
        <p>We retain your account information for as long as your account is active. When you delete your account:</p>
        <ul>
          <li>Account data is deleted within 30 days</li>
          <li>Document indexes and embeddings are deleted immediately</li>
          <li>Documents in your storage remain under your control</li>
        </ul>

        <h2>8. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Delete your account and all associated data</li>
          <li>Export your data</li>
          <li>Restrict processing of your data</li>
          <li>Object to processing of your data</li>
        </ul>
        <p>To exercise these rights, contact us at <a href="mailto:lazy@lazyunicorn.ai" className="text-primary hover:underline">lazy@lazyunicorn.ai</a>.</p>

        <h2>9. Cookies</h2>
        <p>We use essential cookies for authentication and session management. We do not use tracking or advertising cookies.</p>

        <h2>10. Children</h2>
        <p>Lazy Cloud is not intended for use by anyone under 18 years of age.</p>

        <h2>11. Changes to This Policy</h2>
        <p>We may update this policy from time to time. We will notify you of material changes by email or through the platform.</p>

        <h2>12. Contact Us</h2>
        <p>
          Lazy Cloud<br />
          Amman, Jordan<br />
          <a href="mailto:lazy@lazyunicorn.ai" className="text-primary hover:underline">lazy@lazyunicorn.ai</a>
        </p>
      </article>
    </div>
  );
}