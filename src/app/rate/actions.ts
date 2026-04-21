"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export async function loginWithPin(formData: FormData) {
  const pin = formData.get("pin") as string;
  const currentPath = formData.get("currentPath") as string;
  
  try {
    await signIn("pin", { pin, redirectTo: currentPath })
  } catch (error) {
    if (error instanceof AuthError) {
       // redirect back to same path but with ?error=1
       redirect(`${currentPath}?error=InvalidPin`)
    }
    throw error;
  }
}
