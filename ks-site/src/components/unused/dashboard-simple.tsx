"use client";

import { Badge } from "@/components/ui/badge";
import {
  Activity,
  CloudSun,
  Code2,
  Coffee,
  Droplets,
  Gamepad2,
  HeartPulse,
  MapPin,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

// Personal settings
const GITHUB_USERNAME = "BoiPlex";
const LOCATION = {
  latitude: 37.8349,
  longitude: -122.1297,
  timezone: "America/Los_Angeles",
};

// Simulated status settings
const STATUS = {
  wakeHour: 9,
  sleepHour: 1,
  changeEverySeconds: 3600,
  activities: [
    "Building something",
    "Debugging some bs",
    "Eating",
    "Playing Touhou",
    "Working out",
  ],
};

// Simulated vital settings
const VITALS = {
  energy: { base: 76, variation: 18, speed: 100 },
  focus: { base: 81, variation: 14, speed: 50 },
  hydration: { base: 70, variation: 11, speed: 100 },
  pulse: { base: 69, variation: 9, speed: 10 },
  coffee: 2,
};

type GithubData = {
  followers: number;
  repositories: number;
  stars: number;
  latestRepo: string;
  profileUrl: string;
};

type WeatherData = {
  temperature: number;
  feelsLike: number;
  code: number;
  wind: number;
};

type SteamData = {
  username: string;
  profileUrl: string;
  state: string;
  games: number;
  totalHours: number;
  mostPlayed: string;
};

type RemoteData = {
  github?: GithubData;
  weather?: WeatherData;
  steam?: SteamData;
  errors: Partial<Record<"github" | "weather" | "steam", string>>;
};

type GithubUser = {
  followers: number;
  public_repos: number;
  html_url: string;
};

type GithubRepo = {
  name: string;
  stargazers_count: number;
  fork: boolean;
};

type WeatherResponse = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
};

async function fetchJson<T>(url: string, signal: AbortSignal) {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string };
      message = body.error ?? message;
    } catch {
      // The upstream service did not return JSON.
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

function clamp(value: number) {
  return Math.min(100, Math.max(0, value));
}

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function pacificHour(date: Date) {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: LOCATION.timezone,
      hour: "numeric",
      hourCycle: "h23",
    }).format(date),
  );
}

function currentStatus(date: Date) {
  const hour = pacificHour(date);
  const awake =
    STATUS.wakeHour < STATUS.sleepHour
      ? hour >= STATUS.wakeHour && hour < STATUS.sleepHour
      : hour >= STATUS.wakeHour || hour < STATUS.sleepHour;

  if (!awake) {
    return { activity: "Sleeping", focus: "Recharging", online: false };
  }

  const bucket = Math.floor(
    date.getTime() / (STATUS.changeEverySeconds * 1000),
  );
  const index = Math.floor(seededRandom(bucket) * STATUS.activities.length);

  return {
    activity: STATUS.activities[index],
    focus: seededRandom(bucket + 10) > 0.66 ? "Deep focus" : "Available",
    online: true,
  };
}

function currentVitals(date: Date) {
  const seconds = date.getTime() / 1000;
  const fluctuate = (
    setting: { base: number; variation: number; speed: number },
    offset: number,
  ) =>
    Math.round(
      clamp(
        setting.base +
          Math.sin(seconds / setting.speed + offset) * setting.variation +
          Math.sin(seconds / (setting.speed * 0.43)) * 2,
      ),
    );

  return {
    energy: fluctuate(VITALS.energy, 0),
    focus: fluctuate(VITALS.focus, 1.4),
    hydration: fluctuate(VITALS.hydration, 2.6),
    pulse: fluctuate(VITALS.pulse, 0.7),
  };
}

function weatherName(code: number) {
  if (code === 0) return "Clear";
  if (code <= 3) return "Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  return "Storm";
}

