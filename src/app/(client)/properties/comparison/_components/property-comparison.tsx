"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import {
  LuBath,
  LuBed,
  LuBook,
  LuCar,
  LuEye,
  LuHandshake,
  LuHeartPulse,
  LuHouse,
  LuImage,
  LuLandPlot,
  LuMapPin,
  LuPersonStanding,
  LuSchool,
  LuTag,
  LuTrophy,
} from "react-icons/lu";
import { PropertyComparisonImages } from "./property-comparison-images";
import { PropertyPriceTag } from "../../_components/property-price-tag";
import { PropertyAgentInfo } from "../../_components/property-agent-info";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { PropertyComparisonSelect } from "./property-comparison-select";
import { useRouter } from "next/navigation";
import Loading from "@/app/(client)/loading";
import {
  findPropertyJoinAgentQueryOptions,
  findUniquePropertyJoinAgentQueryOptions,
  getBookmarkedPropertyOptions,
} from "@/lib/hooks";
import { PropertyJoinAgent, PropertyPurchaseStatus } from "@/lib/types";
import { createPropertyPath } from "@/lib/metadata/seo-domain";

type ComparisonRowProps = {
  icon: React.ReactNode;
  title: string;
  firstCell: React.ReactNode;
  secondCell: React.ReactNode;
};

const ComparisonRow = ({
  icon,
  title,
  firstCell,
  secondCell,
}: ComparisonRowProps) => {
  return (
    <TableRow className="font-semibold whitespace-nowrap">
      <TableCell>
        <div className="flex flex-col gap-2">
          <div className="font-semibold flex items-center gap-2 uppercase">
            {icon}
            {title}
          </div>
          {title.toLowerCase() === "images" && (
            <p className="text-muted-foreground text-xs">(Click to Zoom)</p>
          )}
        </div>
      </TableCell>
      <TableCell className="font-sans">{firstCell}</TableCell>
      <TableCell className="font-sans">{secondCell}</TableCell>
    </TableRow>
  );
};

type PropertyComparisonProps = { ids: string };

