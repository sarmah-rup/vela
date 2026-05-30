// Dashboard content shell. The shared marketing header (SiteChrome) provides the
// main menu; this just frames the dashboard body.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-soft">
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
