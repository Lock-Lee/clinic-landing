import type { NavLink } from "@repo/ui/site";

// เว็บคลินิกเต็มรูปแบบตัวอย่าง (ศัลยกรรม + ผิวพรรณ หลายหน้า) ทุกชื่อ ราคา รีวิว เป็นข้อมูลสมมติ
// เนื้อหาเป็นข้อมูลทั่วไป ใช้เป็นโครงเท่านั้น เวลาทำเว็บจริงต้องให้แพทย์ตรวจและให้คลินิกขออนุมัติโฆษณากับ สบส.

export const clinic = {
  name: "Atelier Belle Clinic",
  short: "ABC",
  tagline: "ศัลยกรรมและผิวพรรณ โดยทีมแพทย์เฉพาะทาง",
  url: "https://example.com",
  phone: "02-000-0001",
  lineUrl: "#",
  lineId: "@atelierbelle-demo",
  address: "99 อาคารตัวอย่าง ชั้น 3 ถนนตัวอย่าง กรุงเทพฯ 10110",
  hours: "อังคาร-อาทิตย์ 10:00-19:00 น. (ปิดวันจันทร์)",
  license: "ใบอนุญาตประกอบกิจการสถานพยาบาล เลขที่ 00000000000",
};

// เมนูหลัก แก้ได้จากหลังบ้าน children = เมนูย่อย (ลึกได้ชั้นเดียว)
export const nav: NavLink[] = [
  { href: "/", label: "หน้าแรก" },
  {
    href: "/about",
    label: "เกี่ยวกับเรา",
    children: [
      { href: "/about", label: "เกี่ยวกับคลินิก" },
      { href: "/about#doctors", label: "ทีมแพทย์" },
      { href: "/reviews", label: "รีวิวจากผู้ใช้บริการ" },
    ],
  },
  {
    href: "/services",
    label: "บริการ",
    children: [
      { href: "/services#surgery", label: "ศัลยกรรมทั้งหมด" },
      { href: "/services#skin", label: "ผิวพรรณและหัตถการทั้งหมด" },
      { href: "/services/rhinoplasty", label: "ศัลยกรรมจมูก" },
      { href: "/services/eyelid", label: "ศัลยกรรมตาสองชั้น" },
      { href: "/services/thread-lift", label: "ร้อยไหม" },
      { href: "/services/botulinum", label: "โบทูลินัมท็อกซิน" },
      { href: "/services/filler", label: "ฟิลเลอร์" },
    ],
  },
  { href: "/promotions", label: "โปรโมชัน" },
  { href: "/reviews", label: "รีวิว" },
  {
    href: "/articles",
    label: "บทความ",
    children: [
      { href: "/articles", label: "บทความทั้งหมด" },
      { href: "/articles/consult-before-surgery", label: "ปรึกษาศัลยกรรมครั้งแรก" },
      { href: "/articles/botulinum-authentic", label: "เช็กโบทูลินัมของแท้" },
    ],
  },
];

export const groups = [
  { id: "surgery", name: "ศัลยกรรม", en: "Cosmetic Surgery", detail: "ผ่าตัดในโรงพยาบาลมาตรฐาน วางแผนร่วมกับแพทย์ก่อนทุกเคส" },
  { id: "skin", name: "ผิวพรรณและหัตถการ", en: "Skin & Aesthetic Care", detail: "หัตถการที่คลินิก โดยแพทย์ที่ประเมินโครงสร้างใบหน้าก่อนทำ" },
] as const;

export type Service = {
  slug: string;
  group: (typeof groups)[number]["id"];
  name: string;
  en: string;
  summary: string;
  suitable: string[];
  steps: string[];
  recovery: string;
  priceFrom: string;
  faqs: { q: string; a: string }[];
  image?: string;
};

const consultFaq = { q: "ต้องปรึกษาแพทย์ก่อนไหม?", a: "ต้องปรึกษาและประเมินกับแพทย์ก่อนทุกครั้ง ปรึกษาฟรีไม่มีข้อผูกมัด" };

