import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "@/components/auth/LoginForm";
import SessionProvider from "@/components/providers/SessionProvider";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <SessionProvider>
      <div className="min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 bg-navy text-white p-12 flex-col justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <span className="font-[family-name:var(--font-fraunces)] font-semibold text-xl">
              ApplyCheck
            </span>
          </Link>

          <div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold leading-tight mb-3">
              Resume checker for campus and off-campus hiring
            </h1>
            <p className="text-white/70 leading-relaxed max-w-md">
              I built this to quickly see if a resume has the right keywords and
              which jobs it lines up with. Upload a PDF and check the score.
            </p>
          </div>

          <p className="text-white/40 text-sm">No password · runs in browser</p>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 bg-paper">
          <div className="w-full max-w-sm">
            <div className="lg:hidden mb-8">
              <Link href="/" className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <span className="font-[family-name:var(--font-fraunces)] font-semibold text-xl text-ink">
                  ApplyCheck
                </span>
              </Link>
            </div>

            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-ink mb-2">
              Sign in
            </h2>
            <p className="text-ink-muted text-sm mb-6">
              Name and email is enough. Used only to show your name on the dashboard.
            </p>

            <LoginForm />

            <p className="text-sm text-ink-faint text-center mt-8">
              <Link href="/" className="hover:text-ink transition-colors">
                ← Back
              </Link>
            </p>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
