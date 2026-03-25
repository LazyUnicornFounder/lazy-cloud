import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBody } from "@remotion/google-fonts/SpaceGrotesk";

const { fontFamily: displayFont } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadBody("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const Scene1Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "LAZY" flies in from left
  const lazyX = interpolate(
    spring({ frame, fps, config: { damping: 18, stiffness: 120 } }),
    [0, 1],
    [-800, 0]
  );
  const lazyOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // "UNICORN" flies in from right
  const unicornX = interpolate(
    spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 120 } }),
    [0, 1],
    [800, 0]
  );
  const unicornOpacity = interpolate(frame, [8, 20], [0, 1], { extrapolateRight: "clamp" });

  // Tagline fades up
  const tagY = interpolate(
    spring({ frame: frame - 30, fps, config: { damping: 25 } }),
    [0, 1],
    [60, 0]
  );
  const tagOpacity = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" });

  // Subtitle items stagger
  const subtitleItems = [
    "ONE PROMPT",
    "EVERYTHING RUNS ITSELF",
  ];

  // Pulse ring
  const ringScale = interpolate(frame, [50, 90], [0, 3], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const ringOpacity = interpolate(frame, [50, 90], [0.6, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Gentle float on the whole title
  const floatY = Math.sin(frame * 0.03) * 8;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a08", justifyContent: "center", alignItems: "center" }}>
      {/* Pulse ring */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          border: "1px solid hsla(45, 50%, 89%, 0.3)",
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />

      <div style={{ transform: `translateY(${floatY}px)`, textAlign: "center" }}>
        {/* LAZY */}
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 180,
            fontWeight: 800,
            color: "#f0ead6",
            letterSpacing: "-0.03em",
            lineHeight: 0.85,
            transform: `translateX(${lazyX}px)`,
            opacity: lazyOpacity,
          }}
        >
          Lazy
        </div>

        {/* UNICORN */}
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 180,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 0.85,
            transform: `translateX(${unicornX}px)`,
            opacity: unicornOpacity,
            background: "linear-gradient(135deg, #f0ead6, #c9b896)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Unicorn
        </div>

        {/* Divider line */}
        <div
          style={{
            width: interpolate(frame, [25, 50], [0, 400], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
            height: 1,
            background: "linear-gradient(90deg, transparent, hsla(45, 50%, 89%, 0.5), transparent)",
            margin: "30px auto",
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontFamily: bodyFont,
            fontSize: 18,
            letterSpacing: "0.35em",
            color: "hsla(45, 50%, 89%, 0.6)",
            textTransform: "uppercase",
            transform: `translateY(${tagY}px)`,
            opacity: tagOpacity,
          }}
        >
          The Autonomous Layer for Lovable
        </div>

        {/* Subtitle pulses */}
        <div style={{ marginTop: 40, display: "flex", gap: 30, justifyContent: "center" }}>
          {subtitleItems.map((text, i) => {
            const itemOpacity = interpolate(frame, [60 + i * 15, 75 + i * 15], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
            const itemY = interpolate(
              spring({ frame: frame - 60 - i * 15, fps, config: { damping: 20 } }),
              [0, 1],
              [30, 0]
            );
            return (
              <div
                key={text}
                style={{
                  fontFamily: bodyFont,
                  fontSize: 13,
                  letterSpacing: "0.25em",
                  color: "hsla(45, 50%, 89%, 0.4)",
                  textTransform: "uppercase",
                  opacity: itemOpacity,
                  transform: `translateY(${itemY}px)`,
                  padding: "8px 20px",
                  border: "1px solid hsla(45, 50%, 89%, 0.1)",
                  borderRadius: 100,
                }}
              >
                {text}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
