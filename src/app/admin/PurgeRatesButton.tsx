"use client"

import { useState } from "react"
import { purgeRates } from "./actions"

export default function PurgeRatesButton({ targetSlug }: { targetSlug: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handlePurge = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("pageSlug", targetSlug)
      formData.append("password", password)
      
      await purgeRates(formData)
      setIsOpen(false)
      setPassword("")
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg transition-colors border border-red-200 dark:border-red-500/30"
      >
        Purge All Rates
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Warning: Purge Rates</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              This action will permanently delete all rates for this configuration. This cannot be undone.
              Please enter your admin password to confirm.
            </p>
            
            <form onSubmit={handlePurge} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              
              {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 p-2 rounded">{error}</p>}
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center min-w-[120px]"
                >
                  {isLoading ? "Purging..." : "Confirm Purge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
