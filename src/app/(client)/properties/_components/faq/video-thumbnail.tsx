"use client";
import { getVideoIframeAllow } from "@/lib/video-iframe-permissions";

type PolicyDocument = Document & {
  featurePolicy?: { features?: () => string[] };
};

const configureVideoIframe = (iframe: HTMLIFrameElement | null) => {
  if (!iframe) return;
  const policy = (iframe.ownerDocument as PolicyDocument).featurePolicy;
  const allow = getVideoIframeAllow(policy?.features?.());
  if (allow) iframe.setAttribute("allow", allow);
  // Set permissions before navigation so unsupported directives are never parsed.
  iframe.src = "https://www.youtube.com/embed/ivN7BfhMv4g?si=zLm4yBwIrF7So1wM";
};

export const VideoThumbnail = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-3xl font-bold text-center lg:text-left font-sans">
        Our Company
      </h2>
      <iframe
        width="100%"
        ref={configureVideoIframe}
        title="YouTube video player"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="lazy"
        className="h-96 md:h-[400px] lg:h-[600px] rounded-lg"
      />
    </div>
  );
};
