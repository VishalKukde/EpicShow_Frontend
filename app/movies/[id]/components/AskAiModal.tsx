"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

type WikiSummary = {
  title?: string;
  description?: string;
  extract?: string;
  type?: string;
  wikibase_item?: string;
  thumbnail?: {
    source?: string;
    width?: number;
    height?: number;
  };
  originalimage?: {
    source?: string;
    width?: number;
    height?: number;
  };
  content_urls?: {
    desktop?: {
      page?: string;
    };
  };
};

type AskAiModalProps = {
  open: boolean;
  movieTitle: string;
  releaseDate?: string;
  onClose: () => void;
};

type WikiDetails = {
  cast: string[];
  director: string[];
  writer: string[];
  composer: string[];
  genres: string[];
  productionCompanies: string[];
  country: string[];
  language: string[];
  releaseDate?: string;
  runtime?: string;
  budget?: string;
  boxOffice?: string;
};

const buildCandidates = (title: string, releaseDate?: string) => {
  const trimmed = title.trim();
  if (!trimmed) return [];
  const parsed = releaseDate ? new Date(releaseDate) : null;
  const year =
    parsed && !Number.isNaN(parsed.getTime()) ? parsed.getFullYear() : null;
  const candidates = [
    trimmed,
    `${trimmed} (film)`,
    year ? `${trimmed} (${year} film)` : null,
  ].filter(Boolean) as string[];
  return Array.from(new Set(candidates));
};

const getUnitId = (unit?: string) => {
  if (!unit) return null;
  const parts = unit.split("/");
  return parts[parts.length - 1] || null;
};

const formatWikidataDate = (value?: string) => {
  if (!value) return null;
  const cleaned = value.startsWith("+") ? value.slice(1) : value;
  const parsed = new Date(cleaned);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatRuntime = (amount?: string, unit?: string) => {
  if (!amount) return null;
  const numeric = Number(amount.replace("+", ""));
  if (Number.isNaN(numeric)) return null;
  const unitId = getUnitId(unit);
  if (unitId === "Q25240") {
    return `${Math.round(numeric * 60)} min`;
  }
  if (unitId === "Q25235") {
    return `${Math.round(numeric / 60)} min`;
  }
  return `${Math.round(numeric)} min`;
};

const currencyMap: Record<string, string> = {
  Q4917: "USD",
  Q25344: "GBP",
  Q4916: "EUR",
  Q80524: "INR",
};

const formatMoney = (amount?: string, unit?: string) => {
  if (!amount) return null;
  const numeric = Number(amount.replace("+", ""));
  if (Number.isNaN(numeric)) return null;
  const unitId = getUnitId(unit);
  const currency = unitId ? currencyMap[unitId] : null;
  if (currency) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(numeric);
  }
  return numeric.toLocaleString("en-US");
};

const fetchSummary = async (title: string, signal: AbortSignal) => {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    {
      signal,
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load Wikipedia summary");
  }

  return (await response.json()) as WikiSummary;
};

