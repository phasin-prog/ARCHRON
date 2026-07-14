import type { ImgHTMLAttributes } from "react";

// คอมโพเนนต์แสดงผลรูปภาพ พร้อม Lazy Load, ขอบมน และคำบรรยายใต้ภาพ (<figcaption>) อัตโนมัติเมื่อมี alt หรือ title
export function ResponsiveImage({ src, alt, title, className = "", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  if (!src) return null;

  const captionText = (title || alt || "").trim();

  return (
    <figure className="my-7 flex flex-col items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || "ภาพประกอบบทความ"}
        title={title}
        loading="lazy"
        decoding="async"
        className={`max-h-[600px] max-w-full rounded-xl border border-border/70 bg-bg-card object-contain shadow-md transition-all hover:shadow-lg ${className}`}
        {...props}
      />
      {captionText && (
        <figcaption className="mt-2.5 max-w-2xl text-center text-xs italic leading-relaxed text-text-secondary">
          {captionText}
        </figcaption>
      )}
    </figure>
  );
}
