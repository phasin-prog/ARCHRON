import { Breadcrumb, type BreadcrumbItem } from "@/components/breadcrumb";

type PageHeaderProps = {
  kicker?: string;
  title: string;
  lead?: string;
  breadcrumb?: BreadcrumbItem[];
};

export function PageHeader({ kicker, title, lead, breadcrumb }: PageHeaderProps) {
  return (
    <header className="scroll-reveal tpl-reference pb-10 pt-20">
      {breadcrumb && breadcrumb.length > 0 ? (
        <Breadcrumb items={breadcrumb} className="mb-6" />
      ) : null}
      {kicker ? (
        <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase transition-colors duration-700">{kicker}</p>
      ) : null}
      <h1 className="mt-4 font-serif text-3xl text-text-heading md:text-4xl">{title}</h1>
      {lead ? (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-body">
          {lead}
        </p>
      ) : null}
    </header>
  );
}
