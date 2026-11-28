"use client";

import type { DitherShaderProps } from "@/lib/dither";
import { DitherShader } from "@/lib/dither";

/**
 * A page-wide dithered starfield: sparse, dim stars with a slow twinkle,
 * plus one Rebel X-wing and one Imperial TIE patrolling the hero sky.
 * They trade small laser bolts from anywhere on their weave — red from
 * the Rebel, green from the Imperial. Meant to sit behind everything, so
 * every section shares the same sky.
 */

const PALETTE = ["--dither-paper", "#575757", "--dither-ink"] as const;

const SCENE = `
float dsDistSeg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}

float dsStarsTone(vec2 uv, vec2 res, float t) {
  vec2 p = vec2(uv.x * res.x / res.y, uv.y);
  vec2 scell = floor(p * res.y / 3.0);
  float sh = hash21(scell);
  float star = step(0.992, sh);
  float tw = 0.70 + 0.30 * sin(t * (0.15 + sh * 0.5) + sh * 61.0);
  return star * (0.16 + 0.34 * hash21(scell + 7.3)) * tw;
}

float dsTri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

vec2 dsRebelPos(float t) {
  float aspect = u_resolution.x / u_resolution.y;
  // The Rebel holds the left half of the hero sky, the Imperial the
  // right — they spawn apart on their own sides and duel across the
  // gap, weaving on different rhythms so passes keep changing.
  float y = 0.985 - 0.013 * dsTri(t * 0.030);
  float x = (0.26 + 0.10 * sin(t * 0.20 + 1.0)) * aspect;
  return vec2(x, y);
}

vec2 dsImperialPos(float t) {
  float aspect = u_resolution.x / u_resolution.y;
  float y = 0.988 - 0.012 * dsTri(t * 0.023 + 0.5);
  float x = (0.60 + 0.10 * sin(t * 0.16 + 4.0)) * aspect;
  return vec2(x, y);
}

// A fighter's local frame: which < 0.5 is the Rebel X-wing, otherwise the
// Imperial TIE. The nose points along travel and turns around at each end
// of the patrol.
vec2 dsFighterLocal(vec2 p, float t, float which) {
  vec2 pos = which < 0.5 ? dsRebelPos(t) : dsImperialPos(t);
  float s = which < 0.5 ? 0.011 : 0.013;
  vec2 lp = (p - pos) / s;
  if (which < 0.5) {
    lp = vec2(lp.y, -lp.x);
  } else {
    lp = vec2(-lp.y, lp.x);
  }
  float turning = which < 0.5
    ? (fract(t * 0.030) < 0.5 ? 1.0 : -1.0)
    : (fract(t * 0.023 + 0.5) < 0.5 ? -1.0 : 1.0);
  lp.x *= turning;
  float bank = 0.12 * cos(t * (which < 0.5 ? 0.045 : 0.038) + (which < 0.5 ? 1.3 : 4.2));
  lp = mat2(cos(bank), -sin(bank), sin(bank), cos(bank)) * lp;
  return lp;
}

// x: hull, y: engine glow for this fighter.
vec2 dsFighterBits(vec2 p, float t, float which) {
  vec2 lp = dsFighterLocal(p, t, which);
  float hull;
  float eng;
  if (which < 0.5) {
    // Rebel X-wing: dart body with a swept wing bar.
    float w = mix(0.50, 0.10, smoothstep(-0.85, 0.85, lp.x));
    float body = step(abs(lp.y), w) * (1.0 - smoothstep(0.80, 0.90, abs(lp.x)));
    float wing = (1.0 - smoothstep(0.10, 0.16, abs(lp.y + lp.x * 0.5)))
      * step(lp.x, 0.75) * step(-0.75, lp.x) * step(0.1, abs(lp.x));
    hull = max(body * 0.9, wing);
    vec2 gp = vec2((lp.x + 1.1) * 0.45, lp.y * 2.6);
    eng = exp(-dot(gp, gp) * 6.0);
  } else {
    // Imperial TIE: cockpit ball between two tall panels.
    float px = abs(lp.x);
    float panel = (smoothstep(0.34, 0.40, px) - smoothstep(0.62, 0.70, px))
      * (1.0 - smoothstep(0.28, 0.38, abs(lp.y)));
    float strut = smoothstep(0.16, 0.20, px) * (1.0 - smoothstep(0.36, 0.42, px))
      * (1.0 - smoothstep(0.06, 0.10, abs(lp.y)));
    float ball = 1.0 - smoothstep(0.18, 0.24, length(lp));
    hull = max(ball, max(panel, strut));
    vec2 gp = vec2((lp.x + 1.0) * 0.5, lp.y * 2.4);
    eng = exp(-dot(gp, gp) * 6.0);
  }
  return vec2(hull, eng);
}

// The duel: small bolts fly between the two patrols from anywhere on
// their weave, alternating sides. x: bolt amount, y: side firing —
// 0 rebel (red), 1 imperial (green).
vec2 dsLaser(vec2 p, float resY, float t) {
  vec2 pa = dsRebelPos(t);
  vec2 pb = dsImperialPos(t);
  float cycle = 1.25;
  float q = fract(t / cycle);
  float shooter = mod(floor(t / cycle), 2.0);
  vec2 from = shooter < 0.5 ? pa : pb;
  vec2 seg = (shooter < 0.5 ? pb : pa) - from;
  vec2 dir = seg / max(length(seg), 1e-4);
  float prog = clamp(q / 0.7, 0.0, 1.0);
  vec2 head = from + seg * prog;
  vec2 tail = head - dir * 0.025;
  float dB = dsDistSeg(p, tail, head);
  float bolt = (1.0 - smoothstep(0.45 / resY, 1.4 / resY, dB)) * step(q, 0.7);
  return vec2(bolt, shooter);
}
`;

