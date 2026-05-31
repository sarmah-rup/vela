// Dashboard shell. The shared marketing header (SiteHeader) is fixed-position, so
// the app canvas clears it with pt-28 *inside* this gray surface — the background
// then runs flush up under the header (no colored band) and flush down to the
// footer (which sits gap-less on /dashboard). The sidebar + content split lives in
// dashboard-client.tsx.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-bg-soft pt-28">{children}</div>;
}
