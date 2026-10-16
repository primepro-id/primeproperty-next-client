const VIDEO_PERMISSIONS = [
  "accelerometer",
  "autoplay",
  "clipboard-write",
  "encrypted-media",
  "gyroscope",
  "picture-in-picture",
  "web-share",
];

export const getVideoIframeAllow = (supportedFeatures?: readonly string[]) =>
  VIDEO_PERMISSIONS.filter((feature) =>
    supportedFeatures?.includes(feature),
  ).join("; ") || undefined;