function DataRow({
  icon: Icon,
  iconClass,
  title,
  children,
}: {
  icon: LucideIcon;
  iconClass: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3 border-t border-white/10 py-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${iconClass}`}
      >
        <Icon size={19} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-semibold text-white/50">{title}</p>
        {children}
      </div>
    </div>
  );
}

function Meter({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="grid grid-cols-[4.25rem_1fr_2.25rem] items-center gap-2">
      <span className="text-[11px] text-white/55">{label}</span>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-right text-[11px] tabular-nums">{value}%</span>
    </div>
  );
}

function Loading() {
  return <p className="animate-pulse text-sm text-white/40">Loading...</p>;
}

export default function SimpleDashboard() {
  const [remote, setRemote] = useState<RemoteData>({ errors: {} });
  const [ready, setReady] = useState(false);
  const [timestamp, setTimestamp] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function load() {
      const github = Promise.all([
        fetchJson<GithubUser>(
          `https://api.github.com/users/${GITHUB_USERNAME}`,
          signal,
        ),
        fetchJson<GithubRepo[]>(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
          signal,
        ),
      ]).then(([user, repos]) => {
        const original = repos.filter((repo) => !repo.fork);
        return {
          followers: user.followers,
          repositories: user.public_repos,
          stars: original.reduce(
            (total, repo) => total + repo.stargazers_count,
            0,
          ),
          latestRepo: original[0]?.name ?? "None",
          profileUrl: user.html_url,
        };
      });

      const weatherUrl = new URL(
        "https://api.open-meteo.com/v1/forecast",
      );
      weatherUrl.search = new URLSearchParams({
        latitude: String(LOCATION.latitude),
        longitude: String(LOCATION.longitude),
        current:
          "temperature_2m,apparent_temperature,weather_code,wind_speed_10m",
        temperature_unit: "fahrenheit",
        wind_speed_unit: "mph",
        timezone: LOCATION.timezone,
      }).toString();

      const weather = fetchJson<WeatherResponse>(
        weatherUrl.toString(),
        signal,
      ).then(({ current }) => ({
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        code: current.weather_code,
        wind: current.wind_speed_10m,
      }));

      const steam = fetchJson<SteamData>("/api/steam", signal);
      const results = await Promise.allSettled([github, weather, steam]);

      if (signal.aborted) return;

      const next: RemoteData = { errors: {} };
      const keys = ["github", "weather", "steam"] as const;

      results.forEach((result, index) => {
        const key = keys[index];
        if (result.status === "fulfilled") {
          Object.assign(next, { [key]: result.value });
        } else {
          next.errors[key] =
            result.reason instanceof Error
              ? result.reason.message
              : "Unavailable";
        }
      });

      setRemote(next);
      setReady(true);
    }

    void load();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setTimestamp(Date.now()), 600);
    return () => window.clearInterval(timer);
  }, []);

  const now = timestamp ? new Date(timestamp) : null;
  const status = now ? currentStatus(now) : null;
  const vitals = now ? currentVitals(now) : null;

  return (
    <div className="h-full overflow-y-auto rounded-md border-2 border-white/10 bg-gray-900 p-4 text-white">
      <div className="flex items-center gap-3 pb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-violet-500/15 text-violet-300">
          <UserRound size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold">GET api/KAR v0.3</h3>
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <MapPin size={12} className="text-rose-400" />
            Moraga, CA · Developer
          </div>
        </div>
        <Badge
          className={
            ready
              ? "ml-auto bg-green-700 text-white"
              : "ml-auto bg-yellow-700 text-white"
          }
        >
          {ready ? "Online" : "Connecting"}
        </Badge>
      </div>

      <DataRow
        icon={Code2}
        iconClass="bg-slate-500/15 text-slate-200"
        title="GitHub · BoiPlex"
      >
        {remote.errors.github ? (
          <p className="text-sm text-red-300">{remote.errors.github}</p>
        ) : !remote.github ? (
          <Loading />
        ) : (
          <>
            <a
              className="font-semibold hover:underline"
              href={remote.github.profileUrl}
              rel="noreferrer"
              target="_blank"
            >
              {remote.github.latestRepo}
            </a>
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-white/60">
              <span>{remote.github.repositories} repos</span>
              <span className="text-amber-300">★ {remote.github.stars}</span>
              <span>{remote.github.followers} followers</span>
            </div>
          </>
        )}
      </DataRow>

      <DataRow
        icon={CloudSun}
        iconClass="bg-sky-500/15 text-sky-300"
        title="Moraga weather"
      >
        {remote.errors.weather ? (
          <p className="text-sm text-red-300">{remote.errors.weather}</p>
        ) : !remote.weather ? (
          <Loading />
        ) : (
          <div className="flex items-center gap-3">
            <strong className="text-xl">
              {Math.round(remote.weather.temperature)}°
            </strong>
            <span className="text-sm">{weatherName(remote.weather.code)}</span>
            <span className="text-xs text-white/50">
              Feels {Math.round(remote.weather.feelsLike)}° ·{" "}
              {Math.round(remote.weather.wind)} mph
            </span>
          </div>
        )}
      </DataRow>

      <DataRow
        icon={Activity}
        iconClass="bg-emerald-500/15 text-emerald-300"
        title="Current status"
      >
        {!status ? (
          <Loading />
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={status.online ? "bg-green-700" : "bg-slate-700"}>
              {status.online ? "Online" : "Offline"}
            </Badge>
            <span className="font-medium">{status.activity}</span>
            <span className="text-xs text-white/45">· {status.focus}</span>
          </div>
        )}
      </DataRow>

      <DataRow
        icon={Zap}
        iconClass="bg-amber-500/15 text-amber-300"
        title="Simulated vitals"
      >
        {!vitals ? (
          <Loading />
        ) : (
          <div className="space-y-1.5">
            <Meter label="Energy" value={vitals.energy} color="bg-amber-400" />
            <Meter label="Focus" value={vitals.focus} color="bg-violet-400" />
            <Meter
              label="Hydration"
              value={vitals.hydration}
              color="bg-sky-400"
            />
            <div className="flex gap-4 pt-1 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <HeartPulse size={13} className="text-rose-400" />
                {vitals.pulse} bpm
              </span>
              <span className="flex items-center gap-1">
                <Coffee size={13} className="text-amber-300" />
                {VITALS.coffee} cups
              </span>
              <span className="flex items-center gap-1">
                <Droplets size={13} className="text-sky-300" />
                live model
              </span>
            </div>
          </div>
        )}
      </DataRow>

      <DataRow
        icon={Gamepad2}
        iconClass="bg-blue-500/15 text-blue-300"
        title="Steam · EndPlex"
      >
        {remote.errors.steam ? (
          <p className="text-sm text-amber-200">{remote.errors.steam}</p>
        ) : !remote.steam ? (
          <Loading />
        ) : (
          <>
            <div className="flex items-center gap-2">
              <a
                className="font-semibold hover:underline"
                href={remote.steam.profileUrl}
                rel="noreferrer"
                target="_blank"
              >
                {remote.steam.username}
              </a>
              <Badge className="bg-blue-700">{remote.steam.state}</Badge>
            </div>
            <p className="mt-1 text-xs text-white/55">
              {remote.steam.games} games · {remote.steam.totalHours} hours ·
              Most played: {remote.steam.mostPlayed}
            </p>
          </>
        )}
      </DataRow>
    </div>
  );
}
