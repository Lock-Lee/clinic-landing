import { Motion } from "@repo/ui/motion";

// องค์ประกอบที่จะค่อยๆ เลื่อนขึ้นมาเมื่อเลื่อนหน้าจอถึง
const REVEAL_SELECTOR = [
  ".section-head",
  ".section > h2",
  ".grid > *",
  ".rows > div",
  ".addon > h2",
  ".addon > p",
  ".note",
  ".faq-list > *",
  ".contact-inner > *",
].join(",");

export default function LandingMotion() {
  return <Motion selector={REVEAL_SELECTOR} />;
}
