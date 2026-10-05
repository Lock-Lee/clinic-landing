// เว็บเอเจนซีตัวอย่าง (โครงแบบเว็บบริษัทออกแบบ หลายหน้า) ทุกชื่อ ตัวเลข และผลงานเป็นข้อมูลสมมติ

export const studio = {
  name: "Nova Studio",
  tagline: "Branding & Web Design Studio",
  about: "สตูดิโอออกแบบแบรนด์และเว็บไซต์ สำหรับธุรกิจสุขภาพและความงาม",
  email: "hello@example.com",
  phone: "08-0000-0000",
  lineUrl: "#",
  city: "กรุงเทพฯ",
  url: "https://example.com",
};

export const nav = [
  { href: "/", label: "หน้าแรก" },
  { href: "/services", label: "บริการ" },
  { href: "/projects", label: "ผลงาน" },
  { href: "/about", label: "เกี่ยวกับเรา" },
];

// ภาพในแถบเลื่อนของ hero (Unsplash) ใช้งานจริงให้เปลี่ยนเป็นภาพผลงานของสตูดิโอ
export const heroImages = [
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?w=600&q=80&auto=format&fit=crop",
];

export const clients = ["Mira Clinic", "Hana Skin", "Oak & Co.", "Siam Wellness", "Lune Beauty", "Kiri Dental", "Pura Spa", "Vela Hotel"];

export const stats = [
  { value: 9, suffix: "+", decimals: 0, label: "ปีประสบการณ์" },
  { value: 180, suffix: "+", decimals: 0, label: "โปรเจกต์ที่ส่งมอบ" },
  { value: 60, suffix: "+", decimals: 0, label: "คลินิกและแบรนด์ความงาม" },
  { value: 4.9, suffix: "", decimals: 1, label: "คะแนนจากลูกค้า" },
];

export const services = [
  {
    slug: "branding",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=900&q=80&auto=format&fit=crop",
    name: "Brand Identity",
    summary: "วางตัวตนแบรนด์ให้คลินิกดูน่าเชื่อถือและจำง่าย",
    items: ["กลยุทธ์และบุคลิกแบรนด์", "โลโก้และชุดสี", "คู่มือการใช้แบรนด์", "ป้ายและสื่อในคลินิก"],
  },
  {
    slug: "web",
    image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=900&q=80&auto=format&fit=crop",
    name: "Website Design",
    summary: "เว็บไซต์และ Landing Page ที่พาลูกค้าไปถึงการจองคิว",
    items: ["Landing Page สำหรับยิงโฆษณา", "เว็บไซต์คลินิกหลายหน้า", "ระบบหลังบ้านแก้เนื้อหาเอง", "SEO และ AEO"],
  },
  {
    slug: "content",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&q=80&auto=format&fit=crop",
    name: "Content & Social",
    summary: "ภาพและข้อความโซเชียลที่อยู่ในกรอบโฆษณาของ สบส.",
    items: ["Key visual แคมเปญ", "ภาพโพสต์รายเดือน", "วิดีโอสั้น", "เขียนบทความรีวิวเคส"],
  },
  {
    slug: "growth",
    image: "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?w=900&q=80&auto=format&fit=crop",
    name: "LINE OA & Growth",
    summary: "ต่อเว็บ โฆษณา และ LINE OA ให้วัดผลได้",
    items: ["ตั้งค่า LINE OA และ Rich Menu", "ติด Pixel และ GA4", "รายงานผลรายเดือน", "ทดสอบหน้าโฆษณา"],
  },
];

export type Project = {
  slug: string;
  name: string;
  client: string;
  industry: string;
  year: string;
  services: string[];
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  tone: string;
  image: string;
};

