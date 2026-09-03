import { getAgentByFullname } from "@/lib/api";
import { env } from "@/lib/env";
import { createMetadata } from "@/lib/metadata";
import {
  createAgentPath,
  createAgentSeoDescription,
  decodeAgentRouteName,
  normalizeSeoText,
} from "@/lib/metadata/seo-domain";
import { toTitleCase } from "@/lib/to-title-case";
import type { Metadata } from "next";

export async function createAgentMetadata(
  params: Promise<{ name: string }>,
): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeAgentRouteName(name);
  const response = await getAgentByFullname(decodedName);
  const agent = response.data;

  if (!agent) {
    return createMetadata({
      title: "Agen tidak ditemukan | PrimePro Indonesia",
      description: createAgentSeoDescription({
        fullname: decodedName.replaceAll("-", " "),
        description:
          "Profil agen yang Anda cari tidak tersedia. Temukan agen PrimePro Indonesia lainnya untuk konsultasi dan layanan properti tepercaya.",
      }),
      path: createAgentPath({ fullname: decodedName }),
      index: false,
    });
  }

  return createMetadata({
    title: normalizeSeoText(
      `${toTitleCase(agent.fullname)} - Agen Properti PrimePro Indonesia`,
      70,
    ),
    description: createAgentSeoDescription({
      fullname: agent.fullname,
      description: agent.description,
    }),
    path: createAgentPath(agent),
    image: agent.profile_picture_url
      ? `${env.NEXT_PUBLIC_S3_ENDPOINT}${agent.profile_picture_url}`
      : undefined,
  });
}
