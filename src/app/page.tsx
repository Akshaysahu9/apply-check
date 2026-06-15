import Link from "next/link";
import { auth } from "@/auth";
import Button from "@/components/ui/Button";
import { FileSearch, Target, BarChart3, Shield, ArrowRight } from "lucide-react";

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <span className="font-[family-name:var(--font-fraunces)] font-semibold text-xl text-ink">
              ApplyCheck
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/dashboard">
                <Button>Open Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link href="/login">
                  <Button>Try it</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-20">
          <div className="max-w-2xl">
            <p className="text-sm text-ink-muted mb-3">
              Resume checker + job match tool
            </p>
            <h1 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl font-semibold text-ink leading-tight mb-5">
              Check your resume before sending it out
            </h1>
            <p className="text-base text-ink-muted leading-relaxed mb-8 max-w-lg">
              Upload a PDF, get an ATS score, see which skills show up, and compare
              your profile against openings at companies like Razorpay, Flipkart, and Swiggy.
            </p>
            <div className="flex items-center gap-4">
              <Link href={session ? "/dashboard" : "/login"}>
                <Button size="lg">
                  Upload resume
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#features" className="text-sm text-ink-muted hover:text-ink transition-colors">
                What it does
              </Link>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-4">
            {[
              { value: "PDF", label: "Upload format" },
              { value: "10", label: "Sample job listings" },
              { value: "4", label: "Score breakdowns" },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface border border-border rounded-xl p-5">
                <p className="text-2xl font-semibold text-navy font-[family-name:var(--font-fraunces)]">
                  {stat.value}
                </p>
                <p className="text-sm text-ink-faint mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="bg-surface border-y border-border py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-ink mb-10">
              Main features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: FileSearch,
                  title: "Resume scan",
                  desc: "Pulls text from PDF, scores ATS readiness, and lists skills it finds.",
                },
                {
                  icon: Target,
                  title: "Job match",
                  desc: "Shows how your skills line up with each role — including what's missing.",
                },
                {
                  icon: BarChart3,
                  title: "Gap report",
                  desc: "Tells you which keywords or sections to add before you apply.",
                },
                {
                  icon: Shield,
                  title: "Private",
                  desc: "Analysis runs on upload. History is stored in your browser only.",
                },
              ].map((feature) => (
                <div key={feature.title} className="p-5 rounded-xl border border-border">
                  <feature.icon className="w-5 h-5 text-navy mb-3" />
                  <h3 className="font-medium text-ink mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-ink mb-3">
            Give it a shot
          </h2>
          <p className="text-ink-muted mb-6 max-w-md mx-auto text-sm">
            Takes a minute to set up. Just name and email — no password.
          </p>
          <Link href="/login">
            <Button size="lg">Sign in and upload</Button>
          </Link>
        </section>
      </main>

      <footer className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-6 text-sm text-ink-faint">
          <span>© 2026 ApplyCheck</span>
        </div>
      </footer>
    </div>
  );
}
