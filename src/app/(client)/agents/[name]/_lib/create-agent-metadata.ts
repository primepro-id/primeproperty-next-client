import { getAgentByFullname } from "@/lib/api";
import { env } from "@/lib/env";
import { createMetadata } from "@/lib/metadata";
import { normalizeSeoText } from "@/lib/metadata/seo-domain";
import { toTitleCase } from "@/lib/to-title-case";
import type { Metadata } from "next";

export async function createAgentMetadata(
  params: Promise<{ name: string }>,
): Promise<Metadata> {
  const { name } = await params;
  const response = await getAgentByFullname(name);
  const agent = response.data;

  if (!agent) {
    return createMetadata({
      title: "Agen tidak ditemukan | PrimePro Indonesia",
      description: "Profil agen yang Anda cari tidak tersedia.",
      path: `/agents/${name}`,
      index: false,
    });
  }

  return createMetadata({
    title: normalizeSeoText(
      `${toTitleCase(agent.fullname)} - Agen Properti PrimePro Indonesia`,
      70,
    ),
    description: normalizeSeoText(
      agent.description ||
        `Agen properti ${agent.fullname} dari PrimePro Indonesia.`,
      160,
    ),
    path: `/agents/${agent.fullname.replaceAll(" ", "-")}`,
    image: agent.profile_picture_url
      ? `${env.NEXT_PUBLIC_S3_ENDPOINT}${agent.profile_picture_url}`
      : undefined,
  });
}
