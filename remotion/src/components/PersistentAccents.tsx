import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: Math.random() * 1920,
  y: Math.random() * 1080,
  size: 2 + Math.random() * 3,
  speed: 0.3 + Math.random() * 0.7,
  phase: Math.random() * Math.PI * 2,
}));

export const PersistentAccents = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {PARTICLES.map((p, i) => {
        const y = (p.y + frame * p.speed * 0.8) % 1180 - 50;
        const x = p.x + Math.sin(frame * 0.015 + p.phase) * 40;
        const opacity = interpolate(
          Math.sin(frame * 0.03 + p.phase),
          [-1, 1],
          [0.1, 0.5]
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: `hsla(45, 50%, 89%, ${opacity})`,
            }}
          />
        );
      })}

      {/* Horizontal scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 1,
          top: (frame * 2) % 1080,
          background: "linear-gradient(90deg, transparent 0%, hsla(45, 50%, 89%, 0.06) 50%, transparent 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
