import { auth } from "@/auth"
import { redirect } from "next/navigation"

/**
 * /rate — smart redirect gateway
 *
 * • Not logged in  → /        (public home / general rates)
 * • Logged in user → /rate/[pageSlug]  (their private rate page)
 * • Logged in admin or user with no slug → /  (fall back to home)
 */
export default async function RateIndexPage() {
  const session = await auth()

  if (!session) {
    redirect("/")
  }

  const { role, pageSlug } = session.user

  if (role !== "ADMIN" && pageSlug) {
    redirect(`/rate/${pageSlug}`)
  }

  // Admin or user without an assigned slug — send home
  redirect("/")
}
