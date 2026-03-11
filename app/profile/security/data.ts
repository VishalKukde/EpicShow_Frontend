import { BadgeCheck, Clock3, Laptop, ShieldCheck, Smartphone } from "lucide-react";
import type { ComponentType } from "react";

export type SessionItem = {
  device: string;
  location: string;
  lastSeen: string;
  icon: ComponentType<{ className?: string }>;
};

export type SecurityTip = {
  title: string;
  note: string;
  icon: ComponentType<{ className?: string }>;
};

export const activeSessions: SessionItem[] = [
  {
    device: "Chrome on Windows",
    location: "Delhi, India",
    lastSeen: "Active now",
    icon: Laptop,
  },
  {
    device: "iPhone 15 - Safari",
    location: "Delhi, India",
    lastSeen: "2 hours ago",
    icon: Smartphone,
  },
];

export const securityTips: SecurityTip[] = [
  {
    icon: BadgeCheck,
    title: "Strong Password",
    note: "Use at least 12 characters with symbols and numbers.",
  },
  {
    icon: Clock3,
    title: "Update Regularly",
    note: "Rotate credentials every 60-90 days for better safety.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Devices",
    note: "Remove unknown devices and monitor sign-in activity.",
  },
];
