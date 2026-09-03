import "server-only";

import { findPropertyNavigation } from "@/lib/api";
import type { PropertyNavigation } from "@/lib/types";
import { cache } from "react";

export const getPublicPropertyNavigation = cache(
  async (): Promise<PropertyNavigation[]> => {
    try {
      const response = await findPropertyNavigation();
      return response.data ?? [];
    } catch {
      return [];
    }
  },
);
