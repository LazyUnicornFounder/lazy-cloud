import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <Link to="/" className="font-display text-lg font-bold tracking-tight">Lazy Cloud</Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-16 prose prose-invert prose-sm [&>h2]:mt-10">
        <h1 className="text-3xl font-bold font-display mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Last updated: April 3, 2026</p>

        <p>These terms govern your use of Lazy Cloud, operated by Lazy Cloud ("we", "us", "our"). By using Lazy Cloud, you agree to these terms.</p>

        <h2>1. The Service</h2>
        <p>Lazy Cloud is a document indexing and search platform. We process your uploaded documents to create searchable indexes and provide AI-powered search and chat functionality.</p>

        <h2>2. Your Account</h2>
        <ul>
          <li>You must provide accurate information when creating an account</li>
          <li>You are responsible for maintaining the security of your account credentials</li>
          <li>You must be at least 18 years old to use the service</li>
          <li>One person or organization per account unless on a team plan</li>
          <li>You are responsible for all activity under your account</li>
        </ul>

        <h2>3. Your Data and Documents</h2>
        <ul>
          <li>You retain full ownership of all documents you upload or connect</li>
          <li>You grant us a limited license to process your documents solely for the purpose of providing the indexing and search service</li>
          <li>This license terminates when you delete your documents or close your account</li>
          <li>You are responsible for ensuring you have the right to upload and process the documents you provide</li>
        </ul>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Upload documents containing illegal content</li>
          <li>Attempt to access other users' data or documents</li>
          <li>Reverse engineer, decompile, or disassemble the platform</li>
          <li>Use the service to compete directly with Lazy Cloud</li>
          <li>Exceed your plan's storage or usage limits</li>
          <li>Share account credentials with unauthorized parties</li>
          <li>Use the platform for any unlawful purpose</li>
        </ul>

        <h2>5. Plans and Payment</h2>
        <ul>
          <li>Pricing is as listed on our website at the time of subscription</li>
          <li>Subscriptions are billed monthly or annually</li>
          <li>You may upgrade or downgrade your plan at any time</li>
          <li>Downgrades take effect at the end of the current billing period</li>
          <li>We may change pricing with 30 days notice</li>
        </ul>

        <h2>6. Free Trial</h2>
        <ul>
          <li>We may offer a free trial period</li>
          <li>No payment is required during the trial</li>
          <li>At the end of the trial, you must subscribe to continue using the service</li>
          <li>We may limit features or storage during the trial</li>
        </ul>

        <h2>7. Cancellation</h2>
        <ul>
          <li>You may cancel your subscription at any time</li>
          <li>Access continues until the end of the current billing period</li>
          <li>Upon cancellation, your document indexes will be deleted within 30 days</li>
          <li>Documents stored in your own infrastructure (S3, Google Drive) remain yours and are not affected</li>
        </ul>

        <h2>8. Service Availability</h2>
        <ul>
          <li>We aim for 99.9% uptime but do not guarantee it</li>
          <li>We may perform scheduled maintenance with reasonable notice</li>
          <li>We are not liable for downtime caused by your infrastructure providers (AWS, Supabase)</li>
        </ul>

        <h2>9. Data Security</h2>
        <ul>
          <li>We implement industry-standard security measures</li>
          <li>We encrypt all data at rest and in transit</li>
          <li>We will notify you of any data breach within 72 hours</li>
          <li>We conduct regular security assessments</li>
          <li>See our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for full details</li>
        </ul>

        <h2>10. Confidentiality</h2>
        <ul>
          <li>We treat all customer documents as confidential</li>
          <li>We execute NDAs and DPAs upon request at no additional cost</li>
          <li>Our employees access customer data only when necessary to provide support or maintain the service</li>
          <li>All employees are bound by confidentiality agreements</li>
        </ul>

        <h2>11. Intellectual Property</h2>
        <ul>
          <li>Lazy Cloud and its technology are owned by Lazy Cloud</li>
          <li>You retain all rights to your documents and data</li>
          <li>Feedback and suggestions you provide may be used to improve the platform without obligation</li>
        </ul>

        <h2>12. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law:</p>
        <ul>
          <li>Our total liability is limited to the amount you paid us in the 12 months preceding the claim</li>
          <li>We are not liable for indirect, incidental, special, or consequential damages</li>
          <li>We are not liable for loss of data in your own infrastructure</li>
          <li>We are not liable for the accuracy of AI-generated search results or summaries</li>
        </ul>

        <h2>13. Indemnification</h2>
        <p>You agree to indemnify Lazy Cloud against claims arising from:</p>
        <ul>
          <li>Your violation of these terms</li>
          <li>Your documents or content</li>
          <li>Your use of the service</li>
        </ul>

        <h2>14. Dispute Resolution</h2>
        <ul>
          <li>These terms are governed by the laws of the Hashemite Kingdom of Jordan</li>
          <li>Disputes will be resolved through arbitration in Amman, Jordan</li>
          <li>Both parties agree to attempt good faith negotiation before arbitration</li>
        </ul>

        <h2>15. Changes to These Terms</h2>
        <p>We may update these terms from time to time. Material changes will be communicated with 30 days notice. Continued use after changes constitutes acceptance.</p>

        <h2>16. Contact Us</h2>
        <p>
          Lazy Cloud<br />
          Amman, Jordan<br />
          <a href="mailto:lazy@lazyunicorn.ai" className="text-primary hover:underline">lazy@lazyunicorn.ai</a>
        </p>
      </article>
    </div>
  );
}