const FIELD = `${SCENE}
float field(vec2 uv, vec2 res, float t) {
  vec2 p = vec2(uv.x * res.x / res.y, uv.y);
  float tone = dsStarsTone(uv, res, t);

  // A Rebel and an Imperial duel as their patrols cross the page.
  vec2 bitsA = dsFighterBits(p, t, 0.0);
  vec2 bitsB = dsFighterBits(p, t, 1.0);
  vec2 shot = dsLaser(p, res.y, t);
  float hullTone = mix(0.60, 0.10, smoothstep(0.30, 0.55, tone));
  tone = mix(tone, hullTone, max(bitsA.x, bitsB.x));
  tone = max(tone, max(bitsA.y, bitsB.y) * 0.75);
  tone = max(tone, shot.x * 0.95);
  return clamp(tone, 0.0, 1.0);
}
`;

const COLOR_FIELD = `${SCENE}
vec4 colorField(vec2 uv, vec2 res, float t) {
  vec2 p = vec2(uv.x * res.x / res.y, uv.y);
  vec3 col = paletteColor(dsStarsTone(uv, res, t)).rgb;
  vec2 bitsA = dsFighterBits(p, t, 0.0);
  vec2 bitsB = dsFighterBits(p, t, 1.0);
  vec2 shot = dsLaser(p, res.y, t);
  // Rebel engines and lasers burn red; the Empire's burn green.
  col = mix(col, vec3(1.0, 0.40, 0.30), clamp(bitsA.y * 1.3, 0.0, 0.9));
  col = mix(col, vec3(0.45, 1.0, 0.60), clamp(bitsB.y * 1.3, 0.0, 0.9));
  vec3 boltCol = shot.y < 0.5 ? vec3(1.0, 0.25, 0.20) : vec3(0.40, 1.0, 0.50);
  col = mix(col, boltCol, clamp(shot.x * 1.5, 0.0, 1.0));
  return vec4(col, 1.0);
}
`;

export type DitherStarsProps = Omit<
  DitherShaderProps,
  "field" | "colorField" | "uniforms" | "fallback"
> & {};

export const DitherStars = ({
  cell = 2,
  matrix = "bayer8",
  levels = 7,
  stillTime = 10.44,
  speed = 0.85,
  palette = PALETTE,
  ...props
}: DitherStarsProps) => (
  <DitherShader
    {...props}
    field={FIELD}
    colorField={COLOR_FIELD}
    palette={palette}
    matrix={matrix}
    cell={cell}
    levels={levels}
    stillTime={stillTime}
    speed={speed}
    fallback={
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.45), transparent 60%)",
            "radial-gradient(2px 2px at 70% 60%, rgba(255,255,255,0.30), transparent 60%)",
            "radial-gradient(2px 2px at 40% 80%, rgba(255,255,255,0.35), transparent 60%)",
            "radial-gradient(2px 2px at 85% 15%, rgba(255,255,255,0.40), transparent 60%)",
            "radial-gradient(2px 2px at 10% 70%, rgba(255,255,255,0.30), transparent 60%)",
          ].join(", "),
        }}
      />
    }
  />
);
