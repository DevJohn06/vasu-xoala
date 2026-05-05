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

  // Group by category
  const groupedRates: Record<string, OffshoreRateRowType[]> = {};
  rates.forEach(r => {
    const cat = r.category || "Uncategorized";
    if (!groupedRates[cat]) groupedRates[cat] = [];
    groupedRates[cat].push(r);
  });

  if (!rates || rates.length === 0) {
    return (
      <section className="w-full max-w-[1400px] mx-auto px-4 py-12 text-center text-gray-500 dark:text-zinc-400">
        No offshore rates available.
      </section>
    );
  }

  const GroupedItem = ({ label, value }: { label: string, value?: string | null }) => {
    if (!value || value === '-' || value.trim() === '') return null;
    return (
      <div className="mb-3 last:mb-0">
        <span className="text-[10px] uppercase font-bold text-gray-900 dark:text-zinc-200 block mb-0.5">{label}</span>
        <span className="text-gray-700 dark:text-zinc-400 block text-[11px] leading-relaxed">{formatText(value)}</span>
      </div>
    );
  };

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      <div className="space-y-16">
        {Object.entries(groupedRates).map(([category, categoryRates]) => {
          const query = searchQueries[category] || "";
          const filteredCatRates = query.trim()
            ? categoryRates.filter(r => 
                r.channelCode.toLowerCase().includes(query.toLowerCase()) || 
                r.processingCurrency?.toLowerCase().includes(query.toLowerCase()) ||
                r.geoOpenForProcessing?.toLowerCase().includes(query.toLowerCase())
              )
            : categoryRates;
          
          const sectionNote = categoryRates.find(r => r.categoryNote)?.categoryNote;

          return (
            <div key={category} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Table Container with Blue Header */}
              <div className="border border-gray-300 dark:border-zinc-800 rounded-sm overflow-hidden shadow-sm bg-white dark:bg-zinc-950">
                
                {/* Blue Title Header */}
                <div className="bg-[#A7C7E7] dark:bg-blue-900/40 border-b border-gray-300 dark:border-zinc-800 px-4 py-2.5 flex items-center justify-between">
                  <h3 className="text-[13px] font-bold text-gray-900 dark:text-blue-50 uppercase tracking-wide">
                    {category}
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setSearchQueries(prev => ({ ...prev, [category]: e.target.value }))}
                      placeholder="Search..."
                      className="pl-3 pr-3 py-0.5 text-[10px] rounded border border-gray-400/50 bg-white/50 dark:bg-zinc-900/50 text-gray-900 dark:text-white placeholder-gray-500 outline-none w-32 focus:ring-1 focus:ring-blue-400 transition-all"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-[#f3f4f6] dark:bg-zinc-900 border-b border-gray-300 dark:border-zinc-800">
                        <th className="px-4 py-2 text-[10px] font-bold uppercase text-gray-700 dark:text-zinc-300 border-r border-gray-300 dark:border-zinc-800 w-[15%]">Channel Code</th>
                        <th className="px-4 py-2 text-[10px] font-bold uppercase text-gray-700 dark:text-zinc-300 border-r border-gray-300 dark:border-zinc-800 w-[15%]">Pay In</th>
                        <th className="px-4 py-2 text-[10px] font-bold uppercase text-gray-700 dark:text-zinc-300 border-r border-gray-300 dark:border-zinc-800 w-[20%]">Fees</th>
                        <th className="px-4 py-2 text-[10px] font-bold uppercase text-gray-700 dark:text-zinc-300 border-r border-gray-300 dark:border-zinc-800 w-[30%]">Terms</th>
                        <th className="px-4 py-2 text-[10px] font-bold uppercase text-gray-700 dark:text-zinc-300 w-[20%]">Acquiring Banks Locations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                      {filteredCatRates.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-12 text-center text-gray-400 italic text-[11px]">
                            No channels found matching &ldquo;{query}&rdquo;
                          </td>
                        </tr>
                      ) : (
                        filteredCatRates.map((rate, idx) => (
                          <tr key={rate.id || idx} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                            {/* CHANNEL CODE */}
                            <td className="px-4 py-5 align-top border-r border-gray-200 dark:border-zinc-800">
                              <div className="font-bold text-[12px] text-gray-900 dark:text-zinc-100 leading-tight">
                                {formatText(rate.channelCode)}
                              </div>
                            </td>

                            {/* PAY IN */}
                            <td className="px-4 py-5 align-top border-r border-gray-200 dark:border-zinc-800">
                              <div className="text-[12px] font-medium text-gray-800 dark:text-zinc-200">
                                {formatText(rate.payIn)}
                              </div>
                            </td>

                            {/* FEES */}
                            <td className="px-4 py-5 align-top border-r border-gray-200 dark:border-zinc-800">
                              <div className="space-y-4">
                                <GroupedItem label="Setup Fee" value={rate.setupFee} />
                                <GroupedItem label="Annual Fee" value={rate.annualFee} />
                                <GroupedItem label="Transaction Fees" value={rate.transactionFees} />
                                <GroupedItem label="Chargeback Fee" value={rate.cbFee} />
                                <GroupedItem label="Refund Fee" value={rate.refundFee} />
                                <GroupedItem label="Other Fees" value={rate.otherFees} />
                              </div>
                            </td>

                            {/* TERMS */}
                            <td className="px-4 py-5 align-top border-r border-gray-200 dark:border-zinc-800">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div className="space-y-4">
                                  <GroupedItem label="Rolling Reserve" value={rate.rollingReserve} />
                                  <GroupedItem label="Transaction: Min-Max" value={rate.transactionMinMax} />
                                  <GroupedItem label="Settlement USDT" value={rate.settlementUsdt} />
                                  <GroupedItem label="Settlement Cycle" value={rate.settlementCycle} />
                                  <GroupedItem label="Acceptance Rate" value={rate.acceptanceRate} />
                                </div>
                                <div className="space-y-4">
                                  <GroupedItem label="MCC Codes" value={rate.mccCodes} />
                                  <GroupedItem label="MID 3Ds or 2D" value={rate.mid3dsOr2d} />
                                  <GroupedItem label="Descriptor" value={rate.descriptor} />
                                  <GroupedItem label="Whitelist, FTD, & Trusted" value={rate.whitelistFtdTrusted} />
                                  <GroupedItem label="Processing Currency" value={rate.processingCurrency} />
                                  <GroupedItem label="Velocities Limits" value={rate.velocitiesLimits} />
                                  <GroupedItem label="Integration Type" value={rate.integrationType} />
                                </div>
                              </div>
                            </td>

                            {/* LOCATIONS */}
                            <td className="px-4 py-5 align-top">
                              <div className="text-[11px] text-gray-700 dark:text-zinc-400 leading-relaxed font-medium">
                                {formatText(rate.geoOpenForProcessing)}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section Note */}
              {sectionNote && (
                <div className="mt-4 px-4 py-2 bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-blue-400 text-[11px] text-blue-700 dark:text-blue-300 font-medium">
                  {sectionNote}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
