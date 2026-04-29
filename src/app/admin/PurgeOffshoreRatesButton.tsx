"use client"

import { useState } from "react"
import { purgeOffshoreRates } from "./offshoreActions"

export default function PurgeOffshoreRatesButton({ targetSlug, category }: { targetSlug: string, category?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [status, setStatus] = useState<"idle" | "loading">("idle")

  const handlePurge = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    try {
      const fd = new FormData()
      fd.append("pageSlug", targetSlug)
      fd.append("password", password)
      if (category) fd.append("category", category)
      
      await purgeOffshoreRates(fd)
      setIsOpen(false)
      setPassword("")
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to purge rates")
    } finally {
      setStatus("idle")
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-lg transition-colors border border-red-100 dark:border-red-500/20 shadow-sm flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
        Purge {category ? `"${category}"` : "Offshore"} Table
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={(e) => { if(e.target === e.currentTarget) setIsOpen(false) }}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md border border-red-100 dark:border-red-900/30 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-red-50 dark:bg-red-950/40 p-6 border-b border-red-100 dark:border-red-900/30">
              <div className="flex items-center gap-3 text-red-600 dark:text-red-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <h3 className="text-lg font-bold">Purge {category ? `"${category}"` : "Offshore"} Rates</h3>
              </div>
              <p className="text-sm text-red-700/80 dark:text-red-400/80">
                This action is destructive and irreversible. It will delete all <span className="font-mono bg-red-100/50 dark:bg-red-900/30 px-1 rounded">{targetSlug}</span> {category ? `"${category}"` : "offshore"} rates.
              </p>
            </div>
            
            <form onSubmit={handlePurge} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                  Confirm Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password..."
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-red-500/50 transition-shadow"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!password || status === "loading"}
                  className="flex-1 px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
                >
                  {status === "loading" ? "Purging..." : "Confirm Purge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
