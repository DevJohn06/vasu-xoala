import Image from "next/image";
import { RatesTable, type RateRowType } from "@/components/RatesTable";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { db } from "@/db";
import { rates, pageSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MOCK_RATES } from "@/data/mock-rates";
import { FeesTables } from "@/components/FeesTables";
import { PricingTabsWrapper } from "@/components/PricingTabsWrapper";

export default async function Home() {
  let dbRates: RateRowType[] = [];

  try {
    dbRates = await db.select().from(rates).where(eq(rates.pageSlug, "general-rates"));
  } catch (err) {
    console.error("Failed to fetch rates from Turso:", err);
  }

  // Fallback to MOCK_RATES to maintain preview if DB is empty or missing table.
  const displayRates: RateRowType[] = (dbRates && dbRates.length > 0) ? dbRates : MOCK_RATES;

  let feesSettingsData = null;
  try {
    const feesSettingsArr = await db.select().from(pageSettings).where(eq(pageSettings.pageSlug, "global")).limit(1);
    feesSettingsData = feesSettingsArr.length > 0 ? feesSettingsArr[0] : null;
  } catch (err) {
    console.error("Failed to fetch fees settings:", err);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] font-sans selection:bg-emerald-500/30">

      {/* Background ambient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px]" />
      </div>

      {/* Header / Nav */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center">
            <Image src="/vasu-logo.png" alt="Vasu" width={120} height={36} priority />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center pt-24 pb-16">

        {/* Hero Section */}
        <section className="w-full max-w-4xl mx-auto px-4 text-center mb-8">
          <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
            Accepting New Clients for 2026
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            Channels & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-500">Rates</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Transparent pricing for our core services. Everything you need to scale your impact, expertly delivered.
            <br className="hidden md:block" /> Custom requirements are quoted upon request.
          </p>
        </section>

        <PricingTabsWrapper>
          {/* Rates Component */}
          <RatesTable rates={displayRates} />

          {/* Global Fees Configuration */}
          <FeesTables data={feesSettingsData} />
        </PricingTabsWrapper>

      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col items-center text-center">
          <div className="mb-6 opacity-40 grayscale">
            <Image src="/vasu-logo.png" alt="Vasu" width={80} height={24} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Vasu Inc. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-zinc-600 mt-2 max-w-md">
            This is the default public entry template for Vasu's services. Standard retail pricing details, generic offerings, and organizational capabilities are published here.
          </p>
        </div>
      </footer>

    </div>
  );
}
