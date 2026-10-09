-- เนื้อหาที่แก้จากหลังบ้าน: หนึ่งแถวต่อหนึ่งเว็บ เก็บเป็น JSON ทับค่าเริ่มต้นใน content.ts ทีละ key บนสุด
CREATE TABLE IF NOT EXISTS site_content (
  site       text PRIMARY KEY,
  data       jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- admin กลาง: คลินิก (id = site ของ site_content), ผู้ใช้, สิทธิ์ว่าใครแก้คลินิกไหน, session
CREATE TABLE IF NOT EXISTS clinics (
  id         text PRIMARY KEY,
  name       text NOT NULL,
  package    text NOT NULL,
  domain     text,
  site_url   text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id            serial PRIMARY KEY,
  email         text NOT NULL UNIQUE,
  name          text NOT NULL,
  password_hash text NOT NULL,
  -- staff = ทีมเรา เห็นทุกคลินิก, clinic = เห็นเฉพาะคลินิกใน clinic_members
  role          text NOT NULL CHECK (role IN ('staff', 'clinic')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clinic_members (
  user_id   int  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clinic_id text NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, clinic_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash text PRIMARY KEY,
  user_id    int  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);

-- จัดการผู้ใช้/คลินิก: บังคับเปลี่ยนรหัสครั้งแรก, ปิดการใช้งาน, แม่แบบเว็บของคลินิก, บันทึกการใช้งาน
ALTER TABLE users   ADD COLUMN IF NOT EXISTS must_change_password boolean NOT NULL DEFAULT false;
ALTER TABLE users   ADD COLUMN IF NOT EXISTS disabled_at timestamptz;
ALTER TABLE clinics ADD COLUMN IF NOT EXISTS template text;
ALTER TABLE clinics ADD COLUMN IF NOT EXISTS disabled_at timestamptz;

CREATE TABLE IF NOT EXISTS audit_log (
  id         serial PRIMARY KEY,
  actor_id   int REFERENCES users(id) ON DELETE SET NULL,
  actor      text NOT NULL,
  action     text NOT NULL,
  target     text NOT NULL,
  detail     jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
