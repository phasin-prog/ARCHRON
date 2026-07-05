"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { routeCosmology, routeAccent } from "@/lib/content/cosmology";

// ตั้งค่า cosmology ทั้งบน <html> (data-cosmology) และ <body> (data-theme)
//  - data-cosmology → ขับ --cosmology-accent / --surface-tint / --border-tint / --glow-tint
//  - data-theme → ขับ --active-accent / --active-glow สำหรับ Codex component compat
//  - --accent → คงไว้สำหรับ utility ที่อ้างอิง accent ตรง ๆ (เข้ากันได้กับโค้ดเดิม)
// ทั้งเว็บไล่สีนุ่ม ๆ เมื่อเปลี่ยนหน้า
export function AccentController() {
  const pathname = usePathname();
  useEffect(() => {
    const cosmology = routeCosmology(pathname ?? "/");
    document.documentElement.setAttribute("data-cosmology", cosmology);
    document.documentElement.style.setProperty("--accent", routeAccent(pathname ?? "/"));
    document.body.setAttribute("data-theme", cosmology);
  }, [pathname]);
  return null;
}
