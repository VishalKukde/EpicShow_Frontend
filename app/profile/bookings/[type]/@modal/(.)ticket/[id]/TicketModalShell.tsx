"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TicketModalShell({
  children,
  closeHref,
}: {
  children: React.ReactNode;
  closeHref: string;
}) {
  const router = useRouter();

  const closeModal = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(closeHref);
    }
  }, [closeHref, router]);

  // 🔒 lock scroll + esc
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [closeModal]);

  return (
    <div
      onMouseDown={closeModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-2 backdrop-blur-sm sm:p-4"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-5xl"
      >
        {children}
      </div>
    </div>
  );
}
