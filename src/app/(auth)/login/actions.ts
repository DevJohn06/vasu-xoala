import { signIn, auth } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  "use server"
  try {
    await signIn("admin", {
      ...Object.fromEntries(formData),
      redirect: false
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          redirect("/login?error=CredentialsSignin")
        default:
          redirect("/login?error=Default")
      }
    }
    throw error;
  }

  const session = await auth()

  if (session?.user?.role === 'ADMIN') {
    redirect("/admin")
  } else if (session?.user?.pageSlug) {
    redirect(`/rate/${session.user.pageSlug}`)
  } else {
    redirect("/admin")
  }
}
