import type { LineReply, RichMenuItem } from "@repo/ui/line-chat";

export const site = {
  brand: "Hamcache",
  url: "https://Hamcache.vercel.app", // เปลี่ยนเป็นโดเมนจริงของเว็บนี้ ใช้ทำ canonical, sitemap และ Schema
  lineId: "[LINE ID ของคุณ]",
  lineUrl: "#", // เช่น https://line.me/ti/p/~yourid
  phone: "[เบอร์โทรของคุณ]",
  phoneHref: "#", // เช่น tel:0812345678
  email: "[อีเมล]",
  facebook: "[Facebook Page]",
};

export const hero = {
  eyebrow: "Web Design Studio",
  titleLines: ["เว็บไซต์และ Landing Page", "ที่เปลี่ยนคนเข้าเว็บ ให้เป็นลูกค้า"],
  intro:
    "ออกแบบให้ดูน่าเชื่อถือ โหลดเร็วบนมือถือ และพาลูกค้าไปที่ปุ่ม LINE ฟอร์มติดต่อ หรือหน้าสั่งซื้อได้ในไม่กี่วินาที",
  startPrice: "เริ่มต้น 12,000 บาท",
};

// ข้อความใหญ่ใต้ hero ที่ค่อยๆ สว่างขึ้นตามการเลื่อน
export const statement =
  "เราออกแบบเว็บให้ธุรกิจทุกประเภท ทั้งร้านค้า คลินิก ร้านอาหาร และบริษัท ทุกหน้าคิดมาเพื่อให้คนที่กำลังลังเล กดทัก LINE โทร หรือสั่งซื้อได้ภายในไม่กี่วินาที บนมือถือที่ลูกค้าใช้จริง";

// คำในแถบตัวอักษรวิ่งใต้ hero (สลับกับภาพ heroImages)
export const marqueeWords = ["Website", "Landing Page", "LINE OA", "SEO", "AEO"];

// ภาพวงกลมในแถบตัวอักษรวิ่งใต้ hero (Unsplash ชั่วคราว คละธุรกิจ: คาเฟ่ ร้านค้า คลินิก ร้านอาหาร โรงแรม ออฟฟิศ) เปลี่ยนเป็นภาพหน้าจอผลงานจริงได้
export const heroImages = [
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80&auto=format&fit=crop",
];

export type ShowcaseItem = {
  name: string;
  category: string;
  url: string;
  image: string; // ภาพหน้าจอใน public/showcase/ มีผลงานลูกค้าจริงแล้วเพิ่มต่อท้ายได้
};

// ตอนนี้ยังไม่มีผลงานลูกค้าจริง ใช้เว็บตัวอย่างของแต่ละแพ็ก (ลิงก์เดียวกับ demoUrl ใน packages) เดโมทั้ง 3 ตัวเป็นธุรกิจคลินิก
export const showcase: ShowcaseItem[] = [
  { name: "Mira Skin", category: "เว็บตัวอย่างแพ็กเกจ Starter · คลินิกรักษาสิว หน้าเดียว", url: "http://localhost:3002", image: "/showcase/starter.jpg" },
  { name: "Lumière Clinic", category: "เว็บตัวอย่างแพ็กเกจ Standard · คลินิกผิวพรรณ หน้าเดียวเต็ม + LINE OA", url: "http://localhost:3001", image: "/showcase/standard.jpg" },
  { name: "Atelier Belle Clinic", category: "เว็บตัวอย่างแพ็กเกจ Premium · ศัลยกรรมและผิวพรรณ หลายหน้า", url: "http://localhost:3003", image: "/showcase/premium.jpg" },
];

