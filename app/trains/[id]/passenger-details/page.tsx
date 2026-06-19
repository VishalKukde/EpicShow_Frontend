"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import PageTransition from "@/app/components/PageTransition";
import PassengerForm from "../components/PassengerForm";
import { apiFetch } from "@/lib/api";
import { PassengerDetail, SavedTrainPassenger, Train } from "@/types/Train";
import { toast } from "@/lib/toast";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Pencil,
} from "lucide-react";
import TrainLoader from "../../components/TrainLoader";

const PaymentSummary = lazy(() => import("../components/PaymentSummary"));

function LoadingSpinner() {
  return <TrainLoader compact label="Loading train details..." />;
}

function getTomorrowDateString() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function PassengerDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const seats = searchParams.get("seats")?.split(",").filter(Boolean) || [];
  const journeyDate = searchParams.get("date") || getTomorrowDateString();

  const [train, setTrain] = useState<Train | null>(null);
  const [loading, setLoading] = useState(true);
  const [passengers, setPassengers] = useState<PassengerDetail[]>([]);
  const [savedPassengers, setSavedPassengers] = useState<SavedTrainPassenger[]>([]);

  useEffect(() => {
    async function loadTrain() {
      try {
        setLoading(true);
        const data = await apiFetch(`/trains/${id}?date=${journeyDate}`, { publicRequest: true });
        setTrain(data);
      } catch {
        setTrain(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadTrain();
  }, [id, journeyDate]);

  useEffect(() => {
    async function loadSavedPassengers() {
      try {
        const data = await apiFetch("/trains/passengers", {
          notifyOnError: false,
        });
        setSavedPassengers(Array.isArray(data?.passengers) ? data.passengers : []);
      } catch {
        setSavedPassengers([]);
      }
    }

    loadSavedPassengers();
  }, []);

  const refreshSavedPassengers = async () => {
    try {
      const data = await apiFetch("/trains/passengers", {
        notifyOnError: false,
      });
      setSavedPassengers(Array.isArray(data?.passengers) ? data.passengers : []);
    } catch {
      // Keep current saved list if refresh fails.
    }
  };

  const handleAddPassenger = async (passenger: PassengerDetail) => {
    try {
      await apiFetch("/trains/passengers", {
        method: "POST",
        body: JSON.stringify({
          name: passenger.name,
          age: passenger.age,
          gender: passenger.gender,
        }),
      });
      await refreshSavedPassengers();
    } catch {
      return;
    }

    const updatedPassengers = [...passengers];
    const index = passengers.findIndex((p) => p.seatNumber === passenger.seatNumber);

    if (index >= 0) {
      updatedPassengers[index] = passenger;
    } else {
      updatedPassengers.push(passenger);
    }

    setPassengers(updatedPassengers);
    toast.success("Passenger details saved");
  };

  const handleRemovePassenger = (seatNumber: string) => {
    setPassengers((prev) => prev.filter((p) => p.seatNumber !== seatNumber));
    toast.info("Passenger removed");
  };

  const handleProceedToPayment = () => {
    if (passengers.length !== seats.length) {
      toast.warning("Please fill details for all selected seats");
      return;
    }

    const baseAmount = train ? passengers.length * train.price : 0;
    const taxAmount = Number((baseAmount * 0.18).toFixed(2));
    const totalPrice = Number((baseAmount + taxAmount).toFixed(2));

    sessionStorage.setItem(
      "trainBookingData",
      JSON.stringify({
        trainId: id,
        seats,
        passengers,
        baseAmount,
        taxAmount,
        totalPrice,
        journeyDate,
      })
    );

    router.push(`/trains/${id}/review`);
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background pt-20">
          <div className="mx-auto max-w-7xl px-5">
            <TrainLoader label="Loading passenger details..." />
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!train) {
    return (
      <PageTransition>
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-red-600">Failed to load train</p>
        </div>
      </PageTransition>
    );
  }

  const completedPassengers = passengers.length;
  const progress = seats.length ? (completedPassengers / seats.length) * 100 : 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background py-8">
        <div className="mx-auto max-w-7xl px-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-14 overflow-hidden rounded-2xl "
          >
            <div className="flex flex-col gap-4 p-0 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => router.push(`/trains/${id}?date=${journeyDate}`)}
                className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </div>
          </motion.div>


        </div>

        <div className="mx-auto max-w-7xl px-5 pb-8 pt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.35 }}
                className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_18px_36px_-30px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/90"
              >
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">From</p>
                    <p className="mt-1 truncate text-lg font-black text-slate-950 dark:text-slate-50">{train.fromStation}</p>
                    <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">{train.departureTime}</p>
                  </div>
                  <div className="flex min-w-20 flex-col items-center">
                    <div className="flex w-full items-center gap-1 text-cyan-600">
                      <span className="h-2 w-2 rounded-full bg-current" />
                      <span className="h-px flex-1 bg-current/35" />
                      <ArrowRight size={16} />
                      <span className="h-px flex-1 bg-current/35" />
                      <span className="h-2 w-2 rounded-full bg-current" />
                    </div>
                    <span className="mt-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                      {train.duration}
                    </span>
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">To</p>
                    <p className="mt-1 truncate text-lg font-black text-slate-950 dark:text-slate-50">{train.toStation}</p>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{train.arrivalTime}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-cyan-100 bg-cyan-100/80 p-5 dark:border-cyan-900/70 dark:bg-cyan-950/30"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-cyan-700 shadow-sm dark:bg-slate-950 dark:text-cyan-300">
                      <AlertCircle size={20} />
                    </span>
                    <div>
                      <p className="font-bold text-slate-950 dark:text-slate-50">
                        Fill details for {seats.length} passenger{seats.length !== 1 ? "s" : ""}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {completedPassengers}/{seats.length} completed
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-cyan-700 shadow-sm dark:bg-slate-950 dark:text-cyan-300">
                    {Math.round(progress)}%
                  </span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white dark:bg-slate-900">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                  />
                </div>
              </motion.div>

              <div className="space-y-3">
                {seats.map((seatNumber, idx) => {
                  const passenger = passengers.find((p) => p.seatNumber === seatNumber);

                  return (
                    <motion.div
                      key={seatNumber}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      {passenger ? (
                        <div className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-emerald-900/60 dark:bg-slate-950">
                          <div className="flex min-w-0 items-center gap-4">
                            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              <CheckCircle2 size={24} />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-bold text-slate-950 dark:text-slate-50">{passenger.name}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {passenger.age} years | {passenger.gender} | Seat {seatNumber}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemovePassenger(seatNumber)}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>
                        </div>
                      ) : (
                        <PassengerForm
                          passengerIndex={idx}
                          seatNumber={seatNumber}
                          savedPassengers={savedPassengers}
                          onSubmit={handleAddPassenger}
                          onCancel={() => handleRemovePassenger(seatNumber)}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-28 h-fit"
            >
              <Suspense fallback={<LoadingSpinner />}>
                <PaymentSummary
                  train={train}
                  passengers={passengers}
                  seats={seats}
                  onProceed={handleProceedToPayment}
                  isComplete={passengers.length === seats.length && seats.length > 0}
                />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
