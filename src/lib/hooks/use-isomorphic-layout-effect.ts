"use client";

import { useEffect, useLayoutEffect } from "react";

// useIsomorphicLayoutEffect — useLayoutEffect บน client, useEffect บน server
// กัน warning "useLayoutEffect does nothing on the server" เมื่อใช้กับ GSAP
// (GSAP ต้อง layout effect เพื่อคำนวณตำแหน่งก่อน paint → ไม่กระตุก)
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
