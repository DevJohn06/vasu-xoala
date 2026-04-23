import { auth } from "@/auth"
import { loginWithPin } from "../actions"
import { db } from "@/db"
import { rates, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { RatesTable, type RateRowType } from "@/components/RatesTable"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import Image from "next/image"

export default async function RatePage(props: { params: Promise<{ slug: string }>, searchParams: Promise<{ error?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const session = await auth()

  // --- Disabled account gate ---
  // Check the slug's user status before showing anything (PIN form or rates).
  // This runs for everyone except an already-authenticated admin visiting the page.
  const isAdmin = session?.user?.type === 'ADMIN';
  if (!isAdmin) {
    const userRecord = await db
      .select({ status: users.status })
      .from(users)
      .where(eq(users.pageSlug, params.slug))
      .limit(1);

    if (userRecord[0]?.status === 'disabled') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4 font-sans">
          <div className="w-full max-w-sm p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-orange-100 dark:border-orange-900/30 text-center animate-in zoom-in-95 space-y-5">
            {/* Lock icon */}
            <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto text-orange-500 dark:text-orange-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 mb-2">
                Account Disabled
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Your account has been disabled. Please contact your administrator to restore access.
              </p>
            </div>

            <div className="border-t border-gray-100 dark:border-zinc-800 pt-4">
              <p className="text-xs text-gray-400 dark:text-zinc-600">
                If you believe this is a mistake, reach out to your account manager.
              </p>
            </div>
          </div>
        </div>
      )
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4 font-sans">
        <div className="w-full max-w-sm p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 text-center animate-in zoom-in-95">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6 text-gray-900 dark:text-zinc-50">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-zinc-50 mb-2">Secure Link</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Please enter the 6-digit access PIN provided securely to you.</p>
          
          <form action={loginWithPin} className="space-y-4">
            <input type="hidden" name="currentPath" value={`/rate/${params.slug}`} />
            <input 
              name="pin" 
              type="password" 
              maxLength={6}
              required 
              placeholder="••••••"
              aria-label="Security PIN"
              className="w-full text-center tracking-[1em] text-2xl px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-zinc-50 font-mono transition-shadow uppercase font-bold"
            />
            {searchParams.error && <p className="text-red-500 text-sm font-medium animate-in fade-in">Invalid PIN. Please try again.</p>}
            <button type="submit" className="w-full py-3.5 px-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:opacity-90 transition-opacity mt-4 shadow-sm">
              View Rates
            </button>
          </form>
        </div>
      </div>
    )
  }

  const isMatch = session.user.pageSlug === params.slug;

  if (!isMatch && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 text-center max-w-sm animate-in zoom-in-95">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-50 mb-2">Access Restricted</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Your PIN is valid, but does not grant access to this specific rate sheet.</p>
        </div>
      </div>
    )
  }

  // Native DB fetch replacing Sanity
  const dbRates: RateRowType[] = await db.select().from(rates).where(eq(rates.pageSlug, params.slug));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0a0a0a] font-sans selection:bg-emerald-500/30">

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

      <main className="relative z-10 flex flex-col items-center pt-24 pb-16 flex-grow">

        {/* Hero Section */}
        <section className="w-full max-w-4xl mx-auto px-4 text-center mb-8">
          <div className="inline-flex items-center rounded-full border border-gray-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 px-3 py-1 text-sm text-gray-600 dark:text-gray-300 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
            Confidentially Assigned to you
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            Confidential <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-500">Rate Sheet</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Your custom rate profile allocated by your administrator.
          </p>
        </section>

        {dbRates.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center max-w-lg mx-auto animate-in zoom-in-95 mt-8 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-8 relative z-10">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-6 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"/><path d="M9 7V2"/><path d="M15 7V2"/><path d="M12 7v4"/><path d="M4.5 12.5l2-2"/><path d="M19.5 12.5l-2-2"/><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-锌-50 mb-3">No rates provisioned yet</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Your custom rate profile has been created, but your specific allocations have not yet been assigned. Please kindly request a rate assignment from your account administrator.
            </p>
          </div>
        ) : (
          <RatesTable rates={dbRates} />
        )}

      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col items-center text-center">
          <div className="mb-6 opacity-40 grayscale">
            <Image src="/vasu-logo.png" alt="Vasu" width={80} height={24} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Vasu Inc. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-zinc-600 mt-2 max-w-md">
            This is a private custom entry template for Vasu's services. Pricing details are mapped solely to your organization.
          </p>
        </div>
      </footer>

    </div>
  )
}
