import type { LineReply, RichMenuItem } from "@repo/ui/line-chat";

// ข้อมูลคลินิกตัวอย่างทั้งหมดอยู่ที่ไฟล์นี้ ทำเดโมให้ลูกค้าใหม่ แก้แค่ไฟล์นี้กับสีใน globals.css
// ทุกชื่อ ตัวเลข และราคาเป็นข้อมูลสมมติ

export const clinic = {
  name: "Lumière Clinic",
  nameTh: "ลูมิแอร์ คลินิก",
  tagline: "คลินิกผิวพรรณและความงาม ดูแลโดยแพทย์ทุกเคส",
  url: "https://example.com",
  lineId: "@lumiere-demo",
  lineUrl: "#",
  phone: "02-000-0000",
  phoneHref: "tel:020000000",
  address: "123 ถนนตัวอย่าง แขวงตัวอย่าง เขตตัวอย่าง กรุงเทพฯ 10000",
  hours: "เปิดทุกวัน 11:00 - 20:00 น.",
  mapUrl: "#",
  license: "ใบอนุญาตประกอบกิจการสถานพยาบาล เลขที่ 00000000000",
};

export const stats = [
  { value: 8, suffix: " ปี", decimals: 0, label: "ดูแลลูกค้า" },
  { value: 4, suffix: " ท่าน", decimals: 0, label: "แพทย์ประจำ" },
  { value: 4.9, suffix: "", decimals: 1, label: "คะแนนรีวิว" },
];

// ข้อความ hero (บรรทัดที่ 2 เป็นสีเน้น) + ภาพแถบเลื่อน และภาพบริการ (Unsplash ชั่วคราว) ทำเดโมจริงให้เปลี่ยนเป็นภาพคลินิก
const heroImages = [
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552693673-1bf958298935?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80&auto=format&fit=crop",
];

export const hero = {
  titleLine1: "ผิวสวยแบบเป็นธรรมชาติ",
  titleLine2: "ในแบบที่เป็นคุณ",
  description: "ปรึกษาแพทย์ฟรี วางแผนการดูแลให้เหมาะกับผิวและงบของคุณ ทุกหัตถการทำโดยแพทย์ที่มีใบอนุญาต",
  images: heroImages,
};

