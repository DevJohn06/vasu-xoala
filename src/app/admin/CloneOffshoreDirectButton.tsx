"use client";

import { useState } from "react";
import { cloneOffshoreDirectToReseller } from "./offshoreActions";

export default function CloneOffshoreDirectButton({ category }: { category?: string }) {
  const [isPending, setIsPending] = useState(false);

  const handleClone = async () => {
    const message = category 
      ? `WARNING: This will replace all current Reseller offshore rates for "${category}" with the ones from the Direct offshore rates table. Proceed?`
      : "WARNING: This will replace all current Reseller offshore rates with the ones from the Direct offshore rates table. Proceed?";
      
    if (window.confirm(message)) {
      setIsPending(true);
      try {
        await cloneOffshoreDirectToReseller(category);
      } catch (err) {
        console.error(err);
        alert("An error occurred while cloning.");
      }
      setIsPending(false);
    }
  };

  return (
    <button 
      onClick={handleClone} 
      disabled={isPending}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded ${category ? 'bg-indigo-50/50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'} transition-all duration-200 disabled:opacity-50`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      {isPending ? "Cloning..." : (category ? "Clone Direct" : "Clone Direct Rates")}
    </button>
  );
}
