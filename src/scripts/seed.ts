/**
 * Seed script — `npm run seed`
 *
 * Populates the database with the initial site content and creates the /mod
 * admin user with a bcrypt-hashed password. Safe to re-run: it upserts the
 * profile/admin and only inserts collection content when those collections
 * are empty (so it won't duplicate or clobber edits made via the admin panel).
 */

import { config } from "dotenv";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Load .env.local first, then .env as a fallback.
config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });

import { Profile } from "../models/Profile";
import { Experience } from "../models/Experience";
import { Project } from "../models/Project";
import { Skill } from "../models/Skill";
import { Education } from "../models/Education";
import { Admin } from "../models/Admin";
import {
  defaultProfile,
  defaultExperiences,
  defaultProjects,
  defaultSkills,
  defaultEducation,
} from "../lib/defaultContent";

async function seedCollectionIfEmpty<T>(
  model: mongoose.Model<any>,
  docs: T[],
  label: string
) {
  const count = await model.estimatedDocumentCount();
  if (count > 0) {
    console.log(`• ${label}: already has ${count} docs — skipping.`);
    return;
  }
  await model.insertMany(docs);
  console.log(`✓ ${label}: inserted ${docs.length} docs.`);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("✗ MONGODB_URI is not set. Add it to .env.local first.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB…");
  await mongoose.connect(uri);
  console.log("Connected.\n");

  // ── Profile (singleton: upsert) ──────────────────────────────
  const existingProfile = await Profile.findOne();
  if (existingProfile) {
    console.log("• Profile: already exists — skipping.");
  } else {
    await Profile.create(defaultProfile);
    console.log("✓ Profile: created.");
  }

  // ── Content collections ──────────────────────────────────────
  await seedCollectionIfEmpty(Experience, defaultExperiences, "Experience");
  await seedCollectionIfEmpty(Project, defaultProjects, "Project");
  await seedCollectionIfEmpty(Skill, defaultSkills, "Skill");
  await seedCollectionIfEmpty(Education, defaultEducation, "Education");

  // ── Admin user (upsert by email, bcrypt-hashed password) ─────
  const adminEmail = (process.env.ADMIN_EMAIL || "anushni@gmail.com")
    .toLowerCase()
    .trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "kidmi";

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (existingAdmin) {
    existingAdmin.passwordHash = passwordHash;
    await existingAdmin.save();
    console.log(`✓ Admin: updated password for ${adminEmail}.`);
  } else {
    await Admin.create({ email: adminEmail, passwordHash });
    console.log(`✓ Admin: created ${adminEmail}.`);
  }

  console.log("\nSeed complete. 🎉");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
