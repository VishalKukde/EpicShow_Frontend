"use client";

import { Bell, Bug, ChevronDown, HelpCircle, Mail, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useThemeStore } from "@/store/themeStore";
import { releases } from "@/app/utils/latestRelease";
import LatestReleaseModal from "./UpcomingHighlights";


export default function ProfileNavbar() {
  const router = useRouter();
  const { user } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [upcomingOpen, setUpcomingOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [showDeveloperContact, setShowDeveloperContact] = useState(false);
  const upcomingRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const developerEmail = "vishalkukde19@gmail.com";

  useEffect(() => {
    if (!helpOpen && !upcomingOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideUpcoming = upcomingRef.current?.contains(target);
      const clickedInsideHelp = helpRef.current?.contains(target);

      if (clickedInsideUpcoming || clickedInsideHelp) {
        return;
      }

      setHelpOpen(false);
      setShowDeveloperContact(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {

        setHelpOpen(false);
        setShowDeveloperContact(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [helpOpen, upcomingOpen]);

  const openHelpRoute = (tab: "chatbot" | "assistant") => {
    setUpcomingOpen(false);
    setHelpOpen(false);
    setShowDeveloperContact(false);
    const target = tab === "assistant" ? "/profile/chat?tab=assistant" : "/profile/chat?tab=chatbot";
    router.push(target);
  };

  const openReportIssue = () => {
    setUpcomingOpen(false);
    setHelpOpen(false);
    setShowDeveloperContact(false);
    router.push("/profile/report-issue");
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors select-none bg-white ${dark
          ? "border-zinc-700/45 "
          : "border-gray-200 "
        }`}
    >
      <div className="px-6 h-16 flex items-center justify-end">
        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* Upcoming Features */}
          <div className="relative hidden sm:block" ref={upcomingRef}>
            <button
              type="button"
              onClick={() => {
                setUpcomingOpen((prev) => !prev);
                setHelpOpen(false);
                setShowDeveloperContact(false);
              }}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition cursor-pointer ${dark
                  ? "border border-zinc-700/80 bg-[linear-gradient(120deg,rgba(24,24,27,0.96),rgba(39,39,42,0.92))] text-zinc-100 shadow-[0_8px_20px_rgba(0,0,0,0.35)] hover:border-zinc-600 hover:bg-zinc-900"
                  : "border border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                }`}
              aria-haspopup="dialog"
              aria-expanded={upcomingOpen}
            >
              <Sparkles className="h-4 w-4" />
              Upcoming Features
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${upcomingOpen ? "rotate-180" : "rotate-0"}`}
              />
            </button>

            {upcomingOpen && (
              <LatestReleaseModal
                open={upcomingOpen}
                onClose={() => setUpcomingOpen(false)}
                releases={releases}
              />
            )}
          </div>

          {/* HELP */}
          <div className="relative" ref={helpRef}>
            <button
              type="button"
              onClick={() => {
                setHelpOpen((prev) => !prev);
                setUpcomingOpen(false);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition cursor-pointer ${dark
                  ? "border-zinc-700 bg-zinc-900/80 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              aria-haspopup="menu"
              aria-expanded={helpOpen}
            >
              <HelpCircle className={`h-4 w-4 ${dark ? "text-zinc-200" : "text-gray-600"}`} />
              Help
            </button>

            {helpOpen && (
              <div
                role="menu"
                className={`absolute right-0 top-[calc(100%+0.6rem)] w-72 overflow-hidden rounded-2xl border shadow-2xl ${dark
                    ? "border-zinc-700/60 bg-zinc-950 text-zinc-100"
                    : "border-gray-200 bg-white text-gray-900"
                  }`}
              >
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => openHelpRoute("chatbot")}
                    className={`flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${dark ? "hover:bg-zinc-900 text-zinc-200" : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat with Bot
                  </button>

                  <button
                    type="button"
                    onClick={() => openHelpRoute("assistant")}
                    className={`mt-1 flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${dark ? "hover:bg-zinc-900 text-zinc-200" : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    <HelpCircle className="h-4 w-4" />
                    Chat with Assistant
                  </button>

                  <button
                    type="button"
                    onClick={openReportIssue}
                    className={`mt-1 flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${dark ? "hover:bg-zinc-900 text-zinc-200" : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    <Bug className="h-4 w-4" />
                    Report an Issue
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDeveloperContact((prev) => !prev)}
                    className={`mt-1 flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${dark ? "hover:bg-zinc-900 text-zinc-200" : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Contact Developer
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${showDeveloperContact ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${showDeveloperContact ? "mt-1 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={`rounded-xl border px-3 py-2 text-xs ${dark
                            ? "border-zinc-700 bg-zinc-900/80 text-zinc-300"
                            : "border-gray-200 bg-gray-50 text-gray-600"
                          }`}
                      >
                        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.14em]">
                          Email ID
                        </p>
                        <a
                          href={`mailto:${developerEmail}`}
                          className={`break-all underline transition ${dark ? "text-zinc-100 hover:text-white" : "text-gray-900 hover:text-black"
                            }`}
                        >
                          {developerEmail}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* NOTIFICATIONS */}
          {/* <button
            className={`relative p-2 rounded-full transition cursor-pointer ${
              dark ? "text-zinc-300 hover:bg-zinc-800/80" : "hover:bg-gray-100"
            }`}
          >
            <Bell className={`w-5 h-5 ${dark ? "text-zinc-300" : "text-gray-600"}`} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
              2
            </span>
          </button> */}

          <div>
            <h1 className="text-sm font-semibold text-gray-700">
              V 1.0.0
            </h1>
          </div>

          {/* THEME TOGGLE */}
          {/* <div
            className={`flex items-center gap-1 rounded-full border px-2 py-1 ${
              dark ? "border-zinc-700 bg-zinc-900/70" : "border-gray-200 bg-white"
            }`}
          >
            <Sun className={`h-3.5 w-3.5 ${dark ? "text-zinc-500" : "text-amber-500"}`} />
            <button
              type="button"
              onClick={toggleTheme}
              role="switch"
              aria-checked={dark}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition cursor-pointer ${
                dark ? "bg-zinc-700" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  dark ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
            <Moon className={`h-3.5 w-3.5 ${dark ? "text-indigo-300" : "text-gray-400"}`} />
          </div> */}
        </div>
      </div>
    </header>
  );
}
