import type { SportMatch } from "@/app/sports/data";

export type TeamPlayer = {
  name: string;
  role: string;
  away: boolean;
};

export type TeamRoster = {
  _id: string;
  teamName: string;
  shortName: string;
  players: TeamPlayer[];
};

export const fetchSports = async (): Promise<SportMatch[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sports`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load sports matches");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const fetchSportById = async (id: string): Promise<SportMatch | null> => {
  if (!id) return null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sports/${id}`, {
    cache: "no-store",
    credentials: "include",
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error("Failed to load sport match");
  }

  return res.json();
};

export const fetchTeamPlayers = async (): Promise<TeamRoster[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sports/teams`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to load team players");
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
};
