import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBody } from "@remotion/google-fonts/SpaceGrotesk";

const { fontFamily: displayFont } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadBody("normal", { weights: ["400", "500"], subsets: ["latin"] });

const engines = [
  { name: "Blogger", tagline: "Your blog writes itself", icon: "✍️" },
  { name: "SEO", tagline: "Rankings on autopilot", icon: "🔍" },
  { name: "GEO", tagline: "Get cited by AI", icon: "🧠" },
  { name: "Voice", tagline: "Every post, narrated", icon: "🎙️" },
  { name: "Store", tagline: "A store that runs itself", icon: "🏪" },
  { name: "Stream", tagline: "Streams become content", icon: "📺" },
  { name: "Pay", tagline: "Payments that optimise", icon: "💳" },
  { name: "GitHub", tagline: "Commits become changelogs", icon: "⚡" },
  { name: "Crawl", tagline: "Web intelligence", icon: "🕷️" },
  { name: "Alert", tagline: "Business in your Slack", icon: "🔔" },
  { name: "SMS", tagline: "Texts that convert", icon: "💬" },
  { name: "Security", tagline: "Ship safe, stay safe", icon: "🛡️" },
];

export const Scene3Engines = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(
    spring({ frame, fps, config: { damping: 20 } }),
    [0, 1],
    [-40, 0]
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a08" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "0 100px" }}>
        {/* Header */}
        <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, marginBottom: 50, textAlign: "center" }}>
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: 13,
              letterSpacing: "0.3em",
              color: "hsla(45, 50%, 89%, 0.4)",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            20+ Autonomous Engines
          </div>
          <div
            style={{
              fontFamily: displayFont,
              fontSize: 72,
              fontWeight: 800,
              color: "#f0ead6",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
            }}
          >
            Everything{" "}
            <span style={{ background: "linear-gradient(135deg, #f0ead6, #c9b896)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              runs itself
            </span>
            .
          </div>
        </div>

        {/* Engine grid */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", maxWidth: 1400, margin: "0 auto" }}>
          {engines.map((engine, i) => {
            const delay = 30 + i * 6;
            const s = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 150 } });
            const scale = interpolate(s, [0, 1], [0.5, 1]);
            const opacity = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            const rotate = interpolate(s, [0, 1], [10, 0]);

            // Subtle float
            const floatY = Math.sin((frame - delay) * 0.04 + i) * 3;

            return (
              <div
                key={engine.name}
                style={{
                  width: 220,
                  padding: "20px 24px",
                  border: "1px solid hsla(45, 10%, 16%, 1)",
                  borderRadius: 16,
                  background: "hsla(60, 3%, 6%, 0.8)",
                  opacity,
                  transform: `scale(${scale}) rotate(${rotate}deg) translateY(${floatY}px)`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{engine.icon}</span>
                  <div>
                    <div style={{ fontFamily: bodyFont, fontSize: 11, letterSpacing: "0.15em", color: "hsla(45, 50%, 89%, 0.4)", textTransform: "uppercase" }}>
                      Lazy
                    </div>
                    <div style={{ fontFamily: displayFont, fontSize: 20, fontWeight: 700, color: "#f0ead6", lineHeight: 1.1 }}>
                      {engine.name}
                    </div>
                  </div>
                </div>
                <div style={{ fontFamily: bodyFont, fontSize: 12, color: "hsla(45, 50%, 89%, 0.5)", letterSpacing: "0.03em" }}>
                  {engine.tagline}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
