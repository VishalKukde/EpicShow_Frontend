"use client";

import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AskEpicAiPanel from "@/components/ask-epic-ai/AskEpicAiPanel";
import { useAskEpicAiStore } from "@/store/askEpicAiStore";

export default function AskEpicAiOverlay() {
  const isOpen = useAskEpicAiStore((state) => state.isOpen);
  const close = useAskEpicAiStore((state) => state.close);
  const mobileHistoryMarker = useRef(false);

  const requestClose = useCallback(() => {
    if (mobileHistoryMarker.current) {
      window.history.back();
      return;
    }
    close();
  }, [close]);

  useEffect(() => {
    if (!isOpen) return;

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    const syncViewportHeight = () => {
      const nextHeight = window.visualViewport?.height ?? window.innerHeight;
      documentElement.style.setProperty("--ask-epic-ai-vh", `${Math.round(nextHeight)}px`);
      if (window.scrollY > 0) {
        window.scrollTo(0, 0);
      }
    };
    syncViewportHeight();

    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (isMobile) {
      const state = window.history.state ?? {};
      window.history.pushState({ ...state, __askEpicAiModal: true }, "");
      mobileHistoryMarker.current = true;
    } else {
      mobileHistoryMarker.current = false;
    }

    const onPopState = () => {
      mobileHistoryMarker.current = false;
      close();
    };

    const onEscClose = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestClose();
      }
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("keydown", onEscClose);
    window.addEventListener("resize", syncViewportHeight);
    window.visualViewport?.addEventListener("resize", syncViewportHeight);
    window.visualViewport?.addEventListener("scroll", syncViewportHeight);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("keydown", onEscClose);
      window.removeEventListener("resize", syncViewportHeight);
      window.visualViewport?.removeEventListener("resize", syncViewportHeight);
      window.visualViewport?.removeEventListener("scroll", syncViewportHeight);
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
      documentElement.style.removeProperty("--ask-epic-ai-vh");
      mobileHistoryMarker.current = false;
    };
  }, [isOpen, close, requestClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div
          className="fixed inset-x-0 top-0 z-[110]"
          style={{ height: "var(--ask-epic-ai-vh, 100dvh)" }}
        >
          <motion.button
            type="button"
            aria-label="Close Ask Epic AI overlay"
            className="absolute inset-0 cursor-pointer bg-black/45 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={requestClose}
          />

          <div
            className="absolute inset-0 lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[min(460px,94vw)] lg:p-4 lg:pl-0"
            onClick={(event) => event.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0, x: 34 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 34 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="h-full w-full"
            >
              <AskEpicAiPanel
                className="h-full w-full rounded-none lg:rounded-[1.5rem] lg:shadow-[0_34px_70px_rgba(2,6,23,0.4)]"
                showMobileBack
                onMobileBack={requestClose}
                onDesktopClose={requestClose}
              />
            </motion.div>
          </div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