export const services: Service[] = [
  {
    slug: "rhinoplasty", group: "surgery", name: "ศัลยกรรมจมูก", en: "Rhinoplasty",
    summary: "ปรับสันและปลายจมูกให้เข้ากับสัดส่วนใบหน้า",
    suitable: ["สันจมูกแบน หรือปลายจมูกไม่ได้รูป", "ต้องการแก้ไขจากการทำครั้งก่อน"],
    steps: ["ประเมินโครงสร้างและออกแบบร่วมกับแพทย์", "ตรวจสุขภาพก่อนผ่าตัด", "ผ่าตัดในโรงพยาบาล", "นัดติดตามผลตามแผน"],
    recovery: "บวมช่วงแรกและค่อยๆ ยุบลง ระยะเวลาขึ้นกับเทคนิคและแต่ละบุคคล",
    priceFrom: "35,000",
    faqs: [consultFaq, { q: "ผ่าตัดที่ไหน?", a: "ผ่าตัดในโรงพยาบาลที่คลินิกเป็นพันธมิตร ตามมาตรฐานการผ่าตัด" }],
  },
  {
    slug: "eyelid", group: "surgery", name: "ศัลยกรรมตาสองชั้น", en: "Blepharoplasty",
    summary: "ทำตาสองชั้นและแก้หนังตาตกให้ดูเป็นธรรมชาติ",
    suitable: ["ตาชั้นเดียวหรือชั้นไม่เท่ากัน", "หนังตาตกตามวัย"],
    steps: ["ประเมินกล้ามเนื้อตาและไขมัน", "ออกแบบชั้นตา", "ผ่าตัด", "ตัดไหมและติดตามผล"],
    recovery: "บวมช่วงแรก แพทย์จะนัดตัดไหมและตรวจตามแผน",
    priceFrom: "25,000",
    faqs: [consultFaq],
  },
  {
    slug: "facelift", group: "surgery", name: "ศัลยกรรมดึงหน้า", en: "Facelift",
    summary: "ยกกระชับผิวและกล้ามเนื้อใบหน้าที่หย่อนคล้อย",
    suitable: ["ผิวหย่อนคล้อยที่ใช้หัตถการไม่ได้ผลแล้ว"],
    steps: ["ประเมินระดับความหย่อนคล้อย", "ตรวจสุขภาพก่อนผ่าตัด", "ผ่าตัดในโรงพยาบาล", "ติดตามผลระยะยาว"],
    recovery: "ใช้เวลาพักฟื้นนานกว่าการผ่าตัดเล็ก แพทย์จะวางแผนให้เป็นรายบุคคล",
    priceFrom: "120,000",
    faqs: [consultFaq],
  },
  {
    slug: "breast", group: "surgery", name: "ศัลยกรรมหน้าอก", en: "Breast Surgery",
    summary: "เสริมหรือปรับรูปทรงหน้าอกให้สมดุลกับรูปร่าง",
    suitable: ["ต้องการเพิ่มขนาดหรือปรับรูปทรง"],
    steps: ["เลือกขนาดและชนิดซิลิโคนร่วมกับแพทย์", "ตรวจสุขภาพ", "ผ่าตัดในโรงพยาบาล", "ติดตามผล"],
    recovery: "งดออกแรงหนักตามคำแนะนำของแพทย์",
    priceFrom: "89,000",
    faqs: [consultFaq],
  },
  {
    slug: "chin", group: "surgery", name: "เสริมคาง", en: "Chin Augmentation",
    summary: "ปรับปลายคางให้ใบหน้าดูสมดุลจากด้านข้าง",
    suitable: ["คางสั้นหรือคางถอย"],
    steps: ["ประเมินสัดส่วนใบหน้า", "เลือกวัสดุ", "ผ่าตัด", "ติดตามผล"],
    recovery: "บวมช่วงแรก รับประทานอาหารอ่อนตามคำแนะนำ",
    priceFrom: "28,000",
    faqs: [consultFaq],
  },
  {
    slug: "thread-lift", group: "skin", name: "ร้อยไหม", en: "Thread Lift",
    summary: "ยกกระชับใบหน้าด้วยไหมละลาย โดยไม่ต้องผ่าตัด",
    suitable: ["แก้มหย่อน ร่องแก้มลึกเล็กน้อย"],
    steps: ["ประเมินทิศทางการยก", "ทายาชา", "ร้อยไหม", "นัดติดตามผล"],
    recovery: "อาจมีบวมหรือช้ำเล็กน้อย",
    priceFrom: "9,900",
    faqs: [consultFaq, { q: "อยู่ได้นานแค่ไหน?", a: "ขึ้นกับชนิดไหมและแต่ละบุคคล แพทย์จะแจ้งระหว่างปรึกษา" }],
  },
  {
    slug: "botulinum", group: "skin", name: "โบทูลินัมท็อกซิน", en: "Botulinum Toxin",
    summary: "ลดริ้วรอยจากการแสดงสีหน้า และปรับกรอบหน้า",
    suitable: ["ริ้วรอยหน้าผาก หางตา", "กรามใหญ่จากกล้ามเนื้อ"],
    steps: ["ประเมินกล้ามเนื้อ", "เลือกยี่ห้อและจำนวนยูนิต", "ฉีด", "นัดติดตามผล 2 สัปดาห์"],
    recovery: "กลับไปทำงานได้ทันที",
    priceFrom: "2,900",
    faqs: [consultFaq, { q: "ตรวจสอบของแท้ได้อย่างไร?", a: "เปิดกล่องและแสดงเลขทะเบียน อย. ต่อหน้าลูกค้าทุกครั้ง" }],
  },
  {
    slug: "filler", group: "skin", name: "ฟิลเลอร์", en: "Dermal Filler",
    summary: "เติมร่องลึกและปรับรูปหน้า ปาก คาง",
    suitable: ["ร่องแก้ม ใต้ตาลึก", "ต้องการปรับรูปปากหรือคาง"],
    steps: ["ประเมินโครงสร้างใบหน้า", "เลือกชนิดฟิลเลอร์", "ฉีด", "นัดติดตามผล"],
    recovery: "อาจบวมเล็กน้อย 1-3 วัน",
    priceFrom: "6,900",
    faqs: [consultFaq],
  },
  {
    slug: "skin-booster", group: "skin", name: "สกินบูสเตอร์", en: "Skin Booster",
    summary: "ฟื้นฟูผิวให้ชุ่มชื้นและดูอิ่มน้ำ",
    suitable: ["ผิวแห้ง หมองคล้ำ"],
    steps: ["ประเมินสภาพผิว", "ทายาชา", "ฉีด", "นัดตามคอร์ส"],
    recovery: "อาจมีตุ่มนูนเล็กน้อยและหายเองภายใน 1-2 วัน",
    priceFrom: "3,900",
    faqs: [consultFaq],
  },
  {
    slug: "fat-dissolve", group: "skin", name: "ฉีดลดไขมันเฉพาะจุด", en: "Fat Dissolving",
    summary: "ลดไขมันสะสมเฉพาะจุด เช่น เหนียง แก้ม",
    suitable: ["ไขมันสะสมเฉพาะจุดที่ลดยาก"],
    steps: ["ประเมินจุดที่ต้องการ", "ฉีด", "นัดตามคอร์ส"],
    recovery: "อาจบวมแดงเล็กน้อย",
    priceFrom: "2,500",
    faqs: [consultFaq],
  },
  {
    slug: "vitamin-drip", group: "skin", name: "ดริปวิตามินผิว", en: "Vitamin Drip",
    summary: "โปรแกรมวิตามินเฉพาะบุคคล ประเมินโดยแพทย์",
    suitable: ["ต้องการดูแลผิวและสุขภาพจากภายใน"],
    steps: ["ซักประวัติและประเมินโดยแพทย์", "เลือกสูตร", "ดริป 30-45 นาที"],
    recovery: "กลับไปทำกิจกรรมได้ทันที",
    priceFrom: "1,500",
    faqs: [consultFaq],
  },
];

