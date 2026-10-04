export const site = {
  brand: "[ชื่อแบรนด์ของคุณ]",
  lineId: "[LINE ID ของคุณ]",
  lineUrl: "#", // เช่น https://line.me/ti/p/~yourid
  phone: "[เบอร์โทรของคุณ]",
  phoneHref: "#", // เช่น tel:0812345678
  email: "[อีเมล]",
  facebook: "[Facebook Page]",
};

export type ShowcaseItem = {
  name: string;
  category: string;
  url: string;
  image?: string; // เช่น "/showcase/clinic-1.jpg"
  tint: string; // สีกรอบจำลอง ใช้เมื่อยังไม่มีภาพ
  tone: string;
};

export const showcase: ShowcaseItem[] = [
  { name: "[ชื่อคลินิก 1]", category: "คลินิกผิวหนังและเลเซอร์ · แพ็กเกจ Standard", url: "#", tint: "#EAD9E0", tone: "#7A2E55" },
  { name: "[ชื่อคลินิก 2]", category: "ฟิลเลอร์และโบท็อกซ์ · แพ็กเกจ Starter", url: "#", tint: "#DDE6E4", tone: "#2F5D57" },
  { name: "[ชื่อคลินิก 3]", category: "ศัลยกรรมตกแต่ง · แพ็กเกจ Premium", url: "#", tint: "#EFE6D8", tone: "#8A5A2B" },
  { name: "[ชื่อคลินิก 4]", category: "ยกกระชับและปรับรูปหน้า · แพ็กเกจ Standard", url: "#", tint: "#E1E0EE", tone: "#4A437F" },
  { name: "[ชื่อคลินิก 5]", category: "คลินิกรักษาสิว · แพ็กเกจ Starter", url: "#", tint: "#F2DCD6", tone: "#A4483A" },
  { name: "[ชื่อคลินิก 6]", category: "ปลูกผมและเวลเนส · แพ็กเกจ Premium", url: "#", tint: "#DCE7EF", tone: "#2C5878" },
];

export const packages = [
  {
    name: "Starter",
    forWho: "คลินิกเปิดใหม่ ต้องการเว็บเร็ว",
    price: "9,900",
    featured: false,
    features: [
      "Landing page 1 หน้า จากเทมเพลต",
      "5-6 section",
      "ปุ่ม LINE, โทร, แผนที่",
      "รองรับมือถือ",
      "แก้ไขงาน 2 รอบ",
      "ส่งงานใน 5-7 วัน",
      "ดูแลฟรี 1 เดือน",
    ],
  },
  {
    name: "Standard",
    forWho: "คลินิกที่ยิงโฆษณาและต้องการปิดการขาย",
    price: "19,900",
    featured: true,
    features: [
      "Landing page 1 หน้า ดีไซน์เฉพาะแบรนด์",
      "8-10 section รวมรีวิว โปรโมชัน ทีมแพทย์",
      "ฟอร์มจองคิว แจ้งเตือนเข้า LINE",
      "ติด Pixel, GA4 และ SEO พื้นฐาน",
      "แก้ไขงาน 3 รอบ",
      "ส่งงานใน 10-14 วัน",
      "ดูแลฟรี 2 เดือน",
    ],
  },
  {
    name: "Premium",
    forWho: "คลินิกหลายบริการ หรือหลายสาขา",
    price: "39,900",
    featured: false,
    features: [
      "เว็บ 5-7 หน้า ดีไซน์เฉพาะ",
      "หน้าบริการแยก บทความ ระบบหลังบ้าน",
      "ระบบจองนัดออนไลน์",
      "SEO รายหน้า ปรับความเร็ว 2 ภาษา",
      "แก้ไขงาน 5 รอบ",
      "ส่งงานใน 21-30 วัน",
      "ดูแลฟรี 3 เดือน",
    ],
  },
];

export const domainRows = [
  { label: "โดเมน .com", price: "800 บาท/ปี" },
  { label: "โดเมน .co.th หรือ .clinic", price: "ตามราคาจริง" },
  { label: "โฮสติ้ง + SSL", price: "3,000 บาท/ปี" },
];

export const maPlans = [
  { name: "Basic", detail: "สำรองข้อมูล อัปเดตระบบ แก้เว็บล่ม", price: "500 บาท/เดือน" },
  { name: "Standard", detail: "เพิ่มแก้ข้อความ รูป โปรโมชัน 4 ครั้ง/เดือน", price: "1,500 บาท/เดือน" },
  { name: "Pro", detail: "แก้ไม่จำกัด section ใหม่เดือนละ 1 รายงานสถิติ", price: "3,000 บาท/เดือน" },
];

export const steps = [
  { title: "1. คุยโจทย์", detail: "บริการหลัก กลุ่มลูกค้า และเว็บตัวอย่างที่ชอบ" },
  { title: "2. มัดจำและส่งข้อมูล", detail: "คลินิกส่งโลโก้ รูป ข้อความ และราคาโปรโมชัน" },
  { title: "3. ออกแบบและแก้ไข", detail: "ส่งลิงก์ตัวอย่างให้ดูบนมือถือ แก้ตามรอบของแพ็กเกจ" },
  { title: "4. ขึ้นเว็บจริง", detail: "เชื่อมโดเมน ติดตั้งตัววัดผล และสอนใช้งาน" },
];
