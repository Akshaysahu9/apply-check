export interface ContactInfo {
  name: string | null;
  email: string | null;
  phone: string | null;
  linkedIn: string | null;
  github: string | null;
  portfolio: string | null;
}

export function extractContact(text: string): ContactInfo {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const head = lines.slice(0, 8).join("\n");

  const emailMatch = text.match(/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i);
  const phoneMatch = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}|(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  const linkedInMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i);
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i);
  const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[\w-]+\.(?:dev|io|me|com\/portfolio)/i);

  let name: string | null = null;
  for (const line of lines.slice(0, 4)) {
    if (
      line.length > 2 &&
      line.length < 50 &&
      !/@|http|linkedin|github|phone|resume|curriculum/i.test(line) &&
      !/^\d/.test(line) &&
      /^[A-Za-z\s.'-]+$/.test(line)
    ) {
      name = line;
      break;
    }
  }

  return {
    name,
    email: emailMatch?.[0] || null,
    phone: phoneMatch?.[0] || null,
    linkedIn: linkedInMatch?.[0] || null,
    github: githubMatch?.[0] || null,
    portfolio: portfolioMatch?.[0] || null,
  };
}

export function extractCertifications(text: string): string[] {
  const patterns = [
    /aws\s+certified[\w\s]*/gi,
    /azure\s+certified[\w\s]*/gi,
    /google\s+cloud\s+certified[\w\s]*/gi,
    /oracle\s+certified[\w\s]*/gi,
    /cisco\s+ccna[\w\s]*/gi,
    /comptia\s+[\w+]*/gi,
    /pmp\b/gi,
    /scrum\s+master/gi,
    /hashicorp\s+[\w\s]*/gi,
    /kubernetes\s+cka/gi,
    /meta\s+certified/gi,
    /coursera[\w\s]*certificate/gi,
    /udemy[\w\s]*certificate/gi,
    /nptel/gi,
  ];

  const found = new Set<string>();
  for (const p of patterns) {
    const matches = text.match(p);
    if (matches) matches.forEach((m) => found.add(m.trim()));
  }

  const certSection = text.match(/certifications?[\s\S]{0,800}/i);
  if (certSection) {
    const lines = certSection[0].split("\n").slice(1, 8);
    for (const line of lines) {
      const t = line.replace(/^[-•*]\s*/, "").trim();
      if (t.length > 4 && t.length < 80 && !/certification/i.test(t)) found.add(t);
    }
  }

  return [...found].slice(0, 8);
}

export function extractProjects(text: string): string[] {
  const projects: string[] = [];
  const section = text.match(/projects?[\s\S]{0,2000}/i);
  if (!section) return projects;

  const lines = section[0].split("\n").slice(1);
  let current = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(experience|education|skills|certification|achievement)/i.test(trimmed)) break;
    if (/^[-•*]/.test(trimmed) || /^[A-Z]/.test(trimmed)) {
      if (current) projects.push(current.trim());
      current = trimmed.replace(/^[-•*]\s*/, "");
    } else if (current && trimmed) {
      current += " " + trimmed;
    }
  }
  if (current) projects.push(current.trim());

  return projects.filter((p) => p.length > 10).slice(0, 6);
}
