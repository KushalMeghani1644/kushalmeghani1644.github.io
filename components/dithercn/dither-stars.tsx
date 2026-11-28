"use client";

import type { DitherShaderProps } from "@/lib/dither";
import { DitherShader } from "@/lib/dither";

/**
 * A page-wide dithered starfield: sparse, dim stars with a slow twinkle,
 * and a four-ship dogfight roaming the whole document — two dueling
 * pairs, a Rebel X-wing against an Imperial TIE and a Rebel A-wing
 * against a TIE interceptor. Each pair drifts on a slow Lissajous from
 * hero to footer, so fights break out anywhere on the page, while the
 * two ships hold station far apart on wide opposing sweeps, sniping
 * laser bolts across the gap from wherever they happen to be: bolts fire
 * from the nose guns with per-shot aim error that widens with range,
 * some connect and flare, the rest whip past into the dark, and every
 * so often the pair collapses into a close strafing pass.
 *
 * Ships and bolts burn bright in the open margins and fade to faint
 * embers behind the reading column, so the fight never hurts content
 * readability.
 *
 * Uniforms (measured by the page): `pxScale` is one CSS pixel in field
 * units, `shipSize` the fighters' length in CSS pixels, `contentBand`
 * the reading column as [left, right] uv.x fractions, and `dimFloor`
 * how far ships and bolts fade inside that column.
 */

const PALETTE = ["--dither-paper", "#575757", "--dither-ink"] as const;

