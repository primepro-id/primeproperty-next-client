export type Article = {
  id: string;
  thumbnail: {
    url: string;
  };
  title: string;
  content: string;
  slug: string;
  _publishedAt: string;
  _updatedAt: string;
  seo: {
    title: string;
    description: string;
  };
  showRelatedProperties: boolean;
  relatedProperties: string;
};