export const projects: Project[] = [
  {
    slug: "mira-clinic",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80&auto=format&fit=crop",
    name: "Mira Clinic Rebrand",
    client: "Mira Clinic",
    industry: "คลินิกผิวพรรณ",
    year: "2026",
    services: ["Brand Identity", "Website Design"],
    summary: "เปลี่ยนภาพคลินิกเลเซอร์ราคาถูก ให้เป็นคลินิกผิวโดยแพทย์ที่ดูพรีเมียม",
    challenge: "ลูกค้าเห็นคลินิกเป็นร้านโปรราคาถูก ทำให้ขายคอร์สราคาสูงไม่ได้",
    solution: "วางแบรนด์ใหม่โทนครีมทอง เน้นแพทย์และกระบวนการตรวจผิว ทำเว็บใหม่ที่เล่าขั้นตอนก่อนโปรโมชัน",
    results: ["คนกดจองผ่านเว็บเพิ่มขึ้นชัดเจนใน 3 เดือนแรก", "ยอดขายคอร์สราคาสูงสัดส่วนเพิ่มขึ้น"],
    tone: "#d9c3a0",
  },
  {
    slug: "hana-skin-landing",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=900&q=80&auto=format&fit=crop",
    name: "Hana Skin Landing Page",
    client: "Hana Skin",
    industry: "ฟิลเลอร์และโบท็อกซ์",
    year: "2026",
    services: ["Website Design", "LINE OA & Growth"],
    summary: "Landing Page หน้าเดียวสำหรับยิงโฆษณาโปรโบท็อกซ์ ต่อเข้า LINE OA",
    challenge: "ยิงโฆษณาไปหน้า Facebook แล้วแอดมินตอบไม่ทัน คนหลุดก่อนจอง",
    solution: "ทำหน้าเดียวที่ตอบราคาและคำถามที่พบบ่อยครบ ปุ่มเดียวพาเข้า LINE พร้อม Rich Menu จองคิว",
    results: ["ข้อความถามซ้ำในแชทลดลง", "แอดมินใช้เวลาต่อการจองน้อยลง"],
    tone: "#e8c7cf",
  },
  {
    slug: "siam-wellness",
    image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=900&q=80&auto=format&fit=crop",
    name: "Siam Wellness Website",
    client: "Siam Wellness",
    industry: "เวลเนสและดริปวิตามิน",
    year: "2025",
    services: ["Website Design", "Content & Social"],
    summary: "เว็บไซต์ 2 ภาษาสำหรับลูกค้าต่างชาติ พร้อมบทความความรู้",
    challenge: "ลูกค้าต่างชาติหาข้อมูลภาษาอังกฤษไม่เจอ",
    solution: "เว็บ 2 ภาษา หน้าบริการแยกทุกโปรแกรม บทความตอบคำถามที่คนค้นหาบ่อย",
    results: ["ติดค้นหาคำหลักภาษาอังกฤษหลายคำ", "ได้ลูกค้าต่างชาติจากเว็บต่อเนื่อง"],
    tone: "#c9dbd2",
  },
  {
    slug: "lune-beauty",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=900&q=80&auto=format&fit=crop",
    name: "Lune Beauty Packaging",
    client: "Lune Beauty",
    industry: "ผลิตภัณฑ์ดูแลผิว",
    year: "2025",
    services: ["Brand Identity", "Content & Social"],
    summary: "แพ็กเกจจิ้งและภาพโซเชียลสำหรับสกินแคร์ของคลินิก",
    challenge: "สินค้าหน้าคลินิกดูไม่เข้ากับแบรนด์ ขายได้น้อย",
    solution: "ออกแบบกล่องและฉลากชุดใหม่ ใช้ภาษาภาพเดียวกับคลินิก",
    results: ["สินค้าวางขายคู่บริการได้ต่อเนื่อง"],
    tone: "#d6d0e8",
  },
  {
    slug: "kiri-dental",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=900&q=80&auto=format&fit=crop",
    name: "Kiri Dental Booking",
    client: "Kiri Dental",
    industry: "คลินิกทันตกรรม",
    year: "2024",
    services: ["Website Design", "LINE OA & Growth"],
    summary: "ระบบจองคิวในแอป LINE พร้อมข้อความเตือนนัด",
    challenge: "คนไข้ลืมนัดบ่อย ห้องว่างเสียรายได้",
    solution: "จองคิวใน LINE ส่งข้อความยืนยันและเตือนก่อนวันนัด",
    results: ["คนไข้ไม่มาตามนัดลดลง"],
    tone: "#c7d6e6",
  },
  {
    slug: "pura-spa",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&q=80&auto=format&fit=crop",
    name: "Pura Spa Campaign",
    client: "Pura Spa",
    industry: "สปา",
    year: "2024",
    services: ["Content & Social"],
    summary: "Key visual แคมเปญปีใหม่ ทั้งโซเชียล ป้าย และหน้าเว็บ",
    challenge: "แคมเปญเดิมแต่ละช่องทางหน้าตาไม่เหมือนกัน",
    solution: "ทำ key visual ชุดเดียวแล้วแตกเป็นทุกขนาด",
    results: ["ใช้ภาพชุดเดียวครบทุกช่องทาง"],
    tone: "#ead6c0",
  },
];

export const timeline = [
  { year: "2017", text: "ก่อตั้ง Nova Studio" },
  { year: "2020", text: "เริ่มรับงานคลินิกความงามเป็นหลัก" },
  { year: "2023", text: "เปิดทีมเว็บไซต์และ LINE OA" },
  { year: "2026", text: "ส่งมอบโปรเจกต์ที่ 180" },
];

export const team = [
  { name: "ณัฐ (ตัวอย่าง)", role: "Founder & Creative Director" },
  { name: "มายด์ (ตัวอย่าง)", role: "Project Manager" },
  { name: "ต้น (ตัวอย่าง)", role: "Web Developer" },
  { name: "พลอย (ตัวอย่าง)", role: "Graphic Designer" },
  { name: "บีม (ตัวอย่าง)", role: "Copywriter" },
];

export const reviews = [
  { text: "ทีมเข้าใจข้อจำกัดเรื่องโฆษณาคลินิก ทำงานเร็วและอธิบายทุกขั้นตอน", by: "เจ้าของคลินิกผิวพรรณ (ตัวอย่าง)" },
  { text: "เว็บใหม่ทำให้ลูกค้าทักมาพร้อมข้อมูลครบ แอดมินทำงานง่ายขึ้นมาก", by: "ผู้จัดการคลินิกความงาม (ตัวอย่าง)" },
  { text: "แบรนด์ใหม่ทำให้คลินิกดูเป็นมืออาชีพ ลูกค้าเชื่อมั่นมากขึ้น", by: "แพทย์ผู้ก่อตั้งคลินิก (ตัวอย่าง)" },
];

export const faqs = [
  { q: "ทำงานกับคลินิกต่างจังหวัดได้ไหม?", a: "ได้ ประชุมออนไลน์และส่งงานผ่านลิงก์ให้ดูบนมือถือทุกรอบ" },
  { q: "ใช้เวลาทำเว็บไซต์คลินิกนานเท่าไร?", a: "Landing Page 1-2 สัปดาห์ เว็บไซต์หลายหน้า 3-5 สัปดาห์ ขึ้นกับความพร้อมของข้อมูล" },
  { q: "ช่วยดูเรื่องกฎโฆษณาของ สบส. ไหม?", a: "เราเขียนเนื้อหาให้อยู่ในกรอบที่ใช้กันทั่วไป แต่คลินิกต้องเป็นผู้ยื่นขออนุมัติโฆษณาเอง" },
];
