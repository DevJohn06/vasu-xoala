"use client";

import { useState } from "react";
import { cloneDirectToReseller } from "./actions";

export default function CloneDirectButton() {
  const [isPending, setIsPending] = useState(false);

  const handleClone = async () => {
    if (window.confirm("WARNING: This will replace all current Reseller rates with the ones from the Direct rates table. Proceed?")) {
      setIsPending(true);
      try {
        await cloneDirectToReseller();
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
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 shadow-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      {isPending ? "Cloning..." : "Clone Direct Rates"}
    </button>
  );
}
