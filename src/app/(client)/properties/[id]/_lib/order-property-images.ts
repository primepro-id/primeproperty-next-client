import type { PropertyImage } from "@/lib/types";

export type IndexedPropertyImage = PropertyImage & {
  originalIndex: number;
};

export function orderPropertyImages(images: PropertyImage[]) {
  const indexedImages = images.map((image, originalIndex) => ({
    ...image,
    originalIndex,
  }));
  const coverIndex = Math.max(
    indexedImages.findIndex((image) => image.is_cover),
    0,
  );
  const coverImage = indexedImages[coverIndex];
  if (!coverImage) {
    return [];
  }

  return [
    coverImage,
    ...indexedImages.filter((image) => image.originalIndex !== coverIndex),
  ];
}
