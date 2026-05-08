"use client";

import React, { useState } from "react";
import { updateOtcFee } from "@/app/admin/updateOtcSettings";

export type OtcFeesType = {
  typicalTransactionSettlement?: string;
  conversionSmallUpTo50k?: string;
  conversionSmall50kTo250k?: string;
  conversionSmall250kTo1m?: string;
  wireTransferSmall?: string;
  conversionLarge1mTo5m?: string;
  conversionLarge5mTo10m?: string;
  conversionLarge10mPlus?: string;
  wireTransferLarge?: string;
  typicalTransactionSettlementFees?: string;
};

export function OtcRatesTable({
  otcFees,
  isEditable = false,
  pageSlug = "global"
}: {
  otcFees?: OtcFeesType | null;
  isEditable?: boolean;
  pageSlug?: string;
}) {
  const defaultFees: Required<OtcFeesType> = {
    typicalTransactionSettlement: "T+0/1 (Crypto); T+1/2 (Fiat)",
    conversionSmallUpTo50k: "2.25%",
    conversionSmall50kTo250k: "2.00%",
    conversionSmall250kTo1m: "1.75%",
    wireTransferSmall: "Network or institution dependent at the time of transaction – purely pass through.",
    conversionLarge1mTo5m: "1.50%",
    conversionLarge5mTo10m: "1.25%",
    conversionLarge10mPlus: "1.00%",
    wireTransferLarge: "Network or institution dependent at the time of transaction – purely pass through.",
    typicalTransactionSettlementFees: ""
  };

  const getFee = (key: keyof OtcFeesType) => {
    if (otcFees && otcFees[key] !== undefined) return otcFees[key];
    return defaultFees[key];
  };

  const EditableFee = ({ fieldKey, labelClassName = "text-[12px] font-medium text-gray-900 dark:text-zinc-100", asTextArea = false }: { fieldKey: keyof OtcFeesType, labelClassName?: string, asTextArea?: boolean }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(getFee(fieldKey) || "");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
      setIsSaving(true);
      await updateOtcFee(pageSlug, fieldKey, value);
      setIsSaving(false);
      setIsEditing(false);
    };

    if (!isEditable) {
      return <span className={labelClassName}>{getFee(fieldKey)}</span>;
    }

    if (isEditing) {
      return (
        <div className="flex items-center gap-2 w-full">
          {asTextArea ? (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full min-h-[40px] px-2 py-1 text-xs border border-blue-400 rounded focus:outline-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full max-w-[200px] px-2 py-1 text-xs border border-blue-400 rounded focus:outline-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
              autoFocus
            />
          )}
          <button onClick={handleSave} disabled={isSaving} className="text-green-600 hover:text-green-700 flex-shrink-0">
            {isSaving ? "..." : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
          </button>
          <button onClick={() => { setIsEditing(false); setValue(getFee(fieldKey) || ""); }} className="text-red-500 hover:text-red-700 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      );
    }

    return (
      <div className="group flex items-center gap-2">
        <span className={labelClassName}>{getFee(fieldKey)}</span>
        <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
        </button>
      </div>
    );
  };

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="w-full border border-gray-300 dark:border-zinc-800 rounded-sm overflow-hidden shadow-sm bg-white dark:bg-zinc-950 flex flex-col">
        
        {/* Header */}
        <div className="grid grid-cols-12 bg-[#003366] border-b border-gray-300 dark:border-zinc-800 relative">
          <div className="col-span-8 px-4 py-3 flex items-center justify-center border-r border-blue-800/30">
            <span className="text-[12px] font-bold text-white uppercase tracking-wide">
              TRANSACTION DESCRIPTION
            </span>
          </div>
          <div className="col-span-2 px-4 py-3 flex items-center justify-center border-r border-blue-800/30">
            <span className="text-[12px] font-bold text-white uppercase tracking-wide">
              FEES
            </span>
          </div>
          <div className="col-span-2 px-4 py-3 flex items-center justify-center">
            <span className="text-[12px] font-bold text-white uppercase tracking-wide">
              OTHERS
            </span>
          </div>
          {isEditable && (
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded border border-blue-500/30">Admin Edit Mode</span>
          )}
        </div>

        {/* Content Rows */}
        <div className="flex flex-col border border-gray-300 dark:border-zinc-800 rounded-b-sm bg-white dark:bg-zinc-950">
          
          {/* SECTION 1: Transaction Settlement */}
          <div className="bg-[#D9EAF7] dark:bg-blue-900/30 px-4 py-2 border-b border-gray-300 dark:border-zinc-800">
            <span className="text-[12px] font-bold text-gray-900 dark:text-zinc-100">Transaction Settlement</span>
          </div>
          <div className="grid grid-cols-12 border-b border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="col-span-8 p-4 border-r border-gray-300 dark:border-zinc-800 flex items-center">
              <span className="text-[12px] font-bold text-gray-900 dark:text-zinc-100">Typical Transaction Settlement</span>
            </div>
            <div className="col-span-2 p-4 bg-[#D9EAF7] dark:bg-blue-900/10 border-r border-gray-300 dark:border-zinc-800 flex items-center justify-center text-center">
              <EditableFee fieldKey="typicalTransactionSettlementFees" />
            </div>
            <div className="col-span-2 p-4 bg-[#D9EAF7] dark:bg-blue-900/10 flex items-center justify-center text-center">
              <EditableFee fieldKey="typicalTransactionSettlement" asTextArea />
            </div>
          </div>

          <div className="h-6 bg-white dark:bg-zinc-950 border-b border-gray-300 dark:border-zinc-800"></div> {/* Spacer */}

          {/* SECTION 2: Individuals and Small Business */}
          <div className="bg-[#D9EAF7] dark:bg-blue-900/30 px-4 py-2 border-b border-gray-300 dark:border-zinc-800">
            <span className="text-[12px] font-bold text-gray-900 dark:text-zinc-100">Individuals and Small Business</span>
          </div>
          <div className="grid grid-cols-12 border-b border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            {/* Description Cell */}
            <div className="col-span-8 p-4 border-r border-gray-300 dark:border-zinc-800 flex flex-col justify-center">
              <div className="text-[12px] font-bold text-gray-900 dark:text-zinc-100 uppercase mb-1">CURRENCY CONVERSION I JINBE</div>
              <div className="text-[12px] text-gray-800 dark:text-zinc-300">Fiat to Crypto, Crypto to Fiat, Fiat to Fiat, Crypto to Crypto</div>
              <div className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1">(E.g. Funds wired in Fiat exchanged to USDT)</div>
            </div>
            
            {/* Tiers & Fees */}
            <div className="col-span-4 flex flex-col">
              <div className="grid grid-cols-2 flex-1 border-b border-gray-300 dark:border-zinc-800">
                <div className="bg-[#D9EAF7] dark:bg-blue-900/20 p-3 border-r border-gray-300 dark:border-zinc-800 flex items-center text-[12px] font-bold text-gray-800 dark:text-zinc-200">
                  Up to $50K/ per month:
                </div>
                <div className="bg-[#D9EAF7] dark:bg-blue-900/10 p-3 flex items-center justify-center">
                  <EditableFee fieldKey="conversionSmallUpTo50k" />
                </div>
              </div>
              <div className="grid grid-cols-2 flex-1 border-b border-gray-300 dark:border-zinc-800">
                <div className="bg-[#D9EAF7] dark:bg-blue-900/20 p-3 border-r border-gray-300 dark:border-zinc-800 flex items-center text-[12px] font-bold text-gray-800 dark:text-zinc-200">
                  $50+K - $250K/ per month:
                </div>
                <div className="bg-[#D9EAF7] dark:bg-blue-900/10 p-3 flex items-center justify-center">
                  <EditableFee fieldKey="conversionSmall50kTo250k" />
                </div>
              </div>
              <div className="grid grid-cols-2 flex-1">
                <div className="bg-[#D9EAF7] dark:bg-blue-900/20 p-3 border-r border-gray-300 dark:border-zinc-800 flex items-center text-[12px] font-bold text-gray-800 dark:text-zinc-200">
                  $250K-$1M/ per month:
                </div>
                <div className="bg-[#D9EAF7] dark:bg-blue-900/10 p-3 flex items-center justify-center">
                  <EditableFee fieldKey="conversionSmall250kTo1m" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 border-b border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950">
             <div className="col-span-8 p-4 border-r border-gray-300 dark:border-zinc-800 flex flex-col justify-center">
              <div className="text-[12px] font-bold text-gray-900 dark:text-zinc-100 uppercase mb-1">CRYPTO/WIRE TRANSFER FEES PER TRANSACTION*</div>
              <div className="text-[11px] text-gray-500 dark:text-zinc-400">Merchant responsibility (E.g. Wire fee, ACH fee, gas fee)</div>
            </div>
            <div className="col-span-4 p-4 bg-[#D9EAF7] dark:bg-blue-900/20 flex items-center justify-start">
              <EditableFee fieldKey="wireTransferSmall" asTextArea labelClassName="text-[12px] text-gray-800 dark:text-zinc-200 leading-tight" />
            </div>
          </div>

          <div className="h-6 bg-white dark:bg-zinc-950 border-b border-gray-300 dark:border-zinc-800"></div> {/* Spacer */}

          {/* SECTION 3: High-Net Worth Individuals, Corporations and Institutions */}
          <div className="bg-[#D9EAF7] dark:bg-blue-900/30 px-4 py-2 border-b border-gray-300 dark:border-zinc-800">
            <span className="text-[12px] font-bold text-gray-900 dark:text-zinc-100">High-Net Worth Individuals, Corporations and Institutions</span>
          </div>
          <div className="grid grid-cols-12 border-b border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            {/* Description Cell */}
            <div className="col-span-8 p-4 border-r border-gray-300 dark:border-zinc-800 flex flex-col justify-center">
              <div className="text-[12px] font-bold text-gray-900 dark:text-zinc-100 uppercase mb-1">CURRENCY CONVERSION I JINBE</div>
              <div className="text-[12px] text-gray-800 dark:text-zinc-300">Fiat to Crypto, Crypto to Fiat, Fiat to Fiat, Crypto to Crypto</div>
              <div className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1">(E.g. Funds wired in Fiat exchanged to USDT)</div>
            </div>
            
            {/* Tiers & Fees */}
            <div className="col-span-4 flex flex-col">
              <div className="grid grid-cols-2 flex-1 border-b border-gray-300 dark:border-zinc-800">
                <div className="bg-[#D9EAF7] dark:bg-blue-900/20 p-3 border-r border-gray-300 dark:border-zinc-800 flex items-center text-[12px] font-bold text-gray-800 dark:text-zinc-200">
                  $1MM - $5 MM USD/per mth
                </div>
                <div className="bg-[#D9EAF7] dark:bg-blue-900/10 p-3 flex items-center justify-center">
                  <EditableFee fieldKey="conversionLarge1mTo5m" />
                </div>
              </div>
              <div className="grid grid-cols-2 flex-1 border-b border-gray-300 dark:border-zinc-800">
                <div className="bg-[#D9EAF7] dark:bg-blue-900/20 p-3 border-r border-gray-300 dark:border-zinc-800 flex items-center text-[12px] font-bold text-gray-800 dark:text-zinc-200">
                  $5MM - $10 MM USD/per mth
                </div>
                <div className="bg-[#D9EAF7] dark:bg-blue-900/10 p-3 flex items-center justify-center">
                  <EditableFee fieldKey="conversionLarge5mTo10m" />
                </div>
              </div>
              <div className="grid grid-cols-2 flex-1">
                <div className="bg-[#D9EAF7] dark:bg-blue-900/20 p-3 border-r border-gray-300 dark:border-zinc-800 flex items-center text-[12px] font-bold text-gray-800 dark:text-zinc-200">
                  $10MM and above/ per mth
                </div>
                <div className="bg-[#D9EAF7] dark:bg-blue-900/10 p-3 flex items-center justify-center">
                  <EditableFee fieldKey="conversionLarge10mPlus" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 bg-white dark:bg-zinc-950">
             <div className="col-span-8 p-4 border-r border-gray-300 dark:border-zinc-800 flex flex-col justify-center">
              <div className="text-[12px] font-bold text-gray-900 dark:text-zinc-100 uppercase mb-1">CRYPTO/WIRE TRANSFER FEES PER TRANSACTION*</div>
              <div className="text-[11px] text-gray-500 dark:text-zinc-400">Merchant responsibility (E.g. Wire fee, ACH fee, gas fee)</div>
            </div>
            <div className="col-span-4 p-4 bg-[#D9EAF7] dark:bg-blue-900/20 flex items-center justify-start rounded-br-sm shadow-inner">
              <EditableFee fieldKey="wireTransferLarge" asTextArea labelClassName="text-[12px] text-gray-800 dark:text-zinc-200 leading-tight" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
