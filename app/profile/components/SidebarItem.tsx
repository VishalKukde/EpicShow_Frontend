"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode, ComponentType } from "react";

type SidebarItemProps = {
  href: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
};

export default function SidebarItem({ href, icon: Icon, children }: SidebarItemProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${active
          ? "bg-indigo-600 text-white font-bold shadow-xs dark:bg-indigo-600 dark:text-white dark:border-transparent"
          : "text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200"
        }`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  );
}
