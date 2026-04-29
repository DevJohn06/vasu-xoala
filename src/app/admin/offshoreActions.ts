"use server"

import { db } from "@/db"
import { offshoreRates, pageSettings, users, admins } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { eq, and } from "drizzle-orm"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { OFFSHORE_MOCK_DATA } from "./offshoreConstants"

// ----------------------
// Offshore Rates Operations
// ----------------------

export async function createOffshoreRate(formData: FormData) {
  const session = await auth()
  if (!session || session.user.type !== 'ADMIN') throw new Error("Unauthorized")

  const pageSlug = (formData.get("pageSlug") as string) || "general-rates"
  const category = formData.get("category") as string
  const channelCode = formData.get("channelCode") as string

  if (!category || !channelCode) return

  await db.insert(offshoreRates).values({
    pageSlug,
    category,
    categoryNote: (formData.get("categoryNote") as string) || null,
    channelCode,
    payIn: (formData.get("payIn") as string) || null,
    setupFee: (formData.get("setupFee") as string) || null,
    annualFee: (formData.get("annualFee") as string) || null,
    otherFees: (formData.get("otherFees") as string) || null,
    rollingReserve: (formData.get("rollingReserve") as string) || null,
    cbFee: (formData.get("cbFee") as string) || null,
    refundFee: (formData.get("refundFee") as string) || null,
    transactionFees: (formData.get("transactionFees") as string) || null,
    settlementUsdt: (formData.get("settlementUsdt") as string) || null,
    transactionMinMax: (formData.get("transactionMinMax") as string) || null,
    settlementCycle: (formData.get("settlementCycle") as string) || null,
    velocitiesLimits: (formData.get("velocitiesLimits") as string) || null,
    whitelistFtdTrusted: (formData.get("whitelistFtdTrusted") as string) || null,
    processingCurrency: (formData.get("processingCurrency") as string) || null,
    geoOpenForProcessing: (formData.get("geoOpenForProcessing") as string) || null,
    mccCodes: (formData.get("mccCodes") as string) || null,
    mid3dsOr2d: (formData.get("mid3dsOr2d") as string) || null,
    descriptor: (formData.get("descriptor") as string) || null,
    acceptanceRate: (formData.get("acceptanceRate") as string) || null,
    integrationType: (formData.get("integrationType") as string) || null,
  })

  redirect("/admin")
}

export async function deleteOffshoreRate(formData: FormData) {
  const session = await auth()
  if (!session || session.user.type !== 'ADMIN') throw new Error("Unauthorized")

  const id = Number(formData.get("id"))
  if (!id) return

  await db.delete(offshoreRates).where(eq(offshoreRates.id, id))
  revalidatePath("/admin")
}

export async function updateOffshoreRate(formData: FormData) {
  const session = await auth()
  if (!session || session.user.type !== 'ADMIN') throw new Error("Unauthorized")

  const id = Number(formData.get("id"))
  if (!id) return

  const category = formData.get("category") as string
  const channelCode = formData.get("channelCode") as string

  if (!category || !channelCode) return

  await db.update(offshoreRates).set({
    category,
    categoryNote: (formData.get("categoryNote") as string) || null,
    channelCode,
    payIn: (formData.get("payIn") as string) || null,
    setupFee: (formData.get("setupFee") as string) || null,
    annualFee: (formData.get("annualFee") as string) || null,
    otherFees: (formData.get("otherFees") as string) || null,
    rollingReserve: (formData.get("rollingReserve") as string) || null,
    cbFee: (formData.get("cbFee") as string) || null,
    refundFee: (formData.get("refundFee") as string) || null,
    transactionFees: (formData.get("transactionFees") as string) || null,
    settlementUsdt: (formData.get("settlementUsdt") as string) || null,
    transactionMinMax: (formData.get("transactionMinMax") as string) || null,
    settlementCycle: (formData.get("settlementCycle") as string) || null,
    velocitiesLimits: (formData.get("velocitiesLimits") as string) || null,
    whitelistFtdTrusted: (formData.get("whitelistFtdTrusted") as string) || null,
    processingCurrency: (formData.get("processingCurrency") as string) || null,
    geoOpenForProcessing: (formData.get("geoOpenForProcessing") as string) || null,
    mccCodes: (formData.get("mccCodes") as string) || null,
    mid3dsOr2d: (formData.get("mid3dsOr2d") as string) || null,
    descriptor: (formData.get("descriptor") as string) || null,
    acceptanceRate: (formData.get("acceptanceRate") as string) || null,
    integrationType: (formData.get("integrationType") as string) || null,
  }).where(eq(offshoreRates.id, id))

  revalidatePath("/admin")
  const returnUrl = formData.get("returnUrl") as string
  if (returnUrl) redirect(returnUrl)
}

