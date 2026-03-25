import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBody } from "@remotion/google-fonts/SpaceGrotesk";

const { fontFamily: displayFont } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadBody("normal", { weights: ["400", "500"], subsets: ["latin"] });

const stats = [
  { value: "$4.4T", label: "Addressable market" },
  { value: "72M", label: "New businesses yearly" },
  { value: "20+", label: "Autonomous engines" },
  { value: "0", label: "Employees needed" },
];

export const Scene4Stats = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a08" }}>
      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, hsla(45, 50%, 20%, 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", gap: 60 }}>
        {stats.map((stat, i) => {
          const delay = 5 + i * 18;
          const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 80, mass: 1.5 } });
          const scale = interpolate(s, [0, 1], [0.3, 1]);
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          const y = interpolate(s, [0, 1], [80, 0]);

          // Counter animation for numeric values
          let displayValue = stat.value;
          if (stat.value === "$4.4T") {
            const counter = interpolate(frame, [delay, delay + 40], [0, 4.4], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            displayValue = `$${counter.toFixed(1)}T`;
          } else if (stat.value === "72M") {
            const counter = interpolate(frame, [delay, delay + 40], [0, 72], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            displayValue = `${Math.round(counter)}M`;
          } else if (stat.value === "20+") {
            const counter = interpolate(frame, [delay, delay + 30], [0, 20], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            displayValue = `${Math.round(counter)}+`;
          }

          return (
            <div
              key={stat.label}
              style={{
                textAlign: "center",
                opacity,
                transform: `scale(${scale}) translateY(${y}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: displayFont,
                  fontSize: 100,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(180deg, #f0ead6, #c9b896)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1,
                }}
              >
                {displayValue}
              </div>
              <div
                style={{
                  fontFamily: bodyFont,
                  fontSize: 14,
                  letterSpacing: "0.2em",
                  color: "hsla(45, 50%, 89%, 0.4)",
                  textTransform: "uppercase",
                  marginTop: 12,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
