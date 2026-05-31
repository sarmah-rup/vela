// Dashboard shell. The shared marketing header (SiteChrome) sits above this and
// provides the top menu + its fixed-position padding; here we just set the app
// background. The sidebar + content split lives in dashboard-client.tsx.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[calc(100dvh-7rem)] bg-bg-soft">{children}</div>;
}
