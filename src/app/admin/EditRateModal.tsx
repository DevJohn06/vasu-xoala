"use client"

import { useState, useRef, useEffect } from "react"
import { COUNTRIES } from "@/data/countries"
import { updateRate } from "./actions"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function EditRateModal({ rate }: { rate: any }) {
  const pathname = usePathname()
  const [selectedCountry, setSelectedCountry] = useState(rate.country || "");
  const [currency, setCurrency] = useState(rate.currency || "");
  const [isDirty, setIsDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const checkDirty = () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const hasChanges = (
      fd.get("country") !== (rate.country || '') ||
      fd.get("currency") !== (rate.currency || '') ||
      fd.get("channelCode") !== (rate.channelCode || '') ||
      fd.get("paymentMethod") !== (rate.paymentMethod || '') ||
      fd.get("verticals") !== (rate.verticals || '') ||
      fd.get("deposit") !== (rate.deposit || '') ||
      fd.get("depositLimit") !== (rate.depositLimit || '') ||
      fd.get("withdrawal") !== (rate.withdrawal || '') ||
      fd.get("withdrawalLimit") !== (rate.withdrawalLimit || '') ||
      fd.get("settlementTerms") !== (rate.settlementTerms || '') ||
      fd.get("settlementCycle") !== (rate.settlementCycle || '')
    );
    setIsDirty(hasChanges);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);
    
    const found = COUNTRIES.find(c => c.name === countryName);
    if (found && 'currency' in found) {
      setCurrency((found as any).currency || '');
    } else {
      setCurrency(''); 
    }
  };

  // Run dirty check whenever country/currency derived state affects refs implicitly
  useEffect(() => {
    checkDirty();
  }, [selectedCountry, currency]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
             Edit Data Matrix
          </h3>
          <Link href={pathname} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-zinc-50 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Link>
        </div>
        
        <form ref={formRef} action={updateRate} onChange={checkDirty} className="p-6">
          <input type="hidden" name="id" value={rate.id} />
          <input type="hidden" name="returnUrl" value={pathname} />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Country</label>
              <select name="country" required value={selectedCountry} onChange={handleCountryChange} className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">Select Country</option>
                {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Currency</label>
              <input name="currency" type="text" required value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Channel Code</label>
              <input name="channelCode" type="text" required defaultValue={rate.channelCode} className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Payment Method</label>
              <input name="paymentMethod" type="text" required defaultValue={rate.paymentMethod} className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Verticals</label>
              <input name="verticals" type="text" defaultValue={rate.verticals || ''} className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Deposit</label>
              <textarea name="deposit" defaultValue={rate.deposit || ''} rows={3} className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500 resize-y" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Deposit Limit</label>
              <input name="depositLimit" type="text" defaultValue={rate.depositLimit || ''} className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Withdrawal</label>
              <textarea name="withdrawal" defaultValue={rate.withdrawal || ''} rows={3} className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500 resize-y" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">W/D Limit</label>
              <input name="withdrawalLimit" type="text" defaultValue={rate.withdrawalLimit || ''} className="w-full px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Settlement Info (Terms & Cycle)</label>
              <div className="flex gap-2">
                <input name="settlementTerms" type="text" defaultValue={rate.settlementTerms || ''} className="w-1/2 px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" placeholder="Terms: T+1, Daily..." />
                <input name="settlementCycle" type="text" defaultValue={rate.settlementCycle || ''} className="w-1/2 px-3 py-2 text-sm border rounded bg-transparent border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" placeholder="Cycle: e.g. Weekly" />
              </div>
            </div>
            
            <div className="md:col-span-4 mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <Link href={pathname} className="px-6 py-2 bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                Cancel
              </Link>
              <button disabled={!isDirty} type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
