"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/Auth";
import { Camera, Edit, Loader2 } from "lucide-react";
import AvatarPickerModal from "./AvatarModal";
import Image from "next/image";

interface UserProps {
  user: User | null;
}

export default function ProfileHeader({ user }: UserProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  // ✅ Sync when user loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  async function handleSave() {
    if (!validate()) return;

    setLoading(true);
    try {
      // console.log(name, phone, avatar)
      await fetch('/profile/update-profile', {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          avatar,
        }),
      });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  function validate() {
    const newErrors: { name?: string; phone?: string } = {};
    const trimmedName = name.trim();

    if (!trimmedName) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
      newErrors.name = "Only letters and spaces allowed";
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
      {/* HEADER */}
      <div className="p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            {avatar ? (
              <Image
                src={avatar}
                alt="Profile avatar"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-semibold">
                {user?.name?.charAt(0)}
              </div>
            )}

            {open && (
              <button
                onClick={() => setAvatarModalOpen(true)}
                className="absolute bottom-0 right-0 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-gray-100"
              >
                <Camera className="w-4 h-4 text-gray-700" />
              </button>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800"
        >
          <Edit className="w-4 h-4" />
          {open ? "Close" : "Edit Profile"}
        </button>
      </div>

      {/* FORM */}
      <div
        className={`transition-all duration-300 ${open ? "max-h-[400px] opacity-100 p-6 border-t" : "max-h-0 opacity-0 p-0"
          } overflow-hidden`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className={`mt-1 w-full px-4 py-2 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-indigo-500`}
            />
            <p className="text-xs text-red-500 mt-1 h-4">{errors.name}</p>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-500"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm text-gray-500">Phone</label>
            <input
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) setPhone(value);

                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              className={`mt-1 w-full px-4 py-2 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-indigo-500`}
            />
            <p className="text-xs text-red-500 mt-1 h-4">{errors.phone}</p>
          </div>

          {/* SAVE */}
          <div className="flex flex-col">
            {/* invisible label to match height */}
            <label className="text-sm text-transparent select-none">Save</label>

            <button
              onClick={handleSave}
              disabled={loading}
              className="mt-1 w-full flex justify-center items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Saving..." : "Save"}
            </button>

            {/* reserve error space */}
            <div className="h-4 mt-1" />
          </div>
        </div>
      </div>

      <AvatarPickerModal
        open={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        currentAvatar={avatar}
        onSave={async (newAvatar) => {
          await new Promise((res) => setTimeout(res, 1000));
          setAvatar(newAvatar);
        }}
      />
    </div>
  );
}

