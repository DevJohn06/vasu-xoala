"use server"

import { db } from "@/db"
import { users, admins, rates, type UserRole } from "@/db/schema"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { auth } from "@/auth"
import { eq, count } from "drizzle-orm"
import { redirect } from "next/navigation"

// Helpers
async function generateUniquePin(): Promise<string> {
  const chars = '0123456789';
  while (true) {
    let pin = '';
    for (let i = 0; i < 6; i++) {
      pin += chars[Math.floor(Math.random() * chars.length)];
    }
    const existing = await db.select().from(users).where(eq(users.pin, pin)).limit(1);
    if (existing.length === 0) {
      return pin;
    }
  }
}

async function enforceAdminLimit() {
  const adminCountQuery = await db.select({ value: count() }).from(admins);
  const adminCount = adminCountQuery[0].value;
  if (adminCount >= 3) {
    throw new Error("Admin limit reached (max 3). Cannot provision another admin.");
  }
}

// ----------------------
// Users Operations
// ----------------------

export async function createUser(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const role = (formData.get("role") as UserRole) || 'USER'
  const pageSlug = formData.get("pageSlug") as string | null

  if (!firstName || !lastName || !role) return

  let finalSlug = pageSlug;
  if (!finalSlug || finalSlug.trim() === '') {
    finalSlug = `${firstName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${lastName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/^-+|-+$/g, '');
  }

  const pin = await generateUniquePin();

  await db.insert(users).values({
    firstName,
    lastName,
    role,
    pageSlug: finalSlug,
    pin,
    status: 'active'
  })

  revalidatePath("/admin")
}

export async function updateUser(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  const id = Number(formData.get("id"))
  if (!id) return

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const role = formData.get("role") as UserRole
  const pageSlug = formData.get("pageSlug") as string | null
  const status = formData.get("status") as string

  if (!firstName || !lastName || !role) return

  let finalSlug = pageSlug;
  if (!finalSlug || finalSlug.trim() === '') {
    finalSlug = `${firstName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${lastName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.replace(/^-+|-+$/g, '');
  }

  await db.update(users).set({
    firstName,
    lastName,
    role,
    pageSlug: finalSlug,
    status: status === 'active' ? 'active' : 'disabled'
  }).where(eq(users.id, id))

  redirect("/admin")
}

export async function deleteUser(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  const id = Number(formData.get("id"))
  if (!id) return

  await db.delete(users).where(eq(users.id, id))
  revalidatePath("/admin")
}

export async function toggleUserStatus(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  const id = Number(formData.get("id"))
  if (!id) return

  const userArr = await db.select().from(users).where(eq(users.id, id)).limit(1)
  const user = userArr[0]
  if (!user) return

  const newStatus = user.status === 'active' ? 'disabled' : 'active'
  await db.update(users).set({ status: newStatus }).where(eq(users.id, id))
  
  revalidatePath("/admin")
}

// ----------------------
// Admin Operations
// ----------------------

export async function createAdmin(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) return

  await enforceAdminLimit()

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.insert(admins).values({
    username,
    password: hashedPassword,
  })

  revalidatePath("/admin")
}

export async function updateAdmin(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  const id = Number(formData.get("id"))
  if (!id) return

  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username) return

  const updateData: any = { username }

  if (password && password.trim() !== '') {
    updateData.password = await bcrypt.hash(password, 10)
  }

  await db.update(admins).set(updateData).where(eq(admins.id, id))

  redirect("/admin")
}

export async function deleteAdmin(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  const id = Number(formData.get("id"))
  if (!id) return

  // Admin IDs are prefixed in NextAuth session e.g. "admin-1"
  if (session.user.id === `admin-${id}`) {
    throw new Error("Cannot delete yourself")
  }

  await db.delete(admins).where(eq(admins.id, id))
  revalidatePath("/admin")
}

// ----------------------
// Rates Operations
// ----------------------

export async function createRate(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  const pageSlug = (formData.get("pageSlug") as string) || "general-rates"
  const country = formData.get("country") as string
  const currency = formData.get("currency") as string
  const channelCode = formData.get("channelCode") as string
  const paymentMethod = formData.get("paymentMethod") as string

  if (!country || !currency || !channelCode || !paymentMethod) return

  await db.insert(rates).values({
    pageSlug,
    country,
    currency,
    channelCode,
    paymentMethod,
    verticals: formData.get("verticals") as string,
    deposit: formData.get("deposit") as string,
    depositLimit: formData.get("depositLimit") as string,
    withdrawal: formData.get("withdrawal") as string,
    withdrawalLimit: formData.get("withdrawalLimit") as string,
    otherFeesNotes: formData.get("otherFeesNotes") as string,
    settlementTerms: formData.get("settlementTerms") as string,
    settlementCycle: formData.get("settlementCycle") as string,
  })

  redirect("/admin")
}

export async function deleteRate(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  const id = Number(formData.get("id"))
  if (!id) return

  await db.delete(rates).where(eq(rates.id, id))
  revalidatePath("/admin")
}

export async function copyGeneralRatesToUser(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  const id = Number(formData.get("id"))
  if (!id) throw new Error("ID not provided")

  const userArr = await db.select().from(users).where(eq(users.id, id)).limit(1)
  const user = userArr[0]
  if (!user || !user.pageSlug) throw new Error("User or pageSlug not found")

  // Delete existing
  await db.delete(rates).where(eq(rates.pageSlug, user.pageSlug))

  // Fetch general rates
  const generalRates = await db.select().from(rates).where(eq(rates.pageSlug, "general-rates"))
  if (generalRates.length > 0) {
    const newRates = generalRates.map(r => ({
      pageSlug: user.pageSlug!,
      country: r.country,
      currency: r.currency,
      channelCode: r.channelCode,
      paymentMethod: r.paymentMethod,
      verticals: r.verticals,
      deposit: r.deposit,
      depositLimit: r.depositLimit,
      withdrawal: r.withdrawal,
      withdrawalLimit: r.withdrawalLimit,
      otherFeesNotes: r.otherFeesNotes,
      settlementTerms: r.settlementTerms,
      settlementCycle: r.settlementCycle,
    }))
    await db.insert(rates).values(newRates)
  }

  revalidatePath(`/admin/users/${id}`)
}

export async function updateRate(formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') throw new Error("Unauthorized")

  const id = Number(formData.get("id"))
  if (!id) return

  const country = formData.get("country") as string
  const currency = formData.get("currency") as string
  const channelCode = formData.get("channelCode") as string
  const paymentMethod = formData.get("paymentMethod") as string

  if (!country || !currency || !channelCode || !paymentMethod) return

  await db.update(rates).set({
    country,
    currency,
    channelCode,
    paymentMethod,
    deposit: (formData.get("deposit") as string) || null,
    depositLimit: (formData.get("depositLimit") as string) || null,
    withdrawal: (formData.get("withdrawal") as string) || null,
    withdrawalLimit: (formData.get("withdrawalLimit") as string) || null,
    verticals: (formData.get("verticals") as string) || null,
    settlementTerms: (formData.get("settlementTerms") as string) || null,
    settlementCycle: (formData.get("settlementCycle") as string) || null,
  }).where(eq(rates.id, id))

  // The revalidation needs to cover both /admin and /admin/users/[id]
  // We can just rely on redirect which we won't use if it's client-side, but it's a form action so redirect is okay or just revalidate both.
  revalidatePath("/admin")
  const returnUrl = formData.get("returnUrl") as string
  if (returnUrl) redirect(returnUrl)
}
