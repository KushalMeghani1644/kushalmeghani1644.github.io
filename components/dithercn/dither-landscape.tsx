"use client";

import { useEffect, useState } from "react";

import type { DitherPalette, DitherShaderProps } from "@/lib/dither";
import { DitherShader, cssColor } from "@/lib/dither";

/**
 * The landscape at the top of the page, made live. It reads the weather and
 * the local time of Indore, India (IST) and repaints itself: the sun and moon
 * cross the sky, the light cools at night, clouds thicken with the real cloud
 * cover, rain streaks across the hills, fog washes the ranges out and a storm
 * flickers. Weather comes from Open-Meteo, which needs no key.
 */

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=22.7196&longitude=75.8577" +
  "&current=weather_code,cloud_cover,precipitation" +
  "&daily=sunrise,sunset&forecast_days=1&timezone=Asia%2FKolkata";

/** Sunrise and sunset in Indore, used until the API answers. */
const DEFAULT_SUNRISE = 6 * 60 + 45;
const DEFAULT_SUNSET = 17 * 60 + 50;

const SCENE_PALETTES = {
  "clear-day": ["#080b10", "#18222d", "#3d4f5e", "#8a9a9c", "#d3bd8d", "#f6e6c2"],
  "clear-night": ["#02040a", "#060c18", "#101f38", "#2f4a72", "#8aa5c9", "#dbe8ff"],
  dawn: ["#070403", "#1b0c06", "#4e1e0b", "#a3451a", "#ef9147", "#ffe2b5"],
  dusk: ["#070403", "#1b0c06", "#4e1e0b", "#a3451a", "#ef9147", "#ffe2b5"],
  "cloud-day": ["#07090b", "#10151a", "#2b343b", "#59656d", "#9aa6ad", "#d0d8dc"],
  "cloud-night": ["#03050a", "#081019", "#152231", "#31465c", "#6c8399", "#aebfce"],
  rain: ["#04070a", "#0a1218", "#192731", "#374c57", "#78909b", "#b0c2ca"],
  storm: ["#05030a", "#0d0a1a", "#221936", "#443564", "#7d6ba6", "#bfb0dd"],
  fog: ["#080909", "#141617", "#2f3437", "#60676b", "#9aa0a4", "#c9cdcf"],
  snow: ["#070a0c", "#121a1f", "#2c3d46", "#66818d", "#a9c0ca", "#dceaf0"],
} as const;

type SceneKey = keyof typeof SCENE_PALETTES;
type Phase = "dawn" | "day" | "dusk" | "night";
type WeatherKind = "clear" | "cloud" | "rain" | "storm" | "fog" | "snow";

