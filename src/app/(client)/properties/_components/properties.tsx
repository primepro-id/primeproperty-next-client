"use client";

import type { FindPropertyQuery } from "@/lib/api";
import { findPropertyJoinAgentQueryOptions } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { PropertyList } from "./list";
import { Pagination } from "./pagination";
import { PropertiesFilter } from "./fillters/properties-filter";
import { PropertiesTitle } from "./title";
import { PropertyNotFound } from "./not-found";
import { Faq } from "./faq";
import { createPropertiesSchema } from "@/lib/schema/create-properties-schema";
import { Banner } from "@/components/custom-ui/banner";
import Loading from "@/app/(client)/loading";

type PropertiesProps = {
  searchParams: FindPropertyQuery;
  path?: string;
};

export const Properties = ({ searchParams, path }: PropertiesProps) => {
  const properties = useQuery(
    findPropertyJoinAgentQueryOptions({
      limit: 30,
      ...searchParams,
    }),
  );

  if (properties.isLoading) {
    return <Loading />;
  }

  if (properties.isError) {
    throw properties.error;
  }

  if (!properties.data?.data) {
    return <PropertyNotFound searchParams={searchParams} />;
  }

  const jsonLd = createPropertiesSchema(
    properties.data.data.data,
    searchParams,
    path,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PropertiesFilter searchParams={searchParams} />
      <div className="container mx-auto flex flex-col gap-4 lg:gap-8 py-4 px-2">
        <div className="flex items-center justify-between">
          <PropertiesTitle
            propertyCount={properties.data.data.pagination.total}
            searchParams={searchParams}
          />
          <div className="hidden lg:flex">
            <Pagination
              searchParams={searchParams}
              currentPage={searchParams.page ? +searchParams.page : 1}
              totalPages={properties.data.data.pagination.total_pages}
            />
          </div>
        </div>
        <PropertyList
          searchParams={searchParams}
          propertiesWithAgent={properties.data.data.data}
        />
        <div className="mt-4">
          <Pagination
            searchParams={searchParams}
            currentPage={searchParams.page ? +searchParams.page : 1}
            totalPages={properties.data.data.pagination.total_pages}
          />
        </div>

        <Faq defaultTab="PROPERTY" />
        <Banner />
      </div>
    </>
  );
};
