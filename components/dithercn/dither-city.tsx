"use client";

import { useEffect, useState } from "react";

import type { DitherPalette, DitherShaderProps } from "@/lib/dither";
import { DitherShader, cssColor } from "@/lib/dither";

/**
 * A dithered city skyline driven by Indore's live weather and IST clock.
 * Sun and moon arc across the sky; windows and street glow wake at dusk;
 * clouds, rain, fog and storms follow Open-Meteo. No weather chrome — just
 * the scene.
 */

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=22.7196&longitude=75.8577" +
  "&current=weather_code,cloud_cover,precipitation" +
  "&daily=sunrise,sunset&forecast_days=1&timezone=Asia%2FKolkata";

const DEFAULT_SUNRISE = 6 * 60 + 45;
const DEFAULT_SUNSET = 17 * 60 + 50;

const SCENE_PALETTES = {
  "clear-day": ["#0a1018", "#1a2836", "#3a5268", "#7a8f9a", "#c4b48a", "#f2e6c4"],
  "clear-night": ["#02040a", "#071018", "#122038", "#2a4570", "#7a9bc4", "#e8f0ff"],
  dawn: ["#08040a", "#1c0c12", "#4a1a18", "#a03a22", "#e88848", "#ffe0b8"],
  dusk: ["#08040c", "#1a0c18", "#4a1828", "#a03840", "#e87858", "#ffd8b0"],
  "cloud-day": ["#080a0e", "#141820", "#2c343e", "#58646e", "#98a4ac", "#d0d8dc"],
  "cloud-night": ["#03050a", "#0a121c", "#182838", "#344858", "#688098", "#a8bcc8"],
  rain: ["#04080c", "#0c141c", "#1c2c38", "#3a505c", "#708890", "#b0c4cc"],
  storm: ["#06040c", "#100c1c", "#241830", "#40385c", "#7868a0", "#c0b0d8"],
  fog: ["#08090a", "#16181a", "#303438", "#60686c", "#9aa0a4", "#c8ccd0"],
  snow: ["#060a0e", "#121a22", "#2a3c48", "#5c7888", "#a0bcc8", "#dceaf0"],
} as const;

type SceneKey = keyof typeof SCENE_PALETTES;
type Phase = "dawn" | "day" | "dusk" | "night";
type WeatherKind = "clear" | "cloud" | "rain" | "storm" | "fog" | "snow";

