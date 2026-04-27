"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export default function RateSearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get("rateQ") || "");

  useEffect(() => {
    const currentQ = searchParams.get("rateQ") || "";
    if (q === currentQ) return;

    const timeout = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (q) params.set("rateQ", q);
        else params.delete("rateQ");
        router.push(`?${params.toString()}`, { scroll: false });
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [q, router, searchParams]);

  return (
    <div className="relative">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter country, currency, method..."
        className="pl-9 pr-3 py-1.5 w-64 text-sm border rounded-lg bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
      />
    </div>
  );
}
