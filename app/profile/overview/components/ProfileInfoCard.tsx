"use client";

import { User } from "@/types/Auth";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ComponentType } from "react";

interface ProfileInfoCardProps {
  user: User | null;
}
const ProfileInfoCard = ({user}:ProfileInfoCardProps) => {
  const router = useRouter();
  return (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ACCOUNT INFO */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-6 text-lg">
            Account Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">

            <InfoItem icon={Mail} label="Email" value={user?.email} />
            <InfoItem icon={Phone} label="Phone" value={user?.phone} />
            <InfoItem icon={MapPin} label="Location" value={"ABCD"} />
            <InfoItem icon={Calendar} label="Member Since" value={user?.createdAt} />

          </div>
        </div>

        {/* MEMBERSHIP CARD */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-2">Pro Membership</h3>
            <p className="text-sm opacity-90">
              Enjoy priority bookings, exclusive offers, and premium support.
            </p>
          </div>

          <button
            onClick={() => router.push("/profile/subscription")}
            className="mt-6 bg-white text-indigo-600 text-sm py-2 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Upgrade Now
          </button>
        </div>
      </div>
  )
}

export default ProfileInfoCard


function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-gray-100 p-2 rounded-md">
        <Icon className="w-4 h-4 text-gray-700" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
