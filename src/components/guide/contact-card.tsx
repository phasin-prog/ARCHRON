import Link from "next/link";
import { CONTACT_CHANNELS, type ContactChannelItem } from "@/components/guide/types";
import { PersonIcon, SchoolIcon } from "@/components/icons";

function renderContactIcon(iconType: ContactChannelItem["icon"]) {
  switch (iconType) {
    case "call":
      return <span className="text-lg">📞</span>;
    case "chat":
      return <span className="text-lg">💬</span>;
    case "person":
      return <PersonIcon className="h-4 w-4" />;
    case "groups":
      return <SchoolIcon className="h-4 w-4" />;
  }
}

export function ContactSection() {
  return (
    <section id="contact" className="border-b border-border/30 bg-bg py-20 lg:py-24">
      <div className="tpl-reference text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent/85">
          ช่องทางติดต่อ
        </span>
        <h2 className="mt-3 font-serif text-3xl font-bold text-text-heading md:text-4xl">
          ติดต่อสอบถาม
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-text-secondary/85 md:text-base">
          สอบถามรายละเอียด ตรวจสอบคิวนัดหมาย หรือพูดคุยกับผู้ดูแลบริการได้โดยตรง
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {CONTACT_CHANNELS.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center gap-4 rounded-lg border border-border/40 bg-bg-card/75 p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:bg-bg-card hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent/5 text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-text-inverse">
                {renderContactIcon(channel.icon)}
              </span>
              <span className="flex flex-col">
                <span className="text-[10px] font-semibold tracking-wider text-text-secondary/60 uppercase">
                  {channel.label}
                </span>
                <span className="text-sm font-semibold text-text-heading group-hover:text-accent">
                  {channel.value}
                </span>
              </span>
            </a>
          ))}
        </div>

        <div className="mt-14 border-t border-border/30 pt-8 text-xs text-text-secondary/80">
          <span>ต้องการอ่านทฤษฎีก่อนเข้ารับการสัมภาษณ์? </span>
          <Link
            href="/concepts/psychological-types"
            className="font-semibold text-accent underline underline-offset-4 transition-colors hover:text-accent-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            อ่านเรื่อง Psychological Types
          </Link>
        </div>
      </div>
    </section>
  );
}
