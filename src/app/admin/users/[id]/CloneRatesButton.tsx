"use client";

import { useState } from "react";
import { copyGeneralRatesToUser } from "../../actions";
import { copyGeneralOffshoreRatesToUser } from "../../offshoreActions";

export default function CloneRatesButton({ userId }: { userId: number }) {
  const [isPending, setIsPending] = useState(false);
  const [source, setSource] = useState("general-rates");

  const handleClone = async () => {
    if (window.confirm("WARNING: Are you sure you want to clone these general rates to this user? This will DELETE and REPLACE all of this user's existing rates!")) {
      setIsPending(true);
      try {
        const formData = new FormData();
        formData.append("id", userId.toString());
        formData.append("source", source);
        await copyGeneralRatesToUser(formData);
        await copyGeneralOffshoreRatesToUser(formData);
      } catch(err) {
         console.error(err);
         alert("An error occurred while cloning.");
      }
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select 
        value={source} 
        onChange={(e) => setSource(e.target.value)}
        disabled={isPending}
        className="px-3 py-2.5 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="general-rates">Reseller Rates</option>
        <option value="general-rates-direct">Direct Rates</option>
      </select>
      <button 
        onClick={handleClone} 
        disabled={isPending}
        className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        {isPending ? "Cloning..." : "Clone Rates"}
      </button>
    </div>
  );
}
