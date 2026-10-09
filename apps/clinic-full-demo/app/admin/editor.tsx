"use client";

import { useId } from "react";
import { AdminShell, ImageField, ListEditor, TextField, useDraft } from "@repo/ui/admin";
import type { NavLink } from "@repo/ui/site";
import { articleBlocks, groups, type Article, type ArticleBlock, type EditableContent, type Service } from "../content";

// หลังบ้านแพ็ก Premium: แก้ได้ทุกอย่างแบบ Standard + เพิ่ม/ลบหน้าบริการและบทความ (แต่ละรายการคือหน้า /services/<slug>, /articles/<slug>)

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ชื่อภาษาอังกฤษแปลงเป็น slug ได้ ชื่อไทยล้วนจะได้ค่าว่าง
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

// slug ที่ยังไม่ซ้ำ: จากชื่อก่อน ถ้าไม่ได้ใช้ <prefix>-1, <prefix>-2 ...
function autoSlug(bases: string[], prefix: string, taken: Set<string>) {
  const base = bases.map(slugify).find(Boolean);
  if (base && !taken.has(base)) return base;
  const stem = base ?? prefix;
  for (let n = base ? 2 : 1; ; n++) if (!taken.has(`${stem}-${n}`)) return `${stem}-${n}`;
}

function slugError(slug: string, index: number, all: string[]) {
  if (!slug) return "ยังไม่มี slug";
  if (!SLUG_RE.test(slug)) return "ใช้ได้เฉพาะ a-z 0-9 และขีด - (ไม่ขึ้นต้นหรือลงท้ายด้วยขีด)";
  if (all.some((x, i) => i !== index && x === slug)) return "slug ซ้ำกับรายการอื่น";
  return null;
}

function SlugField({ value, onChange, base, error }: { value: string; onChange: (v: string) => void; base: string; error: string | null }) {
  const id = useId();
  return (
    <div className="adm-field adm-slug" data-error={error ? true : undefined}>
      <label htmlFor={id}>ลิงก์หน้า (slug)</label>
      <input
        id={id}
        type="text"
        inputMode="url"
        autoCapitalize="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
      />
      <small>{error ?? `หน้าเว็บ: ${base}/${value}`}</small>
    </div>
  );
}

// รายการข้อความทีละบรรทัด เช่น ขั้นตอน ย่อหน้าบทความ
function LinesField({ label, value, onChange, hint }: { label: string; value: string[]; onChange: (v: string[]) => void; hint?: string }) {
  return <TextField label={label} multiline value={value.join("\n")} onChange={(v) => onChange(v.split("\n"))} hint={hint ?? "หนึ่งบรรทัดต่อหนึ่งข้อ"} />;
}

const BLOCK_NAME: Record<ArticleBlock["type"], string> = { text: "ย่อหน้า", heading: "หัวข้อย่อย", image: "รูป" };
const shorten = (t: string, n = 48) => (t.length > n ? `${t.slice(0, n)}…` : t);

function blockTitle(b: ArticleBlock) {
  if (b.type === "image") return `รูป · ${b.caption?.trim() || b.alt?.trim() || (b.src ? b.src.split("/").pop() : "ยังไม่ได้อัปโหลด")}`;
  return `${BLOCK_NAME[b.type]} · ${shorten(b.text.trim().replace(/\s+/g, " ")) || "(ว่าง)"}`;
}

