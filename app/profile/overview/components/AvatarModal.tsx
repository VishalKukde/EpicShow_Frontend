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
    "https://api.dicebear.com/7.x/initials/svg?seed=Alex",
    "https://api.dicebear.com/7.x/initials/svg?seed=John",
    "https://api.dicebear.com/7.x/initials/svg?seed=Sam",
    "https://api.dicebear.com/7.x/initials/svg?seed=Taylor",
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
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
  onClick={onClose}
>
  <div
    onClick={(e) => e.stopPropagation()}
    className="bg-white/90 backdrop-blur-xl rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-200"
  >
    {/* HEADER */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="font-semibold text-xl text-gray-900">
          Change Avatar
        </h3>
        <p className="text-sm text-gray-500">
          Choose or upload a profile photo
        </p>
      </div>

      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-full transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>

    {/* LARGE PREVIEW */}
    <div className="flex justify-center mb-6">
      <div className="relative">
        <Image
          src={selectedAvatar}
          alt="Selected avatar preview"
          width={112}
          height={112}
          className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
        />
        <div className="absolute inset-0 rounded-full ring-2 ring-indigo-500/30 pointer-events-none" />
      </div>
    </div>

    {/* UPLOAD BUTTON */}
    <button className="w-full border border-dashed border-gray-300 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition mb-6 flex items-center justify-center gap-2">
      <Camera className="w-4 h-4" />
      Upload Photo
    </button>

    {/* PRESET AVATARS */}
    <div className="grid grid-cols-4 gap-4 mb-6">
      {presetAvatars.map((img, i) => (
        <button
          key={i}
          onClick={() => setSelectedAvatar(img)}
          className={`relative rounded-full overflow-hidden transition transform hover:scale-105 ${
            selectedAvatar === img
              ? "ring-2 ring-indigo-500 ring-offset-2"
              : ""
          }`}
        >
          <Image
            src={img}
            alt={`Avatar option ${i + 1}`}
            width={64}
            height={64}
            className="w-16 h-16 object-cover rounded-full"
          />
        </button>
      ))}
    </div>

    {/* FOOTER */}
    <div className="flex justify-end pt-4 border-t border-gray-100">
      <button
        onClick={handleSave}
        disabled={loading}
        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 shadow-sm"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Save Avatar
      </button>
    </div>
  </div>
</div>
  );
}
