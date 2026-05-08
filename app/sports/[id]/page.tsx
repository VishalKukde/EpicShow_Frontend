"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  ChevronDown,
  Clock,
  Crosshair,
  Home,
  MapPin,
  Plane,
  Shield,
  Sparkles,
  Ticket,
  User,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "@/app/components/PageTransition";
import { toSportBookingItem, type SportMatch } from "@/app/sports/data";
import { fetchSportById, fetchTeamPlayers, type TeamRoster } from "@/lib/sportsApi";
import { useSportBookingStore } from "@/store/sportBookingStore";
import { useThemeStore } from "@/store/themeStore";

const TEAM_THEMES: Array<{
  aliases: string[];
  backgroundColor: string;
}> = [
  { aliases: ["csk", "chennai super kings"], backgroundColor: "#F9D423" },
  { aliases: ["mi", "mumbai indians"], backgroundColor: "#004BA0" },
  {
    aliases: ["rcb", "royal challengers bengaluru", "royal challengers bangalore"],
    backgroundColor: "#D71920",
  },
  { aliases: ["kkr", "kolkata knight riders"], backgroundColor: "#3A225D" },
  { aliases: ["srh", "sunrisers hyderabad"], backgroundColor: "#F15A29" },
  { aliases: ["rr", "rajasthan royals"], backgroundColor: "#E91E63" },
  { aliases: ["pbks", "punjab kings", "kings xi punjab", "kxip"], backgroundColor: "#C8102E" },
  { aliases: ["dc", "delhi capitals", "delhi daredevils"], backgroundColor: "#17479E" },
  { aliases: ["gt", "gujarat titans"], backgroundColor: "#0B1C3D" },
  { aliases: ["lsg", "lucknow super giants"], backgroundColor: "#00A3A3" },
];

const normalizeTeamName = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const matchesAlias = (normalized: string, alias: string) => {
  if (alias.length <= 3) {
    return normalized.split(" ").includes(alias);
  }
  return normalized.includes(alias);
};

const getTeamColor = (teamName: string) => {
  const normalized = normalizeTeamName(teamName);
  const found = TEAM_THEMES.find((theme) =>
    theme.aliases.some((alias) => matchesAlias(normalized, alias))
  );
  return found?.backgroundColor ?? "#CBD5F5";
};

const getRoleIcon = (role: string) => {
  const normalized = role.toLowerCase();
  if (normalized.includes("wicketkeeper")) return Shield;
  if (normalized.includes("all-rounder")) return Sparkles;
  if (normalized.includes("bowler")) return Crosshair;
  if (normalized.includes("batsman")) return User;
  return User;
};

type StandTier = "vip" | "premium" | "standard";

const STANDS: { code: string; label: string; tier: StandTier }[] = [
  { code: "A", label: "Stand A", tier: "premium" },
  { code: "B", label: "Stand B", tier: "vip" },
  { code: "C", label: "Stand C", tier: "standard" },
  { code: "D", label: "Stand D", tier: "standard" },
  { code: "E", label: "Stand E", tier: "premium" },
  { code: "F", label: "Stand F", tier: "vip" },
  { code: "G", label: "Stand G", tier: "standard" },
  { code: "H", label: "Stand H", tier: "standard" },
];

const STAND_ROWS = ["A", "B", "C", "D"];
const SEATS_PER_ROW = 20;

