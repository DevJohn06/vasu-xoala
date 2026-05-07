"use server";

import { db } from "@/db";
import { pageSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateCryptoFee(pageSlug: string, field: string, value: string) {
  // Get existing settings
  const settingsArr = await db.select().from(pageSettings).where(eq(pageSettings.pageSlug, pageSlug)).limit(1);
  const currentSettings = settingsArr.length > 0 ? settingsArr[0] : null;

  if (!currentSettings) {
    // Create if doesn't exist
    await db.insert(pageSettings).values({
      pageSlug,
      cryptoFees: { [field]: value } as any
    });
  } else {
    // Update existing
    const currentCryptoFees = currentSettings.cryptoFees || {};
    await db.update(pageSettings)
      .set({
        cryptoFees: { ...currentCryptoFees, [field]: value } as any
      })
      .where(eq(pageSettings.pageSlug, pageSlug));
  }

  revalidatePath("/admin");
  if (pageSlug === "global") {
    revalidatePath("/");
  } else {
    revalidatePath(`/rate/${pageSlug}`);
  }
}

export async function updateSupportedCryptos(pageSlug: string, cryptos: any[]) {
  const settingsArr = await db.select().from(pageSettings).where(eq(pageSettings.pageSlug, pageSlug)).limit(1);
  const currentSettings = settingsArr.length > 0 ? settingsArr[0] : null;

  if (!currentSettings) {
    await db.insert(pageSettings).values({
      pageSlug,
      supportedCryptos: cryptos as any
    });
  } else {
    await db.update(pageSettings)
      .set({
        supportedCryptos: cryptos as any
      })
      .where(eq(pageSettings.pageSlug, pageSlug));
  }

  revalidatePath("/admin");
  if (pageSlug === "global") {
    revalidatePath("/");
  } else {
    revalidatePath(`/rate/${pageSlug}`);
  }
}
