/**
 * Seed content for the database — also used as a graceful fallback by the
 * public page if the DB is empty or unreachable, so the site always renders.
 * This is the SINGLE source of truth for the initial content.
 */

export const defaultProfile = {
  name: "Anushka Pandit",
  title: "Full Stack Developer · MERN · Cloud · Real-Time Systems",
  tagline:
    "I build scalable, production-grade web apps end to end — from architecture to deployment.",
  location: "Lucknow, India",
  email: "anushkapandit0412@gmail.com",
  phone: "+91 8840369759",
  about:
    "Full Stack Developer with 1+ year of production experience building scalable web applications with the MERN stack, Next.js, TypeScript, and Python/Django. I've independently delivered a live B2B platform, an e-commerce platform, and a Jira-style project management tool for an international client — owning each end to end from architecture through deployment. I'm strong with real-time systems (Socket.IO), cloud infrastructure (AWS EC2, S3, Nginx), and third-party API integrations.",
  resumeUrl: "/Anushka_Pandit_Resume.pdf",
  social: {
    github: "https://github.com/anushk2026a",
    linkedin: "https://linkedin.com/in/anushka-pandit-rura",
    email: "anushkapandit0412@gmail.com",
  },
};

export const defaultExperiences = [
  {
    role: "Full Stack Developer",
    company: "DIFMO Pvt Ltd",
    location: "Lucknow, India",
    period: "Feb 2026 – Present",
    order: 0,
    bullets: [
      "Architect and build full-stack features for production web applications using Node.js, Express.js, MongoDB, and React, owning both backend services and frontend integration.",
      "Design and implement RESTful APIs with modular routing, JWT-based authentication middleware, and Zod schema validation, powering multiple React client applications in production.",
      "Build and optimize MongoDB data models with Mongoose to support growing user traffic on high-read endpoints.",
      "Partner with UI/UX designers to translate Figma mockups into pixel-perfect, responsive React components, reducing integration rework cycles by ~30%.",
      "Debug and resolve cross-stack issues spanning the Node.js backend and React frontend, strengthening application stability and lowering production bug volume.",
    ],
  },
  {
    role: "Trainee – Android & Server Infrastructure",
    company: "Netcamp Solutions Pvt. Ltd.",
    location: "Ghaziabad, India",
    period: "Jul 2025 – Aug 2025",
    order: 1,
    bullets: [
      "Built an Android application in Android Studio with Firebase Realtime Database, enabling offline-capable data sync.",
      "Configured and deployed DNS, web servers (Apache/Nginx), and mail servers (SMTP, POP3, IMAP) on Linux, gaining hands-on IT infrastructure and server administration experience.",
    ],
  },
  {
    role: "Python Backend Intern",
    company: "Softpro India Computer Technologies",
    location: "Lucknow, India",
    period: "Aug 2024 – Sep 2024",
    order: 2,
    bullets: [
      "Developed RESTful backend APIs for an Online Admission System using Python and Django, implementing CRUD operations, form handling, and authentication workflows.",
      "Applied backend validation patterns — data integrity checks and structured error handling — to ensure reliable data persistence across MySQL-backed workflows.",
    ],
  },
];

