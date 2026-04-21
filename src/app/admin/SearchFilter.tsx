"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("statusFilter") || "all");

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    const currentStatus = searchParams.get("statusFilter") || "all";
    
    if (q === currentQ && statusFilter === currentStatus) return;

    const timeout = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (q) params.set("q", q);
        else params.delete("q");

        if (statusFilter !== "all") params.set("statusFilter", statusFilter);
        else params.delete("statusFilter");

        router.push(`?${params.toString()}`);
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [q, statusFilter, router, searchParams]);

  return (
    <div className="flex items-center gap-2 w-full md:w-auto">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search names..."
        className="px-3 py-1.5 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-1.5 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="disabled">Disabled</option>
      </select>
    </div>
  );
}
