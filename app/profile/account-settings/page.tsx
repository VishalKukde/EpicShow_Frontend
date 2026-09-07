"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import {
  Camera,
  Check,
  Loader2,
  Mail,
  Phone,
  Save,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import Image from "next/image";
import { useThemeStore } from "@/store/themeStore";
import { toast } from "@/lib/toast";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  // country: string;
  // language: string;
};

const presetAvatars = [
  "/assets/profiles/boy1.webp",
  "/assets/profiles/boy2.webp",
  "/assets/profiles/girl1.webp",
  "/assets/profiles/girl2.webp",
  "/assets/profiles/me.webp",
  "/assets/profiles/user.webp",
];

export default function AccountSettingsPage() {
  const { user, updateUser, loading } = useAuth();
  const mode = useThemeStore((s) => s.mode);
  const dark = mode === "dark";
  const [saving, setSaving] = useState(false);

  const [avatar, setAvatar] = useState("");
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);


  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    // country: "India",
    // language: "English",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      // country: "India",
      // language: "English",
    });
    setAvatar(user.avatar || "");
  }, [user]);

  const nameError = useMemo(() => {
    const trimmed = form.fullName.trim();
    if (!trimmed) return "Name is required";
    if (!/^[A-Za-z\s]+$/.test(trimmed)) return "Only letters and spaces allowed";
    return null;
  }, [form.fullName]);

  const phoneError = useMemo(() => {
    if (!form.phone) return null;
    if (!/^\d{10}$/.test(form.phone)) return "Phone must be 10 digits";
    return null;
  }, [form.phone]);

  const onChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user?.id) {
      const message = "Session expired. Please login again.";
      toast.error(message);
      return;
    }
    if (nameError || phoneError) {
      const message = nameError || phoneError || "Please review the form details.";
      toast.warning(message);
      return;
    }

    try {
      setSaving(true);
      const res = await apiFetch("/profile/update-profile", {
        method: "PUT",
        body: JSON.stringify({
          id: user.id,
          name: form.fullName.trim(),
          phone: form.phone || "",
          avatar: avatar || "",
        }),
      });

      updateUser({
        name: form.fullName.trim(),
        phone: form.phone,
        avatar: avatar,
      });

      toast.success(res?.message || "Profile updated successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 px-3 py-2 pb-6 select-none sm:px-4 lg:px-0">
      {/* Admin-Style Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b pb-4 border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${dark ? "text-zinc-50" : "text-slate-900"} dark:text-white`}>
            Account Settings
          </h1>
          <p className={`text-xs font-medium mt-0.5 ${dark ? "text-zinc-400" : "text-slate-500"} dark:text-zinc-400`}>
            Manage your personal identity, contact details, and profile avatar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={saving}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-sm ${dark
              ? "bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-60"
              : "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
            }`}
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          <span>{saving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      {/* Main Profile Details Card */}
      <section
        className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${dark ? "border-zinc-800 bg-[#18181b]" : "border-slate-200 bg-white"
          } dark:bg-[#18181b] dark:border-zinc-800`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4 border-slate-100 dark:border-zinc-800/80">
          <div>
            <h2 className={`text-base font-extrabold tracking-tight ${dark ? "text-zinc-100" : "text-slate-900"}`}>
              Profile Identity & Contact Info
            </h2>
            <p className={`text-xs font-medium mt-0.5 ${dark ? "text-zinc-400" : "text-slate-500"}`}>
              Your public avatar, registered email, and mobile contact number.
            </p>
          </div>
          {user?.membership === "pro" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
              PRO Member
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${dark ? "bg-zinc-800 text-zinc-400" : "bg-slate-100 text-slate-600"
                }`}
            >
              Standard Account
            </span>
          )}
        </div>

        {/* Avatar Showcase & Edit Trigger */}
        <div
          className={`mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4.5 ${dark ? "border-zinc-800 bg-zinc-950/60" : "border-slate-200 bg-slate-50/70"
            }`}
        >
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {loading ? (
                <div className="h-20 w-20 rounded-full border border-slate-200 dark:border-zinc-700 animate-pulse bg-slate-200 dark:bg-zinc-800" />
              ) : (
                <div className="relative">
                  <Image
                    src={avatar || "/assets/profiles/user.webp"}
                    alt="Profile avatar"
                    width={80}
                    height={80}
                    className={`h-20 w-20 rounded-full object-cover shadow ring-4 ${dark ? "ring-zinc-800" : "ring-white"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setAvatarModalOpen(true)}
                    className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 cursor-pointer transition"
                    aria-label="Edit avatar"
                    title="Change Avatar"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <p className={`font-bold text-sm ${dark ? "text-zinc-100" : "text-slate-900"}`}>
                {form.fullName || "User"}
              </p>
              <p className={`text-xs font-medium ${dark ? "text-zinc-400" : "text-slate-500"}`}>
                {form.email || "No email set"}
              </p>
              <p className={`text-[11px] mt-1 ${dark ? "text-zinc-500" : "text-slate-400"}`}>
                Select avatars, upload custom image, or generate with AI.
              </p>
            </div>
          </div>

          {!loading && (
            <button
              type="button"
              onClick={() => setAvatarModalOpen(true)}
              className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${dark
                  ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
                }`}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Change Avatar</span>
            </button>
          )}
        </div>

        {/* Inputs Grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Full Name"
            icon={UserRound}
            value={form.fullName}
            onChange={(v) => onChange("fullName", v)}
            error={nameError}
            loading={loading}
            dark={dark}
          />
          <Field
            label="Email Address"
            icon={Mail}
            value={form.email}
            disabled
            onChange={() => { }}
            loading={loading}
            dark={dark}
          />
          <Field
            label="Phone Number"
            icon={Phone}
            value={form.phone}
            onChange={(v) => onChange("phone", v.replace(/\D/g, "").slice(0, 10))}
            error={phoneError}
            loading={loading}
            dark={dark}
          />
        </div>

        {/* Bottom Save Action */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t pt-4 border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={saving}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition shadow-sm ${dark
                ? "bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-60"
                : "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
              }`}
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-2xl border p-5 sm:p-6 shadow-sm border-rose-200 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/20">
        <h3 className="text-base font-extrabold text-rose-700 dark:text-rose-400">Danger Zone</h3>
        <p className="mt-1 text-xs font-medium text-rose-700/80 dark:text-rose-400/80">
          Permanently removing your account cancels active bookings, deletes wallet balances, and removes saved preferences.
        </p>
        <button
          disabled
          className="mt-4 rounded-xl border border-rose-300 bg-white/80 dark:border-rose-800/60 dark:bg-zinc-900 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 opacity-60 cursor-not-allowed"
          title="Account deletion is disabled for safety"
        >
          Delete Account (Restricted)
        </button>
      </section>

      <AvatarPickerModal
        key={`${avatarModalOpen}-${avatar}`}
        open={avatarModalOpen}
        currentAvatar={avatar}
        onClose={() => setAvatarModalOpen(false)}
        onSave={(value) => setAvatar(value)}
        dark={dark}
      />
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  value,
  onChange,
  disabled,
  error,
  loading,
  dark,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string | null;
  loading?: boolean;
  dark?: boolean;
}) {
  return (
    <label
      className={`block rounded-xl border p-3.5 transition ${error
          ? "border-red-400 bg-red-50/50 dark:border-red-800/60 dark:bg-red-950/20"
          : dark
            ? "border-zinc-700/80 bg-zinc-950/50 focus-within:border-indigo-500"
            : "border-slate-200 bg-slate-50/60 focus-within:border-indigo-500"
        }`}
    >
      <span
        className={`mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider ${dark ? "text-zinc-400" : "text-slate-500"
          }`}
      >
        <span className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
        {disabled && (
          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 text-[9.5px] font-bold text-emerald-500 uppercase">
            Verified
          </span>
        )}
      </span>
      {loading ? (
        <div className={`h-10 w-full rounded-lg animate-pulse ${dark ? "bg-zinc-800" : "bg-slate-200"}`} />
      ) : (
        <>
          <input
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm font-medium outline-none transition ${error
                ? "border-red-400 bg-red-50/70 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                : dark
                  ? "border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-indigo-500"
                  : "border-slate-200 bg-white text-slate-800 focus:border-indigo-400"
              } ${disabled ? "cursor-not-allowed opacity-80" : ""}`}
          />
          {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
        </>
      )}
    </label>
  );
}

function AvatarPickerModal({
  open,
  onClose,
  currentAvatar,
  onSave,
  dark,
}: {
  open: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onSave: (avatar: string) => void;
  dark?: boolean;
}) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || "");
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatedAiAvatar, setGeneratedAiAvatar] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGenerationsUsed, setAiGenerationsUsed] = useState(() => {
    if (typeof window === "undefined") return 0;

    try {
      const saved = window.localStorage.getItem("epicshow-ai-avatar-generations");
      return saved ? Math.min(Number(saved) || 0, 2) : 0;
    } catch {
      return 0;
    }
  });

  const maxAiGenerations = 2;

  useEffect(() => {
    setSelectedAvatar(currentAvatar || "");
    setGeneratedAiAvatar(null);
    setAiPrompt("");
    setIsGeneratingAi(false);
  }, [currentAvatar, open]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem("epicshow-ai-avatar-generations", String(aiGenerationsUsed));
    } catch {
      // ignore storage quota issues
    }
  }, [aiGenerationsUsed]);

  if (!open) return null;

  const handleFileUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedAvatar(reader.result);
        setGeneratedAiAvatar(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateAiAvatar = async () => {
    if (aiGenerationsUsed >= maxAiGenerations) {
      toast.warning(`AI avatar generation limit reached. You have used all ${maxAiGenerations} images.`);
      return;
    }

    try {
      setIsGeneratingAi(true);
      const data = await apiFetch("/profile/generate-avatar", {
        method: "POST",
        body: JSON.stringify({ prompt: aiPrompt.trim() || "" }),
      });

      if (!data?.imageData) {
        throw new Error("No image was returned by the AI generator.");
      }

      setGeneratedAiAvatar(data.imageData);
      setAiGenerationsUsed((prev) => prev + 1);
      setAiPrompt("");
      toast.success("AI avatar ready. Please review and confirm.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to generate avatar image.";
      toast.error(message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const remainingAiGenerations = Math.max(maxAiGenerations - aiGenerationsUsed, 0);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl ${dark ? "border-zinc-800 bg-zinc-950 text-zinc-100" : "border-slate-200 bg-white text-slate-900"
          }`}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 className={`text-lg font-black tracking-tight ${dark ? "text-zinc-100" : "text-slate-900"}`}>
              Choose Avatar
            </h3>
            <p className={`text-xs font-medium ${dark ? "text-zinc-400" : "text-slate-500"}`}>
              Select a predefined profile picture, upload from device, or generate with AI.
            </p>
          </div>
          <button
            onClick={onClose}
            className={`rounded-full border p-2 transition cursor-pointer ${dark
                ? "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-6 flex justify-center">
          {selectedAvatar ? (
            <Image
              src={selectedAvatar}
              alt="Selected avatar"
              width={96}
              height={96}
              className={`h-24 w-24 rounded-full border-4 object-cover shadow-md ring-4 ${dark ? "border-zinc-800 ring-zinc-700" : "border-white ring-slate-100"
                }`}
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-white">
              <UserRound className="h-10 w-10" />
            </div>
          )}
        </div>

        <div
          className={`mb-5 rounded-2xl border p-3.5 ${dark ? "border-indigo-500/30 bg-indigo-500/10" : "border-indigo-100 bg-indigo-50"
            }`}
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <div
              className={`flex items-center gap-2 text-xs font-bold ${dark ? "text-indigo-300" : "text-indigo-800"
                }`}
            >
              <Sparkles className="h-4 w-4" />
              Generate with AI
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${dark ? "bg-zinc-800 text-indigo-300" : "bg-white text-indigo-700 shadow-sm"
                }`}
            >
              {remainingAiGenerations}/{maxAiGenerations} left
            </span>
          </div>

          <button
            type="button"
            onClick={handleGenerateAiAvatar}
            disabled={isGeneratingAi || aiGenerationsUsed >= maxAiGenerations}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isGeneratingAi ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            {isGeneratingAi ? "Generating Profile Picture..." : "Generate Profile Picture"}
          </button>
        </div>

        {generatedAiAvatar && (
          <div
            className={`mb-5 rounded-2xl border p-3.5 ${dark ? "border-emerald-500/30 bg-emerald-500/10" : "border-emerald-200 bg-emerald-50"
              }`}
          >
            <p className={`mb-2 text-xs font-bold ${dark ? "text-emerald-300" : "text-emerald-800"}`}>
              AI preview ready
            </p>
            <div className="flex items-center justify-center">
              <Image
                src={generatedAiAvatar}
                alt="Generated avatar preview"
                width={128}
                height={128}
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
              />
            </div>
            <div className="mt-3 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedAvatar(generatedAiAvatar);
                  setGeneratedAiAvatar(null);
                }}
                className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
              >
                Use this image
              </button>
              <button
                type="button"
                onClick={() => setGeneratedAiAvatar(null)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${dark
                    ? "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                  }`}
              >
                Try another
              </button>
            </div>
          </div>
        )}

        <label
          className={`mb-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-2.5 text-xs font-bold transition ${dark
              ? "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
              : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
        >
          <Camera className="h-3.5 w-3.5" />
          Upload from device
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files?.[0])}
          />
        </label>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {presetAvatars.map((img) => (
            <button
              key={img}
              onClick={() => {
                setGeneratedAiAvatar(null);
                setSelectedAvatar(img);
              }}
              className={`overflow-hidden rounded-full border-2 transition cursor-pointer ${selectedAvatar === img
                  ? "border-indigo-600 ring-2 ring-indigo-300 dark:ring-indigo-700"
                  : "border-transparent hover:border-slate-300 dark:hover:border-zinc-700"
                }`}
            >
              <Image
                src={img}
                alt="Preset avatar"
                width={56}
                height={56}
                className="h-12 w-12 object-cover"
              />
            </button>
          ))}
        </div>

        <div
          className={`mt-5 flex justify-end gap-2.5 border-t pt-4 ${dark ? "border-zinc-800" : "border-slate-100"
            }`}
        >
          <button
            onClick={onClose}
            className={`rounded-xl border px-4 py-2 text-xs font-bold transition cursor-pointer ${dark
                ? "border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
          >
            Close
          </button>
          <button
            onClick={() => {
              onSave(selectedAvatar);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-sm"
            disabled={!selectedAvatar}
          >
            <Check className="h-3.5 w-3.5" />
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
}
