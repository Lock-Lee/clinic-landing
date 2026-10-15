import type { MetadataRoute } from "next";
import { site, showcase } from "./content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      // ภาพผลงานให้ Google Images เห็น
      images: [`${site.url}/brand/og.png`, ...showcase.map((w) => `${site.url}${w.image}`)],
    },
  ];
}
