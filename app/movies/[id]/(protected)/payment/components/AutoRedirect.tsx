"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AutoRedirect({ seconds = 10 }) {
  const router = useRouter();
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    if (count === 0) {
      router.push("/");
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, router]);

  return (
    <p className="text-md text-gray-400 mb-3 text-center">
     Redirecting in{" "}
    <span
      className="
        font-semibold
        text-gray-500
        text-base
        animate-pulse
        transition-all duration-300
      "
    >
      {count}
    </span>{" "}
    second{count !== 1 && "s"}...
    </p>
  );
}