const SCENE = `
float dsDistSeg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}

float dsCapsule(vec2 p, vec2 a, vec2 b, float r) {
  return 1.0 - smoothstep(r - 0.05, r + 0.05, dsDistSeg(p, a, b));
}

float dsEllipse(vec2 p, vec2 c, vec2 radii) {
  return 1.0 - smoothstep(0.85, 1.0, length((p - c) / radii));
}

float dsBox(vec2 p, vec2 lo, vec2 hi, float soft) {
  vec2 d = max(lo - p, p - hi);
  return 1.0 - smoothstep(-soft, soft, max(d.x, d.y));
}

float dsStarsTone(vec2 uv, vec2 res, float t) {
  vec2 p = vec2(uv.x * res.x / res.y, uv.y);
  vec2 scell = floor(p * res.y / 3.0);
  float sh = hash21(scell);
  float star = step(0.992, sh);
  float tw = 0.70 + 0.30 * sin(t * (0.15 + sh * 0.5) + sh * 61.0);
  return star * (0.16 + 0.34 * hash21(scell + 7.3)) * tw;
}

// Faction liveries: Rebel red, Imperial green, wraith amber, ice blue.
vec3 dsFactionColor(float i) {
  if (i < 0.5) { return vec3(1.00, 0.42, 0.32); }
  if (i < 1.5) { return vec3(0.45, 1.00, 0.55); }
  if (i < 2.5) { return vec3(1.00, 0.72, 0.30); }
  return vec3(0.55, 0.85, 1.00);
}

// Ships burn at full strength away from the reading column and fade to
// faint embers behind the text, so the dogfight never hurts readability.
float dsCalm(vec2 p) {
  float aspect = u_resolution.x / u_resolution.y;
  float x = p.x / aspect;
  float d = max(contentBand.x - x, x - contentBand.y);
  float inside = 1.0 - smoothstep(0.0, 0.018, d);
  return 1.0 - inside;
}

// Each dueling pair drifts on a slow Lissajous across the whole document,
// so dogfights break out everywhere, hero to footer.
vec2 dsPatrol(float t, float k) {
  float aspect = u_resolution.x / u_resolution.y;
  float a = k * 8.6 + 2.4;
  float x = 0.5 + 0.26 * sin(t * 0.062 + a) + 0.09 * sin(t * 0.117 + a * 2.7);
  float y = 0.5 + 0.26 * sin(t * 0.056 + a * 3.1) + 0.09 * sin(t * 0.105 + a * 5.3);
  return vec2(x * aspect, y);
}

// One axis of a soft wall: identity inside [lo, hi], eased onto the bound
// outside, so ships slide along the page edges instead of escaping them.
float dsWall(float v, float lo, float hi, float soft) {
  float below = 1.0 - smoothstep(lo - soft, lo, v);
  float above = smoothstep(hi, hi + soft, v);
  return v - (v - lo) * below - (v - hi) * above;
}

// Fighter i sweeps a wide, slow orbit around its pair's drifting centre,
// roughly opposite its partner — they duel at long range, closing only
// for the occasional strafing pass. A private weave keeps the paths from
// ever repeating.
vec2 dsFighterPos(float t, float i) {
  float k = floor(i * 0.5);
  vec2 pos = dsPatrol(t, k);
  float r = 0.14 + 0.075 * sin(t * 0.13 + i * 2.0);
  if (k > 0.5) { r *= 0.9; }
  float ang = (0.26 + 0.11 * i) * t + i * 2.4;
  pos += r * vec2(cos(ang), sin(ang));
  pos += 0.016 * vec2(sin(t * 0.31 + i * 5.1), cos(t * 0.27 + i * 3.3));
  // Soft walls: the wide orbits slide along the page edges instead of
  // flying off-canvas.
  float aspect = u_resolution.x / u_resolution.y;
  pos = vec2(
    dsWall(pos.x, 0.05, aspect - 0.05, 0.10),
    dsWall(pos.y, 0.05, 0.95, 0.10)
  );
  return pos;
}

// Velocity, analytic, for pointing noses along the flight path and for
// trail lengths.
vec2 dsFighterVel(float t, float i) {
  float k = floor(i * 0.5);
  float aspect = u_resolution.x / u_resolution.y;
  float a = k * 8.6 + 2.4;
  vec2 dc = vec2(
    (0.26 * 0.062 * cos(t * 0.062 + a) + 0.09 * 0.117 * cos(t * 0.117 + a * 2.7)) * aspect,
    0.26 * 0.056 * cos(t * 0.056 + a * 3.1) + 0.09 * 0.105 * cos(t * 0.105 + a * 5.3)
  );
  float r = 0.14 + 0.075 * sin(t * 0.13 + i * 2.0);
  float dr = 0.075 * 0.13 * cos(t * 0.13 + i * 2.0);
  if (k > 0.5) { r *= 0.9; dr *= 0.9; }
  float w = 0.26 + 0.11 * i;
  float ang = w * t + i * 2.4;
  vec2 radial = vec2(cos(ang), sin(ang));
  vec2 tangent = vec2(-sin(ang), cos(ang));
  vec2 weave = 0.016 * vec2(0.31 * cos(t * 0.31 + i * 5.1), -0.27 * sin(t * 0.27 + i * 3.3));
  return dc + r * (w * tangent + dr * radial) + weave;
}

// A fighter's local frame: nose along motion, +x forward, +y to port.
vec2 dsFighterLocal(vec2 p, float t, float i) {
  float hs = shipSize * 0.45 * pxScale;
  vec2 v = dsFighterVel(t, i);
  float speed = max(length(v), 1e-5);
  vec2 n = v / speed;
  vec2 q = p - dsFighterPos(t, i);
  vec2 lp = vec2(dot(q, n), dot(q, vec2(-n.y, n.x))) / hs;
  float bank = 0.10 * sin(t * (0.5 + 0.07 * i) + i * 1.7);
  lp = mat2(cos(bank), -sin(bank), sin(bank), cos(bank)) * lp;
  return lp;
}

// Rebel X-wing: slim dart fuselage, four spread S-foils, tip cannons.
vec3 dsShapeXWing(vec2 lp) {
  float w = mix(0.19, 0.08, smoothstep(-1.05, 1.15, lp.x));
  float hull = dsBox(lp, vec2(-1.05, -w), vec2(1.15, w), 0.04);
  hull = max(hull, dsBox(lp, vec2(-1.16, -0.15), vec2(-0.96, 0.15), 0.03));
  hull *= 1.0 - 0.85 * dsEllipse(lp, vec2(0.45, 0.0), vec2(0.17, 0.09));
  hull = max(hull, dsCapsule(lp, vec2(-0.05, 0.11), vec2(-0.80, 0.46), 0.07));
  hull = max(hull, dsCapsule(lp, vec2(-0.05, -0.11), vec2(-0.80, -0.46), 0.07));
  hull = max(hull, dsCapsule(lp, vec2(-0.28, 0.11), vec2(-0.95, 0.64), 0.07));
  hull = max(hull, dsCapsule(lp, vec2(-0.28, -0.11), vec2(-0.95, -0.64), 0.07));
  hull = max(hull, dsCapsule(lp, vec2(-0.80, 0.46), vec2(-0.25, 0.56), 0.03));
  hull = max(hull, dsCapsule(lp, vec2(-0.80, -0.46), vec2(-0.25, -0.56), 0.03));
  hull = max(hull, dsCapsule(lp, vec2(-0.95, 0.64), vec2(-0.40, 0.72), 0.03));
  hull = max(hull, dsCapsule(lp, vec2(-0.95, -0.64), vec2(-0.40, -0.72), 0.03));
  float glow = exp(-pow(dsDistSeg(lp, vec2(-1.05, -0.10), vec2(-1.05, 0.10)), 2.0) * 120.0);
  return vec3(hull, glow, 0.0);
}

// Imperial TIE: cockpit ball between two tall hex panels, chin cannons.
vec3 dsShapeTIE(vec2 lp) {
  float hull = 1.0 - smoothstep(0.27, 0.31, length(lp));
  hull = max(hull, dsCapsule(lp, vec2(0.20, 0.0), vec2(0.68, 0.0), 0.045));
  hull = max(hull, dsCapsule(lp, vec2(-0.20, 0.0), vec2(-0.68, 0.0), 0.045));
  float px = abs(lp.x) - 0.92;
  float halfH = 0.50 - smoothstep(0.05, 0.18, abs(px)) * 0.22;
  float panel = step(abs(px), 0.18) * (1.0 - smoothstep(halfH - 0.03, halfH, abs(lp.y)));
  float inner = step(abs(px), 0.13) * (1.0 - smoothstep(halfH - 0.10, halfH - 0.07, abs(lp.y)));
  hull = max(hull, panel * (1.0 - 0.4 * inner));
  hull *= 1.0 - 0.85 * dsEllipse(lp, vec2(0.10, 0.02), vec2(0.14, 0.07));
  hull = max(hull, dsCapsule(lp, vec2(0.07, -0.26), vec2(0.13, -0.48), 0.026));
  hull = max(hull, dsCapsule(lp, vec2(-0.07, -0.26), vec2(-0.13, -0.48), 0.026));
  float d2 = dot(lp - vec2(-0.32, 0.0), lp - vec2(-0.32, 0.0));
  return vec3(hull, exp(-d2 * 110.0), 0.0);
}

// Rebel A-wing: arrowhead wedge, big twin engines, swept fins.
vec3 dsShapeAWing(vec2 lp) {
  float span = 0.46 * (1.0 - smoothstep(-0.85, 1.25, lp.x));
  float hull = step(-0.90, lp.x) * step(lp.x, 1.25)
    * (1.0 - smoothstep(span - 0.04, span + 0.02, abs(lp.y)));
  hull = max(hull, dsBox(lp, vec2(-0.95, -0.34), vec2(-0.80, 0.34), 0.03));
  hull *= 1.0 - 0.85 * dsEllipse(lp, vec2(0.38, 0.0), vec2(0.20, 0.10));
  hull = max(hull, dsCapsule(lp, vec2(-0.45, 0.28), vec2(-0.88, 0.72), 0.05));
  hull = max(hull, dsCapsule(lp, vec2(-0.45, -0.28), vec2(-0.88, -0.72), 0.05));
  hull = max(hull, dsCapsule(lp, vec2(0.50, 0.13), vec2(1.32, 0.16), 0.024));
  hull = max(hull, dsCapsule(lp, vec2(0.50, -0.13), vec2(1.32, -0.16), 0.024));
  float gUp = exp(-pow(dsDistSeg(lp, vec2(-0.86, 0.16), vec2(-0.86, 0.30)), 2.0) * 90.0);
  float gDn = exp(-pow(dsDistSeg(lp, vec2(-0.86, -0.30), vec2(-0.86, -0.16)), 2.0) * 90.0);
  return vec3(hull, max(gUp, gDn) * 1.15, 0.0);
}

// Imperial TIE interceptor: cockpit ball with triple-blade claws.
vec3 dsShapeTIEInt(vec2 lp) {
  float hull = 1.0 - smoothstep(0.23, 0.27, length(lp));
  hull = max(hull, dsCapsule(lp, vec2(0.18, 0.0), vec2(0.58, 0.0), 0.04));
  hull = max(hull, dsCapsule(lp, vec2(-0.18, 0.0), vec2(-0.58, 0.0), 0.04));
  float side = lp.x < 0.0 ? -1.0 : 1.0;
  vec2 hub = vec2(0.55 * side, 0.0);
  hull = max(hull, dsCapsule(lp, hub, vec2(1.20 * side, 0.0), 0.075));
  hull = max(hull, dsCapsule(lp, hub, vec2(1.05 * side, 0.45), 0.055));
  hull = max(hull, dsCapsule(lp, hub, vec2(1.05 * side, -0.45), 0.055));
  hull *= 1.0 - 0.85 * dsEllipse(lp, vec2(0.09, 0.02), vec2(0.12, 0.06));
  float d2 = dot(lp - vec2(-0.28, 0.0), lp - vec2(-0.28, 0.0));
  return vec3(hull, exp(-d2 * 120.0), 0.0);
}

vec3 dsFighterShape(vec2 p, float t, float i) {
  vec2 lp = dsFighterLocal(p, t, i);
  if (i < 0.5) { return dsShapeXWing(lp); }
  if (i < 1.5) { return dsShapeTIE(lp); }
  if (i < 2.5) { return dsShapeAWing(lp); }
  return dsShapeTIEInt(lp);
}

// Faint engine wash stretching back along the flight path.
float dsTrail(vec2 p, float t, float i) {
  vec2 v = dsFighterVel(t, i);
  float speed = max(length(v), 1e-5);
  vec2 n = v / speed;
  vec2 b = dsFighterPos(t, i);
  vec2 a = b - n * min(speed * 1.2, 0.022);
  float d = dsDistSeg(p, a, b);
  return (1.0 - smoothstep(0.7 * pxScale, 2.2 * pxScale, d)) * 0.8;
}

void dsFighterField(vec2 p, float t, float i, inout float hull, inout float glow, inout float trail) {
  vec3 bits = dsFighterShape(p, t, i);
  hull = max(hull, bits.x);
  glow = max(glow, bits.y);
  trail = max(trail, dsTrail(p, t, i));
}

// Ships take a whisper of their livery on the hull and burn their colour
// in the engines.
vec3 dsFighterColor(vec2 p, float t, float i, float dim, vec3 col) {
  vec3 bits = dsFighterShape(p, t, i);
  float tr = dsTrail(p, t, i);
  vec3 fac = dsFactionColor(i);
  col = mix(col, fac, clamp((bits.x * 0.30 + tr * 0.5) * dim, 0.0, 0.55));
  col = mix(col, fac, clamp(bits.y * 1.35 * dim, 0.0, 0.95));
  return col;
}

// One shot: x bolt, y muzzle flare, z impact flare. Bolts fire from the
// nose guns at the target's current position with per-shot aim error that
// widens with range — about half connect and flare, the rest whip past
// into the dark.
vec3 dsShot(vec2 p, float t, float i) {
  float target = i < 0.5 ? 1.0 : (i < 1.5 ? 0.0 : (i < 2.5 ? 3.0 : 2.0));
  float cycle = 1.35 + 0.4 * hash21(vec2(i + 1.0, 7.7));
  float idx = floor((t + i * 1.618) / cycle);
  float q = fract((t + i * 1.618) / cycle);
  float flight = 0.5 + 0.3 * hash21(vec2(idx + 2.0, i + 13.0));
  float hit = step(hash21(vec2(idx * 2.3 + 5.0, i + 41.0)), 0.45);
  float miss = hash21(vec2(idx * 1.7 + 3.0, i + 29.0)) - 0.5;
  vec2 nose = dsFighterPos(t, i)
    + normalize(dsFighterVel(t, i)) * shipSize * 0.5 * pxScale;
  vec2 to = dsFighterPos(t, target);
  vec2 seg = to - nose;
  float segLen = max(length(seg), 1e-5);
  vec2 perp = vec2(-seg.y, seg.x) / segLen;
  // Long-range shots miss wider than point-blank ones.
  float missScale = 0.4 + 2.0 * clamp(segLen * 2.2, 0.0, 1.0);
  float missPx = (1.0 - hit) * (8.0 + 36.0 * abs(miss)) * missScale * sign(miss + 1e-4);
  vec2 aim = to + perp * (missPx * pxScale);
  vec2 full = aim - nose;
  float flen = max(length(full), 1e-5);
  vec2 dir = full / flen;
  float prog = clamp(q / flight, 0.0, 1.0);
  vec2 head = nose + full * prog;
  float back = min(max(5.0 * pxScale, prog * flen), min(0.30 * flen, 0.045));
  float dB = dsDistSeg(p, head - dir * back, head);
  float bolt = (1.0 - smoothstep(1.0 * pxScale, 2.6 * pxScale, dB)) * step(q, flight);
  float m2 = dot(p - nose, p - nose) / (64.0 * pxScale * pxScale);
  float muzzle = exp(-m2) * (1.0 - smoothstep(0.02, 0.12, q));
  float flash = 0.0;
  if (hit > 0.5) {
    float f2 = dot(p - aim, p - aim) / (100.0 * pxScale * pxScale);
    flash = exp(-f2) * smoothstep(flight - 0.02, flight, q)
      * (1.0 - smoothstep(flight, flight + 0.18, q));
  }
  return vec3(bolt, muzzle, flash);
}
`;

