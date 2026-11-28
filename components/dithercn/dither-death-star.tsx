"use client";

import type { DitherShaderProps } from "@/lib/dither";
import { DitherShader, cssColor } from "@/lib/dither";

/**
 * A dithered deep-space scene: the Death Star hanging in the upper right —
 * a shaded sphere with its single superlaser dish glowing green, an
 * equatorial trench, panel texture. Planets of a few kinds — rust rock,
 * ice, jade gas, violet storm — spawn from any direction, fall towards
 * the station and decelerate as they close in; only once one hangs at the
 * rim does the dish charge and fire the green superlaser, and the planet
 * dies in yellow fire and an expanding ring. The paper is transparent, so
 * the page-wide star layer shows through.
 */

const PALETTE = [
  "transparent",
  "#101010",
  "#262626",
  "#484848",
  "#737373",
  "#a3a3a3",
  "--dither-ink",
] as const;

// Shared by both functions: one sample of the whole scene. x is the tone,
// y unused, z the green amount (lens, beam), w the fire amount (blasts).
const SCENE = `
float dsDistSeg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}

float dsPlanetPh(float t, float seed, float period) {
  return fract(t / period + seed);
}

// A doomed planet's life: where it is, how big, what kind. xy is its
// position in square units, z its radius, w its kind 0..3. It spawns
// anywhere in the frame — never offscreen — along a shallow line towards
// the station, so the rim kill point and the superlaser stay in view.
vec4 dsPlanetState(float t, float seed, float period) {
  float cyc = t / period + seed;
  float idx = floor(cyc);
  float ph = fract(cyc);
  float aspect = u_resolution.x / u_resolution.y;
  vec2 C = vec2(dsCx * aspect, dsCy);
  float h1 = hash21(vec2(idx, 3.0 + seed));
  float h2 = hash21(vec2(idx, 9.0 + seed));
  float h3 = hash21(vec2(idx, 13.0 + seed));
  float pr = dsR * mix(0.14, 0.30, h3);
  // Keep the approach shallow: the planet always ends up beside or below
  // the sphere, never above the top edge of the hero.
  vec2 raw = vec2(mix(0.02, 0.98, h1) * aspect, mix(0.32, 0.92, h2)) - C;
  float dy = clamp(raw.y / max(length(raw), 1e-4), -0.50, 0.42);
  float dx = (raw.x >= 0.0 ? 1.0 : -1.0) * sqrt(max(1.0 - dy * dy, 1e-4));
  vec2 dir = vec2(dx, dy);
  vec2 approach = C + dir * (dsR + pr + 0.10);
  // Keep the impact point inside the frame at every aspect ratio: narrow
  // boxes would otherwise push the target past a horizontal edge, and the
  // beam would end offscreen.
  approach.x = clamp(approach.x, 0.08, aspect - 0.08);
  approach.y = clamp(approach.y, 0.30, 0.92);
  // Spawn along the same line, as far out as the frame allows.
  float ty = dir.y > 0.001 ? (0.92 - dsCy) / dir.y
    : (dir.y < -0.001 ? (0.30 - dsCy) / dir.y : 10.0);
  float tx = dx > 0.001 ? (0.98 * aspect - C.x) / dx
    : (dx < -0.001 ? (0.02 * aspect - C.x) / dx : 10.0);
  float maxDist = max(min(ty, tx) * 0.90, dsR * 1.45);
  vec2 spawn = C + dir * mix(dsR * 1.35, maxDist, h2);
  float ease = 1.0 - pow(1.0 - ph, 3.0);
  return vec4(mix(spawn, approach, ease), pr, floor(hash21(vec2(idx, 21.0 + seed)) * 4.0));
}

float dsPlanetMask(vec2 p, vec2 res, vec4 st, float ph) {
  float alive = 1.0 - smoothstep(0.84, 0.93, ph);
  float dP = length(p - st.xy);
  return (1.0 - smoothstep(st.z - 1.0 / res.y, st.z + 1.0 / res.y, dP)) * alive;
}

vec4 dsSample(vec2 uv, vec2 res, float t) {
  float aspect = res.x / res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 C = vec2(dsCx * aspect, dsCy);
  float R = dsR;
  vec3 L = normalize(vec3(0.35, 0.18, 0.88));
  float pulse = 0.85 + 0.15 * sin(t * 0.6);

  // Doomed planets on two interleaved cycles, each its own kind.
  vec4 stA = dsPlanetState(t, 0.0, dsPlanetPeriod);
  float phA = dsPlanetPh(t, 0.0, dsPlanetPeriod);
  float maskA = dsPlanetMask(p, res, stA, phA);
  float toneA = 0.0;
  if (maskA > 0.001) {
    vec2 relP = p - stA.xy;
    float dP = length(relP);
    float nzP = sqrt(max(1.0 - dP * dP / (stA.z * stA.z), 0.0));
    vec3 NP = normalize(vec3(relP / max(stA.z, 1e-4), nzP));
    float diffP = clamp(dot(NP, L), 0.0, 1.0);
    float peak = mix(0.42, 0.62, hash21(vec2(floor(t / dsPlanetPeriod), 33.0)));
    float planetTone = mix(0.10, peak, pow(diffP, 1.2));
    vec2 lpp = relP / max(stA.z, 1e-4);
    if (stA.w < 0.5) {
      planetTone += (fbm(lpp * 2.2 + vec2(7.0, 3.0)) - 0.5) * 0.20;
    } else if (stA.w < 1.5) {
      planetTone += snoise(lpp * vec2(1.4, 5.0) + vec2(11.0, 5.0)) * 0.07;
    } else if (stA.w < 2.5) {
      planetTone += sin(lpp.y * 7.0 + 1.7) * 0.055;
    } else {
      planetTone += (fbm(lpp * 3.1 + vec2(4.0, 13.0)) - 0.5) * 0.22;
    }
    toneA = planetTone * maskA;
  }
  float ringA = 0.0;
  float flashA = 0.0;
  {
    float dPA = length(p - stA.xy);
    float exOn = step(0.86, phA) * (1.0 - smoothstep(0.96, 1.0, phA));
    float ringR = smoothstep(0.86, 1.0, phA) * (3.0 * stA.z + 0.05);
    float q = (dPA - ringR) * res.y;
    ringA = exp(-q * q * 0.30) * exOn;
    flashA = exp(-dPA * dPA * 300.0)
      * step(0.86, phA) * (1.0 - smoothstep(0.86, 0.93, phA));
  }
  float beamA = smoothstep(0.78, 0.788, phA) * (1.0 - smoothstep(0.855, 0.862, phA));

  vec4 stB = dsPlanetState(t, 4.7, dsPlanetPeriod * 1.31);
  float phB = dsPlanetPh(t, 4.7, dsPlanetPeriod * 1.31);
  float maskB = dsPlanetMask(p, res, stB, phB);
  float toneB = 0.0;
  if (maskB > 0.001) {
    vec2 relP = p - stB.xy;
    float dP = length(relP);
    float nzP = sqrt(max(1.0 - dP * dP / (stB.z * stB.z), 0.0));
    vec3 NP = normalize(vec3(relP / max(stB.z, 1e-4), nzP));
    float diffP = clamp(dot(NP, L), 0.0, 1.0);
    float peak = mix(0.42, 0.62, hash21(vec2(floor(t / (dsPlanetPeriod * 1.31) + 4.7), 33.0)));
    float planetTone = mix(0.10, peak, pow(diffP, 1.2));
    vec2 lpp = relP / max(stB.z, 1e-4);
    if (stB.w < 0.5) {
      planetTone += (fbm(lpp * 2.2 + vec2(7.0, 3.0)) - 0.5) * 0.20;
    } else if (stB.w < 1.5) {
      planetTone += snoise(lpp * vec2(1.4, 5.0) + vec2(11.0, 5.0)) * 0.07;
    } else if (stB.w < 2.5) {
      planetTone += sin(lpp.y * 7.0 + 1.7) * 0.055;
    } else {
      planetTone += (fbm(lpp * 3.1 + vec2(4.0, 13.0)) - 0.5) * 0.22;
    }
    toneB = planetTone * maskB;
  }
  float ringB = 0.0;
  float flashB = 0.0;
  {
    float dPB = length(p - stB.xy);
    float exOn = step(0.86, phB) * (1.0 - smoothstep(0.96, 1.0, phB));
    float ringR = smoothstep(0.86, 1.0, phB) * (3.0 * stB.z + 0.05);
    float q = (dPB - ringR) * res.y;
    ringB = exp(-q * q * 0.30) * exOn;
    flashB = exp(-dPB * dPB * 300.0)
      * step(0.86, phB) * (1.0 - smoothstep(0.86, 0.93, phB));
  }
  float beamB = smoothstep(0.78, 0.788, phB) * (1.0 - smoothstep(0.855, 0.862, phB));

  float tone = max(toneA, toneB);

  // Death Star: sphere shading, panel texture, trench, superlaser dish.
  vec2 rel = p - C;
  float d = length(rel);
  float sphereMask = 1.0 - smoothstep(R - 1.5 / res.y, R + 1.5 / res.y, d);
  float nz = sqrt(max(1.0 - d * d / (R * R), 0.0));
  vec3 N = normalize(vec3(rel / max(R, 1e-4), nz));
  float diff = clamp(dot(N, L), 0.0, 1.0);
  float sphereTone = mix(0.05, 0.62, pow(diff, 1.1));

  vec2 su = rel / R * 2.2;
  sphereTone += (fbm(su * 2.4 + vec2(5.2, 1.8)) - 0.5) * 0.12;
  vec2 grid = su * 5.0;
  float gline = min(abs(fract(grid.x) - 0.5), abs(fract(grid.y) - 0.5));
  sphereTone -= (1.0 - smoothstep(0.02, 0.10, gline)) * 0.09 * (0.3 + diff);

  float hw = 1.8 / res.y;
  float trench = (1.0 - smoothstep(hw * 0.5, hw, abs(rel.y + 0.30 * R))) * sphereMask;
  sphereTone = mix(sphereTone, sphereTone * 0.30, trench);
  float tLight = step(0.88, hash21(vec2(floor(rel.x * res.y * 0.45), 41.0)));
  sphereTone = max(sphereTone, trench * tLight * 0.45);

  // Concave dish shading with a bright rim on the lit side.
  vec2 dC = C + vec2(0.30, 0.26) * R;
  vec2 drel = p - dC;
  float dd = length(drel);
  float rd = 0.30 * R;
  float dishMask = (1.0 - smoothstep(rd, rd + 1.2 / res.y, dd)) * sphereMask;
  vec2 dn = dd > 1e-4 ? drel / dd : vec2(0.0);
  float depthD = smoothstep(0.0, rd, dd);
  float dishLit = clamp(dot(dn, vec2(-0.82, -0.57)), 0.0, 1.0);
  float dishTone = mix(0.05, 0.18, depthD) + dishLit * depthD * 0.20;
  float dishRim = 1.0 - smoothstep(1.0 / res.y, 2.6 / res.y, abs(dd - rd));
  dishTone = max(dishTone, dishRim * (0.45 + 0.35 * dishLit));
  sphereTone = mix(sphereTone, dishTone, dishMask);

  float lens = exp(-dd * dd * 26.0 / (rd * rd));
  float lensGlow = dsGlow * pulse * (0.8 + 0.5 * max(beamA, beamB));
  sphereTone = max(sphereTone, lens * lensGlow * 1.1);

  tone = mix(tone, sphereTone, sphereMask);

  // The superlaser only fires once a planet hangs at the rim.
  float bw = 1.2 / res.y;
  float dBA = dsDistSeg(p, dC, stA.xy);
  float dBB = dsDistSeg(p, dC, stB.xy);
  float beam = max(
    (1.0 - smoothstep(bw, bw * 2.4, dBA)) * beamA,
    (1.0 - smoothstep(bw, bw * 2.4, dBB)) * beamB
  );
  float beamGlow = max(exp(-dBA * res.y * 1.1) * beamA, exp(-dBB * res.y * 1.1) * beamB);
  tone = max(tone, beam * 0.95 + beamGlow * 0.50);

  // Thin out towards the bottom so the next section starts clean.
  tone *= mix(0.30, 1.0, smoothstep(0.30, 0.55, uv.y));

  float green = beam + beamGlow * 0.8;
  green = max(green, lens * pulse * 0.7);
  float fire = max(max(ringA, flashA), max(ringB, flashB));
  return vec4(clamp(tone, 0.0, 1.0), 0.0, green, fire);
}
`;

