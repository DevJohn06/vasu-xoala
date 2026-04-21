
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