// demoUrl: ลิงก์เว็บตัวอย่างของแต่ละแพ็ก ตอนนี้ชี้ไปที่ dev server ในเครื่อง deploy เดโมแล้วต้องเปลี่ยนเป็นโดเมนจริง
export const packages = [
  {
    name: "Starter",
    type: "Landing Page หน้าเดียว",
    forWho: "ธุรกิจเปิดใหม่ ต้องการเว็บเร็ว",
    summary: "หน้าเว็บ 1 หน้า บอกสินค้าหรือบริการ ราคา รีวิว แผนที่ ลูกค้ากดทัก LINE หรือโทรหาร้านได้ทันที",
    demoUrl: "http://localhost:3002",
    price: "12,000",
    featured: false,
    features: [
      "Landing page 1 หน้า จากเทมเพลต",
      "5-6 section",
      "ปุ่ม LINE, โทร, แผนที่",
      "รองรับมือถือ",
      "SEO พื้นฐาน: title, description, sitemap, Google Search Console",
      "ส่งให้เราแก้เนื้อหา หรือเพิ่มหลังบ้านให้แก้ข้อความ รูป และราคาเองได้ +3,900 บาท",
    ],
    meta: [
      { label: "ส่งงาน", value: "5-7 วัน" },
      { label: "แก้ไขงาน", value: "2 รอบ" },
      { label: "ดูแลฟรี", value: "1 เดือน" },
    ],
  },
  {
    name: "Standard",
    type: "Landing Page หน้าเดียว",
    forWho: "ธุรกิจที่ยิงโฆษณาและต้องการปิดการขาย",
    summary: "หน้าเว็บ 1 หน้าแบบจัดเต็ม มีโปรโมชัน ทีมงาน ลูกค้ากรอกฟอร์มแล้วแจ้งเข้า LINE ของร้าน และแก้โปรเองได้",
    demoUrl: "http://localhost:3001",
    price: "22,000",
    featured: true,
    features: [
      "Landing page 1 หน้า ดีไซน์เฉพาะแบรนด์",
      "8-10 section รวมรีวิว โปรโมชัน ทีมงาน",
      "ฟอร์มติดต่อหรือจองคิว แจ้งเตือนเข้า LINE ของร้าน",
      "ตั้งค่า LINE OA: ข้อความต้อนรับ Rich Menu ตอบอัตโนมัติ",
      "แก้ข้อความ เปลี่ยนรูป เพิ่มโปรโมชันและรีวิวเองได้จากมือถือ ไม่ต้องรอเรา",
      "ติด Pixel และ GA4",
      "SEO + AEO: FAQ และ Schema ให้ Google และ AI ดึงไปตอบได้",
    ],
    meta: [
      { label: "ส่งงาน", value: "10-14 วัน" },
      { label: "แก้ไขงาน", value: "3 รอบ" },
      { label: "ดูแลฟรี", value: "2 เดือน" },
    ],
  },
  {
    name: "Premium",
    type: "เว็บไซต์หลายหน้า",
    forWho: "ธุรกิจหลายบริการ หลายสาขา หรือบริษัท",
    summary: "เว็บไซต์เต็มรูปแบบ 5-7 หน้า แยกหน้าตามสินค้าหรือบริการ มีบทความ ลูกค้าจองหรือนัดหมายในแอป LINE ได้",
    demoUrl: "http://localhost:3003",
    price: "42,000",
    featured: false,
    features: [
      "เว็บ 5-7 หน้า ดีไซน์เฉพาะ",
      "หน้าสินค้าหรือบริการแยก และบทความ",
      "จัดการเว็บเองได้ทั้งหมด รวมถึงเพิ่มหน้าบริการใหม่และเขียนบทความเอง",
      "จองหรือนัดหมายในแอป LINE ยืนยันและเตือนอัตโนมัติ",
      "SEO + AEO รายหน้า Schema ธุรกิจ สินค้า และบริการ",
      "ปรับความเร็ว รองรับ 2 ภาษา",
    ],
    meta: [
      { label: "ส่งงาน", value: "21-30 วัน" },
      { label: "แก้ไขงาน", value: "5 รอบ" },
      { label: "ดูแลฟรี", value: "3 เดือน" },
    ],
  },
];

// ระบบ LINE OA: แสดงใน section #line ของหน้าขาย
export const lineTiers = [
  { name: "Starter", detail: "ปุ่มลิงก์ไป LINE OA ของร้านทุกจุดบนเว็บ" },
  { name: "Standard", detail: "ตั้งค่า LINE OA ข้อความต้อนรับ Rich Menu ตอบอัตโนมัติ และฟอร์มจองบนเว็บแจ้งเตือนเข้า LINE" },
  { name: "Premium", detail: "จองหรือนัดหมายในแอป LINE ได้เลย ส่งข้อความยืนยันและเตือนก่อนถึงวันนัดอัตโนมัติ" },
];

