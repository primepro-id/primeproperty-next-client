"use client";

import { useId, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ExpandableTextProps = {
  text: string;
  className?: string;
};

const COLLAPSE_CHARACTER_THRESHOLD = 360;
const COLLAPSE_LINE_THRESHOLD = 6;

export const ExpandableText = ({ text, className }: ExpandableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const textId = useId();
  const isCollapsible =
    text.length > COLLAPSE_CHARACTER_THRESHOLD ||
    text.split("\n").length > COLLAPSE_LINE_THRESHOLD;

  return (
    <div className="flex flex-col items-start gap-1">
      <p
        id={textId}
        className={cn(
          "whitespace-pre-wrap text-base text-muted-foreground",
          isCollapsible && !isExpanded && "line-clamp-6",
          className,
        )}
      >
        {text}
      </p>
      {isCollapsible && (
        <Button
          type="button"
          variant="link"
          className="h-auto px-0 py-1 text-sm"
          aria-expanded={isExpanded}
          aria-controls={textId}
          onClick={() => setIsExpanded((value) => !value)}
        >
          {isExpanded ? "Tampilkan lebih sedikit" : "Baca selengkapnya"}
          <LuChevronDown
            className={cn("transition-transform", isExpanded && "rotate-180")}
            aria-hidden="true"
          />
        </Button>
      )}
    </div>
  );
};