export const hero = {
  title: "ความงามในอุดมคติ ที่ออกแบบเฉพาะคุณ",
  lead: "เราเชื่อว่าลูกค้าทุกคนคือผลงานชิ้นเดียว แพทย์ประเมิน วางแผน และดูแลตั้งแต่วันปรึกษาจนถึงวันติดตามผล",
  image: "",
};

export const doctors = [
  { name: "พญ. ตัวอย่าง หนึ่ง", role: "ศัลยแพทย์ตกแต่ง", license: "ว.00010" },
  { name: "นพ. ตัวอย่าง สอง", role: "แพทย์ผิวหนัง", license: "ว.00011" },
  { name: "พญ. ตัวอย่าง สาม", role: "แพทย์เวชศาสตร์ความงาม", license: "ว.00012" },
];

export const promotions = [
  { title: "ปรึกษาศัลยกรรมฟรี + ส่วนลดตรวจสุขภาพ", detail: "สำหรับผู้ที่ผ่าตัดภายในเดือนนี้", price: "ปรึกษาฟรี", until: "31 ต.ค. 2026" },
  { title: "โบทูลินัมกราม 50 ยูนิต", detail: "ยี่ห้อมี อย. เปิดกล่องต่อหน้า", price: "3,990 บาท", until: "31 ต.ค. 2026" },
  { title: "สกินบูสเตอร์ 3 ครั้ง", detail: "ใช้ได้ภายใน 4 เดือน", price: "9,900 บาท", until: "30 พ.ย. 2026" },
  { title: "ดริปวิตามิน 5 ครั้ง", detail: "แบ่งใช้กับครอบครัวได้", price: "5,900 บาท", until: "30 พ.ย. 2026" },
];