export const defaultProjects = [
  // ── Featured (major production apps) ─────────────────────────
  {
    title: "Difwa — Water Delivery Platform",
    description:
      "Production SaaS for a subscription water-delivery business serving four roles (customers, vendors, riders, admins). Built the full Node/Express + MongoDB backend (~28 data models across 25 API route groups) and the Next.js vendor/admin dashboard: subscription ordering, Razorpay payments with wallet & cash-on-delivery, vendor cash-settlement ledgers, rider logistics, real-time order tracking, FCM push, automated cron billing, and payout/commission management. Integrates with two live Android apps (customer & vendor).",
    tech: [
      "Node.js",
      "Express",
      "MongoDB",
      "Socket.IO",
      "Razorpay",
      "Firebase FCM",
      "node-cron",
      "Next.js",
      "React",
      "Tailwind CSS",
      "Zustand",
      "Cloudinary",
    ],
    liveUrl: "https://difwa.com",
    appUrl:
      "https://play.google.com/store/apps/details?id=com.difmo.difwa",
    image: "",
    imagePublicId: "",
    featured: true,
    order: 0,
  },
  {
    title: "AMJ Star — B2B Order Management Platform",
    description:
      "TypeScript-first B2B marketplace with multi-role access control (buyer, supplier, reseller, admin), real-time order management, in-app Socket.IO chat, Razorpay payments, and Recharts analytics. Modular Express v5 + MongoDB backend exposing 180+ Zod-validated REST endpoints across 25 feature modules, paired with a React 19 + Redux Toolkit + TanStack Query frontend with role-based routing and a 401-refresh token interceptor.",
    tech: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind v4",
      "Redux Toolkit",
      "TanStack Query",
      "Node.js",
      "Express v5",
      "MongoDB",
      "Socket.IO",
      "Zod",
      "Razorpay",
    ],
    liveUrl: "https://amjstar.com",
    appUrl: "",
    image: "",
    imagePublicId: "",
    featured: true,
    order: 1,
  },
  {
    title: "Shrimpbite — E-Commerce Platform",
    description:
      "Full-stack e-commerce app with a Retailer Panel, Admin Dashboard, and real-time order & payout tracking, live in production. Real-time order updates via Socket.IO; Razorpay payments, Firebase Admin OTP auth, and FCM push notifications. Backend on AWS EC2 behind Nginx, Next.js frontend on Vercel.",
    tech: [
      "Next.js",
      "React",
      "TanStack Query",
      "Zustand",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.IO",
      "AWS EC2",
      "Nginx",
      "Razorpay",
    ],
    liveUrl: "https://retailer.shrimpbite.in",
    appUrl:
      "https://play.google.com/store/apps/details?id=com.shrimpbite.app",
    image: "",
    imagePublicId: "",
    featured: true,
    order: 2,
  },
  {
    title: "Project Tracker — Team Collaboration Platform",
    description:
      "Sole developer of a Jira/Monday.com-style project management platform, built end to end for an international client (Incite Digital) and live in production. Real-time collaboration via Socket.IO, drag-and-drop task boards, and visual analytics dashboards. Google OAuth, JWT sessions, file uploads (Multer + AWS S3 + Cloudinary), and email notifications via Nodemailer.",
    tech: [
      "React 18",
      "Redux",
      "React Router v6",
      "Material UI",
      "Socket.IO",
      "Chart.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "AWS S3",
      "Google OAuth",
      "Nodemailer",
    ],
    liveUrl: "https://project.incitedigital.com",
    appUrl: "",
    image: "",
    imagePublicId: "",
    featured: true,
    order: 3,
  },
  {
    title: "SportsOnePoint — FIFA World Cup 2026 City Guide",
    description:
      "Full-stack travel directory helping fans plan match day across all 16 host cities (USA, Canada, Mexico): nearby restaurants & hotels sorted by distance from the stadium, transport options with embedded video guides, official ticket links, and fan-zone info — plus a searchable directory, live-style match list, and SEO pages with structured data. Includes a JWT-secured admin dashboard for publishing news (Express API) and an SMTP contact flow.",
    tech: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "Express",
      "MongoDB",
      "Zod",
      "Nodemailer",
      "JWT",
      "SEO",
    ],
    liveUrl: "https://www.sportsonepoint.com",
    appUrl: "",
    image: "",
    imagePublicId: "",
    featured: true,
    order: 4,
  },
  {
    title: "SalesCRM — AI Sales Outreach Agent",
    description:
      "AI-powered CRM that automates cold outreach: manages leads through a pipeline (New → In Outreach → Replied → Meeting Booked), generates personalized emails with an LLM (Groq / Llama 3.3 70B), and reaches out across Email, WhatsApp, SMS, and Call with full conversation history. Auto-books meetings via Calendly webhooks, imports leads via Apify scrapers (Google Maps, LinkedIn, JustDial), and tunes deliverability on SMTP sends.",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "MongoDB",
      "Mongoose",
      "Groq (Llama 3.3 70B)",
      "Nodemailer",
      "Calendly",
      "Zustand",
      "Tailwind CSS",
    ],
    liveUrl: "https://sales-crm-xi-lime.vercel.app",
    appUrl: "",
    image: "",
    imagePublicId: "",
    featured: true,
    order: 5,
  },
  {
    title: "AstroYuga — Online Vedic Astrology Platform",
    description:
      "Team-built full-stack platform where users connect with verified astrologers over real-time chat and audio/video calls, generate Kundli/horoscopes, book pujas, shop remedies (AstroMall), and take courses. I built website pages and several backend modules — a redesigned animated landing with light/dark theming, Google OAuth (auth-code) + OTP phone verification, and fixes to real-time chat/call delivery, earnings logic, and a platform-wide UTC→IST timezone migration (timestamptz).",
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "NestJS",
      "PostgreSQL (TypeORM)",
      "Socket.IO",
      "Agora",
      "Razorpay",
      "Docker",
    ],
    liveUrl: "https://astroyuga.in",
    appUrl: "",
    image: "",
    imagePublicId: "",
    featured: true,
    order: 6,
  },

  // ── More projects (websites & focused builds) ────────────────
  {
    title: "Tvam Key Software — Corporate Website",
    description:
      "Fast, SEO-ready multi-page marketing site for a software agency: dynamic routing for services, industries & case studies (one template → many pages), working contact & careers forms that email submissions via Nodemailer, an auto-generated sitemap from nav constants, and reusable layout components with mega-menu navigation.",
    tech: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Nodemailer",
      "SEO",
    ],
    liveUrl: "https://www.tvamkeysoftware.com",
    appUrl: "",
    image: "",
    imagePublicId: "",
    featured: false,
    order: 7,
  },
  {
    title: "Brandingo — Branding Agency Website",
    description:
      "Marketing site for a branding & print-design agency with smooth scroll-triggered animations and a high-performance, filterable masonry gallery of 700+ design pieces — category tabs, click-to-zoom lightbox, and incremental batch loading so a huge gallery stays fast. New work is drop-in via an auto-generated image manifest script.",
    tech: [
      "Next.js",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Scroll Animations",
    ],
    liveUrl: "https://brandigo-web.vercel.app",
    appUrl: "",
    image: "",
    imagePublicId: "",
    featured: false,
    order: 8,
  },
  {
    title: "NXTorbit — Corporate Website",
    description:
      "Responsive multi-page marketing website for a software/app development company — Home, Services, Portfolio, Case Studies, Industries, Technology, Blog, Career, and Contact — organized with a shared component library, centralized data/constants, and a theme layer, with custom branding throughout.",
    tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4"],
    liveUrl: "https://nx-orbit-company-websitee.vercel.app",
    appUrl: "",
    image: "",
    imagePublicId: "",
    featured: false,
    order: 9,
  },
  {
    title: "World-CAD Backend — CMS & Portfolio API",
    description:
      "RESTful API powering a professional business portfolio, with high-security admin controls and a custom content management system.",
    tech: [
      "Node.js",
      "Express.js v5",
      "MongoDB",
      "Mongoose",
      "JWT",
      "Bcrypt.js",
      "REST APIs",
    ],
    liveUrl: "https://worldcaddesign.vercel.app",
    appUrl: "",
    image: "",
    imagePublicId: "",
    featured: false,
    order: 10,
  },
];

