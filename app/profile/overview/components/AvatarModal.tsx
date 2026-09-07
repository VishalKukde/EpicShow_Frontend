"use client";

import { useState } from "react";
import { Camera, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface Props {
  open: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onSave: (avatar: string) => Promise<void> | void;
}

export default function AvatarPickerModal({
  open,
  onClose,
  currentAvatar,
  onSave,
}: Props) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || "");
  const [loading, setLoading] = useState(false);

  const presetAvatars = [
    "/assets/profiles/boy1.webp",
    "/assets/profiles/boy2.webp",
    "/assets/profiles/girl1.webp",
    "/assets/profiles/girl2.webp",
    "/assets/profiles/me.webp",
    "/assets/profiles/user.webp",
  ];

  if (!open) return null;

  async function handleSave() {
    setLoading(true);
    try {
      await onSave(selectedAvatar);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-200 dark:border-zinc-800"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white">
              Change Avatar
            </h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Choose or select a profile photo
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition cursor-pointer text-gray-600 dark:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LARGE PREVIEW */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Image
              src={selectedAvatar || "/assets/profiles/user.webp"}
              alt="Selected avatar preview"
              width={112}
              height={112}
              className="w-28 h-28 rounded-full object-cover aspect-square border-4 border-white dark:border-zinc-800 shadow-md"
            />
            <div className="absolute inset-0 rounded-full ring-2 ring-indigo-500/30 pointer-events-none" />
          </div>
        </div>

        {/* PRESET AVATARS */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6 justify-items-center">
          {presetAvatars.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedAvatar(img)}
              className={`relative h-14 w-14 aspect-square rounded-full overflow-hidden border-2 transition transform hover:scale-105 flex items-center justify-center shrink-0 cursor-pointer ${selectedAvatar === img
                  ? "border-indigo-600 ring-2 ring-indigo-500/50 shadow-md scale-105"
                  : "border-transparent hover:border-slate-300 dark:hover:border-zinc-700"
                }`}
            >
              <Image
                src={img}
                alt={`Avatar option ${i + 1}`}
                width={56}
                height={56}
                className="w-full h-full object-cover rounded-full aspect-square"
              />
            </button>
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-zinc-800 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !selectedAvatar}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 text-xs font-semibold shadow-sm cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
}
