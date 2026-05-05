"use client";

import { useState } from "react"
import { deleteOffshoreRate, seedOffshoreRates } from "./offshoreActions"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import AddOffshoreRateModal from "./AddOffshoreRateModal"
import EditOffshoreRateModal from "./EditOffshoreRateModal"
import UploadOffshoreRatesModal from "./UploadOffshoreRatesModal"
import CloneDirectButton from "./CloneDirectButton"
import PurgeOffshoreRatesButton from "./PurgeOffshoreRatesButton"

export default function OffshoreRatesPanel({ 
  targetSlug, 
  editRateId, 
  initialRates = [] 
}: { 
  targetSlug?: string, 
  editRateId?: string, 
  initialRates?: any[]
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rateTab = searchParams.get('rateTab') || 'direct';
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});

  const allRates = initialRates;
  const activeSlug = targetSlug || (rateTab === 'reseller' ? 'reseller' : 'direct');
  
  const editingRate = editRateId ? allRates.find(r => r.id.toString() === editRateId) : null;

  const categories = [
    "Worldwide Credit Card Acquiring: Gaming (3DS)",
    "Worldwide Credit Card Acquiring: Forex (3DS)",
    "Credit Card Acquiring: 2D"
  ];

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500 w-full">
      {editingRate && <EditOffshoreRateModal rate={editingRate} />}
      
      <div className="flex justify-between items-center px-1 mb-2">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50 mb-1">
            {!targetSlug ? (rateTab === 'reseller' ? "Reseller Offshore Configuration" : "Direct Offshore Configuration") : "Personalized Offshore Profile"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {!targetSlug 
              ? 'Configure the global default offshore rate table rows.'
              : 'Add, edit, or override specific offshore rate rows for this user instance.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <UploadOffshoreRatesModal targetSlug={activeSlug} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between px-1 gap-4 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {!targetSlug && (
            <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg w-fit">
              <Link scroll={false} href="?rateTab=direct" className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${rateTab !== 'reseller' ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Direct Rates</Link>
              <Link scroll={false} href="?rateTab=reseller" className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${rateTab === 'reseller' ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Reseller Rates</Link>
            </div>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {allRates.length} row{allRates.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {!targetSlug && rateTab === 'reseller' && (
            <CloneDirectButton />
          )}
        </div>
      </div>

      {categories.map(cat => {
        const query = searchQueries[cat] || "";
        const catRates = allRates.filter(r => r.category === cat);
        const filteredCatRates = query.trim()
          ? catRates.filter(r => r.channelCode.toLowerCase().includes(query.toLowerCase()))
          : catRates;
        
        return (
          <div key={cat} className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div className="flex flex-col gap-1">
                <h4 className="text-lg font-bold text-gray-900 dark:text-zinc-50 uppercase tracking-tight">{cat}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {filteredCatRates.length} row{filteredCatRates.length !== 1 ? "s" : ""}
                  {query ? ` matching "${query}"` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setSearchQueries(prev => ({ ...prev, [cat]: e.target.value }))}
                    placeholder={`Search ${cat.split(':').pop()?.trim()}...`}
                    className="pl-8 pr-3 py-1.5 text-[11px] rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 outline-none focus:ring-1 focus:ring-emerald-500 w-48"
                  />
                </div>
                <AddOffshoreRateModal targetSlug={activeSlug} fixedCategory={cat} />
              </div>
            </div>

            <div className="border border-gray-300 dark:border-zinc-800 rounded-sm overflow-hidden shadow-sm bg-white dark:bg-zinc-950">
              {/* Blue Title Header for Category */}
              <div className="bg-[#A7C7E7] dark:bg-blue-900/40 border-b border-gray-300 dark:border-zinc-800 px-4 py-2 flex items-center justify-between">
                <h4 className="text-[12px] font-bold text-gray-900 dark:text-blue-50 uppercase tracking-wide">
                  {cat}
                </h4>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-gray-700 dark:text-blue-200 font-medium bg-white/30 dark:bg-black/20 px-2 py-0.5 rounded">
                    {filteredCatRates.length} rows
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#f3f4f6] dark:bg-zinc-900 border-b border-gray-300 dark:border-zinc-800">
                      <th className="px-4 py-2 text-[10px] font-bold uppercase text-gray-700 dark:text-zinc-300 border-r border-gray-300 dark:border-zinc-800 w-[80px]">Actions</th>
                      <th className="px-4 py-2 text-[10px] font-bold uppercase text-gray-700 dark:text-zinc-300 border-r border-gray-300 dark:border-zinc-800 w-[12%]">Channel Code</th>
                      <th className="px-4 py-2 text-[10px] font-bold uppercase text-gray-700 dark:text-zinc-300 border-r border-gray-300 dark:border-zinc-800 w-[12%]">Pay In</th>
                      <th className="px-4 py-2 text-[10px] font-bold uppercase text-gray-700 dark:text-zinc-300 border-r border-gray-300 dark:border-zinc-800 w-[20%]">Fees</th>
                      <th className="px-4 py-2 text-[10px] font-bold uppercase text-gray-700 dark:text-zinc-300 border-r border-gray-300 dark:border-zinc-800 w-[30%]">Terms</th>
                      <th className="px-4 py-2 text-[10px] font-bold uppercase text-gray-700 dark:text-zinc-300 w-[20%]">Locations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 text-[11px]">
                    {filteredCatRates.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-gray-400 italic">
                          No rates found matching "{query}".
                        </td>
                      </tr>
                    ) : (
                      filteredCatRates.map((rate) => (
                        <tr key={rate.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                          {/* ACTIONS */}
                          <td className="px-4 py-4 align-top border-r border-gray-200 dark:border-zinc-800 sticky left-0 z-10 bg-white dark:bg-zinc-950">
                            <div className="flex flex-col gap-2">
                              <Link href={`?editRateId=${rate.id}`} className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-500/10 rounded flex items-center justify-center" title="Edit">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                              </Link>
                              <form action={deleteOffshoreRate}>
                                <input type="hidden" name="id" value={rate.id} />
                                <button type="submit" className="w-full p-1.5 text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-500/10 transition-colors rounded flex items-center justify-center" title="Delete">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                </button>
                              </form>
                            </div>
                          </td>

                          {/* CHANNEL CODE */}
                          <td className="px-4 py-4 align-top border-r border-gray-200 dark:border-zinc-800">
                            <div className="font-bold text-gray-900 dark:text-zinc-100 whitespace-normal leading-tight">
                              {rate.channelCode}
                            </div>
                          </td>

                          {/* PAY IN */}
                          <td className="px-4 py-4 align-top border-r border-gray-200 dark:border-zinc-800">
                            <div className="font-medium text-gray-800 dark:text-zinc-200 whitespace-normal">
                              {rate.payIn || '-'}
                            </div>
                          </td>

                          {/* FEES */}
                          <td className="px-4 py-4 align-top border-r border-gray-200 dark:border-zinc-800">
                            <div className="space-y-3">
                              {rate.setupFee && <div><span className="font-bold block uppercase text-[9px] text-gray-400">Setup</span> {rate.setupFee}</div>}
                              {rate.annualFee && <div><span className="font-bold block uppercase text-[9px] text-gray-400">Annual</span> {rate.annualFee}</div>}
                              {rate.transactionFees && <div><span className="font-bold block uppercase text-[9px] text-gray-400">Txn</span> {rate.transactionFees}</div>}
                              {rate.cbFee && <div><span className="font-bold block uppercase text-[9px] text-gray-400">CB</span> {rate.cbFee}</div>}
                              {rate.refundFee && <div><span className="font-bold block uppercase text-[9px] text-gray-400">Refund</span> {rate.refundFee}</div>}
                              {rate.otherFees && <div><span className="font-bold block uppercase text-[9px] text-gray-400">Other</span> {rate.otherFees}</div>}
                            </div>
                          </td>

                          {/* TERMS */}
                          <td className="px-4 py-4 align-top border-r border-gray-200 dark:border-zinc-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-3">
                                {rate.rollingReserve && <div><span className="font-bold block uppercase text-[9px] text-gray-400">Rolling</span> {rate.rollingReserve}</div>}
                                {rate.transactionMinMax && <div><span className="font-bold block uppercase text-[9px] text-gray-400">Min-Max</span> {rate.transactionMinMax}</div>}
                                {rate.settlementUsdt && <div><span className="font-bold block uppercase text-[9px] text-gray-400">USDT</span> {rate.settlementUsdt}</div>}
                                {rate.settlementCycle && <div><span className="font-bold block uppercase text-[9px] text-gray-400">Cycle</span> {rate.settlementCycle}</div>}
                                {rate.acceptanceRate && <div><span className="font-bold block uppercase text-[9px] text-gray-400">Acceptance</span> {rate.acceptanceRate}</div>}
                              </div>
                              <div className="space-y-3">
                                {rate.mccCodes && <div><span className="font-bold block uppercase text-[9px] text-gray-400">MCC</span> {rate.mccCodes}</div>}
                                {rate.mid3dsOr2d && <div><span className="font-bold block uppercase text-[9px] text-gray-400">MID</span> {rate.mid3dsOr2d}</div>}
                                {rate.descriptor && <div><span className="font-bold block uppercase text-[9px] text-gray-400">Descriptor</span> {rate.descriptor}</div>}
                                {rate.whitelistFtdTrusted && <div><span className="font-bold block uppercase text-[9px] text-gray-400">Whitelist</span> {rate.whitelistFtdTrusted}</div>}
                                {rate.processingCurrency && <div><span className="font-bold block uppercase text-[9px] text-gray-400">Currency</span> {rate.processingCurrency}</div>}
                                {rate.velocitiesLimits && <div><span className="font-bold block uppercase text-[9px] text-gray-400">Velocities</span> {rate.velocitiesLimits}</div>}
                                {rate.integrationType && <div><span className="font-bold block uppercase text-[9px] text-gray-400">Type</span> {rate.integrationType}</div>}
                              </div>
                            </div>
                          </td>

                          {/* LOCATIONS */}
                          <td className="px-4 py-4 align-top">
                            <div className="text-gray-700 dark:text-zinc-400 whitespace-normal leading-relaxed">
                              {rate.geoOpenForProcessing || '-'}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {!targetSlug && catRates.length > 0 && (
                <div className="p-3 border-t border-gray-200 dark:border-zinc-800 flex justify-end bg-gray-50/50 dark:bg-zinc-800/30">
                  <PurgeOffshoreRatesButton targetSlug={activeSlug} category={cat} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  )
}