const FIELD = `${SCENE}
float field(vec2 uv, vec2 res, float t) {
  vec2 p = vec2(uv.x * res.x / res.y, uv.y);
  float tone = dsStarsTone(uv, res, t);
  float calm = dsCalm(p);
  float dim = mix(dimFloor, 1.0, calm);
  // Lasers fade harder than hulls behind the reading column: a bright
  // bolt crossing text is worse for readability than a faint ship.
  float boltDim = mix(dimFloor * 0.5, 1.0, calm);
  float hull = 0.0;
  float glow = 0.0;
  float trail = 0.0;
  dsFighterField(p, t, 0.0, hull, glow, trail);
  dsFighterField(p, t, 1.0, hull, glow, trail);
  dsFighterField(p, t, 2.0, hull, glow, trail);
  dsFighterField(p, t, 3.0, hull, glow, trail);
  vec3 s0 = dsShot(p, t, 0.0);
  vec3 s1 = dsShot(p, t, 1.0);
  vec3 s2 = dsShot(p, t, 2.0);
  vec3 s3 = dsShot(p, t, 3.0);
  float bolt = max(max(s0.x, s1.x), max(s2.x, s3.x));
  float muzzle = max(max(s0.y, s1.y), max(s2.y, s3.y));
  float flash = max(max(s0.z, s1.z), max(s2.z, s3.z));
  // Hulls keep contrast with whatever stars they cross.
  float hullTone = mix(0.58, 0.12, smoothstep(0.25, 0.5, tone));
  tone = mix(tone, hullTone, hull * dim);
  tone = max(tone, (glow * 0.9 + trail * 0.26) * dim);
  tone = max(tone, max(bolt * 0.95, muzzle * 0.55) * boltDim);
  tone = max(tone, flash * 0.9 * dim);
  return clamp(tone, 0.0, 1.0);
}
`;

