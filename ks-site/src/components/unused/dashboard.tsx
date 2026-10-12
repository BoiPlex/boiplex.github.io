"use client";

import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

// Change these constants to make the dashboard yours.
const IDENTITY = {
  name: "Karim",
  role: "Developer & builder",
  home: "Moraga, California",
  timezone: "PT",
};

const GITHUB_USERNAME = "BoiPlex";
const MORAGA = {
  latitude: 37.8349,
  longitude: -122.1297,
  timezone: "America/Los_Angeles",
};

const STATUS_CONFIG = {
  wakeHour: 8,
  sleepHour: 1,
  activityMinutes: 18,
  activities: [
    "building something",
    "debugging",
    "learning",
    "gaming",
    "planning the next idea",
    "touching grass",
  ],
};

const VITALS_CONFIG = {
  energy: { base: 78, variation: 13 },
  focus: { base: 82, variation: 11 },
  hydration: { base: 71, variation: 8 },
  pulse: { base: 68, variation: 7 },
  caffeineCups: { base: 2, variation: 1 },
};

type GithubData = {
  username: string;
  followers: number;
  repositories: number;
  stars: number;
  latestRepo: string;
  profileUrl: string;
};

type EnvironmentData = {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  windSpeed: number;
};

type SteamData = {
  username: string;
  profileUrl: string;
  state: string;
  games: number;
  totalHours: number;
  mostPlayed: string;
};

type GithubUserResponse = {
  login: string;
  followers: number;
  public_repos: number;
  html_url: string;
};

type GithubRepoResponse = {
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

type RemoteState = {
  github?: GithubData;
  environment?: EnvironmentData;
  steam?: SteamData;
  errors: Partial<Record<"github" | "environment" | "steam", string>>;
};

type Field = {
  label: string;
  value: ReactNode;
};

async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    let message = `Request failed with ${response.status}`;

    try {
      const body = (await response.json()) as { error?: string };
      message = body.error ?? message;
    } catch {
      // Some services return an empty or non-JSON error response.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function getPacificHour(date: Date) {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: MORAGA.timezone,
      hour: "numeric",
      hourCycle: "h23",
    }).format(date),
  );
}

function getStatus(date: Date) {
  const hour = getPacificHour(date);
  const { wakeHour, sleepHour, activityMinutes, activities } = STATUS_CONFIG;
  const awake =
    wakeHour < sleepHour
      ? hour >= wakeHour && hour < sleepHour
      : hour >= wakeHour || hour < sleepHour;

  if (!awake) {
    return {
      availability: "offline",
      doing: "sleeping",
      focus: "recharging",
    };
  }

  const bucket = Math.floor(date.getTime() / (activityMinutes * 60_000));
  const activity = activities[Math.floor(seededUnit(bucket) * activities.length)];

  return {
    availability: "online",
    doing: activity,
    focus: seededUnit(bucket + 4) > 0.7 ? "deep focus" : "interruptible",
  };
}

function getVitals(date: Date) {
  const seconds = date.getTime() / 1000;
  const wave = (period: number, offset = 0) =>
    Math.sin(seconds / period + offset);

  return {
    energy: Math.round(
      clamp(
        VITALS_CONFIG.energy.base +
          wave(43) * VITALS_CONFIG.energy.variation,
      ),
    ),
    focus: Math.round(
      clamp(
        VITALS_CONFIG.focus.base +
          wave(29, 1.7) * VITALS_CONFIG.focus.variation,
      ),
    ),
    hydration: Math.round(
      clamp(
        VITALS_CONFIG.hydration.base +
          wave(71, 0.8) * VITALS_CONFIG.hydration.variation,
      ),
    ),
    pulse: Math.round(
      VITALS_CONFIG.pulse.base +
        wave(3.2) * VITALS_CONFIG.pulse.variation,
    ),
    caffeine: Math.max(
      0,
      Math.round(
        VITALS_CONFIG.caffeineCups.base +
          wave(97, 2.1) * VITALS_CONFIG.caffeineCups.variation,
      ),
    ),
  };
}

