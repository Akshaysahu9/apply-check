import Link from "next/link";
import { auth } from "@/auth";
import Button from "@/components/ui/Button";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { FileSearch, Briefcase, TrendingUp, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-ink">
          Good {getGreeting()}, {firstName}
        </h1>
        <p className="text-ink-muted mt-1">Resume scores and job matches</p>
      </div>

      <DashboardStats />

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: FileSearch, title: "Resume Analyzer", desc: "ATS score, role-fit, checklist & keyword tips", href: "/dashboard/analyze", cta: "Analyze now" },
          { icon: Briefcase, title: "Job Matching", desc: "10 sample listings with skill and experience breakdown", href: "/dashboard/jobs", cta: "View matches" },
          { icon: TrendingUp, title: "Improve Score", desc: "Follow the checklist to boost ATS compatibility", href: "/dashboard/analyze", cta: "Get tips" },
        ].map((card) => (
          <div key={card.title} className="bg-surface border border-border rounded-xl p-5 flex flex-col">
            <card.icon className="w-5 h-5 text-navy mb-3" />
            <h3 className="font-medium text-ink mb-1">{card.title}</h3>
            <p className="text-sm text-ink-muted flex-1 mb-4">{card.desc}</p>
            <Link href={card.href}>
              <Button variant="outline" size="sm" className="w-full">
                {card.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
