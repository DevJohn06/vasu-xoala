"use client";

import React, { useState } from "react";
import { COUNTRIES } from "@/data/countries";

export type RateRowType = {
  _key?: string;
  id?: string | number;
  country: string;
  currency: string;
  channelCode: string;
  paymentMethod: string;
  verticals?: string | null;
  deposit?: string | null;
  depositLimit?: string | null;
  withdrawal?: string | null;
  withdrawalLimit?: string | null;
  otherFeesNotes?: string | null;
  settlementTerms?: string | null;
  settlementCycle?: string | null;
};

const getCountryFlag = (countryName: string) => {
  const match = COUNTRIES.find(c => c.name === countryName);
  return match?.flag || "🏳️";
};

export function RatesTable({ rates = [] }: { rates: RateRowType[] }) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const formatText = (text?: string | null) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const filteredRates = searchQuery.trim()
    ? rates.filter(r => {
        const q = searchQuery.toLowerCase();
        return (
          (r.country && r.country.toLowerCase().includes(q)) ||
          (r.currency && r.currency.toLowerCase().includes(q)) ||
          (r.channelCode && r.channelCode.toLowerCase().includes(q)) ||
          (r.paymentMethod && r.paymentMethod.toLowerCase().includes(q)) ||
          (r.verticals && r.verticals.toLowerCase().includes(q))
        );
      })
    : rates;

  if (!rates || rates.length === 0) {
    return (
      <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-12 text-center text-gray-500 dark:text-zinc-400">
        No rates available.
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 pt-2 pb-16">
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Search bar above table */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            {filteredRates.length} row{filteredRates.length !== 1 ? "s" : ""}
            {searchQuery ? ` matching "${searchQuery}"` : " total"}
          </p>
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rates…"
              className="pl-8 pr-8 py-2 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-zinc-500 outline-none focus:ring-2 focus:ring-emerald-500/40 transition-shadow w-52"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
          <table className="w-full text-[11px] text-left border-collapse">
            <thead className="bg-gray-50/80 dark:bg-zinc-900/80 text-[10px] uppercase text-gray-500 dark:text-zinc-400 font-semibold tracking-wider border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-2 py-3 whitespace-nowrap">Currency</th>
                <th className="px-2 py-3">Channel</th>
                <th className="px-2 py-3">Method</th>
                <th className="px-2 py-3">Verticals</th>
                <th className="px-2 py-3">Deposit</th>
                <th className="px-2 py-3">Dep. Limit</th>
                <th className="px-2 py-3">Withdrawal</th>
                <th className="px-2 py-3">W/D Limit</th>
                <th className="px-2 py-3">Fees / Notes</th>
                <th className="px-2 py-3">Settlement</th>
                <th className="px-2 py-3">Cycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
              {filteredRates.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-10 text-center text-gray-400 dark:text-zinc-500">
                    No rows match &ldquo;{searchQuery}&rdquo;.
                  </td>
                </tr>
              ) : null}
              {filteredRates.map((rate) => {
                const rowKey = String(rate._key || rate.id || Math.random());
                return (
                  <tr
                    key={rowKey}
                    className={`
                      transition-colors duration-200 ease-in-out hover:bg-emerald-50/30 dark:hover:bg-emerald-500/5
                      ${hoveredRow === rowKey ? 'bg-gray-50/80 dark:bg-zinc-900/50' : 'bg-white dark:bg-zinc-950'}
                    `}
                    onMouseEnter={() => setHoveredRow(rowKey)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-2 py-3 whitespace-nowrap align-top">
                      <div className="flex items-center gap-2">
                        <span title={rate.country} aria-label={rate.country} className="text-2xl cursor-help drop-shadow-sm leading-none">
                          {getCountryFlag(rate.country || "")}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {rate.currency}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 font-mono text-[10px] text-gray-600 dark:text-zinc-400 align-top max-w-[90px] truncate" title={rate.channelCode}>
                      {rate.channelCode}
                    </td>
                    <td className="px-2 py-3 text-gray-700 dark:text-zinc-300 align-top min-w-[100px]">
                      {rate.paymentMethod}
                    </td>
                    <td className="px-2 py-3 text-gray-600 dark:text-zinc-400 leading-relaxed align-top min-w-[100px]">
                      {rate.verticals || <span className="text-gray-300 dark:text-zinc-600">-</span>}
                    </td>
                    <td className="px-2 py-3 text-gray-700 dark:text-zinc-300 font-medium whitespace-normal align-top min-w-[150px] max-w-[220px]">
                      {formatText(rate.deposit)}
                    </td>
                    <td className="px-2 py-3 text-gray-600 dark:text-zinc-400 align-top whitespace-nowrap">
                      {rate.depositLimit}
                    </td>
                    <td className="px-2 py-3 text-gray-700 dark:text-zinc-300 font-medium whitespace-normal align-top min-w-[150px] max-w-[220px]">
                      {formatText(rate.withdrawal)}
                    </td>
                    <td className="px-2 py-3 text-gray-600 dark:text-zinc-400 align-top whitespace-nowrap">
                      {rate.withdrawalLimit}
                    </td>
                    <td className="px-2 py-3 text-gray-600 dark:text-zinc-400 leading-relaxed align-top min-w-[120px]">
                      {rate.otherFeesNotes || <span className="text-gray-300 dark:text-zinc-600">-</span>}
                    </td>
                    <td className="px-2 py-3 text-gray-700 dark:text-zinc-300 leading-relaxed align-top min-w-[100px]">
                      {formatText(rate.settlementTerms)}
                    </td>
                    <td className="px-2 py-3 text-indigo-600 dark:text-indigo-400 font-medium whitespace-nowrap align-top">
                      {formatText(rate.settlementCycle)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
