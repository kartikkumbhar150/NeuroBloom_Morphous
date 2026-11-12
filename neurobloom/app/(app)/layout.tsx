export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="auth-layout">{children}</div>;
}
