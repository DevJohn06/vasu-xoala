import React from "react";
import { type RateRow } from "@/data/mock-rates";

interface RateCardProps {
  rate: RateRow;
}

function RowLabel({ label }: { label: string }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
      {label}
    </span>
  );
}

function RowValue({ value }: { value: string }) {
  if (!value || value === "NA") {
    return <span className="text-sm text-gray-400 dark:text-zinc-600 italic">—</span>;
  }
  return (
    <span className="text-sm text-gray-800 dark:text-zinc-100 whitespace-pre-line text-right">
      {value}
    </span>
  );
}

export function RateCard({ rate }: RateCardProps) {
  const rows: { label: string; value: string }[] = [
    { label: "Channel Code", value: rate.channelCode },
    { label: "Payment Method", value: rate.paymentMethod },
    { label: "Verticals", value: rate.verticals },
    { label: "Deposit", value: rate.deposit },
    { label: "Deposit Limit", value: rate.depositLimit },
    { label: "Withdrawal", value: rate.withdrawal },
    { label: "Withdrawal Limit", value: rate.withdrawalLimit },
    { label: "Settlement Terms", value: rate.settlementTerms },
    { label: "Settlement Cycle", value: rate.settlementCycle },
  ];

  return (
    <div className="relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300 group">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
            {rate.currency}
          </p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {rate.country}
          </h3>
        </div>
        <span className="shrink-0 rounded-lg bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-mono text-gray-500 dark:text-zinc-400">
          {rate.channelCode}
        </span>
      </div>

      {/* Details */}
      <dl className="flex-1 space-y-3">
        {rows.slice(1).map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-4">
            <RowLabel label={label} />
            <RowValue value={value} />
          </div>
        ))}
      </dl>

      {/* Other fees note */}
      {rate.otherFeesNotes && (
        <p className="mt-5 border-t border-gray-100 dark:border-zinc-800 pt-4 text-xs text-gray-400 dark:text-zinc-500 leading-relaxed">
          {rate.otherFeesNotes}
        </p>
      )}

      {/* Decorative hover gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
