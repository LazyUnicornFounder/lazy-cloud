interface AgentCard {
  name: string;
  description: string;
  apiKeys?: string;
}

function AgentCardGrid({ agents }: { agents: AgentCard[] }) {
  return (
    <div className="space-y-3">
      {agents.map((a) => (
        <div key={a.name} id={a.name.toLowerCase().replace(/\s+/g, "-")} className="p-4 rounded-lg transition-colors"
          style={{ border: "1px solid rgba(240,234,214,0.08)", background: "rgba(240,234,214,0.02)" }}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[15px] font-bold" style={{ color: "#f0ead6" }}>{a.name}</h3>
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded"
              style={a.apiKeys
                ? { background: "rgba(248,113,113,0.1)", color: "#f87171" }
                : { background: "rgba(74,222,128,0.1)", color: "#4ade80" }
              }>
              {a.apiKeys ? "API KEY REQUIRED" : "NO API KEYS"}
            </span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(240,234,214,0.55)", lineHeight: 1.6 }}>{a.description}</p>
          {a.apiKeys && <p className="mt-2" style={{ fontSize: 12, color: "rgba(240,234,214,0.35)" }}>Requires: {a.apiKeys}</p>}
        </div>
      ))}
    </div>
  );
}

export function DocsContentAgents() {
  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Content Agents</h1>
      <p className="mb-8" style={{ fontSize: 14, color: "rgba(240,234,214,0.45)" }}>7 agents that publish and optimise content automatically.</p>
      <AgentCardGrid agents={[
        { name: "Lazy Blogger", description: "Publishes SEO blog posts on a schedule. Pulls topics from your product catalogue or keyword list." },
        { name: "Lazy SEO", description: "Discovers high-opportunity keywords and writes posts targeting them. Tracks coverage and queue." },
        { name: "Lazy GEO", description: "Gets your content cited by ChatGPT, Claude, and Perplexity. Finds the questions AI models answer in your niche and writes authoritative answers." },
        { name: "Lazy Crawl", description: "Crawls competitor sites for intelligence. Extracts insights and leads, then publishes findings as content." },
        { name: "Lazy Perplexity", description: "Uses Perplexity API for deep research and publishes well-sourced articles. Tracks brand citation rate." },
        { name: "Lazy Repurpose", description: "Takes your blog posts and turns them into LinkedIn posts, tweet threads, and email copy." },
        { name: "Lazy Trend", description: "Monitors trending topics in your niche and seeds them into SEO and GEO automatically." },
      ]} />
    </div>
  );
}

export function DocsCommerceAgents() {
  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Commerce Agents</h1>
      <p className="mb-8" style={{ fontSize: 14, color: "rgba(240,234,214,0.45)" }}>7 agents that automate your store, payments, and customer communication.</p>
      <AgentCardGrid agents={[
        { name: "Lazy Store", description: "Discovers and lists products, creates promotional content, and optimises product pages.", apiKeys: "Shopify credentials" },
        { name: "Lazy Drop", description: "Syncs dropshipping products from AutoDS and publishes content for each.", apiKeys: "AutoDS API key" },
        { name: "Lazy Print", description: "Syncs print-on-demand products from Printful and creates content.", apiKeys: "Printful API key" },
        { name: "Lazy Pay", description: "Manages Stripe payments, tracks MRR, and runs abandoned checkout recovery.", apiKeys: "Stripe secret key" },
        { name: "Lazy Mail", description: "Sends email campaigns via Resend. Tracks open and click rates.", apiKeys: "Resend API key" },
        { name: "Lazy SMS", description: "Sends SMS sequences via Twilio. Tracks delivery and opt-outs.", apiKeys: "Twilio credentials" },
        { name: "Lazy Churn", description: "Monitors user behaviour for churn signals and triggers retention actions automatically." },
      ]} />
    </div>
  );
}

export function DocsMediaAgents() {
  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Media Agents</h1>
      <p className="mb-8" style={{ fontSize: 14, color: "rgba(240,234,214,0.45)" }}>3 agents that turn your content into audio, clips, and video intelligence.</p>
      <AgentCardGrid agents={[
        { name: "Lazy Voice", description: "Narrates every blog post with ElevenLabs and embeds the audio player automatically.", apiKeys: "ElevenLabs API key" },
        { name: "Lazy Stream", description: "Processes Twitch recordings into clip highlights and publishes them as content.", apiKeys: "Twitch Client ID & Secret" },
        { name: "Lazy YouTube", description: "Syncs your YouTube channel — extracts comments, generates summaries, publishes content from each video.", apiKeys: "YouTube channel ID" },
      ]} />
    </div>
  );
}

export function DocsDevAgents() {
  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Dev Agents</h1>
      <p className="mb-8" style={{ fontSize: 14, color: "rgba(240,234,214,0.45)" }}>7 agents that connect your dev tools and turn activity into content.</p>
      <AgentCardGrid agents={[
        { name: "Lazy Code", description: "Turns GitHub commits and releases into blog posts and a public roadmap.", apiKeys: "GitHub token" },
        { name: "Lazy GitLab", description: "Same as Lazy Code but for GitLab.", apiKeys: "GitLab token" },
        { name: "Lazy Linear", description: "Syncs Linear issues into a public roadmap and generates velocity reports.", apiKeys: "Linear API key" },
        { name: "Lazy Contentful", description: "Pulls entries from Contentful and keeps your site in sync.", apiKeys: "Contentful API key" },
        { name: "Lazy Design", description: "Upgrades your site's design components automatically." },
        { name: "Lazy Auth", description: "Manages user accounts and roles with an inline user table in the admin." },
        { name: "Lazy Granola", description: "Syncs meeting notes from Granola and publishes summaries.", apiKeys: "Granola API key" },
      ]} />
    </div>
  );
}

export function DocsMonitorAgents() {
  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Monitor Agents</h1>
      <p className="mb-8" style={{ fontSize: 14, color: "rgba(240,234,214,0.45)" }}>5 agents that keep your stack healthy.</p>
      <AgentCardGrid agents={[
        { name: "Lazy Alert", description: "Sends Slack alerts when something goes wrong. Configurable per-event toggles." },
        { name: "Lazy Telegram", description: "Sends daily briefings and real-time alerts to a Telegram bot." },
        { name: "Lazy Supabase", description: "Monitors your database — tracks signups, milestones, and sends weekly reports." },
        { name: "Lazy Security", description: "Runs automated security scans with Aikido. Tracks your score and open vulnerabilities.", apiKeys: "Aikido API key" },
        { name: "Lazy Watch", description: "Monitors all agents for errors and opens GitHub issues automatically when something fails.", apiKeys: "GitHub token" },
      ]} />
    </div>
  );
}

export function DocsIntelligenceAgents() {
  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Intelligence Agents</h1>
      <p className="mb-8" style={{ fontSize: 14, color: "rgba(240,234,214,0.45)" }}>4 agents that improve your stack automatically.</p>
      <AgentCardGrid agents={[
        { name: "Lazy Fix", description: "Finds recurring bugs in your GitHub issues and opens pull requests with fixes.", apiKeys: "GitHub token" },
        { name: "Lazy Build", description: "Generates new agent prompts based on gaps in your stack.", apiKeys: "GitHub token" },
        { name: "Lazy Intel", description: "Generates weekly performance reports across all agents and seeds insights into your content agents." },
        { name: "Lazy Agents", description: "A bundle of all four intelligence agents in one install.", apiKeys: "GitHub token" },
      ]} />
    </div>
  );
}
