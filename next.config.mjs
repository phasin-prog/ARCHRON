/** @type {import('next').NextConfig} */
import createMDX from "@next/mdx";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // ระบุ workspace root ให้ Turbopack — เลี่ยงการสแกนหา lockfile ขึ้นไปใน parent directory
  turbopack: {
    root: __dirname,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
