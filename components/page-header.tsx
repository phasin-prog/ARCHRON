type PageHeaderProps = {
  kicker?: string;
  title: string;
  lead?: string;
};

export function PageHeader({ kicker, title, lead }: PageHeaderProps) {
  return (
    <header className="scroll-reveal mx-auto max-w-6xl px-6 pb-10 pt-20">
      {kicker ? (
        <p className="text-xs tracking-[0.05em] text-antique-gold">{kicker}</p>
      ) : null}
      <h1 className="mt-4 font-serif text-3xl text-ivory md:text-4xl">{title}</h1>
      {lead ? (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-soft-ivory">
          {lead}
        </p>
      ) : null}
    </header>
  );
}
