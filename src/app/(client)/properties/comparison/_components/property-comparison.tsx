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
import { PropertyJoinAgent, PropertyPurchaseStatus } from "@/lib/types";
import { createPropertyPath } from "@/lib/metadata/seo-domain";
import { PropertyComparisonSelectors } from "./property-comparison-selectors";

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

type PropertyComparisonProps = {
  ids: readonly [number, number];
  firstProperty: PropertyJoinAgent | null;
  secondProperty: PropertyJoinAgent | null;
};

export const PropertyComparison = ({
  ids,
  firstProperty,
  secondProperty,
}: PropertyComparisonProps) => {
  if (!firstProperty || !secondProperty) {
    return <PropertyComparisonFallback />;
  }
  const firstProp = firstProperty;
  const secondProp = secondProperty;

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

            <PropertyComparisonSelectors ids={ids} />
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

export const PropertyComparisonFallback = () => (
  <div className="min-h-96 flex items-center justify-center px-4 text-center text-muted-foreground">
    Data perbandingan properti tidak tersedia. Pilih dua properti tersimpan
    untuk melanjutkan.
  </div>
);
