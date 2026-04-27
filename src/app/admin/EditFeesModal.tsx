"use client"

import { useState, useTransition, useEffect } from "react"
import { updateFeesSettings } from "./actions"

type FeesData = {
  tpsFees?: {
    minimumTransactionFee: string;
    additionalLegalTerms: string;
  } | null;
  typFees?: {
    clientsCurrencies: string;
    mccCode: string;
    traffic: string;
    processingFees: string;
    fxCalculationText: string;
    fxRates: Array<{ currencies: string; rate: string }>;
  } | null;
}

export default function EditFeesModal({ targetSlug, initialData }: { targetSlug: string, initialData?: FeesData | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<'tps' | 'typ'>('tps')

  const [fxRates, setFxRates] = useState<Array<{ currencies: string; rate: string }>>(
    initialData?.typFees?.fxRates || []
  )

  useEffect(() => {
    if (isOpen) {
      setFxRates(initialData?.typFees?.fxRates || [])
    }
  }, [isOpen, initialData])

  const addFxRateRow = () => {
    setFxRates([...fxRates, { currencies: "", rate: "" }])
  }

  const removeFxRateRow = (index: number) => {
    setFxRates(fxRates.filter((_, i) => i !== index))
  }

  const handleFxRateChange = (index: number, field: 'currencies' | 'rate', value: string) => {
    const newRates = [...fxRates]
    newRates[index][field] = value
    setFxRates(newRates)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Edit Fees Config
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-3xl shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50">Fees Configuration</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="flex border-b border-gray-100 dark:border-zinc-800">
              <button 
                onClick={() => setActiveTab('tps')}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'tps' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Premium LATAM (TPS)
              </button>
              <button 
                onClick={() => setActiveTab('typ')}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'typ' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                P2P Operating (TYP)
              </button>
            </div>

            <div className="overflow-y-auto flex-grow p-6">
              <form id="fees-form" action={(formData) => {
                formData.append("pageSlug", targetSlug)
                formData.append("typFxRates", JSON.stringify(fxRates))
                startTransition(() => {
                  updateFeesSettings(formData).then(() => {
                    setIsOpen(false)
                  })
                })
              }}>
                <div className={activeTab === 'tps' ? 'space-y-4' : 'hidden'}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Minimum Transaction Fee / Refund Fee</label>
                    <textarea 
                      name="tpsMinimumTransactionFee" 
                      defaultValue={initialData?.tpsFees?.minimumTransactionFee || "$1 USD/$10 USD (respectively)"}
                      className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Additional Legal Terms</label>
                    <textarea 
                      name="tpsAdditionalLegalTerms" 
                      defaultValue={initialData?.tpsFees?.additionalLegalTerms || "FOR/AS IOF (international bank transaction tax):\n*For Brazil, an additional 0.38% will be charged.\n*For Colombia, an additional 0.4% will be charged.\n*For Ecuador, an additional 5.00% will be charged"}
                      className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                    />
                  </div>
                </div>

                <div className={activeTab === 'typ' ? 'space-y-4' : 'hidden'}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Clients' Currencies</label>
                    <textarea 
                      name="typClientsCurrencies" 
                      defaultValue={initialData?.typFees?.clientsCurrencies || "JOD,KZT,UAH,UZS,TJS, PKR, EGP,KGS, INR, AED, TRY, ARS, IQD, BHD, SAR, BDT, RUB, AZS"}
                      className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">MCC-Code</label>
                      <input 
                        type="text"
                        name="typMccCode" 
                        defaultValue={initialData?.typFees?.mccCode || "Not assigned, P2P only"}
                        className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Traffic</label>
                      <input 
                        type="text"
                        name="typTraffic" 
                        defaultValue={initialData?.typFees?.traffic || "Primary and Secondary is acceptable"}
                        className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Processing Fees</label>
                    <input 
                      type="text"
                      name="typProcessingFees" 
                      defaultValue={initialData?.typFees?.processingFees || "Per transaction basis"}
                      className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                    <h4 className="font-bold text-gray-900 dark:text-zinc-100 mb-2">FX Calculation</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Description</label>
                      <textarea 
                        name="typFxCalculationText" 
                        defaultValue={initialData?.typFees?.fxCalculationText || "FX Calculation: ***As defined in the table below, when performing operations, as it relates to the associated FX rates to be charged, the baseline amounts are determined on a daily basis from a variety of public p2p resources such as binance, bestchange, wazirx, garantex (local market dependent). The total variation of exchange rate difference (for input and output) for the different currencies, will be no more than:"}
                        className="w-full rounded-xl border border-gray-200 dark:border-zinc-800 px-4 py-3 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">FX Rates Map</label>
                        <button type="button" onClick={addFxRateRow} className="text-xs text-indigo-600 hover:underline">
                          + Add Row
                        </button>
                      </div>
                      
                      {fxRates.length === 0 ? (
                        <p className="text-sm text-gray-500 py-2">No FX rates defined. Add one.</p>
                      ) : (
                        <div className="space-y-2">
                          {fxRates.map((r, i) => (
                            <div key={i} className="flex gap-2 items-center">
                              <input 
                                type="text"
                                placeholder="Currencies (e.g. ARS, INR)"
                                value={r.currencies}
                                onChange={e => handleFxRateChange(i, 'currencies', e.target.value)}
                                className="flex-1 rounded-lg border border-gray-200 dark:border-zinc-800 px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100"
                              />
                              <input 
                                type="text"
                                placeholder="Rate (e.g. 6.5%)"
                                value={r.rate}
                                onChange={e => handleFxRateChange(i, 'rate', e.target.value)}
                                className="w-32 rounded-lg border border-gray-200 dark:border-zinc-800 px-3 py-2 text-sm bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100"
                              />
                              <button type="button" onClick={() => removeFxRateRow(i)} className="p-2 text-red-500 hover:text-red-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3 bg-gray-50 dark:bg-zinc-900">
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="fees-form"
                disabled={isPending}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Save Config"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
