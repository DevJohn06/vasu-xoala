"use client";

import React, { useState, useCallback } from "react";

interface CopyPinProps {
  pin: string;
  /** Optional extra className to merge onto the wrapper */
  className?: string;
}

export function CopyPin({ pin, className = "" }: CopyPinProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (copied) return;
    try {
      await navigator.clipboard.writeText(pin);
    } catch {
      // Fallback for environments where clipboard API is unavailable
      const el = document.createElement("textarea");
      el.value = pin;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [pin, copied]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy PIN"
      aria-label={`Copy PIN ${pin}`}
      className={`group relative inline-flex items-center gap-1.5 font-mono font-bold tracking-widest
        text-indigo-600 dark:text-indigo-400
        hover:text-indigo-800 dark:hover:text-indigo-300
        transition-colors cursor-pointer select-none ${className}`}
    >
      {/* PIN text — never changes */}
      <span>{pin}</span>

      {/* Clipboard / check icon */}
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-500 shrink-0"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-0 group-hover:opacity-60 transition-opacity shrink-0"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}

      {/* Floating toast — pops up above the pin on copy */}
      <span
        aria-live="polite"
        className={`pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          flex items-center gap-1 whitespace-nowrap
          rounded-md bg-zinc-900 dark:bg-zinc-100
          px-2.5 py-1 text-xs font-semibold tracking-normal
          text-white dark:text-zinc-900 shadow-lg
          transition-all duration-200
          ${copied
            ? "opacity-100 -translate-y-0 scale-100"
            : "opacity-0 translate-y-1 scale-95"
          }`}
      >
        {/* Check mark */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-400 dark:text-emerald-600 shrink-0"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Copied!
        {/* Arrow tip */}
        <span
          className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100"
        />
      </span>
    </button>
  );
}
