export interface ParsedSection {
  name: string;
  text: string;
  level: "strong" | "average" | "weak";
  reasons: string[];
}

export interface NLPAnalysisResult {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: Array<{ company: string; role: string; period: string; description: string; text: string }>;
  education: Array<{ school: string; degree: string; period: string; text: string }>;
  projects: Array<{ title: string; description: string; text: string }>;
  certifications: string[];
  scores: {
    overall: number;
    keywords: number;
    formatting: number;
    readability: number;
    experience: number;
    skills: number;
    completeness: number;
  };
  keywordsFound: string[];
  keywordsMissing: string[];
  strengths: string[];
  weaknesses: string[];
  improvements: Array<{ section: string; weak: string; improved: string }>;
  recruiterDecision: {
    shortlist: boolean;
    confidence: number;
    reasons: string[];
    concerns: string[];
  };
  heatmapData: ParsedSection[];
}

// Role-specific keyword dictionaries
export const ROLE_KEYWORDS: Record<string, { skills: string[]; keywords: string[] }> = {
  "Software Engineer": {
    skills: ["React", "Next.js", "TypeScript", "Node.js", "JavaScript", "Python", "Docker", "Kubernetes", "AWS", "SQL", "Git", "CI/CD", "REST APIs", "GraphQL", "NoSQL", "System Design", "Go", "Java", "C++"],
    keywords: ["scalab", "latency", "microservice", "test", "integrat", "refactor", "performance", "deploy", "database", "agile", "api", "frontend", "backend", "cloud", "monitor", "optimi", "architect", "component", "migrat", "debug"]
  },
  "ML Engineer": {
    skills: ["Python", "TensorFlow", "PyTorch", "Scikit-Learn", "NumPy", "Pandas", "MLOps", "Deep Learning", "Machine Learning", "Transformers", "NLP", "Computer Vision", "Docker", "PySpark", "CUDA", "LLMs", "Vector Databases", "Git"],
    keywords: ["embed", "hyperparameter", "inference", "feature engineer", "pipeline", "validat", "fine-tun", "gradient", "neural", "tensor", "reinforcement", "train", "accura", "dataset", "predict", "classif", "model", "optimi"]
  },
  "Data Scientist": {
    skills: ["Python", "R", "SQL", "Machine Learning", "Statistics", "Probability", "Tableau", "PowerBI", "Pandas", "NumPy", "Regression", "Clustering", "A/B Testing", "Data Visualization", "Big Data", "Spark", "Hadoop"],
    keywords: ["hypothesis", "exploratory", "predictive", "random forest", "decision tree", "data clean", "statistic", "metric", "time series", "correlat", "analy", "insight", "dashboard", "data-driven", "visualiz"]
  },
  "Devops Engineer": {
    skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Jenkins", "Linux", "Bash", "Ansible", "CloudFormation", "Prometheus", "Grafana", "Git"],
    keywords: ["automation", "pipeline", "infrastructure", "deployment", "container", "orchestration", "cloud", "scaling", "monitoring", "configuration"]
  },
  "Cybersecurity Specialist": {
    skills: ["Penetration Testing", "Wireshark", "Cryptography", "Firewalls", "SIEM", "Network Security", "Vulnerability Assessment", "Linux", "OWASP", "Metasploit"],
    keywords: ["threat", "vulnerability", "incident response", "compliance", "audit", "breach", "firewall", "encryption", "protocol", "mitigation"]
  },
  "UX/UI Designer": {
    skills: ["Figma", "Adobe XD", "Wireframing", "Prototyping", "User Research", "Information Architecture", "Usability Testing", "HTML/CSS", "Visual Design"],
    keywords: ["user experience", "interface", "wireframe", "prototype", "persona", "flow", "design system", "component", "usability", "accessibility"]
  },
  "Product Manager": {
    skills: ["Product Strategy", "Roadmap", "Agile", "Scrum", "Product Lifecycle", "A/B Testing", "Analytics", "User Research", "SQL", "Customer Feedback", "Wireframing", "Jira", "Confluence", "Market Analysis", "KPIs"],
    keywords: ["user stor", "cross-functional", "market", "product launch", "revenue", "conversion", "engagement", "prioriti", "stakeholder", "requirement", "sprint", "backlog", "roadmap"]
  },
  "Business Analyst": {
    skills: ["SQL", "Excel", "Tableau", "PowerBI", "Business Intelligence", "Requirements Gathering", "Process Mapping", "Agile", "User Stories", "Data Analysis", "SWOT Analysis", "Financial Modeling", "Jira"],
    keywords: ["requirement", "use case", "gap analysis", "stakeholder", "workflow", "process optimi", "cost-benefit", "dashboard", "analy", "document", "report"]
  },
  "Project Manager": {
    skills: ["Scrum", "Agile", "JIRA", "PMP", "Risk Management", "Budgeting", "Scheduling", "Stakeholder Management", "MS Project", "Trello"],
    keywords: ["sprint", "delivery", "stakeholder", "timeline", "resource", "scope", "roadmap", "milestone", "mitigation", "coordination"]
  },
  "Marketing Manager": {
    skills: ["SEO", "SEM", "Google Analytics", "Content Marketing", "Social Media Marketing", "Email Marketing", "Brand Strategy", "Copywriting", "HubSpot", "CRM"],
    keywords: ["campaign", "conversion", "traffic", "acquisition", "engagement", "optimization", "brand", "analytics", "lead", "growth"]
  },
  "HR Specialist": {
    skills: ["Talent Acquisition", "Employee Relations", "Onboarding", "Recruiting", "Conflict Resolution", "HRIS", "Compliance", "Performance Management"],
    keywords: ["recruitment", "sourcing", "retention", "policy", "interview", "workforce", "performance", "engagement", "relations", "benefits"]
  },
  "Financial Analyst": {
    skills: ["Financial Modeling", "Excel", "Valuation", "Data Analysis", "SQL", "Python", "Portfolio Management", "Budgeting", "Forecasting", "Accounting"],
    keywords: ["forecast", "budget", "revenue", "cost", "cash flow", "variance", "market", "portfolio", "risk", "profitability"]
  },
  "Sales Executive": {
    skills: ["Lead Generation", "CRM", "Salesforce", "Negotiation", "Account Management", "Cold Calling", "Presentation", "Customer Relationship Management"],
    keywords: ["pipeline", "quota", "conversion", "deal", "revenue", "customer", "lead", "pitch", "negotiation", "closing"]
  },
  "Operations Manager": {
    skills: ["Process Optimization", "Supply Chain Management", "Logistics", "Budgeting", "Project Management", "Quality Control", "Lean Six Sigma"],
    keywords: ["process", "efficiency", "supply chain", "logistics", "vendor", "cost reduction", "workflow", "optimization", "resource allocation"]
  },
  "Content Writer": {
    skills: ["Copywriting", "SEO", "Content Strategy", "Editing", "Proofreading", "Creative Writing", "WordPress", "Technical Writing", "Research"],
    keywords: ["article", "blog", "search engine", "editing", "storytelling", "audience", "newsletter", "publication", "style guide"]
  }
};

