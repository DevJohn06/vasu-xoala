"use client";

import React, { useState } from "react";
import { updateCryptoFee } from "@/app/admin/updateCryptoSettings";

export type CryptoFeesType = {
  payIn0to5?: string;
  payIn5to10?: string;
  payIn10plus?: string;
  payOut0to5?: string;
  payOut5to10?: string;
  payOut10plus?: string;
  topUp?: string;
  withdraw?: string;
  perTransaction?: string;
  miningFee?: string;
  fixedFees?: string;
};

export function CryptoRatesTable({
  cryptoFees,
  supportedCryptos,
  isEditable = false,
  pageSlug = "global"
}: {
  cryptoFees?: CryptoFeesType | null;
  supportedCryptos?: Array<{ id: string; ethereum: string; tron: string; blockchains: string }> | null;
  isEditable?: boolean;
  pageSlug?: string;
}) {
  const [isEditingCryptos, setIsEditingCryptos] = useState(false);

  const defaultFees = {
    payIn0to5: "1.40%",
    payIn5to10: "1.20%",
    payIn10plus: "0.95%",
    payOut0to5: "1.15%",
    payOut5to10: "1.05%",
    payOut10plus: "0.95%",
    topUp: "None",
    withdraw: "None",
    perTransaction: "None",
    miningFee: "Network-dependent passthrough",
    fixedFees: "Waived"
  };

  const getFee = (key: keyof CryptoFeesType) => {
    if (cryptoFees && cryptoFees[key] !== undefined) return cryptoFees[key];
    return defaultFees[key];
  };

  const EditableFee = ({ fieldKey, labelClassName = "text-[12px] font-medium text-gray-900 dark:text-zinc-100" }: { fieldKey: keyof CryptoFeesType, labelClassName?: string }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(getFee(fieldKey) || "");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
      setIsSaving(true);
      await updateCryptoFee(pageSlug, fieldKey, value);
      setIsSaving(false);
      setIsEditing(false);
    };

    if (!isEditable) {
      return <span className={labelClassName}>{getFee(fieldKey)}</span>;
    }

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-24 px-2 py-1 text-xs border border-blue-400 rounded focus:outline-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
            autoFocus
          />
          <button onClick={handleSave} disabled={isSaving} className="text-green-600 hover:text-green-700">
            {isSaving ? "..." : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
          </button>
          <button onClick={() => { setIsEditing(false); setValue(getFee(fieldKey) || ""); }} className="text-red-500 hover:text-red-700">
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

  const defaultCryptos = [
    { id: "1", ethereum: "USDT (Tether)", tron: "USDT (Tether)", blockchains: "BITCOIN" },
    { id: "2", ethereum: "USDC (Coin)", tron: "", blockchains: "ETHEREUM" },
    { id: "3", ethereum: "HUSD (Huobi)", tron: "", blockchains: "" },
    { id: "4", ethereum: "BUSD (Binance)", tron: "", blockchains: "" }
  ];

    const cryptos = supportedCryptos && supportedCryptos.length > 0 ? supportedCryptos : defaultCryptos;

  const EditableCryptosList = ({ initialCryptos, isEditable, pageSlug, isEditing, setIsEditing }: any) => {
    const [cryptosList, setCryptosList] = useState(initialCryptos);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
      setIsSaving(true);
      await import("@/app/admin/updateCryptoSettings").then(m => m.updateSupportedCryptos(pageSlug, cryptosList));
      setIsSaving(false);
      setIsEditing(false);
    };

    const handleChange = (id: string, field: string, val: string) => {
      setCryptosList((prev: any[]) => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
    };

    const addRow = () => {
      setCryptosList((prev: any[]) => [...prev, { id: Math.random().toString(), ethereum: "", tron: "", blockchains: "" }]);
    };

    const removeRow = (id: string) => {
      setCryptosList((prev: any[]) => prev.filter(c => c.id !== id));
    };

    if (!isEditable) {
      return (
        <div className="flex flex-col flex-1 bg-[#D9EAF7] dark:bg-blue-900/10">
          {cryptosList.map((c: any, i: number) => (
            <div key={c.id} className="grid grid-cols-3">
              <div className={`p-3 border-r border-gray-300 dark:border-zinc-800 text-[11px] text-gray-800 dark:text-zinc-200 ${i !== cryptosList.length - 1 ? 'border-b' : ''}`}>{c.ethereum}</div>
              <div className={`p-3 border-r border-gray-300 dark:border-zinc-800 text-[11px] text-gray-800 dark:text-zinc-200 ${i !== cryptosList.length - 1 ? 'border-b' : ''}`}>{c.tron}</div>
              <div className={`p-3 border-gray-300 dark:border-zinc-800 text-[11px] text-gray-800 dark:text-zinc-200 ${i !== cryptosList.length - 1 ? 'border-b' : ''}`}>{c.blockchains}</div>
            </div>
          ))}
        </div>
      );
    }

    if (isEditing) {
      return (
        <div className="flex flex-col flex-1 bg-[#D9EAF7] dark:bg-blue-900/10 relative pb-10">
          {cryptosList.map((c: any, i: number) => (
            <div key={c.id} className="grid grid-cols-[1fr_1fr_1fr_auto] items-center border-b border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <div className="p-1 border-r border-gray-300 dark:border-zinc-800">
                <input value={c.ethereum} onChange={e => handleChange(c.id, 'ethereum', e.target.value)} className="w-full text-[11px] p-1 bg-transparent border border-blue-200 focus:border-blue-500 outline-none rounded" />
              </div>
              <div className="p-1 border-r border-gray-300 dark:border-zinc-800">
                <input value={c.tron} onChange={e => handleChange(c.id, 'tron', e.target.value)} className="w-full text-[11px] p-1 bg-transparent border border-blue-200 focus:border-blue-500 outline-none rounded" />
              </div>
              <div className="p-1 border-r border-gray-300 dark:border-zinc-800">
                <input value={c.blockchains} onChange={e => handleChange(c.id, 'blockchains', e.target.value)} className="w-full text-[11px] p-1 bg-transparent border border-blue-200 focus:border-blue-500 outline-none rounded" />
              </div>
              <div className="p-1 flex items-center justify-center w-8">
                <button onClick={() => removeRow(c.id)} className="text-red-500 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>
          ))}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gray-50 dark:bg-zinc-900 flex justify-between items-center border-t border-gray-300 dark:border-zinc-800">
            <button onClick={addRow} className="text-[11px] flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add Row
            </button>
            <div className="flex gap-2">
              <button onClick={() => { setCryptosList(initialCryptos); setIsEditing(false); }} className="text-[11px] px-2 py-1 text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
              <button onClick={handleSave} disabled={isSaving} className="text-[11px] px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">{isSaving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col flex-1 bg-[#D9EAF7] dark:bg-blue-900/10 relative">
        {cryptosList.map((c: any, i: number) => (
          <div key={c.id} className="grid grid-cols-3">
            <div className={`p-3 border-r border-gray-300 dark:border-zinc-800 text-[11px] text-gray-800 dark:text-zinc-200 ${i !== cryptosList.length - 1 ? 'border-b' : ''}`}>{c.ethereum}</div>
            <div className={`p-3 border-r border-gray-300 dark:border-zinc-800 text-[11px] text-gray-800 dark:text-zinc-200 ${i !== cryptosList.length - 1 ? 'border-b' : ''}`}>{c.tron}</div>
            <div className={`p-3 border-gray-300 dark:border-zinc-800 text-[11px] text-gray-800 dark:text-zinc-200 ${i !== cryptosList.length - 1 ? 'border-b' : ''}`}>{c.blockchains}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Container */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Left Side: Transaction Description & Fees */}
        <div className="w-full xl:w-2/3 border border-gray-300 dark:border-zinc-800 rounded-sm overflow-hidden shadow-sm bg-white dark:bg-zinc-950 flex flex-col">
          {/* Header */}
          <div className="bg-[#003366] border-b border-gray-300 dark:border-zinc-800 px-4 py-3 flex items-center justify-center relative">
            <h3 className="text-[13px] font-bold text-white uppercase tracking-wide text-center">
              COZENI FIAT-CRYPTO SOLUTION: PAY-IN/PAY-OUT
            </h3>
            {isEditable && (
               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded border border-blue-500/30">Admin Edit Mode</span>
            )}
          </div>

          {/* Subheader */}
          <div className="grid grid-cols-12 bg-[#E6F0FA] dark:bg-blue-900/20 border-b border-gray-300 dark:border-zinc-800">
            <div className="col-span-8 px-4 py-2 flex items-center justify-center border-r border-gray-300 dark:border-zinc-800">
              <span className="text-[11px] font-bold text-gray-900 dark:text-zinc-200 uppercase tracking-wide">
                TRANSACTION DESCRIPTION
              </span>
            </div>
            <div className="col-span-4 px-4 py-2 flex items-center justify-center">
              <span className="text-[11px] font-bold text-gray-900 dark:text-zinc-200 uppercase tracking-wide">
                FEES
              </span>
            </div>
          </div>

          {/* Content Rows */}
          <div className="flex flex-col divide-y divide-gray-200 dark:divide-zinc-800">
            
            {/* PAY-IN */}
            <div className="grid grid-cols-12 min-h-[100px]">
              <div className="col-span-8 p-4 border-r border-gray-200 dark:border-zinc-800">
                <div className="font-bold text-[12px] text-gray-900 dark:text-zinc-100 mb-2">PAY-IN</div>
                <div className="text-[12px] text-gray-800 dark:text-zinc-300 mb-2">Accepting Crypto from customers</div>
                <div className="text-[11px] text-gray-600 dark:text-zinc-400">
                  (E.g. Merchant website allows for payment in crypto (gaming, adult, IPTV, etc.) acquiring)
                </div>
              </div>
              <div className="col-span-4 flex flex-col">
                <div className="grid grid-cols-2 flex-1 border-b border-gray-200 dark:border-zinc-800 bg-[#D9EAF7] dark:bg-blue-900/30">
                  <div className="p-2 flex items-center text-[11px] text-gray-800 dark:text-zinc-200 border-r border-gray-200 dark:border-zinc-800">$0-5 mil per month:</div>
                  <div className="p-2 flex items-center justify-center">
                    <EditableFee fieldKey="payIn0to5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 flex-1 border-b border-gray-200 dark:border-zinc-800 bg-[#D9EAF7] dark:bg-blue-900/30">
                  <div className="p-2 flex items-center text-[11px] text-gray-800 dark:text-zinc-200 border-r border-gray-200 dark:border-zinc-800">$5-10 mil per month:</div>
                  <div className="p-2 flex items-center justify-center">
                    <EditableFee fieldKey="payIn5to10" />
                  </div>
                </div>
                <div className="grid grid-cols-2 flex-1 bg-[#D9EAF7] dark:bg-blue-900/30">
                  <div className="p-2 flex items-center text-[11px] text-gray-800 dark:text-zinc-200 border-r border-gray-200 dark:border-zinc-800">$10+ mil per month:</div>
                  <div className="p-2 flex items-center justify-center">
                    <EditableFee fieldKey="payIn10plus" />
                  </div>
                </div>
              </div>
            </div>

            {/* PAY-OUT */}
            <div className="grid grid-cols-12 min-h-[100px]">
              <div className="col-span-8 p-4 border-r border-gray-200 dark:border-zinc-800">
                <div className="font-bold text-[12px] text-gray-900 dark:text-zinc-100 mb-2">PAY-OUT</div>
                <div className="text-[12px] text-gray-800 dark:text-zinc-300 mb-2">Sending crypto to customers, employees, Gig-economy</div>
                <div className="text-[11px] text-gray-600 dark:text-zinc-400">
                  (E.g. OnlyFans models, casino players winnings, forex traders, flight attendants)
                </div>
              </div>
              <div className="col-span-4 flex flex-col">
                <div className="grid grid-cols-2 flex-1 border-b border-gray-200 dark:border-zinc-800 bg-[#D9EAF7] dark:bg-blue-900/30">
                  <div className="p-2 flex items-center text-[11px] text-gray-800 dark:text-zinc-200 border-r border-gray-200 dark:border-zinc-800">$0-5 mil per month:</div>
                  <div className="p-2 flex items-center justify-center">
                    <EditableFee fieldKey="payOut0to5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 flex-1 border-b border-gray-200 dark:border-zinc-800 bg-[#D9EAF7] dark:bg-blue-900/30">
                  <div className="p-2 flex items-center text-[11px] text-gray-800 dark:text-zinc-200 border-r border-gray-200 dark:border-zinc-800">$5-10 mil per month:</div>
                  <div className="p-2 flex items-center justify-center">
                    <EditableFee fieldKey="payOut5to10" />
                  </div>
                </div>
                <div className="grid grid-cols-2 flex-1 bg-[#D9EAF7] dark:bg-blue-900/30">
                  <div className="p-2 flex items-center text-[11px] text-gray-800 dark:text-zinc-200 border-r border-gray-200 dark:border-zinc-800">$10+ mil per month:</div>
                  <div className="p-2 flex items-center justify-center">
                    <EditableFee fieldKey="payOut10plus" />
                  </div>
                </div>
              </div>
            </div>

            {/* TOP-UP */}
            <div className="grid grid-cols-12 min-h-[50px] bg-white dark:bg-zinc-950">
              <div className="col-span-8 p-4 border-r border-gray-200 dark:border-zinc-800 flex items-center">
                <div className="text-[12px] text-gray-900 dark:text-zinc-100">
                  <span className="font-bold">TOP-UP:</span> Merchant adding funds to Cozeni Wallet
                </div>
              </div>
              <div className="col-span-4 bg-[#D9EAF7] dark:bg-blue-900/30 flex items-center justify-start p-4 w-full">
                <EditableFee fieldKey="topUp" />
              </div>
            </div>

            {/* WITHDRAW */}
            <div className="grid grid-cols-12 min-h-[50px] bg-white dark:bg-zinc-950">
              <div className="col-span-8 p-4 border-r border-gray-200 dark:border-zinc-800 flex items-center">
                <div className="text-[12px] text-gray-900 dark:text-zinc-100">
                  <span className="font-bold">WITHDRAW:</span> Merchant withdrawing funds to merchant wallet or bank account
                </div>
              </div>
              <div className="col-span-4 bg-[#D9EAF7] dark:bg-blue-900/30 flex items-center justify-start p-4 w-full">
                <EditableFee fieldKey="withdraw" />
              </div>
            </div>

            {/* PER TRANSACTION */}
            <div className="grid grid-cols-12 min-h-[50px] bg-white dark:bg-zinc-950">
              <div className="col-span-8 p-4 border-r border-gray-200 dark:border-zinc-800 flex items-center">
                <div className="font-bold text-[12px] text-gray-900 dark:text-zinc-100">PER TRANSACTION</div>
              </div>
              <div className="col-span-4 bg-[#D9EAF7] dark:bg-blue-900/30 flex items-center justify-start p-4 w-full">
                <EditableFee fieldKey="perTransaction" />
              </div>
            </div>

            {/* MINING FEE */}
            <div className="grid grid-cols-12 min-h-[80px] bg-white dark:bg-zinc-950">
              <div className="col-span-8 p-4 border-r border-gray-200 dark:border-zinc-800 flex flex-col justify-center">
                <div className="font-bold text-[12px] text-gray-900 dark:text-zinc-100 mb-1">MINING FEE PER TRANSACTION*</div>
                <div className="text-[12px] text-gray-800 dark:text-zinc-300">Merchant responsibility (E.g. Wire fee, ACH fee, gas fee)</div>
              </div>
              <div className="col-span-4 bg-[#D9EAF7] dark:bg-blue-900/30 flex items-center justify-start p-4 w-full">
                <EditableFee fieldKey="miningFee" />
              </div>
            </div>

            {/* FIXED FEES */}
            <div className="grid grid-cols-12 min-h-[50px] bg-white dark:bg-zinc-950">
              <div className="col-span-8 p-4 border-r border-gray-200 dark:border-zinc-800 flex items-center">
                <div className="text-[12px] text-gray-900 dark:text-zinc-100">
                  <span className="font-bold">FIXED FEES:</span> Monthly Gateway Fee, Setup Fee, and Annual Fee
                </div>
              </div>
              <div className="col-span-4 bg-[#D9EAF7] dark:bg-blue-900/30 flex items-center justify-start p-4 w-full">
                <EditableFee fieldKey="fixedFees" />
              </div>
            </div>

            {/* Footer Note */}
            <div className="grid grid-cols-12 min-h-[50px] bg-[#D9EAF7] dark:bg-blue-900/30">
              <div className="col-span-12 p-4 flex items-center">
                <div className="font-bold text-[11px] text-gray-900 dark:text-zinc-100">
                  ***The merchant is fully responsible for the monitoring and maintaining a Mining Fee Balance respective of each blockchain network being utilized.
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Supported Cryptocurrencies */}
        <div className="w-full xl:w-1/3 border border-gray-300 dark:border-zinc-800 rounded-sm overflow-hidden shadow-sm bg-[#E6F0FA] dark:bg-blue-900/20 flex flex-col h-fit">
          <div className="bg-[#E6F0FA] dark:bg-blue-900/40 border-b border-gray-300 dark:border-zinc-800 px-4 py-3 flex items-center justify-center relative">
            <h3 className="text-[11px] font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-wide text-center">
              SUPPORTED CRYPTOCURRENCIES
            </h3>
            {isEditable && !isEditingCryptos && (
              <button onClick={() => setIsEditingCryptos(true)} className="absolute right-3 bg-white dark:bg-zinc-800 p-1.5 rounded shadow-sm border border-gray-200 dark:border-zinc-700 text-gray-500 hover:text-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 border-b border-gray-300 dark:border-zinc-800 bg-[#E6F0FA] dark:bg-blue-900/30">
            <div className="p-3 flex items-center justify-center border-r border-gray-300 dark:border-zinc-800 text-center">
              <span className="text-[10px] font-bold text-gray-900 dark:text-zinc-200 uppercase">ETHEREUM (ERC20)</span>
            </div>
            <div className="p-3 flex items-center justify-center border-r border-gray-300 dark:border-zinc-800 text-center">
              <span className="text-[10px] font-bold text-gray-900 dark:text-zinc-200 uppercase">TRON (TRC20)</span>
            </div>
            <div className="p-3 flex items-center justify-center text-center">
              <span className="text-[10px] font-bold text-gray-900 dark:text-zinc-200 uppercase">BLOCKCHAINS</span>
            </div>
          </div>

          <EditableCryptosList initialCryptos={cryptos} isEditable={isEditable} pageSlug={pageSlug} isEditing={isEditingCryptos} setIsEditing={setIsEditingCryptos} />
          
          <div className="p-3 border-t border-gray-300 dark:border-zinc-800 bg-[#D9EAF7] dark:bg-blue-900/10">
             <div className="text-[11px] text-gray-800 dark:text-zinc-200">Plus+ any ERC20 token</div>
          </div>

        </div>

      </div>
    </section>
  );
}
