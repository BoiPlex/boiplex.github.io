const STEAM_USERNAME = "EndPlex";
const STEAM_API_BASE = "https://api.steampowered.com";

type ResolveVanityResponse = {
  response: {
    success: number;
    steamid?: string;
  };
};

type PlayerSummaryResponse = {
  response: {
    players: Array<{
      personaname: string;
      profileurl: string;
      personastate: number;
      gameextrainfo?: string;
    }>;
  };
};

type OwnedGamesResponse = {
  response: {
    game_count?: number;
    games?: Array<{
      name: string;
      playtime_forever: number;
    }>;
  };
};

async function getSteamJson<T>(path: string, params: URLSearchParams) {
  const response = await fetch(`${STEAM_API_BASE}${path}?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Steam responded with ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function GET() {
  const apiKey = process.env.STEAM_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error: "Add STEAM_API_KEY to .env to enable live Steam data.",
        configured: false,
      },
      { status: 503 },
    );
  }

  try {
    const resolved = await getSteamJson<ResolveVanityResponse>(
      "/ISteamUser/ResolveVanityURL/v1/",
      new URLSearchParams({
        key: apiKey,
        vanityurl: STEAM_USERNAME,
      }),
    );
    const steamId = resolved.response.steamid;

    if (resolved.response.success !== 1 || !steamId) {
      return Response.json(
        { error: `Could not resolve Steam user ${STEAM_USERNAME}.` },
        { status: 404 },
      );
    }

    const [summary, library] = await Promise.all([
      getSteamJson<PlayerSummaryResponse>(
        "/ISteamUser/GetPlayerSummaries/v2/",
        new URLSearchParams({ key: apiKey, steamids: steamId }),
      ),
      getSteamJson<OwnedGamesResponse>(
        "/IPlayerService/GetOwnedGames/v1/",
        new URLSearchParams({
          key: apiKey,
          steamid: steamId,
          include_appinfo: "1",
          include_played_free_games: "1",
        }),
      ),
    ]);

    const player = summary.response.players[0];
    const games = library.response.games ?? [];
    const mostPlayed = games.reduce<(typeof games)[number] | undefined>(
      (current, game) =>
        !current || game.playtime_forever > current.playtime_forever
          ? game
          : current,
      undefined,
    );
    const totalHours = Math.round(
      games.reduce((minutes, game) => minutes + game.playtime_forever, 0) / 60,
    );

    return Response.json({
      username: player?.personaname ?? STEAM_USERNAME,
      profileUrl:
        player?.profileurl ?? `https://steamcommunity.com/id/${STEAM_USERNAME}`,
      state: player?.gameextrainfo
        ? `Playing ${player.gameextrainfo}`
        : ["Offline", "Online", "Busy", "Away", "Snooze"][
            player?.personastate ?? 0
          ] ?? "Online",
      games: library.response.game_count ?? games.length,
      totalHours,
      mostPlayed: mostPlayed?.name ?? "Private",
    });
  } catch {
    return Response.json(
      { error: "Steam data is temporarily unavailable." },
      { status: 502 },
    );
  }
}
