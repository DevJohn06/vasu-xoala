"use client";

import { useState } from "react";
import { COUNTRIES } from "@/data/countries";
import { createRate } from "./actions";

export default function RatesForm({ defaultSlug }: { defaultSlug?: string } = {}) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [currency, setCurrency] = useState("");

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);
    
    const found = COUNTRIES.find(c => c.name === countryName);
    if (found && 'currency' in found) {
      setCurrency((found as any).currency || '');
    } else {
      setCurrency(''); // Clear if not found or no currency
    }
  };

  return (
    <form action={createRate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      <input type="hidden" name="pageSlug" value={defaultSlug || "general-rates"} />
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Country</label>
        <select name="country" required value={selectedCountry} onChange={handleCountryChange} className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none">
          <option value="">Select Country</option>
          {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Currency</label>
        <input name="currency" type="text" required value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="e.g. USD" className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none" />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Channel Code</label>
        <input name="channelCode" type="text" required placeholder="e.g. CH-101" className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none" />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Payment Method</label>
        <input name="paymentMethod" type="text" required placeholder="e.g. Bank Transfer" className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none" />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Verticals</label>
        <input name="verticals" type="text" placeholder="Gaming, Forex..." className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none" />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Deposit Rate</label>
        <input name="deposit" type="text" placeholder="e.g. 5.0%" className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none" />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Deposit Limit</label>
        <input name="depositLimit" type="text" placeholder="e.g. 10 - 10,000" className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none" />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Withdrawal Rate</label>
        <input name="withdrawal" type="text" placeholder="e.g. 2.0%" className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none" />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">W/D Limit</label>
        <input name="withdrawalLimit" type="text" placeholder="e.g. 50 - 5,000" className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none" />
      </div>
      <div className="space-y-1 md:col-span-2">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Settlement Info (Terms & Cycle)</label>
        <div className="flex gap-2">
          <input name="settlementTerms" type="text" placeholder="Terms: T+1, Daily..." className="w-1/2 px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none" />
          <input name="settlementCycle" type="text" placeholder="Cycle: e.g. Weekly" className="w-1/2 px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none" />
        </div>
      </div>
      <div className="md:col-span-4 mt-2">
        <button type="submit" className="w-full md:w-auto px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
          Publish Rate Row
        </button>
      </div>
    </form>
  );
}
