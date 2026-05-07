"use server";

import { db } from "@/db";
import { pageSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOtcFee(pageSlug: string, field: string, value: string) {
  // Get existing settings
  const settingsArr = await db.select().from(pageSettings).where(eq(pageSettings.pageSlug, pageSlug)).limit(1);
  const currentSettings = settingsArr.length > 0 ? settingsArr[0] : null;

  if (!currentSettings) {
    // Create if doesn't exist
    await db.insert(pageSettings).values({
      pageSlug,
      otcFees: { [field]: value } as any
    });
  } else {
    // Update existing
    const currentOtcFees = currentSettings.otcFees || {};
    await db.update(pageSettings)
      .set({
        otcFees: { ...currentOtcFees, [field]: value } as any
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