const FIELD = `${SCENE}
float field(vec2 uv, vec2 res, float t) {
  return dsSample(uv, res, t).x;
}
`;

const COLOR_FIELD = `${SCENE}
vec4 colorField(vec2 uv, vec2 res, float t) {
  vec2 p = vec2(uv.x * res.x / res.y, uv.y);
  vec4 s = dsSample(uv, res, t);
  vec3 col = paletteColor(s.x).rgb;
  // Every planet wears its own colour, by kind.
  vec4 stA = dsPlanetState(t, 0.0, dsPlanetPeriod);
  float maskA = dsPlanetMask(p, res, stA, dsPlanetPh(t, 0.0, dsPlanetPeriod));
  vec4 stB = dsPlanetState(t, 4.7, dsPlanetPeriod * 1.31);
  float maskB = dsPlanetMask(p, res, stB, dsPlanetPh(t, 4.7, dsPlanetPeriod * 1.31));
  float pm = max(maskA, maskB);
  if (pm > 0.001) {
    float type = maskA > maskB ? stA.w : stB.w;
    vec3 kind = vec3(0.90, 0.50, 0.30);
    if (type < 0.5) {
      kind = vec3(0.90, 0.50, 0.30);
    } else if (type < 1.5) {
      kind = vec3(0.55, 0.75, 1.00);
    } else if (type < 2.5) {
      kind = vec3(0.45, 0.85, 0.60);
    } else {
      kind = vec3(0.80, 0.55, 0.95);
    }
    col = mix(col, kind, pm * 0.85);
  }
  // Lens and superlaser keep the one green accent.
  col = mix(col, vec3(0.36, 1.0, 0.55), clamp(s.z * 1.5, 0.0, 0.95));
  // Blown-up planets burn yellow, like fire.
  col = mix(col, vec3(1.0, 0.70, 0.22), clamp(s.w * 1.35, 0.0, 0.96));
  return vec4(col, 1.0);
}
`;

