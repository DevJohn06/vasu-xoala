"use client";

import React, { useState } from "react";

export type OffshoreRateRowType = {
  id?: string | number;
  category: string;
  categoryNote?: string | null;
  channelCode: string;
  payIn?: string | null;
  setupFee?: string | null;
  annualFee?: string | null;
  otherFees?: string | null;
  rollingReserve?: string | null;
  cbFee?: string | null;
  refundFee?: string | null;
  transactionFees?: string | null;
  settlementUsdt?: string | null;
  transactionMinMax?: string | null;
  settlementCycle?: string | null;
  velocitiesLimits?: string | null;
  whitelistFtdTrusted?: string | null;
  processingCurrency?: string | null;
  geoOpenForProcessing?: string | null;
  mccCodes?: string | null;
  mid3dsOr2d?: string | null;
  descriptor?: string | null;
  acceptanceRate?: string | null;
  integrationType?: string | null;
};

export function OffshoreRatesTable({ rates = [] }: { rates: OffshoreRateRowType[] }) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});

  const formatText = (text?: string | null) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const filteredRates = rates;

  // Group by category
  const groupedRates: Record<string, OffshoreRateRowType[]> = {};
  filteredRates.forEach(r => {
    const cat = r.category || "Uncategorized";
    if (!groupedRates[cat]) groupedRates[cat] = [];
    groupedRates[cat].push(r);
  });

  if (!rates || rates.length === 0) {
    return (
      <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-12 text-center text-gray-500 dark:text-zinc-400">
        No offshore rates available.
      </section>
    );
  }

  const DataItem = ({ label, value }: { label: string, value?: string | null }) => {
    if (!value || value === '-' || value.trim() === '') return null;
    return (
      <div className="mb-1.5 last:mb-0">
        <span className="text-[10px] uppercase font-semibold text-gray-400 dark:text-zinc-500 block mb-0.5">{label}</span>
        <span className="text-gray-800 dark:text-zinc-200 block text-[11px] leading-snug">{formatText(value)}</span>
      </div>
    );
  };

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-2 pb-16">
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">                {Object.entries(groupedRates).map(([category, categoryRates]) => {
                  const query = searchQueries[category] || "";
                  const filteredCatRates = query.trim()
                    ? categoryRates.filter(r => r.channelCode.toLowerCase().includes(query.toLowerCase()) || r.processingCurrency?.toLowerCase().includes(query.toLowerCase()))
                    : categoryRates;
                  
                  // Find the first non-null note in this category
                  const sectionNote = categoryRates.find(r => r.categoryNote)?.categoryNote;

                  return (
                    <div key={category} className="space-y-4">
                      {/* Category Header */}
                      <div className="bg-emerald-500 text-white px-4 py-2 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <h3 className="text-sm font-bold uppercase tracking-wider">{category}</h3>
                          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
                            {filteredCatRates.length} row{filteredCatRates.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="relative">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-100 pointer-events-none">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          <input
                            type="text"
                            value={query}
                            onChange={(e) => setSearchQueries(prev => ({ ...prev, [category]: e.target.value }))}
                            placeholder="Search section..."
                            className="pl-8 pr-3 py-1 text-[11px] rounded-md border border-white/20 bg-white/10 text-white placeholder-emerald-100 outline-none focus:ring-1 focus:ring-white/50 w-40"
                          />
                        </div>
                      </div>

                      <div className="w-full rounded-b-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
                        <div className="w-full overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className="bg-gray-50/80 dark:bg-zinc-900/80 text-[10px] uppercase text-gray-500 dark:text-zinc-400 font-semibold tracking-wider border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
                              <tr>
                                <th className="px-4 py-3 w-1/5">Channel & Integration</th>
                                <th className="px-4 py-3 w-1/5">Processing & Geo</th>
                                <th className="px-4 py-3 w-1/5">Admin & Setup Fees</th>
                                <th className="px-4 py-3 w-1/5">Transactional Fees</th>
                                <th className="px-4 py-3 w-1/5">Limits & Settlement</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                              {filteredCatRates.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400 dark:text-zinc-500 italic">
                                    No rows found matching &ldquo;{query}&rdquo; in this section.
                                  </td>
                                </tr>
                              ) : (
                                filteredCatRates.map((rate) => {
                                  const rowKey = String(rate.id || Math.random());
                                  return (
                                    <tr
                                      key={rowKey}
                                      className={`
                                        transition-colors duration-200 ease-in-out hover:bg-gray-50 dark:hover:bg-zinc-900/50
                                        ${hoveredRow === rowKey ? 'bg-gray-50/80 dark:bg-zinc-900/50' : 'bg-white dark:bg-zinc-950'}
                                      `}
                                      onMouseEnter={() => setHoveredRow(rowKey)}
                                      onMouseLeave={() => setHoveredRow(null)}
                                    >
                                      <td className="px-4 py-4 align-top">
                                        <div className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold mb-2">{rate.channelCode}</div>
                                        <DataItem label="Integration Type" value={rate.integrationType} />
                                        <DataItem label="Descriptor" value={rate.descriptor} />
                                        <DataItem label="MID (3DS/2D)" value={rate.mid3dsOr2d} />
                                      </td>
                                      <td className="px-4 py-4 align-top border-l border-gray-100 dark:border-zinc-800/50">
                                        <DataItem label="Processing Currencies" value={rate.processingCurrency} />
                                        <DataItem label="GEO Open" value={rate.geoOpenForProcessing} />
                                        <DataItem label="MCC Codes" value={rate.mccCodes} />
                                        <DataItem label="Whitelist / FTD" value={rate.whitelistFtdTrusted} />
                                      </td>
                                      <td className="px-4 py-4 align-top border-l border-gray-100 dark:border-zinc-800/50">
                                        <DataItem label="Setup Fee" value={rate.setupFee} />
                                        <DataItem label="Annual Fee" value={rate.annualFee} />
                                        <DataItem label="Pay In" value={rate.payIn} />
                                        <DataItem label="Other Fees" value={rate.otherFees} />
                                      </td>
                                      <td className="px-4 py-4 align-top border-l border-gray-100 dark:border-zinc-800/50">
                                        <DataItem label="Transaction Fees" value={rate.transactionFees} />
                                        <DataItem label="CB Fee" value={rate.cbFee} />
                                        <DataItem label="Refund Fee" value={rate.refundFee} />
                                        <DataItem label="Rolling Reserve" value={rate.rollingReserve} />
                                      </td>
                                      <td className="px-4 py-4 align-top border-l border-gray-100 dark:border-zinc-800/50">
                                        <DataItem label="Min-Max" value={rate.transactionMinMax} />
                                        <DataItem label="Velocities" value={rate.velocitiesLimits} />
                                        <DataItem label="Acceptance Rate" value={rate.acceptanceRate} />
                                        <DataItem label="Settlement Cycle" value={rate.settlementCycle} />
                                        <DataItem label="Settlement USDT" value={rate.settlementUsdt} />
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Section Note Below Table */}
                      {sectionNote && (
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30 flex gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                          <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">{sectionNote}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
      </div>
    </section>
  );
}
