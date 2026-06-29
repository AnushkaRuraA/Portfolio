import { connectDB } from "./db";
import { Profile } from "@/models/Profile";
import { Experience } from "@/models/Experience";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { Education } from "@/models/Education";
import {
  defaultProfile,
  defaultExperiences,
  defaultProjects,
  defaultSkills,
  defaultEducation,
} from "./defaultContent";

export interface SiteProfile {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  about: string;
  resumeUrl: string;
  photoUrl: string;
  social: { github: string; linkedin: string; email: string };
}

export interface SiteExperience {
  _id?: string;
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  order: number;
}

export interface SiteProject {
  _id?: string;
  title: string;
  description: string;
  tech: string[];
  liveUrl: string;
  appUrl: string;
  image: string;
  imagePublicId?: string;
  featured: boolean;
  order: number;
}

export interface SiteSkill {
  _id?: string;
  category: string;
  items: string[];
  order: number;
}

export interface SiteEducation {
  _id?: string;
  degree: string;
  institution: string;
  period: string;
  detail: string;
  achievements: string[];
  order: number;
}

export interface SiteContent {
  profile: SiteProfile;
  experiences: SiteExperience[];
  projects: SiteProject[];
  skills: SiteSkill[];
  education: SiteEducation[];
}

/**
 * Fetch all public content from MongoDB. Falls back to the default seed content
 * if the DB is empty or unreachable, so the site always renders.
 */
export async function getSiteContent(): Promise<SiteContent> {
  try {
    await connectDB();

    const [profileDoc, experiences, projects, skills, education] =
      await Promise.all([
        Profile.findOne().lean(),
        Experience.find().sort({ order: 1, createdAt: 1 }).lean(),
        Project.find().sort({ order: 1, createdAt: 1 }).lean(),
        Skill.find().sort({ order: 1, createdAt: 1 }).lean(),
        Education.find().sort({ order: 1, createdAt: 1 }).lean(),
      ]);

    return {
      profile: (profileDoc
        ? serialize(profileDoc)
        : defaultProfile) as SiteProfile,
      experiences: (experiences.length
        ? experiences.map(serialize)
        : defaultExperiences) as SiteExperience[],
      projects: (projects.length
        ? projects.map(serialize)
        : defaultProjects) as SiteProject[],
      skills: (skills.length
        ? skills.map(serialize)
        : defaultSkills) as SiteSkill[],
      education: (education.length
        ? education.map(serialize)
        : defaultEducation) as SiteEducation[],
    };
  } catch (err) {
    console.error("getSiteContent: DB unavailable, using defaults.", err);
    return {
      profile: defaultProfile as SiteProfile,
      experiences: defaultExperiences as SiteExperience[],
      projects: defaultProjects as SiteProject[],
      skills: defaultSkills as SiteSkill[],
      education: defaultEducation as SiteEducation[],
    };
  }
}

// Convert Mongo/Mongoose lean docs into plain JSON-safe objects.
function serialize<T extends Record<string, any>>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}
