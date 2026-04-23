import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { rates } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import * as XLSX from "xlsx"

// Normalise a header string to lowercase camelCase-ish key for matching
function normaliseKey(key: string): string {
  return key.trim().toLowerCase().replace(/[\s_-]+/g, "")
}

// Map of normalised header → schema field name
const HEADER_MAP: Record<string, string> = {
  country: "country",
  currency: "currency",
  channelcode: "channelCode",
  paymentmethod: "paymentMethod",
  verticals: "verticals",
  deposit: "deposit",
  depositlimit: "depositLimit",
  withdrawal: "withdrawal",
  withdrawallimit: "withdrawalLimit",
  otherfees: "otherFeesNotes",
  otherfeesnotes: "otherFeesNotes",
  settlementterms: "settlementTerms",
  settlementcycle: "settlementCycle",
}

const REQUIRED_FIELDS = ["country", "currency", "channelCode", "paymentMethod"]

export async function POST(req: NextRequest) {
  // Auth guard
  const session = await auth()
  if (!session || session.user.type !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
  }

  const file = formData.get("file") as File | null
  const pageSlug = (formData.get("pageSlug") as string) || "general-rates"

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  // Read file bytes
  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)

  let workbook: XLSX.WorkBook
  try {
    workbook = XLSX.read(uint8Array, { type: "array" })
  } catch {
    return NextResponse.json({ error: "Could not parse file. Ensure it is a valid CSV or XLSX." }, { status: 400 })
  }

  const sheetName = workbook.SheetNames[0]
  if (!sheetName) {
    return NextResponse.json({ error: "The file contains no sheets." }, { status: 400 })
  }

  const sheet = workbook.Sheets[sheetName]
  const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" })

  if (rawRows.length === 0) {
    return NextResponse.json({ error: "The file has no data rows." }, { status: 400 })
  }

  // Map raw rows to schema-compatible objects, validating as we go
  const toInsert: Array<typeof rates.$inferInsert> = []
  const skipped: Array<{ row: number; reason: string }> = []

  for (let i = 0; i < rawRows.length; i++) {
    const raw = rawRows[i]
    const rowNum = i + 2 // +1 for 0-index, +1 for header row

    // Normalise keys
    const mapped: Record<string, string> = {}
    for (const [rawKey, rawVal] of Object.entries(raw)) {
      const normKey = normaliseKey(rawKey)
      const schemaField = HEADER_MAP[normKey]
      if (schemaField) {
        mapped[schemaField] = String(rawVal ?? "").trim()
      }
    }

    // Validate required fields
    const missing = REQUIRED_FIELDS.filter((f) => !mapped[f] || mapped[f] === "")
    if (missing.length > 0) {
      skipped.push({ row: rowNum, reason: `Missing required fields: ${missing.join(", ")}` })
      continue
    }

    toInsert.push({
      pageSlug,
      country: mapped.country,
      currency: mapped.currency,
      channelCode: mapped.channelCode,
      paymentMethod: mapped.paymentMethod,
      verticals: mapped.verticals || null,
      deposit: mapped.deposit || null,
      depositLimit: mapped.depositLimit || null,
      withdrawal: mapped.withdrawal || null,
      withdrawalLimit: mapped.withdrawalLimit || null,
      otherFeesNotes: mapped.otherFeesNotes || null,
      settlementTerms: mapped.settlementTerms || null,
      settlementCycle: mapped.settlementCycle || null,
    })
  }

  if (toInsert.length === 0) {
    return NextResponse.json({
      inserted: 0,
      skipped,
      error: "No valid rows to insert after validation.",
    }, { status: 422 })
  }

  const mode = (formData.get("mode") as string) === "replace" ? "replace" : "append"

  // Replace: delete existing rows first; Append: skip deletion
  if (mode === "replace") {
    await db.delete(rates).where(eq(rates.pageSlug, pageSlug))
  }
  await db.insert(rates).values(toInsert)

  revalidatePath("/admin")
  revalidatePath("/admin/users/[id]", "page")

  return NextResponse.json({ inserted: toInsert.length, skipped })
}