const tierHue: Record<StandTier, number> = {
  vip: 28,
  premium: 150,
  standard: 210,
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

export default function SportDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [match, setMatch] = useState<SportMatch | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [matchLoading, setMatchLoading] = useState(true);
  const [teamPlayers, setTeamPlayers] = useState<TeamRoster[]>([]);
  const [teamPlayersError, setTeamPlayersError] = useState<string | null>(null);
  const [teamPlayersLoading, setTeamPlayersLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);
  const setItem = useSportBookingStore((s) => s.setItem);
  const setShow = useSportBookingStore((s) => s.setShow);
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const seatIdExample = `${STANDS[0].code}${STAND_ROWS[0]}1`;
  const heroGradient = useMemo(() => {
    if (!match) return "";
    return `linear-gradient(180deg, ${getTeamColor(match.teamA)} 0%, ${getTeamColor(match.teamB)} 100%)`;
  }, [match]);

  useEffect(() => {
    let active = true;
    setMatchLoading(true);
    fetchSportById(String(id))
      .then((data) => {
        if (!active) return;
        setMatch(data);
        setMatchError(null);
      })
      .catch((err) => {
        if (!active) return;
        setMatch(null);
        setMatchError(err instanceof Error ? err.message : "Failed to load match");
      })
      .finally(() => {
        if (!active) return;
        setMatchLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const resolveTeamRoster = (teamName: string) => {
    const normalized = normalizeTeamName(teamName);
    return teamPlayers.find((team) =>
      [team.teamName, team.shortName].some((alias) =>
        matchesAlias(normalized, normalizeTeamName(alias))
      )
    );
  };

  const teamPlayerRows = useMemo(() => {
    if (!match) return [];
    return [
      { label: "Team A", name: match.teamA },
      { label: "Team B", name: match.teamB },
    ].map((entry) => {
      const roster = resolveTeamRoster(entry.name);
      const awayPlayers = roster?.players.filter((player) => player.away) ?? [];
      const homePlayers = roster?.players.filter((player) => !player.away) ?? [];
      return { ...entry, roster, awayPlayers, homePlayers };
    });
  }, [match, teamPlayers]);

  useEffect(() => {
    let active = true;
    setTeamPlayersLoading(true);
    fetchTeamPlayers()
      .then((data) => {
        if (!active) return;
        setTeamPlayers(data);
        setTeamPlayersError(null);
      })
      .catch((err) => {
        if (!active) return;
        setTeamPlayers([]);
        setTeamPlayersError(
          err instanceof Error ? err.message : "Failed to load team players"
        );
      })
      .finally(() => {
        if (!active) return;
        setTeamPlayersLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          {matchLoading ? "Loading match..." : matchError || "Match not found"}
        </p>
      </div>
    );
  }

  const handleProceed = () => {
    setItem("sport", toSportBookingItem(match));
    setShow(match.venueId, match.venue, match.date, match.time);
    router.push(`/sports/${match._id}/seat-layout`);
  };

  const getStandColor = (tier: StandTier) => {
    const hue = tierHue[tier];
    const saturation = dark ? 42 : 38;
    const lightness = dark ? 50 : 90;
    const alpha = dark ? 0.85 : 0.95;
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  };

  return (
    <PageTransition>
      <div className={`min-h-screen select-none px-4 pb-28 pt-20 sm:px-6 sm:pb-24 ${dark ? "bg-zinc-950 text-zinc-100" : "bg-background text-slate-900"}`}>
        <div className="mx-auto max-w-6xl space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${dark ? "border-zinc-800 bg-zinc-900" : "border-slate-200 bg-white"}`}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div
                className="relative flex h-40 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl text-center sm:h-44 sm:w-56"
                style={{ backgroundImage: heroGradient }}
              >
                <span className="max-w-[14rem] text-balance text-lg font-semibold text-white/90 drop-shadow-sm">
                  {match.teamA}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.5em] text-white/80">
                  VS
                </span>
                <span className="max-w-[14rem] text-balance text-lg font-semibold text-white/90 drop-shadow-sm">
                  {match.teamB}
                </span>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                  <span>{match.league}</span>
                  <span className="h-1 w-1 rounded-full bg-indigo-400" />
                  <span>{match.matchNo}</span>
                </div>
                <h1 className={`text-2xl font-semibold sm:text-3xl ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                  {match.teamA} vs {match.teamB}
                </h1>
                <p className={`text-sm ${dark ? "text-zinc-400" : "text-slate-600"}`}>
                  {match.description}
                </p>
                <div className={`flex flex-wrap items-center gap-3 text-sm ${dark ? "text-zinc-300" : "text-slate-600"}`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(match.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{match.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{match.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className={`relative overflow-hidden rounded-3xl border p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6 ${dark ? "border-zinc-800/80 bg-zinc-950/70 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.7)]" : "border-slate-200/80 bg-white/90"}`}
          >
            {/* <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 ${dark ? "bg-gradient-to-r from-sky-500/30 via-zinc-800 to-indigo-500/40" : "bg-gradient-to-r from-sky-200 via-white to-indigo-200"}`} /> */}
            <button
              type="button"
              onClick={() => setShowPlayers((prev) => !prev)}
              className="flex w-full items-center justify-between gap-3 text-left cursor-pointer"
              aria-expanded={showPlayers}
            >
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl ${dark ? "bg-sky-500/10 text-sky-300" : "bg-sky-50 text-sky-600"}`}>
                  <Users className="h-4 w-4" />
                </span>
                <div>
                  <h2 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                    Team Players
                  </h2>
                  <p className={`text-xs ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                    Lineups for both teams.
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 transition ${dark ? "text-zinc-400" : "text-slate-500"} ${showPlayers ? "rotate-180" : ""}`}
              />
            </button>
            {showPlayers && (
              <div className="mt-4 space-y-4 text-sm">
              {teamPlayersLoading && (
                <div className={`rounded-2xl border px-4 py-4 text-sm ${dark ? "border-zinc-700 bg-zinc-800 text-zinc-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                  Loading team players...
                </div>
              )}
              {teamPlayersError && !teamPlayersLoading && (
                <div className={`rounded-2xl border px-4 py-4 text-sm ${dark ? "border-rose-900/60 bg-rose-950/40 text-rose-200" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                  {teamPlayersError}
                </div>
              )}
              {!teamPlayersLoading && !teamPlayersError && (
                <div className="grid gap-4 lg:grid-cols-2">
                  {teamPlayerRows.map((row) => (
                    <div
                      key={row.name}
                      className={`rounded-2xl border px-4 py-4 shadow-sm ${dark ? "border-zinc-700/70 bg-zinc-900/70 text-zinc-200" : "border-slate-200/70 bg-white/80 text-slate-700"}`}
                    >
                      <div>
                        <h3 className={`text-base font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                          {row.name}
                        </h3>
                      </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className={`rounded-2xl border px-4 py-3 shadow-sm ${dark ? "border-zinc-700/60 bg-zinc-950/70 text-zinc-200" : "border-slate-200/80 bg-white text-slate-700"}`}>
                            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-500">
                              <Home className="h-3 w-3" />
                              Home Players
                            </div>
                            <ul className="mt-2 space-y-1 text-sm">
                              {row.homePlayers.length > 0 ? (
                                row.homePlayers.map((player) => (
                                  <li
                                    key={player.name}
                                    className={`${dark ? "text-zinc-200" : "text-slate-700"}`}
                                  >
                                    {player.name}
                                  </li>
                                ))
                              ) : (
                                <li className={dark ? "text-zinc-400" : "text-slate-500"}>
                                  No home players listed.
                                </li>
                              )}
                            </ul>
                          </div>
                          <div className={`rounded-2xl border px-4 py-3 shadow-sm ${dark ? "border-zinc-700/60 bg-zinc-950/70 text-zinc-200" : "border-slate-200/80 bg-white text-slate-700"}`}>
                            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-500">
                              <Plane className="h-3 w-3" />
                              Away Players
                            </div>
                            <ul className="mt-2 space-y-1 text-sm">
                              {row.awayPlayers.length > 0 ? (
                                row.awayPlayers.map((player) => (
                                  <li
                                    key={player.name}
                                    className={`${dark ? "text-zinc-200" : "text-slate-700"}`}
                                  >
                                    {player.name}
                                  </li>
                                ))
                              ) : (
                                <li className={dark ? "text-zinc-400" : "text-slate-500"}>
                                  No away players listed.
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            )}
          </motion.section>

          <div className={`rounded-3xl border shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur ${dark ? "border-zinc-800/80 bg-zinc-950/70 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.7)]" : "border-slate-200/80 bg-white/90"}`}>
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className={`flex w-full items-center justify-between gap-3 rounded-3xl p-5 text-left transition sm:px-6 cursor-pointer `}
              aria-expanded={showDetails}
            >
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl ${dark ? "bg-indigo-500/10 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
                  <Ticket className="h-4 w-4" />
                </span>
                <div>
                  <span className={`block text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                    Seating & Pricing
                  </span>
                  <span className={`block text-xs ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                    Tap to expand details
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 transition ${dark ? "text-zinc-400" : "text-slate-500"} ${showDetails ? "rotate-180" : ""}`}
              />
            </button>
            {showDetails && (
              <div className="border-t px-5 py-5 sm:px-6 sm:py-6">
                <div className="grid gap-6 lg:grid-cols-[1.15fr_1.85fr]">
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm sm:p-6 ${dark ? "border-zinc-800/80 bg-zinc-950/70" : "border-slate-200/80 bg-white/90"}`}
                >
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 ${dark ? "bg-gradient-to-r from-indigo-500/40 via-zinc-800 to-emerald-500/30" : "bg-gradient-to-r from-indigo-200 via-white to-emerald-200"}`} />
                  <div className={`rounded-2xl border px-4 py-3 ${dark ? "border-zinc-800/80 bg-gradient-to-r from-indigo-500/10 via-zinc-900/40 to-emerald-500/10" : "border-slate-200/80 bg-gradient-to-r from-indigo-50 via-white to-emerald-50"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl ${dark ? "bg-indigo-500/10 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
                          <Ticket className="h-4 w-4" />
                        </span>
                        <div>
                          <h2 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                            Seating Overview
                          </h2>
                          <p className={`text-xs ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                            Quick layout details before you pick seats.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-4 text-sm">
                    <div className={`rounded-2xl border px-4 py-3 shadow-sm ${dark ? "border-zinc-700/70 bg-zinc-900/70 text-zinc-200" : "border-slate-200/70 bg-white/80 text-slate-700"}`}>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                        Layout Info
                      </p>
                      <div className="mt-2 grid gap-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className={dark ? "text-zinc-400" : "text-slate-500"}>Stands</span>
                          <span>{STANDS.map((stand) => stand.code).join(" · ")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={dark ? "text-zinc-400" : "text-slate-500"}>Rows per stand</span>
                          <span>{STAND_ROWS.join(" - ")}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={dark ? "text-zinc-400" : "text-slate-500"}>Seats per row</span>
                          <span>{SEATS_PER_ROW}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={dark ? "text-zinc-400" : "text-slate-500"}>Seat ID format</span>
                          <span>{seatIdExample}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`rounded-2xl border px-4 py-3 text-xs shadow-sm ${dark ? "border-zinc-700/70 bg-zinc-900/70 text-zinc-300" : "border-slate-200/70 bg-white/80 text-slate-600"}`}>
                      Free users can book 2 seats. Pro members can book up to 5 seats.
                    </div>
                  </div>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm sm:p-6 ${dark ? "border-zinc-800/80 bg-zinc-950/70" : "border-slate-200/80 bg-white/90"}`}
                >
                  <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 ${dark ? "bg-gradient-to-r from-amber-500/30 via-zinc-800 to-indigo-500/40" : "bg-gradient-to-r from-amber-200 via-white to-indigo-200"}`} />
                  <div className={`rounded-2xl border px-4 py-3 ${dark ? "border-zinc-800/80 bg-gradient-to-r from-amber-500/10 via-zinc-900/40 to-indigo-500/10" : "border-slate-200/80 bg-gradient-to-r from-amber-50 via-white to-indigo-50"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl ${dark ? "bg-amber-500/10 text-amber-300" : "bg-amber-50 text-amber-600"}`}>
                          <Ticket className="h-4 w-4" />
                        </span>
                        <div>
                          <h2 className={`text-base font-semibold ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                            Stand Pricing
                          </h2>
                          <p className={`text-xs ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                            Compare tiers and pick the best view.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {STANDS.map((stand) => (
                      <div
                        key={stand.code}
                        className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${dark ? "border-zinc-700/70 bg-zinc-900/70 text-zinc-200" : "border-slate-200/70 bg-white/80 text-slate-700"}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: getStandColor(stand.tier) }} />
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                            {stand.label}
                          </p>
                        </div>
                        <p className={`mt-2 text-lg font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                          ₹{match.prices[stand.tier]}
                        </p>
                        <p className={`text-xs ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                          Rows {STAND_ROWS.join(" - ")}
                        </p>
                        <p className={`text-xs ${dark ? "text-zinc-500" : "text-slate-500"}`}>
                          Tier {stand.tier.toUpperCase()}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.section>
                </div>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden sm:flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className={`text-sm ${dark ? "text-zinc-400" : "text-slate-600"}`}>
              Secure your seats now. Free users can pick 2 seats, Pro members up to 5.
            </div>
            <button
              onClick={handleProceed}
              className={`cursor-pointer inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-medium text-white transition ${dark ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-900 hover:bg-gray-800"}`}
            >
              Proceed to Seats
            </button>
          </motion.div>
          <div className={`fixed inset-x-0 bottom-16 z-20 px-4 py-3 sm:hidden ${dark ? "bg-zinc-950/95" : "bg-white/95"}`}>
            <button
              onClick={handleProceed}
              className={`w-full cursor-pointer rounded-2xl px-6 py-3 text-sm font-medium text-white transition ${dark ? "bg-indigo-600 hover:bg-indigo-500" : "bg-gray-900 hover:bg-gray-800"}`}
            >
              Proceed to Seats
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
