import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.string().trim().email("Enter a valid email").max(200),
  subject: z.string().trim().min(2, "Subject is too short").max(150),
  message: z.string().trim().min(10, "Message is too short").max(5000),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const socialSchema = z.object({
  github: z.string().trim().default(""),
  linkedin: z.string().trim().default(""),
  email: z.string().trim().default(""),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(200),
  tagline: z.string().trim().max(400).default(""),
  location: z.string().trim().max(120).default(""),
  email: z.string().trim().email().or(z.literal("")).default(""),
  phone: z.string().trim().max(40).default(""),
  about: z.string().trim().max(3000).default(""),
  resumeUrl: z.string().trim().default(""),
  social: socialSchema,
});

export const experienceSchema = z.object({
  role: z.string().trim().min(1).max(200),
  company: z.string().trim().min(1).max(200),
  location: z.string().trim().max(120).default(""),
  period: z.string().trim().max(120).default(""),
  bullets: z.array(z.string().trim().min(1)).default([]),
  order: z.number().int().default(0),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).default(""),
  tech: z.array(z.string().trim().min(1)).default([]),
  liveUrl: z.string().trim().default(""),
  appUrl: z.string().trim().default(""),
  image: z.string().trim().default(""),
  imagePublicId: z.string().trim().default(""),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const skillSchema = z.object({
  category: z.string().trim().min(1).max(120),
  items: z.array(z.string().trim().min(1)).default([]),
  order: z.number().int().default(0),
});

export const educationSchema = z.object({
  degree: z.string().trim().min(1).max(200),
  institution: z.string().trim().max(250).default(""),
  period: z.string().trim().max(120).default(""),
  detail: z.string().trim().max(400).default(""),
  achievements: z.array(z.string().trim().min(1)).default([]),
  order: z.number().int().default(0),
});
