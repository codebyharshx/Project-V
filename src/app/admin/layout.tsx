export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Passthrough: auth and sidebar are in (dashboard)/layout.tsx so /admin/login is not wrapped
  return <>{children}</>
}
