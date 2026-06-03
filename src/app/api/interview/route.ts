import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateInterviewQuestions } from "@/services/ai";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const body = await req.json();
    const { resumeText, jobText, role } = body;

    if (!resumeText || !role) {
      return NextResponse.json(
        { error: "Resume text and target role are required." },
        { status: 400 }
      );
    }

    const customApiKey = req.headers.get("x-openai-key") || undefined;
    const jobDescriptionText = jobText || "";

    // Generate questions using AI
    const questions = await generateInterviewQuestions(resumeText, jobDescriptionText, role, customApiKey);

    // Save to DB if authenticated
    if (userId && prisma) {
      try {
        const lastResume = await prisma.resume.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" }
        });

        if (lastResume) {
          const questionCreates = questions.map(q => ({
            resumeId: lastResume.id,
            question: q.question,
            answer: q.answer,
            type: q.type,
            difficulty: q.difficulty,
            category: q.category,
            aiTip: q.aiTip
          }));
          
          await prisma.interviewQuestion.createMany({
            data: questionCreates
          });
        }
      } catch (dbError) {
        console.error("Database save failed during interview questions generation:", dbError);
      }
    }

    return NextResponse.json({
      message: "Interview questions generated successfully.",
      questions
    });

  } catch (error: any) {
    console.error("Interview questions route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during questions generation." },
      { status: 500 }
    );
  }
}
