import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Sidebar from "@/components/layout/Sidebar";
import SessionProvider from "@/components/providers/SessionProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        <Sidebar userName={session.user.name} userEmail={session.user.email} />
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-5xl">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}