export const defaultSkills = [
  {
    category: "Languages",
    items: ["JavaScript (ES6+)", "TypeScript", "Python"],
    order: 0,
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "Django",
      "REST APIs",
      "Socket.IO",
      "JWT",
      "Zod",
      "Nodemailer",
      "Bcrypt.js",
    ],
    order: 1,
  },
  {
    category: "Frontend",
    items: [
      "React 18/19",
      "Next.js (App Router)",
      "Redux / Redux Toolkit",
      "TanStack Query",
      "Tailwind CSS",
      "Material UI",
      "Framer Motion",
    ],
    order: 2,
  },
  {
    category: "Databases",
    items: ["MongoDB (Mongoose)", "MySQL", "Firebase Realtime Database"],
    order: 3,
  },
  {
    category: "Cloud & Infra",
    items: [
      "AWS EC2",
      "AWS S3",
      "Nginx",
      "Vercel",
      "Firebase Admin (OTP, FCM)",
      "Cloudinary",
      "Razorpay",
    ],
    order: 4,
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "Android Studio", "Linux", "Postman", "Figma"],
    order: 5,
  },
  {
    category: "Practices",
    items: [
      "RESTful API Design",
      "Schema Design",
      "Real-Time Systems",
      "Agile/SDLC",
      "API Integration",
      "Production Deployment",
    ],
    order: 6,
  },
];

export const defaultEducation = [
  {
    degree: "B.Tech — Computer Science Engineering",
    institution:
      "Ambalika Institute of Management & Technology (AKTU), Lucknow, UP",
    period: "2022 – 2026",
    detail: "CGPA: 7.88",
    order: 0,
    achievements: [
      "Presented research papers at the 7th International Conference (COII-2024) and the 9th International Conference (COAIEMA-2026).",
      "Published a literature review in IJCT (Vol. 12): “StyleNext — Just a Tap Away.”",
      "AIMT IEEE Web Master, 2023–26.",
      "Winner, Internal Hackathon 2023.",
    ],
  },
];