export const services = [
  { name: "โบท็อกซ์", image: "https://images.unsplash.com/photo-1552693673-1bf958298935?w=900&q=80&auto=format&fit=crop", detail: "ลดริ้วรอย ปรับกรอบหน้า กราม และลดเหงื่อ", price: "เริ่มต้น 2,900" },
  { name: "ฟิลเลอร์", image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=900&q=80&auto=format&fit=crop", detail: "เติมร่องลึก ปรับรูปปาก คาง และใต้ตา", price: "เริ่มต้น 6,900" },
  { name: "ร้อยไหม", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80&auto=format&fit=crop", detail: "ยกกระชับใบหน้า ปรับรูปหน้าให้ดูเรียว", price: "เริ่มต้น 9,900" },
  { name: "สกินบูสเตอร์", image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=900&q=80&auto=format&fit=crop", detail: "ฟื้นฟูผิวให้ชุ่มชื้น ดูอิ่มน้ำ", price: "เริ่มต้น 3,900" },
  { name: "เลเซอร์ผิว", image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900&q=80&auto=format&fit=crop", detail: "ดูแลฝ้า กระ จุดด่างดำ และรอยสิว", price: "เริ่มต้น 1,900" },
  { name: "ดริปวิตามิน", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80&auto=format&fit=crop", detail: "สูตรเฉพาะบุคคล ประเมินโดยแพทย์ก่อนทุกครั้ง", price: "เริ่มต้น 1,500" },
];

export const promotions = [
  { name: "โบท็อกซ์กราม 50 ยูนิต", before: "5,900", now: "3,990", note: "เฉพาะลูกค้าใหม่ ถึง 31 ต.ค." },
  { name: "สกินบูสเตอร์ 2 ครั้ง", before: "7,800", now: "5,900", note: "ใช้ได้ภายใน 3 เดือน" },
  { name: "ดริปวิตามิน 3 ครั้ง", before: "4,500", now: "3,600", note: "แบ่งใช้กับเพื่อนได้" },
];

export const reasons = [
  { title: "แพทย์ทำเองทุกเคส", detail: "ประเมินและทำหัตถการโดยแพทย์ที่มีใบอนุญาต ไม่ใช้ผู้ช่วยแทน" },
  { title: "ผลิตภัณฑ์แท้ ตรวจสอบได้", detail: "เปิดกล่องและแสดงเลขทะเบียน อย. ต่อหน้าลูกค้า" },
  { title: "ราคาชัด ไม่มีบวกเพิ่ม", detail: "แจ้งราคารวมก่อนทำ ไม่เสนอขายคอร์สเพิ่มระหว่างทำ" },
  { title: "ติดตามผลหลังทำ", detail: "ทีมงานทักถามอาการทาง LINE และนัดตรวจซ้ำฟรี" },
];

export const doctors = [
  { name: "พญ. ตัวอย่าง ใจดี", role: "แพทย์ผู้อำนวยการคลินิก", license: "ว.00000", focus: "ปรับรูปหน้า ฟิลเลอร์ โบท็อกซ์" },
  { name: "นพ. สมมติ ยิ้มแย้ม", role: "แพทย์ประจำคลินิก", license: "ว.00001", focus: "เลเซอร์ ผิวพรรณ รอยสิว" },
];

export const reviews = [
  { name: "คุณเอ", service: "โบท็อกซ์กราม", text: "หมออธิบายละเอียดก่อนทำ ไม่เร่งให้ตัดสินใจ หลังทำมีทีมงานทักมาถามอาการด้วย" },
  { name: "คุณบี", service: "สกินบูสเตอร์", text: "คลินิกสะอาด จองคิวผ่าน LINE ง่าย ไปถึงได้ทำตรงเวลา ไม่ต้องรอนาน" },
  { name: "คุณซี", service: "เลเซอร์ผิว", text: "แจ้งราคาครบตั้งแต่แรก ไม่มีขายของเพิ่ม ประทับใจเรื่องนี้มาก" },
];

export const faqs = [
  { q: "ต้องจองคิวล่วงหน้าไหม?", a: "แนะนำให้จองผ่าน LINE ล่วงหน้าอย่างน้อย 1 วัน เพื่อให้ได้เวลาที่สะดวก" },
  { q: "ปรึกษาแพทย์มีค่าใช้จ่ายไหม?", a: "ปรึกษาและประเมินกับแพทย์ฟรี ไม่มีข้อผูกมัดให้ต้องทำในวันนั้น" },
  { q: "ทำแล้วต้องพักฟื้นไหม?", a: "หัตถการส่วนใหญ่กลับไปทำงานได้ทันที แพทย์จะแจ้งข้อควรปฏิบัติหลังทำทุกครั้ง" },
  { q: "ชำระเงินช่องทางไหนได้บ้าง?", a: "เงินสด โอนผ่าน QR และบัตรเครดิต ผ่อน 0% ได้กับบัตรที่ร่วมรายการ" },
  { q: "มีที่จอดรถไหม?", a: "มีที่จอดรถหน้าคลินิก 6 คัน และจอดที่อาคารข้างเคียงได้" },
];

// หน้า /line: ตัวอย่างแชท LINE OA + Rich Menu ของคลินิกนี้ สร้างจากเนื้อหาล่าสุด (รวมที่แก้จากหลังบ้าน)
export function buildLineOa({ clinic, services, promotions, reviews }: Pick<EditableContent, "clinic" | "services" | "promotions" | "reviews">) {
  return {
    name: clinic.name,
    avatar: "LC",
    greeting: [
      { text: `สวัสดีค่ะ ยินดีต้อนรับสู่ ${clinic.nameTh}\nปรึกษาแพทย์ฟรี กดเมนูด้านล่างเพื่อจองคิวหรือดูโปรได้เลยค่ะ` },
    ],
    menu: [
      { label: "จองคิว", icon: "calendar", reply: [{ card: { title: "จองคิวออนไลน์", lines: ["เลือกบริการ วัน และเวลา", clinic.hours], button: "เลือกวันเวลา" } }] },
      { label: "โปรโมชัน", icon: "tag", reply: [{ card: { title: "โปรเดือนนี้", lines: promotions.map((p) => `${p.name} ${p.now}.-`), button: "จองโปรนี้" } }] },
      { label: "บริการ", icon: "list", reply: [{ text: "บริการของเรา\n" + services.map((s) => `• ${s.name} ${s.price}.-`).join("\n") }] },
      { label: "รีวิว", icon: "star", reply: reviews.slice(0, 1).map((r) => ({ text: `“${r.text}”\n— ${r.name}, ${r.service}` })) },
      { label: "แผนที่", icon: "pin", reply: [{ card: { title: clinic.nameTh, lines: [clinic.address, clinic.hours], button: "เปิด Google Maps" } }] },
      { label: "คุยกับแอดมิน", icon: "chat", reply: [{ text: "แอดมินจะตอบกลับภายใน 5 นาทีในเวลาทำการค่ะ พิมพ์คำถามไว้ได้เลย" }] },
    ],
  } satisfies { name: string; avatar: string; greeting: LineReply[]; menu: RichMenuItem[] };
}

// ส่วนที่แก้ได้จากหลังบ้าน (/admin) แพ็ก Standard: ข้อมูลคลินิก หน้าแรก บริการ โปรโมชัน และรีวิว
// ค่าที่แก้เก็บใน Postgres ตาราง site_content แถว "standard" (packages/db) แพทย์ FAQ ตัวเลข คงที่
// เว็บคลินิกจริงที่ใช้แม่แบบนี้ ตั้ง CLINIC_ID ตอน deploy ให้ตรงกับรหัสคลินิกใน admin กลาง
export const SITE_ID = process.env.CLINIC_ID ?? "standard";
export const editableDefaults = { clinic, hero, services, promotions, reviews };
export type EditableContent = typeof editableDefaults;
