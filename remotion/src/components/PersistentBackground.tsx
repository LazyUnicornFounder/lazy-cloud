import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const PersistentBackground = () => {
  const frame = useCurrentFrame();

  const hueShift = interpolate(frame, [0, 750], [0, 60]);
  const pulse = Math.sin(frame * 0.02) * 0.15 + 0.85;

  return (
    <AbsoluteFill>
      {/* Slow rotating gradient orb */}
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) rotate(${frame * 0.3}deg)`,
          background: `radial-gradient(ellipse at 30% 40%, hsla(${40 + hueShift}, 50%, 15%, ${0.4 * pulse}) 0%, transparent 60%)`,
          filter: "blur(80px)",
        }}
      />
      {/* Secondary orb */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          right: -200,
          bottom: -200,
          transform: `rotate(${-frame * 0.2}deg)`,
          background: `radial-gradient(ellipse at 60% 60%, hsla(${20 + hueShift}, 40%, 10%, 0.5) 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      {/* Grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.3,
        }}
      />
    </AbsoluteFill>
  );
};
