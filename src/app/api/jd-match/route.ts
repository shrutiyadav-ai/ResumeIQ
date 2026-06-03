import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { matchJobDescription } from "@/services/ai";
import { ROLE_KEYWORDS } from "@/services/nlp";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const body = await req.json();
    const { resumeText, jobText, role } = body;

    if (!resumeText || !jobText || !role) {
      return NextResponse.json(
        { error: "Resume content, job description, and target role are required." },
        { status: 400 }
      );
    }

    const customApiKey = req.headers.get("x-openai-key") || undefined;

    // 1. Run OpenAI semantic matching
    const matchResult = await matchJobDescription(resumeText, jobText, role, customApiKey);

    // 2. Perform local NLP token parsing for skill lists
    const lowercaseResume = resumeText.toLowerCase();
    const lowercaseJob = jobText.toLowerCase();

    const roleConfig = ROLE_KEYWORDS[role] || ROLE_KEYWORDS["Software Engineer"];
    const allRoleSkills = roleConfig.skills;

    const sharedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const skill of allRoleSkills) {
      const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "i");
      
      const inResume = regex.test(lowercaseResume);
      const inJob = regex.test(lowercaseJob);

      if (inResume && inJob) {
        sharedSkills.push(skill);
      } else if (inJob && !inResume) {
        missingSkills.push(skill);
      }
    }

    // Recommended list (skills in role configuration but missing from resume, sorted by importance)
    const recommendedSkills = missingSkills.slice(0, 4);

    // 3. Persist search in Database if user logged in
    if (userId && prisma) {
      try {
        const jdRecord = await prisma.jobDescription.create({
          data: {
            userId,
            title: role,
            company: "Target Match Company",
            jdText: jobText,
            targetSkills: allRoleSkills
          }
        });

        // Save Skill Report
        await prisma.skillReport.create({
          data: {
            resumeId: "mock-or-last", // will be saved in history or mapped to active user profile
            jobDescriptionId: jdRecord.id,
            matchPercent: matchResult.matchScore,
            commonSkills: sharedSkills,
            missingSkills: missingSkills,
            recommendedSkills: recommendedSkills
          }
        });
      } catch (dbError) {
        console.error("Database save failed during JD match:", dbError);
      }
    }

    return NextResponse.json({
      message: "Job description matching completed successfully.",
      matchResult,
      sharedSkills,
      missingSkills,
      recommendedSkills
    });

  } catch (error: any) {
    console.error("JD Match route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during job matching." },
      { status: 500 }
    );
  }
}
