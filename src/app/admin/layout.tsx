
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check if we're on the login page by checking session
  // The middleware handles redirection, but the layout still wraps login
  // So we need to conditionally render the sidebar

  return <>{children}</>;
}
