"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "@/lib/toast";

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("Copied to clipboard.");
    } catch {
      toast.error("Unable to copy right now. Please copy manually.");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-1.5 inline-flex items-center justify-center p-1 rounded-md hover:bg-zinc-500/20 text-zinc-400 hover:text-indigo-500 transition-colors"
      aria-label="Copy"
    >
      {copied ? (
        <Check size={13} className="text-emerald-500" />
      ) : (
        <Copy size={13} />
      )}
    </button>
  );
}
