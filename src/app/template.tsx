export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div id="main-content" tabIndex={-1} className="relative">
      {children}
    </div>
  );
}
