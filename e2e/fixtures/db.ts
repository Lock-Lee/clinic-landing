import { test as base } from "@playwright/test";
import { sql } from "@repo/db";
import { cleanupE2eData } from "./cleanup";

// ล้างเนื้อหาที่แก้จากทุกเว็บ และบัญชี/คลินิกที่เทสต์สร้าง หลังแต่ละเทสต์ ไม่ให้เทสต์หนึ่งกระทบอีกเทสต์
export const test = base.extend<{ cleanDb: void }>({
  cleanDb: [
    async ({}, use) => {
      await use();
      await cleanupE2eData();
      await sql`DELETE FROM site_content`;
    },
    { auto: true },
  ],
});

export async function storedContent(site: string): Promise<Record<string, unknown> | null> {
  const rows = await sql<{ data: Record<string, unknown> }[]>`SELECT data FROM site_content WHERE site = ${site}`;
  return rows[0]?.data ?? null;
}

export async function setPlan(clinicId: string, plan: string) {
  await sql`UPDATE clinics SET package = ${plan} WHERE id = ${clinicId}`;
}

export { expect } from "@playwright/test";
