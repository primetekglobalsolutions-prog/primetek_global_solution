import EmployeeSidebar from '@/components/employee/EmployeeSidebar';

export default function EmployeePortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface-alt">
      <EmployeeSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-border flex items-center px-6 shrink-0">
          <h2 className="text-lg font-heading font-bold text-navy-900">Employee Portal</h2>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
