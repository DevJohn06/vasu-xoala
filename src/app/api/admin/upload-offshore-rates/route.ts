import { NextResponse } from "next/server"
import { db } from "@/db"
import { offshoreRates } from "@/db/schema"
import { auth } from "@/auth"
import * as XLSX from "xlsx"
import { eq } from "drizzle-orm"

const TEMPLATE_HEADERS = [
  "category",
  "categoryNote",
  "channelCode",
  "payIn",
  "setupFee",
  "annualFee",
  "otherFees",
  "rollingReserve",
  "cbFee",
  "refundFee",
  "transactionFees",
  "settlementUsdt",
  "transactionMinMax",
  "settlementCycle",
  "velocitiesLimits",
  "whitelistFtdTrusted",
  "processingCurrency",
  "geoOpenForProcessing",
  "mccCodes",
  "mid3dsOr2d",
  "descriptor",
  "acceptanceRate",
  "integrationType"
]

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || session.user.type !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const pageSlug = formData.get("pageSlug") as string
    const mode = formData.get("mode") as string // "replace" or "append"

    if (!file || !pageSlug) {
      return NextResponse.json({ error: "File and pageSlug are required" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const worksheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[worksheetName]
    
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" }) as Record<string, string>[]

    if (rows.length === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 })
    }

    const dataToInsert = []
    const skipped = []
    let rowIndex = 2 

    for (const row of rows) {
      const category = String(row["category"] || "").trim()
      const channelCode = String(row["channelCode"] || "").trim()

      if (!category || !channelCode) {
        skipped.push({ row: rowIndex, reason: "Missing required fields (category or channelCode)" })
        rowIndex++
        continue
      }

      dataToInsert.push({
        pageSlug,
        category,
        categoryNote: String(row["categoryNote"] || "").trim() || null,
        channelCode,
        payIn: String(row["payIn"] || "").trim() || null,
        setupFee: String(row["setupFee"] || "").trim() || null,
        annualFee: String(row["annualFee"] || "").trim() || null,
        otherFees: String(row["otherFees"] || "").trim() || null,
        rollingReserve: String(row["rollingReserve"] || "").trim() || null,
        cbFee: String(row["cbFee"] || "").trim() || null,
        refundFee: String(row["refundFee"] || "").trim() || null,
        transactionFees: String(row["transactionFees"] || "").trim() || null,
        settlementUsdt: String(row["settlementUsdt"] || "").trim() || null,
        transactionMinMax: String(row["transactionMinMax"] || "").trim() || null,
        settlementCycle: String(row["settlementCycle"] || "").trim() || null,
        velocitiesLimits: String(row["velocitiesLimits"] || "").trim() || null,
        whitelistFtdTrusted: String(row["whitelistFtdTrusted"] || "").trim() || null,
        processingCurrency: String(row["processingCurrency"] || "").trim() || null,
        geoOpenForProcessing: String(row["geoOpenForProcessing"] || "").trim() || null,
        mccCodes: String(row["mccCodes"] || "").trim() || null,
        mid3dsOr2d: String(row["mid3dsOr2d"] || "").trim() || null,
        descriptor: String(row["descriptor"] || "").trim() || null,
        acceptanceRate: String(row["acceptanceRate"] || "").trim() || null,
        integrationType: String(row["integrationType"] || "").trim() || null,
      })
      rowIndex++
    }

    if (dataToInsert.length > 0) {
      if (mode === "replace") {
        await db.delete(offshoreRates).where(eq(offshoreRates.pageSlug, pageSlug))
      }
      
      const BATCH_SIZE = 50
      for (let i = 0; i < dataToInsert.length; i += BATCH_SIZE) {
        const batch = dataToInsert.slice(i, i + BATCH_SIZE)
        await db.insert(offshoreRates).values(batch)
      }
    }

    return NextResponse.json({ 
      success: true, 
      inserted: dataToInsert.length,
      skipped
    })
    
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message || "Failed to process file" }, { status: 500 })
  }
}
