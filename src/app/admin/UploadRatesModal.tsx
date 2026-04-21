"use client"

import { useRef, useState, useCallback } from "react"

type SkippedRow = { row: number; reason: string }
type ParsedRow = Record<string, string>

// CSV template header columns
const TEMPLATE_HEADERS = [
  "country",
  "currency",
  "channelCode",
  "paymentMethod",
  "verticals",
  "deposit",
  "depositLimit",
  "withdrawal",
  "withdrawalLimit",
  "otherFeesNotes",
  "settlementTerms",
  "settlementCycle",
]

function downloadTemplate() {
  const csv = TEMPLATE_HEADERS.join(",") + "\n"
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "rates-template.csv"
  a.click()
  URL.revokeObjectURL(url)
}

export default function UploadRatesModal({ targetSlug }: { targetSlug: string }) {
  const [open, setOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<ParsedRow[]>([])
  const [totalRows, setTotalRows] = useState(0)
  const [replaceMode, setReplaceMode] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [inserted, setInserted] = useState(0)
  const [skipped, setSkipped] = useState<SkippedRow[]>([])
  const [errorMsg, setErrorMsg] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    setSelectedFile(null)
    setPreview([])
    setTotalRows(0)
    setStatus("idle")
    setInserted(0)
    setSkipped([])
    setErrorMsg("")
    // keep replaceMode so user doesn't have to re-toggle after closing
  }

  const openModal = () => {
    reset()
    setOpen(true)
  }

  const closeModal = () => {
    reset()
    setOpen(false)
  }

  // Parse the file client-side just for preview using xlsx dynamically
  const parseForPreview = async (file: File) => {
    const XLSX = await import("xlsx")
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const wb = XLSX.read(uint8Array, { type: "array" })
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rows: ParsedRow[] = XLSX.utils.sheet_to_json(ws, { defval: "" })
    setTotalRows(rows.length)
    setPreview(rows.slice(0, 10))
  }

  const handleFile = async (file: File) => {
    const allowed = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]
    if (!allowed.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      setErrorMsg("Invalid file type. Please upload a .csv or .xlsx file.")
      return
    }
    setSelectedFile(file)
    setErrorMsg("")
    await parseForPreview(file)
  }

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) await handleFile(file)
  }, [])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await handleFile(file)
  }

  const handleSubmit = async () => {
    if (!selectedFile) return
    setStatus("loading")
    setInserted(0)
    setSkipped([])
    setErrorMsg("")

    const fd = new FormData()
    fd.append("file", selectedFile)
    fd.append("pageSlug", targetSlug)
    fd.append("mode", replaceMode ? "replace" : "append")

    try {
      const res = await fetch("/api/admin/upload-rates", { method: "POST", body: fd })
      const data = await res.json()

      if (!res.ok) {
        setStatus("error")
        setErrorMsg(data?.error || "Upload failed. Please try again.")
        return
      }

      setInserted(data.inserted)
      setSkipped(data.skipped || [])
      setStatus("success")

      // Auto-close after 3s if no skipped rows
      if ((data.skipped || []).length === 0) {
        setTimeout(() => {
          closeModal()
          window.location.reload()
        }, 2000)
      }
    } catch {
      setStatus("error")
      setErrorMsg("Network error. Please try again.")
    }
  }

  const previewHeaders = preview.length > 0 ? Object.keys(preview[0]).slice(0, 7) : []

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-dashed border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-emerald-500 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-all duration-200 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-0.5 transition-transform duration-200">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Upload CSV / XLSX
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          {/* Modal */}
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-zinc-800">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Upload Rate Rows</h2>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                  Target: <span className="font-mono text-emerald-600 dark:text-emerald-400">{targetSlug}</span>
                </p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Replace Mode Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Replace mode</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                    {replaceMode ? "Existing rows will be deleted before upload" : "New rows will be appended to existing ones"}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={replaceMode}
                  onClick={() => setReplaceMode((v) => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                    replaceMode ? "bg-amber-500" : "bg-gray-200 dark:bg-zinc-600"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ${
                      replaceMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Warning Banner — only shown in replace mode */}
              {replaceMode && (
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                    <strong>Replace mode:</strong> Uploading will <strong>delete all existing rate rows</strong> for <span className="font-mono">{targetSlug}</span> and replace them with the rows in this file. This cannot be undone.
                  </p>
                </div>
              )}

              {/* Drop Zone */}
              {!selectedFile && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center gap-3 py-12 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
                    dragging
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                      : "border-gray-200 dark:border-zinc-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30"
                  }`}
                >
                  <div className={`p-3 rounded-full transition-colors ${dragging ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-gray-100 dark:bg-zinc-800"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={dragging ? "text-emerald-500" : "text-gray-400 dark:text-zinc-500"}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drag & drop or <span className="text-emerald-600 dark:text-emerald-400">browse</span></p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Supports .csv, .xlsx, .xls</p>
                  </div>
                  <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleInputChange} />
                </div>
              )}

              {/* File Selected State */}
              {selectedFile && status !== "success" && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-md bg-emerald-100 dark:bg-emerald-500/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{selectedFile.name}</p>
                      <p className="text-[11px] text-gray-400 dark:text-zinc-500">{totalRows} rows detected</p>
                    </div>
                  </div>
                  <button onClick={reset} className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10">
                    Remove
                  </button>
                </div>
              )}

              {/* Preview Table */}
              {preview.length > 0 && status !== "success" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Preview <span className="text-gray-400">(first {preview.length} of {totalRows} rows)</span></p>
                    {totalRows > 10 && <span className="text-[11px] text-gray-400">+{totalRows - 10} more</span>}
                  </div>
                  <div className="rounded-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
                    <div className="overflow-x-auto max-h-48">
                      <table className="w-full text-[11px]">
                        <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
                          <tr>
                            {previewHeaders.map((h) => (
                              <th key={h} className="px-3 py-2 text-left font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">{h}</th>
                            ))}
                            {Object.keys(preview[0]).length > 7 && <th className="px-3 py-2 text-gray-400">…</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                          {preview.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                              {previewHeaders.map((h) => (
                                <td key={h} className="px-3 py-1.5 text-gray-600 dark:text-gray-400 max-w-[120px] truncate" title={String(row[h] ?? "")}>
                                  {String(row[h] ?? "") || <span className="text-gray-300 dark:text-zinc-600">—</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Template Download */}
              {status !== "success" && (
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download CSV template
                </button>
              )}

              {/* Error message */}
              {errorMsg && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-xs text-red-700 dark:text-red-300">{errorMsg}</p>
                </div>
              )}

              {/* Skipped rows report */}
              {skipped.length > 0 && (
                <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 space-y-1.5">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">{skipped.length} row{skipped.length > 1 ? "s" : ""} skipped</p>
                  <ul className="space-y-1 max-h-28 overflow-y-auto">
                    {skipped.map((s) => (
                      <li key={s.row} className="text-[11px] text-amber-600 dark:text-amber-400 flex gap-2">
                        <span className="font-mono shrink-0">Row {s.row}:</span>
                        <span>{s.reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Success state */}
              {status === "success" && (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-500/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {inserted} row{inserted !== 1 ? "s" : ""} inserted successfully
                    </p>
                    {skipped.length > 0 && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{skipped.length} row{skipped.length > 1 ? "s" : ""} skipped — see details above</p>
                    )}
                    {skipped.length === 0 && (
                      <p className="text-xs text-gray-400 mt-1">Refreshing…</p>
                    )}
                  </div>
                  {skipped.length > 0 && (
                    <button onClick={() => { closeModal(); window.location.reload() }} className="mt-2 px-5 py-2 text-sm bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-80 transition-opacity">
                      Done
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer actions */}
            {status !== "success" && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-zinc-800">
                <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:opacity-80 transition-opacity">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedFile || status === "loading"}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Uploading…
                    </>
                  ) : replaceMode ? "Upload & Replace" : "Upload & Append"
                  }
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
