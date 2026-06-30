// force-dynamic: ไม่ prerender ตอน build → publishableKey ต้องการเฉพาะตอน runtime
export const dynamic = "force-dynamic";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
