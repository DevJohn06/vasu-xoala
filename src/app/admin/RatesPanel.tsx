import { db } from "@/db"
import { rates, pageSettings } from "@/db/schema"
import { createRate, deleteRate, updateRate } from "./actions"
import Link from "next/link"
import AddRateModal from "./AddRateModal"
import EditRateModal from "./EditRateModal"
import RateSearchInput from "./RateSearchInput"
import UploadRatesModal from "./UploadRatesModal"
import EditFeesModal from "./EditFeesModal"
import CloneDirectButton from "./CloneDirectButton"
import { FeesTables } from "@/components/FeesTables"
import PurgeRatesButton from "./PurgeRatesButton"
import { desc, eq } from "drizzle-orm"
import { COUNTRIES } from "@/data/countries"

const getCountryFlag = (countryName: string) => {
  const match = COUNTRIES.find(c => c.name === countryName);
  if (match?.code) {
    return (
      <img 
        src={`https://flagcdn.com/w40/${match.code}.png`} 
        srcSet={`https://flagcdn.com/w80/${match.code}.png 2x`} 
        width="24" 
        alt={match.name} 
        className="inline-block object-cover shadow-sm rounded-[2px]" 
      />
    );
  }
  return match?.flag || "🏳️";
};

const formatText = (text?: string | null) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      {i !== text.split('\n').length - 1 && <br />}
    </span>
  ));
};

import RatesPanelTable from "./RatesPanelTable"

export default async function RatesPanel({ targetSlug, editRateId, rateQ, rateTab }: { targetSlug?: string, editRateId?: string, rateQ?: string, rateTab?: string } = {}) {
  const activeSlug = targetSlug ? targetSlug : (rateTab === 'reseller' ? 'general-rates-reseller' : 'general-rates-direct');
  const query = db.select().from(rates).where(eq(rates.pageSlug, activeSlug)).orderBy(desc(rates.id));
  const allRates = await query;
  
  let displayedRates = allRates;
  if (rateQ) {
    const lowercaseQ = rateQ.toLowerCase();
    displayedRates = allRates.filter(r => 
      (r.country && r.country.toLowerCase().includes(lowercaseQ)) ||
      (r.currency && r.currency.toLowerCase().includes(lowercaseQ)) ||
      (r.paymentMethod && r.paymentMethod.toLowerCase().includes(lowercaseQ)) ||
      (r.channelCode && r.channelCode.toLowerCase().includes(lowercaseQ)) ||
      (r.verticals && r.verticals.toLowerCase().includes(lowercaseQ))
    );
  }

  const editingRate = editRateId ? allRates.find(r => r.id.toString() === editRateId) : null;

  const feesSettings = await db.select().from(pageSettings).where(eq(pageSettings.pageSlug, activeSlug)).limit(1);
  const initialFeesData = feesSettings.length > 0 ? feesSettings[0] : null;

  return (
    <div className={`w-full space-y-6 ${!targetSlug ? "pt-8 border-t border-gray-200 dark:border-zinc-800" : ""}`}>
      {editingRate && <EditRateModal rate={editingRate} />}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50 mb-1">
            {!targetSlug ? (rateTab === 'reseller' ? "Reseller Rates Configuration" : "Direct Rates Configuration") : "Personalized Rate Profile"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {!targetSlug 
              ? 'Configure the global default rate table rows acting as the master fallback.'
              : 'Add, edit, or override specific rate rows exclusively for this user instance.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <UploadRatesModal targetSlug={activeSlug} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {!targetSlug && (
            <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg w-fit">
              <Link scroll={false} href="?rateTab=direct" className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${rateTab !== 'reseller' ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Direct Rates</Link>
              <Link scroll={false} href="?rateTab=reseller" className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${rateTab === 'reseller' ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-gray-100' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Reseller Rates</Link>
            </div>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {displayedRates.length} row{displayedRates.length !== 1 ? "s" : ""}
            {rateQ ? ` matching "${rateQ}"` : ` total`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AddRateModal targetSlug={activeSlug} />
          {!targetSlug && rateTab === 'reseller' && (
            <CloneDirectButton />
          )}
          <RateSearchInput />
        </div>
      </div>

      <RatesPanelTable
        rates={displayedRates}
        targetSlug={targetSlug}
        activeSlug={activeSlug}
      />

      <div className="mt-8 border-t border-gray-200 dark:border-zinc-800 pt-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-zinc-50 mb-2">
              {!targetSlug ? "Global Fee Configuration Tables" : "User Fee Configuration Tables"}
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {!targetSlug 
                ? "These global fee tables serve as the default structure. Editing these will not affect users who already have their own independent configurations."
                : "These fee tables are specific to this user instance. They are independent of the global configuration."}
            </p>
          </div>
          <EditFeesModal targetSlug={activeSlug} initialData={initialFeesData} />
        </div>
          <FeesTables data={initialFeesData} />
        </div>
    </div>
  )
}
