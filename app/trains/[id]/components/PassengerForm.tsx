"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PassengerDetail, SavedTrainPassenger } from "@/types/Train";
import { Save, UserRound, X } from "lucide-react";

interface PassengerFormProps {
  passengerIndex: number;
  seatNumber: string;
  savedPassengers?: SavedTrainPassenger[];
  onSubmit: (passenger: PassengerDetail) => void;
  onCancel: () => void;
}

export default function PassengerForm({
  passengerIndex,
  seatNumber,
  savedPassengers = [],
  onSubmit,
  onCancel,
}: PassengerFormProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "Other">("M");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!age || Number(age) < 1 || Number(age) > 120)
      newErrors.age = "Valid age is required";
    if (!gender) newErrors.gender = "Gender is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        name: name.trim(),
        age: Number(age),
        gender,
        seatNumber,
      });
    }
  };

  const handleUseSavedPassenger = (passenger: SavedTrainPassenger) => {
    setName(passenger.name);
    setAge(String(passenger.age));
    setGender(passenger.gender);
    setErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
            <UserRound size={20} />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Seat {seatNumber}
            </p>
            <h3 className="text-lg font-black text-slate-950 dark:text-slate-50">
              Passenger {passengerIndex + 1}
            </h3>
          </div>
        </div>
        {/* <button
          onClick={onCancel}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 dark:hover:text-slate-200"
          aria-label="Clear passenger"
        >
          <X size={18} />
        </button> */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 p-5">
        {savedPassengers.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-100">
              Use saved passenger
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {savedPassengers.map((passenger) => (
                <button
                  key={passenger._id}
                  type="button"
                  onClick={() => handleUseSavedPassenger(passenger)}
                  className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-left text-xs font-bold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/40 dark:hover:text-cyan-200"
                >
                  {passenger.name}
                  <span className="ml-2 font-semibold text-slate-400">
                    {passenger.age}/{passenger.gender}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-bold text-slate-900 dark:text-slate-100">
            Full Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter passenger name"
            className={`h-12 w-full rounded-xl border bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 dark:bg-slate-900 dark:text-slate-100 ${
              errors.name
                ? "border-rose-400 focus:ring-rose-100 dark:focus:ring-rose-950/50"
                : "border-slate-200 focus:border-cyan-300 focus:ring-cyan-100 dark:border-slate-800 dark:focus:border-cyan-700 dark:focus:ring-cyan-950/50"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-rose-600">{errors.name}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-bold text-slate-900 dark:text-slate-100">
              Age *
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              className={`h-12 w-full rounded-xl border bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 dark:bg-slate-900 dark:text-slate-100 ${
                errors.age
                  ? "border-rose-400 focus:ring-rose-100 dark:focus:ring-rose-950/50"
                  : "border-slate-200 focus:border-cyan-300 focus:ring-cyan-100 dark:border-slate-800 dark:focus:border-cyan-700 dark:focus:ring-cyan-950/50"
              }`}
            />
            {errors.age && (
              <p className="mt-1 text-sm text-rose-600">{errors.age}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-slate-100">
              Gender *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["M", "F", "Other"] as const).map((option) => (
                <label
                  key={option}
                  className={`flex h-12 cursor-pointer items-center justify-center rounded-xl border px-3 text-sm font-bold transition ${
                    gender === option
                      ? "border-cyan-500 bg-cyan-50 text-cyan-800 dark:border-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-200"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={gender === option}
                    onChange={(e) => setGender(e.target.value as typeof option)}
                    className="sr-only"
                  />
                  {option === "M" ? "Male" : option === "F" ? "Female" : "Other"}
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 to-cyan-700 px-4 text-sm font-bold text-white transition hover:shadow-lg dark:from-white dark:to-cyan-300 dark:text-slate-950"
        >
          <Save size={17} />
          Save Passenger Details
        </button>
      </form>
    </motion.div>
  );
}
