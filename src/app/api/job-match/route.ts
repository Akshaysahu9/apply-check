import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { analyzeResumeText } from "@/lib/resume-analyzer";
import { matchResumeToAllJobs, matchResumeToJob } from "@/lib/job-matcher";
import { ALL_SKILLS, JOB_LISTINGS } from "@/lib/skills";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { resumeText, jobId, customJobDescription } = body;

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Resume text is required for job matching." },
        { status: 400 }
      );
    }

    const analysis = analyzeResumeText(resumeText);

    if (jobId) {
      const job = JOB_LISTINGS.find((j) => j.id === jobId);
      if (!job) {
        return NextResponse.json({ error: "Job not found." }, { status: 404 });
      }
      const match = matchResumeToJob(analysis, job);
      return NextResponse.json({ success: true, match, analysis });
    }

    if (customJobDescription) {
      const jdLower = customJobDescription.toLowerCase();
      const requiredSkills = ALL_SKILLS.filter((skill) => {
        const norm = skill.replace(/\./g, "");
        return jdLower.includes(skill) || jdLower.includes(norm);
      });

      const customJob = {
        id: "custom",
        title: "Custom Role",
        company: "Your Target Company",
        location: "As specified",
        salary: "—",
        type: "—",
        posted: "Now",
        experience: "0–10 years",
        requiredSkills: requiredSkills.length > 0 ? requiredSkills.slice(0, 10) : ["communication", "problem solving", "teamwork"],
        preferredSkills: requiredSkills.slice(10, 15),
      };

      const match = matchResumeToJob(analysis, customJob);
      return NextResponse.json({ success: true, match, analysis });
    }

    const matches = matchResumeToAllJobs(analysis, JOB_LISTINGS);
    return NextResponse.json({ success: true, matches, analysis });
  } catch (error) {
    console.error("Job match error:", error);
    return NextResponse.json(
      { error: "Failed to match jobs. Please try again." },
      { status: 500 }
    );
  }
}
