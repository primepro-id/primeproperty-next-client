type PropertyLocationProps = {
  title: string;
  gmapIframe: string;
};

function withLazyLoading(iframeHtml: string) {
  if (/\sloading=/i.test(iframeHtml)) {
    return iframeHtml;
  }
  return iframeHtml.replace(/<iframe/i, '<iframe loading="lazy"');
}

export const PropertyLocation = ({
  title,
  gmapIframe,
}: PropertyLocationProps) => {
  return (
    <div
      title={title}
      className="w-full overflow-hidden rounded-lg [&_iframe]:h-72 [&_iframe]:w-full [&_iframe]:border-0 lg:[&_iframe]:h-80"
      dangerouslySetInnerHTML={{ __html: withLazyLoading(gmapIframe) }}
    />
  );
};
