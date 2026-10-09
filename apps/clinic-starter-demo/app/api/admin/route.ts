import { PLAN_SECTIONS } from "@repo/db/plans";
import { createContentRoute } from "@repo/db/route";
import { SITE_ID } from "../../content";

// บันทึกได้เฉพาะส่วนที่แพ็ก Starter มีสิทธิ์
export const { PUT, DELETE } = createContentRoute(SITE_ID, PLAN_SECTIONS.Starter);