// เนื้อหาบทความ: ย่อหน้า หัวข้อย่อย และรูป เรียงลำดับ/ลบได้ รูปอัปโหลดผ่าน ImageField ไปที่คลังรูปของคลินิก
function BlocksEditor({ value, onChange }: { value: ArticleBlock[]; onChange: (v: ArticleBlock[]) => void }) {
  return (
    <div className="adm-field">
      <span className="adm-label">เนื้อหาบทความ</span>
      <small>เพิ่มย่อหน้า หัวข้อย่อย หรือรูปได้ไม่จำกัด กดที่แต่ละบล็อกเพื่อแก้ ใช้ ↑ ↓ เรียงลำดับ รูปที่เลือกจะถูกย่อขนาดและอัปโหลดไปเก็บที่คลังรูปของคลินิกอัตโนมัติ</small>
      <ListEditor
        items={value}
        onChange={onChange}
        newItem={(): ArticleBlock => ({ type: "text", text: "" })}
        itemTitle={blockTitle}
        addLabel="ย่อหน้า"
        moreAdds={[
          { label: "หัวข้อย่อย", make: (): ArticleBlock => ({ type: "heading", text: "" }) },
          { label: "รูป", make: (): ArticleBlock => ({ type: "image", src: "", caption: "", alt: "" }) },
        ]}
        renderItem={(b, set) => {
          if (b.type === "image")
            return (
              <>
                <ImageField label="รูป" value={b.src} onChange={(src) => set({ src })} />
                <TextField label="คำบรรยายใต้รูป" value={b.caption ?? ""} onChange={(caption) => set({ caption })} hint="ไม่ใส่ก็ได้" />
                <TextField label="คำอธิบายรูป (alt)" value={b.alt ?? ""} onChange={(alt) => set({ alt })} hint="บอกว่าในรูปมีอะไร ช่วยเรื่อง SEO และผู้ใช้โปรแกรมอ่านหน้าจอ" />
              </>
            );
          if (b.type === "heading") return <TextField label="หัวข้อย่อย" value={b.text} onChange={(text) => set({ text })} />;
          return <TextField label="ย่อหน้า" multiline value={b.text} onChange={(text) => set({ text })} hint="เว้นบรรทัดว่างเพื่อแยกย่อหน้า" />;
        }}
      />
    </div>
  );
}

function GroupSelect({ value, onChange }: { value: Service["group"]; onChange: (v: Service["group"]) => void }) {
  const id = useId();
  return (
    <div className="adm-field">
      <label htmlFor={id}>หมวด</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as Service["group"])}>
        {groups.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
    </div>
  );
}

const today = () => new Date().toISOString().slice(0, 10);