const FIELD = `
float cityBuilding(float x, float seed, float density) {
  float col = floor(x * density);
  float local = fract(x * density);
  float h1 = hash21(vec2(col, seed));
  float h2 = hash21(vec2(col * 1.37, seed + 4.2));
  float h3 = hash21(vec2(col * 2.11, seed + 9.1));
  // Street gaps so towers read as separate buildings.
  float gap = smoothstep(0.0, 0.06, local) * smoothstep(1.0, 0.94, local);
  float mid = mix(0.12, 0.3, h1);
  float tower = step(0.78, h2) * mix(0.16, 0.38, h3);
  float stepRoof = step(0.5, h2) * 0.05 * smoothstep(0.2, 0.35, local) * smoothstep(0.8, 0.65, local);
  // Thin spire on a few towers.
  float spire = step(0.92, h3) * step(abs(local - 0.5), 0.04) * 0.08;
  return (mid + tower + stepRoof + spire) * gap;
}

float cityWindows(vec2 p, float density, float roof, float ground, float seed, float lit) {
  if (lit < 0.02) return 0.0;
  float col = floor(p.x * density);
  float localX = fract(p.x * density);
  float buildingH = max(roof - ground, 0.02);
  float relativeY = clamp((p.y - ground) / buildingH, 0.0, 1.0);
  float rows = mix(7.0, 16.0, hash21(vec2(col, seed)));
  float wx = floor(localX * 5.0);
  float wy = floor(relativeY * rows);
  // Dense enough after dusk that the skyline reads as a lit city.
  float on = step(0.18, hash21(vec2(col * 17.0 + wx, wy * 13.0 + seed)));
  float cellX = fract(localX * 5.0);
  float cellY = fract(relativeY * rows);
  float pane = step(0.12, cellX) * step(cellX, 0.88) * step(0.14, cellY) * step(cellY, 0.86);
  float flicker = 0.88 + 0.12 * sin(wy * 1.7 + col * 0.4 + lit * 4.0);
  return on * pane * lit * flicker * 1.15;
}

float citySun(vec2 p, vec2 sun) {
  vec2 d = p - sun;
  return exp(-dot(d, d) * 18.0);
}

float field(vec2 uv, vec2 res, float t) {
  float aspect = res.x / res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 sunP = vec2(citySunPos.x * aspect, citySunPos.y);

  float sunDisc = citySun(p, sunP);
  float glow = exp(-length(p - sunP) * 2.4);
  float celestial = sunDisc * 0.62 + glow * 0.3;

  // Sky: horizon wash under a darker zenith, then drifting clouds.
  float height = clamp((uv.y - cityHorizon) / max(1.0 - cityHorizon, 0.001), 0.0, 1.0);
  float sky = mix(0.56, 0.09, pow(height, 0.72));
  sky += exp(-abs(uv.y - cityHorizon) * 14.0) * 0.2 * (0.4 + glow);
  sky -= smoothstep(0.2, 0.95, indoreCloud) * 0.14;

  vec2 cloudP = vec2(p.x * 1.35 + t * 0.012, (uv.y - cityHorizon) * 2.8 - t * 0.004);
  float warp = 0.5 + 0.5 * snoise(cloudP * 0.65 + vec2(1.7, 4.2));
  float clouds = fbm(cloudP + vec2(warp * 0.6, warp * 0.18));
  float threshold = mix(0.78, 0.3, indoreCloud);
  float bands = smoothstep(threshold, threshold + 0.28, clouds);
  bands *= smoothstep(0.0, 0.22, indoreCloud);
  sky += bands * mix(0.04, 0.28, glow) * (0.35 + 0.75 * indoreCloud);
  sky += celestial;

  // Stars only after dark, and only when cloud cover leaves gaps.
  float starCell = hash21(floor(p * 52.0));
  float stars = step(0.988, starCell) * step(cityHorizon + 0.1, uv.y);
  stars *= (1.0 - smoothstep(0.2, 0.65, indoreCloud));
  sky += stars * indoreNight * 0.6;

  float tone = clamp(sky, 0.0, 1.0);

  // Soft ground wash so the street line isn't a hard cut.
  float groundWash = smoothstep(cityHorizon + 0.04, cityHorizon - 0.08, uv.y);
  tone = mix(tone, mix(0.12, 0.05, indoreNight), groundWash * 0.85);

  // Far skyline — softer, shorter silhouettes.
  float farDensity = 8.0;
  float farH = cityBuilding(p.x, 2.0, farDensity) * cityAmplitude * 0.7;
  float farRoof = cityHorizon + farH * 0.55;
  if (uv.y < farRoof && uv.y > cityHorizon - 0.03) {
    float depth = (farRoof - uv.y) * res.y;
    float body = mix(0.14, 0.05, indoreNight);
    float rim = 1.0 - smoothstep(0.3, 1.8, depth);
    tone = mix(body, mix(0.4, 0.58, glow), rim * 0.35);
  }

  // Near skyline — taller towers with lit windows after dusk.
  float nearDensity = 5.4;
  float nearH = cityBuilding(p.x, 7.0, nearDensity) * cityAmplitude;
  float nearRoof = cityHorizon + nearH;
  float ground = cityHorizon - 0.015;
  if (uv.y < nearRoof && uv.y > ground) {
    float depth = (nearRoof - uv.y) * res.y;
    float body = mix(0.1, 0.025, pow(indoreNight, 0.75));
    body += 0.045 * exp(-depth * 0.018);
    float rim = 1.0 - smoothstep(0.35, 2.4, depth);
    float sunSide = 0.5 + 0.5 * clamp((sunP.x - p.x) * 1.2, -1.0, 1.0);
    float litRim = mix(0.35, 0.72, glow) * mix(0.5, 1.0, sunSide);
    litRim *= mix(1.0, 0.5, indoreNight);
    tone = mix(body, litRim, rim * 0.7);

    float windows = cityWindows(vec2(p.x, uv.y), nearDensity, nearRoof, ground, 7.0, cityLights);
    tone = max(tone, windows * mix(0.7, 1.05, cityLights));
  }

  // Street lamps and a warm pool under the towers after dark.
  float street = exp(-abs(uv.y - (cityHorizon - 0.025)) * 24.0);
  street *= smoothstep(0.12, 0.8, cityLights);
  tone += street * cityLights * 0.28;

  float lampCol = floor(p.x * 11.0);
  float lampOn = step(0.55, hash21(vec2(lampCol, 19.0)));
  float lampX = (lampCol + 0.5) / 11.0;
  float lamp = exp(-abs(p.x - lampX) * 55.0) * exp(-abs(uv.y - (cityHorizon - 0.01)) * 70.0);
  tone += lamp * lampOn * cityLights * 0.45;

  // Occasional neon bands on lower facades.
  float neonCol = floor(p.x * nearDensity * 2.0);
  float neonOn = step(0.88, hash21(vec2(neonCol, 41.0)));
  float neonY = cityHorizon + 0.025 + hash21(vec2(neonCol, 12.0)) * 0.1;
  float neon = exp(-abs(uv.y - neonY) * 100.0) * neonOn;
  neon *= step(abs(fract(p.x * nearDensity) - 0.5), 0.3);
  tone += neon * cityLights * 0.4;

  // Weather overlays — rain, storm flash, fog.
  float rainPhase =
    (p.x * 0.55 + (uv.y - cityHorizon) * 1.15) * res.y * 0.2 - t * 7.0;
  float rain = pow(0.5 + 0.5 * sin(rainPhase * 6.28318), 11.0);
  rain *= smoothstep(cityHorizon - 0.06, cityHorizon + 0.14, uv.y);
  tone += rain * indoreRain * 0.42;

  float flashClock = t * 0.09;
  float flashPhase = fract(flashClock);
  float flash = smoothstep(0.0, 0.012, flashPhase)
    * (1.0 - smoothstep(0.012, 0.06, flashPhase));
  flash *= step(0.48, hash21(vec2(floor(flashClock), 11.0)));
  tone += flash * indoreStorm * 0.5;

  float fogNoise = 0.5 + 0.5 * snoise(p * 1.3 + vec2(t * 0.012, 0.0));
  tone = mix(tone, 0.4 + fogNoise * 0.12, indoreFog * 0.58);

  // Quiet ground for the headline; soft vignette at the top.
  tone *= mix(0.4, 1.0, smoothstep(0.0, 0.26, uv.y));
  tone *= 1.0 - 0.14 * smoothstep(0.8, 1.0, uv.y);
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

/** Sun by day, moon by night — position in the box, 0–1 with y up. */
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
    0.58 + 0.2 * Math.sin(Math.PI * progress),
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

/** How bright windows and street lamps should be for this phase. */
const lightsOf = (phase: Phase, kind: WeatherKind): number => {
  const weatherDim =
    kind === "fog" ? 0.55 : kind === "rain" ? 0.75 : kind === "storm" ? 0.65 : 1;
  if (phase === "night") return 1 * weatherDim;
  if (phase === "dusk") return 0.85 * weatherDim;
  if (phase === "dawn") return 0.35 * weatherDim;
  return 0.04;
};

export type DitherCityProps = Omit<
  DitherShaderProps,
  "field" | "uniforms" | "fallback" | "palette"
> & {
  /** Height of the street line, 0 to 1. Default 0.34. */
  horizon?: number;
  /** Tower height scale, 0.5 to 2. Default 1. */
  amplitude?: number;
};

export const DitherCity = ({
  horizon = 0.3,
  amplitude = 1.25,
  cell = 2,
  matrix = "bayer8",
  stillTime = 14,
  ...props
}: DitherCityProps) => {
  const [now, setNow] = useState<Date | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

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

  const minutes = now ? istMinutes(now) : 20 * 60;
  const sunrise = weather?.sunrise ?? DEFAULT_SUNRISE;
  const sunset = weather?.sunset ?? DEFAULT_SUNSET;
  const phase = phaseOf(minutes, sunrise, sunset);
  const kind = weather ? describeWeather(weather.code).kind : "clear";
  const scene = sceneOf(phase, kind);
  const palette: DitherPalette = SCENE_PALETTES[scene];
  const celestial = celestialOf(minutes, sunrise, sunset, phase);
  const lights = lightsOf(phase, kind);

  const cloud = weather
    ? Math.max(
        weather.cloudCover / 100,
        kind === "clear" ? 0.05 : kind === "cloud" ? 0.55 : 0.78
      )
    : 0.12;
  const rain =
    kind === "rain"
      ? clamp01(0.3 + (weather?.precipitation ?? 0) / 5)
      : kind === "storm"
        ? 0.88
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
      speed={0.85}
      uniforms={{
        cityAmplitude: Math.min(2, Math.max(0.5, amplitude)),
        cityHorizon: Math.min(0.7, Math.max(0.15, horizon)),
        citySunPos: celestial,
        cityLights: lights,
        indoreCloud: cloud,
        indoreRain: rain,
        indoreFog: kind === "fog" ? 0.9 : kind === "snow" ? 0.35 : 0,
        indoreStorm: kind === "storm" ? 1 : 0,
        indoreNight: night,
      }}
      fallback={
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: cssColor(palette[0]),
            backgroundImage: [
              `radial-gradient(ellipse 55% 65% at ${celestial[0] * 100}% ${(1 - celestial[1]) * 100}%, color-mix(in oklch, ${cssColor(palette[5])} 40%, transparent), transparent 70%)`,
              `linear-gradient(to top, color-mix(in oklch, ${cssColor(palette[2])} ${Math.round(lights * 55)}%, transparent) 0%, transparent 38%)`,
            ].join(", "),
          }}
        />
      }
    />
  );
};
