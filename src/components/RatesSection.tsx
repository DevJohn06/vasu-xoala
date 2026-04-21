"use client";

import React, { useMemo } from "react";
import { MOCK_RATES } from "@/data/mock-rates";
import { RateCard } from "./ui/RateCard";

export function RatesSection() {
  // Group rates by category dynamically. 
  // Once wired to Sanity, this grouping logic can still apply,
  // or Sanity can pre-group them.
  const groupedRates = useMemo(() => {
    return MOCK_RATES.reduce((acc, rate) => {
      const country = rate.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(rate);
      return acc;
    }, {} as Record<string, typeof MOCK_RATES>);
  }, []);

  const countries = Object.keys(groupedRates).sort();

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="space-y-24">
        {countries.map((country) => (
          <div key={country} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="border-b border-gray-200 dark:border-zinc-800 pb-4">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-zinc-100 flex items-center gap-3">
                <span className="text-emerald-500 font-light">{'//'}</span>
                {country}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedRates[country].map((rate) => (
                <RateCard key={rate.id} rate={rate} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
