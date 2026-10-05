import type { MetadataRoute } from "next";
import { site } from "./content";

// เปิดให้ทั้ง search engine และ AI crawler (GPTBot, Google-Extended, PerplexityBot ฯลฯ) อ่านได้ เพื่อ AEO
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
