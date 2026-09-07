"use client";

import React, { useState } from "react";

const TABS = [
  { id: "apms", label: "APMs" },
  { id: "offshore", label: "Offshore Credit Card" },
  { id: "crypto", label: "Crypto Solution" },
  { id: "otc", label: "OTC Desk" },
];

export function PricingTabsWrapper({ 
  children,
  offshoreContent,
  cryptoContent,
  otcContent
}: { 
  children?: React.ReactNode;
  offshoreContent?: React.ReactNode;
  cryptoContent?: React.ReactNode;
  otcContent?: React.ReactNode;
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
              {tab.label}
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
        ) : activeTab === "crypto" ? (
          <div className="animate-in fade-in zoom-in-95 duration-500 w-full">
            {cryptoContent}
          </div>
        ) : activeTab === "otc" ? (
          <div className="animate-in fade-in zoom-in-95 duration-500 w-full">
            {otcContent}
          </div>
        ) : null}
      </div>

    </div>
  );
}
