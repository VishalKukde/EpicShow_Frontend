"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import CategoryHero from "../components/CategoryHero";
import { fetchSports } from "@/lib/sportsApi";
import type { SportMatch } from "@/app/sports/data";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T00:00:00`));

const TEAM_THEMES: Array<{
  aliases: string[];
  backgroundColor: string;
  color: string;
  shortName: string;
}> = [
  {
    aliases: ["csk", "chennai super kings"],
    backgroundColor: "#F9D423",
    color: "#1F2937",
    shortName: "CSK",
  },
  {
    aliases: ["mi", "mumbai indians"],
    backgroundColor: "#004BA0",
    color: "#FFFFFF",
    shortName: "MI",
  },
  {
    aliases: ["rcb", "royal challengers bengaluru", "royal challengers bangalore"],
    backgroundColor: "#D71920",
    color: "#FFFFFF",
    shortName: "RCB",
  },
  {
    aliases: ["kkr", "kolkata knight riders"],
    backgroundColor: "#3A225D",
    color: "#FFFFFF",
    shortName: "KKR",
  },
  {
    aliases: ["srh", "sunrisers hyderabad"],
    backgroundColor: "#F15A29",
    color: "#FFFFFF",
    shortName: "SRH",
  },
  {
    aliases: ["rr", "rajasthan royals"],
    backgroundColor: "#E91E63",
    color: "#FFFFFF",
    shortName: "RR",
  },
  {
    aliases: ["pbks", "punjab kings", "kings xi punjab", "kxip"],
    backgroundColor: "#C8102E",
    color: "#FFFFFF",
    shortName: "PBKS",
  },
  {
    aliases: ["dc", "delhi capitals", "delhi daredevils"],
    backgroundColor: "#17479E",
    color: "#FFFFFF",
    shortName: "DC",
  },
  {
    aliases: ["gt", "gujarat titans"],
    backgroundColor: "#0B1C3D",
    color: "#FFFFFF",
    shortName: "GT",
  },
  {
    aliases: ["lsg", "lucknow super giants"],
    backgroundColor: "#00A3A3",
    color: "#0F172A",
    shortName: "LSG",
  },
];

const FALLBACK_PALETTE: Array<{ backgroundColor: string; color: string }> = [
  { backgroundColor: "#E2E8F0", color: "#0F172A" },
  { backgroundColor: "#DBEAFE", color: "#1E3A8A" },
  { backgroundColor: "#FCE7F3", color: "#9D174D" },
  { backgroundColor: "#DCFCE7", color: "#166534" },
  { backgroundColor: "#FEF3C7", color: "#92400E" },
  { backgroundColor: "#EDE9FE", color: "#5B21B6" },
];

const TEAM_LOGOS: Record<string, string> = {
  CSK: "/assets/teamLogo/CSK.png",
  MI: "/assets/teamLogo/MI.png",
  DC: "/assets/teamLogo/DC.png",
  RCB: "/assets/teamLogo/RCB.png",
  SRH: "/assets/teamLogo/SRH.png",
  LSG: "/assets/teamLogo/LSG.png",
  PBKS: "/assets/teamLogo/PK.png",
};

const getTeamLogo = (shortName: string) => TEAM_LOGOS[shortName] ?? null;

const normalizeTeamName = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const matchesAlias = (normalized: string, alias: string) => {
  if (alias.length <= 3) {
    return normalized.split(" ").includes(alias);
  }
  return normalized.includes(alias);
};

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 2147483647;
  }
  return hash;
};

const getFallbackShortName = (teamName: string) =>
  teamName
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 4) || teamName.slice(0, 3).toUpperCase();

const getTeamTheme = (teamName: string) => {
  const normalized = normalizeTeamName(teamName);
  const found = TEAM_THEMES.find((theme) =>
    theme.aliases.some((alias) => matchesAlias(normalized, alias))
  );
  if (found) return found;

  const paletteIndex =
    Math.abs(hashString(normalized)) % FALLBACK_PALETTE.length;
  const fallback = FALLBACK_PALETTE[paletteIndex];
  return {
    ...fallback,
    shortName: getFallbackShortName(teamName),
  };
};

export default function SportsPage() {
  const [matches, setMatches] = useState<SportMatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [teamFilter, setTeamFilter] = useState<string>("all");

  useEffect(() => {
    let active = true;
    fetchSports()
      .then((data) => {
        if (!active) return;
        setMatches(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load sports");
      });
    return () => {
      active = false;
    };
  }, []);

  const teamOptions = useMemo(() => {
    const uniqueTeams = new Set<string>();
    matches.forEach((match) => {
      uniqueTeams.add(match.teamA);
      uniqueTeams.add(match.teamB);
    });
    return Array.from(uniqueTeams).sort((a, b) =>
      a.localeCompare(b, "en", { sensitivity: "base" })
    );
  }, [matches]);

  const filteredMatches = useMemo(() => {
    if (teamFilter === "all") return matches;
    return matches.filter(
      (match) => match.teamA === teamFilter || match.teamB === teamFilter
    );
  }, [matches, teamFilter]);

  return (
    <PageTransition>
      <div className="bg-background min-h-screen select-none">
        <CategoryHero
          title="Sports"
          subtitle="Live cricket action with premium stadium seating"
        />

        <section className="max-w-7xl mx-auto px-5 pb-24">
          {error && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <label
              htmlFor="team-filter"
              className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400"
            >
              Filter
            </label>
            <select
              id="team-filter"
              value={teamFilter}
              onChange={(event) => setTeamFilter(event.target.value)}
              className="h-9 min-w-[100px] rounded-full border border-slate-200/80 bg-white/90 px-3 text-xs font-semibold text-slate-700 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-300/60 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:ring-slate-600/40"
            >
              <option value="all">All Teams</option>
              {teamOptions.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-6 sm:gap-7 lg:gap-8 grid-cols-1 md:grid-cols-2">
            {filteredMatches.map((match, index) => {
              const teamATheme = getTeamTheme(match.teamA);
              const teamBTheme = getTeamTheme(match.teamB);
              const teamALogo = getTeamLogo(teamATheme.shortName);
              const teamBLogo = getTeamLogo(teamBTheme.shortName);

              return (
                <motion.div
                  key={match._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <Link href={`/sports/${match._id}`} className="group block h-full">
                    <div className="relative h-full overflow-hidden rounded-[26px] border border-slate-200/80 bg-white/95 shadow-[0_16px_36px_-24px_rgba(15,23,42,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_-26px_rgba(15,23,42,0.55)] dark:border-slate-800/80 dark:bg-slate-950/85 dark:shadow-[0_20px_40px_-28px_rgba(0,0,0,0.6)]">
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-200/50 via-white/80 to-slate-200/50 dark:from-slate-700/40 dark:via-slate-900/70 dark:to-slate-700/40" />
                      <div className="grid grid-cols-[25%_50%_25%] divide-x divide-slate-200/70 dark:divide-slate-700/70">
                        <div
                          className="relative flex min-w-0 items-center justify-center px-4 py-4 text-center text-lg font-semibold tracking-[0.16em] sm:px-5 sm:py-6 sm:text-xl sm:tracking-[0.2em]"
                          style={{
                            backgroundColor: teamALogo ? "transparent" : teamATheme.backgroundColor,
                            color: teamATheme.color,
                            backgroundImage: teamALogo ? `url(${teamALogo})` : undefined,
                            backgroundSize: teamALogo ? "cover" : undefined,
                            backgroundPosition: teamALogo ? "center" : undefined,
                            backgroundRepeat: teamALogo ? "no-repeat" : undefined,
                          }}
                        >
                          {!teamALogo && (
                            <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_rgba(255,255,255,0)_60%)]" />
                          )}
                          <span className="relative z-10 drop-shadow-[0_2px_12px_rgba(15,23,42,0.35)]">
                            {teamATheme.shortName}
                          </span>
                          <span className="sr-only">{match.teamA}</span>
                        </div>
                        <div className="flex h-full min-w-0 flex-col items-center px-4 py-3 text-center sm:px-5 sm:py-5">
                          <span className="rounded-full border border-slate-200/70 bg-slate-50/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-400">
                            {match.matchNo}
                          </span>
                          <div className="mt-3 flex flex-1 flex-col items-center justify-center gap-2">
                            <span className="w-full truncate text-sm font-semibold text-slate-900 sm:text-base dark:text-slate-50">
                              {match.teamA}
                              </span>
                              <span className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-500 dark:text-slate-400">
                                VS
                              </span>
                              <span className="w-full truncate text-sm font-semibold text-slate-900 sm:text-base dark:text-slate-50">
                                {match.teamB}
                              </span>
                            </div>
                          <span className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 sm:mt-4 sm:text-xs sm:tracking-[0.2em] dark:text-slate-400">
                            {formatDate(match.date)}
                          </span>
                        </div>
                        <div
                          className="relative flex min-w-0 items-center justify-center px-4 py-4 text-center text-lg font-semibold tracking-[0.16em] sm:px-5 sm:py-6 sm:text-xl sm:tracking-[0.2em]"
                          style={{
                            backgroundColor: teamBLogo ? "transparent" : teamBTheme.backgroundColor,
                            color: teamBTheme.color,
                            backgroundImage: teamBLogo ? `url(${teamBLogo})` : undefined,
                            backgroundSize: teamBLogo ? "cover" : undefined,
                            backgroundPosition: teamBLogo ? "center" : undefined,
                            backgroundRepeat: teamBLogo ? "no-repeat" : undefined,
                          }}
                        >
                          {!teamBLogo && (
                            <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_rgba(255,255,255,0)_60%)]" />
                          )}
                          <span className="relative z-10 drop-shadow-[0_2px_12px_rgba(15,23,42,0.35)]">
                            {teamBTheme.shortName}
                          </span>
                          <span className="sr-only">{match.teamB}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
