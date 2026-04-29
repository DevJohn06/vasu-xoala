"use client";

import React, { useState } from "react";

const TABS = [
  { id: "apms", label: "APMs", isLocked: false },
  { id: "offshore", label: "Offshore Credit Card", isLocked: false },
  { id: "crypto", label: "Crypto Solution", isLocked: true },
  { id: "otc", label: "OTC Desk", isLocked: true },
];

export function PricingTabsWrapper({ 
  children,
  offshoreContent
}: { 
  children?: React.ReactNode;
  offshoreContent?: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("apms");

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Tabs Navigation */}
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 mt-6 mb-2">
        <div className="flex flex-wrap items-center gap-2 md:gap-4 border-b border-gray-200 dark:border-zinc-800 pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative flex items-center gap-2 px-4 py-3 text-sm md:text-base font-semibold rounded-t-xl transition-all duration-300
                ${activeTab === tab.id 
                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10 border-b-2 border-emerald-500" 
                  : "text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50 border-b-2 border-transparent"}
              `}
            >
              {tab.isLocked && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              )}
              {tab.label}
              {tab.isLocked && (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 ml-1 transition-transform group-hover:translate-y-[1px]">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full relative min-h-[400px]">
        {activeTab === "apms" ? (
          <div className="animate-in fade-in zoom-in-95 duration-500 w-full">
            {children}
          </div>
        ) : activeTab === "offshore" ? (
          <div className="animate-in fade-in zoom-in-95 duration-500 w-full">
            {offshoreContent}
          </div>
        ) : (
          <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-900/30 backdrop-blur-sm shadow-sm relative overflow-hidden">
              
              {/* Background ambient lock icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="absolute opacity-[0.03] dark:opacity-[0.05] text-emerald-500 scale-150 rotate-[-10deg]">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>

              <div className="h-16 w-16 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-md border border-gray-100 dark:border-zinc-700 relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-zinc-500">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 mb-3 relative z-10">Premium Feature Locked</h3>
              <p className="text-gray-500 dark:text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed relative z-10">
                This pricing table is currently restricted. Please contact your account manager or support team to request access to the {TABS.find(t => t.id === activeTab)?.label} channel.
              </p>
              
              <button className="relative z-10 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
