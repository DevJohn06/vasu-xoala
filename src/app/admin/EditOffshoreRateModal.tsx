"use client"

import { useState, useRef, useEffect } from "react"
import { updateOffshoreRate } from "./offshoreActions"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function EditOffshoreRateModal({ rate }: { rate: any }) {
  const pathname = usePathname()
  const [isDirty, setIsDirty] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const categories = [
    "Worldwide Credit Card Acquiring: Gaming (3DS)",
    "Worldwide Credit Card Acquiring: Forex (3DS)",
    "Credit Card Acquiring: 2D"
  ]

  const checkDirty = () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const hasChanges = [
      "category", "categoryNote", "channelCode", "integrationType",
      "processingCurrency", "geoOpenForProcessing", "mccCodes", "mid3dsOr2d",
      "descriptor", "acceptanceRate", "whitelistFtdTrusted", "velocitiesLimits", "transactionMinMax",
      "payIn", "setupFee", "annualFee", "otherFees", "rollingReserve", "cbFee", "refundFee", "transactionFees",
      "settlementUsdt", "settlementCycle"
    ].some(key => fd.get(key) !== (rate[key] || ''));
    
    setIsDirty(hasChanges);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
               <rect x="2" y="5" width="20" height="14" rx="2" />
               <line x1="2" y1="10" x2="22" y2="10" />
               <path d="m15 5 4 4" />
             </svg>
             Edit Offshore Rate Row
          </h3>
          <Link href={pathname} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-zinc-50 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Link>
        </div>
        
        <form ref={formRef} action={updateOffshoreRate} onChange={checkDirty} className="p-6 space-y-6">
          <input type="hidden" name="id" value={rate.id} />
          <input type="hidden" name="returnUrl" value={pathname} />
          
          {/* Basic Settings */}
          <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-700/50 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Basic Info</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Category *</label>
                <select name="category" required defaultValue={rate.category} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Channel Code *</label>
                <input name="channelCode" type="text" required defaultValue={rate.channelCode} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Integration Type</label>
                <input name="integrationType" type="text" defaultValue={rate.integrationType || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1 md:col-span-3">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Category Section Note</label>
                <input name="categoryNote" type="text" defaultValue={rate.categoryNote || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Processing & Limits */}
          <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-700/50 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Processing & Limits</h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Processing Currency</label>
                <input name="processingCurrency" type="text" defaultValue={rate.processingCurrency || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">GEO Open For Processing</label>
                <input name="geoOpenForProcessing" type="text" defaultValue={rate.geoOpenForProcessing || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">MCC Codes</label>
                <input name="mccCodes" type="text" defaultValue={rate.mccCodes || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">MID 3Ds or 2D</label>
                <input name="mid3dsOr2d" type="text" defaultValue={rate.mid3dsOr2d || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Descriptor</label>
                <input name="descriptor" type="text" defaultValue={rate.descriptor || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Acceptance Rate</label>
                <input name="acceptanceRate" type="text" defaultValue={rate.acceptanceRate || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Whitelist, FTD, & Trusted</label>
                <input name="whitelistFtdTrusted" type="text" defaultValue={rate.whitelistFtdTrusted || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Velocities Limits</label>
                <input name="velocitiesLimits" type="text" defaultValue={rate.velocitiesLimits || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Transaction Min-Max</label>
                <input name="transactionMinMax" type="text" defaultValue={rate.transactionMinMax || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Fees & Rates */}
          <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-700/50 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Fees & Rates</h5>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Pay In</label>
                <textarea name="payIn" defaultValue={rate.payIn || ''} rows={2} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500 resize-y" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Setup Fee</label>
                <input name="setupFee" type="text" defaultValue={rate.setupFee || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Annual Fee</label>
                <input name="annualFee" type="text" defaultValue={rate.annualFee || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Other Fees</label>
                <textarea name="otherFees" defaultValue={rate.otherFees || ''} rows={2} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500 resize-y" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Rolling Reserve</label>
                <textarea name="rollingReserve" defaultValue={rate.rollingReserve || ''} rows={2} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500 resize-y" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">CB Fee</label>
                <input name="cbFee" type="text" defaultValue={rate.cbFee || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Refund Fee</label>
                <input name="refundFee" type="text" defaultValue={rate.refundFee || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Transaction Fees</label>
                <input name="transactionFees" type="text" defaultValue={rate.transactionFees || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Settlement */}
          <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-700/50 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Settlement</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Settlement USDT</label>
                <input name="settlementUsdt" type="text" defaultValue={rate.settlementUsdt || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Settlement Cycle</label>
                <input name="settlementCycle" type="text" defaultValue={rate.settlementCycle || ''} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <Link href={pathname} className="px-6 py-2 bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
              Cancel
            </Link>
            <button disabled={!isDirty} type="submit" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
