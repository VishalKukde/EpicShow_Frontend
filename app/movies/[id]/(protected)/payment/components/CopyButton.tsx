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
      className="ml-2 p-1 rounded hover:bg-gray-200 transition"
      aria-label="Copy"
    >
      {copied ? (
        <Check size={14} className="text-green-600" />
      ) : (
        <Copy size={14} className="text-gray-500" />
      )}
    </button>
  );
}
