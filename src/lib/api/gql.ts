import { gql } from "@apollo/client";

export const FIND_ARTICLE_BY_SLUG_QUERY = gql`
  query FindArticleBySlug($slug: String!) {
    article(filter: { slug: { eq: $slug } }) {
      id
      thumbnail {
        url
      }
      title
      content(markdown: true)
      slug
      _publishedAt
      _updatedAt
      seo {
        title
        description
      }
      showRelatedProperties
      relatedProperties
    }
    allArticles(filter: { slug: { neq: $slug } }, first: 10) {
      title
      slug
      _publishedAt
      _updatedAt
      thumbnail {
        url
      }
    }
  }
`;

export const FIND_ARTICLES_QUERY = gql`
  query {
    allArticles(orderBy: _publishedAt_DESC, first: 500) {
      id
      thumbnail {
        url
      }
      title
      content(markdown: true)
      slug
      _publishedAt
      _updatedAt
      seo {
        title
        description
      }
    }
  }
`;