export const reviews = [
  { name: "คุณ A.", service: "ศัลยกรรมจมูก", text: "หมอใช้เวลาออกแบบนานมาก อธิบายข้อดีข้อจำกัดตรงๆ ไม่เชียร์ให้ทำเกินจำเป็น" },
  { name: "คุณ B.", service: "ศัลยกรรมตาสองชั้น", text: "ทีมงานโทรถามอาการหลังผ่าตัดทุกวันช่วงแรก รู้สึกอุ่นใจ" },
  { name: "คุณ C.", service: "โบทูลินัมท็อกซิน", text: "เปิดกล่องให้ดูต่อหน้า ราคาตรงตามที่แจ้ง ไม่มีบวกเพิ่ม" },
  { name: "คุณ D.", service: "ฟิลเลอร์", text: "ได้ผลที่ดูเป็นธรรมชาติ คนรอบตัวทักว่าหน้าสดใสขึ้นแต่ไม่รู้ว่าทำอะไร" },
  { name: "คุณ E.", service: "สกินบูสเตอร์", text: "คลินิกสะอาด เป็นส่วนตัว จองคิวผ่าน LINE ง่าย" },
  { name: "คุณ F.", service: "ร้อยไหม", text: "หมออธิบายว่าเคสเราเหมาะกับร้อยไหมแบบไหนและอยู่ได้นานประมาณเท่าไร" },
];

// เนื้อหาบทความเป็นบล็อกเรียงต่อกัน: ย่อหน้า หัวข้อย่อย หรือรูป (อัปโหลดจากหลังบ้านได้ทุกบทความ)
export type ArticleBlock =
  | { type: "text"; text: string }
  | { type: "heading"; text: string }
  | { type: "image"; src: string; caption?: string; alt?: string };

// body เป็นรูปแบบเก่า (ย่อหน้าทีละบรรทัด) เก็บไว้อ่านข้อมูลที่บันทึกก่อนเปลี่ยนเป็น blocks
export type Article = { slug: string; title: string; date: string; category: string; excerpt: string; blocks: ArticleBlock[]; body?: string[]; image?: string };

// แปลงบทความให้เป็น blocks เสมอ ข้อมูลเก่าที่ยังเป็น body: string[] ก็แสดงได้ไม่พัง
export function articleBlocks(a: Partial<Article>): ArticleBlock[] {
  if (Array.isArray(a.blocks)) return a.blocks.filter((b): b is ArticleBlock => !!b && typeof b === "object" && "type" in b);
  if (Array.isArray(a.body)) return a.body.filter((p) => typeof p === "string").map((text) => ({ type: "text", text }));
  return [];
}

const p = (text: string): ArticleBlock => ({ type: "text", text });


