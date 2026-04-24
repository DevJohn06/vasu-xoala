import { db } from "@/db"
import { rates } from "@/db/schema"
import { createRate, deleteRate, updateRate } from "./actions"
import Link from "next/link"
import RatesForm from "./RatesForm"
import EditRateModal from "./EditRateModal"
import RateSearchInput from "./RateSearchInput"
import UploadRatesModal from "./UploadRatesModal"
import CloneDirectButton from "./CloneDirectButton"
import { desc, eq } from "drizzle-orm"
import { COUNTRIES } from "@/data/countries"

const getCountryFlag = (countryName: string) => {
  const match = COUNTRIES.find(c => c.name === countryName);
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

export default async function RatesPanel({ targetSlug, editRateId, rateQ, rateTab }: { targetSlug?: string, editRateId?: string, rateQ?: string, rateTab?: string } = {}) {
  const activeSlug = targetSlug ? targetSlug : (rateTab === 'reseller' ? 'general-rates' : 'general-rates-direct');
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

  return (
    <div className={`space-y-6 ${!targetSlug ? "pt-8 border-t border-gray-200 dark:border-zinc-800" : ""}`}>
      {editingRate && <EditRateModal rate={editingRate} />}
      <div className="flex justify-between items-center px-1 mb-6">
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

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <h4 className="text-md font-semibold text-gray-900 dark:text-zinc-50 mb-4">Add New Rate Row</h4>
        <RatesForm defaultSlug={activeSlug} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between px-1 gap-4">
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
        <div className="flex items-center gap-3">
          {!targetSlug && rateTab === 'reseller' && (
            <CloneDirectButton />
          )}
          <RateSearchInput />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] whitespace-nowrap">
            <thead className="bg-gray-50/50 dark:bg-zinc-800/50 text-[10px] uppercase text-gray-500 dark:text-zinc-400 font-semibold tracking-wider border-b border-gray-100 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left">Actions</th>
                <th className="px-4 py-3 text-left">Country/Cur</th>
                <th className="px-4 py-3 text-left">Channel Code</th>
                <th className="px-4 py-3 text-left">Method</th>
                <th className="px-4 py-3 text-left">Verticals</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Deposit</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Dep. Limit</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Withdrawal</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">W/D Limit</th>
                <th className="px-4 py-3 text-left">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {displayedRates.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-6 text-center text-gray-400">No rates configured in table layer.</td></tr>
              ) : null}
              {displayedRates.map((rate) => (
                  <tr key={rate.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex justify-start items-center gap-1.5">
                        <Link href={`?editRateId=${rate.id}`} className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-500/10 rounded" title="Edit">
                           <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </Link>
                        <form action={deleteRate}>
                          <input type="hidden" name="id" value={rate.id} />
                          <button type="submit" className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-500/10 transition-colors rounded" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </form>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100" title={rate.country}>
                      <span className="text-2xl mr-1.5 drop-shadow-sm leading-none align-middle">{getCountryFlag(rate.country || "")}</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{rate.currency}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500 dark:text-gray-400 text-[10px]">{rate.channelCode || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.paymentMethod}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-[120px] truncate" title={rate.verticals || ''}>{rate.verticals || '-'}</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-medium min-w-[150px] max-w-[220px] whitespace-normal align-top leading-relaxed">{formatText(rate.deposit) || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-[150px] whitespace-normal align-top leading-relaxed">{rate.depositLimit || '-'}</td>
                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-medium min-w-[150px] max-w-[220px] whitespace-normal align-top leading-relaxed">{formatText(rate.withdrawal) || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-[150px] whitespace-normal leading-relaxed">{rate.withdrawalLimit || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rate.settlementTerms || '-'} <br/><span className="text-[10px] text-gray-400">{rate.settlementCycle || '-'}</span></td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
