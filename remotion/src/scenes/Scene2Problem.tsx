import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBody } from "@remotion/google-fonts/SpaceGrotesk";

const { fontFamily: displayFont } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadBody("normal", { weights: ["400", "500"], subsets: ["latin"] });

const problems = [
  "Your blog is empty.",
  "Your SEO is stale.",
  "AI doesn't know you exist.",
  "You're doing everything manually.",
];

export const Scene2Problem = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = interpolate(
    spring({ frame, fps, config: { damping: 15, stiffness: 100 } }),
    [0, 1],
    [1.3, 1]
  );
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a08" }}>
      {/* Red accent glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, hsla(0, 70%, 40%, 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "0 140px" }}>
        {/* Title */}
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 90,
            fontWeight: 800,
            color: "#f0ead6",
            letterSpacing: "-0.02em",
            lineHeight: 0.95,
            transform: `scale(${titleScale})`,
            opacity: titleOpacity,
            marginBottom: 50,
          }}
        >
          The problem<br />
          with <span style={{ color: "hsl(0, 84%, 60%)" }}>doing it all</span>.
        </div>

        {/* Problem items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {problems.map((text, i) => {
            const delay = 25 + i * 12;
            const itemOpacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            const itemX = interpolate(
              spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 150 } }),
              [0, 1],
              [-60, 0]
            );
            const barWidth = interpolate(frame, [delay, delay + 20], [0, 200 + i * 60], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

            return (
              <div key={text} style={{ opacity: itemOpacity, transform: `translateX(${itemX}px)`, display: "flex", alignItems: "center", gap: 20 }}>
                <div
                  style={{
                    height: 3,
                    width: barWidth,
                    background: `linear-gradient(90deg, hsl(0, 84%, 60%), transparent)`,
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: bodyFont,
                    fontSize: 22,
                    color: "hsla(45, 50%, 89%, 0.7)",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
