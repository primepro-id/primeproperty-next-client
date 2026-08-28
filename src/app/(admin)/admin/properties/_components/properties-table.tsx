"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FindPropertyQuery } from "@/lib/api";
import {
  accessTokenQueryOptions,
  findPropertyJoinAgentQueryOptions,
  findPropertySitePathsQueryOptions,
} from "@/lib/hooks";
import { AgentRole, type Agent } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import jwt from "jsonwebtoken";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { extractPropertyFilterOptions } from "../_lib/extract-property-filter-options";
import { getPropertiesQueryForViewer } from "../_lib/get-properties-query-for-viewer";
import { reconcilePropertySearchParams } from "../_lib/reconcile-property-search-params";
import { updatePropertySearchParams } from "../_lib/update-property-search-params";
import { PropertyActionsColumn } from "./columns/property-actions-column";
import { PropertyAddressColumn } from "./columns/property-address-column";
import { PropertyAgentColumn } from "./columns/property-agent-column";
import { PropertyDetailsColumn } from "./columns/property-details-column";
import { PropertyIdColumn } from "./columns/property-id-column";
import { PropertiesFilters } from "./filters/properties-filters";
import { PropertiesPagination } from "./properties-pagination";

type PropertiesTableProps = {
  query: FindPropertyQuery;
};

export function PropertiesTable({ query }: PropertiesTableProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const optimisticSearchParams = useRef(searchParams.toString());
  const hasPendingNavigation = useRef(false);
  const accessToken = useQuery(accessTokenQueryOptions());
  const viewer = accessToken.data
    ? (jwt.decode(accessToken.data) as Agent | null)
    : null;
  const viewerQuery = getPropertiesQueryForViewer(viewer, query);
  const properties = useQuery(
    findPropertyJoinAgentQueryOptions(viewerQuery ?? {}, {
      enabled: viewerQuery !== null,
    }),
  );
  const sitePaths = useQuery(findPropertySitePathsQueryOptions());
  const filterOptions = useMemo(
    () => extractPropertyFilterOptions(sitePaths.data?.data),
    [sitePaths.data?.data],
  );
  const dynamicFiltersDisabled =
    sitePaths.isLoading || sitePaths.isError || !sitePaths.data?.data;
  const isLoading =
    accessToken.isLoading || (viewerQuery !== null && properties.isLoading);
  const isError =
    accessToken.isError ||
    (!accessToken.isLoading && !viewer) ||
    properties.isError ||
    (!isLoading && !properties.data?.data);
  const propertyData = properties.data?.data;
  const propertyList = propertyData?.data ?? [];

  useEffect(() => {
    const reconciled = reconcilePropertySearchParams(
      searchParams.toString(),
      optimisticSearchParams.current,
      hasPendingNavigation.current,
    );
    optimisticSearchParams.current = reconciled.value;
    hasPendingNavigation.current = reconciled.pending;
  }, [searchParams]);

  const updateSearchParams = useCallback(
    (
      updates: Record<string, string | number | undefined>,
      resetPage: boolean,
    ) => {
      const queryString = updatePropertySearchParams(
        optimisticSearchParams.current,
        updates,
        resetPage,
      );
      optimisticSearchParams.current = queryString;
      hasPendingNavigation.current = true;
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  return (
    <div className="flex flex-col gap-4">
      <PropertiesFilters
        query={query}
        options={filterOptions}
        dynamicFiltersDisabled={dynamicFiltersDisabled}
        showPopularFilter={viewer?.role === AgentRole.Admin}
        updateSearchParams={updateSearchParams}
      />

      {sitePaths.isError && (
        <div role="alert" className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Property filter options are unavailable.
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => sitePaths.refetch()}
          >
            Retry
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() =>
              updateSearchParams(
                {
                  province: undefined,
                  regency: undefined,
                  street: undefined,
                  building_type: undefined,
                },
                true,
              )
            }
          >
            Clear location and type filters
          </Button>
        </div>
      )}

      <Table className="min-w-[1100px]">
        <TableHeader>
          <TableRow>
            <TableHead>Property ID</TableHead>
            <TableHead>Property Agent</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Property Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading properties...
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Unable to load properties. Contact an administrator.
              </TableCell>
            </TableRow>
          ) : propertyList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No properties found
              </TableCell>
            </TableRow>
          ) : (
            propertyList.map(([property, agent]) => (
              <TableRow key={property.id}>
                <TableCell>
                  <PropertyIdColumn propertyId={property.id} />
                </TableCell>
                <TableCell>
                  <PropertyAgentColumn agent={agent} />
                </TableCell>
                <TableCell>
                  <PropertyDetailsColumn property={property} />
                </TableCell>
                <TableCell>
                  <PropertyAddressColumn property={property} />
                </TableCell>
                <TableCell>
                  <PropertyActionsColumn propertyId={property.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {!isLoading && !isError && (
        <PropertiesPagination
          query={query}
          totalPages={propertyData?.pagination.total_pages ?? 0}
          updateSearchParams={updateSearchParams}
        />
      )}
    </div>
  );
}