export const articles: Article[] = [
  {
    slug: "consult-before-surgery",
    title: "ปรึกษาศัลยกรรมครั้งแรก ควรถามหมออะไรบ้าง",
    date: "2026-09-20",
    category: "ศัลยกรรม",
    excerpt: "รวมคำถามที่ควรเตรียมไปก่อนพบแพทย์ เพื่อให้ได้แผนที่เหมาะกับตัวเอง",
    blocks: [
      p("การปรึกษาครั้งแรกคือโอกาสที่ดีที่สุดในการเข้าใจว่าการผ่าตัดเหมาะกับเราหรือไม่"),
      { type: "heading", text: "คำถามที่ควรเตรียมไป" },
      p("ควรถามถึงเทคนิคที่แพทย์แนะนำ ข้อจำกัด ระยะพักฟื้น และสิ่งที่ต้องเตรียมก่อนผ่าตัด"),
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=70",
        alt: "แพทย์กำลังอธิบายแผนการรักษาให้ผู้รับบริการฟัง",
        caption: "จดคำถามไว้ล่วงหน้า จะได้ไม่ลืมถามเรื่องสำคัญระหว่างปรึกษา",
      },
      p("แพทย์ที่ดีจะบอกทั้งสิ่งที่ทำได้และสิ่งที่ไม่แนะนำให้ทำ"),
    ],
  },
  {
    slug: "botulinum-authentic",
    title: "วิธีเช็กโบทูลินัมของแท้ก่อนฉีด",
    date: "2026-09-12",
    category: "ผิวพรรณ",
    excerpt: "ดูเลขทะเบียน อย. และขั้นตอนเปิดกล่องที่คลินิกควรทำต่อหน้าคุณ",
    blocks: [
      p("ผลิตภัณฑ์ที่ใช้ในคลินิกต้องมีเลขทะเบียน อย. ที่ตรวจสอบได้"),
      p("ขอให้คลินิกเปิดกล่องและแสดงฉลากต่อหน้าก่อนฉีดทุกครั้ง"),
    ],
  },
  {
    slug: "facial-aging",
    title: "ทำไมโครงหน้าเปลี่ยนไปตามอายุ",
    date: "2026-09-04",
    category: "ความรู้",
    excerpt: "เข้าใจการเปลี่ยนแปลงของกระดูก ไขมัน และผิว เพื่อเลือกการดูแลที่ตรงจุด",
    blocks: [
      p("เมื่ออายุมากขึ้น กระดูก ไขมัน และผิวหนังเปลี่ยนแปลงไปพร้อมกัน"),
      p("การประเมินโดยแพทย์ช่วยให้เลือกวิธีที่ตรงกับสาเหตุ แทนการแก้ที่ปลายเหตุ"),
    ],
  },
  {
    slug: "after-thread-lift",
    title: "หลังร้อยไหม ควรดูแลตัวเองอย่างไร",
    date: "2026-08-28",
    category: "ผิวพรรณ",
    excerpt: "ข้อควรปฏิบัติช่วงสัปดาห์แรกหลังร้อยไหม",
    blocks: [
      p("ช่วงแรกควรหลีกเลี่ยงการนวดหน้าและการอ้าปากกว้างมาก"),
      p("ปฏิบัติตามคำแนะนำของแพทย์ และมาตามนัดติดตามผล"),
    ],
  },
];

export const homeFaqs = [
  { q: "ผ่าตัดทำที่ไหน?", a: "หัตถการทั่วไปทำที่คลินิก ส่วนการผ่าตัดทำในโรงพยาบาลพันธมิตรตามมาตรฐาน" },
  { q: "ปรึกษาแพทย์มีค่าใช้จ่ายไหม?", a: "ปรึกษาฟรี ไม่มีข้อผูกมัด" },
  { q: "รองรับลูกค้าต่างชาติไหม?", a: "รองรับ มีเจ้าหน้าที่สื่อสารภาษาอังกฤษและจีน" },
];

// ส่วนที่แก้ได้จากหลังบ้าน (/admin) แพ็ก Premium: ข้อมูลคลินิก หน้าแรก เมนู บริการ (เพิ่ม/ลบหน้าได้) บทความ โปรโมชัน รีวิว
// ค่าที่แก้เก็บใน Postgres ตาราง site_content แถว "premium" (packages/db)
// เว็บคลินิกจริงที่ใช้แม่แบบนี้ ตั้ง CLINIC_ID ตอน deploy ให้ตรงกับรหัสคลินิกใน admin กลาง
export const SITE_ID = process.env.CLINIC_ID ?? "premium";
export const editableDefaults = { clinic, hero, nav, services, articles, promotions, reviews };
export type EditableContent = typeof editableDefaults;
