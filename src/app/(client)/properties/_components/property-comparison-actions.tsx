"use client";

import { Button } from "@/components/ui/button";
import type { PropertyJoinAgent } from "@/lib/types";
import { LuCircle, LuCircleCheck } from "react-icons/lu";
import { Tooltip } from "react-tooltip";
import { ContactAgentDialog } from "./contact-agent-dialog";

type PropertyComparisonActionsProps = {
  propertyWithAgent: PropertyJoinAgent;
  onCompareClick?: () => void;
  isComparisonActive?: boolean;
  isComparisonDisabled?: boolean;
};

export const PropertyComparisonActions = ({
  propertyWithAgent,
  onCompareClick,
  isComparisonActive,
  isComparisonDisabled,
}: PropertyComparisonActionsProps) => (
  <div className="flex items-center justify-between gap-4 w-full">
    <ContactAgentDialog
      isWhatsapp={true}
      propertyWithAgent={propertyWithAgent}
    />

    <Tooltip id="compare-btn-tooltip" />
    <Button
      data-tooltip-id="compare-btn-tooltip"
      data-tooltip-content={
        isComparisonDisabled ? "2 properti sudah terpilih" : ""
      }
      data-tooltip-place="top"
      variant={
        isComparisonDisabled
          ? "ghost"
          : isComparisonActive
            ? "default"
            : "outline"
      }
      onClick={onCompareClick}
      disabled={isComparisonDisabled}
    >
      {isComparisonActive ? <LuCircleCheck /> : <LuCircle />}
      COMPARE
    </Button>
  </div>
);
