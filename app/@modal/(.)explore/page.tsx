"use client";

import { useRouter } from "next/navigation";
import MovieSearchModal from "@/components/MovieSearchModal";

export default function ExploreModalPage() {
  const router = useRouter();

  return <MovieSearchModal open onClose={() => router.back()} />;
}
