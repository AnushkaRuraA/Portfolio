import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://anushka-portfolio.vercel.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep the admin area out of search results.
      disallow: ["/mod", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
