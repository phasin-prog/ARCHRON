// Skip-to-Content — link hidden for keyboard users to bypass nav to #main-content
// Appears on focus (first Tab), supports WCAG 2.4.1 Bypass Blocks
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-toast focus:rounded-md focus:border focus:border-accent/50 focus:bg-bg-card focus:px-5 focus:py-3 focus:text-sm focus:text-accent focus:shadow-lg focus:outline-none"
    >
      ข้ามไปยังเนื้อหาหลัก
    </a>
  );
}
