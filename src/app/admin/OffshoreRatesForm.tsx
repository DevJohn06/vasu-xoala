"use client";

import { createOffshoreRate } from "./offshoreActions";

export default function OffshoreRatesForm({ defaultSlug, fixedCategory }: { defaultSlug?: string, fixedCategory?: string } = {}) {
  const categories = [
    "Worldwide Credit Card Acquiring: Gaming (3DS)",
    "Worldwide Credit Card Acquiring: Forex (3DS)",
    "Credit Card Acquiring: 2D"
  ];

  return (
    <form action={createOffshoreRate} className="space-y-6">
      <input type="hidden" name="pageSlug" value={defaultSlug || "general-rates"} />
      
      {/* Basic Settings */}
      <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-700/50 space-y-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Basic Info</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Category *</label>
            {fixedCategory ? (
              <div className="px-3 py-2 text-sm border rounded bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400">
                {fixedCategory}
                <input type="hidden" name="category" value={fixedCategory} />
              </div>
            ) : (
              <select name="category" required className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Channel Code *</label>
            <input name="channelCode" type="text" required placeholder="e.g. USDPTD-1001" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Integration Type</label>
            <input name="integrationType" type="text" placeholder="e.g. Direct (S2S)" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1 md:col-span-3">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Category Section Note</label>
            <input name="categoryNote" type="text" placeholder="e.g. NOTE: Acquiring Banks for Trusted: Spain, UK..." className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
            <p className="text-[10px] text-gray-400 mt-1">If multiple rows have notes in the same category, only the first is displayed below the section.</p>
          </div>
        </div>
      </div>

      {/* Processing & Limits */}
      <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-700/50 space-y-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Processing & Limits</h5>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Processing Currency</label>
            <input name="processingCurrency" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">GEO Open For Processing</label>
            <input name="geoOpenForProcessing" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">MCC Codes</label>
            <input name="mccCodes" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">MID 3Ds or 2D</label>
            <input name="mid3dsOr2d" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Descriptor</label>
            <input name="descriptor" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Acceptance Rate</label>
            <input name="acceptanceRate" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Whitelist, FTD, & Trusted</label>
            <input name="whitelistFtdTrusted" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Velocities Limits</label>
            <input name="velocitiesLimits" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Transaction Min-Max</label>
            <input name="transactionMinMax" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
        </div>
      </div>

      {/* Fees & Rates */}
      <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-700/50 space-y-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Fees & Rates</h5>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Pay In</label>
            <textarea name="payIn" rows={2} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500 resize-y" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Setup Fee</label>
            <input name="setupFee" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Annual Fee</label>
            <input name="annualFee" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Other Fees</label>
            <textarea name="otherFees" rows={2} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500 resize-y" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Rolling Reserve</label>
            <textarea name="rollingReserve" rows={2} className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500 resize-y" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">CB Fee</label>
            <input name="cbFee" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Refund Fee</label>
            <input name="refundFee" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Transaction Fees</label>
            <input name="transactionFees" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
        </div>
      </div>

      {/* Settlement */}
      <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-700/50 space-y-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">Settlement</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Settlement USDT</label>
            <input name="settlementUsdt" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Settlement Cycle</label>
            <input name="settlementCycle" type="text" className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="submit" className="px-8 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
          Publish Offshore Rate Row
        </button>
      </div>
    </form>
  );
}
