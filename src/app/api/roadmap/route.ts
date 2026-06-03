import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateRoadmap } from "@/services/ai";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const body = await req.json();
    const { missingSkills, role } = body;

    if (!role) {
      return NextResponse.json(
        { error: "Target role is required." },
        { status: 400 }
      );
    }

    const customApiKey = req.headers.get("x-openai-key") || undefined;
    const skillsArray = missingSkills && Array.isArray(missingSkills) ? missingSkills : [];

    // Call AI roadmap generation service
    const roadmap = await generateRoadmap(skillsArray, role, customApiKey);

    // Save to DB if authenticated
    if (userId && prisma) {
      try {
        // Look up last resume for this user to link
        const lastResume = await prisma.resume.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" }
        });

        if (lastResume) {
          await prisma.roadmap.create({
            data: {
              resumeId: lastResume.id,
              targetRole: role,
              beginner: roadmap.beginner as any,
              intermediate: roadmap.intermediate as any,
              advanced: roadmap.advanced as any
            }
          });
        }
      } catch (dbError) {
        console.error("Database save failed during roadmap generation:", dbError);
      }
    }

    return NextResponse.json({
      message: "Roadmap generated successfully.",
      roadmap
    });

  } catch (error: any) {
    console.error("Roadmap route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during roadmap creation." },
      { status: 500 }
    );
  }
}
