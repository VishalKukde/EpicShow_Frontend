"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  BadgeCheck,
  Clapperboard,
  CreditCard,
  Gift,
  Github,
  Globe,
  Heart,
  Linkedin,
  Mail,
  MoonStar,
  ShieldCheck,
  Sparkles,
  Ticket,
  Upload,
  Wallet,
  Waves,
  X,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

type FeatureCard = {
  title: string;
  description: string;
  technologies: string[];
  icon: LucideIcon;
  accent: string;
};

type StackGroup = {
  title: string;
  items: string[];
};

type FeatureShowcaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const featureCards: FeatureCard[] = [
  {
    title: "Multi-category booking journeys",
    description:
      "One product flow covers movies, sports, events, and gaming with dedicated pages, booking state, and checkout screens.",
    technologies: ["Next.js App Router", "React 19", "TypeScript", "Zustand", "Express 5", "MongoDB"],
    icon: Clapperboard,
    accent: "from-rose-500/25 via-orange-400/15 to-transparent",
  },
  {
    title: "Realtime seat selection",
    description:
      "Seat availability updates live while users are selecting, so lock, unlock, and booked states stay in sync.",
    technologies: ["Socket.IO", "Redis", "MongoDB", "Next.js", "Custom hooks"],
    icon: Waves,
    accent: "from-cyan-500/25 via-sky-400/15 to-transparent",
  },
  {
    title: "Secure authentication",
    description:
      "Users can register, sign in, refresh sessions silently, and access protected screens with smooth session recovery.",
    technologies: ["JWT", "HttpOnly cookies", "AuthContext", "Next.js", "Express middleware"],
    icon: ShieldCheck,
    accent: "from-emerald-500/25 via-teal-400/15 to-transparent",
  },
  {
    title: "Payments, wallet, and checkout",
    description:
      "The app supports direct Razorpay payments, wallet top-ups, wallet-pay flows, and payment verification screens.",
    technologies: ["Razorpay", "Node.js", "Express 5", "Zustand", "SweetAlert2"],
    icon: CreditCard,
    accent: "from-violet-500/25 via-fuchsia-400/15 to-transparent",
  },
  {
    title: "Rewards and savings",
    description:
      "Reward points, wallet bonuses, and checkout discounts are woven into the review and payment experience.",
    technologies: ["MongoDB", "Mongoose", "Zustand", "React state", "Business logic services"],
    icon: Gift,
    accent: "from-amber-500/30 via-yellow-400/15 to-transparent",
  },
  {
    title: "Tickets and shareable passes",
    description:
      "Users get payment status pages, downloadable PDF tickets, QR-ready details, and social-share previews.",
    technologies: ["jsPDF", "qrcode", "next/og", "Next.js", "React components"],
    icon: Ticket,
    accent: "from-blue-500/25 via-indigo-400/15 to-transparent",
  },
  {
    title: "Discovery and favorites",
    description:
      "Explore pages, wishlist-style favorites, upcoming content, and category browsing help users discover what to book next.",
    technologies: ["Next.js", "MongoDB", "Redis", "TMDB API", "Custom UI components"],
    icon: Heart,
    accent: "from-pink-500/25 via-rose-400/15 to-transparent",
  },
  {
    title: "Profile and account center",
    description:
      "Bookings, payments, wallet activity, preferences, security, account editing, and profile dashboards are all organized in one place.",
    technologies: ["Next.js App Router", "TypeScript", "Zustand", "Protected routes", "REST APIs"],
    icon: BadgeCheck,
    accent: "from-lime-500/25 via-emerald-400/15 to-transparent",
  },
  {
    title: "Support experience",
    description:
      "Users can use the built-in rule-based chatbot or move to live assistant chat backed by realtime messaging.",
    technologies: ["Socket.IO", "React", "Custom rule engine", "Express", "MongoDB"],
    icon: Sparkles,
    accent: "from-sky-500/25 via-cyan-400/15 to-transparent",
  },
  {
    title: "Responsive theming",
    description:
      "The UI adapts across mobile, tablet, and desktop while respecting the user's saved light or dark theme preference.",
    technologies: ["Tailwind CSS v4", "Zustand persist", "ThemeBridge", "Responsive layouts"],
    icon: MoonStar,
    accent: "from-slate-500/25 via-zinc-400/15 to-transparent",
  },
  {
    title: "Admin-ready content tools",
    description:
      "TMDB discovery and movie import utilities help with content setup and internal management workflows.",
    technologies: ["Next.js route handlers", "TMDB API", "Dashboard pages", "React forms"],
    icon: Upload,
    accent: "from-orange-500/25 via-amber-400/15 to-transparent",
  },
  {
    title: "Reliable backend foundation",
    description:
      "Health checks, backend warmup, error handling, idempotent payment flows, and export support keep the app dependable.",
    technologies: ["Express 5", "Redis", "ExcelJS", "BackendWarmup", "Custom middleware"],
    icon: Wallet,
    accent: "from-green-500/25 via-emerald-400/15 to-transparent",
  },
];