export const PropertyComparison = ({ ids }: PropertyComparisonProps) => {
  const router = useRouter();
  const [firstID, secondID] = ids.split(",");
  const bookmarks = useQuery(getBookmarkedPropertyOptions());
  const bookmarkedProperties = useQuery(
    findPropertyJoinAgentQueryOptions(
      { ids: bookmarks.data?.join(",") },
      { enabled: !!bookmarks.data },
    ),
  );

  const firstProperty = useQuery(
    findUniquePropertyJoinAgentQueryOptions(+firstID),
  );
  const secondProperty = useQuery(
    findUniquePropertyJoinAgentQueryOptions(+secondID),
  );

  if (firstProperty.isLoading || secondProperty.isLoading) {
    return <Loading />;
  }

  if (!firstProperty.data || !secondProperty.data) {
    return <></>;
  }
  const firstProp = firstProperty.data.data as PropertyJoinAgent;
  const secondProp = secondProperty.data.data as PropertyJoinAgent;

  const ROWS: ComparisonRowProps[] = [
    {
      icon: <LuImage />,
      title: "Images",
      firstCell: <PropertyComparisonImages propertyWithAgent={firstProp} />,
      secondCell: <PropertyComparisonImages propertyWithAgent={secondProp} />,
    },
    {
      icon: <LuTag />,
      title: "ID",
      firstCell: firstProp[0].id,
      secondCell: secondProp[0].id,
    },
    {
      icon: <LuTag />,
      title: "Name",
      firstCell: firstProp[0].title,
      secondCell: secondProp[0].title,
    },
    {
      icon: <LuBook />,
      title: "Price",
      firstCell: <PropertyPriceTag propertyWithAgent={firstProp} />,
      secondCell: <PropertyPriceTag propertyWithAgent={secondProp} />,
    },
    {
      icon: <LuHouse />,
      title: "Type",
      firstCell: firstProp[0].building_type.toUpperCase(),
      secondCell: secondProp[0].building_type.toUpperCase(),
    },
    {
      icon: <LuHandshake />,
      title: "Purchase Status",
      firstCell:
        firstProp[0].purchase_status === PropertyPurchaseStatus.ForSale
          ? "DIJUAL"
          : "DISEWA",
      secondCell:
        secondProp[0].purchase_status === PropertyPurchaseStatus.ForSale
          ? "DIJUAL"
          : "DISEWA",
    },
    {
      icon: <LuMapPin />,
      title: "Location",
      firstCell: `${firstProp[0].street}, ${firstProp[0].regency}, ${firstProp[0].province}`,
      secondCell: `${secondProp[0].street}, ${secondProp[0].regency}, ${secondProp[0].province}`,
    },
    {
      icon: <LuTrophy />,
      title: "Certificate",
      firstCell: firstProp[0].building_certificate.toUpperCase(),
      secondCell: secondProp[0].building_certificate.toUpperCase(),
    },
    {
      icon: <LuHeartPulse />,
      title: "Condition",
      firstCell: firstProp[0].building_condition.toUpperCase(),
      secondCell: secondProp[0].building_condition.toUpperCase(),
    },
    {
      icon: <LuLandPlot />,
      title: "Land Area",
      firstCell: firstProp[0].measurements.land_area
        ? `${firstProp[0].measurements.land_area} m²`
        : "-",
      secondCell: secondProp[0].measurements.land_area
        ? `${secondProp[0].measurements.land_area} m²`
        : "-",
    },
    {
      icon: <LuLandPlot />,
      title: "Building Area",
      firstCell: firstProp[0].measurements.building_area
        ? `${firstProp[0].measurements.building_area} m²`
        : "-",
      secondCell: secondProp[0].measurements.building_area
        ? `${secondProp[0].measurements.building_area} m²`
        : "-",
    },
    {
      icon: <LuSchool />,
      title: "Building Height",
      firstCell: firstProp[0].measurements.building_level
        ? `${firstProp[0].measurements.building_level} lantai`
        : "-",
      secondCell: secondProp[0].measurements.building_level
        ? `${secondProp[0].measurements.building_level} lantai`
        : "-",
    },
    {
      icon: <LuBed />,
      title: "Bedrooms",
      firstCell: firstProp[0].specifications.bedrooms ?? "-",
      secondCell: secondProp[0].specifications.bedrooms ?? "-",
    },
    {
      icon: <LuBath />,
      title: "Bathrooms",
      firstCell: firstProp[0].specifications.bathrooms ?? "-",
      secondCell: secondProp[0].specifications.bathrooms ?? "-",
    },
    {
      icon: <LuCar />,
      title: "Car Space",
      firstCell:
        (firstProp[0].specifications.carport ?? 0) +
        (firstProp[0].specifications.garage ?? 0),
      secondCell:
        (secondProp[0].specifications.carport ?? 0) +
        (secondProp[0].specifications.garage ?? 0),
    },
    {
      icon: <LuPersonStanding />,
      title: "Agent",
      firstCell: (
        <div className="flex items-center gap-2">
          <PropertyAgentInfo propertyWithAgent={firstProp} />
          <Link
            href={createPropertyPath(firstProp[0])}
            className={cn(buttonVariants({}))}
          >
            <LuEye />
            CHECK PROPERTY
          </Link>
        </div>
      ),
      secondCell: (
        <div className="flex items-center gap-2">
          <PropertyAgentInfo propertyWithAgent={secondProp} />
          <Link
            href={createPropertyPath(secondProp[0])}
            className={cn(buttonVariants({}))}
          >
            <LuEye />
            CHECK PROPERTY
          </Link>
        </div>
      ),
    },
  ];
  return (
    <div className="border rounded border-primary">
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow>
            <TableHead />

            <TableHead>
              <PropertyComparisonSelect
                onValueChange={(val) => {
                  const oldIds = ids.split(",");
                  oldIds.splice(0, 1, val);
                  router.replace(
                    `/properties/comparison?ids=${oldIds.join(",")}`,
                  );
                }}
                selectedId={String(firstProp[0].id)}
                properties={bookmarkedProperties.data?.data?.data}
              />
            </TableHead>
            <TableHead>
              <PropertyComparisonSelect
                onValueChange={(val) => {
                  const oldIds = ids.split(",");
                  oldIds.splice(1, 1, val);
                  router.replace(
                    `/properties/comparison?ids=${oldIds.join(",")}`,
                  );
                }}
                selectedId={String(secondProp[0].id)}
                properties={bookmarkedProperties.data?.data?.data}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((r) => (
            <ComparisonRow
              key={r.title}
              title={r.title}
              icon={r.icon}
              firstCell={r.firstCell}
              secondCell={r.secondCell}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
