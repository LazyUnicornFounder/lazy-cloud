import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBody } from "@remotion/google-fonts/SpaceGrotesk";

const { fontFamily: displayFont } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadBody("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const Scene5CTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Multiple pulse rings
  const rings = [0, 15, 30];

  // Title animation
  const titleS = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const titleScale = interpolate(titleS, [0, 1], [0.6, 1]);
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // URL
  const urlOpacity = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" });
  const urlY = interpolate(
    spring({ frame: frame - 40, fps, config: { damping: 20 } }),
    [0, 1],
    [30, 0]
  );

  // Final flash
  const flashOpacity = interpolate(frame, [0, 5, 8], [0.3, 0, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a08", justifyContent: "center", alignItems: "center" }}>
      {/* Flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#f0ead6",
          opacity: flashOpacity,
        }}
      />

      {/* Pulse rings */}
      {rings.map((delay, i) => {
        const ringProgress = interpolate(frame, [delay, delay + 90], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        const ringScale = interpolate(ringProgress, [0, 1], [0.5, 4]);
        const ringOpacity = interpolate(ringProgress, [0, 0.3, 1], [0, 0.3, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              border: "1px solid hsla(45, 50%, 89%, 0.4)",
              transform: `scale(${ringScale})`,
              opacity: ringOpacity,
            }}
          />
        );
      })}

      {/* Big accent glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(45, 50%, 30%, 0.2) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div style={{ textAlign: "center", transform: `scale(${titleScale})`, opacity: titleOpacity }}>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 110,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 0.9,
            color: "#f0ead6",
          }}
        >
          Make it
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontSize: 110,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 0.9,
            background: "linear-gradient(135deg, #f0ead6, #d4c494, #f0ead6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          autonomous.
        </div>
      </div>

      {/* URL */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          opacity: urlOpacity,
          transform: `translateY(${urlY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: bodyFont,
            fontSize: 20,
            letterSpacing: "0.3em",
            color: "hsla(45, 50%, 89%, 0.6)",
            textTransform: "uppercase",
          }}
        >
          lazyunicorn.ai
        </div>
      </div>

      {/* Corner marks */}
      {[
        { top: 60, left: 60 },
        { top: 60, right: 60 },
        { bottom: 60, left: 60 },
        { bottom: 60, right: 60 },
      ].map((pos, i) => {
        const markOpacity = interpolate(frame, [55 + i * 5, 65 + i * 5], [0, 0.3], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              width: 30,
              height: 30,
              borderTop: i < 2 ? "1px solid hsla(45, 50%, 89%, 0.3)" : "none",
              borderBottom: i >= 2 ? "1px solid hsla(45, 50%, 89%, 0.3)" : "none",
              borderLeft: i % 2 === 0 ? "1px solid hsla(45, 50%, 89%, 0.3)" : "none",
              borderRight: i % 2 === 1 ? "1px solid hsla(45, 50%, 89%, 0.3)" : "none",
              opacity: markOpacity,
            } as any}
          />
        );
      })}
    </AbsoluteFill>
  );
};