const FIELD = `
float landscapeRidge(float x, float seed) {
  float a = 1.0 - abs(snoise(vec2(x * 0.9 + seed * 3.7, seed * 1.9)));
  float b = 1.0 - abs(snoise(vec2(x * 2.3 - seed * 2.3, seed * 5.1)));
  float c = snoise(vec2(x * 5.1 + seed * 1.3, seed * 9.7));
  return clamp(a * 0.55 + b * 0.32 + c * 0.12 + 0.04, 0.0, 1.0);
}

float landscapeSun(vec2 p, vec2 sun) {
  vec2 d = p - sun;
  return exp(-dot(d, d) * 16.0);
}

float field(vec2 uv, vec2 res, float t) {
  float aspect = res.x / res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 sunP = vec2(landscapeSunPos.x * aspect, landscapeSunPos.y);

  float sun = landscapeSun(p, sunP);
  float glow = exp(-length(p - sunP) * 2.6);
  float celestial = sun * 0.55 + glow * 0.24;

  // Sky: dark at the top, glowing at the horizon, with slow cloud streaks.
  float height = clamp(
    (uv.y - landscapeHorizon) / max(1.0 - landscapeHorizon, 0.001),
    0.0,
    1.0
  );
  vec2 cloudP = vec2(
    p.x * 1.5 + t * 0.01,
    (uv.y - landscapeHorizon) * 3.2 - t * 0.003
  );
  float warp = 0.5 + 0.5 * snoise(cloudP * 0.7 + vec2(2.1, 5.3));
  float clouds = fbm(cloudP + vec2(warp * 0.7, warp * 0.2));

  // How much of the sky is cloud is set by the real cloud cover in Indore.
  float threshold = mix(0.76, 0.28, indoreCloud);
  float bands = smoothstep(threshold, threshold + 0.3, clouds);
  bands *= smoothstep(0.0, 0.2, indoreCloud);

  float sky = mix(0.62, 0.13, pow(height, 0.65));
  sky -= smoothstep(0.25, 0.95, indoreCloud) * 0.16;
  sky += bands * mix(0.02, 0.3, glow) * (0.4 + 0.8 * indoreCloud);
  sky += exp(-abs(uv.y - landscapeHorizon) * 22.0) * 0.2 * (0.3 + glow);
  sky += celestial;
  float tone = clamp(sky, 0.0, 1.0);

  // Ridges, back to front. Each nearer range covers the ones behind it, and
  // the crest catches a thin rim of light from the sun or moon.
  for (int i = 0; i < 6; i++) {
    if (float(i) >= landscapeLayers) break;
    float fi = float(i);
    float k = fi / max(landscapeLayers - 1.0, 1.0);
    float base = landscapeHorizon - k * 0.36;
    float amp = mix(0.12, 0.3, k) * landscapeAmplitude;
    float crest =
      base +
      landscapeRidge(p.x * mix(0.9, 1.5, k) + fi * 0.9, fi + 1.0) * amp;

    if (uv.y < crest) {
      float depth = (crest - uv.y) * res.y;
      float body = mix(0.3, 0.04, pow(k, 0.8));
      body += (1.0 - k) * 0.07 * exp(-depth * 0.015);
      float rim = 1.0 - smoothstep(0.4, 2.0, depth);
      float lit = 0.55 + 0.45 * glow;
      float rimTone = mix(0.5, 0.78, k) * lit;
      tone = mix(body, rimTone, rim * mix(0.5, 1.0, k));
    }
  }

  // Night pulls the whole landscape down, then the moon is put back on top.
  tone *= mix(1.0, 0.5, indoreNight);
  tone += celestial * mix(0.0, 1.1, indoreNight);

  // Rain: thin diagonal streaks falling over the ranges.
  float rainPhase =
    (p.x * 0.6 + (uv.y - landscapeHorizon) * 1.1) * res.y * 0.18 - t * 6.0;
  float rain = pow(0.5 + 0.5 * sin(rainPhase * 6.28318), 10.0);
  rain *= smoothstep(landscapeHorizon - 0.02, landscapeHorizon + 0.06, uv.y);
  tone += rain * indoreRain * 0.38;

  // Thunderstorms flash for a moment every few seconds.
  float flashClock = t * 0.085;
  float flashPhase = fract(flashClock);
  float flash = smoothstep(0.0, 0.015, flashPhase)
    * (1.0 - smoothstep(0.015, 0.07, flashPhase));
  flash *= step(0.45, hash21(vec2(floor(flashClock), 9.0)));
  tone += flash * indoreStorm * 0.55;

  // Fog washes the ranges into a soft grey.
  float fogNoise = 0.5 + 0.5 * snoise(p * 1.4 + vec2(t * 0.01, 0.0));
  tone = mix(tone, 0.42 + fogNoise * 0.14, indoreFog * 0.55);

  // A dark floor so the headline sits on quiet ground, and a slight vignette
  // along the top edge.
  tone *= mix(0.5, 1.0, smoothstep(0.0, 0.3, uv.y));
  tone *= 1.0 - 0.18 * smoothstep(0.75, 1.0, uv.y);
  return clamp(tone, 0.0, 1.0);
}
`;

type Weather = {
  code: number;
  cloudCover: number;
  precipitation: number;
  sunrise: number;
  sunset: number;
};

type OpenMeteoResponse = {
  current?: {
    weather_code?: number;
    cloud_cover?: number;
    precipitation?: number;
  };
  daily?: {
    sunrise?: Array<string>;
    sunset?: Array<string>;
  };
};

const IST_CLOCK = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hourCycle: "h23",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const istMinutes = (date: Date) => {
  const parts = IST_CLOCK.formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  return pick("hour") * 60 + pick("minute") + pick("second") / 60;
};

const minutesFromApi = (value: string | undefined, fallback: number) => {
  const match = value ? /T(\d{2}):(\d{2})/.exec(value) : null;
  return match ? Number(match[1]) * 60 + Number(match[2]) : fallback;
};

const describeWeather = (code: number): { kind: WeatherKind } => {
  if (code <= 1) return { kind: "clear" };
  if (code === 2 || code === 3) return { kind: "cloud" };
  if (code === 45 || code === 48) return { kind: "fog" };
  if (code >= 51 && code <= 67) return { kind: "rain" };
  if (code >= 71 && code <= 77) return { kind: "snow" };
  if (code >= 80 && code <= 82) return { kind: "rain" };
  if (code >= 85 && code <= 86) return { kind: "snow" };
  if (code >= 95) return { kind: "storm" };
  return { kind: "cloud" };
};

const phaseOf = (minutes: number, sunrise: number, sunset: number): Phase => {
  if (minutes < sunrise - 30 || minutes > sunset + 30) return "night";
  if (minutes < sunrise + 45) return "dawn";
  if (minutes > sunset - 45) return "dusk";
  return "day";
};

