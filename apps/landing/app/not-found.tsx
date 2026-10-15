import type { Metadata } from "next";
import { site, isFilled } from "./content";

// หน้า 404 แบบแบรนด์ HamCache: บอกว่าไม่พบหน้า แล้วพากลับหน้าแรกหรือทัก LINE
export const metadata: Metadata = { title: `ไม่พบหน้านี้ | ${site.brand}`, robots: { index: false } };

export default function NotFound() {
  return (
    <main className="nf">
      <img src="/brand/hamcache-icon.svg" alt="" width={120} height={120} className="nf-icon" />
      <p className="nf-code">404</p>
      <h1>ไม่พบหน้านี้</h1>
      <p className="nf-text">ลิงก์อาจพิมพ์ผิดหรือหน้านี้ถูกย้ายไปแล้ว กลับไปดูแพ็กเกจและผลงานที่หน้าแรกได้เลย</p>
      <div className="nf-actions">
        <a href="/" className="btn btn-primary">กลับหน้าแรก</a>
        {isFilled(site.lineUrl) && (
          <a href={site.lineUrl} className="btn btn-outline">ทัก LINE: {site.lineId}</a>
        )}
      </div>
    </main>
  );
}
