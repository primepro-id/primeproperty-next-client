"use client";

import Watermark, { WatermarkProps } from "@uiw/react-watermark";
import { ComponentProps } from "react";

type WatermarkImageProps = {
  watermarkProps: WatermarkProps;
  imageProps: ComponentProps<"img">;
};

export const WatermarkImage = ({
  watermarkProps,
  imageProps,
}: WatermarkImageProps) => {
  const { ...restOfWatermarkProps } = watermarkProps;
  const { alt, ...restOfImageProps } = imageProps;
  return (
    <Watermark
      image="/images/watermark.png"
      rotate={0}
      height={50}
      width={50}
      onContextMenu={(e) => e.preventDefault()}
      {...restOfWatermarkProps}
    >
      <img alt={alt} title={alt} {...restOfImageProps} />
    </Watermark>
  );
};
