import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell flex min-h-screen bg-char-ddd">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col overflow-x-auto bg-char-dd">{children}</main>
    </div>
  );
}