const HREF_RE = /^(\/|#|https?:\/\/)/;
const CUSTOM = "__custom";

// ลิงก์เมนู: เลือกจากหน้าที่มีอยู่ หรือพิมพ์เอง (เช่น /services#skin หรือลิงก์ภายนอก)
function HrefField({
  value,
  onChange,
  pages,
}: {
  value: string;
  onChange: (href: string, pageLabel?: string) => void;
  pages: { href: string; label: string }[];
}) {
  const id = useId();
  const known = pages.some((p) => p.href === value);
  const bad = !HREF_RE.test(value);
  return (
    <div className="adm-field adm-slug" data-error={bad ? true : undefined}>
      <label htmlFor={id}>ลิงก์ไปที่</label>
      <div className="adm-href-row">
        <select
          id={id}
          value={known ? value : CUSTOM}
          onChange={(e) => {
            if (e.target.value === CUSTOM) return;
            onChange(e.target.value, pages.find((p) => p.href === e.target.value)?.label);
          }}
        >
          {pages.map((p) => (
            <option key={p.href} value={p.href}>
              {p.label} ({p.href})
            </option>
          ))}
          <option value={CUSTOM}>อื่นๆ (พิมพ์ลิงก์เอง)</option>
        </select>
        <input type="text" aria-label="ลิงก์" autoCapitalize="off" spellCheck={false} value={value} onChange={(e) => onChange(e.target.value.trim())} />
      </div>
      <small>{bad ? 'ลิงก์ต้องขึ้นต้นด้วย "/" หรือ "#" หรือ "http"' : "เลือกหน้าจากรายการ หรือพิมพ์เอง เช่น /services#skin"}</small>
    </div>
  );
}

export function AdminEditor({ initial, defaults }: { initial: EditableContent; defaults: EditableContent }) {
  const { draft, update, save, reset, dirty } = useDraft({ initial, defaults });
  const { clinic, hero, nav, services, articles, promotions, reviews } = draft;
  const setClinic = (patch: Partial<EditableContent["clinic"]>) => update("clinic", { ...clinic, ...patch });
  const setHero = (patch: Partial<EditableContent["hero"]>) => update("hero", { ...hero, ...patch });

  // slug ของหน้าที่มีอยู่แล้วไม่เปลี่ยนตามชื่อ (กันลิงก์เดิมเสีย) รายการใหม่ slug จะตามชื่อจนกว่าจะแก้เอง
  const savedServiceSlugs = new Set(initial.services.map((s) => s.slug));
  const savedArticleSlugs = new Set(initial.articles.map((a) => a.slug));
  const serviceSlugs = services.map((s) => s.slug);
  const articleSlugs = articles.map((a) => a.slug);

  const othersOf = (all: string[], self: string) => new Set(all.filter((x) => x !== self));

  const patchService = (s: Service, patch: Partial<Service>): Partial<Service> => {
    if (!("name" in patch || "en" in patch) || savedServiceSlugs.has(s.slug)) return patch;
    const taken = othersOf(serviceSlugs, s.slug);
    const wasAuto = !s.slug || s.slug === autoSlug([s.en, s.name], "service", taken);
    if (!wasAuto) return patch;
    const next = { ...s, ...patch };
    return { ...patch, slug: autoSlug([next.en, next.name], "service", taken) };
  };

  const patchArticle = (a: Article, patch: Partial<Article>): Partial<Article> => {
    if (!("title" in patch) || savedArticleSlugs.has(a.slug)) return patch;
    const taken = othersOf(articleSlugs, a.slug);
    const wasAuto = !a.slug || a.slug === autoSlug([a.title], "article", taken);
    if (!wasAuto) return patch;
    return { ...patch, slug: autoSlug([patch.title ?? a.title], "article", taken) };
  };

  // หน้าที่มีอยู่จริง สำหรับเลือกเป็นลิงก์เมนู
  const pages = [
    { href: "/", label: "หน้าแรก" },
    { href: "/about", label: "เกี่ยวกับเรา" },
    { href: "/services", label: "บริการทั้งหมด" },
    ...services.map((s) => ({ href: `/services/${s.slug}`, label: s.name })),
    { href: "/articles", label: "บทความทั้งหมด" },
    ...articles.map((a) => ({ href: `/articles/${a.slug}`, label: a.title })),
    { href: "/promotions", label: "โปรโมชัน" },
    { href: "/reviews", label: "รีวิว" },
    { href: "/contact", label: "ติดต่อเรา" },
  ].filter((p, i, all) => all.findIndex((x) => x.href === p.href) === i);

  // เลือกหน้าแล้วถ้ายังไม่มีชื่อเมนู ใช้ชื่อหน้านั้น
  const hrefPatch = (item: NavLink, href: string, pageLabel?: string): Partial<NavLink> =>
    item.label.trim() || !pageLabel ? { href } : { href, label: pageLabel };

  // ตรวจ slug และเมนูก่อนบันทึก ผิดจะขึ้นข้อความแดงที่แถบล่าง
  const onSave = async () => {
    for (const [i, item] of nav.entries()) {
      for (const [j, l] of [item, ...(item.children ?? [])].entries()) {
        const where = j === 0 ? `เมนูที่ ${i + 1}` : `เมนูย่อยที่ ${j} ของ "${item.label}"`;
        if (!l.label.trim()) throw new Error(`${where}: ยังไม่มีชื่อเมนู`);
        if (!HREF_RE.test(l.href)) throw new Error(`${where}: ลิงก์ต้องขึ้นต้นด้วย "/" "#" หรือ "http"`);
      }
    }
    for (const [list, all, label] of [
      [services.map((s) => s.name), serviceSlugs, "บริการ"],
      [articles.map((a) => a.title), articleSlugs, "บทความ"],
    ] as const) {
      for (let i = 0; i < all.length; i++) {
        const err = slugError(all[i] ?? "", i, [...all]);
        if (err) throw new Error(`${label} "${list[i] || i + 1}": ${err}`);
      }
    }
    await save();
  };

  return (
    <AdminShell
      siteName={clinic.name}
      packageName="Premium"
      dirty={dirty}
      onSave={onSave}
      onReset={reset}
      sections={[
        {
          id: "services",
          label: "บริการ",
          render: () => (
            <>
              <p className="adm-muted adm-intro">แต่ละบริการคือหนึ่งหน้าบนเว็บ เพิ่มบริการใหม่แล้วกดบันทึก หน้าใหม่จะขึ้นทันที และอยู่ในเมนูท้ายเว็บกับหน้าบริการทั้งหมด</p>
              <ListEditor
                items={services}
                onChange={(v) => update("services", v)}
                newItem={(): Service => ({
                  slug: autoSlug([], "service", new Set(serviceSlugs)),
                  group: "skin",
                  name: "บริการใหม่",
                  en: "",
                  summary: "",
                  suitable: [],
                  steps: [],
                  recovery: "",
                  priceFrom: "",
                  faqs: [{ q: "ต้องปรึกษาแพทย์ก่อนไหม?", a: "ต้องปรึกษาและประเมินกับแพทย์ก่อนทุกครั้ง ปรึกษาฟรีไม่มีข้อผูกมัด" }],
                  image: "",
                })}
                itemTitle={(s) => `${s.name} · /services/${s.slug}`}
                addLabel="เพิ่มบริการ (หน้าใหม่)"
                renderItem={(s, set) => {
                  const setS = (patch: Partial<Service>) => set(patchService(s, patch));
                  const i = services.indexOf(s);
                  return (
                    <>
                      <TextField label="ชื่อบริการ" value={s.name} onChange={(name) => setS({ name })} />
                      <TextField label="ชื่อภาษาอังกฤษ" value={s.en} onChange={(en) => setS({ en })} hint="ใช้สร้าง slug อัตโนมัติสำหรับบริการใหม่" />
                      <SlugField value={s.slug} onChange={(slug) => set({ slug })} base="/services" error={slugError(s.slug, i, serviceSlugs)} />
                      <GroupSelect value={s.group} onChange={(group) => set({ group })} />
                      <TextField label="สรุปสั้นๆ" multiline value={s.summary} onChange={(summary) => set({ summary })} />
                      <TextField label="ราคาเริ่มต้น (บาท)" value={s.priceFrom} onChange={(priceFrom) => set({ priceFrom })} hint='ใส่เฉพาะตัวเลข เช่น "9,900" หน้าเว็บจะแสดง "เริ่มต้น 9,900 บาท"' />
                      <ImageField label="รูปประกอบ" value={s.image ?? ""} onChange={(image) => set({ image })} />
                      <LinesField label="เหมาะกับใคร" value={s.suitable} onChange={(suitable) => set({ suitable })} />
                      <LinesField label="ขั้นตอน" value={s.steps} onChange={(steps) => set({ steps })} hint="หนึ่งบรรทัดต่อหนึ่งขั้นตอน" />
                      <TextField label="หลังทำ / การพักฟื้น" multiline value={s.recovery} onChange={(recovery) => set({ recovery })} />
                      <span className="adm-label">คำถามที่พบบ่อยของบริการนี้</span>
                      <ListEditor
                        items={s.faqs}
                        onChange={(faqs) => set({ faqs })}
                        newItem={() => ({ q: "", a: "" })}
                        itemTitle={(f) => f.q}
                        addLabel="เพิ่มคำถาม"
                        renderItem={(f, setF) => (
                          <>
                            <TextField label="คำถาม" value={f.q} onChange={(q) => setF({ q })} />
                            <TextField label="คำตอบ" multiline value={f.a} onChange={(a) => setF({ a })} />
                          </>
                        )}
                      />
                    </>
                  );
                }}
              />
            </>
          ),
        },
        {
          id: "articles",
          label: "บทความ",
          render: () => (
            <>
              <p className="adm-muted adm-intro">บทความใหม่จะได้หน้าของตัวเองที่ /articles/slug และขึ้นในหน้าบทความกับหน้าแรก (3 บทความแรก)</p>
              <ListEditor
                items={articles}
                onChange={(v) => update("articles", v)}
                newItem={(): Article => ({
                  slug: autoSlug([], "article", new Set(articleSlugs)),
                  title: "บทความใหม่",
                  date: today(),
                  category: "ความรู้",
                  excerpt: "",
                  blocks: [{ type: "text", text: "" }],
                  image: "",
                })}
                itemTitle={(a) => `${a.title} · ${a.date}`}
                addLabel="เพิ่มบทความ (หน้าใหม่)"
                renderItem={(a, set) => {
                  const i = articles.indexOf(a);
                  return (
                    <>
                      <TextField label="หัวข้อ" value={a.title} onChange={(title) => set(patchArticle(a, { title }))} />
                      <SlugField value={a.slug} onChange={(slug) => set({ slug })} base="/articles" error={slugError(a.slug, i, articleSlugs)} />
                      <TextField label="หมวด" value={a.category} onChange={(category) => set({ category })} hint="เช่น ศัลยกรรม ผิวพรรณ ความรู้" />
                      <TextField label="วันที่เผยแพร่" value={a.date} onChange={(date) => set({ date })} hint="รูปแบบ ปี-เดือน-วัน เช่น 2026-10-01" />
                      <TextField label="คำโปรย" multiline value={a.excerpt} onChange={(excerpt) => set({ excerpt })} />
                      <ImageField label="รูปปก" value={a.image ?? ""} onChange={(image) => set({ image })} />
                      {/* ข้อมูลเก่าที่ยังเป็น body จะถูกแปลงเป็น blocks ตอนแก้ครั้งแรก */}
                      <BlocksEditor value={articleBlocks(a)} onChange={(blocks) => set({ blocks, body: undefined })} />
                    </>
                  );
                }}
              />
            </>
          ),
        },
        {
          id: "nav",
          label: "เมนู",
          render: () => (
            <>
              <p className="adm-muted adm-intro">เมนูด้านบนของเว็บ เมนูไหนมีเมนูย่อยจะเป็น dropdown บนคอม และกดลูกศรเปิดได้บนมือถือ (เมนูย่อยได้ชั้นเดียว)</p>
              <ListEditor
                items={nav}
                onChange={(v) => update("nav", v)}
                newItem={(): NavLink => ({ href: "/", label: "เมนูใหม่", children: [] })}
                itemTitle={(l) => `${l.label} · ${l.href}${l.children?.length ? ` · ย่อย ${l.children.length}` : ""}`}
                addLabel="เพิ่มเมนู"
                renderItem={(l, set) => (
                  <>
                    <TextField label="ชื่อเมนู" value={l.label} onChange={(label) => set({ label })} />
                    <HrefField value={l.href} pages={pages} onChange={(href, pageLabel) => set(hrefPatch(l, href, pageLabel))} />
                    <span className="adm-label">เมนูย่อย</span>
                    <ListEditor
                      items={l.children ?? []}
                      onChange={(children) => set({ children })}
                      newItem={(): NavLink => ({ href: "/services", label: "" })}
                      itemTitle={(c) => `${c.label} · ${c.href}`}
                      addLabel="เพิ่มเมนูย่อย"
                      renderItem={(c, setC) => (
                        <>
                          <TextField label="ชื่อเมนูย่อย" value={c.label} onChange={(label) => setC({ label })} />
                          <HrefField value={c.href} pages={pages} onChange={(href, pageLabel) => setC(hrefPatch(c, href, pageLabel))} />
                        </>
                      )}
                    />
                    {l.href.startsWith("/services") && (
                      <button
                        type="button"
                        className="adm-btn adm-btn-outline adm-fill"
                        onClick={() => {
                          if (l.children?.length && !window.confirm("แทนที่เมนูย่อยเดิมด้วยบริการทั้งหมด?")) return;
                          set({ children: services.map((s) => ({ href: `/services/${s.slug}`, label: s.name })) });
                        }}
                      >
                        เติมเมนูย่อยจากบริการทั้งหมด
                      </button>
                    )}
                  </>
                )}
              />
            </>
          ),
        },
        {
          id: "promotions",
          label: "โปรโมชัน",
          render: () => (
            <ListEditor
              items={promotions}
              onChange={(v) => update("promotions", v)}
              newItem={() => ({ title: "โปรใหม่", detail: "", price: "", until: "" })}
              itemTitle={(p) => `${p.title} · ${p.price}`}
              addLabel="เพิ่มโปรโมชัน"
              renderItem={(p, set) => (
                <>
                  <TextField label="ชื่อโปร" value={p.title} onChange={(title) => set({ title })} />
                  <TextField label="รายละเอียด / เงื่อนไข" multiline value={p.detail} onChange={(detail) => set({ detail })} />
                  <TextField label="ราคา" value={p.price} onChange={(price) => set({ price })} hint='เช่น "3,990 บาท" หรือ "ปรึกษาฟรี"' />
                  <TextField label="ถึงวันที่" value={p.until} onChange={(until) => set({ until })} hint='เช่น "31 ต.ค. 2026"' />
                </>
              )}
            />
          ),
        },
        {
          id: "hero",
          label: "หน้าแรก",
          render: () => (
            <div className="adm-card">
              <TextField label="หัวข้อใหญ่" value={hero.title} onChange={(title) => setHero({ title })} />
              <TextField label="ข้อความใต้หัวข้อ" multiline value={hero.lead} onChange={(lead) => setHero({ lead })} />
              <ImageField label="รูปหน้าแรก" value={hero.image} onChange={(image) => setHero({ image })} />
            </div>
          ),
        },
        {
          id: "reviews",
          label: "รีวิว",
          render: () => (
            <ListEditor
              items={reviews}
              onChange={(v) => update("reviews", v)}
              newItem={() => ({ name: "คุณ ", service: "", text: "" })}
              itemTitle={(r) => `${r.name} · ${r.service}`}
              addLabel="เพิ่มรีวิว"
              renderItem={(r, set) => (
                <>
                  <TextField label="ชื่อลูกค้า" value={r.name} onChange={(name) => set({ name })} hint="แนะนำใช้ชื่อย่อ เช่น คุณ A." />
                  <TextField label="บริการที่ทำ" value={r.service} onChange={(service) => set({ service })} />
                  <TextField label="ข้อความรีวิว" multiline value={r.text} onChange={(text) => set({ text })} />
                </>
              )}
            />
          ),
        },
        {
          id: "clinic",
          label: "ข้อมูลคลินิก",
          render: () => (
            <div className="adm-card">
              <TextField label="ชื่อคลินิก" value={clinic.name} onChange={(name) => setClinic({ name })} />
              <TextField label="สโลแกน" value={clinic.tagline} onChange={(tagline) => setClinic({ tagline })} />
              <TextField label="เบอร์โทร" value={clinic.phone} onChange={(phone) => setClinic({ phone })} />
              <TextField label="LINE ID" value={clinic.lineId} onChange={(lineId) => setClinic({ lineId })} />
              <TextField label="ที่อยู่" multiline value={clinic.address} onChange={(address) => setClinic({ address })} />
              <TextField label="เวลาเปิด" value={clinic.hours} onChange={(hours) => setClinic({ hours })} />
              <TextField label="เลขที่ใบอนุญาต" value={clinic.license} onChange={(license) => setClinic({ license })} />
            </div>
          ),
        },
      ]}
    />
  );
}