export const lineAddon = { label: "ตั้งค่า LINE OA + Rich Menu แยก (ไม่ทำเว็บ)", price: "เริ่ม 3,900 บาท" };

// ตัวอย่างแชทใน section #line กด Rich Menu แล้วบอทตอบ
export const lineDemo = {
  name: "ร้านของคุณ",
  avatar: "SH",
  greeting: [
    { text: "สวัสดีค่ะ ขอบคุณที่เพิ่มเราเป็นเพื่อน\nกดเมนูด้านล่างเพื่อจอง ดูโปร หรือคุยกับแอดมินได้เลยค่ะ" },
  ],
  menu: [
    { label: "จอง/นัดหมาย", icon: "calendar", reply: [{ card: { title: "จองออนไลน์", lines: ["เลือกบริการ วัน และเวลา", "ยืนยันทันทีใน LINE"], button: "เลือกวันเวลา" } }] },
    { label: "โปรโมชัน", icon: "tag", reply: [{ card: { title: "โปรเดือนนี้", lines: ["ซื้อครบ 1,000 ลด 10%", "สมาชิกใหม่ รับส่วนลด 100.-"], button: "ดูโปรทั้งหมด" } }] },
    { label: "สินค้า/บริการ", icon: "list", reply: [{ text: "สินค้าและบริการของเรา\n• สินค้าขายดี\n• สินค้ามาใหม่\n• บริการหลังการขาย\n• สั่งทำพิเศษ" }] },
    { label: "รีวิว", icon: "star", reply: [{ text: "รีวิวจากลูกค้าจริงอยู่ที่หน้าเว็บของร้านค่ะ คะแนนเฉลี่ย 4.9" }] },
    { label: "แผนที่", icon: "pin", reply: [{ card: { title: "ร้านของคุณ", lines: ["เปิดทุกวัน 11:00-20:00", "มีที่จอดรถหน้าร้าน"], button: "เปิด Google Maps" } }] },
    { label: "คุยกับแอดมิน", icon: "chat", reply: [{ text: "แอดมินจะตอบกลับภายใน 5 นาทีในเวลาทำการค่ะ พิมพ์คำถามไว้ได้เลย" }] },
  ],
} satisfies { name: string; avatar: string; greeting: LineReply[]; menu: RichMenuItem[] };

// ราคาจริงจากผู้ให้บริการ ณ ต.ค. 2026 (Hostinger, THNIC) ตรวจอีกครั้งก่อนออกใบเสนอราคา
export const domainRows = [
  { label: "โดเมน .com", detail: "เหมาะกับธุรกิจทั่วไป", price: "เริ่ม 519 บาท/ปี" },
  { label: "โดเมน .co.th", detail: "สำหรับธุรกิจที่จดเป็นนิติบุคคล", price: "เริ่ม 856 บาท/ปี" },
  { label: "โดเมนเฉพาะธุรกิจ", detail: "เช่น .shop .store .clinic", price: "เริ่ม 1,800 บาท/ปี" },
  { label: "โฮสติ้ง + SSL", detail: "สำหรับ Landing page", price: "เริ่ม 159 บาท/เดือน" },
  { label: "โฮสติ้งสำหรับระบบหลังบ้าน", detail: "สำหรับเว็บที่แก้ไขเนื้อหาเองได้", price: "เริ่ม 229 บาท/เดือน" },
];

export const maPlans = [
  { name: "Basic", detail: "สำรองข้อมูล อัปเดตระบบ แก้เว็บล่ม", price: "500 บาท/เดือน" },
  { name: "Standard", detail: "เพิ่มแก้ข้อความ รูป โปรโมชัน 4 ครั้ง/เดือน", price: "1,500 บาท/เดือน" },
  { name: "Pro", detail: "แก้ไม่จำกัด section ใหม่เดือนละ 1 เปลี่ยน Rich Menu ตามโปร รายงานสถิติ", price: "3,000 บาท/เดือน" },
];

