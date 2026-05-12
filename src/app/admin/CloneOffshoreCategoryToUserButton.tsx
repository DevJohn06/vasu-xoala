"use client";

import { useState } from "react";
import { cloneOffshoreCategoryToUser } from "./offshoreActions";

export default function CloneOffshoreCategoryToUserButton({ targetSlug, category }: { targetSlug: string, category: string }) {
  const [isPending, setIsPending] = useState(false);
  const [source, setSource] = useState("reseller");

  const handleClone = async () => {
    if (window.confirm(`WARNING: This will replace the "${category}" rates for this user with the global ${source === 'reseller' ? 'Reseller' : 'Direct'} rates. Proceed?`)) {
      setIsPending(true);
      try {
        const formData = new FormData();
        formData.append("userSlug", targetSlug);
        formData.append("category", category);
        formData.append("source", source);
        await cloneOffshoreCategoryToUser(formData);
      } catch (err) {
        console.error(err);
        alert("An error occurred while cloning.");
      }
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5 bg-white/50 dark:bg-black/20 p-1 rounded-md">
      <select 
        value={source} 
        onChange={(e) => setSource(e.target.value)}
        disabled={isPending}
        className="px-2 py-1 text-[10px] border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded font-medium outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="reseller">From Reseller</option>
        <option value="direct">From Direct</option>
      </select>
      <button 
        onClick={handleClone} 
        disabled={isPending}
        className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium rounded bg-indigo-50/50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all duration-200 disabled:opacity-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        {isPending ? "..." : "Clone"}
      </button>
    </div>
  );
}
