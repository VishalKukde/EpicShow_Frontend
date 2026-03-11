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
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
        ${active ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-600 hover:bg-gray-100"}
      `}
    >
      <Icon className="w-4 h-4" />
      {children}
    </Link>
  );
}