function weatherLabel(code: number) {
  if (code === 0) return "clear";
  if (code <= 3) return "cloudy";
  if (code <= 48) return "foggy";
  if (code <= 67) return "raining";
  if (code <= 77) return "snowing";
  if (code <= 82) return "showers";
  return "stormy";
}

function EndpointRow({
  path,
  fields,
  loading = false,
  error,
}: {
  path: string;
  fields: Field[];
  loading?: boolean;
  error?: string;
}) {
  return (
    <section className="border-t border-white/10 px-4 py-3 first:border-t-0">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded bg-cyan-400/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
          GET
        </span>
        <code className="truncate text-xs text-white/85">{path}</code>
        <span
          className={`ml-auto h-1.5 w-1.5 rounded-full ${
            error
              ? "bg-red-400"
              : loading
                ? "animate-pulse bg-amber-300"
                : "bg-emerald-400"
          }`}
        />
      </div>

      {error ? (
        <p className="text-xs leading-relaxed text-red-300/90">{error}</p>
      ) : loading ? (
        <p className="animate-pulse font-mono text-xs text-white/35">
          awaiting response...
        </p>
      ) : (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {fields.map((field) => (
            <span className="text-xs text-white/85" key={field.label}>
              <span className="mr-1 text-white/35">{field.label}</span>
              {field.value}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

export default function Dashboard() {
  const [remote, setRemote] = useState<RemoteState>({ errors: {} });
  const [online, setOnline] = useState(false);
  const [timestamp, setTimestamp] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function loadRemoteData() {
      const githubRequest = Promise.all([
        fetchJson<GithubUserResponse>(
          `https://api.github.com/users/${GITHUB_USERNAME}`,
          signal,
        ),
        fetchJson<GithubRepoResponse[]>(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
          signal,
        ),
      ]).then(([user, repos]) => {
        const originalRepos = repos.filter((repo) => !repo.fork);

        return {
          username: user.login,
          followers: user.followers,
          repositories: user.public_repos,
          stars: originalRepos.reduce(
            (total, repo) => total + repo.stargazers_count,
            0,
          ),
          latestRepo: originalRepos[0]?.name ?? "none",
          profileUrl: user.html_url,
        } satisfies GithubData;
      });

      const weatherUrl = new URL(
        "https://api.open-meteo.com/v1/forecast",
      );
      weatherUrl.search = new URLSearchParams({
        latitude: String(MORAGA.latitude),
        longitude: String(MORAGA.longitude),
        current:
          "temperature_2m,apparent_temperature,weather_code,wind_speed_10m",
        temperature_unit: "fahrenheit",
        wind_speed_unit: "mph",
        timezone: MORAGA.timezone,
      }).toString();

      const environmentRequest = fetchJson<WeatherResponse>(
        weatherUrl.toString(),
        signal,
      ).then(
        ({ current }) =>
          ({
            temperature: current.temperature_2m,
            apparentTemperature: current.apparent_temperature,
            weatherCode: current.weather_code,
            windSpeed: current.wind_speed_10m,
          }) satisfies EnvironmentData,
      );

      const steamRequest = fetchJson<SteamData>("/api/steam", signal);
      const results = await Promise.allSettled([
        githubRequest,
        environmentRequest,
        steamRequest,
      ]);

      if (signal.aborted) return;

      const next: RemoteState = { errors: {} };
      const keys = ["github", "environment", "steam"] as const;

      results.forEach((result, index) => {
        const key = keys[index];

        if (result.status === "fulfilled") {
          Object.assign(next, { [key]: result.value });
        } else {
          next.errors[key] =
            result.reason instanceof Error
              ? result.reason.message
              : "Data unavailable";
        }
      });

      setRemote(next);
      setOnline(true);
    }

    void loadRemoteData();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setTimestamp(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const now = timestamp ? new Date(timestamp) : null;
  const status = now ? getStatus(now) : null;
  const vitals = now ? getVitals(now) : null;
  const github = remote.github;
  const environment = remote.environment;
  const steam = remote.steam;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-gray-950/90 font-mono text-white shadow-2xl shadow-cyan-950/20 backdrop-blur">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-[10px] tracking-[0.24em] text-cyan-300/60 uppercase">
            human interface
          </p>
          <h3 className="text-base font-bold">KAR/api v0.2</h3>
        </div>
        <Badge
          className={
            online
              ? "ml-auto bg-emerald-700 text-white"
              : "ml-auto bg-amber-700 text-white"
          }
        >
          {online ? "Online" : "Connecting"}
        </Badge>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <EndpointRow
          path="/identity"
          fields={[
            { label: "name", value: IDENTITY.name },
            { label: "role", value: IDENTITY.role },
            { label: "home", value: IDENTITY.home },
            { label: "tz", value: IDENTITY.timezone },
          ]}
        />
        <EndpointRow
          path={`/github/${GITHUB_USERNAME}`}
          loading={!github && !remote.errors.github}
          error={remote.errors.github}
          fields={
            github
              ? [
                  {
                    label: "user",
                    value: (
                      <a
                        className="text-cyan-300 hover:underline"
                        href={github.profileUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {github.username}
                      </a>
                    ),
                  },
                  { label: "repos", value: github.repositories },
                  { label: "stars", value: github.stars },
                  { label: "followers", value: github.followers },
                  { label: "latest", value: github.latestRepo },
                ]
              : []
          }
        />
        <EndpointRow
          path="/environment/moraga"
          loading={!environment && !remote.errors.environment}
          error={remote.errors.environment}
          fields={
            environment
              ? [
                  {
                    label: "local",
                    value: now
                      ? new Intl.DateTimeFormat("en-US", {
                          timeZone: MORAGA.timezone,
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(now)
                      : "--",
                  },
                  {
                    label: "weather",
                    value: weatherLabel(environment.weatherCode),
                  },
                  {
                    label: "temp",
                    value: `${Math.round(environment.temperature)}°F`,
                  },
                  {
                    label: "feels",
                    value: `${Math.round(environment.apparentTemperature)}°F`,
                  },
                  {
                    label: "wind",
                    value: `${Math.round(environment.windSpeed)} mph`,
                  },
                ]
              : []
          }
        />
        <EndpointRow
          path="/status"
          loading={!status}
          fields={
            status
              ? [
                  { label: "state", value: status.availability },
                  { label: "doing", value: status.doing },
                  { label: "focus", value: status.focus },
                ]
              : []
          }
        />
        <EndpointRow
          path="/vitals"
          loading={!vitals}
          fields={
            vitals
              ? [
                  { label: "energy", value: `${vitals.energy}%` },
                  { label: "focus", value: `${vitals.focus}%` },
                  { label: "hydration", value: `${vitals.hydration}%` },
                  { label: "pulse", value: `${vitals.pulse} bpm` },
                  { label: "coffee", value: `${vitals.caffeine} cups` },
                ]
              : []
          }
        />
        <EndpointRow
          path="/steam/EndPlex"
          loading={!steam && !remote.errors.steam}
          error={remote.errors.steam}
          fields={
            steam
              ? [
                  {
                    label: "user",
                    value: (
                      <a
                        className="text-cyan-300 hover:underline"
                        href={steam.profileUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {steam.username}
                      </a>
                    ),
                  },
                  { label: "state", value: steam.state },
                  { label: "games", value: steam.games },
                  { label: "hours", value: steam.totalHours },
                  { label: "top", value: steam.mostPlayed },
                ]
              : []
          }
        />
      </div>
    </div>
  );
}
