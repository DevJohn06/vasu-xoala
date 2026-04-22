import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import Link from "next/link"
import RatesPanel from "../../RatesPanel"
import CloneRatesButton from "./CloneRatesButton"
import { CopyPin } from "@/components/ui/CopyPin"

import { Metadata } from "next"

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ editRateId?: string, rateQ?: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const id = Number(params.id);
  if (isNaN(id)) return { title: "User Profile | Vasu" };
  const userArr = await db.select().from(users).where(eq(users.id, id)).limit(1);
  const user = userArr[0];
  if (!user) return { title: "User Profile | Vasu" };
  
  return {
    title: `${user.firstName} ${user.lastName} | Vasu Admin`,
  }
}

export default async function UserProfilePage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const userArr = await db.select().from(users).where(eq(users.id, id)).limit(1);
  const user = userArr[0];
  if (!user) return notFound();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-zinc-50">
              {user.firstName} {user.lastName} 
              <span className="ml-3 text-lg font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                {user.role}
              </span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-mono text-sm flex items-center gap-1.5 flex-wrap">
                PIN: <CopyPin pin={user.pin} className="text-sm" /> &bull; Slug:{" "}
                {user.pageSlug ? (
                  <Link
                    href={`/rate/${user.pageSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-2 transition-colors"
                  >
                    /{user.pageSlug}
                  </Link>
                ) : (
                  <span className="text-gray-400">—</span>
                )}{" "}
                &bull; Status: <span className={user.status === 'active' ? 'text-green-600' : 'text-red-500'}>{user.status}</span>
              </p>
          </div>
        </div>
        
        <div>
           <CloneRatesButton userId={user.id} />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden">
         {/* Reusing RatesPanel but passing targetSlug to filter to only show and append this specific user's rates */}
         <RatesPanel targetSlug={user.pageSlug || ""} editRateId={searchParams?.editRateId} rateQ={searchParams?.rateQ} />
      </div>
    </div>
  );
}
