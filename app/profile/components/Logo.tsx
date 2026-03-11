"use client";

import { useId } from "react";

export default function Logo({ className }: { className?: string }) {
  const id = useId();
  const logoId = `logo-${id}`;
  const pathClassName = `logo-path-${id}`;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <style>{`
        @keyframes draw {
          from {
            stroke-dashoffset: 300;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .${pathClassName} {
          stroke-dasharray: 300;
          animation: draw 3s ease-in-out infinite alternate;
        }
      `}</style>
      <defs>
        <linearGradient id={logoId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6D55FF" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      <path
        className={pathClassName}
        d="M 80 20 H 20 V 80 H 80 M 20 50 H 80 M 50 20 V 50 M 80 50 V 80"
        stroke={`url(#${logoId})`}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}