import { getSiteContent } from "@/lib/content";
import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { About } from "@/components/public/About";
import { Experience } from "@/components/public/Experience";
import { Projects } from "@/components/public/Projects";
import { Skills } from "@/components/public/Skills";
import { Education } from "@/components/public/Education";
import { Contact } from "@/components/public/Contact";
import { Footer } from "@/components/public/Footer";

// Re-fetch content on each request so admin edits show up without a rebuild.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { profile, experiences, projects, skills, education } =
    await getSiteContent();

  return (
    <>
      <Navbar name={profile.name} />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Experience experiences={experiences} />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <Education education={education} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
