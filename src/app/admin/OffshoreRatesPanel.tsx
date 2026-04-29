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

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] whitespace-nowrap">
                  <thead className="bg-gray-50/50 dark:bg-zinc-800/50 text-[10px] uppercase text-gray-500 dark:text-zinc-400 font-semibold tracking-wider border-b border-gray-100 dark:border-zinc-800">
                    <tr>
                      <th className="px-4 py-3 text-left sticky left-0 z-10 bg-gray-50/50 dark:bg-zinc-800/50">Actions</th>
                      <th className="px-4 py-3 text-left">Channel Code</th>
                      <th className="px-4 py-3 text-left">Pay In</th>
                      <th className="px-4 py-3 text-left">Setup Fee</th>
                      <th className="px-4 py-3 text-left">Annual Fee</th>
                      <th className="px-4 py-3 text-left">Other Fees</th>
                      <th className="px-4 py-3 text-left">Rolling Reserve</th>
                      <th className="px-4 py-3 text-left">CB Fee</th>
                      <th className="px-4 py-3 text-left">Refund Fee</th>
                      <th className="px-4 py-3 text-left">Txn Fees</th>
                      <th className="px-4 py-3 text-left">Settlement USDT</th>
                      <th className="px-4 py-3 text-left">Txn Min-Max</th>
                      <th className="px-4 py-3 text-left">Settlement Cycle</th>
                      <th className="px-4 py-3 text-left">Velocities</th>
                      <th className="px-4 py-3 text-left">Whitelist/FTD</th>
                      <th className="px-4 py-3 text-left">Processing Cur</th>
                      <th className="px-4 py-3 text-left">GEO Open</th>
                      <th className="px-4 py-3 text-left">MCC Codes</th>
                      <th className="px-4 py-3 text-left">MID 3Ds/2D</th>
                      <th className="px-4 py-3 text-left">Descriptor</th>
                      <th className="px-4 py-3 text-left">Acceptance</th>
                      <th className="px-4 py-3 text-left">Integration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {filteredCatRates.length === 0 ? (
                      <tr><td colSpan={22} className="px-4 py-12 text-center text-gray-400 italic">No rates found matching "{query}".</td></tr>
                    ) : null}
                    {filteredCatRates.map((rate) => (
                        <tr key={rate.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="px-4 py-3 sticky left-0 z-10 bg-white dark:bg-zinc-900 group-hover:bg-gray-50 dark:group-hover:bg-zinc-800/50">
                            <div className="flex justify-start items-center gap-1.5">
                              <Link href={`?editRateId=${rate.id}`} className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-500/10 rounded" title="Edit">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                              </Link>
                              <form action={deleteOffshoreRate}>
                                <input type="hidden" name="id" value={rate.id} />
                                <button type="submit" className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-500/10 transition-colors rounded" title="Delete">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                </button>
                              </form>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{rate.channelCode}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-[150px] truncate">{rate.payIn || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.setupFee || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.annualFee || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-[150px] truncate">{rate.otherFees || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-[150px] truncate">{rate.rollingReserve || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.cbFee || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.refundFee || '-'}</td>
                          <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-medium">{rate.transactionFees || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.settlementUsdt || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.transactionMinMax || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.settlementCycle || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.velocitiesLimits || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.whitelistFtdTrusted || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.processingCurrency || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.geoOpenForProcessing || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.mccCodes || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.mid3dsOr2d || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.descriptor || '-'}</td>
                          <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">{rate.acceptanceRate || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.integrationType || '-'}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!targetSlug && catRates.length > 0 && (
                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex justify-end bg-gray-50/30 dark:bg-zinc-800/30">
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