export const steps = [
  { title: "1. คุยโจทย์", detail: "บริการหลัก กลุ่มลูกค้า และเว็บตัวอย่างที่ชอบ" },
  { title: "2. มัดจำและส่งข้อมูล", detail: "ส่งโลโก้ รูป ข้อความ ราคาสินค้าหรือบริการ และโปรโมชัน" },
  { title: "3. ออกแบบและแก้ไข", detail: "ส่งลิงก์ตัวอย่างให้ดูบนมือถือ แก้ตามรอบของแพ็กเกจ" },
  { title: "4. ขึ้นเว็บจริง", detail: "เชื่อมโดเมน ติดตั้งตัววัดผล และสอนใช้งาน" },
];

// คำถามที่พบบ่อย: แสดงบนหน้าเว็บและส่งเป็น FAQPage Schema ให้ Google / AI ใช้ตอบ (AEO)
export const faqs = [
  {
    q: "เชื่อมเว็บกับ LINE OA ได้ไหม มีค่าใช้จ่ายอะไรบ้าง?",
    a: "ได้ แพ็กเกจ Standard ตั้งค่า LINE OA และให้ฟอร์มบนเว็บแจ้งเตือนเข้า LINE ของร้าน Premium จองหรือนัดหมายในแอป LINE ได้เลย บัญชี LINE OA เปิดฟรี ถ้าส่งข้อความหาลูกค้าเกินโควตาฟรีของ LINE เจ้าของร้านจ่ายค่าแพ็กเกจกับ LINE โดยตรง",
  },
  {
    q: "ทำเว็บไซต์หรือ Landing Page ราคาเท่าไร?",
    a: "เริ่มต้น 12,000 บาท มี 3 แพ็กเกจ คือ Starter 12,000 บาท และ Standard 22,000 บาท เป็น Landing Page หน้าเดียว ส่วน Premium 42,000 บาท เป็นเว็บไซต์หลายหน้า จ่ายครั้งเดียว ไม่รวมโดเมน โฮสติ้ง และค่าดูแลรายเดือน",
  },
  {
    q: "ใช้เวลาทำเว็บกี่วัน?",
    a: "Starter 5-7 วัน, Standard 10-14 วัน และ Premium 21-30 วัน นับจากวันที่ได้รับข้อมูลและรูปภาพครบ",
  },
  {
    q: "แก้ไขข้อความและรูปภาพบนเว็บเองได้ไหม?",
    a: "ได้ แพ็กเกจ Standard และ Premium มีระบบหลังบ้านให้แก้ข้อความ อัปโหลดรูป โปรโมชัน และรีวิวเอง ส่วน Starter เพิ่มระบบหลังบ้านได้ 3,900 บาท",
  },
  {
    q: "ค่าโดเมนและโฮสติ้งเท่าไร?",
    a: "โดเมน .com เริ่ม 519 บาท/ปี, .co.th เริ่ม 856 บาท/ปี และโฮสติ้งเริ่ม 159 บาท/เดือน คิดตามราคาจริงของผู้ให้บริการ จดในชื่อธุรกิจของคุณเอง",
  },
  {
    q: "SEO และ AEO ต่างกันอย่างไร?",
    a: "SEO ช่วยให้เว็บติดอันดับในผลค้นหา Google ส่วน AEO ช่วยให้ Google และผู้ช่วย AI อย่าง ChatGPT หรือ Gemini ดึงข้อมูลธุรกิจของคุณไปตอบคำถามได้ตรง ผ่านคำถามที่พบบ่อยและ Schema",
  },
  {
    q: "ถ้าแก้ไขงานเกินจำนวนรอบในแพ็กเกจคิดเงินอย่างไร?",
    a: "คิดเป็นงาน CR (Change Request) ตามเนื้องานจริง และแจ้งราคาให้ยืนยันก่อนเริ่มทุกครั้ง",
  },
  {
    q: "รับทำเว็บธุรกิจประเภทไหนบ้าง?",
    a: "รับทุกประเภท เช่น ร้านค้าออนไลน์ ร้านอาหาร คาเฟ่ คลินิก สปา โรงแรม อสังหาฯ บริษัท และฟรีแลนซ์ ธุรกิจที่มีกฎโฆษณาเฉพาะ เช่น คลินิก (สบส.) หรืออาหารและเครื่องสำอาง (อย.) เราช่วยจัดเนื้อหาให้เหมาะสม โดยเจ้าของธุรกิจเป็นผู้ขออนุมัติโฆษณา",
  },
];
