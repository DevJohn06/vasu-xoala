"use client";

import React, { useEffect, useState } from "react";
import { COUNTRIES } from "@/data/countries";
import type { RateRowType } from "./RatesTable";

const getCountryFlag = (countryName: string) => {
  const match = COUNTRIES.find((c) => c.name === countryName);
  if (match?.code) {
    return (
      <img
        src={`https://flagcdn.com/w40/${match.code}.png`}
        srcSet={`https://flagcdn.com/w80/${match.code}.png 2x`}
        width="28"
        alt={match.name}
        className="inline-block object-cover shadow-sm rounded-[3px]"
      />
    );
  }
  return <span className="text-2xl">{match?.flag || "🏳️"}</span>;
};

export function ChannelDetailModal({
  rate,
  onClose,
}: {
  rate: RateRowType | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!rate) return null;

  const handleCopyCode = () => {
    if (rate.channelCode) {
      navigator.clipboard.writeText(rate.channelCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatText = (text?: string | null) => {
    if (!text || text === "-" || text.trim() === "") return <span className="text-gray-400 dark:text-zinc-600">-</span>;
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-gray-900 dark:text-zinc-50 tracking-tight">
                  {rate.channelCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  title="Copy Channel Code"
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            title="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Key Identifiers Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-950/50">
            <div className="flex items-center gap-3">
              <div className="shrink-0">{getCountryFlag(rate.country || "")}</div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 block">Country</span>
                <span className="font-semibold text-gray-900 dark:text-zinc-100">{rate.country || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-zinc-800 pt-3 sm:pt-0 sm:pl-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center font-bold text-xs text-emerald-600 dark:text-emerald-400">
                {rate.currency}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 block">Currency</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{rate.currency}</span>
              </div>
            </div>
          </div>

          {/* Section: General Info */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 dark:text-zinc-500 border-b border-gray-100 dark:border-zinc-800 pb-1.5">
              General Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-zinc-400 block mb-0.5 font-medium">Payment Method</span>
                <span className="font-semibold text-gray-800 dark:text-zinc-200">{rate.paymentMethod}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-zinc-400 block mb-0.5 font-medium">Verticals</span>
                <span className="text-gray-800 dark:text-zinc-200">{formatText(rate.verticals)}</span>
              </div>
            </div>
          </div>

          {/* Section: Deposit & Withdrawal */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 dark:text-zinc-500 border-b border-gray-100 dark:border-zinc-800 pb-1.5">
              Fees & Limits
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Deposit */}
              <div className="p-3.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/40 dark:bg-zinc-950/30 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-600 dark:text-emerald-400 uppercase">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </svg>
                  Deposit Config
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 dark:text-zinc-500 block">Deposit Fee</span>
                  <span className="font-bold text-gray-900 dark:text-zinc-100 leading-snug">{formatText(rate.deposit)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 dark:text-zinc-500 block">Deposit Limit</span>
                  <span className="text-gray-700 dark:text-zinc-300 font-medium">{formatText(rate.depositLimit)}</span>
                </div>
              </div>

              {/* Withdrawal */}
              <div className="p-3.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/40 dark:bg-zinc-950/30 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                  Withdrawal Config
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 dark:text-zinc-500 block">Withdrawal Fee</span>
                  <span className="font-bold text-gray-900 dark:text-zinc-100 leading-snug">{formatText(rate.withdrawal)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 dark:text-zinc-500 block">Withdrawal Limit</span>
                  <span className="text-gray-700 dark:text-zinc-300 font-medium">{formatText(rate.withdrawalLimit)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Settlement & Notes */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 dark:text-zinc-500 border-b border-gray-100 dark:border-zinc-800 pb-1.5">
              Settlement & Operational Notes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-zinc-400 block mb-0.5 font-medium">Settlement Terms</span>
                <span className="text-gray-800 dark:text-zinc-200">{formatText(rate.settlementTerms)}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-zinc-400 block mb-0.5 font-medium">Settlement Cycle</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatText(rate.settlementCycle)}</span>
              </div>
            </div>

            {rate.otherFeesNotes && (
              <div className="pt-2">
                <span className="text-xs text-gray-500 dark:text-zinc-400 block mb-0.5 font-medium">Notes & Other Fees</span>
                <p className="text-xs text-gray-600 dark:text-zinc-300 bg-gray-50 dark:bg-zinc-950 p-3 rounded-lg border border-gray-100 dark:border-zinc-800 whitespace-pre-line leading-relaxed">
                  {rate.otherFeesNotes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
