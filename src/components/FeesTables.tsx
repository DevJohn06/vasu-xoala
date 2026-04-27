import React from "react";

type FeesData = {
  tpsFees?: {
    minimumTransactionFee?: string;
    additionalLegalTerms?: string;
  } | null;
  typFees?: {
    clientsCurrencies?: string;
    mccCode?: string;
    traffic?: string;
    processingFees?: string;
    fxCalculationText?: string;
    fxRates?: Array<{ currencies: string; rate: string }>;
  } | null;
}

const DEFAULT_TPS = {
  minimumTransactionFee: "$1 USD/$10 USD (respectively)",
  additionalLegalTerms: "FOR/AS IOF (international bank transaction tax):\n*For Brazil, an additional 0.38% will be charged.\n*For Colombia, an additional 0.4% will be charged.\n*For Ecuador, an additional 5.00% will be charged"
};

const DEFAULT_TYP = {
  clientsCurrencies: "JOD,KZT,UAH,UZS,TJS, PKR, EGP,KGS, INR, AED, TRY, ARS, IQD, BHD, SAR, BDT, RUB, AZS",
  mccCode: "Not assigned, P2P only",
  traffic: "Primary and Secondary is acceptable",
  processingFees: "Per transaction basis",
  fxCalculationText: "FX Calculation: ***As defined in the table below, when performing operations, as it relates to the associated FX rates to be charged, the baseline amounts are determined on a daily basis from a variety of public p2p resources such as binance, bestchange, wazirx, garantex (local market dependent). The total variation of exchange rate difference (for input and output) for the different currencies, will be no more than:",
  fxRates: [
    { currencies: "ARS, INR, JOD, RUB", rate: "6.5%" },
    { currencies: "KZT, PKR, KGS, UAH,UZS, AED", rate: "5.5%" },
    { currencies: "TJS, EGP, TRY, IQD, SAR, BDT, BHD, AZS", rate: "6.0%" }
  ]
};

export function FeesTables({ data }: { data?: FeesData | null }) {
  const tps = data?.tpsFees || DEFAULT_TPS;
  const typ = data?.typFees || DEFAULT_TYP;

  const formatText = (text?: string | null) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 py-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* TPS Table */}
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950">
        <div className="bg-zinc-700 dark:bg-zinc-800 px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
          <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">
            FEES AND TERMS APPLICABLE TO PREMIUM LATAM CHANNEL CODE: TPS
          </h3>
        </div>
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-100 dark:bg-zinc-900/50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-900 dark:text-zinc-100 border-b border-r border-gray-200 dark:border-zinc-800 w-1/3">SETTLEMENT TERMS</th>
              <th className="px-4 py-3 font-semibold text-gray-900 dark:text-zinc-100 border-b border-gray-200 dark:border-zinc-800">FEES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
            <tr>
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-zinc-100 border-r border-gray-200 dark:border-zinc-800 align-top">
                Minimum transaction fee/ refund fee
              </td>
              <td className="px-4 py-3 text-gray-700 dark:text-zinc-300 align-top">
                {formatText(tps.minimumTransactionFee || DEFAULT_TPS.minimumTransactionFee)}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-zinc-100 border-r border-gray-200 dark:border-zinc-800 align-top">
                Additional Legal Terms
              </td>
              <td className="px-4 py-3 text-gray-700 dark:text-zinc-300 align-top whitespace-pre-line">
                {tps.additionalLegalTerms || DEFAULT_TPS.additionalLegalTerms}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TYP Table */}
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-950">
        <div className="bg-zinc-700 dark:bg-zinc-800 px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
          <h3 className="text-[12px] font-bold text-white uppercase tracking-wider">
            FEES AND TERMS APPLICABLE TO P2P CHANNEL OPERATING CONDITIONS CHANNEL CODE: TYP
          </h3>
        </div>
        <table className="w-full text-left border-collapse text-sm">
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
            <tr>
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-zinc-100 border-r border-gray-200 dark:border-zinc-800 w-1/3 align-top">
                Clients' currencies<br />
                <span className="text-xs text-gray-500">(Deposit/Withdrawal | PAY-IN/PAY-OUT)</span>
              </td>
              <td className="px-4 py-3 text-gray-700 dark:text-zinc-300 align-middle">
                {typ.clientsCurrencies || DEFAULT_TYP.clientsCurrencies}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-zinc-100 border-r border-gray-200 dark:border-zinc-800 align-top">
                MCC-code
              </td>
              <td className="px-4 py-3 text-gray-700 dark:text-zinc-300 align-middle">
                {typ.mccCode || DEFAULT_TYP.mccCode}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-zinc-100 border-r border-gray-200 dark:border-zinc-800 align-top">
                Traffic
              </td>
              <td className="px-4 py-3 text-gray-700 dark:text-zinc-300 align-middle">
                {typ.traffic || DEFAULT_TYP.traffic}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-zinc-100 border-r border-gray-200 dark:border-zinc-800 align-top">
                Processing fees
              </td>
              <td className="px-4 py-3 text-gray-700 dark:text-zinc-300 align-middle">
                {typ.processingFees || DEFAULT_TYP.processingFees}
              </td>
            </tr>
          </tbody>
        </table>
        
        <div className="bg-zinc-600 dark:bg-zinc-700 px-4 py-3 border-t border-b border-gray-200 dark:border-zinc-600 text-center">
          <h4 className="text-[12px] font-bold text-white uppercase tracking-wider">FX CALCULATION</h4>
        </div>
        
        <table className="w-full text-left border-collapse text-sm">
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
            <tr>
              <td className="px-4 py-3 text-gray-700 dark:text-zinc-300 border-r border-gray-200 dark:border-zinc-800 w-1/3 align-top whitespace-pre-line text-xs" rowSpan={Math.max(1, (typ.fxRates?.length || DEFAULT_TYP.fxRates.length) + 1)}>
                {typ.fxCalculationText || DEFAULT_TYP.fxCalculationText}
              </td>
              <td className="px-4 py-2 font-bold text-gray-900 dark:text-zinc-100 bg-gray-50/50 dark:bg-zinc-900/20">
                Currency
              </td>
              <td className="px-4 py-2 font-bold text-gray-900 dark:text-zinc-100 bg-gray-50/50 dark:bg-zinc-900/20 border-l border-gray-200 dark:border-zinc-800">
                Operators exchange rates difference summary
              </td>
            </tr>
            {(typ.fxRates || DEFAULT_TYP.fxRates).map((rate, i) => (
              <tr key={i}>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-zinc-100">
                  {rate.currencies}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-zinc-300 border-l border-gray-200 dark:border-zinc-800">
                  {rate.rate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </section>
  );
}

