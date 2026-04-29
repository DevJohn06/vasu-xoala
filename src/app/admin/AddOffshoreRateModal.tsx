"use client"

import { useState } from "react"
import OffshoreRatesForm from "./OffshoreRatesForm"

export default function AddOffshoreRateModal({ targetSlug, fixedCategory }: { targetSlug?: string, fixedCategory?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200 shadow-sm group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-200">
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Add Offshore Rate
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          {/* Modal */}
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-800 w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900 z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                Add New Offshore Rate Row
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-zinc-50 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <OffshoreRatesForm defaultSlug={targetSlug} fixedCategory={fixedCategory} />
            </div>

          </div>
        </div>
      )}
    </>
  )
}