const ACTION_VERBS = [
  "designed", "developed", "engineered", "implemented", "spearheaded", "optimized", "managed",
  "delivered", "increased", "decreased", "reduced", "improved", "launched", "coordinated",
  "created", "led", "architected", "streamlined", "automated", "facilitated", "mentored",
  "built", "maintained", "deployed", "scaled", "integrated", "configured", "analyzed",
  "established", "migrated", "resolved", "collaborated", "drove", "pioneered", "refactored"
];

const WEAK_PHRASES = [
  { weak: "worked on web development", improved: "Developed responsive React components, boosting client loading speed by 25%" },
  { weak: "responsible for maintaining software", improved: "Spearheaded bug reduction, lowering crash rates by 15% through Jest unit test coverage" },
  { weak: "helped in team projects", improved: "Coordinated cross-functional tasks with 5 members to deliver features 2 weeks ahead of schedule" },
  { weak: "handled databases", improved: "Architected PostgreSQL schema normalization, lowering query latency by 40% through indexing" },
  { weak: "did analysis of data", improved: "Designed automated Tableau dashboards displaying weekly retention cohorts, driving 8% user growth" },
  { weak: "responsible for", improved: "Owned and delivered" },
  { weak: "helped with", improved: "Co-led and implemented" },
  { weak: "worked with", improved: "Collaborated with cross-functional teams to" },
  { weak: "was involved in", improved: "Drove key initiatives for" },
  { weak: "assisted in", improved: "Contributed to and co-delivered" }
];

