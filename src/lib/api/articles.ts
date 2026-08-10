import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { env } from "../env";
import type { Article } from "../types";
import { FIND_ARTICLES_QUERY, FIND_ARTICLE_BY_SLUG_QUERY } from "./gql";

const httpLink = new HttpLink({
  uri: env.DATOCMS_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${env.DATOCMS_API_TOKEN}`,
    "X-Api-Version": "3",
  },
});

const createDatoApolloClient = () => {
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
};

export const findArticleBySlug = async (
  slug: string,
): Promise<{
  article: Article;
  allArticles: Pick<
    Article,
    "title" | "slug" | "thumbnail" | "_publishedAt" | "_updatedAt"
  >[];
}> => {
  try {
    const client = createDatoApolloClient();
    const { data } = await client.query({
      query: FIND_ARTICLE_BY_SLUG_QUERY,
      variables: {
        slug,
      },
    });
    return data;
  } catch (error) {
    console.error(`Error fetching article ${slug}:`, error);
    throw error;
  }
};

export const findArticles = async (): Promise<{
  allArticles: Article[];
}> => {
  try {
    const client = createDatoApolloClient();
    const { data } = await client.query({
      query: FIND_ARTICLES_QUERY,
    });
    return data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};
