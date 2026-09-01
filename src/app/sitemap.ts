import { env } from "@/lib/env";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: env.NEXT_PUBLIC_HOST_URL,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: env.NEXT_PUBLIC_HOST_URL + "/about",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: env.NEXT_PUBLIC_HOST_URL + "/jobs",
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: env.NEXT_PUBLIC_HOST_URL + "/franchise",
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
