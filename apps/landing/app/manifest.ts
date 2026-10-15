import type { MetadataRoute } from "next";
import { site, seo } from "./content";

// ข้อมูลตอนบันทึกเว็บลงหน้าจอมือถือ: ชื่อ ไอคอน และสีแบรนด์ (สีจากโลโก้ HamCache)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.brand} รับทำเว็บไซต์และแอปมือถือ`,
    short_name: site.brand,
    description: seo.description,
    lang: "th",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1ed",
    theme_color: "#2b2733",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "256x256", type: "image/png" },
    ],
  };
}