const stackGroups: StackGroup[] = [
  {
    title: "Frontend foundation",
    items: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4"],
  },
  {
    title: "State and UX",
    items: ["Zustand", "Framer Motion", "SweetAlert2", "Lucide React"],
  },
  {
    title: "Realtime and security",
    items: ["Socket.IO", "JWT", "HttpOnly cookies", "Redis"],
  },
  {
    title: "Backend and data",
    items: ["Node.js", "Express 5", "MongoDB", "Mongoose"],
  },
  {
    title: "Payments and content",
    items: ["Razorpay", "TMDB API", "Resend", "ExcelJS"],
  },
  {
    title: "Ticket delivery",
    items: ["jsPDF", "qrcode", "next/og", "Share-ready routes"],
  },
];

const developerLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/vishal-kukde",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/vishalkukde",
    icon: Github,
  },
  {
    label: "Portfolio",
    href: "https://vishalkukde.vercel.app",
    icon: Globe,
  },
  {
    label: "Email",
    href: "mailto:vishalkukde19@gmail.com",
    icon: Mail,
  },
];

export default function FeatureShowcaseModal({
  isOpen,
  onClose,
}: FeatureShowcaseModalProps) {
  const mode = useThemeStore((state) => state.mode);
  const dark = mode === "dark";

  useEffect(() => {
    if (!isOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="feature-showcase-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-md sm:p-5"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className={`relative flex max-h-[84vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border shadow-[0_35px_120px_rgba(15,23,42,0.35)] sm:max-h-[calc(100vh-2.5rem)] ${
              dark
                ? "border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.16),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(2,6,23,0.96))] text-zinc-100"
                : "border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.15),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(244,114,182,0.14),_transparent_26%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] text-slate-900"
            }`}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feature-showcase-title"
            aria-describedby="feature-showcase-description"
          >
            <div className="pointer-events-none absolute -left-12 top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-fuchsia-400/15 blur-3xl" />

            <button
              type="button"
              onClick={onClose}
              className={`absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition sm:right-5 sm:top-5 cursor-pointer ${
                dark
                  ? "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
                  : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
              }`}
              aria-label="Close feature showcase"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative overflow-y-auto overscroll-contain px-4 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-6 lg:px-8">
              <section className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
                <div
                  className={`flex h-full flex-col rounded-[1.75rem] border p-5 sm:p-6 ${
                    dark
                      ? "border-white/10 bg-white/5"
                      : "border-white/70 bg-white/75 shadow-[0_20px_60px_rgba(148,163,184,0.22)]"
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-current/10 bg-current/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-500">
                    <Sparkles className="h-3.5 w-3.5" />
                    Product Guide
                  </div>

                  <h2
                    id="feature-showcase-title"
                    className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl"
                  >
                    Everything inside EpicShow, mapped feature by feature.
                  </h2>

                  <p
                    id="feature-showcase-description"
                    className={`mt-3 max-w-3xl text-sm leading-6 sm:text-base ${
                      dark ? "text-zinc-300" : "text-slate-600"
                    }`}
                  >
                    This walkthrough highlights the major capabilities in the application and
                    shows the core tech stack used to build each one. It opens automatically the
                    first time, then stays available from the navbar whenever you want it again.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Features first", "Tech stack attached", "Responsive on all devices", "Theme-aware"].map(
                      (item) => (
                        <span
                          key={item}
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            dark
                              ? "bg-white/8 text-zinc-200"
                              : "bg-slate-900/5 text-slate-700"
                          }`}
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div
                  className={`flex h-full flex-col rounded-[1.75rem] border p-5 sm:p-6 ${
                    dark
                      ? "border-white/10 bg-white/[0.04]"
                      : "border-white/70 bg-white/85 shadow-[0_18px_50px_rgba(148,163,184,0.18)]"
                  }`}
                >
                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">
                      Built By
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                      Vishal Kukde
                    </h3>
                    <p className={`mt-1 text-sm font-medium ${dark ? "text-emerald-300" : "text-emerald-700"}`}>
                      Full Stack Developer
                    </p>
                    <p className={`mt-3 text-sm leading-6 ${dark ? "text-zinc-300" : "text-slate-600"}`}>
                      EpicShow brings together realtime booking, wallet and reward systems,
                      secure checkout, profile tools, and polished frontend flows in one
                      full-stack product experience.
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                    {developerLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
                        className={`inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                          dark
                            ? "border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
                        }`}
                      >
                        <item.icon className="h-4 w-4 shrink-0 text-cyan-500" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>

              <section className="mt-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-500">
                      Features
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                      What the application can do
                    </h3>
                  </div>
                  <p className={`max-w-2xl text-sm ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                    Every feature below includes the stack that powers it, so the product overview
                    stays concrete instead of generic.
                  </p>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {featureCards.map((feature) => {
                    const Icon = feature.icon;

                    return (
                      <article
                        key={feature.title}
                        className={`group relative overflow-hidden rounded-[1.75rem] border p-5 transition-transform duration-300 hover:-translate-y-1 ${
                          dark
                            ? "border-white/10 bg-white/[0.04]"
                            : "border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(148,163,184,0.18)]"
                        }`}
                      >
                        <div
                          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-90`}
                        />
                        <div className="relative">
                          <div
                            className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${
                              dark
                                ? "border-white/10 bg-slate-950/40"
                                : "border-white/90 bg-white/90"
                            }`}
                          >
                            <Icon className="h-5 w-5 text-cyan-500" />
                          </div>

                          <h4 className="mt-4 text-lg font-semibold">{feature.title}</h4>
                          <p className={`mt-2 text-sm leading-6 ${dark ? "text-zinc-300" : "text-slate-600"}`}>
                            {feature.description}
                          </p>

                          <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
                              Built with
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {feature.technologies.map((technology) => (
                                <span
                                  key={technology}
                                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                                    dark
                                      ? "bg-white/10 text-zinc-100"
                                      : "bg-slate-900/6 text-slate-700"
                                  }`}
                                >
                                  {technology}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              <section className="mt-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-500">
                      Tech Stack
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                      Full-stack snapshot
                    </h3>
                  </div>
                  <p className={`max-w-2xl text-sm ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                    The app combines a modern Next.js frontend with realtime, payment, and
                    data-driven backend systems.
                  </p>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {stackGroups.map((group) => (
                    <div
                      key={group.title}
                      className={`rounded-[1.6rem] border p-5 ${
                        dark
                          ? "border-white/10 bg-white/[0.04]"
                          : "border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(148,163,184,0.16)]"
                      }`}
                    >
                      <h4 className="text-base font-semibold">{group.title}</h4>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                              dark
                                ? "border-white/10 bg-white/5 text-zinc-200"
                                : "border-slate-200 bg-slate-50 text-slate-700"
                            }`}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div
                className={`mt-8 flex flex-col gap-3 rounded-[1.6rem] border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
                  dark
                    ? "border-white/10 bg-white/[0.04]"
                    : "border-slate-200 bg-white/80"
                }`}
              >
                <p className={`text-sm ${dark ? "text-zinc-300" : "text-slate-600"}`}>
                  This modal only auto-opens once. After that, use the navbar button whenever you
                  want a quick product and stack walkthrough.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                    dark
                      ? "bg-white text-slate-950 hover:bg-zinc-200"
                      : "bg-slate-950 text-white hover:bg-slate-800"
                  }`}
                >
                  Start exploring
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