export type DitherDeathStarProps = Omit<
  DitherShaderProps,
  "field" | "colorField" | "uniforms" | "fallback"
> & {
  /** Superlaser lens glow strength, 0 to 1. Default 0.65. */
  superlaser?: number;
  /** Station radius as a fraction of the hero's height. Default 0.40. */
  size?: number;
  /** Station centre in the box, 0 to 1, y up. Default [0.76, 0.62]. */
  position?: readonly [number, number];
  /** Seconds between planet destructions. Default 10. */
  planetPeriod?: number;
};

export const DitherDeathStar = ({
  superlaser = 0.65,
  size = 0.40,
  position = [0.76, 0.62],
  planetPeriod = 10,
  cell = 2,
  levels = 13,
  matrix = "bayer8",
  stillTime = 8.05,
  speed = 0.85,
  palette = PALETTE,
  ...props
}: DitherDeathStarProps) => {
  const [cx, cy] = position;
  const dishX = cx + 0.03;
  const dishY = cy + 0.1;
  // Stop choices that survive palettes shorter than five entries: fall
  // back to the last entry for any missing index.
  const bright = palette[Math.min(4, palette.length - 1)];
  const mid = palette[Math.min(2, palette.length - 1)];
  return (
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
      uniforms={{
        dsCx: cx,
        dsCy: cy,
        dsR: Math.min(0.5, Math.max(0.15, size)),
        dsGlow: Math.min(1, Math.max(0, superlaser)),
        dsPlanetPeriod: Math.max(4, planetPeriod),
      }}
      fallback={
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              `radial-gradient(circle ${Math.round(size * 170)}px at ${cx * 100}% ${(1 - cy) * 100}%, ${cssColor(bright)} 0%, ${cssColor(mid)} 58%, transparent 74%)`,
              `radial-gradient(4px 4px at ${dishX * 100}% ${(1 - dishY) * 100}%, rgba(96, 255, 150, 0.85), transparent 70%)`,
              `radial-gradient(3px 3px at 18% 74%, rgba(255, 200, 90, 0.8), transparent 70%)`,
            ].join(", "),
          }}
        />
      }
    />
  );
};
