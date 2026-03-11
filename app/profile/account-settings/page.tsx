"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import {
  Camera,
  Check,
  Mail,
  Phone,
  Save,
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    setError(null);
    setSuccess(null);

    if (!user?.id) {
      const message = "Session expired. Please login again.";
      setError(message);
      toast.error(message);
      return;
    }
    if (nameError || phoneError) {
      const message = nameError || phoneError || "Please review the form details.";
      setError(message);
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

      setSuccess(res?.message || "Profile updated successfully.");
      toast.success(res?.message || "Profile updated successfully.");


      // ✅ Clear success after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 px-3 py-3 pb-6 select-none sm:px-4 lg:px-0">
      <section
        className={`rounded-3xl border p-6 text-white shadow-lg sm:p-8 ${
          dark
            ? "border-zinc-700 bg-zinc-900"
            : "border-gray-200 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900"
        }`}
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">
          Account Settings
        </p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          Personal account preferences
        </h1>
        <p className="mt-2 max-w-xl text-sm text-indigo-100/90">
          Update profile identity, communication details, and localization.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">Profile Details</h2>

        <div className="mt-5 flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50/70 p-4">
          <div className="relative">
            {loading ? (
              <div className="h-20 w-20 rounded-full overflow-hidden border border-gray-200 dark:border-gray-200">
                <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200  animate-[shimmer_1.5s_infinite]"></div>
              </div>
            ) : (
              <Image
                src={avatar || "/assets/profiles/user.webp"}
                alt="Profile avatar"
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover shadow"
              />
            )}

            {/* Edit button */}
            {!loading && (
              <button
                onClick={() => setAvatarModalOpen(true)}
                className="absolute -bottom-1 -right-1 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1.5 text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                aria-label="Edit avatar"
                title="Edit avatar"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>

          <div>
            <p className="font-medium text-gray-900">Profile Picture</p>
            <p className="text-sm text-gray-500">
              Click the camera icon to select predefined avatars or upload from
              your device.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Full Name"
            icon={UserRound}
            value={form.fullName}
            onChange={(v) => onChange("fullName", v)}
            error={nameError}
            loading={loading}
          />
          <Field
            label="Email"
            icon={Mail}
            value={form.email}
            disabled
            onChange={() => { }}
            loading={loading}
          />
          <Field
            label="Phone"
            icon={Phone}
            value={form.phone}
            onChange={(v) => onChange("phone", v.replace(/\D/g, "").slice(0, 10))}
            error={phoneError}
            loading={loading}
          />
          {/* <Field
            label="Country"
            icon={Globe}
            value={form.country}
            onChange={(v) => onChange("country", v)}
          /> */}
          {/* <Field
            label="Language"
            icon={Languages}
            value={form.language}
            onChange={(v) => onChange("language", v)}
          /> */}
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </section>

      <section className="danger-zone rounded-2xl border border-red-300 bg-red-100/70 p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
        <p className="mt-1 text-sm text-red-700">
          Deleting your account removes bookings, payment history, and saved
          preferences permanently.
        </p>
        <button disabled className="mt-4 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 cursor-not-allowed">
          Delete Account
        </button>
      </section>

      <AvatarPickerModal
        key={`${avatarModalOpen}-${avatar}`}
        open={avatarModalOpen}
        currentAvatar={avatar}
        onClose={() => setAvatarModalOpen(false)}
        onSave={(value) => setAvatar(value)}
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
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string | null;
  loading?: boolean;
}) {
  return (
    <label className="rounded-xl border border-gray-200 bg-gray-50/70 p-3">
      <span className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      {loading ? (
        <div className="h-10 w-full rounded-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite]"></div>
        </div>
      ) : (
        <>
          <input
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${error
              ? "border-red-400 bg-red-50/70 text-red-700"
              : "border-gray-200 bg-white text-gray-800 focus:border-indigo-300"
              } ${disabled ? "cursor-not-allowed opacity-80" : ""}`}
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
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
}: {
  open: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onSave: (avatar: string) => void;
}) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || "");

  if (!open) return null;

  const handleFileUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Choose Avatar</h3>
            <p className="text-sm text-gray-500">
              Select a predefined profile picture or upload from your device.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-gray-200 p-2 hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-700" />
          </button>
        </div>

        <div className="mb-6 flex justify-center">
          {selectedAvatar ? (
            <Image
              src={selectedAvatar}
              alt="Selected avatar"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-white">
              <UserRound className="h-10 w-10" />
            </div>
          )}
        </div>

        <label className="mb-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100">
          <Camera className="h-4 w-4" />
          Upload from device
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled
            onChange={(e) => handleFileUpload(e.target.files?.[0])}
          />
        </label>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {presetAvatars.map((img) => (
            <button
              key={img}
              onClick={() => setSelectedAvatar(img)}
              className={`overflow-hidden rounded-full border-2 transition ${selectedAvatar === img
                ? "border-indigo-600 ring-2 ring-indigo-200"
                : "border-transparent hover:border-gray-200"
                }`}
            >
              <Image
                src={img}
                alt="Preset avatar"
                width={56}
                height={56}
                className="h-14 w-14 object-cover"
              />
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={() => {
              onSave(selectedAvatar);
              onClose();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Check className="h-4 w-4" />
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
}