const COLOR_FIELD = `${SCENE}
vec4 colorField(vec2 uv, vec2 res, float t) {
  vec2 p = vec2(uv.x * res.x / res.y, uv.y);
  float star = dsStarsTone(uv, res, t);
  vec3 col = paletteColor(star).rgb;
  float calm = dsCalm(p);
  float dim = mix(dimFloor, 1.0, calm);
  float boltDim = mix(dimFloor * 0.5, 1.0, calm);
  col = dsFighterColor(p, t, 0.0, dim, col);
  col = dsFighterColor(p, t, 1.0, dim, col);
  col = dsFighterColor(p, t, 2.0, dim, col);
  col = dsFighterColor(p, t, 3.0, dim, col);
  vec3 s0 = dsShot(p, t, 0.0);
  vec3 s1 = dsShot(p, t, 1.0);
  vec3 s2 = dsShot(p, t, 2.0);
  vec3 s3 = dsShot(p, t, 3.0);
  col = mix(col, dsFactionColor(0.0), clamp(max(s0.x, s0.y) * 1.45 * boltDim, 0.0, 1.0));
  col = mix(col, dsFactionColor(1.0), clamp(max(s1.x, s1.y) * 1.45 * boltDim, 0.0, 1.0));
  col = mix(col, dsFactionColor(2.0), clamp(max(s2.x, s2.y) * 1.45 * boltDim, 0.0, 1.0));
  col = mix(col, dsFactionColor(3.0), clamp(max(s3.x, s3.y) * 1.45 * boltDim, 0.0, 1.0));
  float flash = max(max(s0.z, s1.z), max(s2.z, s3.z));
  col = mix(col, vec3(1.0, 0.92, 0.80), clamp(flash * 1.5 * dim, 0.0, 1.0));
  return vec4(col, 1.0);
}
`;

export type DitherStarsProps = Omit<
  DitherShaderProps,
  "field" | "colorField" | "fallback"
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
