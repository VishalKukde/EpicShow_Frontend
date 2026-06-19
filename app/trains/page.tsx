"use client";
import { Suspense } from "react";
import TrainsContent from "./TrainsContent";
import { TrainLoader } from "./components";

export default function TrainsPage() {
  return (
    <Suspense fallback={<TrainLoader/>}>
      <TrainsContent />
    </Suspense>
  );
}
