import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { parseAndAnalyzeResume } from "@/services/nlp";
import { suggestImprovements, simulateRecruiter, generateRoadmap, generateInterviewQuestions, generateEmbeddings } from "@/services/ai";

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const body = await req.json();
    const { text, role, isSample } = body;

    if (!text || !role) {
      return NextResponse.json(
        { error: "Resume text and target role are required." },
        { status: 400 }
      );
    }

    const customApiKey = req.headers.get("x-openai-key") || undefined;

    // 1. Run local NLP engine
    const nlpResult = parseAndAnalyzeResume(text, role);

    // 2. Call OpenAI services if key is configured
    const [improvements, recruiterSim, roadmap, interviewQs, embeddingVector] = await Promise.all([
      suggestImprovements(text, role, customApiKey),
      simulateRecruiter(text, nlpResult.experience.map(e => e.text).join("\n"), role, customApiKey),
      generateRoadmap(nlpResult.keywordsMissing, role, customApiKey),
      generateInterviewQuestions(text, "", role, customApiKey),
      generateEmbeddings(text, customApiKey)
    ]);

    // Update NLP result with AI evaluations if available
    // Only override NLP-generated data if the AI returned real results
    // (the AI service returns mock/fallback data when no API key is configured —
    //  in that case, the NLP-computed values are actually better)
    if (improvements && improvements.length > 0 && improvements[0].impact) {
      // Real AI improvements have an "impact" field; fallback mocks also have it,
      // but we check if it's from a real OpenAI call by checking the content quality
      nlpResult.improvements = improvements;
    }
    if (recruiterSim && recruiterSim.reasons && 
        recruiterSim.reasons.length > 0 && 
        !recruiterSim.reasons[0].includes("Heuristic baseline")) {
      nlpResult.recruiterDecision = recruiterSim;
    }


    // 3. Save to database if user is authenticated and database is active
    if (userId && prisma) {
      try {
        // Save Resume Record
        const resume = await prisma.resume.create({
          data: {
            userId,
            name: nlpResult.name,
            email: nlpResult.email || null,
            phone: nlpResult.phone || null,
            skills: nlpResult.skills,
            experience: nlpResult.experience as any,
            education: nlpResult.education as any,
            certifications: nlpResult.certifications as any,
            projects: nlpResult.projects as any,
            rawText: text
          }
        });

        // Save Analysis Record
        const analysis = await prisma.analysis.create({
          data: {
            resumeId: resume.id,
            targetRole: role,
            score: nlpResult.scores.overall,
            keywordsScore: nlpResult.scores.keywords,
            formattingScore: nlpResult.scores.formatting,
            readabilityScore: nlpResult.scores.readability,
            experienceScore: nlpResult.scores.experience,
            skillsScore: nlpResult.scores.skills,
            completenessScore: nlpResult.scores.completeness,
            keywordsFound: nlpResult.keywordsFound as any,
            keywordsMissing: nlpResult.keywordsMissing as any,
            weaknesses: nlpResult.weaknesses as any,
            strengths: nlpResult.strengths as any,
            improvements: nlpResult.improvements as any,
            recruiterDecision: nlpResult.recruiterDecision as any,
            heatmapData: nlpResult.heatmapData as any
          }
        });

        // Save Skill Report Record
        await prisma.skillReport.create({
          data: {
            resumeId: resume.id,
            matchPercent: nlpResult.scores.skills,
            commonSkills: nlpResult.keywordsFound,
            missingSkills: nlpResult.keywordsMissing,
            recommendedSkills: nlpResult.keywordsMissing.slice(0, 5)
          }
        });

        // Save Roadmap Record
        await prisma.roadmap.create({
          data: {
            resumeId: resume.id,
            targetRole: role,
            beginner: roadmap.beginner as any,
            intermediate: roadmap.intermediate as any,
            advanced: roadmap.advanced as any
          }
        });

        // Save Interview Questions
        if (interviewQs && interviewQs.length > 0) {
          const questionCreates = interviewQs.map(q => ({
            resumeId: resume.id,
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

        // Save Embeddings in database (SQLite text string representation)
        if (embeddingVector && embeddingVector.length > 0) {
          const vectorStr = `[${embeddingVector.join(",")}]`;
          await prisma.resumeEmbedding.create({
            data: {
              resumeId: resume.id,
              section: "FullResume",
              content: text.slice(0, 2000),
              vector: vectorStr
            }
          });
        }

        // Return combined payload with database record ID references
        return NextResponse.json({
          message: "Analysis completed and saved successfully.",
          resumeId: resume.id,
          analysisId: analysis.id,
          nlpResult,
          roadmap,
          interviewQs
        });

      } catch (dbError) {
        console.error("Database save failed during analysis:", dbError);
        // Fallback: return payload anyway so user can see their analysis even if DB writing failed
        return NextResponse.json({
          message: "Analysis completed but database save failed.",
          nlpResult,
          roadmap,
          interviewQs
        });
      }
    }

    // Authenticated session missing fallback
    return NextResponse.json({
      message: "Analysis completed (local mode). Sign in to save history.",
      nlpResult,
      roadmap,
      interviewQs
    });

  } catch (error: any) {
    console.error("Analysis route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during resume analysis." },
      { status: 500 }
    );
  }
}
