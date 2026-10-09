import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";
import { LoginForm } from "./form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

export default async function LoginPage() {
  if (await currentUser()) redirect("/");
  return (
    <div className="adm adm-login">
      <div className="adm-login-card">
        <p className="adm-eyebrow">หลังบ้านคลินิก</p>
        <h1>เข้าสู่ระบบ</h1>
        <p className="adm-muted">ใช้อีเมลและรหัสผ่านที่ทีมงานส่งให้ เพื่อแก้ไขเนื้อหาเว็บของคลินิก</p>
        <LoginForm />
      </div>
    </div>
  );
}