export async function cloneOffshoreDirectToReseller() {
  const session = await auth()
  if (!session || session.user.type !== 'ADMIN') throw new Error("Unauthorized")

  // Delete existing reseller offshore rates
  await db.delete(offshoreRates).where(eq(offshoreRates.pageSlug, "general-rates"))

  // Fetch direct offshore rates
  const directRates = await db.select().from(offshoreRates).where(eq(offshoreRates.pageSlug, "general-rates-direct"))
  if (directRates.length > 0) {
    const newRates = directRates.map(r => ({
      pageSlug: "general-rates",
      category: r.category,
      categoryNote: r.categoryNote,
      channelCode: r.channelCode,
      payIn: r.payIn,
      setupFee: r.setupFee,
      annualFee: r.annualFee,
      otherFees: r.otherFees,
      rollingReserve: r.rollingReserve,
      cbFee: r.cbFee,
      refundFee: r.refundFee,
      transactionFees: r.transactionFees,
      settlementUsdt: r.settlementUsdt,
      transactionMinMax: r.transactionMinMax,
      settlementCycle: r.settlementCycle,
      velocitiesLimits: r.velocitiesLimits,
      whitelistFtdTrusted: r.whitelistFtdTrusted,
      processingCurrency: r.processingCurrency,
      geoOpenForProcessing: r.geoOpenForProcessing,
      mccCodes: r.mccCodes,
      mid3dsOr2d: r.mid3dsOr2d,
      descriptor: r.descriptor,
      acceptanceRate: r.acceptanceRate,
      integrationType: r.integrationType,
    }))
    await db.insert(offshoreRates).values(newRates)
  }

  revalidatePath("/admin")
}

export async function copyGeneralOffshoreRatesToUser(formData: FormData) {
  const session = await auth()
  if (!session || session.user.type !== 'ADMIN') throw new Error("Unauthorized")

  const id = Number(formData.get("id"))
  if (!id) throw new Error("ID not provided")

  const userArr = await db.select().from(users).where(eq(users.id, id)).limit(1)
  const user = userArr[0]
  if (!user || !user.pageSlug) throw new Error("User or pageSlug not found")

  // Delete existing offshore rates for user
  await db.delete(offshoreRates).where(eq(offshoreRates.pageSlug, user.pageSlug))

  const source = formData.get("source") as string || "general-rates"

  // Fetch general offshore rates
  const generalRates = await db.select().from(offshoreRates).where(eq(offshoreRates.pageSlug, source))
  if (generalRates.length > 0) {
    const newRates = generalRates.map(r => ({
      pageSlug: user.pageSlug!,
      category: r.category,
      categoryNote: r.categoryNote,
      channelCode: r.channelCode,
      payIn: r.payIn,
      setupFee: r.setupFee,
      annualFee: r.annualFee,
      otherFees: r.otherFees,
      rollingReserve: r.rollingReserve,
      cbFee: r.cbFee,
      refundFee: r.refundFee,
      transactionFees: r.transactionFees,
      settlementUsdt: r.settlementUsdt,
      transactionMinMax: r.transactionMinMax,
      settlementCycle: r.settlementCycle,
      velocitiesLimits: r.velocitiesLimits,
      whitelistFtdTrusted: r.whitelistFtdTrusted,
      processingCurrency: r.processingCurrency,
      geoOpenForProcessing: r.geoOpenForProcessing,
      mccCodes: r.mccCodes,
      mid3dsOr2d: r.mid3dsOr2d,
      descriptor: r.descriptor,
      acceptanceRate: r.acceptanceRate,
      integrationType: r.integrationType,
    }))
    await db.insert(offshoreRates).values(newRates)
  }

  revalidatePath(`/admin/users/${id}`)
}

export async function purgeOffshoreRates(formData: FormData) {
  const session = await auth()
  if (!session || session.user.type !== 'ADMIN') throw new Error("Unauthorized")

  const pageSlug = formData.get("pageSlug") as string
  const password = formData.get("password") as string
  const category = formData.get("category") as string

  if (!pageSlug || !password) throw new Error("Missing slug or password")

  const adminIdStr = session.user.id?.replace('admin-', '') || ''
  const adminId = Number(adminIdStr)
  if (!adminId) throw new Error("Invalid admin ID")

  const adminRecordArr = await db.select().from(admins).where(eq(admins.id, adminId)).limit(1)
  const adminRecord = adminRecordArr[0]
  if (!adminRecord) throw new Error("Admin not found")

  const isValid = await bcrypt.compare(password, adminRecord.password)
  if (!isValid) throw new Error("Incorrect password")

  if (category) {
    await db.delete(offshoreRates).where(
      and(
        eq(offshoreRates.pageSlug, pageSlug),
        eq(offshoreRates.category, category)
      )
    )
  } else {
    await db.delete(offshoreRates).where(eq(offshoreRates.pageSlug, pageSlug))
  }

  revalidatePath("/admin")
}

export async function seedOffshoreRates() {
  const session = await auth()
  if (!session || session.user.type !== 'ADMIN') throw new Error("Unauthorized")

  for (const row of OFFSHORE_MOCK_DATA) {
    await db.insert(offshoreRates).values(row)
  }

  revalidatePath("/admin")
}