export function parseAndAnalyzeResume(text: string, selectedRole: string): NLPAnalysisResult {
  const lowercaseText = text.toLowerCase();
  
  // 1. Extract contact info using basic regexes
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  
  const emails = text.match(emailRegex) || [];
  const phones = text.match(phoneRegex) || [];
  
  const email = emails[0] || "";
  const phone = phones[0] || "";
  
  // Extract Name (Heuristic: first non-empty lines, looking for capital words)
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  let name = "Anonymous User";
  if (lines.length > 0) {
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      // Look for lines that look like names: 2-4 words, mostly capitalized, no URLs/emails
      if (
        line.split(/\s+/).length >= 2 && 
        line.split(/\s+/).length <= 5 &&
        !/email|phone|resume|curriculum|contact|profile|summary|objective|@|http/i.test(line) &&
        line.length < 50
      ) {
        name = line;
        break;
      }
    }
  }

  // 2. Segment Sections
  const sectionKeywords = {
    summary: ["summary", "professional summary", "career summary", "about", "about me", "objective", "career objective", "profile", "personal profile", "executive summary", "introduction"],
    experience: ["experience", "work experience", "professional experience", "employment", "employment history", "work history", "career history", "relevant experience", "professional background"],
    education: ["education", "academic background", "academic qualifications", "academics", "educational background", "educational qualifications", "education history", "academic profile"],
    skills: ["skills", "technical skills", "core skills", "key skills", "technologies", "expertise", "tech stack", "tools", "skills & tools", "skills and tools", "core competencies", "areas of expertise", "technologies & tools", "technologies and tools"],
    projects: ["projects", "academic projects", "personal projects", "featured projects", "technical projects", "key projects", "side projects", "portfolio", "project work", "selected projects"],
    certifications: ["certifications", "certs", "licenses", "awards", "achievements", "licenses & certifications", "licenses and certifications", "certifications & awards", "certifications and awards"]
  };

  const sections: Record<string, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  };

  let currentSection = "summary";
  for (const line of lines) {
    let sectionChanged = false;
    const cleanLine = line
      .trim()
      .toLowerCase()
      .replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, "") // Remove leading/trailing non-alphanumeric chars (like bullets, colons, hashes)
      .trim();

    for (const [key, keywords] of Object.entries(sectionKeywords)) {
      if (keywords.includes(cleanLine) && line.length < 50) {
        currentSection = key;
        sectionChanged = true;
        break;
      }
    }
    if (!sectionChanged) {
      if (sections[currentSection]) {
        sections[currentSection].push(line);
      }
    }
  }

  const expText = sections.experience.join("\n");
  const eduText = sections.education.join("\n");
  const skillsText = sections.skills.join("\n");
  const projText = sections.projects.join("\n");
  const certText = sections.certifications.join("\n");
  const summaryText = sections.summary.join("\n");

  // 3. Parse Skills: scan the entire document for known skills
  const roleConfig = ROLE_KEYWORDS[selectedRole] || ROLE_KEYWORDS["Software Engineer"];
  
  // Build a combined skill pool from the target role + generic skills
  const allKnownSkills = new Set<string>();
  for (const config of Object.values(ROLE_KEYWORDS)) {
    for (const s of config.skills) allKnownSkills.add(s);
  }

  const skillsFound: string[] = [];
  for (const skill of allKnownSkills) {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(text)) {
      skillsFound.push(skill);
    }
  }

  // Target role skills matching
  const targetRoleSkills = roleConfig.skills;
  const foundRoleSkills = targetRoleSkills.filter(s => skillsFound.includes(s));
  const missingSkills = targetRoleSkills.filter(s => !skillsFound.includes(s));

  // 4. Keywords Evaluation — use stem-based matching for flexibility
  const keywordsFound: string[] = [];
  const keywordsMissing: string[] = [];
  for (const kw of roleConfig.keywords) {
    // Use case-insensitive substring search for keyword stems
    if (lowercaseText.includes(kw.toLowerCase())) {
      keywordsFound.push(kw);
    } else {
      keywordsMissing.push(kw);
    }
  }

  // Also count matching role skills as bonus keywords (skills that match role requirements)
  const bonusKeywordsFromSkills = foundRoleSkills.length;

  // 5. Structure Experience
  const expItems: Array<{ company: string; role: string; period: string; description: string; text: string }> = [];
  const expLines = sections.experience;
  let currentExp = { company: "", role: "", period: "", description: [] as string[] };
  
  for (const line of expLines) {
    // Detect role/title lines: contain role keywords and are relatively short
    const roleMatch = line.match(/(engineer|developer|manager|scientist|analyst|intern|lead|consultant|designer|architect|specialist|associate|director|coordinator)/i);
    const dateMatch = line.match(/(\d{4}|present|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
    
    // A line with both a role keyword and a date is likely a job title line
    if (roleMatch && dateMatch && line.length < 100) {
      if (currentExp.role) {
        expItems.push({
          company: currentExp.company || "Company",
          role: currentExp.role,
          period: currentExp.period || "N/A",
          description: currentExp.description.join("\n"),
          text: currentExp.role + "\n" + currentExp.description.join("\n")
        });
        currentExp = { company: "", role: "", period: "", description: [] as string[] };
      }
      currentExp.role = line;
      // Try to extract period from the same line
      const periodMatch = line.match(/\(([^)]+)\)/);
      if (periodMatch) currentExp.period = periodMatch[1];
    } else if (roleMatch && line.length < 60 && !currentExp.role) {
      currentExp.role = line;
    } else if (dateMatch && line.length < 30 && !currentExp.period) {
      currentExp.period = line;
    } else if (line.length > 0) {
      if (!currentExp.role && line.length < 50 && !line.startsWith("*") && !line.startsWith("-") && !line.startsWith("•")) {
        currentExp.company = line;
      } else {
        currentExp.description.push(line);
      }
    }
  }
  if (currentExp.role) {
    expItems.push({
      company: currentExp.company || "Company",
      role: currentExp.role,
      period: currentExp.period || "N/A",
      description: currentExp.description.join("\n"),
      text: currentExp.role + "\n" + currentExp.description.join("\n")
    });
  }

  // Fallback if parser extracted nothing
  if (expItems.length === 0 && expText.length > 50) {
    expItems.push({
      company: "Various Companies",
      role: selectedRole,
      period: "Timeline Included",
      description: expText,
      text: expText
    });
  }

  // 6. Structure Education
  const eduItems: Array<{ school: string; degree: string; period: string; text: string }> = [];
  const eduLines = sections.education;
  let currentEdu = { school: "", degree: "", period: "", text: [] as string[] };
  for (const line of eduLines) {
    if (/university|college|school|institute|academy/i.test(line)) {
      if (currentEdu.school) {
        eduItems.push({
          school: currentEdu.school,
          degree: currentEdu.degree || "Bachelor's Degree",
          period: currentEdu.period || "N/A",
          text: currentEdu.text.join("\n")
        });
        currentEdu = { school: "", degree: "", period: "", text: [] as string[] };
      }
      currentEdu.school = line;
      currentEdu.text.push(line);
      // Try extracting period from same line
      const periodMatch = line.match(/\(([^)]+)\)/);
      if (periodMatch) currentEdu.period = periodMatch[1];
    } else if (/bachelor|master|phd|bs|ms|b\.s|m\.s|degree|diploma|mba/i.test(line)) {
      currentEdu.degree = line;
      currentEdu.text.push(line);
      const periodMatch = line.match(/\(([^)]+)\)/);
      if (periodMatch && !currentEdu.period) currentEdu.period = periodMatch[1];
    } else if (/(\d{4}|present|graduated)/i.test(line) && line.length < 30) {
      currentEdu.period = line;
    } else {
      currentEdu.text.push(line);
    }
  }
  if (currentEdu.school || currentEdu.degree) {
    eduItems.push({
      school: currentEdu.school || "Academic Institution",
      degree: currentEdu.degree || "Degree",
      period: currentEdu.period || "N/A",
      text: currentEdu.text.join("\n")
    });
  }

  // Fallback
  if (eduItems.length === 0 && eduText.length > 20) {
    eduItems.push({
      school: "Academic Institution",
      degree: "Degree / Certification",
      period: "Completed",
      text: eduText
    });
  }

  // 7. Parse Projects
  const projItems: Array<{ title: string; description: string; text: string }> = [];
  if (projText.length > 20) {
    // Try to split multiple projects
    const projLines = sections.projects;
    let currentProj = { title: "", desc: [] as string[] };
    for (const line of projLines) {
      // Lines that look like titles: short, no bullet, possibly bold
      if (line.length < 60 && !line.startsWith("*") && !line.startsWith("-") && !line.startsWith("•") && currentProj.desc.length > 0) {
        projItems.push({ title: currentProj.title || "Project", description: currentProj.desc.join("\n"), text: currentProj.desc.join("\n") });
        currentProj = { title: line, desc: [] };
      } else if (!currentProj.title && line.length < 60) {
        currentProj.title = line;
      } else {
        currentProj.desc.push(line);
      }
    }
    if (currentProj.title || currentProj.desc.length > 0) {
      projItems.push({ title: currentProj.title || "Featured Project", description: currentProj.desc.join("\n"), text: currentProj.desc.join("\n") });
    }
    if (projItems.length === 0) {
      projItems.push({ title: "Featured Project", description: projText, text: projText });
    }
  }

  // Certifications
  const certs: string[] = certText.split("\n").map(c => c.trim()).filter(c => c.length > 3 && c.length < 80);

  // 8. Scoring — calibrated for realistic resume evaluation

  // Skills Score: what percentage of role-specific skills does the candidate have?
  const totalRoleSkills = roleConfig.skills.length;
  const foundRoleSkillsCount = foundRoleSkills.length;
  // Use a curve: having 50%+ of role skills is already good
  const rawSkillPercent = foundRoleSkillsCount / totalRoleSkills;
  const skillsScore = Math.min(100, Math.round(rawSkillPercent * 120)); // Boost to reward partial matches

  // Keywords Score: how many role keywords appear in the resume?
  // Also factor in matching skills as a bonus (skills are effectively keywords too)
  const totalKeywords = roleConfig.keywords.length;
  const foundKeywordsCount = keywordsFound.length;
  const effectiveKeywordMatches = foundKeywordsCount + Math.round(bonusKeywordsFromSkills * 0.3); // Skills give partial keyword credit
  const rawKeywordPercent = effectiveKeywordMatches / Math.max(1, totalKeywords);
  const keywordScore = Math.min(100, Math.round(rawKeywordPercent * 120));


  // Formatting score: based on structure quality
  const bulletCount = (text.match(/^[•\-\*]/gm) || []).length;
  const hasMetricsBullets = (text.match(/\d+%/g) || []).length;
  const sectionCount = Object.values(sections).filter(s => s.length > 0).length;
  const formattingScore = Math.min(100, 
    30 + 
    (sectionCount >= 4 ? 25 : sectionCount * 6) +
    (email ? 10 : 0) + 
    (phone ? 5 : 0) + 
    Math.min(20, bulletCount * 3) + 
    Math.min(10, hasMetricsBullets * 5)
  );

  // Readability score
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const totalWords = words.length;
  let readabilityScore = 85;
  if (totalWords < 100) readabilityScore -= 35;
  else if (totalWords < 200) readabilityScore -= 15;
  if (totalWords > 1500) readabilityScore -= 10;
  // Penalize very long paragraphs without bullets in experience
  const longDenseLines = sections.experience.filter(line => line.length > 200 && !line.startsWith("•") && !line.startsWith("-") && !line.startsWith("*"));
  if (longDenseLines.length > 0) readabilityScore -= 8;
  // Reward good line length distribution
  const avgLineLength = lines.length > 0 ? lines.reduce((s, l) => s + l.length, 0) / lines.length : 0;
  if (avgLineLength > 30 && avgLineLength < 120) readabilityScore += 5;
  readabilityScore = Math.max(0, Math.min(100, readabilityScore));

  // Experience Score: depth + action verbs + metrics
  const actionVerbCount = ACTION_VERBS.filter(v => lowercaseText.includes(v)).length;
  const hasMetrics = /\b(\d{1,3}%|\d+\+?(\s?million|\s?k|x|\s?users|%))\b/i.test(text);
  const expWordCount = expText.split(/\s+/).length;
  const experienceScore = Math.min(100, 
    20 + 
    Math.min(30, actionVerbCount * 5) + 
    (hasMetrics ? 15 : 0) +
    (expWordCount > 100 ? 20 : Math.round(expWordCount / 5)) +
    (expItems.length >= 2 ? 10 : 0) +
    Math.min(5, bulletCount)
  );

  // Section completeness (exclude summary from scoring as it's optional)
  const coreSections = ["experience", "education", "skills"];
  const bonusSections = ["projects", "certifications"];
  const corePresent = coreSections.filter(k => sections[k].length > 0).length;
  const bonusPresent = bonusSections.filter(k => sections[k].length > 0).length;
  const completenessScore = Math.round(
    (corePresent / coreSections.length) * 80 + 
    (bonusPresent / bonusSections.length) * 20
  );

  // Overall Score — weighted combination
  const overall = Math.round(
    keywordScore * 0.20 +
    formattingScore * 0.10 +
    readabilityScore * 0.10 +
    experienceScore * 0.25 +
    skillsScore * 0.25 +
    completenessScore * 0.10
  );

  // 9. Strengths & Weaknesses — more generous thresholds
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const improvements: Array<{ section: string; weak: string; improved: string }> = [];

  // Skills-based feedback
  if (foundRoleSkillsCount >= Math.ceil(totalRoleSkills * 0.5)) {
    strengths.push(`Strong technology stack alignment — ${foundRoleSkillsCount} of ${totalRoleSkills} target ${selectedRole} skills detected.`);
  } else if (foundRoleSkillsCount >= Math.ceil(totalRoleSkills * 0.3)) {
    weaknesses.push(`Partial skills match (${foundRoleSkillsCount}/${totalRoleSkills}). Consider adding: ${missingSkills.slice(0, 4).join(", ")}.`);
  } else {
    weaknesses.push(`Missing core technologies for ${selectedRole}. Add: ${missingSkills.slice(0, 5).join(", ")}.`);
  }

  // Keywords feedback
  if (foundKeywordsCount >= Math.ceil(totalKeywords * 0.4)) {
    strengths.push("Good usage of industry-specific keywords, improving search visibility in ATS scanners.");
  } else {
    weaknesses.push("ATS keyword density is low. Incorporate terms like: " + keywordsMissing.slice(0, 4).join(", ") + ".");
  }

  // Action verbs
  if (actionVerbCount >= 5) {
    strengths.push("Strong usage of action verbs conveying leadership and direct impact.");
  } else if (actionVerbCount >= 3) {
    strengths.push("Adequate action verb usage. Consider adding more impactful verbs like 'spearheaded', 'architected', or 'optimized'.");
  } else {
    weaknesses.push("Experience section uses passive phrasing. Start bullets with verbs like 'Engineered', 'Spearheaded', or 'Optimized'.");
  }

  // Metrics
  if (hasMetrics) {
    strengths.push("Effective use of quantifiable achievements and data metrics to demonstrate impact.");
  } else {
    weaknesses.push("Lacks measurable achievements. Quantify your work (e.g., 'improved page speed by 25%' rather than 'improved page speed').");
  }

  // Structure
  if (completenessScore >= 80) {
    strengths.push("Well-structured resume with all core sections present.");
  } else {
    const missingSections = [...coreSections, ...bonusSections].filter(k => sections[k].length === 0);
    weaknesses.push("Missing sections: " + missingSections.join(", ") + ". Add these to improve completeness.");
  }

  // Contact info
  if (email && phone) {
    strengths.push("Professional contact information is complete and properly formatted.");
  } else if (!email && !phone) {
    weaknesses.push("No contact information detected. Add your email and phone number prominently at the top.");
  }

  // Generate Improvements by scanning for weak phrases
  for (const item of WEAK_PHRASES) {
    if (lowercaseText.includes(item.weak.toLowerCase())) {
      improvements.push({
        section: "Experience",
        weak: `"${item.weak}"`,
        improved: `"${item.improved}"`
      });
    }
  }

  // Generate improvements based on analysis findings
  if (improvements.length === 0) {
    if (!hasMetrics) {
      improvements.push({
        section: "Experience Section",
        weak: "Developed features for the application dashboard.",
        improved: "Engineered 12+ React dashboard components, reducing bundle size by 30% and improving First Contentful Paint by 400ms."
      });
    }
    if (actionVerbCount < 3) {
      improvements.push({
        section: "Experience Section",
        weak: "Was responsible for code review and bug fixes.",
        improved: "Led code review processes across 3 repositories, identifying and resolving 50+ critical bugs, reducing production incidents by 40%."
      });
    }
    if (improvements.length === 0) {
      improvements.push({
        section: "Experience Section",
        weak: "Worked on software implementation and debugging.",
        improved: "Engineered robust software updates that resolved 12+ legacy bottlenecks, reducing error rates by 18%."
      });
      improvements.push({
        section: "Projects Section",
        weak: "Created an ML model for predictions.",
        improved: "Designed a Random Forest classifier achieving 92.4% accuracy, deployed via Docker, cutting inference latency by 45ms."
      });
    }
  }

  // 10. Recruiter Simulation
  const shortlist = overall >= 65 && foundRoleSkillsCount >= 3;
  const confidence = Math.max(30, Math.min(98, overall + Math.min(10, actionVerbCount * 2) + (hasMetrics ? 5 : 0)));
  
  const recReasons: string[] = [];
  const recConcerns: string[] = [];

  if (skillsScore >= 50) recReasons.push("Demonstrates solid domain-specific technical competencies");
  if (experienceScore >= 60) recReasons.push("Experience section shows depth with concrete project details");
  if (hasMetrics) recReasons.push("Achievements backed by quantifiable metrics and impact data");
  if (keywordScore >= 40) recReasons.push("Resume is well-optimized for ATS keyword scanning");
  if (actionVerbCount >= 5) recReasons.push("Strong command of impactful professional language");
  if (completenessScore >= 80) recReasons.push("Well-organized structure with complete sections");

  if (skillsScore < 50) recConcerns.push("Key technical competencies for " + selectedRole + " are not demonstrated");
  if (!hasMetrics) recConcerns.push("Impact descriptions lack quantifiable metrics and outcomes");
  if (readabilityScore < 65) recConcerns.push("Dense formatting may reduce quick-scan readability");
  if (actionVerbCount < 3) recConcerns.push("Professional language is passive — needs stronger action verbs");
  if (missingSkills.length > 5) recConcerns.push("Significant gaps in required technology stack: " + missingSkills.slice(0, 3).join(", "));
  
  if (recConcerns.length === 0) recConcerns.push("Scope of past projects could be more clearly articulated");
  if (recReasons.length === 0) recReasons.push("Clean layout and readable contact information");

  // 11. Heatmap Data
  const heatmapData: ParsedSection[] = [
    {
      name: "Experience",
      text: expText || "No work history provided.",
      level: experienceScore >= 70 ? "strong" : experienceScore >= 45 ? "average" : "weak",
      reasons: experienceScore >= 70 
        ? ["Action-verb driven bullet points", "Clear descriptions with impact details", "Professional progression demonstrated"] 
        : experienceScore >= 45 
          ? ["Contains relevant experience but could improve impact statements", "Some passive phrasing detected"]
          : ["Very sparse work history", "Missing action verbs and quantifiable results", "Needs significant expansion"]
    },
    {
      name: "Skills",
      text: skillsText || "No skills section found.",
      level: skillsScore >= 60 ? "strong" : skillsScore >= 35 ? "average" : "weak",
      reasons: skillsScore >= 60 
        ? [`${foundRoleSkillsCount} of ${totalRoleSkills} target skills matched`, "Good technology breadth"]
        : skillsScore >= 35 
          ? [`Only ${foundRoleSkillsCount} of ${totalRoleSkills} target skills found`, "Missing: " + missingSkills.slice(0, 3).join(", ")]
          : ["Critical skill gaps for " + selectedRole, "Missing: " + missingSkills.slice(0, 5).join(", ")]
    },
    {
      name: "Education",
      text: eduText || "No education section found.",
      level: eduText.length > 40 ? "strong" : eduText.length > 0 ? "average" : "weak",
      reasons: eduText.length > 40 
        ? ["Academic credentials clearly documented", "Degree and institution identified"]
        : eduText.length > 0 
          ? ["Education listed but lacks detail", "Consider adding GPA, relevant coursework, or honors"]
          : ["No education section found — add your academic background"]
    },
    {
      name: "Projects & Certifications",
      text: (projText ? "Projects: " + projText : "") + "\n" + (certText ? "Certifications: " + certText : ""),
      level: (projText.length > 30 || certText.length > 20) ? "strong" : (projText.length > 0 || certText.length > 0) ? "average" : "weak",
      reasons: (projText.length > 30 || certText.length > 20)
        ? ["Portfolio projects strengthen overall profile", "Additional credentials demonstrate growth mindset"]
        : (projText.length > 0 || certText.length > 0)
          ? ["Some supplementary materials present but need more detail"]
          : ["Missing projects section — add 2-3 relevant projects", "Consider adding certifications to boost credibility"]
    }
  ];

  return {
    name,
    email,
    phone,
    skills: skillsFound,
    experience: expItems,
    education: eduItems,
    projects: projItems,
    certifications: certs,
    scores: {
      overall,
      keywords: keywordScore,
      formatting: formattingScore,
      readability: readabilityScore,
      experience: experienceScore,
      skills: skillsScore,
      completeness: completenessScore
    },
    keywordsFound,
    keywordsMissing,
    strengths,
    weaknesses,
    improvements,
    recruiterDecision: {
      shortlist,
      confidence,
      reasons: recReasons,
      concerns: recConcerns
    },
    heatmapData
  };
}
