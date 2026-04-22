import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import Image from "next/image"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }
  
  if (session.user.role !== 'ADMIN') {
    redirect("/")
  }



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-50 font-sans">
      {/* Sticky Theme Toggle floating bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center w-full relative">
          {/* Logo centered */}
          <div className="font-semibold text-lg tracking-tight absolute left-1/2 transform -translate-x-1/2">
            <Image src="/vasu-logo.png" alt="Vasu" width={100} height={30} />
          </div>
          
          <div className="w-full flex justify-end items-center gap-4">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:inline-block">Welcome, {session.user.name}</span>
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}>
              <button type="submit" className="text-sm font-medium px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-8">
        {children}
      </main>
    </div>
  )
}