const searchWikipedia = async (query: string, signal: AbortSignal) => {
  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query
    )}&format=json&origin=*`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Search request failed");
  }

  const data = (await response.json()) as {
    query?: { search?: { title?: string }[] };
  };
  return data?.query?.search?.[0]?.title ?? null;
};

const fetchWikidataEntity = async (id: string, signal: AbortSignal) => {
  const response = await fetch(
    `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`,
    {
      signal,
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load Wikidata");
  }

  return (await response.json()) as {
    entities?: Record<string, { claims?: Record<string, any[]> }>;
  };
};

const fetchLabels = async (ids: string[], signal: AbortSignal) => {
  if (!ids.length) return {};
  const response = await fetch(
    `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids.join(
      "|"
    )}&props=labels&languages=en&format=json&origin=*`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Failed to load Wikidata labels");
  }

  const data = (await response.json()) as {
    entities?: Record<string, { labels?: { en?: { value?: string } } }>;
  };

  const labels: Record<string, string> = {};
  Object.entries(data.entities || {}).forEach(([id, entity]) => {
    const label = entity?.labels?.en?.value;
    if (label) labels[id] = label;
  });
  return labels;
};

const extractIds = (
  claims: Record<string, any[]> | undefined,
  prop: string,
  limit?: number
) => {
  if (!claims?.[prop]) return [];
  const ids: string[] = [];
  for (const claim of claims[prop]) {
    const id = claim?.mainsnak?.datavalue?.value?.id;
    if (id) ids.push(id);
    if (limit && ids.length >= limit) break;
  }
  return ids;
};

const extractTime = (claims: Record<string, any[]> | undefined, prop: string) => {
  const value = claims?.[prop]?.[0]?.mainsnak?.datavalue?.value?.time;
  return value as string | undefined;
};

const extractQuantity = (
  claims: Record<string, any[]> | undefined,
  prop: string
) => {
  const value = claims?.[prop]?.[0]?.mainsnak?.datavalue?.value;
  if (!value) return null;
  return {
    amount: value?.amount as string | undefined,
    unit: value?.unit as string | undefined,
  };
};

export default function AskAiModal({
  open,
  movieTitle,
  releaseDate,
  onClose,
}: AskAiModalProps) {
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [summary, setSummary] = useState<WikiSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<WikiDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const candidates = useMemo(() => {
    const next = buildCandidates(movieTitle, releaseDate);
    return next;
  }, [movieTitle, releaseDate]);
  const [retrySeed, setRetrySeed] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    const controller = new AbortController();

    const loadSummary = async () => {
      if (!candidates.length) {
        setError("Movie title unavailable.");
        setSummary(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setSummary(null);

      try {
        let found: WikiSummary | null = null;

        for (const title of candidates) {
          const data = await fetchSummary(title, controller.signal);
          if (data && data?.type !== "disambiguation") {
            found = data;
            break;
          }
        }

        if (!found) {
          const searchTitle = await searchWikipedia(
            `${movieTitle} film`,
            controller.signal
          );
          if (searchTitle) {
            const data = await fetchSummary(searchTitle, controller.signal);
            if (data && data?.type !== "disambiguation") {
              found = data;
            }
          }
        }

        if (active) {
          if (found) {
            setSummary(found);
          } else {
            setError("No Wikipedia summary found for this title.");
          }
        }
      } catch (err) {
        if (!active || controller.signal.aborted) return;
        setError("Unable to load Wikipedia details. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSummary();

    return () => {
      active = false;
      controller.abort();
    };
  }, [open, candidates, movieTitle, retrySeed]);

  useEffect(() => {
    if (!open) return;
    const wikibaseId = summary?.wikibase_item;
    if (!wikibaseId) {
      setDetails(null);
      setDetailsLoading(false);
      return;
    }

    let active = true;
    const controller = new AbortController();
    setDetailsLoading(true);

    const loadDetails = async () => {
      try {
        const data = await fetchWikidataEntity(wikibaseId, controller.signal);
        const entity = data.entities?.[wikibaseId];
        const claims = entity?.claims || {};

        const castIds = extractIds(claims, "P161", 5);
        const directorIds = extractIds(claims, "P57", 2);
        const writerIds = extractIds(claims, "P58", 2);
        const composerIds = extractIds(claims, "P86", 2);
        const genreIds = extractIds(claims, "P136", 6);
        const companyIds = extractIds(claims, "P272", 4);
        const countryIds = extractIds(claims, "P495", 3);
        const languageIds = extractIds(claims, "P364", 3);

        const idsToLabel = Array.from(
          new Set([
            ...castIds,
            ...directorIds,
            ...writerIds,
            ...composerIds,
            ...genreIds,
            ...companyIds,
            ...countryIds,
            ...languageIds,
          ])
        );

        const labels = await fetchLabels(idsToLabel, controller.signal);

        const releaseDate = formatWikidataDate(extractTime(claims, "P577"));
        const runtimeQuantity = extractQuantity(claims, "P2047");
        const runtime = formatRuntime(runtimeQuantity?.amount, runtimeQuantity?.unit);
        const budgetQuantity = extractQuantity(claims, "P2130");
        const boxOfficeQuantity = extractQuantity(claims, "P2142");

        const nextDetails: WikiDetails = {
          cast: castIds.map((id) => labels[id]).filter(Boolean),
          director: directorIds.map((id) => labels[id]).filter(Boolean),
          writer: writerIds.map((id) => labels[id]).filter(Boolean),
          composer: composerIds.map((id) => labels[id]).filter(Boolean),
          genres: genreIds.map((id) => labels[id]).filter(Boolean),
          productionCompanies: companyIds.map((id) => labels[id]).filter(Boolean),
          country: countryIds.map((id) => labels[id]).filter(Boolean),
          language: languageIds.map((id) => labels[id]).filter(Boolean),
          releaseDate: releaseDate || undefined,
          runtime: runtime || undefined,
          budget: formatMoney(budgetQuantity?.amount, budgetQuantity?.unit) || undefined,
          boxOffice: formatMoney(boxOfficeQuantity?.amount, boxOfficeQuantity?.unit) || undefined,
        };

        if (active) {
          setDetails(nextDetails);
        }
      } catch (err) {
        if (!active || controller.signal.aborted) return;
        setDetails(null);
      } finally {
        if (active) setDetailsLoading(false);
      }
    };

    loadDetails();

    return () => {
      active = false;
      controller.abort();
    };
  }, [open, summary?.wikibase_item]);

  if (!open) return null;

  const wikiImage =
    summary?.thumbnail?.source ||
    summary?.originalimage?.source ||
    null;
  const wikiLink = summary?.content_urls?.desktop?.page;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-3 py-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ask AI"
    >
      <div
        className={`relative h-[70vh] w-[70vw] max-w-3xl overflow-hidden rounded-2xl border shadow-2xl ${
          dark ? "border-white/10 bg-slate-950 text-white" : "border-gray-200 bg-white text-gray-900"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          <div
            className={`flex items-center justify-between border-b px-4 py-3 sm:px-5 ${
              dark ? "border-white/10" : "border-gray-200"
            }`}
          >
            <div>
              <p
                className={`text-[10px] font-semibold uppercase tracking-[0.3em] ${
                  dark ? "text-indigo-200/80" : "text-indigo-500"
                }`}
              >
                Ask AI
              </p>
              <h2 className="text-lg font-semibold sm:text-xl">
                {summary?.title || movieTitle}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs transition ${
                dark
                  ? "border-white/10 bg-white/5 hover:bg-white/10"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100"
              }`}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
            {loading && (
              <div className="space-y-3">
                <div className={`h-5 w-32 animate-pulse rounded ${dark ? "bg-white/10" : "bg-gray-200"}`} />
                <div className={`h-4 w-full animate-pulse rounded ${dark ? "bg-white/10" : "bg-gray-200"}`} />
                <div className={`h-4 w-5/6 animate-pulse rounded ${dark ? "bg-white/10" : "bg-gray-200"}`} />
                <div className={`h-4 w-4/6 animate-pulse rounded ${dark ? "bg-white/10" : "bg-gray-200"}`} />
              </div>
            )}

            {!loading && error && (
              <div className="space-y-3">
                <p className={dark ? "text-white/80" : "text-gray-700"}>{error}</p>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setSummary(null);
                    setLoading(true);
                    setRetrySeed((prev) => prev + 1);
                  }}
                  className={`rounded-xl px-4 py-2 text-sm font-medium ${
                    dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row">
                  {wikiImage && (
                    <div className="w-full flex-shrink-0 sm:w-[180px]">
                      <div
                        className={`aspect-[3/4] overflow-hidden rounded-2xl border ${
                          dark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <img
                          src={wikiImage}
                          alt={summary?.title || movieTitle}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex-1 space-y-3">
                    {summary?.description && (
                      <p
                        className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                          dark ? "text-white/60" : "text-gray-500"
                        }`}
                      >
                        {summary.description}
                      </p>
                    )}
                    <p
                      className={`text-sm leading-relaxed whitespace-pre-line ${
                        dark ? "text-white/80" : "text-gray-700"
                      }`}
                    >
                      {summary?.extract || "No summary available."}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    className={`text-xs font-semibold uppercase tracking-[0.3em] ${
                      dark ? "text-white/60" : "text-gray-500"
                    }`}
                  >
                    Wikipedia details
                  </div>

                  {detailsLoading && (
                    <div className="space-y-2">
                      <div className={`h-4 w-full animate-pulse rounded ${dark ? "bg-white/10" : "bg-gray-200"}`} />
                      <div className={`h-4 w-5/6 animate-pulse rounded ${dark ? "bg-white/10" : "bg-gray-200"}`} />
                      <div className={`h-4 w-4/6 animate-pulse rounded ${dark ? "bg-white/10" : "bg-gray-200"}`} />
                    </div>
                  )}

                  {!detailsLoading && details && (
                    <div className="space-y-4">
                      {details.cast.length > 0 && (
                        <div>
                          <span className={dark ? "text-white/50 text-xs" : "text-gray-500 text-xs"}>
                            Lead cast
                          </span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {details.cast.map((name) => (
                              <span
                                key={name}
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  dark ? "bg-white/10 text-white/80" : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid gap-3 text-xs sm:grid-cols-2">
                        <div>
                          <span className={dark ? "text-white/50" : "text-gray-500"}>Release date</span>
                          <div className="font-semibold">{details.releaseDate || "N/A"}</div>
                        </div>
                        <div>
                          <span className={dark ? "text-white/50" : "text-gray-500"}>Runtime</span>
                          <div className="font-semibold">{details.runtime || "N/A"}</div>
                        </div>
                        <div>
                          <span className={dark ? "text-white/50" : "text-gray-500"}>Genres</span>
                          <div className="font-semibold">
                            {details.genres.length ? details.genres.join(", ") : "N/A"}
                          </div>
                        </div>
                        <div>
                          <span className={dark ? "text-white/50" : "text-gray-500"}>Director</span>
                          <div className="font-semibold">
                            {details.director.length ? details.director.join(", ") : "N/A"}
                          </div>
                        </div>
                        <div>
                          <span className={dark ? "text-white/50" : "text-gray-500"}>Writer</span>
                          <div className="font-semibold">
                            {details.writer.length ? details.writer.join(", ") : "N/A"}
                          </div>
                        </div>
                        <div>
                          <span className={dark ? "text-white/50" : "text-gray-500"}>Composer</span>
                          <div className="font-semibold">
                            {details.composer.length ? details.composer.join(", ") : "N/A"}
                          </div>
                        </div>
                        <div>
                          <span className={dark ? "text-white/50" : "text-gray-500"}>Production</span>
                          <div className="font-semibold">
                            {details.productionCompanies.length
                              ? details.productionCompanies.join(", ")
                              : "N/A"}
                          </div>
                        </div>
                        <div>
                          <span className={dark ? "text-white/50" : "text-gray-500"}>Country</span>
                          <div className="font-semibold">
                            {details.country.length ? details.country.join(", ") : "N/A"}
                          </div>
                        </div>
                        <div>
                          <span className={dark ? "text-white/50" : "text-gray-500"}>Language</span>
                          <div className="font-semibold">
                            {details.language.length ? details.language.join(", ") : "N/A"}
                          </div>
                        </div>
                        <div>
                          <span className={dark ? "text-white/50" : "text-gray-500"}>Budget</span>
                          <div className="font-semibold">{details.budget || "N/A"}</div>
                        </div>
                        <div>
                          <span className={dark ? "text-white/50" : "text-gray-500"}>Box office</span>
                          <div className="font-semibold">{details.boxOffice || "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`rounded-2xl border p-4 text-xs ${
                    dark ? "border-white/10 bg-white/5 text-white/70" : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  <p className="font-semibold uppercase tracking-[0.2em]">Source</p>
                  <p className="mt-2">
                    Wikipedia
                    {wikiLink ? (
                      <a
                        href={wikiLink}
                        target="_blank"
                        rel="noreferrer"
                        className={`ml-2 font-semibold underline-offset-4 hover:underline ${
                          dark ? "text-indigo-200" : "text-indigo-600"
                        }`}
                      >
                        Read more
                      </a>
                    ) : null}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