/** Where the sun (or moon, at night) sits in the box, 0 to 1 with y up. */
const celestialOf = (
  minutes: number,
  sunrise: number,
  sunset: number,
  phase: Phase
): readonly [number, number] => {
  let progress: number;

  if (phase === "night") {
    const now = minutes < sunrise ? minutes + 1440 : minutes;
    const nightStart = sunset;
    const nightEnd = sunrise + 1440;
    progress = clamp01((now - nightStart) / Math.max(1, nightEnd - nightStart));
  } else {
    progress = clamp01((minutes - sunrise) / Math.max(1, sunset - sunrise));
  }

  return [
    0.08 + 0.84 * progress,
    0.56 + 0.18 * Math.sin(Math.PI * progress),
  ] as const;
};

const sceneOf = (phase: Phase, kind: WeatherKind): SceneKey => {
  if (kind === "storm") return "storm";
  if (kind === "rain") return "rain";
  if (kind === "snow") return "snow";
  if (kind === "fog") return "fog";
  if (kind === "cloud") return phase === "day" ? "cloud-day" : "cloud-night";
  if (phase === "night") return "clear-night";
  if (phase === "dawn") return "dawn";
  if (phase === "dusk") return "dusk";
  return "clear-day";
};

export type DitherLandscapeProps = Omit<
  DitherShaderProps,
  "field" | "uniforms" | "fallback" | "palette"
> & {
  /** Height of the horizon, 0 to 1. Default 0.52. */
  horizon?: number;
  /** How many ranges of hills, 2 to 6. Default 5. */
  layers?: number;
  /** Height of the hills, 0.4 to 2. Default 1. */
  amplitude?: number;
};

export const DitherLandscape = ({
  horizon = 0.52,
  layers = 5,
  amplitude = 1,
  cell = 2,
  matrix = "bayer8",
  stillTime = 12,
  ...props
}: DitherLandscapeProps) => {
  const [now, setNow] = useState<Date | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);

  // Re-read the IST clock every half minute; the sky moves slowly.
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Fetch Indore's weather now and refresh it every ten minutes.
  useEffect(() => {
    let cancelled = false;
    let active: AbortController | null = null;

    const load = async () => {
      active?.abort();
      const controller = new AbortController();
      active = controller;

      try {
        const response = await fetch(WEATHER_URL, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Weather request failed");

        const data = (await response.json()) as OpenMeteoResponse;
        if (cancelled) return;

        setWeather({
          code: data.current?.weather_code ?? 0,
          cloudCover: data.current?.cloud_cover ?? 0,
          precipitation: data.current?.precipitation ?? 0,
          sunrise: minutesFromApi(data.daily?.sunrise?.[0], DEFAULT_SUNRISE),
          sunset: minutesFromApi(data.daily?.sunset?.[0], DEFAULT_SUNSET),
        });
      } catch {
        // Keep the last scene; the clock still drives the sky without weather.
        if (cancelled) return;
      }
    };

    void load();
    const id = window.setInterval(() => void load(), 10 * 60 * 1000);

    return () => {
      cancelled = true;
      active?.abort();
      window.clearInterval(id);
    };
  }, []);

  const minutes = now ? istMinutes(now) : 18 * 60;
  const sunrise = weather?.sunrise ?? DEFAULT_SUNRISE;
  const sunset = weather?.sunset ?? DEFAULT_SUNSET;
  const phase = phaseOf(minutes, sunrise, sunset);
  const kind = weather ? describeWeather(weather.code).kind : "clear";
  const scene = sceneOf(phase, kind);
  const palette: DitherPalette = SCENE_PALETTES[scene];
  const celestial = celestialOf(minutes, sunrise, sunset, phase);

  const cloud = weather
    ? Math.max(
        weather.cloudCover / 100,
        kind === "clear" ? 0.06 : kind === "cloud" ? 0.6 : 0.8
      )
    : 0.12;
  const rain =
    kind === "rain"
      ? clamp01(0.28 + (weather?.precipitation ?? 0) / 5)
      : kind === "storm"
        ? 0.85
        : 0;
  const night = phase === "night" ? 1 : phase === "day" ? 0 : 0.55;

  return (
    <DitherShader
      {...props}
      field={FIELD}
      palette={palette}
      matrix={matrix}
      cell={cell}
      stillTime={stillTime}
      speed={0.9}
      uniforms={{
        landscapeAmplitude: Math.min(2, Math.max(0.4, amplitude)),
        landscapeHorizon: Math.min(0.9, Math.max(0.1, horizon)),
        landscapeLayers: Math.min(6, Math.max(2, Math.round(layers))),
        landscapeSunPos: celestial,
        indoreCloud: cloud,
        indoreRain: rain,
        indoreFog: kind === "fog" ? 0.9 : 0,
        indoreStorm: kind === "storm" ? 1 : 0,
        indoreNight: night,
      }}
      fallback={
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: cssColor(palette[0]),
            backgroundImage: `radial-gradient(ellipse 60% 72% at ${celestial[0] * 100}% ${(1 - celestial[1]) * 100}%, color-mix(in oklch, ${cssColor(palette[5])} 45%, transparent), transparent 72%)`,
          }}
        />
      }
    />
  );
};
